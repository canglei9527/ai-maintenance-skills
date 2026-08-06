---
name: ai-project-maintainer
description: "Maintain an existing project when the request names a path, file, symbol, route, stack trace, failing test, or current-codebase change. Use for bug fixes, regressions, focused features, module extraction, imported-project cleanup, and approved restructuring. For AI-maintainable organization, enforce many indexed 100-300 line files, a 400-line hand-written source limit, task-to-file routing, and small read sets; never accept a renamed giant legacy file or facade chain as completion."
---

# AI Project Maintainer

Maintain existing projects through an evidence-backed boundary, the smallest compatible edit, and a completion claim proportional to what was actually delivered. For organization work, optimize the repository for selective AI reading: many small, single-purpose files plus directory indexes that route future maintenance to the minimum context.

## Boundary Gate

Before reading implementation, establish:

- `project_root` from a user-supplied path or target and its nearest project marker;
- one concrete `target_anchor`, such as a symbol, route, error, failing test, configuration key, or reproduction;
- the smallest relevant scope and its exclusions;
- whether the request is a focused maintenance change or a structural outcome such as "整理", "重构", "拆分", "模块化", "容易维护", migration, move, or rename.

If the request instead describes a standalone program without existing-project evidence, use `ai-project-bootstrapper`. If intent is genuinely ambiguous, ask one question before scanning or creating files:

```text
这是新建独立程序，还是在现有项目中增加功能？如果是现有项目，请提供项目路径或目标文件。
```

### Stage 1: Control Plane

1. Read applicable `AGENTS.md` files on the target-to-root path.
2. Read `ai-context/INDEX.md` when present. Follow its task map to at most one relevant architecture topic and one Bug topic; read `FUNCTION_INDEX.md` only for symbol lookup. Otherwise locate the matching section in legacy architecture/Bug records before considering a full read. Treat records as navigation, not a source-file checklist.
3. Inspect only shallow package, build, test, startup, and version-control metadata.

Exclude dependencies, vendor code, build output, caches, generated files, binaries, media, secrets, and unrelated sibling projects. If the root or anchor remains unknown, request the smallest missing fact.

### Stage 2: Target Path

Search from an exact anchor. Read the target, the required one-hop project-owned caller or callee, configuration/data used by that path, and the smallest relevant test or reproduction. Default to 50 search hits, 12 candidate files, and one dependency hop; narrow before expanding. Reserve full-project scans for explicit audits or inventories.

## Maintenance Loop

1. Check project rules and the working tree. Preserve unrelated user changes.
2. Establish current behavior, expected behavior, and a focused reproduction or test boundary.
3. State a testable hypothesis when the cause is not already proven.
4. Make the narrowest change that preserves public behavior, comments, naming, and compatibility outside the request.
5. Add or update the smallest meaningful regression test.
6. Run focused tests and applicable syntax, type, format, build, or startup checks. Broaden verification only when shared contracts changed.
7. Record a confirmed fix in the matching `ai-context/bugs/` topic and its index, or the project's existing Bug history. Update an architecture topic or `FUNCTION_INDEX.md` only when responsibilities, interfaces, dependencies, or lookup paths changed.

Read `references/maintenance-workflow.md` before scope expansion, imported-project organization, moves or renames, dependency/schema/public-contract changes, destructive actions, or external actions. Complete its approval, baseline, and recovery gates before editing. Use `references/project-record-templates.md` only when the project has no record format of its own.

## AI Context Architecture Gate

Apply this gate whenever the user asks to make a project easier for AI to maintain, reduce context or tokens, split large files, organize an imported project, or create directory/file indexes.

The target architecture is deliberately granular:

- many small, cohesive hand-written source files;
- one responsibility and one primary reason to change per file;
- a short index in every maintained source directory describing each child file;
- a task-to-file map that lets a future agent select files before reading implementation;
- explicit interfaces so a task normally needs its target file, one direct dependency, one test, and one focused architecture/Bug note only.

### Hard Context Budgets

Use these default budgets unless the repository has stricter rules:

- target 100-300 lines per hand-written implementation file;
- 400 lines is the normal maximum for a hand-written source file;
- 200 lines is the normal maximum for an entry point, facade, compatibility module, directory index, or context note;
- a normal maintenance task must require reading at most 800 implementation lines across its target path before editing.

A hand-written source file over 400 lines is a failed organization result until it is split or the user explicitly approves a named exception. Files above 800 lines are never acceptable as routine maintenance boundaries. Do not use `legacy`, `compat`, `facade`, comments, regions, or classes inside one file to bypass the file budget.

Generated code, vendored code, immutable protocol/schema snapshots, and declarative data may exceed the budget only when isolated in clearly named directories and excluded from normal maintenance routes. Never place hand-written business logic in those exceptions.

### Required Directory Indexes

