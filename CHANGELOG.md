# 变更记录

## 0.4.6 - 2026-08-24

### 背景

- `NORMAL_CHANGE` 中的“最小兼容修改”原本用于限制 Bug 修复和配置调整的无关范围，但表述过于宽泛，可能让 AI 把明确的界面现代化需求也压缩成换颜色、加动画。
- 这种处理没有改变信息架构、布局密度或交互流程，无法解决用户真正指出的体验问题。

### 变更

- 将普通维护路径中的规则拆分为“修复和配置调整”与“设计改进和体验优化”两类。
- Bug 修复、配置调整和聚焦行为修正仍遵循最小兼容修改，避免借题发挥地重构无关代码。
- 用户明确要求现代化界面、改进用户体验或优化交互流程时，允许重设计布局、信息层级、空间利用、状态可见性和 UI 组件结构。
- 明确禁止只换主题色或添加动画就宣称完成界面现代化；表层装饰必须服务于已经解决的布局和交互问题。

### 兼容性与边界

- 设计改进可以重构 UI 布局和样式架构，但仍需保持数据格式、API 契约和核心功能行为兼容。
- 本版本只调整 AI 维护规则，不修改任何具体应用的界面实现。
- 结构性 UI 重做仍需要按任务范围建立基线、验证主要工作流，并区分行为改动和视觉改动。

### 验证

- `node --test scripts/tests/skill-frontmatter.test.mjs scripts/tests/release.test.mjs`：10/10 通过。
- `node scripts/verify-skill-repo.mjs`：仓库验证通过。
- `git diff --check`：通过。

## 0.4.5 - 2026-08-24

### 背景

- 维护任务可能只读取若干小文件，却因为重复的命令输出、差异内容和远程响应持续累积，最终耗尽 AI 上下文。
- 原有规则限制了搜索命中数、候选文件数和依赖跳数，但没有限制单次输出大小，也没有累计预算。

### 变更

- 在 `ai-project-maintainer/SKILL.md` 增加输出预算门：单次读取默认不超过 150 行 / 15 KB，单次命令输出默认不超过 8 KB，累计工具输出达到约 40 KB 时先总结再继续。
- 在 `references/fast-path.md` 增加具体的读取、命令、累计输出、差异、远程响应以及二进制/压缩文件处理规则。
- 大型或脏仓库优先使用 `git diff --stat` / `git diff --shortstat`，避免把完整工作树差异一次性载入上下文。
- 远程 HTML/JSON 只保留有限的已解压文本片段；`.gz`、`.zip`、图片、PDF 等文件不得直接作为文本读取。

### 兼容性与边界

- 保留原有 50 个搜索命中、12 个候选文件和一跳依赖限制。
- 预算达到后要求先总结和判断证据是否足够，不会把普通维护任务自动升级为全量扫描。
- 这些规则约束 AI 的读取方式，不改变项目源代码、运行时 API 或公开安装入口。

### 验证

- `node --test scripts/tests/skill-frontmatter.test.mjs scripts/tests/release.test.mjs`：10/10 通过。
- `node scripts/verify-skill-repo.mjs`：仓库验证通过。
- `git diff --check`：通过。

## 0.4.4 - 2026-08-16

### 维护行为修正

- 索引维护改为触发条件制：只有新增文件、目录、公共入口或稳定任务路由，且项目源文件总数大于 1，或完成 `STRUCTURAL_CHANGE` 时，才更新或新建 `ai-context/INDEX.md`。
- `READ_ONLY`、单文件 Bug 修复、仅改实现细节和 `MICRO` 单文件脚本不再因为默认维护等级而强制创建索引。
- 完成报告按任务规模分级：简单单文件问答直接给结论，1–2 文件的小改动使用简短摘要，复杂变更才使用完整结构化格式。
- `ACCUMULATING_STRUCTURAL_DEBT` 改为完成报告“未完成与风险”中的非阻断附注，不再无故中断聚焦修复流程。
- `ai-project-bootstrapper` 的不确定默认档位从 `DURABLE` 调整为 `STANDARD`；只有长期 AI 维护、多人协作、多入口或高风险约束才使用 `DURABLE`。

