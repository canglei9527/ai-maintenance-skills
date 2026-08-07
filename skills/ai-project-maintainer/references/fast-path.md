# Fast Path

## READ_ONLY

Use this path for explanations, reviews, diagnosis, symbol lookup, log reading, and status reports when the user did not request an edit.

1. Establish `project_root`, `target_anchor`, scope, exclusions, and applicable `AGENTS.md` without scanning the parent workspace.
2. Read shallow package/build/test/startup metadata and Git status. Read `ai-context/INDEX.md` as navigation; follow at most one relevant architecture topic and one Bug topic. Read a function index only for symbol lookup.
3. Read the target evidence: the named file or exact symbol/error, the smallest relevant configuration, one project-owned caller/callee when needed, and the smallest test or reproduction.
4. State the evidence, likely cause, alternatives, and unverified boundaries. Do not modify source, add tests, write Bug or architecture records, move files, create a branch, update indexes, or create a backup.

“Review this structure” without an explicit move/refactor request remains read-only. A path or uploaded text is evidence, not write authorization.

## NORMAL_CHANGE

Use this path for a Bug fix, focused feature, configuration adjustment, behavior change, or local test update that does not require moving ownership.

1. Record the root, anchor, scope, user changes, current behavior, expected behavior, reproduction, and a testable hypothesis.
2. Read only the target, one project-owned dependency/caller as needed, used configuration/data, and the smallest relevant test. Default to at most 50 search hits, 12 candidate files, and one dependency hop.
3. Expand one layer only when an exact symbol has multiple real callers, a boundary crosses package/process/service/database/browser, configuration has a proven override, a shared contract changes, or tests/startup identify an outside cause. Record the reason and new boundary.
4. Make the smallest compatible edit. Preserve public behavior, useful comments, naming, project conventions, and unrelated dirty changes. Do not format or rename unrelated code, upgrade dependencies, or turn the task into structural work.
5. Add or update the minimum meaningful regression test. Update a Bug record only for a confirmed defect when the project has such a record convention; update architecture or route records only when a responsibility, interface, dependency, first entry, or directory actually changed.
6. Run focused tests, then syntax/type/format/build/startup checks required by the changed boundary. Report behavior, structure, environment, and unrun checks separately.

## Large-File Bug Fixes

A 900-line target does not require a prior refactor. Fix the requested boundary in place when that is the smallest compatible change, add the focused regression test, and report the file-size or ownership risk. Do not add `AI-REFACTOR-PENDING`, an empty refactor plan, or unrelated extracted modules. A small extraction is allowed only when the changed logic itself is a complete responsibility, has a clear interface, consumers are known, compatibility is testable, the task stays bounded, and the user request includes structural intent.

## Reading And Search Limits

Search from the exact path, function, class, route, command, configuration key, event, error text, failing test, or stack location. Exclude `.git`, dependencies, vendor, build output, caches, generated files, binaries, media, secrets, and unrelated sibling projects at every depth. Stop at nested project markers unless explicitly included.

Default limits are review aids: 50 search hits, 12 candidate files, one project-owned dependency hop, and a focused read path. Do not turn them into an automatic failure or use a full scan for a normal change. Expand only on evidence; full scans are for explicit audits, inventories, dependency checks, or structural work.

## Completion Evidence

Use this compact report for the fast path:

```text
路径：READ_ONLY / NORMAL_CHANGE
根目录与锚点：...
证据或假设：...
修改：...；READ_ONLY 时为“无文件修改”
验证：检查项 -> required/available/ran/result/evidence
记录：更新、未更新及原因
风险：未覆盖边界或现有失败
```
