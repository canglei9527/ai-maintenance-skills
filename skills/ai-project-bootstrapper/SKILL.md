---
name: ai-project-bootstrapper
description: "Create a standalone application, service, router, daemon, CLI, automation tool, or other independent software project when no existing-project evidence is supplied. Establish a dedicated project root, explicit interfaces, centralized configuration, focused tests, lightweight context indexes, startup instructions, and verification boundaries."
---

# AI Project Bootstrapper

Build a maintainable first vertical slice inside one explicit project boundary.

## Boundary Gate

Confirm the goal and a dedicated `project_root` before writing files. Treat a populated parent workspace as a container of unrelated projects. Inspect only shallow metadata inside the confirmed target; if it is non-empty or ownership is unclear, ask whether to use another directory or adopt it explicitly.

If the request identifies an existing project path, file, symbol, stack trace, failing test, or current-codebase change, use `ai-project-maintainer`. If intent is genuinely ambiguous, ask one question before scanning or creating files:

```text
这是新建独立程序，还是在现有项目中增加功能？如果是现有项目，请提供项目路径或目标文件。
```

Exclude sibling projects, dependencies, vendor code, build output, caches, generated files, binaries, media, secrets, and credentials. Search only the confirmed root from an exact term; default to 50 hits, 12 candidates, and one project-owned dependency hop.

## Build Loop

1. Capture users, core workflows, constraints, preferred technology, runtime, deployment target, and acceptance checks. Resolve only choices that materially change the result.
2. Create or confirm the dedicated project root. Keep source, tests, configuration, documentation, and assets inside it.
3. Before implementation, define a small directory map, module responsibilities, public functions, error behavior, data boundaries, and call flow.
4. Create a short root `AGENTS.md` and lightweight navigation: `ai-context/INDEX.md`, `FUNCTION_INDEX.md`, focused `architecture/*.md` topics, `bugs/INDEX.md`, and `operations/verification.md`. Read `references/project-docs-template.md` only when starter records are needed.
5. Implement the smallest end-to-end slice using explicit interfaces and centralized configuration. Reuse established local conventions when the target already contains compatible scaffolding.
6. Add focused tests, an executable start command, and a minimal verification command. Add a handoff template only when the project uses that workflow.
7. Run syntax/type checks and the smallest meaningful tests. Separate offline results from build, startup, browser, device, integration, credentialed, or production checks required by the acceptance boundary.
8. Initialize `ai-context/bugs/INDEX.md` with creation status; create a Bug topic only for a confirmed defect. For a public repository, add the license, README, contribution guidance, ignore rules, and automated checks appropriate to the stack.

Avoid speculative abstractions and placeholder tests. Keep compatibility wrappers when replacing an existing entry point unless removal is explicitly requested.

## Completion

Finish only when the project is contained under the confirmed root, the first workflow is implemented, verification has a truthful status, and records match the delivered structure. Report the project root, directory map, module responsibilities, start command, test command, and remaining limitations.
