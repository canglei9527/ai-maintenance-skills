---
name: ai-project-maintainer
description: Use only for focused work in an existing software project when the request names project evidence such as a path, file, symbol, route, stack trace, failing test, or explicit current-codebase change. Handles bug fixes, regressions, local features, and approved restructuring. Do not use for a new standalone program without existing-project evidence.
when_to_use: Existing project evidence is present and the user wants a bug fix, focused behavior change, regression investigation, module extraction, or project maintenance. Route new independent applications, services, CLIs, daemons, routers, and automation tools to ai-project-bootstrapper.
---

# AI Project Maintainer

Maintain an existing project with the smallest evidence-backed read and edit scope.

## Routing

Use this Skill only when the request identifies an existing project through a path, file, symbol, route, stack trace, failing test, call path, or explicit current-codebase wording. A populated workspace alone is not evidence. Use existing-project evidence to establish the maintenance boundary. Do not scan the current workspace to invent one.

Route a new independent application, service, router, daemon, CLI, or automation tool with no existing-project evidence to `ai-project-bootstrapper`. If the intent is genuinely ambiguous, ask one question before scanning:

```text
这是新建独立程序，还是在现有项目中增加功能？如果是现有项目，请提供项目路径或目标文件。
```

## Staged context read

Architecture and bug records are navigation indexes, not permission to load every listed file.

### Stage 1: control plane

Establish `project_root`, one concrete `target_anchor`, the smallest relevant scope, and standard exclusions. Infer the root only from a user-supplied target and nearby project markers; never scan a parent workspace to guess it.

Read in this order:

1. Applicable `AGENTS.md` files on the target-to-root path.
2. `ai-context/INDEX.md`, when present. Follow its task map to at most one directly relevant architecture topic and one bug topic on the first pass. Read `ai-context/FUNCTION_INDEX.md` only when a symbol lookup helps.
3. If no index exists, use legacy `ai-context/ARCHITECTURE.md` and `ai-context/BUG_HISTORY.md`; if those do not exist, use root `ARCHITECTURE.md` and `BUG_HISTORY.md`. For long files, locate headings and read only the matching section before considering a full read.
4. Shallow package/build/test/start metadata and version-control status. Do not open every changed file.

Exclude dependencies, build output, caches, coverage, generated files, binaries, media, secrets, credentials, cookies, tokens, and unrelated sibling projects. If the root or anchor remains unknown, request the smallest missing fact.

### Stage 2: target path

Read only the target implementation, required one-hop project-owned callers or callees, data/configuration actually used by that path, and the smallest relevant test or reproduction. Reassess after each group; do not recursively load an import or call graph.

Use exact paths, symbols, routes, configuration keys, error text, or test names for search. Expand one level at a time only when current evidence requires it. Detailed limits and expansion criteria live in `references/maintenance-workflow.md` and should be loaded only when scope expansion, imported-project organization, or a non-local decision requires them.

### Compatibility boundary

Read boundary and context stages remain index-first: legacy `ai-context/ARCHITECTURE.md` is a compatibility fallback, not a default full read. Do not open every module or function listed by an index. Default maximum: 50 search hits, 12 candidate files opened, and one call/dependency hop before evidence justifies expansion. Full-project scanning is reserved for an explicit repository audit.

## Maintenance workflow

1. Check project rules and the working tree. Preserve unrelated user changes; never reset, delete, overwrite, or reformat them.
2. Locate the target from the confirmed anchor and establish the current behavior, expected behavior, and smallest test boundary.
3. State a testable hypothesis when the cause is not obvious. Do not present guesses as facts.
4. Make the narrowest change consistent with existing naming, comments, interfaces, and compatibility behavior.
5. Add or update a focused regression test. Broaden tests only when shared behavior or contracts changed.
6. Run relevant tests and syntax/type/format checks. Report failures and skipped checks accurately.
7. Update project records only when useful: add a concise entry to the matching `ai-context/bugs/` topic and its index, or use the project's existing equivalent. Update an architecture topic and `FUNCTION_INDEX.md` only when responsibilities, public interfaces, direct dependencies, or lookup paths changed.

Imported-project reorganization, moves, renames, dependency/schema changes, public contract changes, destructive actions, and external actions require their applicable approval and broader verification. See `references/maintenance-workflow.md` for that workflow.

Imported-project organization requires explicit consent, a pre-organization baseline, and a stop or recovery decision if post-organization verification fails.

## Close-out

```text
根因：有证据的具体原因。
修改：文件、符号和必要性。
验证：`command` -> 通过/失败/未运行。
记录：更新了哪个主题，或为什么不需要。
风险：未覆盖路径和环境限制。
```

Use `references/project-record-templates.md` only when the project has no record format of its own.