### 影响范围

- 修改 `ai-project-maintainer` 和 `ai-project-bootstrapper` 的路由、索引维护和完成报告规则。
- 保留结构变更的授权门和验证要求；本版本只是减少不必要的文档生成和过长报告，不降低结构变更的证据标准。

## 0.4.3 - 2026-08-13

**基础设施**

- 测试代码与源代码分离：将 `scripts/release.test.mjs` 和 `scripts/skill-frontmatter.test.mjs` 移入 `scripts/tests/` 子目录，源码与测试不再混放。
- frontmatter 解析器新增可选 `version` 字段：SKILL.md 中可声明 `version: "x.y.z"`，方便使用者识别已安装的 skill 版本。
- 同步更新 `scripts/verify-skill-repo.mjs` 中的必要文件路径清单和版本号。
- 同步更新 `.github/workflows/verify.yml` 测试命令路径。
- 新增 Windows 一键发布脚本 `release.bat`，含防误发布到错误仓库的前置校验。

**Token 优化（约节省 15–18%，无行为变化）**

- 删除 `verification-and-safety.md` 中 `Real-Time Verification` 章节（约 20 行，TMS320/CCS 实时固件专用，当前用户不需要）。
- 删除 `verification-and-exceptions.md` 中 `TMS320, CCS, And Real-Time Firmware` 整章（约 25 行，同上）。
- 删除 `fast-path.md` 末尾 `Completion Evidence` 代码块（12 行，与 SKILL.md 完成报告完全重复）。
- 删除 `structural-change.md` 中 `Large-File Normal Fix Boundary` 章节（5 行，已被 fast-path.md 维护性检查点覆盖）。
- 删除 `workflow.md` 中 `Current Records Only` 章节（7 行，与 SKILL.md Immutable Rules 重复）。
- 删除 `navigation-and-budgets.md` 顶部 `Contents` 目录章节（8 行，AI 不需要目录）。
- 将所有章节标题和规则散文从中英混写统一为中文；保留所有英文代码标识符（`PASS`、`FAIL`、`NOT_RUN` 等）和仓库验证器要求的 anchor 字符串不变。
- 压缩 Bootstrapper SKILL.md 各档位长描述，去除与 references 文件重复的规则条目。


- 新增累积性结构债务检测：普通修复不再把结构问题压成“文件较大”一笔带过。
- Maintainer 增加维护性检查点：手写文件超过 400 行、入口/UI/控制器/facade 超过 200 行、或存在反复补丁历史时，先检查变更边界是否有多个独立变更原因、多工作流、混合职责、独立可测分组或反复扩展同一超大所有者。
- 命中信号时报告 ACCUMULATING_STRUCTURAL_DEBT，并给出具体责任图：当前所有者、候选规范所有者、接口、消费者、独立验证和预期读取范围缩减；聚焦修复仍按 NORMAL_CHANGE 完成，不强制无关迁移。
- 用户明确要求停止堆补丁、解决 God Class 或让项目更容易维护时，直接进入 STRUCTURAL_CHANGE，不再用最小补丁加“未来重构”空头承诺答复。
- 新增两个评估场景（Repeated Patches Grow A God Class、Focused Fix Encounters Accumulating Debt）和规则回归测试，锁定上述路由与检查点行为。

## 0.4.1 - 2026-08-07

