# AI Maintenance Skills

可复用的 AI 软件工程 Skills：让项目维护遵循“先理解局部上下文，再做最小修改；修改后验证，并留下可追溯记录”。

[English](#english) | [中文](#中文)

## 中文

### 这是什么

这个仓库提供两个可安装的 Skill：

- `ai-project-maintainer`：维护已有项目，适用于修 Bug、修改函数、排查回归、导入项目检查、经用户同意后的结构整理、模块抽离和小范围重构。
- `ai-project-bootstrapper`：创建新项目或新模块，适用于先设计职责、接口、目录和最小测试，再开始写代码。

仓库中的标准源路径是 `skills/ai-project-maintainer/SKILL.md` 和 `skills/ai-project-bootstrapper/SKILL.md`。两个 Skill 都是自包含的，可以一起安装，也可以单独安装。

它们不绑定 Python、JavaScript、React、Flask 或任何具体框架。项目可以使用自己的规则文件；Skill 只要求先读取并遵循它们。

### 核心原则

1. 先确认项目根目录、用户意图和写入授权，再读取项目规则与目标锚点。
2. `READ_ONLY` 只读；`NORMAL_CHANGE` 做最小兼容修改；`STRUCTURAL_CHANGE` 只在明确授权或批准范围内迁移完整职责。
3. `ai-project-bootstrapper` 按 `MICRO`、`STANDARD`、`DURABLE` 选择创建档位；路径、spec 或素材不改变“实现尚不存在”这一新建判断。
4. 默认只读取目标、直接项目自有依赖、实际配置/数据结构和最小测试；搜索和依赖扩展应由证据驱动。
5. 默认只做最小修改，保护注释、公共接口、兼容入口和用户未提交的工作；普通 Bug 不因文件大而强制先重构。
6. 按职责和减少读取范围判断拆分，不把 400/200/800 数值当作所有任务的无条件失败门。
7. 索引、架构说明、函数索引和 Bug 记录只在有当前导航或历史价值时创建或更新。
8. 每次验证都报告 `PASS`、`FAIL`、`NOT_RUN`、`NOT_AVAILABLE` 或 `BLOCKED_BY_EXISTING_FAILURE`，不能把未运行的硬件或行为验证写成通过。

### 安装后怎么用

安装后不需要每次复制提示词，也不需要手动指定 Skill 名称。直接用自然语言描述任务即可，AI 应自动判断属于“维护已有项目”还是“创建新项目”，并按对应 Skill 执行局部读取、最小修改、验证和记录。

例如，直接说：

```text
搜索结果把漫画显示到了小说筛选页，请修复并验证。
```

或者：

```text
从零创建一个 Python + Flask 的书源搜索服务。
```

上面只是示意，不是固定格式。`AI修Bug提问模板.md` 仅用于问题复杂、需要交接给其他人，或 AI 明确缺少复现步骤、目标函数、环境和验证命令时补充上下文。没有模板也可以正常使用；信息不足时，Skill 会先请求最小的必要信息，而不是要求用户粘贴整段模板。

### 任务分流

AI 会先判断用户要创建独立实现，还是处理已有项目：

- 没有现有实现证据，用户要求新建服务、路由器、后台程序、守护进程、CLI、自动化工具或完整应用时，使用 `ai-project-bootstrapper`。即使提供目标路径、spec 或资产，只要目标实现尚不存在，仍走 bootstrapper。
- 提供现有项目路径、文件、函数、报错、失败测试、调用路径，或要求解释/审查已有代码时，使用 `ai-project-maintainer`。
- 已有 monorepo 中新增 package 仍属于 maintainer；“看看结构”或模糊的审计请求默认为 `READ_ONLY`。
- 只有明确删除、推送、发布、部署或远端修改目标时，才进入独立的外部动作授权门。
- 两者无法判断时，只询问一次，不扫描当前工作区、不启动子代理、不创建文件。


#### 推荐：一条命令安装

需要 Node.js 和 `npx`：

```bash
npx skills add https://github.com/canglei9527/ai-maintenance-skills
```

只安装一个 Skill 时，可以使用安装器支持的筛选选项：

```bash
npx skills add https://github.com/canglei9527/ai-maintenance-skills --skill ai-project-maintainer
```

单 Skill 安装不会依赖另一个 Skill 目录中的模板或参考文件。

`npx skills` 是独立的安装器，具体选项以 `npx skills --help` 为准。

#### Claude Code

支持插件 marketplace 的版本可以使用：

```text
/plugin marketplace add canglei9527/ai-maintenance-skills
/plugin install ai-maintenance-skills@ai-maintenance-skills
```

#### Codex 和其他插件客户端

在客户端的 Plugins/Marketplace 中搜索 `ai-maintenance-skills`，或使用客户端支持的 GitHub 插件安装入口。仓库提供 `.codex-plugin/plugin.json` 和 `.claude-plugin/plugin.json`。如果客户端不识别插件清单，使用上面的 `npx skills` 安装器。

#### 手工后备

没有 Node.js、插件管理器或安装器时，在目标项目根目录执行：

```bash
mkdir -p .agents
cp -R /path/to/ai-maintenance-skills/skills ./.agents/
```

Windows PowerShell：

```powershell
New-Item -ItemType Directory -Force .agents | Out-Null
Copy-Item -Recurse -Force C:\path\to\ai-maintenance-skills\skills .agents\
```

更完整的项目级/用户级安装、更新、卸载和兼容性说明见 [`docs/installation.md`](docs/installation.md)。

### 导入项目的整理规则

导入或接手已有项目时，AI 不会默认移动、重命名或重构文件。它会先做浅层项目检查，然后询问是否要整理成便于维护的结构。

只有你明确同意后，AI 才会：

1. 展示目标结构、迁移文件和风险。
2. 运行整理前测试、语法/类型检查、构建和启动基线。
3. 在原项目根目录内分批整理，更新引用并保留兼容入口。
4. 运行整理后的同一套测试，再做导入路径和启动检查。
5. 比较整理前后的结果；如果产生回归，停止或恢复失败批次，并如实记录。

选择不整理时，项目结构保持不变，只执行普通维护任务。


### 创建档位

新建项目不会默认生成完整治理树：

- `MICRO`：一次性脚本、教学实验、快速原型或明确要求的单文件工具。保持小而完整，提供输入错误处理、运行方式和最小验证。
- `STANDARD`：普通 CLI、桌面工具、Web 应用、服务和自动化工具。建立明确入口、集中配置、模块职责、README/启动说明和最小测试或等价验证。
- `DURABLE`：只有长期 AI 维护、多人或多 AI 协作、多入口、多工作流，或安全、硬件、财务、数据一致性要求较高时启用。此时才按需建立任务地图、架构主题、操作验证和严格结构证据。

`MICRO` 不自动创建 `AGENTS.md`、`ai-context/`、`FUNCTION_INDEX.md`、Bug 目录、架构空壳或运维空壳。记录必须对应已经实现的行为或真实导航价值；不要为了未来可能的需求预先堆叠文档。

### 验证

本仓库无 npm 运行时依赖。运行：

```bash
node --test scripts/skill-frontmatter.test.mjs
node scripts/verify-skill-repo.mjs
git diff --check
```

`evals/` 提供 V2 路由与行为评估提示，覆盖新建项目档位、已有项目维护路径、只读边界、普通大文件 Bug、结构迁移、生成代码例外和实时验证限制。静态脚本不能替代在实际 AI 客户端中的触发评估，因此发布说明会区分自动验证和人工评估。

### 发布

先在干净的 `main` 工作区完成并提交功能修改。使用 release CLI 做本地预检；默认 dry-run，不会修改文件、提交、推送、创建 tag 或 GitHub Release：

```bash
node scripts/release.mjs --version 0.5.0 --title "Release title" --notes-file release-notes.md
```

确认摘要、版本、变更记录和验证命令后，才执行真实发布：

```bash
node scripts/release.mjs --version 0.5.0 --title "Release title" --notes-file release-notes.md --publish
```

无人值守时增加 `--yes`。工具会同步 3 份插件元数据、验证器版本和 `CHANGELOG.md`，运行验证，创建发布提交和 annotated tag，推送 `main` 与 tag，再通过已认证的 `gh` CLI 创建 Release。网络超时或 GitHub 传播延迟时，已完成步骤不会回滚；核对后用相同参数增加 `--resume --publish --yes` 继续。不会写入或输出 token、凭据或持久状态文件。

实现边界和最小读取路径见 [`scripts/INDEX.md`](scripts/INDEX.md)。

### 仓库边界

这是独立的 Skill 仓库，不包含任何具体应用源码、`.zcode` 会话目录、凭据或生成文件。示例只展示项目记录的结构，不代表某个真实业务项目。

### 许可证

本仓库采用 Apache License 2.0。第三方工具、模型、项目或示例被使用时，请另外检查其许可证和发布要求。

## English

### What it is

A reusable pair of AI software-engineering skills:

- `ai-project-maintainer` for local bug fixes, regressions, module extraction, and focused refactoring in existing projects.
- `ai-project-bootstrapper` for designing and creating a new project or module with explicit responsibilities, interfaces, tests, and records.

The workflow is deliberately stack-agnostic. It favors the smallest relevant context, protects existing work, verifies changes, and records only navigation or historical information that has current value.

### Project Routing And Tiers

- Use `ai-project-bootstrapper` when the requested implementation is new, including when a path, specification, or assets are supplied but no implementation exists.
- Use `ai-project-maintainer` for existing source, tests, routes, symbols, failures, reviews, explanations, fixes, extensions, and approved restructuring. An existing monorepo receiving a package remains maintenance work.
- `READ_ONLY` explains or reviews without file writes. `NORMAL_CHANGE` makes the smallest compatible change. `STRUCTURAL_CHANGE` requires approved scope, a baseline, a responsibility migration table, canonical ownership, old implementation deletion, and evidence. Deletion, publishing, deployment, and remote changes have a separate authorization gate.
- Bootstrapper chooses `MICRO`, `STANDARD`, or `DURABLE`. `MICRO` does not create a full governance tree; `STANDARD` adds only useful project structure; `DURABLE` enables long-term records and strict structural evidence.
- The 400/200/800 values are review thresholds by default, not automatic failures. They become strict only for durable creation, structural work, or an explicit context/file-governance request.
- Verification states are `PASS`, `FAIL`, `NOT_RUN`, `NOT_AVAILABLE`, and `BLOCKED_BY_EXISTING_FAILURE`. Hardware, real-time, and unexercised behavior must be reported separately.

### Install

```bash
npx skills add https://github.com/canglei9527/ai-maintenance-skills
```

For Claude Code, use the marketplace commands when supported:

```text
/plugin marketplace add canglei9527/ai-maintenance-skills
/plugin install ai-maintenance-skills@ai-maintenance-skills
```

Codex and other plugin clients can search for `ai-maintenance-skills` in their Plugins/Marketplace UI or use the repository URL. If a client does not recognize plugin metadata, use `npx skills` or the manual `.agents/skills` fallback described in [`docs/installation.md`](docs/installation.md).

After installation, ask for a bug fix or a new project in natural language. You do not need to paste the prompt template or mention a Skill name.

### Verify

```bash
node --test scripts/skill-frontmatter.test.mjs
node scripts/verify-skill-repo.mjs
git diff --check
```

See `CONTRIBUTING.md`, `ARCHITECTURE.md`, and `evals/` for maintenance and evaluation details.
