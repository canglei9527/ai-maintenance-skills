# Bug 历史

## 初始记录

- 创建日期：2026-08-02
- 项目：`ai-maintenance-skills`
- 技术路线：Markdown Skills + `references/` 按需文档 + Node.js 内置模块静态验证 + Markdown 评估提示；无运行时依赖、无构建步骤。
- 初始目的：把 AI 维护已有项目和创建新项目时的局部读取、最小修改、验证、架构记录和 Bug 追踪流程整理为可复用的开源 Skills。
- 初始验证：待仓库文件创建完成后运行 `node scripts/verify-skill-repo.mjs` 和 `git diff --check`。

## 2026-08-02：修正验证命令执行目录和安装命令

- 现象：首次运行仓库验证时，命令在当前 GARGANTUA 应用目录执行，找不到独立仓库的 `scripts/verify-skill-repo.mjs`；README 的示例复制命令包含多余空格，不能可靠复制到 `./.agents/`。
- 根因：工具默认工作目录仍是原应用目录；README 命令的目标路径写成了 `./ .agents/`。
- 修改文件：`README.md`、`BUG_HISTORY.md`。
- 修改方式：将安装命令改为 `cp -R /path/to/ai-maintenance-skills/.agents/skills ./.agents/`；后续验证命令显式切换到独立仓库目录，避免把两个项目混淆。
- 验证命令：`cd /e/DEEPSEEK ai/ai-maintenance-skills && node scripts/verify-skill-repo.mjs`。
- 验证结果：通过；2 个 Skill frontmatter、21 个必要文件、引用、示例、许可证和仓库边界检查均通过。原应用目录未纳入清单。
- 未验证风险：尚未在实际 AI 客户端中运行三组 Skill 触发评估；`git diff --check` 需在 Git 初始化后执行。


## 2026-08-02：明确模板不是日常使用前提

- 现象：README 的示例提示和提问模板容易让使用者误以为每次修 Bug 或创建项目前都必须复制整段提示。
- 根因：文档只展示了完整提示示例，没有明确区分“Skill 自动触发”和“复杂问题的可选交接模板”。
- 修改文件：`.agents/skills/ai-project-maintainer/SKILL.md`、`.agents/skills/ai-project-bootstrapper/SKILL.md`、`README.md`、`AI修Bug提问模板.md`、`ARCHITECTURE.md`、`AGENTS.md`、`evals/prompts.md`。
- 修改方式：在两个 Skill 增加自动使用说明；README 明确自然语言即可触发；将中文模板和评估提示标为可选辅助材料；在仓库规则中禁止让自动执行依赖模板。
- 验证命令：`node scripts/verify-skill-repo.mjs`、`git diff --check`，并检查两个 `SKILL.md` 的行数和 frontmatter。
- 验证结果：通过；2 个 Skill frontmatter、21 个必要文件、引用、示例、许可证和仓库边界检查均通过；两个 Skill 正文分别为 39 行和 54 行；文本空白检查无错误。
- 未验证风险：尚未在独立 AI 客户端中重复运行自动触发评估。


## 2026-08-02：改进 Skill 安装体验

- 现象：用户需要手工复制 `.agents/skills`，容易误以为必须在每次对话中粘贴模板；安装入口不符合成熟 Skills 仓库的插件和安装器习惯。
- 根因：仓库只有标准 Skills 目录，没有 Claude/Codex 插件清单或统一安装文档，README 还把手工复制放在主要位置。
- 修改文件：`.claude-plugin/marketplace.json`、`.claude-plugin/plugin.json`、`.codex-plugin/plugin.json`、`docs/installation.md`、`README.md`、`ARCHITECTURE.md`、`AGENTS.md`、`CHANGELOG.md`、`scripts/verify-skill-repo.mjs`。
- 修改方式：增加插件元数据；将 `npx skills add https://github.com/canglei9527/ai-maintenance-skills` 作为通用推荐入口；增加 Claude/Codex 客户端说明；保留 `.agents/skills` 手工复制作为兼容后备；验证脚本增加 JSON、Skill 路径和安装文档检查。
- 验证命令：`node scripts/verify-skill-repo.mjs`、`node -e "for (const f of ['.claude-plugin/marketplace.json','.claude-plugin/plugin.json','.codex-plugin/plugin.json']) JSON.parse(require('fs').readFileSync(f))"`、`git diff --check`，并检查 Skill 和安装文档行数。
- 验证结果：通过；2 个 Skill frontmatter、25 个必要文件、3 个插件 JSON、Skill 路径、README 安装命令、安装文档、引用、示例、许可证和仓库边界均通过；文本空白检查无错误。验证脚本曾因匹配条件过窄误报，已放宽为检查“模板可选且不是每次必填”的等价语义后通过。
- 未验证风险：不同客户端对插件 manifest 字段和 `npx skills` 可选参数的支持可能随版本变化；文档明确要求优先查看客户端或安装器当前帮助。

