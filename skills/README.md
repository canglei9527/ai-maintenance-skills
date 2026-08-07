# Project Skills

This directory contains portable project skills. Each skill is self-contained: its `SKILL.md` routes the request, and it links directly to only the reference files needed for that route.

## Included Skills

- `ai-project-bootstrapper`: creates a new standalone project or initializes a new/empty directory. It chooses `MICRO`, `STANDARD`, or `DURABLE` rather than generating the same governance tree for every request.
- `ai-project-maintainer`: explains, reviews, diagnoses, fixes, extends, or restructures an existing project. It chooses `READ_ONLY`, `NORMAL_CHANGE`, or `STRUCTURAL_CHANGE`; a path or attachment does not itself authorize writing.

## Install

Copy either skill directory, or both, to the user-level location:

```text
~/.agents/skills/ai-project-maintainer/
~/.agents/skills/ai-project-bootstrapper/
```

The `name` in each `SKILL.md` must match its directory name. Do not copy references from one skill into the other: all execution references are local to their owning skill.

## V2 Behavior

- A requested new CLI or service remains bootstrapper work even when the user supplies a target path, `spec.md`, or assets; an existing monorepo receiving a package remains maintainer work.
- `MICRO` supports a requested one-file tool without `AGENTS.md`, `ai-context/`, Bug folders, architecture stubs, or function indexes. `STANDARD` adds navigation only when it helps. `DURABLE` enables long-term maintenance records and strict structure evidence.
- `READ_ONLY` explains, diagnoses, or reviews without source/test/record/index writes. `NORMAL_CHANGE` makes the smallest compatible repair and does not force a refactor because a target is large. `STRUCTURAL_CHANGE` requires approved scope, a baseline, a migration table, real ownership transfer, old-implementation deletion, and before/after evidence.
- The 400-line implementation, 200-line entry/index, and roughly 800-line maintenance-path values are default review thresholds. They become strict gates only for durable creation, structural work, or an explicit context/file-governance request; named exceptions require evidence.
- Navigation records are optional and factual. Create a task map, directory index, function index, architecture note, or Bug record only when it has current routing or historical value.
- Generated, vendor, declarative, framework, ABI, real-time, and TMS320/CCS code is inspected by its actual ownership, timing, linker, data-sharing, and verification constraints, never by directory name or line count alone.
- Verification reports `PASS`, `FAIL`, `NOT_RUN`, `NOT_AVAILABLE`, or `BLOCKED_BY_EXISTING_FAILURE` with evidence. Compilation does not prove unexercised workflow, hardware, or real-time behavior.

See `EVALS.md` for the V2 routing and behavior cases.
