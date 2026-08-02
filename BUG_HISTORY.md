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