## 2026-08-02：补全中英文仓库和插件描述

- 现象：GitHub About 和插件元数据描述只有英文，中文用户在仓库页或插件安装界面无法直接理解用途。
- 根因：初始插件化发布只关注安装路径和英文生态兼容，没有同步补齐中文展示文案。
- 修改文件：`.claude-plugin/marketplace.json`、`.claude-plugin/plugin.json`、`.codex-plugin/plugin.json`、`scripts/verify-skill-repo.mjs`、`CHANGELOG.md`、`BUG_HISTORY.md`。
- 修改方式：将 marketplace、Claude plugin 和 Codex plugin 的主描述、短描述和长描述改为中英文双语；插件版本提升到 `0.2.1`；验证脚本同步检查新版本。
- 验证命令：`node scripts/verify-skill-repo.mjs`、插件 JSON 解析和 `git diff --check`。
- 验证结果：通过；2 个 Skill frontmatter、25 个必要文件、3 个插件 JSON、Skill 路径、README 安装命令、安装文档、引用、示例、许可证和仓库边界均通过；插件 JSON 均显示 `0.2.1` 且描述包含中英文；文本空白检查无错误。
- 未验证风险：GitHub About 描述需要通过 GitHub API 单独更新，不能只靠仓库文件提交。

## 2026-08-02：新建项目默认创建独立目录

- 现象：新建程序时，Skill 只要求检查当前工作区和不要覆盖已有项目，但没有明确要求先创建独立项目文件夹，可能把新项目源码、测试和文档散落到当前父级工作区，与其他项目混在一起。
- 根因：`ai-project-bootstrapper` 的工作流缺少“选择/创建项目根目录”的强制步骤，文档模板和评估提示也没有覆盖目录隔离。
- 修改文件：`.agents/skills/ai-project-bootstrapper/SKILL.md`、`.agents/skills/ai-project-bootstrapper/references/project-docs-template.md`、`evals/prompts.md`、`scripts/verify-skill-repo.mjs`、`.claude-plugin/marketplace.json`、`.claude-plugin/plugin.json`、`.codex-plugin/plugin.json`、`CHANGELOG.md`、`BUG_HISTORY.md`。
- 修改方式：新增 dedicated project root 规则；要求新项目所有源码、测试、配置、文档、资产都放入独立项目目录；模板增加项目根目录示例；评估提示要求检查目录隔离；验证脚本检查规则和模板存在；插件版本升至 `0.2.2`。
- 验证命令：`node scripts/verify-skill-repo.mjs`、插件 JSON 解析、`git diff --check`，并检查 bootstrapper 行数。
- 验证结果：通过；2 个 Skill frontmatter、25 个必要文件、3 个插件 JSON、独立项目根目录规则、模板、评估提示、README、安装文档和仓库边界均通过；文本空白检查无错误。
- 未验证风险：尚未在真实新建项目任务中执行端到端评估。

## 2026-08-02：导入项目整理必须先确认并验证

