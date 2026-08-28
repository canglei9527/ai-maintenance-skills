import { existsSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const metadataValue = (text, key) =>
  text.match(new RegExp(`<!--\\s*${key}:\\s*([^>]+?)\\s*-->`, 'i'))?.[1].trim() ?? null;

const isWindowsAbsolute = (value) => /^[a-z]:[\\/]/i.test(value) || /^\\\\/.test(value);

const extensionlessProjectFiles = new Set([
  'Dockerfile',
  'Makefile',
  'Procfile',
  'Gemfile',
  'Rakefile',
  'Vagrantfile'
]);

const looksLikeLocalPath = (value) => {
  if (!value || /^[a-z]+:\/\//i.test(value)) return false;
  return isAbsolute(value) || isWindowsAbsolute(value) ||
    value.includes('/') || value.includes('\\') ||
    /\.[a-z0-9][a-z0-9_-]*$/i.test(value) || extensionlessProjectFiles.has(value);
};

const isInsideOrEqualRoot = (root, target) => {
  const relativeTarget = relative(root, target);
  return relativeTarget === '' || (!relativeTarget.startsWith('..') && !isAbsolute(relativeTarget));
};

const markdownFiles = (directory, projectRoot) => {
  if (!existsSync(directory)) return { files: [], escaped: false };
  if (!isInsideOrEqualRoot(realpathSync.native(projectRoot), realpathSync.native(directory))) {
    return { files: [], escaped: true };
  }

  const files = [];
  let escaped = false;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      const nested = markdownFiles(path, projectRoot);
      files.push(...nested.files);
      escaped ||= nested.escaped;
    } else if (entry.isFile() && entry.name === 'INDEX.md') {
      if (isInsideOrEqualRoot(realpathSync.native(projectRoot), realpathSync.native(path))) files.push(path);
      else escaped = true;
    }
  }
  return { files, escaped };
};

const commandTokens = (value) => [...value.matchAll(/"([^"]+)"|'([^']+)'|([^\s]+)/g)]
  .map((match) => match[1] ?? match[2] ?? match[3])
  .map((token) => token.replace(/[",;:)]+$/g, ''));

const extractPathTokens = (value) => {
  const directPath = value.includes(' ') && looksLikeLocalPath(value.split(/\s/, 1)[0]);
  if (directPath && !/^[a-z0-9_-]+\s+-/i.test(value)) return [value];
  return commandTokens(value).filter(looksLikeLocalPath);
};

const extractReferences = (text) => {
  const references = new Set();
  for (const line of text.split(/\r?\n/)) {
    if (!line.trimStart().startsWith('|')) continue;
    for (const match of line.matchAll(/`([^`]+)`/g)) {
      for (const value of extractPathTokens(match[1].trim())) {
        references.add(value.replaceAll('\\', '/'));
      }
    }
  }
  return [...references];
};

const gitCommit = (root) => {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return null;
  }
};

const matchingCommit = (reviewedCommit, currentCommit) => {
  const sha = /^[0-9a-f]{7,40}$/i;
  if (!sha.test(reviewedCommit) || !sha.test(currentCommit)) return false;
  const reviewed = reviewedCommit.toLowerCase();
  const current = currentCommit.toLowerCase();
  return reviewed.startsWith(current) || current.startsWith(reviewed);
};

const isInsideRoot = (root, target) => {
  const relativeTarget = relative(root, target);
  return relativeTarget !== '' && !relativeTarget.startsWith('..') && !isAbsolute(relativeTarget);
};

const validProjectTarget = (root, target) => {
  if (isAbsolute(target) || isWindowsAbsolute(target)) return false;
  const resolvedTarget = resolve(root, target);
  if (!isInsideRoot(root, resolvedTarget) || !existsSync(resolvedTarget)) return false;
  return isInsideRoot(realpathSync.native(root), realpathSync.native(resolvedTarget));
};

export const inspectIndex = (projectRoot, options = {}) => {
  const root = resolve(projectRoot);
  const aiContext = join(root, 'ai-context');
  const discovery = markdownFiles(aiContext, root);
  const indexes = discovery.files;
  const currentCommit = options.currentCommit ?? gitCommit(root);
  const currentDate = options.currentDate ?? new Date();
  const maxReviewAgeDays = options.maxReviewAgeDays ?? 90;
  const references = [];
  const unresolved = [];
  let reviewedCommit = null;
  let reviewedDate = null;
  let formatVersion = null;
  let staleReview = false;

  if (discovery.escaped) {
    unresolved.push('ai-context');
  }

  for (const indexPath of indexes) {
    const text = readFileSync(indexPath, 'utf8');
    const indexReviewedCommit = metadataValue(text, 'reviewed-commit');
    const indexReviewedDate = metadataValue(text, 'reviewed-date');
    const indexFormatVersion = metadataValue(text, 'ai-context-format');
    reviewedCommit ??= indexReviewedCommit;
    reviewedDate ??= indexReviewedDate;
    formatVersion ??= indexFormatVersion;

    if (indexReviewedCommit) {
      const sha = /^[0-9a-f]{7,40}$/i;
      if (!sha.test(indexReviewedCommit)) {
        staleReview = true;
      } else if (currentCommit && !matchingCommit(indexReviewedCommit, currentCommit)) {
        staleReview = true;
      }
    }

    if (indexReviewedDate) {
      const parsedDate = new Date(`${indexReviewedDate}T00:00:00Z`);
      const ageDays = (currentDate.getTime() - parsedDate.getTime()) / 86_400_000;
      if (!Number.isNaN(ageDays) && ageDays > maxReviewAgeDays) staleReview = true;
    }

    for (const target of extractReferences(text)) {
      const entry = {
        index: relative(root, indexPath).replaceAll('\\', '/'),
        target,
        exists: validProjectTarget(root, target)
      };
      references.push(entry);
      if (!entry.exists) unresolved.push(target);
    }
  }

  const statuses = [];
  if (unresolved.length) statuses.push('UNRESOLVED');
  if (staleReview) statuses.push('STALE_REVIEW');
  if (!statuses.length) statuses.push('VALID');

  return {
    projectRoot: root,
    indexes: indexes.map((path) => relative(root, path).replaceAll('\\', '/')),
    formatVersion,
    reviewedCommit,
    reviewedDate,
    currentCommit,
    references,
    unresolved: [...new Set(unresolved)],
    statuses
  };
};

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const root = process.argv[2] ? resolve(process.argv[2]) : process.cwd();
  const result = inspectIndex(root);
  console.log(JSON.stringify(result, null, 2));
  if (result.statuses.includes('UNRESOLVED')) process.exitCode = 1;
}