Every first-party directory containing hand-written source that is created, moved, or reorganized in the approved scope must contain a concise `INDEX.md`, `README.md`, or project-standard equivalent with:

```text
File | Responsibility | Public interface | Direct dependencies | Read when
```

The project context root must include a task map such as:

```text
Task or symptom | First file to read | Optional one-hop dependency | Focused test | Architecture/Bug note
```

Indexes route reading; they must not duplicate implementation details. Keep each entry concrete enough that a future agent can choose one small file without scanning the package.

### Context Verification

Before claiming organization complete:

1. list line counts for all affected hand-written source and context files;
2. fail the gate for every unapproved file above its budget;
3. detect duplicate top-level definitions with the language AST/symbol tool when available, then inspect same-name or highly similar implementations and copied constants across the migration boundary;
4. sample at least three likely maintenance tasks and name the exact minimal read set for each;
5. total the implementation lines in each sample read set and split further whenever it exceeds the 800-line context limit;
6. verify directory indexes and the task map point to files that exist and own the described behavior.

A test suite passing does not waive this gate. The purpose is to reduce future input tokens, so an unchanged giant implementation file is a failed result even when wrapped by perfect compatibility facades.

## Structural Refactor Gate

Apply this gate whenever maintainability, modularization, extraction, migration, project organization, or a large-file split is part of the requested result.

### Establish A Structural Baseline

Before editing, record enough evidence to compare the result:

- line counts for affected first-party files;
- top-level functions/classes and the responsibilities they represent;
- direct consumers and public entry points;
- duplicate definitions or copied implementations across the proposed boundary;
- existing tests and compatibility behavior, including monkeypatch/import identity when relevant.

Line counts are acceptance evidence for AI-context organization. Apply the hard budgets in the AI Context Architecture Gate; do not treat them as optional signals. For a focused Bug fix outside an approved organization scope, an existing oversized file is recorded as risk rather than forcing an unrelated refactor. Once organization or low-token maintenance is the requested outcome, generated/declarative isolation is the only size exception; hand-written source must meet the 400/200/800 budgets before completion.

### Define Real Ownership

For every extraction, write a small migration table before editing:

```text
Responsibility | Old owner | Canonical new owner | Consumers | Compatibility path | Removal proof
```

An extraction is real only when:

1. the new module owns the implementation;
2. the old implementation is removed, not left earlier in the file and shadowed by a later import;
3. consumers use the new owner directly or through one justified compatibility boundary;
4. tests cover the canonical owner and the compatibility contract;
5. documentation describes the actual runtime path rather than the intended future path.

Renaming a large file to `legacy_*`, moving it under a package, or adding facade-to-facade aliases does not reduce its responsibilities and must not be reported as completed modularization.

### Keep Compatibility Layers Thin

A compatibility module should contain imports, aliases, small argument/result adaptation, and deprecation guidance only. It must not become a second business implementation.

- Prefer one compatibility hop. Explain any additional hop.
- Check that monkeypatches and module identity still reach the canonical implementation when existing tests rely on them.
- Treat a compatibility file approaching 200 hand-written lines, defining domain classes, or containing substantial branching/I/O as evidence that the extraction is incomplete.
- Do not copy code into a new module and leave the same implementation active or shadowed in the old module.

### Classify Progress Honestly

Use one of these statuses in updates and completion reports:

- `Scaffolded`: directories/facades exist, but responsibilities have not moved.
- `Partially extracted`: named responsibilities have one canonical new owner, while listed legacy responsibilities remain.
- `Completed for approved scope`: every responsibility named in the approved scope has one canonical owner, old copies are removed, consumers and tests follow the intended boundary, and comparison evidence supports the maintainability claim.

Never use "整理完成", "重构完成", or equivalent when only scaffolding or a partial extraction was delivered. If risk or time requires staging, stop at a verified phase boundary and state exactly what remains.

## Completion

Finish a focused maintenance task only when the requested behavior has a truthful verification status and required records are updated or explicitly unnecessary.

For structural work, rerun the baseline and context-budget comparison and report:

```text
状态：Scaffolded / Partially extracted / Completed for approved scope
文件预算：最大手写源码文件、所有超 400 行文件及处理结果
读取预算：三个典型任务 -> 精确最小读取文件 -> 实现总行数
目录导航：每个受影响目录的索引及任务到文件路由
基线对比：职责数量、重复实现、兼容层变化
规范实现：每项迁移职责现在唯一归属哪个模块
遗留：仍未满足预算的文件；存在任何未批准超限时不得标记完成
验证：行为测试、导入/启动检查、结构与索引检查结果
记录：架构与 Bug/迁移记录位置
风险：未运行路径和环境限制
```

A passing behavior test proves compatibility, not maintainability. Structural completion additionally requires ownership, duplication, directory routing, and context-budget evidence.
