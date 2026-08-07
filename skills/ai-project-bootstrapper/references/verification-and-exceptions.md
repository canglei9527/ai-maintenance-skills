# Verification And Exceptions

## Verification Contract

Use the fastest-failing, local-to-external order while honoring project commands:

1. YAML, configuration, file structure, and parsing;
2. formatting, syntax, type, compilation, and linking;
3. focused unit tests;
4. related integration tests;
5. startup, CLI, browser, device, or target-board checks;
6. structure, navigation, and duplicate-owner checks.

Report every meaningful check with all fields:

```text
检查项：...
required：yes/no
available：yes/no
ran：yes/no
result：PASS / FAIL / NOT_RUN / NOT_AVAILABLE / BLOCKED_BY_EXISTING_FAILURE
evidence：命令、输出摘要、设备状态或明确原因
```

A build passing proves only the build. It does not prove a workflow, browser, device, target-board, real-time, or production behavior that was not exercised. Do not install a missing validator or system dependency just to change `NOT_AVAILABLE`.

For `DURABLE` or strict structural work, run the structure check before and after the approved change. Include line-count review, route existence, directory indexes with real navigation value, canonical-owner review, and three sample maintenance read sets. Keep structure evidence separate from behavior evidence.

## Named Exceptions

An exception is allowed only after inspecting the actual file and recording:

```text
文件路径：...
超限指标：...
唯一职责：...
不拆分原因：...
拆分会破坏：...
公共接口：...
验证方式：...
重新审查条件：...
```

Typical candidates include generated code, vendor code, immutable protocol snapshots, pure declarations, large mapping tables, cohesive parsers, cohesive state machines, framework-required Models/Routers, ISR code, CLA Tasks, interrupt vectors, linker command files, SysConfig output, and code with ABI, memory-section, or timing requirements. A path, extension, directory name, annotation, or class name alone never grants an exception. Models with business branches, JSON with business decisions, or generated directories containing hand-written code must be inspected normally.

## TMS320, CCS, And Real-Time Firmware

Do not split a control ISR, ADC sampling/PWM update chain, CLA Task, protection logic, startup code, interrupt vector, linker-section code, or an algorithm that must be inlined merely to reduce line count.

Before modifying or splitting such code, confirm when applicable:

- interrupt source and ISR period;
- ADC SOC/EOC relationship;
- EPWM trigger timing;
- CLA/CPU data ownership and shared or Message RAM;
- `#pragma CODE_SECTION`, `#pragma DATA_SECTION`, and linker `.cmd` placement;
- compiler optimization and inlining;
- worst-case execution time and protection priority.

Classify verification separately:

- syntax or static analysis;
- compile;
- link;
- simulation;
- target-board download;
- real-time waveform;
- ISR execution time;
- protection-trigger timing.

If hardware or timing checks did not run, say so. Never turn “compiled” into “control behavior verified.”

## External And Sensitive Boundaries

Do not read or output secrets, credentials, tokens, private keys, cookies, or `.env` contents. Do not automatically add dependencies, select a license, create CI that can trigger remote execution, delete compatibility paths, push, publish, deploy, modify production, send data, or change a remote repository. README and ignore files may follow project conventions; `LICENSE` requires an existing choice or explicit user choice. Generated or vendor code is read only when the target or concrete runtime evidence points there, and normally is modified through its source generator instead.
