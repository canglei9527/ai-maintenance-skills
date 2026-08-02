# 架构说明

## 项目定位

`ai-maintenance-skills` 是一组可安装的 AI 软件工程 Skills，用于把项目维护流程固定为“局部理解、最小修改、可验证、可追溯”。它不是某个应用的业务代码，也不要求使用特定编程语言或框架。

技术路线：Markdown Skill 指令 + 按需加载的参考模板 + Node.js 内置模块静态验证 + Markdown 评估提示。Skill 放在 `.agents/skills/`，兼容遵循该目录约定的 AI 工具；仓库本身不依赖 npm 包或构建系统。

## 目录和职责

| 路径 | 职责 |
|---|---|
| `.agents/skills/ai-project-maintainer/SKILL.md` | 已有项目的 Bug 修复、局部修改、模块抽离和验证流程 |
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
用户维护请求
  -> ai-project-maintainer
       -> 项目 AGENTS.md / 架构 / Bug 历史
       -> 目标函数及直接依赖
       -> 最小测试与验证
       -> Bug 历史、架构记录

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
- 输出：最小代码或文档变更、验证结果、根因说明、记录更新和未验证风险。
- 重要约束：不猜测缺失上下文，不宣称未验证的修复，不破坏用户未提交修改。

### `ai-project-bootstrapper`

- 输入：项目目标、核心功能、技术偏好、运行环境和验收标准。
- 输出：目录结构、模块接口、实现、最小测试、项目文档和启动/验证说明。
- 重要约束：先设计职责和调用关系，避免单文件堆积和无理由依赖。

## 后续维护最小上下文

遇到 Bug 时优先提供：现象、复现步骤、期望结果、完整报错、目标文件/函数（如已知）和最小测试命令。不要为了满足记录规则上传整个项目；只需补充能证明调用路径或验证结果的局部上下文。
