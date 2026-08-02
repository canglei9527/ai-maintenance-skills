---
name: ai-project-maintainer
description: Use when maintaining an existing software project with evidence of that project: an existing project path, file, function, class, route, stack trace, failing test, call path, or an explicit request to modify the current codebase. Handles bug fixes, focused changes, imported-project organization, module extraction, and regression verification. Do not use as the default for a standalone service, router, daemon, CLI, automation tool, or complete application request that has no existing-project evidence.
---

# AI Project Maintainer

Use this skill for an existing project where behavior, structure, or tests must be changed safely.

## Task routing

Choose this Skill only when the request contains evidence of an existing project: a project path, file, function, class, route, stack trace, failing test, call path, or explicit wording such as “在当前项目中修改”. A non-empty workspace is not evidence that the user's requested program belongs there.

If the user describes a standalone service, router, daemon, background program, CLI tool, automation tool, or complete application without existing-project evidence, route to `ai-project-bootstrapper`. Do not scan the current workspace or start subagents first.

If the request could mean either “create a new independent program” or “add a feature to an existing project”, ask exactly one focused question before reading code:

```text
这是新建独立程序，还是在现有项目中增加功能？如果是现有项目，请提供项目路径或目标文件。
```


Once this Skill is installed in a supported AI client, users do not need to paste a template or mention this Skill by name. Treat ordinary requests such as “修复这个 Bug”“为什么这里不工作”“帮我改一下筛选逻辑” as maintenance requests and run the workflow below automatically. The user only needs to describe the symptom, desired behavior, or task in their own words. Use `AI修Bug提问模板.md` only when the user wants help preparing a detailed handoff or when missing context must be collected explicitly.


## Read boundary and context stages

Use a two-stage read. The architecture records are an index for locating work, not a checklist of source files to open.

### Stage 1: establish the boundary

Before reading source code or running a recursive search, establish all of the following:

- `project_root`: the project root explicitly supplied by the user, or the root inferred from an explicit target file and its nearest project marker. Never guess it by scanning the current workspace or its parent.
- `target_anchor`: at least one explicit file, function, class, route, command, configuration key, error text, failing test, stack location, or reproduction step.
- `scope`: the smallest directory containing the target and its direct project boundary.
- `exclusions`: `.git`, `node_modules`, `vendor`, build/dist/out directories, caches, coverage, generated files, binaries, media, secrets, `.env`, credentials, cookies, tokens, and unrelated sibling projects.

Read only the control-plane context in this stage:

1. `AGENTS.md` files from the target directory up to the confirmed project root, when present.
2. `ai-context/ARCHITECTURE.md`, `ai-context/FUNCTION_INDEX.md`, and `ai-context/BUG_HISTORY.md` at the project root, when present.
3. For legacy projects without `ai-context/`, the root `ARCHITECTURE.md` and `BUG_HISTORY.md` as a compatibility fallback.
4. A shallow root listing and the names or metadata of package, build, test, and startup entry files.
5. Version-control status without opening every changed file.

Do not open every module or function listed in an architecture record. Do not read source code merely because it is in the same directory. If `project_root` or `target_anchor` cannot be established, ask for the smallest missing item instead of scanning the workspace.

### Stage 2: anchor-driven local read

Only after Stage 1 is complete, read:

1. The target implementation.
2. Its one-hop, project-owned callers or callees when needed to explain the behavior.
3. Configuration and data structures actually used by that path.
4. The smallest relevant test, reproduction, or file named by the error stack.

Do not recursively expand a transitive import or call graph. Do not open standard-library or third-party implementation files unless the failure is explicitly inside that boundary and the user has authorized the investigation. After each group of files, reassess whether the evidence requires expansion.

### Search gate

Every search must state its purpose, use the confirmed `project_root`, and start with an exact user-provided path or symbol. Do not begin with broad words such as `config`, `error`, `handler`, `utils`, `import`, or `data`.

- Default maximum: 50 search hits, 12 candidate files opened, and one call/dependency hop.
- If a limit is reached, narrow the term or path first; do not silently switch to a workspace-wide search.
- Do not use unrestricted `rg ... .`, `find .`, or full directory enumeration followed by opening every result for an ordinary maintenance task.
- Do not search parent workspaces, sibling projects, dependencies, generated output, or vendor code unless an explicit call path requires it.

### Expansion gate

Expand from target directory to package, then to project root, only when evidence shows that the current boundary is insufficient: multiple real call paths, a shared adapter or middleware failure, a cross-process/service/data boundary, a public API/schema/event contract, an explicit test or stack-trace reference outside the scope, a confirmed monorepo consumer, or a required migration of imports and entry points. State the evidence and newly allowed boundary before each one-level expansion. Full-project scanning is reserved for an explicit repository audit, migration inventory, or dependency inventory request.


