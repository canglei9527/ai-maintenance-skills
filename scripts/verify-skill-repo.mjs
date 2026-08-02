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
