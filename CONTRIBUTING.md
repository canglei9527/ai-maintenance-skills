# 贡献指南

感谢贡献。这个仓库的目标是提供小而可靠的 AI 维护 Skills，而不是堆积项目专用规则。

## 开始前

1. 阅读 `AGENTS.md`、`ARCHITECTURE.md` 和 `BUG_HISTORY.md`。
2. 确认变更属于通用维护流程、参考模板、评估或验证脚本。
3. 不要提交 `.zcode/`、会话记录、个人配置、令牌、私钥、`.env` 或真实项目源码。

## 修改 Skill

- 保持 frontmatter 的 `name` 与目录名一致。
- `description` 要同时说明触发场景和 Skill 要完成的工作；不要只写抽象口号。
- 正文优先写执行顺序和决策边界，具体表格和长模板放到 `references/`。
- 保留项目无关的表达。若规则只适用于某个框架或团队，应放到示例或单独 Skill，而不是污染通用 Skill。
- 不以更多大写的 MUST/NEVER 代替清晰的原因和行动步骤。
- 修改触发语义时，至少在 `evals/prompts.md` 增加或调整一个评估提示。

## 验证

在仓库根目录运行：

```bash
node scripts/verify-skill-repo.mjs
git diff --check
```

然后用 `evals/` 的提示在实际支持 Skill 的客户端中进行人工评估，检查：是否触发、是否先读取局部上下文、是否保护未提交修改、是否验证并记录结果。

如果验证失败，修正后再次运行。不要在提交信息或 README 中把“未运行”写成“通过”。

## 提交内容

提交说明应简短且说明行为变化，例如：

```text
maintainer: clarify dependency boundary for bug fixes
```

结构、Skill 名称、引用路径、安装方式或许可证变化时，同步更新 `ARCHITECTURE.md`、`README.md` 或 `BUG_HISTORY.md`。新文件必须经过内容检查后再提交。

## Pull Request

PR 描述至少包括：

- 变更目的和触发场景。
- 受影响的 Skill、参考文件或验证脚本。
- `node scripts/verify-skill-repo.mjs` 和 `git diff --check` 的结果。
- 人工评估使用的提示和结果；没有运行的部分及原因。
- 是否改变公共安装路径、Skill 名称或仓库发布内容。