- 本次 v0.4.1 发布同步两个项目 Skill 的 V2 重构，目标是让新建、维护、只读分析和结构迁移有清晰边界，让规则按需加载，并让完成声明与真实验证证据一致。
- 新建项目分流：当目标实现尚不存在时，即使用户提供了路径、spec、素材或空目录，仍由 ai-project-bootstrapper 负责；已有 monorepo 中新增 package、修改现有源码或解释现有项目，则由 ai-project-maintainer 负责。路径和附件只用于定位，不自动授予写入权限。
- Bootstrapper 档位：引入 MICRO、STANDARD、DURABLE 三档。MICRO 适用于一次性脚本、教学实验、快速原型和明确要求的单文件工具，保持单文件并只提供必要的运行错误处理和最小验证，不自动创建完整治理树。STANDARD 适用于普通 CLI、桌面工具、Web 应用、服务和自动化工具，建立明确入口、集中配置、模块职责、启动说明和最小测试。DURABLE 只在长期 AI 维护、多人或多 AI 协作、多入口、多工作流，或安全、硬件、财务、数据一致性要求较高时启用，并按需建立任务路由、架构主题、操作验证和严格结构证据。
- Maintainer 路径：引入 READ_ONLY、NORMAL_CHANGE、STRUCTURAL_CHANGE，并将 EXTERNAL_ACTION 作为删除、推送、发布、部署和远端变更的独立授权门。READ_ONLY 只解释、审查和诊断，不写源码、测试、Bug 记录、索引、分支或备份。NORMAL_CHANGE 采用最小兼容修改，普通 Bug 修复不因目标文件较大而强制先重构。STRUCTURAL_CHANGE 仅在明确要求或批准范围内执行结构迁移。
- 结构迁移证据：结构任务必须先建立基线，明确批准范围、消费者、公共入口和兼容路径，并使用职责迁移表记录旧所有者、新规范所有者、消费者、兼容路径、旧实现删除证据和验证结果。只有完整职责真正迁移、消费者和测试跟随新所有者、旧实现被删除且证据充分时，才能报告 Completed for approved scope；仅搭目录、添加 facade、复制代码或保留影子实现只能报告 Scaffolded 或 Partially extracted。
- 预算策略：400 行手写实现、200 行入口/facade/兼容模块/索引，以及约 800 行典型维护读取路径现在默认是审查阈值，不是所有任务的无条件失败门。只有 DURABLE、STRUCTURAL_CHANGE、明确要求上下文优化或明确要求文件治理时，才可将其作为严格验收门；拆分仍须证明职责独立、接口清晰、可独立验证并实际减少读取范围，同时避免 facade 链、循环依赖、重复类型和重复规则。
- 导航和记录：任务地图、目录索引、函数索引、架构主题和 Bug 记录只在具有当前导航价值或历史价值时创建或更新。不会因为 Skill 被加载就创建空文档树，不会将索引当作逐文件读取清单，也不会把未来可能的需求预先写成项目记录。
- 例外和规范所有权：生成代码、vendor、声明式数据、框架约束、ABI、内存布局和实时控制代码按实际所有权和验证约束处理。多实现仅在公共接口、唯一选择逻辑、统一配置来源、一致性测试和明确所有权都存在时共存；同一业务规则不得在多个位置复制。
- TMS320/CCS 和实时固件：涉及控制 ISR、ADC/PWM 链、CLA Task、保护逻辑、启动代码、中断向量、链接段或必须内联算法时，必须按需确认 ISR 周期和触发源、ADC SOC/EOC、EPWM 时序、CLA/CPU 与 Shared/Message RAM 数据所有权、CODE_SECTION/DATA_SECTION 和 linker .cmd、优化与内联、最坏执行时间及保护优先级。不能仅凭行数或主机测试宣称实时安全。
- 验证状态：验证结果统一使用 PASS、FAIL、NOT_RUN、NOT_AVAILABLE、BLOCKED_BY_EXISTING_FAILURE。语法/静态分析、编译、链接、仿真、目标板下载、实时波形、ISR 执行时间、保护触发时序和外部服务检查分别报告；未运行、硬件不可用或已有失败不能写成通过。
- Reference 迁移：删除旧的 project-docs-template.md、maintenance-workflow.md 和 project-record-templates.md，新增并从两个 SKILL.md 一跳直达 V2 references。Bootstrapper 使用 workflow.md、navigation-and-budgets.md、verification-and-exceptions.md；Maintainer 使用 fast-path.md、structural-change.md、verification-and-safety.md，并在 v2-migration-notes.md 中保留详细迁移说明。
- 仓库验证：本地 Node.js frontmatter/release 测试通过，技能仓库验证通过，git diff --check 通过，V2 入口和 reference 链接已检查。当前未在真实 AI 客户端重新执行交互式 12 项 forward-test，未运行目标项目硬件、仿真、实时波形或部署验证；这些限制在发布说明中明确标注。

