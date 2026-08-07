---
name: ai-project-maintainer
description: "Explain, diagnose, review, fix, extend, or restructure an existing software project when the request concerns existing source, tests, build configuration, symbols, routes, failures, or repository behavior. Select a read-only, normal-change, or structural-change path from the user's intent. Do not infer write authorization merely from the presence of a path, file, or attachment."
---

# AI Project Maintainer

Maintain an existing project with evidence proportional to the requested outcome. A path, file, symbol, log, or attachment identifies a target; it does not authorize writing. First select the operation path, then read only the context needed for that path.

## Route First

| User intent or situation | Path | Default write permission |
|---|---|---|
| Explain code, review behavior, diagnose a failure, find a symbol, read logs, or report status without asking for a fix | `READ_ONLY` | None |
| Fix a bug, add a focused feature, adjust configuration, change existing behavior, or update a local regression test | `NORMAL_CHANGE` | Only the named compatible scope |
| Explicitly refactor, split, migrate, modularize, organize an imported project, reduce AI context, or implement an approved structural scope | `STRUCTURAL_CHANGE` | Only the approved structural scope |
| Delete, push, publish, deploy, alter production/remote state, send data, or create/execute remotely-triggering CI | `EXTERNAL_ACTION` gate | Separate confirmation for the exact action |

“Help me see how the structure is” is `READ_ONLY`; it does not authorize moving files. An existing monorepo receiving a new package is maintainer work because an existing repository boundary and workspace contract change. A new or empty independent project belongs to `ai-project-bootstrapper`.

## References

| Current task | Must read | Do not read by default |
|---|---|---|
| `READ_ONLY` explanation, review, or diagnosis | [`references/fast-path.md`](references/fast-path.md), `READ_ONLY` section | [`references/structural-change.md`](references/structural-change.md) |
| `NORMAL_CHANGE` bug or focused feature | [`references/fast-path.md`](references/fast-path.md), then relevant [`references/verification-and-safety.md`](references/verification-and-safety.md) sections | Structural migration procedure |
| `NORMAL_CHANGE` target is a large file | `fast-path.md` large-file section and required verification sections | Structural change unless separately authorized |
| `STRUCTURAL_CHANGE` or imported-project cleanup | [`references/structural-change.md`](references/structural-change.md), [`references/verification-and-safety.md`](references/verification-and-safety.md) | Unrelated fast-path sections |
| External, destructive, remote, production, dependency, license, secret, or CI concern | Relevant [`references/verification-and-safety.md`](references/verification-and-safety.md) section | Unrelated migration templates |
| Need the detailed explanation of this V2 skill migration | [`references/v2-migration-notes.md`](references/v2-migration-notes.md) | It is explanatory only; do not load it as an execution prerequisite |

All required references are one hop from this file and are independently usable. `references/v2-migration-notes.md` documents this package migration; it is not an execution prerequisite.

## Immutable Rules

- Establish `project_root`, `target_anchor`, scope, exclusions, authorization, and existing user changes before editing.
- Paths and attachments locate evidence only. Explanations and reviews remain read-only unless the user requests a change.
- Follow user instructions, applicable `AGENTS.md`, build constraints, public contracts, and project conventions.
- Preserve uncommitted user modifications. Do not reset, revert, overwrite, make an automatic branch, copy a full-project backup, or install/upgrade dependencies without explicit need and authorization.
- A normal bug fix remains a normal change even when its file is large. Record the structural risk; do not force an unrelated split or add a refactor marker/document.
- Split only when responsibilities, interfaces, independent verification, and reduced read scope support it and facade chains, duplication, ABI, framework, or timing constraints do not veto it.
- Each business decision has one canonical specification and owner. Alternate CPU/CLA, SIMD/scalar, real/simulated, hardware-platform, or reference/optimized implementations need an explicit common interface, unique selection/configuration source, and consistency verification.
- Completion claims must distinguish `PASS`, `FAIL`, `NOT_RUN`, `NOT_AVAILABLE`, and `BLOCKED_BY_EXISTING_FAILURE` and include evidence.

## Short Workflow

1. Determine the path from the user's intent; if write scope is unclear, remain read-only and ask for the smallest clarification.
2. Confirm the root and anchor from the request, read applicable project rules and shallow metadata, and preserve the dirty worktree.
3. Read the target, one project-owned dependency/caller as needed, relevant configuration, and the smallest test or reproduction. Expand only on evidence.
4. For `READ_ONLY`, diagnose or report without source, test, record, file-move, branch, or index writes.
5. For `NORMAL_CHANGE`, make the smallest compatible edit, add/update the minimum regression test, and verify at the risk-matched levels.
6. For `STRUCTURAL_CHANGE`, read the structural reference, establish a baseline and approved scope, create a responsibility migration table, migrate one complete responsibility at a time, remove the old implementation, and compare before/after evidence.
7. Apply the external-action gate separately. Report behavior, structure, environment, and unrun checks without conflating them.

## Structural Completion

Use only these statuses for approved structural work:

- `Scaffolded`: directories or facades exist, but ownership has not moved.
- `Partially extracted`: named responsibilities have canonical new owners, while listed legacy responsibilities remain.
- `Completed for approved scope`: every approved responsibility has one owner, consumers and tests follow it, old copies are removed, and comparison evidence supports the claim.

A passing test proves behavior for that test, not maintainability. A facade, rename, or new directory alone is not structural completion.

## Completion Report

```text
路径：READ_ONLY / NORMAL_CHANGE / STRUCTURAL_CHANGE / EXTERNAL_ACTION gate
根目录与锚点：...
授权范围：...
修改：文件/符号 -> 原因；只读时明确“无文件修改”
验证：检查项 -> required/available/ran/result/evidence
结构状态：不适用 / Scaffolded / Partially extracted / Completed for approved scope
记录：更新或明确无需更新的项目记录
未完成与风险：...
```
