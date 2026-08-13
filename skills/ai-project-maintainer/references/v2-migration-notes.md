# V2 Migration Notes

This file records the source-to-source migration performed for the V2 refactor of `ai-project-bootstrapper` and `ai-project-maintainer`. It is explanatory release evidence, not an execution prerequisite and not a second normative workflow.

## Scope

Only these two workspace skill directories were changed. Existing uncommitted edits in the two `SKILL.md` files and maintainer references were read and their intent was retained: nested source/test navigation, confirmed project-root boundaries, nested project stops, and truthful structure verification.

The same-name installed copies under `C:\Users\23526\.agents\skills\` were inspected as duplicate sources but were not modified. No business project, remote repository, Git history, system dependency, or unrelated skill was changed.

## Frontmatter Change

- `ai-project-bootstrapper` now triggers for creating a standalone project or initializing a new/empty directory, even when a path, spec, or assets are supplied. Existing-code changes, explanations, and reviews route away from bootstrapper.
- `ai-project-maintainer` now triggers for explaining, diagnosing, reviewing, fixing, extending, or restructuring an existing project. A path or attachment is a locator only; the body selects read-only, normal-change, structural-change, or the external-action gate.

## Content Migration

| Old position | New normative position | Old copy |
|---|---|---|
| Bootstrapper `SKILL.md` workflow, tier behavior, root records | `references/workflow.md` | Rewritten entrypoint details removed |
| Bootstrapper budgets, indexes, ownership, exceptions | `references/navigation-and-budgets.md` and `references/verification-and-exceptions.md` | Rewritten entrypoint details removed |
| Bootstrapper `references/project-docs-template.md` | Practical current-record guidance in `references/workflow.md`; navigation/route fields in `navigation-and-budgets.md`; verification fields in `verification-and-exceptions.md` | Deleted after migration |
| Maintainer `SKILL.md` read and ordinary-change loop | `references/fast-path.md` | Rewritten entrypoint details removed |
| Maintainer structural gate and imported-project workflow | `references/structural-change.md` | Rewritten entrypoint details removed |
| Maintainer safety, external actions, and verification | `references/verification-and-safety.md` | Rewritten entrypoint details removed |
| Maintainer `references/maintenance-workflow.md` | `fast-path.md`, `structural-change.md`, and `verification-and-safety.md` by responsibility | Deleted after migration |
| Maintainer `references/project-record-templates.md` | Route/index/record principles in the applicable V2 references | Deleted after migration |

## Behavioral Changes

- `MICRO`, `STANDARD`, and `DURABLE` are explicit tiers. DURABLE is the default; MICRO is reserved for explicit one-off or single-file work, and STANDARD for explicitly lightweight projects without long-term AI maintenance needs.
- File sizes are normally review thresholds. Strict acceptance budgets apply only to durable creation, structural change, or an explicit context/file-governance request.
- A normal Bug fix in a large file remains allowed and does not force unrelated refactoring.
- Structural work requires an approved scope, baseline, migration table, real ownership transfer, old-implementation deletion, compatibility evidence, and before/after verification.
- Indexes, function indexes, architecture notes, and Bug records are created only when they have current navigation or historical value.
- Real-time and TMS320/CCS code is governed by timing, ownership, ABI, linker, and hardware evidence rather than line count alone.
- Verification distinguishes `PASS`, `FAIL`, `NOT_RUN`, `NOT_AVAILABLE`, and `BLOCKED_BY_EXISTING_FAILURE`.

## Validation Limits

The installed marketplace `quick_validate.py` validates skill frontmatter only; it does not validate Markdown reference links or behavioral routing. No audit script was added to either skill. The workspace-level `verify-maintainability.mjs` was not made a skill dependency. Link resolution, stale-reference checks, duplicate-rule review, and forward-test behavior therefore require separate evidence in the final report.
