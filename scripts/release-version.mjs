import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RELEASE_FILES } from './release-config.mjs';

const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const VERSION_PATTERN = /const releaseVersion = '([^']+)';/;

export function parseVersion(value) {
  const match = SEMVER.exec(value ?? '');
  if (!match) throw new Error(`Invalid release version: ${value}`);
  return { raw: value, parts: match.slice(1).map(Number) };
}

export function compareVersions(left, right) {
  const leftParts = parseVersion(left).parts;
  const rightParts = parseVersion(right).parts;
  for (let index = 0; index < leftParts.length; index += 1) {
    if (leftParts[index] !== rightParts[index]) return leftParts[index] - rightParts[index];
  }
  return 0;
}

function changelogHeading(version) {
  return new RegExp(`^## ${version.replaceAll('.', '\\.')} - `, 'm');
}

function bulletList(notes) {
  const lines = notes.trim().split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) throw new Error('Release notes are required');
  return lines.map((line) => line.startsWith('- ') ? line : `- ${line}`).join('\n');
}

async function readJson(root, relativePath) {
  return JSON.parse(await readFile(join(root, relativePath), 'utf8'));
}

export async function readReleaseMetadata(root) {
  const [claudePlugin, codexPlugin, marketplace, verifier, changelog] = await Promise.all([
    readJson(root, RELEASE_FILES.claudePlugin),
    readJson(root, RELEASE_FILES.codexPlugin),
    readJson(root, RELEASE_FILES.marketplace),
    readFile(join(root, RELEASE_FILES.verifier), 'utf8'),
    readFile(join(root, RELEASE_FILES.changelog), 'utf8')
  ]);
  const verifierMatch = VERSION_PATTERN.exec(verifier);
  const marketplaceVersion = marketplace.plugins?.find(
    (plugin) => plugin.name === 'ai-maintenance-skills'
  )?.version;
  const versions = [claudePlugin.version, codexPlugin.version, marketplaceVersion, verifierMatch?.[1]];
  if (versions.some((version) => !version)) throw new Error('Release version metadata is incomplete');
  if (new Set(versions).size !== 1) throw new Error(`Release version metadata disagrees: ${versions.join(', ')}`);
  return { version: versions[0], claudePlugin, codexPlugin, marketplace, verifier, changelog };
}

export function prepareReleaseMetadata(metadata, version, notes, date) {
  parseVersion(version);
  if (compareVersions(version, metadata.version) <= 0) {
    throw new Error(`Release version ${version} must be newer than ${metadata.version}`);
  }
  if (changelogHeading(version).test(metadata.changelog)) {
    throw new Error(`CHANGELOG already contains version ${version}`);
  }
  const marketplace = structuredClone(metadata.marketplace);
  const entry = marketplace.plugins.find((plugin) => plugin.name === 'ai-maintenance-skills');
  entry.version = version;
  const verifier = metadata.verifier.replace(VERSION_PATTERN, `const releaseVersion = '${version}';`);
  if (verifier === metadata.verifier) throw new Error('Verifier version constant was not found');
  const section = `## ${version} - ${date}\n\n${bulletList(notes)}\n\n`;
  return {
    [RELEASE_FILES.claudePlugin]: `${JSON.stringify({ ...metadata.claudePlugin, version }, null, 2)}\n`,
    [RELEASE_FILES.codexPlugin]: `${JSON.stringify({ ...metadata.codexPlugin, version }, null, 2)}\n`,
    [RELEASE_FILES.marketplace]: `${JSON.stringify(marketplace, null, 2)}\n`,
    [RELEASE_FILES.verifier]: verifier,
    [RELEASE_FILES.changelog]: metadata.changelog.replace(/^# 变更记录\r?\n\r?\n/, `# 变更记录\n\n${section}`)
  };
}

export async function applyReleaseMetadata(root, updates) {
  await Promise.all(Object.entries(updates).map(([relativePath, content]) =>
    writeFile(join(root, relativePath), content, 'utf8')
  ));
}
