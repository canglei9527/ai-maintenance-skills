# Bootstrap Workflow

This reference describes the smallest workflow for creating a new independent project. Select only the tier named in `SKILL.md`; do not load durable governance for a `MICRO` script.

## MICRO

Use `MICRO` only when the user asks for a one-off script, teaching experiment, or quick prototype without a service lifecycle, complex persistence, public multi-module interfaces, safety-critical behavior, hardware timing, or long-term AI-maintenance requirements.

1. Confirm the target is new or empty and define its root.
2. Implement the requested behavior in the smallest cohesive form, including input errors and a usable invocation.
3. Run the smallest available syntax, smoke, or example check.
4. Report what ran and what was not verified.

Keep a requested single-file tool single-file. Do not create `AGENTS.md`, `ai-context/`, `FUNCTION_INDEX.md`, `architecture/`, `bugs/`, `operations/`, or per-directory indexes merely because this reference exists.

## STANDARD

Use `STANDARD` by default for an ordinary independent CLI, desktop tool, web application, service, automation tool, or multi-file data program.

1. Capture the current workflow, inputs, outputs, runtime, deployment boundary, and acceptance checks.
2. Confirm a dedicated project root. Read supplied specifications or assets as requirements, not as evidence of an existing implementation.
3. Define a small module table before coding:

   ```text
   Responsibility | Canonical owner | Public interface | Dependencies | Test boundary
   ```

4. Build one end-to-end slice with a clear entry point, centralized configuration, explicit error behavior, and focused tests or an equivalent verification.
5. Add a README or project-standard start document. Add a short root task map only when multiple source files or stable maintenance entry points make it useful.
6. Run the fastest relevant checks and report unavailable external checks separately.

Do not create empty architecture or Bug topics, speculative future routes, a full document tree, or abstraction layers without a current ownership or test boundary.

## DURABLE

Use `DURABLE` only when the request or project constraints explicitly require long-term AI maintenance, multi-person or multi-agent ownership, multiple stable workflows/entry points, or high safety, hardware, financial, or data-consistency assurance.

1. Establish root rules and a short task-to-file map for workflows that already exist.
2. Add `ai-context/INDEX.md`, focused architecture topics, or `operations/verification.md` only when each gives a real navigation or verification entry point.
3. Sample at least three likely maintenance tasks using exact minimal read sets and the navigation rules in `navigation-and-budgets.md`.
4. Run behavior verification plus the structure and exception checks in `verification-and-exceptions.md`.
5. Record only confirmed high-impact, recurring, security, consistency, or project-required Bugs. Do not create empty Bug folders or future architecture topics.

## Boundary And Ownership

Treat a populated target as existing work. Do not overwrite it or silently adopt it; ask whether it is the intended project and what scope is authorized. Exclude sibling projects, dependencies, vendor code, build output, caches, generated files, binaries, media, secrets, and credentials. Nested project markers are separate boundaries unless explicitly included.

Every business rule has one canonical specification and implementation owner. A new project may expose a direct canonical module; it should not invent compatibility wrappers or `legacy_*` modules. See `navigation-and-budgets.md` for ownership and route decisions.

## Current Records Only

Write records only for delivered behavior and current invariants. A root task map names a task's first file and optional one-hop dependency. Architecture topics describe existing responsibilities and contracts. Bug records describe confirmed defects. Git history remains the record of individual edits; do not duplicate it in indexes.
