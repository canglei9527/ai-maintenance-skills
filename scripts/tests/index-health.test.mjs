import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { inspectIndex } from '../index-health.mjs';

const cliPath = resolve(import.meta.dirname, '..', 'index-health.mjs');

const fixture = ({ reviewedCommit = 'abc1234', entry = 'src/app.js', testPath = 'tests/app.test.js' } = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'index-health-'));
  mkdirSync(join(root, 'ai-context'), { recursive: true });
  mkdirSync(join(root, 'src'), { recursive: true });
  mkdirSync(join(root, 'tests'), { recursive: true });
  writeFileSync(join(root, 'src', 'app.js'), 'export const app = true;\n');
  writeFileSync(join(root, 'tests', 'app.test.js'), 'test("app", () => {});\n');
  writeFileSync(join(root, 'ai-context', 'INDEX.md'), [
    '<!-- ai-context-format: 1 -->',
    `<!-- reviewed-commit: ${reviewedCommit} -->`,
    '',
    '| Task | First file | Focused test |',
    '|---|---|---|',
    `| Fix startup | \`${entry}\` | \`${testPath}\` |`,
    ''
  ].join('\n'));
  return root;
};

test('reports valid local index references', () => {
  const result = inspectIndex(fixture(), { currentCommit: 'abc1234' });

  assert.deepEqual(result.statuses, ['VALID']);
  assert.equal(result.references.length, 2);
});

test('reports unresolved local index references without rewriting them', () => {
  const result = inspectIndex(fixture({ entry: 'src/missing.js' }), { currentCommit: 'abc1234' });

  assert.deepEqual(result.statuses, ['UNRESOLVED']);
  assert.deepEqual(result.unresolved, ['src/missing.js']);
});

test('rejects same-prefix sibling references that escape the project root', () => {
  const root = fixture();
  const siblingName = `${root.split(/[\\/]/).at(-1)}-copy`;
  const sibling = join(root, '..', siblingName);
  mkdirSync(sibling, { recursive: true });
  writeFileSync(join(sibling, 'outside.js'), 'export const outside = true;\n');
  writeFileSync(join(root, 'ai-context', 'INDEX.md'), [
    '| Task | First file |',
    '|---|---|',
    `| Escape | \`../${siblingName}/outside.js\` |`,
    ''
  ].join('\n'));

  const result = inspectIndex(root, { currentCommit: 'abc1234' });

  assert.deepEqual(result.statuses, ['UNRESOLVED']);
  assert.deepEqual(result.unresolved, [`../${siblingName}/outside.js`]);
});

test('reports POSIX absolute filesystem paths as unresolved references', () => {
  const root = fixture({ entry: '/tmp/outside.js' });
  const result = inspectIndex(root, { currentCommit: 'abc1234' });

  assert.deepEqual(result.statuses, ['UNRESOLVED']);
  assert.deepEqual(result.unresolved, ['/tmp/outside.js']);
});

test('reports Windows absolute filesystem paths as unresolved references', () => {
  const root = fixture({ entry: 'C:/outside/project.js' });
  const result = inspectIndex(root, { currentCommit: 'abc1234' });

  assert.deepEqual(result.statuses, ['UNRESOLVED']);
  assert.deepEqual(result.unresolved, ['C:/outside/project.js']);
});

test('rejects references that escape through a symbolic link', (t) => {
  const root = fixture({ entry: 'linked/outside.js' });
  const outside = mkdtempSync(join(tmpdir(), 'index-health-outside-'));
  writeFileSync(join(outside, 'outside.js'), 'export const outside = true;\n');

  try {
    symlinkSync(outside, join(root, 'linked'), process.platform === 'win32' ? 'junction' : 'dir');
  } catch (error) {
    if (error.code === 'EPERM' || error.code === 'EACCES') {
      t.skip(`symbolic links unavailable: ${error.code}`);
      return;
    }
    throw error;
  }

  const result = inspectIndex(root, { currentCommit: 'abc1234' });

  assert.deepEqual(result.statuses, ['UNRESOLVED']);
  assert.deepEqual(result.unresolved, ['linked/outside.js']);
});

