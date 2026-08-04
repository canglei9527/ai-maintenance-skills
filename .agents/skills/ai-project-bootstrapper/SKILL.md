---
name: ai-project-bootstrapper
description: Use only when creating a new independent software project or standalone application, service, router, daemon, CLI, or automation tool without evidence that it belongs to an existing codebase. Establish a dedicated project root, responsibilities, interfaces, minimal tests, lightweight context indexes, startup instructions, and verification boundaries.
when_to_use: The user wants a new independent program and provides no existing-project path, file, symbol, stack trace, failing test, or current-codebase instruction. Do not use for features, modules, bug fixes, or restructuring inside an existing project; route those to ai-project-maintainer.
---

# AI Project Bootstrapper

Create the first maintainable version of a new independent project.

## Routing

Use this Skill for a standalone application, service, router, daemon, background process, CLI, or automation tool with no evidence that it belongs to an existing codebase. A populated parent workspace may contain unrelated projects and does not change this routing.

Use `ai-project-maintainer` when the request names an existing project path, file, symbol, route, stack trace, failing test, call path, or asks to modify the current codebase. Existing-project features and module extraction are maintenance, not bootstrap work. If intent is genuinely ambiguous, ask:

```text
这是新建独立程序，还是在现有项目中增加功能？如果是现有项目，请提供项目路径或目标文件。
```

## Boundary

Confirm one dedicated `project_root` and the user's goal before writing. If no target directory is supplied, create a clearly named child directory under the workspace. Do not scatter project files into the parent workspace or scan sibling projects for conventions.

Inspect only shallow metadata in the confirmed target. If it is non-empty or ownership is unclear, do not overwrite it; resolve the target boundary first. Exclude dependencies, build output, caches, generated files, media, secrets, credentials, cookies, and tokens.

## Workflow

1. Capture users, core workflow, constraints, runtime, deployment target, and acceptance checks. Do not invent requirements that affect architecture or external behavior.
2. Define a small module map, public interfaces, configuration boundary, error behavior, and first verification path before implementation.
3. Create the lightweight context entry first:
   - `ai-context/INDEX.md` for constraints and task-to-topic navigation.
   - `ai-context/FUNCTION_INDEX.md` for symbol-to-source/test lookup.
   - Focused `ai-context/architecture/*.md` topics rather than one large architecture file.
   - `ai-context/bugs/INDEX.md` plus topic files as fixes accumulate.
   - `ai-context/operations/verification.md` for commands and environment-only checks.
4. Create only source, configuration, tests, assets, and scripts needed for the requested workflow. Keep modules cohesive and dependencies justified.
5. Keep root `AGENTS.md` short: read `ai-context/INDEX.md` first, preserve project-specific safety boundaries, and list minimal verification commands. Do not duplicate the full maintenance workflow there.
6. Add an executable start path and meaningful tests. Separate offline checks from browser, device, integration, credentialed, or production checks.
7. Run the smallest useful test and syntax/type/build checks. Report prerequisites, failures, and checks that cannot run locally.
8. Report the project root, module responsibilities, start command, test command, and known limitations.

Do not create speculative abstractions, unused interfaces, placeholder assertions, or a bug-handoff template unless the user asks for that artifact. For a public repository, add license, README, contribution, ignore, and automation files only when appropriate to the request.

Read `references/project-docs-template.md` when creating the initial documentation skeleton.
