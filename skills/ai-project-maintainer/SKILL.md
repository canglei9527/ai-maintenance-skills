---
name: ai-project-maintainer
description: "Maintain an existing project when the request names a path, file, symbol, route, stack trace, failing test, or explicit current-codebase change. Use for bug fixes, regressions, focused features, module extraction, and approved restructuring; not for a new standalone program."
---

# AI Project Maintainer

Maintain existing projects through an evidence-backed boundary, the smallest compatible edit, and verified close-out.

## Boundary Gate

Before reading implementation, establish:

- `project_root` from a user-supplied path or target and its nearest project marker;
- one concrete `target_anchor`, such as a symbol, route, error, failing test, configuration key, or reproduction;
- the smallest relevant scope and its exclusions.

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

## Completion

Finish only when the requested behavior has a truthful verification status and required records are updated or explicitly unnecessary. Report:

```text
根因：有证据的具体原因。
修改：文件、符号和必要性。
验证：`command` -> 通过/失败/未运行。
记录：更新位置，或为什么不需要。
风险：未覆盖路径和环境限制。
```