test('rejects an ai-context directory linked outside the project without reading it', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'index-health-root-'));
  const outside = mkdtempSync(join(tmpdir(), 'index-health-indexes-'));
  writeFileSync(join(outside, 'INDEX.md'), [
    '| Task | First file |',
    '|---|---|',
    '| External | `outside-secret.md` |',
    ''
  ].join('\n'));

  try {
    symlinkSync(outside, join(root, 'ai-context'), process.platform === 'win32' ? 'junction' : 'dir');
  } catch (error) {
    if (error.code === 'EPERM' || error.code === 'EACCES') {
      t.skip(`symbolic links unavailable: ${error.code}`);
      return;
    }
    throw error;
  }

  const result = inspectIndex(root, { currentCommit: null });

  assert.deepEqual(result.statuses, ['UNRESOLVED']);
  assert.deepEqual(result.indexes, []);
  assert.deepEqual(result.unresolved, ['ai-context']);
});

test('extracts project paths from focused test commands', () => {
  const root = fixture({ testPath: 'node --test tests/app.test.js' });
  const result = inspectIndex(root, { currentCommit: 'abc1234' });

  assert.deepEqual(result.statuses, ['VALID']);
  assert.deepEqual(result.references.map(({ target }) => target), ['src/app.js', 'tests/app.test.js']);
});

test('checks direct paths containing spaces as a single reference', () => {
  const root = fixture({ entry: 'docs/My File.md' });
  mkdirSync(join(root, 'docs'), { recursive: true });
  writeFileSync(join(root, 'docs', 'My File.md'), '# Documentation\n');

  const validResult = inspectIndex(root, { currentCommit: 'abc1234' });
  assert.deepEqual(validResult.statuses, ['VALID']);
  assert.equal(validResult.references[0].target, 'docs/My File.md');

  writeFileSync(join(root, 'ai-context', 'INDEX.md'), [
    '| Task | First file |',
    '|---|---|',
    '| Docs | `docs/Missing File.md` |',
    ''
  ].join('\n'));
  const missingResult = inspectIndex(root, { currentCommit: 'abc1234' });

  assert.deepEqual(missingResult.statuses, ['UNRESOLVED']);
  assert.deepEqual(missingResult.unresolved, ['docs/Missing File.md']);
});

test('extracts quoted paths containing spaces from commands', () => {
  const root = fixture({ testPath: 'node --test "tests/My Test.js"' });
  writeFileSync(join(root, 'tests', 'My Test.js'), 'test("app", () => {});\n');
  const result = inspectIndex(root, { currentCommit: 'abc1234' });

  assert.deepEqual(result.statuses, ['VALID']);
  assert.deepEqual(result.references.map(({ target }) => target), ['src/app.js', 'tests/My Test.js']);
});

test('checks conventional extensionless project files', () => {
  const root = fixture({ entry: 'Dockerfile' });
  writeFileSync(join(root, 'Dockerfile'), 'FROM scratch\n');

  const validResult = inspectIndex(root, { currentCommit: 'abc1234' });
  assert.deepEqual(validResult.statuses, ['VALID']);

  writeFileSync(join(root, 'ai-context', 'INDEX.md'), [
    '| Task | First file |',
    '|---|---|',
    '| Build | `Makefile` |',
    ''
  ].join('\n'));
  const missingResult = inspectIndex(root, { currentCommit: 'abc1234' });

  assert.deepEqual(missingResult.statuses, ['UNRESOLVED']);
  assert.deepEqual(missingResult.unresolved, ['Makefile']);
});

test('reports stale review metadata independently from reference health', () => {
  const result = inspectIndex(fixture(), { currentCommit: 'def5678' });

  assert.deepEqual(result.statuses, ['STALE_REVIEW']);
  assert.equal(result.reviewedCommit, 'abc1234');
});

test('accepts a full reviewed commit matching the current commit', () => {
  const commit = '0123456789abcdef0123456789abcdef01234567';
  const result = inspectIndex(fixture({ reviewedCommit: commit }), { currentCommit: commit });

  assert.deepEqual(result.statuses, ['VALID']);
});

test('accepts an abbreviated reviewed commit matching the current commit', () => {
  const result = inspectIndex(fixture({ reviewedCommit: '0123456' }), {
    currentCommit: '0123456789abcdef0123456789abcdef01234567'
  });

  assert.deepEqual(result.statuses, ['VALID']);
});

