import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSkillDocument } from './skill-frontmatter.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const releaseVersion = '0.4.0';
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const required = [
  'README.md',
  'AGENTS.md',
  'ARCHITECTURE.md',
  'BUG_HISTORY.md',
  'AI修Bug提问模板.md',
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  'LICENSE',
  '.gitignore',
  '.github/workflows/verify.yml',
  '.claude-plugin/marketplace.json',
  '.claude-plugin/plugin.json',
  '.codex-plugin/plugin.json',
  'docs/installation.md',
  'evals/prompts.md',
  'evals/rubric.md',
  'examples/minimal-project/AGENTS.md',
  'examples/minimal-project/ARCHITECTURE.md',
  'examples/minimal-project/BUG_HISTORY.md',
  'examples/minimal-project/AI修Bug提问模板.md',
  'skills/ai-project-maintainer/SKILL.md',
  'skills/ai-project-maintainer/references/maintenance-workflow.md',
  'skills/ai-project-maintainer/references/project-record-templates.md',
  'skills/ai-project-bootstrapper/SKILL.md',
  'skills/ai-project-bootstrapper/references/project-docs-template.md',
  'scripts/skill-frontmatter.mjs',
  'scripts/skill-frontmatter.test.mjs',
  'scripts/release.mjs',
  'scripts/release-config.mjs',
  'scripts/release-version.mjs',
  'scripts/release-git.mjs',
  'scripts/release-github.mjs',
  'scripts/release.test.mjs',
  'scripts/INDEX.md'
];

for (const file of required) check(existsSync(join(root, file)), `missing ${file}`);

