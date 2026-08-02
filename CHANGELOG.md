# 变更记录

## 0.2.1 - 2026-08-02

- 将 GitHub 仓库简介和插件元数据描述改为中英文双语。
- 同步 Claude marketplace、Claude plugin 和 Codex plugin 的展示描述。
- 更新验证脚本中的插件版本检查到 `0.2.1`。

## 0.2.0 - 2026-08-02

- 增加 Claude marketplace、Claude plugin 和 Codex plugin 元数据。
- 增加 `npx skills add` 推荐安装入口和统一安装文档。
- 将手工复制 `.agents/skills` 降为无安装器环境的兼容后备。
- 强化安装后直接使用自然语言请求、无需复制模板的说明。
- 扩展仓库验证脚本，检查插件 JSON、Skill 路径、README 安装命令和安装文档。

## 0.1.0 - 2026-08-02

- 创建 `ai-project-maintainer`，覆盖局部读取、最小修改、回归测试、失败验证和 Bug 历史记录。
- 创建 `ai-project-bootstrapper`，覆盖目录设计、模块职责、接口、测试和项目文档初始化。
- 添加架构说明、项目规则、中文提问模板、示例项目文档和评估提示。
- 添加无依赖的 Node.js 仓库验证脚本。
- 采用 Apache License 2.0。