test('matches reviewed commit prefixes case-insensitively', () => {
  const result = inspectIndex(fixture({ reviewedCommit: 'ABCDEF0' }), {
    currentCommit: 'abcdef0123456789abcdef0123456789abcdef01'
  });

  assert.deepEqual(result.statuses, ['VALID']);
});

test('reports a different valid reviewed commit as stale', () => {
  const result = inspectIndex(fixture({ reviewedCommit: 'fedcba9' }), {
    currentCommit: '0123456789abcdef0123456789abcdef01234567'
  });

  assert.deepEqual(result.statuses, ['STALE_REVIEW']);
});

test('reports invalid reviewed commit metadata as stale', () => {
  const result = inspectIndex(fixture({ reviewedCommit: 'not-a-sha' }), {
    currentCommit: '0123456789abcdef0123456789abcdef01234567'
  });

  assert.deepEqual(result.statuses, ['STALE_REVIEW']);
});

test('reports invalid reviewed commit metadata as stale without Git metadata', () => {
  const result = inspectIndex(fixture({ reviewedCommit: 'not-a-sha' }), {
    currentCommit: null
  });

  assert.deepEqual(result.statuses, ['STALE_REVIEW']);
});

test('reports old reviewed dates as stale without blocking valid references', () => {
  const root = fixture();
  writeFileSync(join(root, 'ai-context', 'INDEX.md'), [
    '<!-- ai-context-format: 1 -->',
    '<!-- reviewed-date: 2026-01-01 -->',
    '',
    '| Task | First file |',
    '|---|---|',
    '| Fix startup | `src/app.js` |',
    ''
  ].join('\n'));

  const result = inspectIndex(root, {
    currentDate: new Date('2026-08-27T00:00:00Z'),
    maxReviewAgeDays: 90
  });

  assert.deepEqual(result.statuses, ['STALE_REVIEW']);
  assert.equal(result.reviewedDate, '2026-01-01');
});

test('keeps legacy indexes compatible when review metadata is absent', () => {
  const root = fixture();
  writeFileSync(join(root, 'ai-context', 'INDEX.md'), [
    '# Index',
    '',
    '| Task | First file |',
    '|---|---|',
    '| Fix startup | `src/app.js` |',
    ''
  ].join('\n'));

  const result = inspectIndex(root, { currentCommit: 'def5678' });

  assert.deepEqual(result.statuses, ['VALID']);
  assert.equal(result.reviewedCommit, null);
});

const runCli = (root) => spawnSync(process.execPath, [cliPath, root], {
  encoding: 'utf8'
});

test('CLI exits 1 and emits JSON for unresolved references', () => {
  const processResult = runCli(fixture({ entry: 'src/missing.js', reviewedCommit: '' }));

  assert.equal(processResult.status, 1, processResult.stderr);
  assert.deepEqual(JSON.parse(processResult.stdout).statuses, ['UNRESOLVED']);
});

test('CLI exits 0 for stale-review-only indexes', () => {
  const root = fixture({ reviewedCommit: '' });
  writeFileSync(join(root, 'ai-context', 'INDEX.md'), [
    '<!-- ai-context-format: 1 -->',
    '<!-- reviewed-date: 2020-01-01 -->',
    '',
    '| Task | First file |',
    '|---|---|',
    '| Fix startup | `src/app.js` |',
    ''
  ].join('\n'));

  const processResult = runCli(root);

  assert.equal(processResult.status, 0, processResult.stderr);
  assert.deepEqual(JSON.parse(processResult.stdout).statuses, ['STALE_REVIEW']);
});

test('CLI exits 0 for valid and legacy indexes', () => {
  const validRoot = fixture({ reviewedCommit: '' });
  const legacyRoot = fixture({ reviewedCommit: '' });
  writeFileSync(join(legacyRoot, 'ai-context', 'INDEX.md'), [
    '# Index',
    '',
    '| Task | First file |',
    '|---|---|',
    '| Fix startup | `src/app.js` |',
    ''
  ].join('\n'));

  for (const root of [validRoot, legacyRoot]) {
    const processResult = runCli(root);
    assert.equal(processResult.status, 0, processResult.stderr);
    assert.deepEqual(JSON.parse(processResult.stdout).statuses, ['VALID']);
  }
});
