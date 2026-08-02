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
