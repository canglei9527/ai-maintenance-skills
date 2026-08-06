import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { DEFAULT_RETRIES, DEFAULT_RETRY_DELAY_MS, RELEASE_FILES } from './release-config.mjs';

const execFile = promisify(execFileCallback);
const RELEASE_FILES_SET = new Set(Object.values(RELEASE_FILES));

export function createRunner(cwd) {
  return async (command, args, options = {}) => {
    try {
      const result = await execFile(command, args, {
        cwd,
        encoding: 'utf8',
        maxBuffer: 1024 * 1024,
        ...options
      });
      return { ok: true, stdout: result.stdout.trim(), stderr: result.stderr.trim() };
    } catch (error) {
      return {
        ok: false,
        stdout: error.stdout?.trim() ?? '',
        stderr: error.stderr?.trim() ?? error.message,
        error
      };
    }
  };
}

export async function runChecked(runner, command, args, label = `${command} ${args.join(' ')}`) {
  const result = await runner(command, args);
  if (!result.ok) throw new Error(`${label} failed: ${result.stderr || result.stdout}`);
  return result.stdout;
}

export async function retry(action, { retries = DEFAULT_RETRIES, delayMs = DEFAULT_RETRY_DELAY_MS, sleep = delay } = {}) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      return await action(attempt);
    } catch (error) {
      lastError = error;
      if (attempt + 1 < retries) await sleep(delayMs * 2 ** attempt);
    }
  }
  throw lastError;
}

export function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function inspectGit(runner, { branch, remote, tag, checkRemote = true }) {
  const [status, currentBranch, remoteUrl, upstream, localTag, remoteTag] = await Promise.all([
    runChecked(runner, 'git', ['status', '--porcelain=v1']),
    runChecked(runner, 'git', ['branch', '--show-current']),
    runChecked(runner, 'git', ['remote', 'get-url', remote]),
    runner('git', ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}']),
    runner('git', ['rev-parse', '--verify', '--quiet', `refs/tags/${tag}`]),
    checkRemote ? runner('git', ['ls-remote', '--tags', remote, `refs/tags/${tag}`]) : null
  ]);
  const aheadBehind = upstream.ok
    ? await runChecked(runner, 'git', ['rev-list', '--left-right', '--count', `${upstream.stdout}...HEAD`])
    : '';
  const [behind = '0', ahead = '0'] = aheadBehind.split(/\s+/);
  return {
    clean: status === '',
    changedFiles: status.split(/\r?\n/).filter(Boolean).map((line) => line.slice(3).trim()),
    branch: currentBranch,
    expectedBranch: branch,
    remoteUrl,
    upstream: upstream.ok ? upstream.stdout : null,
    ahead: Number(ahead),
    behind: Number(behind),
    localTag: localTag.ok,
    remoteTag: remoteTag ? remoteTag.ok && remoteTag.stdout !== '' : null
  };
}

export function assertGitPreflight(state, { resume = false }) {
  if (!state.clean && !(resume && state.changedFiles?.every((file) => RELEASE_FILES_SET.has(file)))) {
    throw new Error('Working tree contains unexpected changes; commit or stash them before release');
  }
  if (state.branch !== state.expectedBranch) throw new Error(`Release must run on ${state.expectedBranch}, not ${state.branch}`);
  if (state.behind > 0) throw new Error(`Local branch is behind upstream by ${state.behind} commit(s)`);
  if (state.remoteTag !== null && state.localTag !== state.remoteTag && !resume) {
    throw new Error('Local and remote release tag state differs; rerun with --resume after inspection');
  }
  if (state.localTag && !resume) throw new Error('Release tag already exists; use --resume only for a verified interrupted release');
}

export async function pushBranch(runner, remote, branch, retryOptions) {
  return retry(async () => runChecked(runner, 'git', ['push', remote, branch]), retryOptions);
}

export async function createAndPushTag(runner, remote, tag, message, retryOptions) {
  const exists = await runner('git', ['rev-parse', '--verify', '--quiet', `refs/tags/${tag}`]);
  if (!exists.ok) await runChecked(runner, 'git', ['tag', '-a', tag, '-m', message]);
  await retry(async () => runChecked(runner, 'git', ['push', remote, tag]), retryOptions);
}

export async function commitRelease(runner, message) {
  await runChecked(runner, 'git', ['add', '.claude-plugin', '.codex-plugin', 'scripts/verify-skill-repo.mjs', 'CHANGELOG.md']);
  const staged = await runChecked(runner, 'git', ['diff', '--cached', '--name-only']);
  if (staged === '') return false;
  await runChecked(runner, 'git', ['commit', '-m', message]);
  return true;
}
