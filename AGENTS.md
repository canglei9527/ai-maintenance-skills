# AI 项目维护规则

这是 `ai-maintenance-skills` 自身的维护约定。通用执行流程在 `.agents/skills/ai-project-maintainer/SKILL.md` 和 `.agents/skills/ai-project-bootstrapper/SKILL.md` 中；本文件只记录本仓库特有的边界。

## 修改前

1. 先读取 `AGENTS.md`、`ARCHITECTURE.md` 和 `BUG_HISTORY.md`，再定位目标文件或函数。
2. 修改前检查 Git 工作区；不得覆盖、回滚或删除用户已有的未提交修改。
3. 只读取目标 Skill、它直接引用的参考文件、验证脚本和最小相关评估提示。不要递归扫描当前应用项目或把其他项目文件复制进来。
4. 维护模板和评估提示是可选辅助材料；Skill 的自动触发和执行不能依赖用户复制模板。修改 Skill 的触发描述、工作流或参考模板时，检查是否仍保持通用，不要加入某个应用的专用路径、业务名或隐含前提。

## 修改中

1. 默认只修改一个 Skill 或一个文档模块；跨模块修改时说明原因。
2. 保留已有文档、示例和接口约定；新增内容要有明确维护价值。
3. Skill 正文保持简洁，细节放在 `references/`，让运行时按需读取。
4. 不把 `.zcode/`、会话记录、个人配置、生成文件或外部项目源码提交到仓库。

## 验证和发布

1. 运行 `node scripts/verify-skill-repo.mjs` 和 `git diff --check`。
2. 增加或修改 Skill 后，至少用 `evals/prompts.md` 中的一组提示检查触发语义和输出要求；没有独立 Skill 运行时测试时，明确标记为人工评估。
3. 修复验证脚本或文档问题后，在 `BUG_HISTORY.md` 记录现象、根因、修改和验证结果。
4. 更改目录、Skill 名称、引用关系或安装方式时，更新 `ARCHITECTURE.md` 和 `README.md`。
5. 新增依赖、修改公开接口、改变许可证或发布到 GitHub 前，说明影响范围并检查文件清单。
6. 推送前确认仓库地址、可见性和提交内容；禁止把凭据、令牌或本机路径发布到远程仓库。
