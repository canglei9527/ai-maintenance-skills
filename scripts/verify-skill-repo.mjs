import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
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
  '.agents/skills/ai-project-maintainer/SKILL.md',
  '.agents/skills/ai-project-maintainer/references/maintenance-workflow.md',
  '.agents/skills/ai-project-maintainer/references/project-record-templates.md',
  '.agents/skills/ai-project-bootstrapper/SKILL.md',
  '.agents/skills/ai-project-bootstrapper/references/project-docs-template.md'
];

for (const file of required) check(existsSync(join(root, file)), `missing ${file}`);

const skills = ['ai-project-maintainer', 'ai-project-bootstrapper'];
for (const name of skills) {
  const skillPath = join(root, '.agents', 'skills', name, 'SKILL.md');
  if (!existsSync(skillPath)) continue;
  const text = readFileSync(skillPath, 'utf8');
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/);
  check(frontmatter, `${name}: YAML frontmatter missing`);
  if (!frontmatter) continue;
  const body = frontmatter[1];
  check(new RegExp(`^name: ${name}$`, 'm').test(body), `${name}: frontmatter name mismatch`);
  check(/^description: .+/m.test(body), `${name}: description missing`);
  check(text.split(/\r?\n/).length <= 500, `${name}: SKILL.md exceeds 500 lines`);
}

const references = [
  '.agents/skills/ai-project-maintainer/references/maintenance-workflow.md',
  '.agents/skills/ai-project-maintainer/references/project-record-templates.md',
  '.agents/skills/ai-project-bootstrapper/references/project-docs-template.md'
];
for (const file of references) check(existsSync(join(root, file)), `missing reference ${file}`);

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
  check(plugin.version === '0.2.2', `${label} plugin version mismatch`);
  check(plugin.license === 'Apache-2.0', `${label} plugin license mismatch`);
  check(plugin.skills === './.agents/skills/', `${label} plugin skill path mismatch`);
  check(plugin.interface?.capabilities?.includes('Read'), `${label} plugin Read capability missing`);
  check(plugin.interface?.capabilities?.includes('Write'), `${label} plugin Write capability missing`);
}
if (marketplace) {
  check(marketplace.plugins?.some((plugin) => plugin.name === 'ai-maintenance-skills'), 'Claude marketplace plugin entry missing');
}
const readme = readFileSync(join(root, 'README.md'), 'utf8');
check(readme.includes('npx skills add https://github.com/canglei9527/ai-maintenance-skills'), 'README recommended install command missing');
check(readme.includes('模板') && (readme.includes('不是每次') || readme.includes('不是日常')), 'README optional template guidance missing');
check(existsSync(join(root, 'docs', 'installation.md')), 'installation guide missing');

const bootstrapper = readFileSync(join(root, '.agents', 'skills', 'ai-project-bootstrapper', 'SKILL.md'), 'utf8');
const bootstrapTemplate = readFileSync(join(root, '.agents', 'skills', 'ai-project-bootstrapper', 'references', 'project-docs-template.md'), 'utf8');
check(bootstrapper.includes('dedicated project root') && bootstrapper.includes('do not scatter new files'), 'bootstrapper project root isolation rule missing');
check(bootstrapTemplate.includes('Project root') && bootstrapTemplate.includes('不要把新项目文件直接散落'), 'bootstrapper project root template missing');

const forbiddenDirectories = new Set(['.zcode', 'node_modules', 'dist', 'build']);
const walk = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (forbiddenDirectories.has(entry.name)) {
      failures.push(`forbidden directory present: ${relative(root, join(directory, entry.name))}`);
      continue;
    }
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
  }
};
walk(root);

check(!existsSync(join(root, 'src')), 'application source directory must not be included');
check(!existsSync(join(root, 'assets')), 'application assets directory must not be included');
check(!existsSync(join(root, 'vendor')), 'application vendor directory must not be included');
check(statSync(join(root, 'LICENSE')).size > 1000, 'LICENSE is unexpectedly small');

if (failures.length) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('PASS AI maintenance skills repository verification');
  console.log(`PASS ${skills.length} Skills with valid frontmatter`);
  console.log(`PASS ${required.length} required repository files present`);
  console.log('PASS references, examples, license, and repository boundaries checked');
}
