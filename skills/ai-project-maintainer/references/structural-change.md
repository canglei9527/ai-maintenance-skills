# Structural Change

## Authorization Gate

Use this path when the user explicitly requests refactoring, splitting, migration, modularization, imported-project cleanup, reduced AI context, file-size governance, resolution of a God Class or accumulating patches, making an existing project easier to maintain, or a concrete structural scope approved after an audit. “Look at the structure” alone remains read-only; “make it easier to maintain” authorizes structure changes inside the named project and compatibility boundary, but destructive or external actions still need their own gate.

Imported-project cleanup is existing-project maintenance. Before moving or renaming files, ask for explicit agreement that imports, build paths, startup paths, and compatibility behavior may change. Silence or “先看看” is not agreement.

## Baseline Before Editing

Record enough evidence to compare before and after:

- Git status and user uncommitted changes;
- project root, approved scope, exclusions, and out-of-scope risks;
- affected files, line counts, top-level functions/classes, responsibilities, public entries, and direct consumers;
- existing tests, build/type/link/start commands and known failures;
- public/import identities, monkeypatch behavior, ABI, generated sources, linker sections, and timing constraints when relevant;
- duplicate definitions or copied implementations at the proposed boundary.

For an accumulating-patch or God Class request, also identify which feature changes currently require coordinated edits across construction, state, callbacks, strings, I/O, and tests. Convert those edit clusters into candidate responsibilities; line count alone is not the migration plan.

Do not create a branch, full-project backup, or external artifact automatically. Those are separate authorization decisions in `verification-and-safety.md`.

## Migration Table

Before each approved migration batch, write:

```text
职责 | 旧所有者 | 新规范所有者 | 消费者 | 兼容路径 | 旧实现删除证据 | 验证
```

A new module is canonical only when it owns the implementation, consumers use it directly or through at most one justified thin compatibility boundary, tests cover both the canonical path and compatibility contract, and the old implementation is deleted. A renamed file, facade-to-facade chain, copied implementation with a later import, or directory scaffold is not extraction.

## Batch Procedure

Migrate one complete responsibility at a time:

1. define the approved responsibility and its interface;
2. implement the new owner or move the real implementation;
3. update every confirmed consumer, import, build route, startup route, and focused test;
4. retain only the necessary one-hop compatibility entry, containing aliases or small argument/result adaptation;
5. delete the old implementation and record proof;
6. run target behavior, import/link/startup checks and compare against the baseline;
7. inspect duplicate owners, route truth, and relevant indexes before the next batch.

Do not keep a second business implementation in a compatibility module. A compatibility file approaching 200 hand-written lines, defining domain classes, or containing substantial branching/I/O is evidence the migration is incomplete.

## Navigation And Budgets

Create or update a task route only when a stable task type, first entry, responsibility, public interface, directory structure, or existing route changes. Create a directory index only where it reduces navigation cost, including affected nested source or focused-test directories. Do not preserve exact source line counts as long-lived index data.

Default size thresholds are review signals. Strict acceptance gates apply here because this is structural work: a hand-written source file over 400 lines, an entry/facade/compatibility/index file over 200 lines, or a typical task read path over about 800 implementation lines requires a decision. Split only when independent responsibilities, clear interfaces, independent verification, and reduced read scope support it; ABI, framework, real-time, linker, memory, or generated-source constraints can justify a named exception.

## Large-File Normal Fix Boundary

When the user asks only for a Bug fix in a large file, stay on `NORMAL_CHANGE`. Do not first restructure the file. Report the structural risk. Enter this path only if the user separately approves the structural scope or the request itself includes structural work.

## Imported Project Closure

For an approved imported-project cleanup:

1. show the root, scope, migration batches, compatibility plan, and risks;
2. run the same baseline checks before and after each batch;
3. update imports, build, start, tests, and project records only when they reflect the new current structure;
4. sample at least three common maintenance routes and total their actual implementation reads;
5. classify the result honestly and stop at a verified phase boundary if a batch fails.

## Honest Status

Use exactly one status:

- `Scaffolded`: directories or facades exist but ownership has not moved;
- `Partially extracted`: named responsibilities have new canonical owners while listed legacy responsibilities remain;
- `Completed for approved scope`: all approved responsibilities have one owner, old copies are removed, consumers/tests follow the boundary, and before/after evidence supports the claim.

Out-of-scope large files or risks may remain after `Completed for approved scope`, but must be listed as scope-outside risk. Never call a facade-only or partial result “refactoring complete.”