1. Inspect the project rules using Stage 1 above. Read `AGENTS.md` only along the target-to-root path, then read the project context index; do not search and read every same-named document.
2. Check the working tree before touching files. Preserve user changes, generated files, and uncommitted work that is unrelated to the request. Do not reset, checkout, delete, or overwrite work you did not create.
3. Locate the target function, route, component, command, or configuration entry using the Search gate before reading implementation files.
4. Apply Stage 2. “Direct dependency” means one hop of project-owned code required by the target path; it does not mean every transitive dependency in the directory or package.
5. State the working hypothesis before editing when the cause is not obvious. Do not invent missing behavior, interfaces, error details, or test results.
6. Keep the change local. Preserve comments, public signatures, compatibility entry points, and externally observable behavior unless the request explicitly changes them.
7. Before a structural refactor, make a non-overwriting backup or use a separate branch when the project workflow supports it. Explain the recovery path.
8. Add or update the smallest regression test that demonstrates the expected behavior. Prefer the project's existing test style and commands.
9. Run the minimum relevant test, syntax/type check, and formatting check. Run broader checks when shared contracts or public behavior changed.
10. Do not claim success when verification fails or was skipped. Report the command, useful failure output, likely reason, and remaining risk.
11. After a bug fix or module extraction, append a concise entry to `ai-context/BUG_HISTORY.md` when the project uses the staged layout, otherwise use `BUG_HISTORY.md` or the project's equivalent. Update `ai-context/ARCHITECTURE.md` and `ai-context/FUNCTION_INDEX.md` when responsibilities, interfaces, direct dependencies, or call relationships changed; for legacy projects use the corresponding root records.
12. At the end, report changed files, root cause, verification, and unverified risks. Keep unrelated cleanup out of the patch.

## Imported project organization

When the user says they are importing, taking over, or organizing an existing project, treat this as a separate structural-maintenance scenario. Do not move, rename, or reorganize files automatically.

1. Confirm the existing project root and make a shallow map of top-level directories, entry-point names, configuration names, package manager metadata, test commands, startup commands, version-control state, and existing project records. Inspect metadata first; do not recursively read source, sibling projects, caches, generated files, dependencies, or vendored code.
2. Before any structural edit, ask for explicit consent with this meaning:

   > 这是一个已导入的已有项目。是否要将它整理为便于维护的项目结构？整理会移动或重命名部分文件并更新引用；我会先运行现有测试建立基线，再整理并重新测试。选择“否”则保持当前结构，只进行普通维护。

3. If the user says no, keep the current structure and continue only with the requested local maintenance. Do not treat silence or an incomplete answer as consent.
4. If the user agrees, show the target layout, file-migration map, compatibility entries, configuration changes, and risks before moving files. Use a Git branch or a non-overwriting timestamped backup before structural edits.
5. Run a pre-organization baseline: existing unit/integration tests, syntax/type checks, build checks, and a startup smoke check when available. Record missing tests and pre-existing failures.
6. Organize only inside the imported project's current root. Do not automatically wrap it in a new same-named outer folder. Create or reuse `src/`, `tests/`, `config/`, `docs/`, or `scripts/` only when they fit the project's stack.
7. Move files in small batches, update imports, build/start/test paths, and keep compatibility wrappers unless removal is explicitly authorized.
8. Run the same baseline checks after organization, plus affected-module, import/path, and startup smoke checks. Compare before/after results and distinguish pre-existing failures, organization regressions, and environment failures.
9. Update `ARCHITECTURE.md` with the new responsibilities and call flow. Record the baseline, changes, post-organization results, and remaining risks in `BUG_HISTORY.md` when a defect or regression was found.
10. If post-organization verification fails, do not claim completion. Stop or restore the failed batch using the declared recovery path before continuing.


A first read of an important module should update the architecture record only if the module's responsibility, public interface, dependency boundary, or known risk is not already documented. Do not create a note for every ordinary file read. This preserves a useful map without turning maintenance into documentation churn.

If the required context is missing, ask for the smallest actionable item: a file/function, configuration value, call stack, reproduction, or test command. Ask one focused request at a time when one answer will unblock the work. Do not guess.

## Change decision

- **Obvious local defect:** edit the narrowest function, add a focused regression test, verify, and record.
- **Unclear data or call path:** use the Search gate for the exact symbol within the confirmed project root, then read only the next one-hop project-owned boundary.
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

Read `references/maintenance-workflow.md` for the detailed decision table and `references/project-record-templates.md` for record formats when the project does not already define them. In staged projects, use `ai-context/` records; in legacy projects, use the root records as a compatibility fallback.
