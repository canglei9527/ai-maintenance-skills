# Bug 历史

## 初始记录

- 创建日期：2026-08-02
- 项目：`ai-maintenance-skills`
- 技术路线：Markdown Skills + `references/` 按需文档 + Node.js 内置模块静态验证 + Markdown 评估提示；无运行时依赖、无构建步骤。
- 初始目的：把 AI 维护已有项目和创建新项目时的局部读取、最小修改、验证、架构记录和 Bug 追踪流程整理为可复用的开源 Skills。
- 初始验证：待仓库文件创建完成后运行 `node scripts/verify-skill-repo.mjs` 和 `git diff --check`。

## 2026-08-02：修正验证命令执行目录和安装命令

- 现象：首次运行仓库验证时，命令在当前 GARGANTUA 应用目录执行，找不到独立仓库的 `scripts/verify-skill-repo.mjs`；README 的示例复制命令包含多余空格，不能可靠复制到 `./.agents/`。
- 根因：工具默认工作目录仍是原应用目录；README 命令的目标路径写成了 `./ .agents/`。
- 修改文件：`README.md`、`BUG_HISTORY.md`。
- 修改方式：将安装命令改为 `cp -R /path/to/ai-maintenance-skills/.agents/skills ./.agents/`；后续验证命令显式切换到独立仓库目录，避免把两个项目混淆。
- 验证命令：`cd /e/DEEPSEEK ai/ai-maintenance-skills && node scripts/verify-skill-repo.mjs`。
- 验证结果：通过；2 个 Skill frontmatter、21 个必要文件、引用、示例、许可证和仓库边界检查均通过。原应用目录未纳入清单。
- 未验证风险：尚未在实际 AI 客户端中运行三组 Skill 触发评估；`git diff --check` 需在 Git 初始化后执行。


## 2026-08-02：明确模板不是日常使用前提

- 现象：README 的示例提示和提问模板容易让使用者误以为每次修 Bug 或创建项目前都必须复制整段提示。
- 根因：文档只展示了完整提示示例，没有明确区分“Skill 自动触发”和“复杂问题的可选交接模板”。
- 修改文件：`.agents/skills/ai-project-maintainer/SKILL.md`、`.agents/skills/ai-project-bootstrapper/SKILL.md`、`README.md`、`AI修Bug提问模板.md`、`ARCHITECTURE.md`、`AGENTS.md`、`evals/prompts.md`。
- 修改方式：在两个 Skill 增加自动使用说明；README 明确自然语言即可触发；将中文模板和评估提示标为可选辅助材料；在仓库规则中禁止让自动执行依赖模板。
- 验证命令：`node scripts/verify-skill-repo.mjs`、`git diff --check`，并检查两个 `SKILL.md` 的行数和 frontmatter。
- 验证结果：通过；2 个 Skill frontmatter、21 个必要文件、引用、示例、许可证和仓库边界检查均通过；两个 Skill 正文分别为 39 行和 54 行；文本空白检查无错误。
- 未验证风险：尚未在独立 AI 客户端中重复运行自动触发评估。


## 2026-08-02：改进 Skill 安装体验

- 现象：用户需要手工复制 `.agents/skills`，容易误以为必须在每次对话中粘贴模板；安装入口不符合成熟 Skills 仓库的插件和安装器习惯。
- 根因：仓库只有标准 Skills 目录，没有 Claude/Codex 插件清单或统一安装文档，README 还把手工复制放在主要位置。
- 修改文件：`.claude-plugin/marketplace.json`、`.claude-plugin/plugin.json`、`.codex-plugin/plugin.json`、`docs/installation.md`、`README.md`、`ARCHITECTURE.md`、`AGENTS.md`、`CHANGELOG.md`、`scripts/verify-skill-repo.mjs`。
- 修改方式：增加插件元数据；将 `npx skills add https://github.com/canglei9527/ai-maintenance-skills` 作为通用推荐入口；增加 Claude/Codex 客户端说明；保留 `.agents/skills` 手工复制作为兼容后备；验证脚本增加 JSON、Skill 路径和安装文档检查。
- 验证命令：`node scripts/verify-skill-repo.mjs`、`node -e "for (const f of ['.claude-plugin/marketplace.json','.claude-plugin/plugin.json','.codex-plugin/plugin.json']) JSON.parse(require('fs').readFileSync(f))"`、`git diff --check`，并检查 Skill 和安装文档行数。
- 验证结果：通过；2 个 Skill frontmatter、25 个必要文件、3 个插件 JSON、Skill 路径、README 安装命令、安装文档、引用、示例、许可证和仓库边界均通过；文本空白检查无错误。验证脚本曾因匹配条件过窄误报，已放宽为检查“模板可选且不是每次必填”的等价语义后通过。
- 未验证风险：不同客户端对插件 manifest 字段和 `npx skills` 可选参数的支持可能随版本变化；文档明确要求优先查看客户端或安装器当前帮助。

