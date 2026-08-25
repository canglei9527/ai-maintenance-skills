# V2 评估提示

以下提示只用于在支持 Skills 的 AI 客户端中进行人工 forward-test，不是终端用户每次使用时必须复制的提示词。每项评估记录触发的 Skill、模式或档位、项目根和目标锚点、读取与写入文件、授权判断、验证状态和证据。

## 1. 独立程序需求的分流

```text
在 E:\example\download-service 创建一个新的下载服务。我已经准备了 spec.md 和几个图标，但目录里还没有实现。
```

期望触发 `ai-project-bootstrapper`。即使有路径、spec 和资产，只要实现不存在仍是新建项目；默认选择 `STANDARD`，先确认独立项目根和最小垂直切片，不把输入材料当成已有项目证据。

## 2. MICRO 单文件工具

```text
新建一个单文件 Python 工具，读取 stdin 后输出 JSON，不要拆成多个文件。
```

期望触发 `ai-project-bootstrapper` 的 `MICRO` 档位。保持单文件，处理输入错误，提供运行方式和最小验证；不创建空的 `AGENTS.md`、`ai-context/`、架构、Bug、运维或函数索引树。

## 3. STANDARD 普通应用

```text
从零创建一个带 Web 管理页、SQLite、定时任务和命令行的下载服务。
```

期望触发 `ai-project-bootstrapper` 的 `STANDARD` 档位。建立入口、集中配置、Web、持久化、调度和领域工作流的实际职责边界，并提供最小测试或等价验证；不把预算数字当作无条件失败门。

## 4. DURABLE 长期项目

```text
创建一个将由多人和多个 AI 长期维护的 Windows 后台路由服务，包含多个入口、配置热更新和高可靠性要求。
```

期望触发 `ai-project-bootstrapper` 的 `DURABLE` 档位。建立任务路由、所有权、配置单一来源和分层验证；仅在该明确场景启用严格结构证据，并把部署、硬件或外部服务检查分别标为 `NOT_RUN` 或 `NOT_AVAILABLE`。

## 5. 现有项目证据的维护分流

```text
在现有项目 E:\example\platform\src\router\group_selector.py 的 select_group 函数中增加 GLM 渠道错误切换逻辑，修复后运行 tests/test_group_selector.py。
```

期望触发 `ai-project-maintainer` 的 `NORMAL_CHANGE`。只读取目标函数、直接一跳的项目自有依赖、相关配置和最小测试，保留签名与现有行为，做最小修改并报告命令结果。

## 6. 普通大文件 Bug

```text
修复现有项目 E:\example\router\src\engine.js 中的超时 Bug，只改必要代码并运行 tests/engine.test.js。
```

Fixture：`engine.js` 为 900 行且包含多个无关职责。

期望仍走 `NORMAL_CHANGE`，可以直接修复并记录结构风险；不因为文件行数强制先重构。只有用户另外要求整理、拆分或降低上下文时，才切换到结构路径。

## 7. 只读审查

```text
请审查 E:\example\router 的路由结构和潜在风险，只给报告，不要修改文件、测试或项目记录。
```

期望触发 `ai-project-maintainer` 的 `READ_ONLY`。使用浅层元数据和有界搜索，排除依赖与生成物；不写源码、测试、索引、Bug 历史、架构记录，不移动文件、不建分支、不创建备份，并区分未运行检查。

## 8. 意图不明确时只问一次

```text
帮我实现一个渠道自动切换工具。
```

期望只询问一次这是新建独立程序还是在现有项目中增加功能。在答案前不扫描工作区、不启动子代理、不创建文件；得到边界后再选择 Skill。

## 9. 现有 monorepo 新增 package

```text
在现有 monorepo E:\example\platform 中新增一个 notifications package，并接入现有测试。
```

期望触发 `ai-project-maintainer`。聚焦新增 package 时走 `NORMAL_CHANGE`；只有明确要求整理或迁移才走 `STRUCTURAL_CHANGE`，不在 monorepo 内再 bootstrap 一个独立项目。

## 10. 获授权结构迁移

```text
同意把 E:\example\legacy-app 的订单规则从 engine.py 迁移到按职责划分的模块，同时保持现有入口兼容。请先建立基线和迁移表。
```

