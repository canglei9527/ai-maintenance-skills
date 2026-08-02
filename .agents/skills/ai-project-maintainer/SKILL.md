---
name: ai-project-maintainer
description: Use when maintaining an existing software project: fixing bugs, changing a function, refactoring a module, extracting responsibilities, updating tests, or investigating a regression. First build the smallest relevant context, protect existing work, make the smallest justified change, verify it, and record the result. Trigger even when the user says only "修 Bug", "改一下这个函数", "排查报错", "重构模块", or "为什么这里不工作".
---

# AI Project Maintainer

Use this skill for an existing project where behavior, structure, or tests must be changed safely.

## Operating contract

1. Inspect the project rules before editing. Read `AGENTS.md` if present, then `ARCHITECTURE.md`, `BUG_HISTORY.md`, or their project-local equivalents when relevant.
2. Check the working tree before touching files. Preserve user changes, generated files, and uncommitted work that is unrelated to the request. Do not reset, checkout, delete, or overwrite work you did not create.
3. Locate the target function, route, component, command, or configuration entry before reading broadly.
4. Read only the target implementation, its direct custom dependencies, relevant configuration and data structures, and the smallest useful test or reproduction. Read more only when the call path proves it is necessary.
5. State the working hypothesis before editing when the cause is not obvious. Do not invent missing behavior, interfaces, error details, or test results.
6. Keep the change local. Preserve comments, public signatures, compatibility entry points, and externally observable behavior unless the request explicitly changes them.
7. Before a structural refactor, make a non-overwriting backup or use a separate branch when the project workflow supports it. Explain the recovery path.
8. Add or update the smallest regression test that demonstrates the expected behavior. Prefer the project's existing test style and commands.
9. Run the minimum relevant test, syntax/type check, and formatting check. Run broader checks when shared contracts or public behavior changed.
10. Do not claim success when verification fails or was skipped. Report the command, useful failure output, likely reason, and remaining risk.
11. After a bug fix or module extraction, append a concise entry to `BUG_HISTORY.md` (or the project's equivalent). Update `ARCHITECTURE.md` when responsibilities, interfaces, or call relationships changed.
12. At the end, report changed files, root cause, verification, and unverified risks. Keep unrelated cleanup out of the patch.

## Context budget

A first read of an important module should update the architecture record only if the module's responsibility, public interface, dependency boundary, or known risk is not already documented. Do not create a note for every ordinary file read. This preserves a useful map without turning maintenance into documentation churn.

If the required context is missing, ask for the smallest actionable item: a file/function, configuration value, call stack, reproduction, or test command. Ask one focused request at a time when one answer will unblock the work. Do not guess.

## Change decision

- **Obvious local defect:** edit the narrowest function, add a focused regression test, verify, and record.
- **Unclear data or call path:** search symbol references first, then read only the next direct boundary.
- **Cross-module contract:** explain why more than one module must change, update the architecture record, and broaden verification.
- **Destructive or external action:** confirm the exact target and scope unless the user explicitly authorized it for this task.
- **Dependency, schema, environment, or public API change:** identify consumers and migration impact before editing; ask before adding risk that is not required.

## Required close-out

Use this shape in the final report:

```text
根因：...
修改：...
验证：`command` -> 通过/失败/未运行
记录：`BUG_HISTORY.md` / `ARCHITECTURE.md` -> 已更新/不需要
风险：...
```

Read `references/maintenance-workflow.md` for the detailed decision table and `references/project-record-templates.md` for record formats when the project does not already define them.
