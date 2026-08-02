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
  check(plugin.version === '0.2.5', `${label} plugin version mismatch`);
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

const maintainer = readFileSync(join(root, '.agents', 'skills', 'ai-project-maintainer', 'SKILL.md'), 'utf8');
const workflow = readFileSync(join(root, '.agents', 'skills', 'ai-project-maintainer', 'references', 'maintenance-workflow.md'), 'utf8');
const evals = readFileSync(join(root, 'evals', 'prompts.md'), 'utf8');
check(maintainer.includes('explicit consent') && maintainer.includes('pre-organization baseline') && maintainer.includes('post-organization verification fails'), 'imported project consent/baseline/recovery rules missing');
check(workflow.includes('导入项目整理') && workflow.includes('没有明确同意就不整理') && workflow.includes('整理前基线'), 'imported project workflow reference missing');
check(evals.includes('导入已有项目但未同意整理') && evals.includes('同意整理导入项目') && evals.includes('整理后验证失败'), 'imported project evaluation prompts missing');
const bootstrapperSkill = readFileSync(join(root, '.agents', 'skills', 'ai-project-bootstrapper', 'SKILL.md'), 'utf8');
check(maintainer.includes('existing-project evidence') && maintainer.includes('Do not scan the current workspace'), 'maintainer routing boundary missing');
check(maintainer.includes('Read boundary and context stages') && maintainer.includes('ai-context/ARCHITECTURE.md') && maintainer.includes('Do not open every module or function'), 'maintainer staged read boundary missing');
check(maintainer.includes('Default maximum: 50 search hits, 12 candidate files opened') && maintainer.includes('one call/dependency hop'), 'maintainer search limits missing');
check(maintainer.includes('Full-project scanning is reserved for an explicit repository audit'), 'maintainer expansion gate missing');
check(workflow.includes('两阶段读取协议') && workflow.includes('搜索闸门') && workflow.includes('扩大范围条件') && workflow.includes('架构记录是定位工作的索引'), 'maintenance workflow read boundary missing');
check(bootstrapperSkill.includes('standalone service') && bootstrapperSkill.includes('current workspace may contain unrelated projects'), 'bootstrapper standalone routing boundary missing');
check(bootstrapperSkill.includes('Read boundary for new projects') && bootstrapperSkill.includes('ai-context/ARCHITECTURE.md') && bootstrapperSkill.includes('cap a search at 50 hits'), 'bootstrapper staged read boundary missing');
const bootstrapperTemplate = readFileSync(join(root, '.agents', 'skills', 'ai-project-bootstrapper', 'references', 'project-docs-template.md'), 'utf8');
check(bootstrapperTemplate.includes('ai-context/') && bootstrapperTemplate.includes('FUNCTION_INDEX.md') && bootstrapperTemplate.includes('不能作为打开全部模块的理由'), 'bootstrapper context template missing');
check(evals.includes('独立程序需求的分流') && evals.includes('现有项目证据的维护分流') && evals.includes('意图不明确时只问一次'), 'task routing evaluation prompts missing');

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