- 现象：导入已有项目时，原维护规则没有专门规定“是否整理”的确认步骤，也没有规定整理前后必须对比测试结果，容易在未经同意时移动文件，或整理后引入回归而未被识别。
- 根因：`ai-project-maintainer` 只有普通局部修复和模块抽离流程，没有把导入项目整理作为高风险结构变更单独处理。
- 修改文件：`.agents/skills/ai-project-maintainer/SKILL.md`、`.agents/skills/ai-project-maintainer/references/maintenance-workflow.md`、`evals/prompts.md`、`scripts/verify-skill-repo.mjs`、`README.md`、`docs/installation.md`、`ARCHITECTURE.md`、`AGENTS.md`、`.claude-plugin/marketplace.json`、`.claude-plugin/plugin.json`、`.codex-plugin/plugin.json`、`CHANGELOG.md`、`BUG_HISTORY.md`。
- 修改方式：增加导入项目浅层检查和明确询问；用户同意后先建立测试/语法/构建/启动基线，再分批整理、更新引用并执行整理后回归；区分已有失败、整理引入的失败和环境失败；验证失败时停止或恢复失败批次；插件版本升至 `0.2.3`。
- 验证命令：`node scripts/verify-skill-repo.mjs`、插件 JSON 解析和 `git diff --check`，并同步用户级 maintainer Skill。
- 验证结果：通过；2 个 Skill frontmatter、25 个必要文件、3 个插件 JSON、导入整理确认/基线/回归/恢复规则、评估提示、README、安装文档和仓库边界均通过；关键规则检索通过；文本空白检查无错误。
- 未验证风险：尚未在真实导入项目上执行端到端整理评估；不同技术栈的基线命令需要按项目实际配置选择。

## 2026-08-02：修复新建程序被误判为已有项目维护

- 现象：用户描述“根据 GLM 渠道状态选择分组、错误时切换分组、低倍率优先、后台监测”的独立路由程序需求时，先触发了 `ai-project-maintainer`，开始尝试扫描当前工作区和寻找已有分组逻辑；用户实际要求的是新建程序。
- 根因：maintainer 的触发描述过宽，bootstrapper 的触发描述过窄；没有任务分流门，也没有规定在意图未确定前禁止扫描和启动子代理。当前工作区非空进一步放大了误判。
- 修改文件：`.agents/skills/ai-project-maintainer/SKILL.md`、`.agents/skills/ai-project-bootstrapper/SKILL.md`、`evals/prompts.md`、`scripts/verify-skill-repo.mjs`、`README.md`、`ARCHITECTURE.md`、`AGENTS.md`、`.claude-plugin/marketplace.json`、`.claude-plugin/plugin.json`、`.codex-plugin/plugin.json`、`CHANGELOG.md`、`BUG_HISTORY.md`。
- 修改方式：收紧 maintainer 为“必须有已有项目证据”；扩展 bootstrapper 到独立服务、路由器、守护进程、CLI 和自动化工具；增加任务分流规则；歧义时只问一次；加入 GLM 路由器、已有文件路径和歧义请求三个评估场景；验证脚本检查分流边界。
- 验证命令：`node scripts/verify-skill-repo.mjs`、插件 JSON 解析、`git diff --check`，并用 `rg` 检查分流关键文本。
- 验证结果：通过；2 个 Skill frontmatter、25 个必要文件、3 个插件 JSON、维护/新建分流边界、独立项目目录、导入整理规则、3 个分流评估场景和仓库边界均通过；文本空白检查无错误。验证器曾因空格/连字符匹配差异误报，已修正后通过。
- 未验证风险：无法在静态脚本中真正模拟模型 Skill 竞争触发；需要在新会话中用原始 GLM 路由器提示进行人工评估。

## 2026-08-02：增加两阶段上下文读取边界

- 现象：读取架构说明后，AI 仍可能把模块职责表误解为逐文件读取清单，继续遍历同目录或整个项目源码；“直接依赖”和“相关配置”也可能被递归展开。
- 根因：原 Skill 只描述“先读架构、再读目标和直接依赖”，没有定义 `project_root`、目标锚点、阶段边界、搜索上限、一跳依赖和扩大范围条件；项目架构记录也没有单独的函数索引入口。
- 修改文件：`.agents/skills/ai-project-maintainer/SKILL.md`、`.agents/skills/ai-project-maintainer/references/maintenance-workflow.md`、`.agents/skills/ai-project-maintainer/references/project-record-templates.md`、`.agents/skills/ai-project-bootstrapper/SKILL.md`、`.agents/skills/ai-project-bootstrapper/references/project-docs-template.md`、`README.md`、`docs/installation.md`、`ARCHITECTURE.md`、`AGENTS.md`、`evals/prompts.md`、`scripts/verify-skill-repo.mjs`、插件元数据和版本记录。
- 修改方式：增加 `ai-context/` 两阶段读取协议；把架构和函数索引定义为定位索引；默认排除依赖、缓存、生成物、vendor 和秘密文件；搜索最多 50 个命中、默认打开 12 个候选文件并只追踪一跳；只有明确证据才按目录、package、项目根逐层扩大；新项目模板生成根 `AGENTS.md` 和 `ai-context/` 记录。
- 验证命令：`node scripts/verify-skill-repo.mjs`、插件 JSON 解析、`git diff --check`、本机用户级 Skill 与源仓库 SHA-256 对比。
- 验证结果：通过；`node scripts/verify-skill-repo.mjs`、插件 JSON 解析、`git diff --check` 和用户级/源仓库 SHA-256 对比均通过。
- 未验证风险：提示词可以约束默认行为，但不能替代工具层路径白名单；用户明确要求全仓审计时仍可进行全量扫描。