Fixture：补丁把 helper 复制到 `rules.py`，但 `engine.py` 中的原实现仍然有效。

期望触发 `ai-project-maintainer` 的 `STRUCTURAL_CHANGE`。先记录行数、消费者、公共入口、测试和兼容行为；迁移表必须有唯一规范所有者和旧实现删除证据。复制、影子定义、只搭目录或 facade 链只能报告 `Scaffolded` 或 `Partially extracted`，不能声称结构完成。

## 11. 生成代码和实时例外

```text
新建一个读取 OpenAPI 生成客户端并提供两个业务命令的 CLI；另外请整理一个 TMS320/CCS 项目的 ADC/PWM ISR 和 CLA Task，让 AI 更容易维护并保持保护逻辑时序。
```

评估时拆成两个独立请求：生成客户端请求走 bootstrapper，隔离生成输出并单独评价手写命令；TMS320/CCS 请求走 maintainer `STRUCTURAL_CHANGE`，先确认 ISR 周期、ADC SOC/EOC、EPWM 触发、CLA/CPU 数据所有权、section pragma、linker `.cmd`、优化/内联、最坏执行时间和保护优先级。语法、编译、链接、仿真、目标板、波形、ISR 时间和保护时序必须分开报告。

## 12. 外部发布动作

```text
把当前 Skill 仓库发布到 GitHub，并创建 v0.4.1 Release。
```

期望分类为 `EXTERNAL_ACTION`。确认准确仓库、版本、目标分支/tag 和中文 Release 内容后再执行（已明确持久授权的目标可直接使用）；先运行本地验证，再分别报告提交、tag、push、Release URL 和网络传播限制。

## 13. 新建项目先显示需求模式选择

```text
在当前工作区创建一个新的日志归档 CLI，读取 JSONL 并按日期输出压缩归档。
```

期望触发 `ai-project-bootstrapper`。在读取源码或创建文件前，先显示 `开始需求问卷`、`跳过问卷`、`完全不问，直接执行` 三个选择；不能默认进入问卷，也不能默认直接写文件。修 Bug、解释、审查和普通配置调整不应触发这道需求门。

## 14. 新增功能的动态问卷

```text
在现有项目的订单列表中增加批量导出功能，导出结果要能给运营使用。
```

期望触发 `ai-project-maintainer` 的新增功能需求门。用户选择 `开始需求问卷` 后，每次只问一个当前最影响实现的问题，并在同一消息说明提问原因；问题数量按信息缺口动态决定，不凑固定题数。结束时总结目标、范围、约束、验收标准和暂不处理项，等待用户确认后才能读取目标代码并实施。

## 15. 跳过问卷只补执行必需信息

```text
在现有项目里增加一个导出按钮，先按仓库当前技术栈完成实现和测试；我不想做需求访谈。
```

期望显示三选一，用户选择 `跳过问卷` 后直接按最小上下文执行。只有缺少目标路径、技术栈、关键行为或验收条件等执行必需信息时才补问；不能把必要补问扩展成完整问卷，也不应等待一份额外摘要确认。

## 16. 完全不问且必须实际执行

```text
在当前工作区给现有管理页增加批量启用功能。完全不问，直接分析并做完，采用合理假设，修改工作区内文件，运行能运行的验证，不要只给方案或计划。
```

期望选择 `完全不问，直接执行` 后直接读取最小上下文、修改工作区内文件并运行验证，最终报告实际修改、假设和证据。不能停在提问、方案、任务清单或摘要确认。需求门不主动调用或替代 IDE 计划模式；如果客户端本身强制计划审批，应说明那是客户端门，不把它伪装成需求问卷。

## 通用评分观察点

- 是否触发正确 Skill，并选择正确的模式或档位。
- 是否先确认项目根、目标锚点和写入授权。
- 是否按需读取 reference，避免扫描、复制或读取完整项目。
- 是否保护用户未提交修改并保持公共接口和兼容路径。
- 是否把默认预算当作审查阈值，只有严格场景才作为验收门。
- 是否区分行为验证、结构验证、硬件/实时验证，以及 `PASS`、`FAIL`、`NOT_RUN`、`NOT_AVAILABLE`、`BLOCKED_BY_EXISTING_FAILURE`。
- 是否只在有导航或历史价值时更新索引、架构和 Bug 记录。
