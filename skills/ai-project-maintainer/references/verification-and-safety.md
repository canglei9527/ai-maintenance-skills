# Verification And Safety

## Authorization And Scope

A path or attachment never grants write authority. Explain/review/diagnose tasks are read-only. Before editing, confirm the project root, target anchor, approved scope, exclusions, user dirty-worktree changes, and any external boundary.

Always ask separately before deleting, pushing, publishing, deploying, changing production, sending data, changing a remote repository, or creating/executing CI that may trigger remote work. Do not automatically create a branch or a full-project backup. Do not roll back user changes. Do not output secrets or inspect credential contents.

Do not automatically add or upgrade dependencies. If a dependency is necessary, state its version, license, lockfile, and supply-chain impact and obtain the required authorization. Do not choose a license for a public project unless an existing project choice or the user specifies it. README and ignore files may follow project conventions; `CONTRIBUTING` and CI are conditional on project need or explicit instruction.

Generated and vendor code is normally excluded. Read it only when the target or runtime evidence points to an exact file; modify it only after confirming whether the generator/source snapshot should be changed instead.

## Comment And Record Integrity

Keep unaffected comments that remain correct. If a comment conflicts with the current code, manual, or verification evidence, correct it rather than preserving a known false statement. Do not add a generic AI-refactor marker or empty future plan.

Update a Bug record only for a confirmed defect and only at the project's established location. Update architecture or task routes when current responsibilities, invariants, public interfaces, direct dependencies, first entries, or directory boundaries change. Do not add a route for every ordinary Bug.

## Verification Order

Use the fastest-failing, local-to-external order and honor existing project commands:

1. YAML, configuration, parsing, and file structure;
2. format, syntax, type, compile, and link checks;
3. focused unit/regression tests;
4. related integration tests;
5. import, startup, CLI, browser, device, or target-board checks;
6. structure, duplicate-owner, index, and route checks.

For structural work, run comparable structure checks before and after each approved migration batch. Separate behavior evidence from maintainability evidence. A build passing does not prove a user workflow, external integration, target hardware, real-time timing, or production state.

Report each check as:

```text
检查项：...
required：yes/no
available：yes/no
ran：yes/no
result：PASS / FAIL / NOT_RUN / NOT_AVAILABLE / BLOCKED_BY_EXISTING_FAILURE
evidence：命令、输出摘要、前置条件或失败原因
```

Never relabel `NOT_RUN`, `NOT_AVAILABLE`, or an existing failure as `PASS`. When a test fails, preserve the meaningful output and distinguish a pre-existing failure, a change-induced failure, and an environment limitation only when evidence supports that distinction.

## Structural Evidence

For approved structural changes, the final evidence must cover:

- before/after affected file and line-count baseline;
- public entries and direct consumers;
- migration table and old-implementation deletion proof;
- compatibility path and import identity where relevant;
- focused behavior tests plus import/build/link/startup checks;
- duplicate implementation review using AST/symbol tools when available and targeted manual review otherwise;
- affected directory indexes and task routes;
- three representative maintenance read sets and their implementation-line totals;
- named exceptions with their evidence and re-review condition.

## Real-Time Verification

For TMS320/CCS or other embedded real-time work, do not infer safe restructuring from line count. Before modifying or splitting a control ISR, ADC/PWM chain, CLA Task, protection logic, startup code, interrupt vector, linker-section code, or required-inline algorithm, confirm when applicable:

- interrupt source and ISR period;
- ADC SOC/EOC relationship;
- EPWM trigger timing;
- CLA/CPU data ownership and shared or Message RAM;
- `#pragma CODE_SECTION`, `#pragma DATA_SECTION`, and linker `.cmd` placement;
- compiler optimization and inlining;
- worst-case execution time and protection priority.

Classify syntax/static analysis, compile, link, simulation, target-board download, waveform, ISR execution time, and protection-trigger timing separately. If hardware or timing was not exercised, report it as `NOT_RUN` or `NOT_AVAILABLE`; compilation is not control-behavior verification.
