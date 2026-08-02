---
name: ai-project-bootstrapper
description: Use when creating a new software project, adding a new application from scratch, or establishing a new module architecture. Design responsibilities and interfaces first, then create a maintainable project skeleton with centralized configuration, minimal tests, Chinese project records, startup instructions, and explicit verification boundaries. Trigger for requests such as "从零创建项目", "搭建一个应用", "新建模块体系", or "帮我设计项目结构".
---

# AI Project Bootstrapper

Use this skill before writing the first implementation of a new project or a substantial new module.

## Automatic use

Once this Skill is installed in a supported AI client, users do not need to paste a template or mention this Skill by name. Treat ordinary requests such as “创建一个 Flask 项目”“从零搭建应用”“帮我设计项目结构” as bootstrap requests and run the workflow below automatically. The user only needs to describe the goal and constraints in their own words. Use `AI修Bug提问模板.md` only when the user wants help preparing a detailed project brief or when important requirements are missing.


1. Capture the goal, primary users, core workflows, constraints, preferred technology, runtime, deployment target, and acceptance checks. Do not choose an architecture that the request rules out.
2. Inspect the workspace for existing code, instructions, package managers, and uncommitted files. Reuse compatible conventions; do not overwrite an existing project without explicit authorization.
3. Propose a small directory structure and module responsibility map before implementation. Each module should own one coherent concern and communicate through explicit interfaces.
4. Define the first public functions, parameters, return values, error behavior, and data boundaries. Keep the initial interface small enough to test.
5. Put configuration constants in `config.py`, `settings.py`, or the established equivalent. Avoid scattering environment-dependent values through business code.
6. Create implementation, minimal tests, and project records together. New records should normally include `AGENTS.md`, `ARCHITECTURE.md`, `BUG_HISTORY.md`, and `AI修Bug提问模板.md`; adapt names only when the project convention requires it.
7. Keep comments purposeful. Preserve existing comments and use the project's language and naming style.
8. Add an executable start command and a minimal verification command. Separate fast checks from browser, device, integration, or production-only checks.
9. Run syntax/type checks and the smallest meaningful tests before claiming the project is ready. Record prerequisites and checks that cannot run locally.
10. Report the directory structure, module responsibilities, start command, test command, and known limitations.

## Design constraints

- Do not put all features into one large file.
- Do not add a framework or dependency only for appearance. Explain the reason and the maintenance cost.
- Do not create speculative abstractions, unused interfaces, or placeholder tests that never assert behavior.
- Keep compatibility wrappers when replacing an existing entry point unless removal is explicitly requested.
- For a module split, describe old-to-new call flow and migration steps.
- For a new public repository, add a license, README, contribution guidance, ignore rules, and automated checks appropriate to the stack.

## Required project records

`ARCHITECTURE.md` should describe the directory map, responsibilities, public interfaces, call flow, and the minimum context needed for future maintenance. `BUG_HISTORY.md` should begin with the creation date and technology route, then receive append-only records for fixes. `AGENTS.md` should describe project-specific constraints without duplicating every detail from this Skill.

Read `references/project-docs-template.md` for a compact set of starter records. Read `../ai-project-maintainer/references/project-record-templates.md` when you need a bug or architecture entry format.