## 0.4.0 - 2026-08-06

- 强制新建项目和已有项目整理使用 100-300 行的单一职责手写文件。
- 将 400 行手写源码、200 行入口/索引/上下文文件和 800 行维护读取路径设为硬闸门。
- 要求源码目录索引、根任务路由、重复实现检查、所有权检查和至少三条维护路径验收。
- 增加独立的评估清单、项目文档模板和维护记录模板，确保低上下文规则可执行、可验证。
- 同步 Claude、Codex 插件及 marketplace 版本到 0.4.0。

## 0.3.0 - 2026-08-04

- 将 Skill 标准源目录从 `.agents/skills/` 迁移到插件兼容的 `skills/`，保持 GitHub 和 `npx skills add` 入口不变。
- 修复 `ai-project-maintainer` 中含未引用冒号的非法 YAML frontmatter，恢复两个 Skill 的完整发现和安装。
- 将两个 `SKILL.md` 精简为边界门、核心闭环、完成条件和条件引用，复杂规则继续在各自 `references/` 中按需加载。
- 移除 bootstrapper 对 maintainer 模板的跨 Skill 引用，保证两个 Skill 可以单独安装。
- 增加无依赖 frontmatter 解析器和 Node 回归测试；验证器现在检查严格元数据、自包含引用和运行时上下文预算。
- 修复 Codex/Claude 插件清单路径，移除无效 `hooks` 字段，并同步版本到 `0.3.0`。
- 清理重复评估清单，更新安装、架构、贡献和验证文档。

## 0.2.5 - 2026-08-02

- 增加两阶段读取协议：先确认 `project_root`、`target_anchor`、读取范围和排除范围，再按目标锚点读取源码。
- 明确 `ARCHITECTURE.md` 和 `FUNCTION_INDEX.md` 是索引，不是逐文件读取清单。
- 增加搜索命中、候选文件和一跳依赖上限，禁止普通维护任务无范围递归扫描。
- 增加按目标目录、所属 package、项目根目录逐层扩大的证据门槛。
- 新项目文档模板增加 `ai-context/`、`FUNCTION_INDEX.md` 和根目录 `AGENTS.md` 读取边界。
- 同步插件版本到 `0.2.5`。

## 0.2.4 - 2026-08-02

- 增加任务分流门，区分新建独立程序和已有项目维护。
- 独立服务、路由器、后台程序、守护进程、CLI 和自动化工具在没有已有项目证据时优先进入 bootstrapper。
- maintainer 要求已有项目路径、文件、函数、报错、测试或调用路径等证据；没有证据时不得扫描当前工作区。
- 意图不明确时只询问一次，不启动子代理、不创建文件。
- 增加 GLM 渠道智能路由器场景的分流评估和静态验证。
- 同步插件版本到 `0.2.4`。

## 0.2.3 - 2026-08-02

- 导入或接手已有项目时，先进行浅层检查并询问是否整理，不再默认移动或重命名文件。
- 用户明确同意整理后，先运行整理前基线，再分批整理并运行整理后回归测试。
- 区分整理前已有失败、整理引入的回归和环境失败；验证失败时停止或恢复失败批次。
- 增加导入项目整理的参考工作流、评估提示和验证规则。
- 同步插件版本到 `0.2.3`。

## 0.2.2 - 2026-08-02

- 新项目初始化时必须先确定或创建独立项目根目录。
- 要求源码、测试、配置、文档和资产都放在该项目目录下，避免混入父级工作区或其他项目源码。
- 更新项目文档模板、评估提示和验证脚本，检查项目根目录隔离规则。
- 同步插件版本到 `0.2.2`。

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
