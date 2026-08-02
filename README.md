# AI Maintenance Skills

可复用的 AI 软件工程 Skills：让项目维护遵循“先理解局部上下文，再做最小修改；修改后验证，并留下可追溯记录”。

[English](#english) | [中文](#中文)

## 中文

### 这是什么

这个仓库提供两个可安装的 Skill：

- `ai-project-maintainer`：维护已有项目，适用于修 Bug、修改函数、排查回归、模块抽离和小范围重构。
- `ai-project-bootstrapper`：创建新项目或新模块，适用于先设计职责、接口、目录和最小测试，再开始写代码。

它们不绑定 Python、JavaScript、React、Flask 或任何具体框架。项目可以使用自己的规则文件；Skill 只要求先读取并遵循它们。

### 核心原则

1. 先读取项目规则、架构说明和 Bug 历史，再定位目标符号。
2. 只读取目标函数、直接依赖、相关配置、数据结构和最小测试；上下文不足时明确询问，不猜测。
3. 默认只做最小修改，保护注释、公共接口、兼容入口和用户未提交的工作。
4. 每次修复运行与风险匹配的最小验证；验证失败时不能宣称完成。
5. 将根因、改动和验证结果追加到 Bug 历史；接口或职责变化时更新架构说明。
6. 首次理解重要模块时更新模块级架构记录，不为每个普通文件制造文档噪音。

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

### 安装

将仓库中的 `.agents/skills/` 复制到项目根目录，或复制到工具支持的用户级 Skills 目录：

```bash
# 在目标项目根目录执行
cp -R /path/to/ai-maintenance-skills/.agents/skills ./.agents/
```

如果你的工具发现目录不同，请把两个 Skill 目录放到该工具的 Skills 目录中，并保留每个目录内的 `SKILL.md` 和 `references/`。

安装后可以直接描述任务，例如：

```text
搜索结果把漫画显示到了小说筛选页，请定位根因并修复。只读取直接依赖和最小测试，修复后记录 Bug 历史。
```

或：

```text
从零创建一个 Python + Flask 的书源搜索服务。先给目录结构和模块职责，再创建代码、测试和项目维护文档。
```

### 项目记录文件

Skill 推荐新项目使用以下文件，但不会强迫已有项目改名：

- `AGENTS.md`：项目特有的 AI 维护边界。
- `ARCHITECTURE.md`：目录、职责、接口、调用关系和维护所需的最小上下文。
- `BUG_HISTORY.md`：创建记录和追加式 Bug 修复记录。
- `AI修Bug提问模板.md`：可选的详细问题交接模板，不是每次使用 Skill 的必填内容。

### 验证

本仓库无 npm 运行时依赖。运行：

```bash
node scripts/verify-skill-repo.mjs
git diff --check
```

`evals/` 提供三组人工评估提示，覆盖已有项目 Bug、已知函数修复和从零创建项目。静态脚本不能替代在实际 AI 客户端中的触发评估，因此发布说明会区分自动验证和人工评估。

### 仓库边界

这是独立的 Skill 仓库，不包含任何具体应用源码、`.zcode` 会话目录、凭据或生成文件。示例只展示项目记录的结构，不代表某个真实业务项目。

### 许可证

本仓库采用 Apache License 2.0。第三方工具、模型、项目或示例被使用时，请另外检查其许可证和发布要求。

## English

### What it is

A reusable pair of AI software-engineering skills:

- `ai-project-maintainer` for local bug fixes, regressions, module extraction, and focused refactoring in existing projects.
- `ai-project-bootstrapper` for designing and creating a new project or module with explicit responsibilities, interfaces, tests, and records.

The workflow is deliberately stack-agnostic. It favors the smallest relevant context, protects existing work, verifies changes, and records root causes instead of guessing.

### Install

Copy `.agents/skills/` into the target project's root or into the user-level skills directory supported by your AI tool. Keep each Skill's `SKILL.md` and `references/` together.

### Verify

```bash
node scripts/verify-skill-repo.mjs
git diff --check
```

See `CONTRIBUTING.md`, `ARCHITECTURE.md`, and `evals/` for maintenance and evaluation details.
