import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { assertGitPreflight, retry } from '../release-git.mjs';
import { publishRelease } from '../release-github.mjs';
import { compareVersions, parseVersion, prepareReleaseMetadata } from '../release-version.mjs';

function metadata() {
  return {
    version: '0.4.0',
    claudePlugin: { name: 'ai-maintenance-skills', version: '0.4.0' },
    codexPlugin: { name: 'ai-maintenance-skills', version: '0.4.0' },
    marketplace: { plugins: [{ name: 'ai-maintenance-skills', version: '0.4.0' }] },
    verifier: "const releaseVersion = '0.4.0';\n",
    changelog: '# 变更记录\n\n## 0.4.0 - 2026-08-06\n\n- Existing release.\n'
  };
}

test('parses and compares strict release versions', () => {
  assert.deepEqual(parseVersion('1.2.3').parts, [1, 2, 3]);
  assert.equal(compareVersions('0.5.0', '0.4.0') > 0, true);
  assert.throws(() => parseVersion('v0.5.0'), /Invalid release version/);
  assert.throws(() => parseVersion('01.2.3'), /Invalid release version/);
});

test('prepares all version metadata and changelog section', () => {
  const updates = prepareReleaseMetadata(metadata(), '0.5.0', 'Improve release flow\nAdd resume support', '2026-08-06');
  assert.match(updates['.claude-plugin/plugin.json'], /"version": "0\.5\.0"/);
  assert.match(updates['.codex-plugin/plugin.json'], /"version": "0\.5\.0"/);
  assert.match(updates['.claude-plugin/marketplace.json'], /"version": "0\.5\.0"/);
  assert.match(updates['scripts/verify-skill-repo.mjs'], /releaseVersion = '0\.5\.0'/);
  assert.match(updates['CHANGELOG.md'], /## 0\.5\.0 - 2026-08-06/);
  assert.match(updates['CHANGELOG.md'], /- Improve release flow\n- Add resume support/);
  assert.throws(() => prepareReleaseMetadata(metadata(), '0.4.0', 'Noop', '2026-08-06'), /newer/);
});

test('rejects unsafe Git release states', () => {
  const base = { clean: true, branch: 'main', expectedBranch: 'main', behind: 0, localTag: false, remoteTag: false };
  assert.doesNotThrow(() => assertGitPreflight(base, { resume: false }));
  assert.throws(() => assertGitPreflight({ ...base, clean: false }, { resume: false }), /Working tree/);
  assert.throws(() => assertGitPreflight({ ...base, branch: 'feature' }, { resume: false }), /must run on main/);
  assert.throws(() => assertGitPreflight({ ...base, localTag: true, remoteTag: true }, { resume: false }), /already exists/);
  assert.doesNotThrow(() => assertGitPreflight({ ...base, localTag: true, remoteTag: true }, { resume: true }));
});

test('retries transient operations with bounded attempts', async () => {
  let attempts = 0;
  const result = await retry(async () => {
    attempts += 1;
    if (attempts < 3) throw new Error('temporary');
    return 'ok';
  }, { retries: 3, delayMs: 0 });
  assert.equal(result, 'ok');
  assert.equal(attempts, 3);
  await assert.rejects(() => retry(() => { throw new Error('permanent'); }, { retries: 2, delayMs: 0 }), /permanent/);
});

test('reconciles an already-created GitHub release without creating another', async () => {
  const calls = [];
  const runner = async (command, args) => {
    calls.push([command, args]);
    return { ok: true, stdout: JSON.stringify({ tagName: 'v0.5.0', url: 'https://example/release' }), stderr: '' };
  };
  const result = await publishRelease(runner, {
    repository: 'owner/repo', tag: 'v0.5.0', title: 'Test', notesFile: 'notes.md', retries: 1, delayMs: 0
  });
  assert.equal(result.created, false);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'gh');
  assert.match(calls[0][1].join(' '), /release view v0\.5\.0/);
});

test('release notes fixture stays isolated from the repository', async () => {
  const root = await mkdtemp(join(tmpdir(), 'release-test-'));
  await mkdir(join(root, 'notes'), { recursive: true });
  const path = join(root, 'notes', 'release.md');
  await writeFile(path, '- test\n', 'utf8');
  assert.equal(await readFile(path, 'utf8'), '- test\n');
});
