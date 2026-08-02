# 架构说明

## 项目定位

`ai-maintenance-skills` 是一组可安装的 AI 软件工程 Skills，用于把项目维护流程固定为“局部理解、最小修改、可验证、可追溯”。它不是某个应用的业务代码，也不要求使用特定编程语言或框架。

技术路线：Markdown Skill 指令 + Claude/Codex 插件元数据 + `npx skills` 安装入口 + 按需加载的参考模板 + Node.js 内置模块静态验证 + Markdown 评估提示。`.agents/skills/` 是跨工具兼容后备目录；仓库本身不依赖 npm 运行时包或构建系统。

## 目录和职责

| 路径 | 职责 |
|---|---|
| `.claude-plugin/marketplace.json` | Claude marketplace 注册信息和插件入口 |
| `.claude-plugin/plugin.json` | Claude 插件元数据、能力和 Skill 路径 |
| `.codex-plugin/plugin.json` | Codex 插件元数据、能力和 Skill 路径 |
| `docs/installation.md` | 一条命令、插件、手工后备安装及更新卸载说明 |
| `.agents/skills/ai-project-maintainer/references/maintenance-workflow.md` | 维护场景决策表、读取边界和验证分级 |
| `.agents/skills/ai-project-maintainer/references/project-record-templates.md` | 架构记录和 Bug 历史的可复制格式 |
| `.agents/skills/ai-project-bootstrapper/SKILL.md` | 新项目或新模块的结构设计、创建、测试和记录流程 |
| `.agents/skills/ai-project-bootstrapper/references/project-docs-template.md` | 新项目文档的最小模板和填写规则 |
| `examples/minimal-project/` | 与语言无关的项目文档示例，不包含真实业务代码 |
| `evals/prompts.md` | 触发和行为评估用的真实提示 |
| `evals/rubric.md` | 评估结果的通过标准和常见失败模式 |
| `scripts/verify-skill-repo.mjs` | 检查文件、frontmatter、引用和仓库边界 |
| `README.md` | 安装、触发场景、验证和贡献入口 |
| `CONTRIBUTING.md` | 修改 Skill、运行评估和提交变更的规则 |
| `AGENTS.md` | 本仓库自身的维护边界 |
| `BUG_HISTORY.md` | 创建记录与后续问题修复记录 |
| `AI修Bug提问模板.md` | 可选的详细问题交接模板，不是 Skill 自动使用的必填提示 |

## 调用关系

```text
用户请求
  -> 任务分流门
       -> 有现有项目证据 -> ai-project-maintainer
       -> 独立程序/服务/路由器/CLI/自动化需求 -> ai-project-bootstrapper
       -> 无法判断 -> 只询问一次，不扫描、不创建文件

安装器/插件客户端
  -> `.claude-plugin/`、`.codex-plugin/` 或 `npx skills`
       -> `.agents/skills/`
            -> 用户维护请求
                 -> ai-project-maintainer
                      -> 项目 AGENTS.md / 架构 / Bug 历史
                      -> 目标函数及直接依赖
                      -> 最小测试与验证
                      -> Bug 历史、架构记录

导入已有项目
  -> 浅层项目地图与基线能力检查
  -> 询问是否整理
  -> （同意）整理前基线 -> 分批结构整理 -> 整理后回归测试
  -> 架构说明与 Bug 历史

用户新建项目请求
  -> ai-project-bootstrapper
       -> 需求与工作区检查
       -> 模块职责和接口设计
       -> 代码、测试、项目文档
       -> 启动和验证命令
```

两个 Skill 可以先后使用：bootstrapper 负责建立边界，maintainer 负责后续局部维护。维护 Skill 不强制 bootstrapper 生成的文件名；它会识别项目的等价文档并遵循现有约定。

## 对外接口

### `ai-project-maintainer`

- 输入：已有项目中的维护请求，以及可选的文件、函数、复现步骤、错误和期望行为。
- 导入场景：先做浅层项目地图并询问是否整理；未获明确同意不移动文件；同意后执行整理前基线、分批迁移和整理后回归验证。
- 输出：最小代码或文档变更、验证结果、根因说明、记录更新和未验证风险。
- 重要约束：不猜测缺失上下文，不宣称未验证的修复，不破坏用户未提交修改。

### `ai-project-bootstrapper`

- 输入：项目目标、核心功能、技术偏好、运行环境和验收标准。
- 输出：目录结构、模块接口、实现、最小测试、项目文档和启动/验证说明。
- 重要约束：先选择或创建独立项目根目录；源码、测试、配置、文档和资产都放在该目录内，不散落到父级工作区。

## 后续维护最小上下文

遇到 Bug 时优先提供：现象、复现步骤、期望结果、完整报错、目标文件/函数（如已知）和最小测试命令。不要为了满足记录规则上传整个项目；只需补充能证明调用路径或验证结果的局部上下文。
