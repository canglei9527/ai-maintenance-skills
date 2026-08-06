export const DEFAULT_BRANCH = 'main';
export const DEFAULT_REMOTE = 'origin';
export const TAG_PREFIX = 'v';
export const DEFAULT_RETRIES = 3;
export const DEFAULT_RETRY_DELAY_MS = 1500;

export const RELEASE_FILES = {
  claudePlugin: '.claude-plugin/plugin.json',
  codexPlugin: '.codex-plugin/plugin.json',
  marketplace: '.claude-plugin/marketplace.json',
  verifier: 'scripts/verify-skill-repo.mjs',
  changelog: 'CHANGELOG.md'
};

export const VERIFICATION_COMMANDS = [
  ['node', '--test', 'scripts/skill-frontmatter.test.mjs', 'scripts/release.test.mjs'],
  ['node', 'scripts/verify-skill-repo.mjs'],
  ['git', 'diff', '--check']
];
