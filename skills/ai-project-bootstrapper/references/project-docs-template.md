# 新项目轻量文档模板

按项目实际情况填写，不保留无意义的占位内容。索引用于定位，不是逐文件读取清单，也不能作为打开全部模块的理由。

## 推荐结构

```text
{workspace}/{project}/
├── AGENTS.md
├── ai-context/
│   ├── INDEX.md
│   ├── FUNCTION_INDEX.md
│   ├── architecture/
│   │   └── {topic}.md
│   ├── bugs/
│   │   ├── INDEX.md
│   │   └── {topic}.md
│   └── operations/
│       └── verification.md
├── src/
│   ├── INDEX.md
│   └── {small responsibility files}
├── tests/
│   ├── INDEX.md
│   └── {focused tests}
├── config/
└── scripts/
```

旧项目的单文件 `ARCHITECTURE.md` 和 `BUG_HISTORY.md` 可以继续使用；不要为了套用此结构而删除或重写现有记录。

## `AGENTS.md`

```markdown
# 项目 AI 维护规则

## 修改前
- 先读取 `ai-context/INDEX.md`，再按任务映射读取必要主题；不要默认全文读取所有项目记录。
- 从用户给出的文件、符号、错误或测试建立目标锚点，只读取目标、一跳项目自有依赖和最小相关测试。
- 保留未提交的用户修改，不读取或输出凭据、`.env`、Token、Cookie 和其他秘密。

## 项目边界
- 必须保持：{安全、数据、兼容或行为不变量}
- 禁止：{项目特有禁区}

## 验证
- 最小测试：`{command}`
- 语法/类型检查：`{command}`
- 环境或外部验证：`{command}`（{前置条件和是否需要确认}）
```

## 源码目录 `INDEX.md`

每个维护中的源码目录都放一个短索引。索引只用于选择文件，不复制实现细节。

```markdown
# {目录名} 文件索引

| 文件 | 单一职责 | 对外接口 | 一跳依赖 | 何时读取 | 行数预算 |
|---|---|---|---|---|---|
| `{file}` | `{responsibility}` | `{symbols}` | `{one file or none}` | `{task/symptom}` | `100-300，最大400` |
```

索引、入口和 facade 本身不超过 200 行。任何日常维护路径不能指向超过 400 行的手写源码文件。

## 项目任务到文件路由

在 `ai-context/INDEX.md` 的“按任务读取”中直接列源码路径，不只列架构主题：

```markdown
| 任务或现象 | 第一源码文件 | 可选一跳依赖 | 最小测试 | 主题记录 | 实现读取行数 |
|---|---|---|---|---|---|
| `{task}` | `{src/small-file}` | `{src/dependency or none}` | `{test}` | `{architecture/bug note}` | `<=800` |
```

至少为三个高频维护任务填写真实路径和行数。超过 800 实现行说明边界仍太粗，完成前必须继续拆分。

## `ai-context/INDEX.md`

```markdown
# 项目上下文索引

## 摘要
{技术路线、主要入口和一句话调用流}

## 硬约束
- {不能被普通修改破坏的行为或安全边界}

## 按任务读取
| 任务或现象 | 第一源码文件 | 可选一跳依赖 | 最小测试 | 首读主题 | 实现读取行数 |
|---|---|---|---|---|---|
| {task} | `{src/file}` | `{src/dependency or none}` | `{command or test}` | `architecture/{topic}.md` | `<=800` |

## 兼容记录
{旧文档的位置和何时需要查阅；没有则省略}
```

## `ai-context/FUNCTION_INDEX.md`

```markdown
# 函数索引

| 符号 | 源文件 | 职责 | 一跳项目自有依赖 | 最小测试 |
|---|---|---|---|---|
| `{symbol}` | `{path}` | `{responsibility}` | `{path or none}` | `{test}` |
```

只记录高频维护入口、公共函数、类、路由、命令和配置入口。普通文件读取不更新索引。

## `ai-context/architecture/{topic}.md`

```markdown
# {主题}

## 职责与边界
{相关模块、公共接口和不变量}

## 调用流
{只记录理解该主题所需的一跳关系}

## 保守失败或兼容规则
{失败时必须保持的行为}

## 验证入口
- `{test or command}`
```

## `ai-context/bugs/INDEX.md`

```markdown
# Bug 主题索引

| 主题 | 适用现象 | 记录文件 |
|---|---|---|
| {topic} | {errors or behavior} | `{topic}.md` |
```

Bug 主题文件按日期追加“现象、根因、修改、验证、风险”，不要把完整记录复制到索引。

## `ai-context/operations/verification.md`

```markdown
# 验证入口

| 层级 | 命令 | 覆盖范围 | 前置条件 |
|---|---|---|---|
| 快速 | `{command}` | {unit/syntax/type} | {none} |
| 集成 | `{command}` | {integration path} | {service/dependency} |
| 外部 | `{command}` | {browser/device/production} | {credentials/approval} |

未运行外部检查时必须在结束报告中明确说明。
```