## 2026-08-02：补全中英文仓库和插件描述

- 现象：GitHub About 和插件元数据描述只有英文，中文用户在仓库页或插件安装界面无法直接理解用途。
- 根因：初始插件化发布只关注安装路径和英文生态兼容，没有同步补齐中文展示文案。
- 修改文件：`.claude-plugin/marketplace.json`、`.claude-plugin/plugin.json`、`.codex-plugin/plugin.json`、`scripts/verify-skill-repo.mjs`、`CHANGELOG.md`、`BUG_HISTORY.md`。
- 修改方式：将 marketplace、Claude plugin 和 Codex plugin 的主描述、短描述和长描述改为中英文双语；插件版本提升到 `0.2.1`；验证脚本同步检查新版本。
- 验证命令：`node scripts/verify-skill-repo.mjs`、插件 JSON 解析和 `git diff --check`。
- 验证结果：通过；2 个 Skill frontmatter、25 个必要文件、3 个插件 JSON、Skill 路径、README 安装命令、安装文档、引用、示例、许可证和仓库边界均通过；插件 JSON 均显示 `0.2.1` 且描述包含中英文；文本空白检查无错误。
- 未验证风险：GitHub About 描述需要通过 GitHub API 单独更新，不能只靠仓库文件提交。

## 2026-08-02：新建项目默认创建独立目录

- 现象：新建程序时，Skill 只要求检查当前工作区和不要覆盖已有项目，但没有明确要求先创建独立项目文件夹，可能把新项目源码、测试和文档散落到当前父级工作区，与其他项目混在一起。
- 根因：`ai-project-bootstrapper` 的工作流缺少“选择/创建项目根目录”的强制步骤，文档模板和评估提示也没有覆盖目录隔离。
- 修改文件：`.agents/skills/ai-project-bootstrapper/SKILL.md`、`.agents/skills/ai-project-bootstrapper/references/project-docs-template.md`、`evals/prompts.md`、`scripts/verify-skill-repo.mjs`、`.claude-plugin/marketplace.json`、`.claude-plugin/plugin.json`、`.codex-plugin/plugin.json`、`CHANGELOG.md`、`BUG_HISTORY.md`。
- 修改方式：新增 dedicated project root 规则；要求新项目所有源码、测试、配置、文档、资产都放入独立项目目录；模板增加项目根目录示例；评估提示要求检查目录隔离；验证脚本检查规则和模板存在；插件版本升至 `0.2.2`。
- 验证命令：`node scripts/verify-skill-repo.mjs`、插件 JSON 解析、`git diff --check`，并检查 bootstrapper 行数。
- 验证结果：通过；2 个 Skill frontmatter、25 个必要文件、3 个插件 JSON、独立项目根目录规则、模板、评估提示、README、安装文档和仓库边界均通过；文本空白检查无错误。
- 未验证风险：尚未在真实新建项目任务中执行端到端评估。

## 记录格式

以后每次修复或规则缺陷都追加一条，不覆盖历史：

```markdown
## YYYY-MM-DD：简短标题

- 现象：
- 根因：
- 修改文件：
- 修改方式：
- 验证命令：
- 验证结果：
- 未验证风险：
```


## 规则

只有在确认了现象和根因后才记录“已修复”。如果验证失败，保留失败记录并明确当前状态；不要用“应该可以”代替验证结果。
