---
name: ai-project-bootstrapper
description: Use when creating a new independent software project, standalone service, router, daemon, background program, CLI tool, automation tool, complete application, or a new module architecture. Design responsibilities and interfaces first, create a dedicated project folder, and build a maintainable skeleton with centralized configuration, minimal tests, project records, startup instructions, and explicit verification boundaries. Trigger even when the user describes the product or behavior without saying “从零创建”.
---

# AI Project Bootstrapper

Use this skill before writing the first implementation of a new project or a substantial new module.

## Task routing

Prefer this Skill when the user describes a standalone product or program such as a service, router, daemon, background process, CLI, automation tool, or complete application, and does not provide an existing project path, file, function, stack trace, failing test, or call path. The current workspace may contain unrelated projects; that does not make this a maintenance request.

If the user explicitly supplies existing-project evidence or says to modify the current codebase, use `ai-project-maintainer` instead. If the intent is ambiguous, ask exactly one focused question before scanning or creating files:

```text
这是新建独立程序，还是在现有项目中增加功能？如果是现有项目，请提供项目路径或目标文件。
```


Once this Skill is installed in a supported AI client, users do not need to paste a template or mention this Skill by name. Treat ordinary requests such as “创建一个 Flask 项目”“从零搭建应用”“帮我设计项目结构” as bootstrap requests and run the workflow below automatically. The user only needs to describe the goal and constraints in their own words. Use `AI修Bug提问模板.md` only when the user wants help preparing a detailed project brief or when important requirements are missing.


## Read boundary for new projects

New-project design also uses two stages. `ARCHITECTURE.md` and `FUNCTION_INDEX.md` describe responsibilities and lookup paths; they are indexes, not a checklist that permits opening every source file.

### Stage 1: choose the project boundary

Before inspecting code or creating files, determine the exact `project_root` and the user's goal. If the target directory is not supplied, ask for or confirm one dedicated directory. Treat a populated parent workspace as a container of unrelated projects, not as the new project's source tree.

During Stage 1, inspect only shallow metadata inside the confirmed target directory: root listing, existing project markers, package-manager files, configuration names, startup/test entry names, and version-control status. Do not recursively read `src/`, `tests/`, dependencies, caches, generated output, vendor files, binaries, media, or sibling projects. Do not scan the parent workspace to find a suitable project root.

If the confirmed target is not empty or its ownership is unclear, do not overwrite it. Ask whether to use another directory or explicitly convert the existing directory into the project root.

### Stage 2: design and anchor-driven implementation

Before writing implementation code, define the module map and the first public functions in `ai-context/ARCHITECTURE.md` and `ai-context/FUNCTION_INDEX.md`. Then read or create only the files needed for the requested workflow. Open a source file when its path is named by the user's request, the function index, a direct one-hop call, a relevant configuration boundary, or a test/error that proves it is needed.

Default exclusions are `.git`, `node_modules`, `vendor`, build/dist/out directories, caches, coverage, generated files, binaries, media, `.env`, credentials, cookies, tokens, and unrelated sibling projects. Do not recursively expand a transitive import or call graph. If a target function is not known, ask for the smallest missing requirement or search only the confirmed project root for an exact symbol; do not infer it by reading every source file.

Use the same search gate as the maintainer workflow: state the purpose and root, start with an exact term, cap a search at 50 hits and 12 opened candidates, and narrow the search before expanding scope. Expand only one level at a time when a public contract, cross-process boundary, shared adapter, confirmed consumer, or explicit test failure proves it necessary. Full-project scans are reserved for an explicit audit or inventory request.


1. Capture the goal, primary users, core workflows, constraints, preferred technology, runtime, deployment target, and acceptance checks. Do not choose an architecture that the request rules out.
2. Choose and confirm a dedicated project root directory before writing files. For a brand-new program, create a new folder named after the project, place all source, tests, docs, assets, and configuration inside it, and do not scatter new files into the current workspace root. If the current directory already contains unrelated source code, treat it as a parent workspace, not the new project's root.
3. Apply Stage 1 to the confirmed root. Reuse compatible conventions only after inspecting shallow metadata; do not recursively read an existing directory to decide whether it is suitable.
4. Propose a small directory structure and module responsibility map before implementation. Each module should own one coherent concern and communicate through explicit interfaces.
5. Define the first public functions, parameters, return values, error behavior, and data boundaries. Record them in `ai-context/FUNCTION_INDEX.md` before opening unrelated implementation files.
6. Put configuration constants in `config.py`, `settings.py`, or the established equivalent. Avoid scattering environment-dependent values through business code.
7. Create implementation, minimal tests, project records, the root `AGENTS.md`, and `AI修Bug提问模板.md` when the project uses that handoff format. Put detailed architecture, function index, and bug history under `ai-context/`; keep `AGENTS.md` short and executable as the client-discovered read boundary.
8. Keep comments purposeful. Preserve existing comments and use the project's language and naming style.
9. Add an executable start command and a minimal verification command. Separate fast checks from browser, device, integration, or production-only checks.
10. Run syntax/type checks and the smallest meaningful tests before claiming the project is ready. Record prerequisites and checks that cannot run locally.
11. Report the project root, directory structure, module responsibilities, start command, test command, and known limitations.

## Design constraints

- Create a dedicated project root folder for every new program unless the user explicitly names an existing empty target directory. Keep generated source, tests, docs, assets, and configuration under that folder.
- Keep `AGENTS.md` at the project root for automatic discovery. Put `ARCHITECTURE.md`, `FUNCTION_INDEX.md`, and `BUG_HISTORY.md` under `ai-context/` for staged context reads.
- Do not put all features into one large file.
- Do not add a framework or dependency only for appearance. Explain the reason and the maintenance cost.
- Do not create speculative abstractions, unused interfaces, or placeholder tests that never assert behavior.
- Keep compatibility wrappers when replacing an existing entry point unless removal is explicitly requested.
- For a module split, describe old-to-new call flow and migration steps.
- For a new public repository, add a license, README, contribution guidance, ignore rules, and automated checks appropriate to the stack.

## Required project records

`ai-context/ARCHITECTURE.md` should describe the directory map, responsibilities, public interfaces, call flow, and the minimum context needed for future maintenance. `ai-context/FUNCTION_INDEX.md` should map target functions or classes to source files, one-hop project-owned dependencies, relevant tests, and expansion conditions. `ai-context/BUG_HISTORY.md` should begin with the creation date and technology route, then receive append-only records for fixes. `AGENTS.md` should describe the staged read boundary and project-specific constraints without duplicating every detail from this Skill.

Read `references/project-docs-template.md` for a compact set of starter records. Read `../ai-project-maintainer/references/project-record-templates.md` when you need a bug or architecture entry format.
