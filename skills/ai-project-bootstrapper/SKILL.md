---
name: ai-project-bootstrapper
description: "Create a standalone application, service, router, daemon, CLI, automation tool, or other independent software project when no existing-project evidence is supplied. Build it from indexed 100-300 line single-purpose files, enforce a 400-line hand-written source limit, and provide task-to-file routing so future AI maintenance reads only a small target path. Prevent giant entry files, copied implementations, and facade chains."
---

# AI Project Bootstrapper

Build a maintainable first vertical slice inside one explicit project boundary. Optimize the source tree for selective AI reading: a directory index routes each task to a few small, single-purpose files. A working demo is not sufficient when its implementation concentrates unrelated responsibilities or forces future maintenance to load a large file.

## Boundary Gate

Confirm the goal and a dedicated `project_root` before writing files. Treat a populated parent workspace as a container of unrelated projects. Inspect only shallow metadata inside the confirmed target; if it is non-empty or ownership is unclear, ask whether to use another directory or adopt it explicitly.

If the request identifies an existing project path, file, symbol, stack trace, failing test, or current-codebase change, use `ai-project-maintainer`. If intent is genuinely ambiguous, ask one question before scanning or creating files:

```text
这是新建独立程序，还是在现有项目中增加功能？如果是现有项目，请提供项目路径或目标文件。
```

Exclude sibling projects, dependencies, vendor code, build output, caches, generated files, binaries, media, secrets, and credentials. Search only the confirmed root from an exact term; default to 50 hits, 12 candidates, and one project-owned dependency hop.

## Architecture Gate

Before implementation, define the minimum useful boundaries for the first vertical slice:

```text
Module | Single responsibility | Public interface | Dependencies | Test boundary
```

Use the architecture actually needed by the workflow. Do not create empty layers or wrappers merely to make the directory tree look modular.

### Small-File And Context Budgets

Use these default budgets for all first-party hand-written code:

- target 100-300 lines per implementation file;
- 400 lines is the maximum for a hand-written source file;
- 200 lines is the maximum for an entry point, facade, directory index, or context note;
- a normal future maintenance task must be routable through at most 800 implementation lines: target file, at most one direct dependency, and one focused test.

A file above its budget must be split before completion. Do not bypass the budget with `legacy`, `utils`, `common`, `manager`, nested classes, regions, or facade chains. If several small files always have to be read together because their boundaries are artificial, redesign the boundary so the task-to-file map remains useful.

Generated code, vendored code, immutable schema/protocol snapshots, and declarative data may be larger only when isolated in a clearly named directory and excluded from normal maintenance routes. Hand-written business logic cannot use this exception.

### Directory Navigation

Every first-party directory containing hand-written source must contain a concise `INDEX.md`, `README.md`, or project-standard equivalent:

```text
File | Responsibility | Public interface | Direct dependencies | Read when
```

Create a project-level task map:

```text
Task or symptom | First file to read | Optional one-hop dependency | Focused test | Architecture/Bug note
```

Indexes are navigation, not duplicated documentation. A future agent should be able to select one small implementation file from the index without scanning or opening the rest of the package.

### Entry Points

Keep CLI, server, desktop, worker, and application entry files as composition roots:

- parse startup input;
- load configuration;
- construct dependencies;
- start the application;
- map top-level errors to user-visible outcomes.

Do not place protocol parsing, persistence, domain workflows, HTTP clients, UI implementation, or large embedded assets in an entry file when they have independent reasons to change.

### One Canonical Implementation

Each responsibility must have one canonical implementation. Re-exporting a public symbol is acceptable; copying the implementation into another file is not.

- Avoid facade-to-facade chains. One compatibility/public export boundary is normally enough.
- Do not create `legacy_*` modules in a new project unless importing genuinely pre-existing code under an explicit migration plan.
- Do not leave an old implementation shadowed by a later import.
- Do not duplicate configuration defaults, validation rules, schemas, URL construction, or business decisions across layers.

### File Budget Enforcement

Line count is acceptance evidence for AI-maintainable projects:

- every hand-written source file must stay at or below 400 lines;
- entry/composition files, facades, indexes, and context notes must stay at or below 200 lines;
- files should normally remain in the 100-300 line range;
- any file owning more than one unrelated workflow must split even when under the line limit;
- repeated top-level functions/classes, copied constants, large embedded frontend assets, and modules used mainly to expose unrelated symbols fail the boundary check.

Do not finish with an oversized hand-written file and merely document it as technical debt. Split it in the same task. Only isolated generated/vendor/declarative files qualify for the exceptions above.

## Build Loop

1. Capture users, core workflows, constraints, preferred technology, runtime, deployment target, and acceptance checks. Resolve only choices that materially change the result.
2. Create or confirm the dedicated project root. Keep source, tests, configuration, documentation, and assets inside it.
3. Define the directory map, module ownership, interfaces, error behavior, data boundaries, and call flow using the architecture gate.
4. Create a short root `AGENTS.md` and lightweight navigation: `ai-context/INDEX.md`, `FUNCTION_INDEX.md`, focused `architecture/*.md` topics, `bugs/INDEX.md`, and `operations/verification.md`. Read `references/project-docs-template.md` only when starter records are needed.
5. Implement the smallest end-to-end slice with explicit interfaces and centralized configuration. Add abstractions only when they enforce a real boundary or remove meaningful duplication.
6. Add focused tests, an executable start command, and a minimal verification command. Add a handoff template only when the project uses that workflow.
7. Run syntax/type checks and the smallest meaningful tests. Separate offline results from build, startup, browser, device, integration, credentialed, or production checks required by the acceptance boundary.
8. Run the AI-context inspection: list every first-party hand-written file and its line count, fail all budget violations, use the language AST/symbol tool when available to find duplicate top-level definitions, inspect same-name/similar implementations and copied constants, and verify the entry point is a composition root.
9. Sample at least three likely future maintenance tasks. Use the indexes to name each exact minimal read set, total its implementation lines, and split further whenever it exceeds the 800-line read limit.
10. Verify every first-party directory containing hand-written source has an index and that the project task map points to files which exist and own the described behavior. Generated-only and vendor-only directories are excluded but must be labeled as such in their parent index.
11. Initialize `ai-context/bugs/INDEX.md` with creation status; create a Bug topic only for a confirmed defect. For a public repository, add the license, README, contribution guidance, ignore rules, and automated checks appropriate to the stack.

Avoid speculative abstractions, empty package directories, placeholder tests, and documentation that describes a future architecture as if it already exists. Compatibility wrappers belong to existing-project migration; a new project should normally expose its canonical module directly.

## Completion

Finish only when:

- the project is contained under the confirmed root;
- the first workflow is implemented end to end;
- each delivered responsibility has one canonical owner;
- the entry point only composes the workflow;
- no copied or shadowed implementation was introduced;
- every hand-written source and entry file satisfies its line budget;
- every first-party directory containing hand-written source has a concise file index and the project has a task-to-file map;
- three representative tasks each have a concrete minimal read set at or below the 800-line context limit;
- verification has a truthful status;
- records match the delivered structure.

Report:

```text
项目根目录：...
工作流：已实现的端到端行为
模块边界：模块 -> 唯一职责 -> 公开接口
目录导航：每个源码目录索引和项目任务到文件路由
文件预算：最大手写文件、所有超限检查及结果
读取预算：三个典型任务 -> 精确最小读取文件 -> 实现总行数
启动：命令与结果
验证：命令 -> 通过/失败/未运行
限制：未实现或未验证的路径
```

A passing startup or demo proves that the slice runs. It does not by itself prove that the generated project is maintainable.