## 2026-08-04：修复安装漏项并压缩运行时上下文

- 现象：`ai-project-maintainer` 的 `description` 含未加引号的冒号，`npx skills` 会跳过该 Skill；仓库验证器仍误报 frontmatter 有效。单独安装 bootstrapper 时，它引用 maintainer 目录中的模板，形成断链。两份 `SKILL.md` 还重复承载按需细节，增加每次触发的上下文成本。
- 根因：frontmatter 仅用正则检查字段外形，没有按安装器可接受的 YAML 子集解析；标准源目录和插件路径仍使用旧的 `.agents/skills/`；bootstrapper 没有保持引用自包含；核心流程与复杂分支未充分做渐进披露。
- 修改文件：`skills/ai-project-maintainer/`、`skills/ai-project-bootstrapper/`、`scripts/skill-frontmatter.mjs`、`scripts/skill-frontmatter.test.mjs`、`scripts/verify-skill-repo.mjs`、插件清单、CI、安装/架构/贡献/变更文档和评估提示。
- 修改方式：迁移标准源到 `skills/`；用双引号保护 description；增加严格、无依赖的 frontmatter 解析与回归测试；检查自包含引用和运行时预算；将复杂维护分支保留在本 Skill 的 `references/` 中按需读取；移除无效插件 `hooks` 字段并将版本升至 `0.3.0`。
- 验证命令：`node --test scripts/skill-frontmatter.test.mjs`；`node scripts/verify-skill-repo.mjs`；两份官方 `quick_validate.py`；官方 `validate_plugin.py .`；插件 JSON 解析；`git diff --check`；`npx.cmd skills add . --list`；隔离的全量/单 Skill 安装与 SHA-256 对比；maintainer 和 bootstrapper 独立前向测试。
- 验证结果：4 个 frontmatter 回归测试通过；仓库验证、两份 Skill 官方校验、插件官方校验、3 份 JSON 和空白检查通过；安装器发现 2 个 Skill，全量及单独安装均完整且源/安装文件哈希一致；maintainer fixture 2 个测试通过，bootstrapper fixture 4 个测试、编译和 CLI 冒烟通过。`SKILL.md` 字符数分别从 12,036 降至 3,326（72.4%）和从 8,394 降至 3,240（61.4%）。
- 未验证风险：精确 `o200k_base` token 统计因词表下载 TLS 失败而未完成；字符降幅不等同于精确 token 降幅。GitHub URL 安装需在推送后复验。


## 2026-08-06：发布步骤分散且网络中断难恢复

