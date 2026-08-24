import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSkillDocument } from './skill-frontmatter.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const releaseVersion = '0.4.6';
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
  'skills/ai-project-maintainer/references/fast-path.md',
  'skills/ai-project-maintainer/references/structural-change.md',
  'skills/ai-project-maintainer/references/verification-and-safety.md',
  'skills/ai-project-maintainer/references/v2-migration-notes.md',
  'skills/ai-project-bootstrapper/SKILL.md',
  'skills/ai-project-bootstrapper/references/workflow.md',
  'skills/ai-project-bootstrapper/references/navigation-and-budgets.md',
  'skills/ai-project-bootstrapper/references/verification-and-exceptions.md',
  'scripts/skill-frontmatter.mjs',
  'scripts/tests/skill-frontmatter.test.mjs',
  'scripts/release.mjs',
  'scripts/release-config.mjs',
  'scripts/release-version.mjs',
  'scripts/release-git.mjs',
  'scripts/release-github.mjs',
  'scripts/tests/release.test.mjs',
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

    const pointers = [...text.matchAll(/\]\((references\/[^)]+)\)/g)].map((match) => match[1]);
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
const fastPath = readFileSync(join(root, 'skills', 'ai-project-maintainer', 'references', 'fast-path.md'), 'utf8');
const structuralChange = readFileSync(join(root, 'skills', 'ai-project-maintainer', 'references', 'structural-change.md'), 'utf8');
const maintainerSafety = readFileSync(join(root, 'skills', 'ai-project-maintainer', 'references', 'verification-and-safety.md'), 'utf8');
const bootstrapWorkflow = readFileSync(join(root, 'skills', 'ai-project-bootstrapper', 'references', 'workflow.md'), 'utf8');
const navigation = readFileSync(join(root, 'skills', 'ai-project-bootstrapper', 'references', 'navigation-and-budgets.md'), 'utf8');
const bootstrapExceptions = readFileSync(join(root, 'skills', 'ai-project-bootstrapper', 'references', 'verification-and-exceptions.md'), 'utf8');
const evals = readFileSync(join(root, 'evals', 'prompts.md'), 'utf8');

check(maintainer.includes('READ_ONLY') && maintainer.includes('NORMAL_CHANGE') && maintainer.includes('STRUCTURAL_CHANGE'), 'maintainer operation paths missing');
check(maintainer.includes('EXTERNAL_ACTION') && maintainer.includes('does not authorize writing'), 'maintainer authorization boundary missing');
check(maintainer.includes('fast-path.md') && maintainer.includes('structural-change.md') && maintainer.includes('verification-and-safety.md'), 'maintainer direct reference routing missing');
check(fastPath.includes('50 search hits') && fastPath.includes('12 candidate files') && fastPath.includes('one dependency hop'), 'maintainer search limits missing');
check(fastPath.includes('A 900-line target does not require a prior refactor'), 'large-file normal-change rule missing');
check(structuralChange.includes('Migration Table') && structuralChange.includes('old implementation is deleted'), 'structural migration ownership rule missing');
check(maintainerSafety.includes('Do not choose a license') && maintainerSafety.includes('NOT_RUN'), 'maintainer safety and verification status rules missing');
check(bootstrapper.includes('new or empty project directory') && bootstrapper.includes('existing implementation must be changed'), 'bootstrapper routing/root boundary missing');
check(bootstrapper.includes('MICRO') && bootstrapper.includes('STANDARD') && bootstrapper.includes('DURABLE'), 'bootstrapper tier routing missing');
check(bootstrapper.includes('workflow.md') && bootstrapper.includes('navigation-and-budgets.md') && bootstrapper.includes('verification-and-exceptions.md'), 'bootstrapper direct reference routing missing');
check(bootstrapWorkflow.includes('Do not create `AGENTS.md`') && bootstrapWorkflow.includes('Keep a requested single-file tool single-file'), 'MICRO workflow guard missing');
check(navigation.includes('review thresholds') && navigation.includes('Strict budgets are acceptance gates'), 'budget review and strict-gate distinction missing');
check(bootstrapExceptions.includes('NOT_AVAILABLE'), 'bootstrapper exception and real-time verification rules missing');
check(evals.includes('独立程序需求的分流') && evals.includes('现有项目证据的维护分流') && evals.includes('意图不明确时只问一次'), 'routing evaluation prompts missing');

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
