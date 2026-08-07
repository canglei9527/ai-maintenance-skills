---
name: ai-project-bootstrapper
description: "Create a new standalone software project or initialize a new or empty project directory. Use when the user asks to build a new application, service, CLI, worker, daemon, automation tool, or similar independent codebase, even when an output path, specification, or assets are supplied. Do not use for modifying an existing codebase or merely explaining or reviewing an artifact."
---

# AI Project Bootstrapper

Create the first working slice of a new independent codebase. A path, specification, image, or other attachment locates input; it does not turn an unimplemented target into an existing project. If source, tests, build configuration, or repository behavior already exist at the target, route changes to `ai-project-maintainer`.

## Route First

| Situation | Route |
|---|---|
| Empty or new directory for an independent CLI, app, service, worker, daemon, or automation tool | Bootstrapper |
| `spec.md`, assets, or an output path describe a project whose implementation does not exist | Bootstrapper; inspect the supplied inputs as requirements |
| Existing repository, monorepo, package, source, tests, symbol, route, failure, or build behavior must change | Maintainer |
| Explain, review, or diagnose an existing artifact without a requested edit | Maintainer `READ_ONLY` |

Confirm the user wants a new implementation, identify one dedicated `project_root`, and inspect only the minimum target metadata before creating files. Do not infer that a path grants permission to modify an existing codebase.

## Project Tier

Choose one tier from the request and constraints:

| Tier | Use when | Required shape |
|---|---|---|
| `MICRO` | A one-off script, teaching experiment, or quick prototype with no service lifecycle, complex persistence, public multi-module interface, safety-critical behavior, hardware timing, or request for long-term AI maintenance | Deliver the behavior, input-error handling, run instructions, and the smallest available verification. Keep it single-file when requested. Do not create governance trees. |
| `STANDARD` | The default for ordinary CLIs, desktop tools, web apps, services, automations, and multi-file independent applications | Provide a clear entry point, centralized configuration, cohesive module boundaries, a README or project-standard start document, and focused tests or an equivalent verification. Add navigation only when it has real value. |
| `DURABLE` | Explicit long-term AI maintenance, multi-person or multi-agent ownership, multiple stable workflows or entry points, or high safety/hardware/financial/data-consistency requirements | Add only necessary root rules, task routing, architecture or operations records, read-budget sampling, and structural checks. Never create empty Bug records or speculative topics. |

Read the references selectively:

| Task | Must read | Do not read by default |
|---|---|---|
| `MICRO` new tool | [`references/workflow.md`](references/workflow.md), `MICRO` section | Durable navigation and audit sections |
| `STANDARD` new project | [`references/workflow.md`](references/workflow.md), then relevant sections of [`references/navigation-and-budgets.md`](references/navigation-and-budgets.md) | Unrelated exception sections |
| `DURABLE` new project | [`references/workflow.md`](references/workflow.md), [`references/navigation-and-budgets.md`](references/navigation-and-budgets.md), [`references/verification-and-exceptions.md`](references/verification-and-exceptions.md) | None of these three when their scope applies |
| Embedded or real-time project | All three references, including the real-time section | None |

Each reference is directly linked here; no reference requires another reference as a mandatory intermediary.

## Immutable Rules

- Classify user intent and authorization before reading broadly or writing.
- Keep the confirmed root, target anchors, exclusions, project rules, public interfaces, and language/framework conventions explicit.
- Preserve user changes; never roll them back or overwrite them. Do not read or output secrets.
- Prefer cohesive boundaries and small selective read paths, but split for ownership and independent verification, not to satisfy a line-count quota.
- Each business decision has one canonical specification and owner. Multiple implementations are acceptable only behind an explicit common interface, unique selection/configuration source, and consistency verification.
- Do not create wrappers, indexes, architecture notes, Bug records, or future workflows without a current navigation or maintenance purpose.
- External, destructive, remote, production, licensing, dependency, and CI actions require the authorization described in the applicable reference.

## Short Workflow

1. Capture the requested behavior, constraints, runtime, inputs, outputs, and acceptance checks.
2. Confirm a dedicated root and whether it is new/empty; stop and route to maintainer if existing implementation must be changed.
3. Select `MICRO`, `STANDARD`, or `DURABLE` and read only its references above.
4. Define the smallest end-to-end slice, module ownership, configuration source, interfaces, error behavior, and focused verification.
5. Implement only the approved current workflow. Add records and navigation only when the selected tier requires them.
6. Run the fastest relevant checks, then broader checks required by the project boundary. Report evidence and unsupported checks separately.
7. For `DURABLE` or an explicitly requested context-optimization task, perform the reference-defined structure and read-path checks before claiming completion.

## Completion Report

State the following, with evidence:

```text
项目根目录：...
档位：MICRO / STANDARD / DURABLE
当前工作流：...
模块边界：职责 -> 唯一规范来源/实现 -> 公共接口
导航记录：创建了什么，为什么有导航价值；未创建什么，为什么不需要
验证：检查项 -> required/available/ran/result/evidence
未完成与风险：...
```

`PASS` means the named check ran and passed. Never describe a skipped, unavailable, hardware-unconnected, or existing-failure check as proof of behavior.
