# AI 项目维护规则

这是 `ai-maintenance-skills` 自身的维护约定。通用执行流程在 `skills/ai-project-maintainer/SKILL.md` 和 `skills/ai-project-bootstrapper/SKILL.md` 中；本文件只记录本仓库特有的边界。

## 修改前

1. 先读取 `AGENTS.md`、`ARCHITECTURE.md` 和 `BUG_HISTORY.md`，再定位目标文件或函数。对外部项目遵守目标目录到项目根目录的规则路径；若存在 `ai-context/`，优先读取其中的架构、函数索引和 Bug 历史，架构索引不是逐文件读取清单。
2. 修改前检查 Git 工作区；不得覆盖、回滚或删除用户已有的未提交修改。
3. 只读取目标 Skill、它直接引用的参考文件、验证脚本和最小相关评估提示。不要递归扫描当前应用项目或把其他项目文件复制进来。
4. 维护模板和评估提示是可选辅助材料；Skill 的自动触发和执行不能依赖用户复制模板。修改 Skill 的触发描述、工作流或参考模板时，检查是否仍保持通用，不要加入某个应用的专用路径、业务名或隐含前提。
5. 导入已有项目时，结构整理属于高风险结构变更：必须先询问用户并获得明确同意；同意后先运行整理前基线，再整理并运行整理后回归测试。
6. 修改安装方式、Skill 路径或插件能力时，同时检查 `.claude-plugin/`、`.codex-plugin/`、`README.md`、`docs/installation.md` 和验证脚本。
7. 在任务分流未确定前，不扫描当前项目、不启动子代理、不创建文件；没有现有项目证据的独立程序需求应进入 bootstrapper。

## 修改中

1. 默认只修改一个 Skill 或一个文档模块；跨模块修改时说明原因。
2. 保留已有文档、示例和接口约定；新增内容要有明确维护价值。
3. Skill 正文保持简洁，细节放在 `references/`，让运行时按需读取。
4. 不把 `.zcode/`、会话记录、个人配置、生成文件或外部项目源码提交到仓库。

## 验证和发布

1. 运行 `node --test scripts/skill-frontmatter.test.mjs scripts/release.test.mjs`、`node scripts/verify-skill-repo.mjs` 和 `git diff --check`。
2. 增加或修改 Skill 后，至少用 `evals/prompts.md` 中的一组提示检查触发语义和输出要求；没有独立 Skill 运行时测试时，明确标记为人工评估。
3. 修复验证脚本或文档问题后，在 `BUG_HISTORY.md` 记录现象、根因、修改和验证结果。
4. 更改目录、Skill 名称、引用关系或安装方式时，更新 `ARCHITECTURE.md` 和 `README.md`。
5. 功能改动先独立提交，发布时使用 `node scripts/release.mjs --version X.Y.Z --title "..." --notes-file release-notes.md` 查看 dry-run。只有核对摘要后才增加 `--publish`；无人值守时还必须增加 `--yes`。
6. 发布工具只使用当前仓库、受控版本文件和已认证的 `gh` CLI，不读取或输出凭据。推送或 Release 阶段中断时，保留已完成步骤，核对状态后用相同参数增加 `--resume`；不得删除 tag、回滚已推送提交或覆盖用户文件。
7. 推送前确认仓库地址、可见性和提交内容；禁止把凭据、令牌或本机路径发布到远程仓库。
