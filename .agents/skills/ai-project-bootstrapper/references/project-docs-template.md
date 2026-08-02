# 新项目文档模板

以下是与语言和框架无关的最小项目文档。按项目实际情况填写，不要保留无意义的占位文字。

## Project root / 项目根目录

新建程序时先确定独立项目根目录，例如：

```text
{workspace}/book-source-search/
├── AGENTS.md
├── ai-context/
│   ├── ARCHITECTURE.md
│   ├── FUNCTION_INDEX.md
│   └── BUG_HISTORY.md
├── src/
├── tests/
├── config/
└── scripts/
```

不要把新项目文件直接散落在父级工作区，也不要和已有无关项目源码混写。只有当用户明确指定一个已有空目录作为目标时，才直接在该目录内初始化项目。根目录的 `AGENTS.md` 保留为客户端自动发现入口；详细架构、函数索引和 Bug 历史放在 `ai-context/`。

## `AGENTS.md`

```markdown
# 项目 AI 维护规则

## 读取边界

架构文档和函数索引是定位索引，不是逐文件读取清单。看到索引列出的模块或函数，不代表要打开同目录的全部源码。

### 阶段一：建立边界

- `project_root`：当前目录；不得通过扫描父 workspace 猜测其他项目。
- `target_anchor`：用户提供的文件、函数、类、路由、命令、配置键、错误文本、失败测试、堆栈位置或复现步骤。
- 先读取本项目到目标目录路径上的 `AGENTS.md`，再读取 `ai-context/ARCHITECTURE.md`、`ai-context/FUNCTION_INDEX.md`、`ai-context/BUG_HISTORY.md`。
- 只查看根目录浅层清单和入口/配置/包管理/测试文件的名称或元数据。
- 如果根目录或目标锚点不明确，先提问，不扫描整个 workspace。

### 阶段二：按锚点读取

- 只读取目标实现、目标路径一跳的项目自有调用方或被调用方、实际使用的配置/数据结构和最小相关测试。
- `ai-context/ARCHITECTURE.md` 和 `FUNCTION_INDEX.md` 是索引，不能作为打开全部模块的理由。
- “直接依赖”只表示一跳项目自有依赖；不得递归展开完整 import graph 或 call graph。

## 搜索闸门

- 搜索前声明目的、项目根、精确搜索词和预期命中类型。
- 优先精确路径、函数名、类名、路由、配置键、事件名或错误文本。
- 单次最多 50 个命中，默认最多打开 12 个候选文件，默认只追踪一跳。
- 达到上限时先收窄搜索词或路径；不得自动改成全仓搜索。
- 普通维护任务禁止从父 workspace 搜索，禁止使用无范围的 `rg ... .`、`find .` 或完整目录枚举后逐个打开结果。

## 默认排除

`.git`、`node_modules`、`vendor`、`build`、`dist`、`out`、缓存、coverage、生成文件、二进制、媒体、`.env`、凭据、Cookie、Token 和无关 sibling 项目默认不读。

## 允许扩大范围

只有调用路径、共享适配层、跨进程/服务/数据边界、公共 API/schema/事件契约、明确的测试或堆栈错误、monorepo 消费者或迁移入口证明当前范围不足时，才按“目标目录 -> 所属 package -> 项目根目录”一次扩大一层。每次扩大前说明证据、新边界和新增文件必要性。全仓扫描只在用户明确要求审计、迁移盘点或依赖清查时执行。

## 修改前

- 未提交修改保护：{具体要求}
- 不覆盖、回滚或删除非本次创建的文件。

## 修改中

- 保留：{接口、注释、兼容入口}
- 默认修改范围：{函数/模块}
- 禁止事项：{项目特有禁区}

## 验证

- 最小测试：`{command}`
- 语法/类型检查：`{command}`
- 结构或接口变化的额外检查：`{command}`
- 失败时的记录方式：{项目约定}
```

## `ai-context/ARCHITECTURE.md`

```markdown
# 架构说明

## 技术路线
{语言、框架、运行时、数据存储和部署方式}

## 目录结构
{只列重要目录和文件；这不是要求逐个读取的清单}

## 模块职责
| 模块 | 职责 | 对外接口 | 函数索引 | 允许读取边界 |
|---|---|---|---|---|
| `{path}` | `{responsibility}` | `{functions}` | `FUNCTION_INDEX.md#...` | `{target + one-hop owned dependencies + minimal test}` |

## 调用关系
{入口 -> 服务 -> 数据/外部适配器的最小流程；只记录已确认的一跳关系}

## 维护最小上下文
{Bug 修复时需要提供的文件、函数、配置、复现和测试}

## 扩大范围条件
{哪些证据允许从目标目录扩大到 package 或项目根目录}
```

## `ai-context/FUNCTION_INDEX.md`

```markdown
# 函数索引

| 符号 | 源文件 | 职责 | 一跳项目自有依赖 | 最小测试 | 扩大范围条件 |
|---|---|---|---|---|---|
| `{functionName}` | `src/path/to/file.ext` | `{responsibility}` | `{path/to/dependency}` | `tests/path/to/test.ext` | `{evidence}` |
```

索引只用于从目标符号定位源码。函数移动、公共接口变化、直接依赖变化、测试入口变化或扩大条件变化时更新；普通文件读取不更新索引。

## `ai-context/BUG_HISTORY.md`

```markdown
# Bug 历史

## 初始记录
- 创建日期：{YYYY-MM-DD}
- 技术路线：{一句话}

## YYYY-MM-DD：{标题}
- 现象：
- 根因：
- 修改文件：
- 验证命令：
- 验证结果：
- 未验证风险：
```