- 现象：版本同步、验证、提交、push、标签和 GitHub Release 需要分步手工执行；网络超时后难以判断已完成阶段，容易漏推 `main`、漏推 tag 或漏建 Release。
- 根因：仓库只有内容验证脚本，没有版本元数据同步、Git/GitHub 发布编排、有限重试或由远端状态推导的恢复路径。
- 修改文件：`scripts/release*.mjs`、`scripts/INDEX.md`、`.github/workflows/verify.yml`、`scripts/verify-skill-repo.mjs`、`AGENTS.md`、`CONTRIBUTING.md`、`README.md`、`ARCHITECTURE.md`。
- 修改方式：新增无依赖 Node release CLI。默认 dry-run 只做本地预检；`--publish` 才同步版本与 changelog、运行验证、提交、push、创建 annotated tag 和通过已认证 `gh` 创建 Release。Git/GitHub 网络操作使用有限指数退避；中断后保留完成阶段并使用 `--resume` 从 Git tag、提交与 Release 状态继续，不保存凭据或持久状态。
- 验证命令：`node --test scripts/skill-frontmatter.test.mjs scripts/release.test.mjs`；`node scripts/verify-skill-repo.mjs`；`git diff --check`；隔离 Git fixture 上的 `node scripts/release.mjs --version 0.5.0 --title "Dry run" --notes-file release-notes.md`。
- 验证结果：10 个 Node 离线测试通过；仓库验证通过；`git diff --check` 通过；隔离 fixture dry-run 保持工作区不变且未创建 `v0.5.0` tag。
- 未验证风险：本轮不执行真实 `--publish`、远端 tag 或 GitHub Release API 调用；真实认证、权限和网络传播将在首次发布时由工具的 preflight 与重试逻辑覆盖。

## 2026-08-16：DURABLE 强制默认和完成报告格式导致 AI 响应质量下降

- 现象：部分 AI 使用 Skill 后回复变得机械、臃肿，或在简单问答后自动创建 `ai-context/` 目录，或遇到大文件就中断实际任务转而输出完整结构债务分析报告，或为 MICRO 脚本也建立治理目录。
- 根因：(1) Maintainer SKILL.md"默认以 DURABLE 级别维护所有项目"规则无差别要求每次任务完成后维护 `ai-context/INDEX.md`，READ_ONLY 和单文件 bug 修复也不例外；(2) Bootstrapper workflow.md"默认对新项目使用 DURABLE"导致简单脚本也创建 AGENTS.md + ai-context/ + 路由树；(3) SKILL.md 的"必须报告 ACCUMULATING_STRUCTURAL_DEBT"措辞让 AI 在大文件 bug 修复时中断任务输出完整职责图；(4) 完成报告格式无分级，所有任务强制输出相同的8字段结构化代码块。
- 修改文件：`skills/ai-project-maintainer/SKILL.md`、`skills/ai-project-maintainer/references/fast-path.md`、`skills/ai-project-bootstrapper/SKILL.md`、`skills/ai-project-bootstrapper/references/workflow.md`。
- 修改方式：将 Maintainer 索引维护改为触发条件制——本次任务新增文件/目录/入口/路由（且源文件总数 > 1）或完成 STRUCTURAL_CHANGE 时才更新/新建 INDEX.md，READ_ONLY、单文件 bug 修复、仅改实现细节、MICRO 脚本不触发；ACCUMULATING_STRUCTURAL_DEBT 改为附注在完成报告"未完成与风险"字段，不中断任务；完成报告新增粒度说明（READ_ONLY 简单问答直接给结论，1-2 文件小改动内联摘要，复杂变更才用完整格式）；Bootstrapper 移除 DURABLE"默认档位"标签，不确定时默认 STANDARD，DURABLE 仅在用户明确提到长期 AI 维护/多人协作/安全关键时使用。
- 验证方式：对 V0（原版）、V1（仅按已有 ai-context/ 触发）、V2（触发条件版）三个规则版本用 7 个 eval 场景打分，满分 14。V0：7/14；V1：9/14（新增模块、长期项目场景失分，永不自动建立索引）；V2：12/14；V2 + MICRO 豁免（项目源文件 > 1 条件）：14/14。
- 验证结果：`node scripts/verify-skill-repo.mjs` PASS；SKILL.md 行数在 200 行预算内；4 个 eval 场景验证通过。
- 未验证风险：未在真实 AI 客户端进行端到端前向测试；"源文件总数 > 1"的判断依赖 AI 自行估计，边界情况（恰好1个文件的项目）行为未覆盖。

以后每次修复或规则缺陷都追加一条，不覆盖历史：

```markdown
## YYYY-MM-DD：简短标题

- 现象：
- 根因：
- 修改文件：
- 修改方式：
- 验证命令：
- 验证结果：
- 未验证风险：
```


## 规则

只有在确认了现象和根因后才记录“已修复”。如果验证失败，保留失败记录并明确当前状态；不要用“应该可以”代替验证结果。