const skillNames = ['ai-project-maintainer', 'ai-project-bootstrapper'];
const skillDocuments = new Map();
for (const name of skillNames) {
  const skillRoot = join(root, 'skills', name);
  const skillPath = join(skillRoot, 'SKILL.md');
  if (!existsSync(skillPath)) continue;

  const text = readFileSync(skillPath, 'utf8');
  try {
    const document = parseSkillDocument(text);
    skillDocuments.set(name, { ...document, text });
    check(document.metadata.name === name, `${name}: frontmatter name mismatch`);
    check(document.metadata.description.length <= 600, `${name}: description exceeds 600 characters`);
    check(document.body.length <= 14000, `${name}: SKILL.md body exceeds 14000 characters`);
    check(text.split(/\r?\n/).length <= 200, `${name}: SKILL.md exceeds 200 lines`);

    const pointers = [...text.matchAll(/`((?:references\/|\.\.\/)[^`]+\.md)`/g)].map((match) => match[1]);
    for (const pointer of pointers) {
      check(!pointer.startsWith('../'), `${name}: cross-skill reference is not self-contained (${pointer})`);
      check(existsSync(resolve(skillRoot, pointer)), `${name}: missing reference ${pointer}`);
    }
  } catch (error) {
    failures.push(`${name}: invalid frontmatter (${error.message})`);
  }
}

const parseJson = (relativePath) => {
  try {
    return JSON.parse(readFileSync(join(root, relativePath), 'utf8'));
  } catch (error) {
    failures.push(`${relativePath}: invalid JSON (${error.message})`);
    return null;
  }
};

const marketplace = parseJson('.claude-plugin/marketplace.json');
const claudePlugin = parseJson('.claude-plugin/plugin.json');
const codexPlugin = parseJson('.codex-plugin/plugin.json');
for (const [label, plugin] of [['Claude', claudePlugin], ['Codex', codexPlugin]]) {
  if (!plugin) continue;
  check(plugin.name === 'ai-maintenance-skills', `${label} plugin name mismatch`);
  check(plugin.version === releaseVersion, `${label} plugin version mismatch`);
  check(plugin.license === 'Apache-2.0', `${label} plugin license mismatch`);
  check(plugin.skills === './skills/', `${label} plugin skill path mismatch`);
  check(!Object.hasOwn(plugin, 'hooks'), `${label} plugin unsupported hooks field present`);
  check(plugin.interface?.capabilities?.includes('Read'), `${label} plugin Read capability missing`);
  check(plugin.interface?.capabilities?.includes('Write'), `${label} plugin Write capability missing`);
}
if (marketplace) {
  const entry = marketplace.plugins?.find((plugin) => plugin.name === 'ai-maintenance-skills');
  check(entry, 'Claude marketplace plugin entry missing');
  check(entry?.version === releaseVersion, 'Claude marketplace version mismatch');
}

const readme = readFileSync(join(root, 'README.md'), 'utf8');
const installation = readFileSync(join(root, 'docs', 'installation.md'), 'utf8');
check(readme.includes('npx skills add https://github.com/canglei9527/ai-maintenance-skills'), 'README install command missing');
check(readme.includes('skills/ai-project-maintainer/SKILL.md'), 'README canonical skill path missing');
check(installation.includes('--skill ai-project-maintainer'), 'single-skill install guidance missing');
check(installation.includes('npx skills add . --list'), 'local discovery verification missing');

const maintainer = skillDocuments.get('ai-project-maintainer')?.text ?? '';
const bootstrapper = skillDocuments.get('ai-project-bootstrapper')?.text ?? '';
const workflow = readFileSync(join(root, 'skills', 'ai-project-maintainer', 'references', 'maintenance-workflow.md'), 'utf8');
const template = readFileSync(join(root, 'skills', 'ai-project-bootstrapper', 'references', 'project-docs-template.md'), 'utf8');
const evals = readFileSync(join(root, 'evals', 'prompts.md'), 'utf8');

check(maintainer.includes('project evidence') && maintainer.includes('target_anchor'), 'maintainer routing boundary missing');
check(maintainer.includes('50 search hits') && maintainer.includes('12 candidate files') && maintainer.includes('one dependency hop'), 'maintainer search limits missing');
check(maintainer.includes('ai-context/INDEX.md') && maintainer.includes('architecture topic') && maintainer.includes('ai-context/bugs/'), 'maintainer topic-index workflow missing');
check(maintainer.includes('references/maintenance-workflow.md') && maintainer.includes('approval, baseline, and recovery gates'), 'maintainer conditional workflow pointer missing');
check(workflow.includes('导入项目整理') && workflow.includes('没有明确同意就不整理') && workflow.includes('整理前基线'), 'imported-project workflow missing');
check(bootstrapper.includes('dedicated project root') && bootstrapper.includes('no existing-project evidence'), 'bootstrapper routing/root boundary missing');
check(bootstrapper.includes('ai-context/INDEX.md') && bootstrapper.includes('architecture/*.md') && bootstrapper.includes('bugs/INDEX.md') && bootstrapper.includes('operations/verification.md'), 'bootstrapper lightweight context indexes missing');
check(bootstrapper.includes('references/project-docs-template.md') && !bootstrapper.includes('../ai-project-maintainer'), 'bootstrapper self-contained template pointer missing');
check(template.includes('ai-context/') && template.includes('FUNCTION_INDEX.md'), 'bootstrapper project records missing');
check(evals.includes('独立程序需求的分流') && evals.includes('现有项目证据的维护分流') && evals.includes('意图不明确时只问一次'), 'routing evaluation prompts missing');
check((evals.match(/是否先读取项目规则和最小直接上下文。/g) ?? []).length === 1, 'evaluation checklist is duplicated');

const forbiddenDirectories = new Set(['.zcode', 'node_modules', 'dist', 'build']);
const walk = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    if (forbiddenDirectories.has(entry.name)) {
      failures.push(`forbidden directory present: ${relative(root, join(directory, entry.name))}`);
      continue;
    }
    if (entry.isDirectory()) walk(join(directory, entry.name));
  }
};
walk(root);

check(!existsSync(join(root, '.agents', 'skills')), 'legacy .agents/skills directory must not be published');
check(!existsSync(join(root, 'src')), 'application source directory must not be included');
check(!existsSync(join(root, 'assets')), 'application assets directory must not be included');
check(!existsSync(join(root, 'vendor')), 'application vendor directory must not be included');
check(statSync(join(root, 'LICENSE')).size > 1000, 'LICENSE is unexpectedly small');

if (failures.length) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('PASS AI maintenance skills repository verification');
  console.log(`PASS ${skillNames.length} Skills with strict frontmatter and self-contained references`);
  console.log('PASS runtime context budgets: description <= 600 chars, body <= 14000 chars, SKILL.md <= 200 lines');
  console.log(`PASS ${required.length} required repository files and plugin version ${releaseVersion}`);
  console.log('PASS references, examples, license, and repository boundaries checked');
}
