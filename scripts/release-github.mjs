import { retry, runChecked } from './release-git.mjs';

export async function assertGitHubAuth(runner) {
  await runChecked(runner, 'gh', ['auth', 'status'], 'GitHub CLI authentication check');
}

export async function getRelease(runner, repository, tag) {
  const result = await runner('gh', ['release', 'view', tag, '--repo', repository, '--json', 'tagName,url,name,body']);
  if (!result.ok) return null;
  return JSON.parse(result.stdout);
}

export async function publishRelease(runner, options) {
  const { repository, tag, title, notesFile, retries, delayMs } = options;
  const existing = await getRelease(runner, repository, tag);
  if (existing) return { created: false, release: existing };
  const args = ['release', 'create', tag, '--repo', repository, '--title', title, '--notes-file', notesFile, '--latest'];
  await retry(
    async () => runChecked(runner, 'gh', args, 'GitHub Release creation'),
    { retries, delayMs }
  );
  const release = await retry(
    async () => {
      const found = await getRelease(runner, repository, tag);
      if (!found) throw new Error(`GitHub Release ${tag} is not visible yet`);
      return found;
    },
    { retries, delayMs }
  );
  return { created: true, release };
}
