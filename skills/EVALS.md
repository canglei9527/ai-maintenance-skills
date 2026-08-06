# Skill Evaluation Cases

These prompts exercise the maintainability gates added to both skills. Review the expected safeguards as part of future edits.

## Existing Project: Renamed Giant Module

Prompt:

```text
整理 E:\example\novel-tool，让它以后容易维护，但保持原启动方式和接口。
```

Fixture condition: `engine.py` is 2,700 lines. A proposed change copies rule helpers into `rules.py`, renames the original to `legacy_engine.py`, and imports the copied helpers near the bottom.

Expected safeguards:

- classify the result as `Scaffolded` or `Partially extracted`, never completed restructuring;
- fail the 400-line hand-written source budget while the 2,700-line module remains;
- detect copied/shadowed definitions;
- require one canonical owner and removal proof;
- require a directory index and task-to-file route to the extracted small files;
- sample maintenance read sets and require each to stay at or below 800 implementation lines;
- preserve compatibility without keeping a facade chain as the final architecture.

## New Project: Giant Entry File

Prompt:

```text
新建一个带 Web 管理页、SQLite、定时任务和命令行的下载服务。
```

Expected safeguards:

- define indexed module ownership before implementation;
- keep every implementation at or below 400 lines and the entry at or below 200 lines;
- keep the entry module limited to configuration, construction, startup, and top-level error handling;
- separate Web assets, persistence, scheduling, and domain workflows into indexed small files;
- sample likely maintenance tasks and prove each minimal read set is at or below 800 implementation lines;
- inspect duplicated constants and canonical ownership before completion;
- do not call a working monolithic demo maintainable.

## Legitimate Large Generated File

Prompt:

```text
新建一个读取 OpenAPI 生成客户端并提供两个业务命令的 CLI。
```

Fixture condition: generated client code is 4,000 lines and the hand-written CLI entry is 90 lines.

Expected safeguards:

- identify generated code as an explicit exception rather than splitting it manually;
- isolate generated output from hand-written modules;
- evaluate cohesion and size of first-party hand-written code separately;
- verify the entry remains a composition root and business commands have canonical owners.
