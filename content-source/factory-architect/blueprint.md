---
title: "agent 软件工厂蓝图"
date: 2026-11-17
tags:
  - agent-engineering
  - software-factory
  - autonomy-levels
  - ui-ux
  - blueprint
source: "https://cursor.com/canvas/store-a29ce92a-6fc0-47dd-87ed-19add9a31dea/b3de5cb1-d420-4bb9-ae14-3313844a917e"
---

# agent 软件工厂蓝图

> 把业内领先团队的真实做法拆成六个问题和一张自主等级表，判断你现在大概在哪一级，给出 8 步落地路线；v2 新增从想法到上线的 8 个阶段，重点讲 UI/UX 怎么交给 agent、怎么自动验证、人怎么高效地看。每步都附可直接复制给 coding agent 的 prompt。

**目录**

- [目标和读法](#goal)
- [先懂这几个词](#terms)
- [1. 自主等级：从每步审批到黑灯工厂](#levels)
  - [第二把尺子：仓库是否适合交给 agent](#readiness)
  - [你现在在哪一级](#where)
- [2. 升到下一级还缺什么](#gap)
  - [黑灯工厂值不值得做](#dark)
- [领先团队实际怎么做](#teams)
- [3. 落地步骤和可复制 prompt](#steps)
- [4. 六个问题逐项分析](#six)
- [补查名单结果](#people)
- [5. 从想法到上线：新项目、新需求和 UI/UX（v2）](#flow)
  - [起步](#kickoff)
  - [需求](#req)
  - [计划](#plan)
  - [设计和审美](#design)
  - [实现](#impl)
  - [UI 验证](#uiverify)
  - [人审](#review)
  - [上线](#launch)
  - [两句话的核实](#quotes)
  - [怎么把人在 UI 上的时间压到最低](#uitime)
  - [移动端怎么验证 UI](#mobile)
  - [对自主等级和 8 步路线的影响](#impact)
- [6. 来源清单](#sources)
- [7. 变更记录](#changelog)

> **一句话结论**
>
> 能把人解放出来的不是更聪明的模型，而是更硬的验证：agent 能把应用真跑起来并交出证据，写代码的不给自己验收，判断规则放在改动碰不到的地方，出错能一步撤回。你现在大概在 L2（推测，待确认）。建议先用 8 步走到 L4b：默认 human-on-the-loop，低风险改动自动合并。黑灯工厂只在满足条件的窄车道上试，不作为整仓目标。UI 方面（v2）：把品味写成规则和检查，让 agent 在模拟器里自己操作并交截图录屏，人只挑方向、看 5 分钟审查包、在真机上摸手感。

## 目标和读法 {#goal}

目标工厂默认是 human-on-the-loop：agent 自己接任务、并行开发、自动验证，你只定目标、做关键审批、处理异常。黑灯工厂（人既不写也不审代码）是最高一级的可选目标，本版认真评估了它的条件和风险，见第 2 部分。

读法：文中数字都是当事人自己说的，标「自述」，没有第三方核实。每条关键结论后写了出处，链接集中在第 5 部分。拿不到的内容明确写「未能获取」。

## 先懂这几个词 {#terms}

| 词 | 是什么 | 为什么重要 |
| --- | --- | --- |
| agent（智能体） | 能自己读文件、跑命令、改代码、看结果再继续的 AI，比如 Claude Code。 | 工厂里干活的是它，人从「写」变成「管」。 |
| human-on-the-loop | 人不在每一步里（in the loop），而是站在流程上方：定目标、设规则、批高风险、处理异常。 | 这是本蓝图的默认目标。 |
| 黑灯工厂（dark factory） | 规格进去、软件出来，人既不写也不审代码。名字来自无人值守的自动化工厂。 | 本蓝图把它当最高级的可选目标认真评估。 |
| 验证闭环 | 给 agent 一个能跑出「通过 / 失败」的检查，它改完自己跑、失败自己修。 | 没有它，人就是测试套件，只能盯着 1 到 2 个 agent。 |
| hooks | Claude Code 在固定时机（如 agent 想结束回合时）自动执行的脚本，由工具强制执行，不靠模型自觉。 | 必须每次都做的检查放这里，比写在说明里可靠。 |
| subagent（子 agent） | 主 agent 派出去的另一个 agent，有自己干净的上下文。 | 适合并行干活，也适合当没看过实现过程的独立审查员。 |
| git worktree | 同一个仓库的多个独立工作目录，每个 agent 一个。 | 多个 agent 同时改代码不会互相覆盖。 |
| CLAUDE.md / AGENTS.md | agent 每次开工自动读的项目说明文件。 | 放 agent 读代码也找不到的知识：验证命令、坑、团队约定。 |
| skill | 一份写好的操作手册（SKILL.md），agent 需要时才加载全文。 | 把「怎么验证」「怎么发版」这类流程固化下来。 |
| MCP | 让 agent 连接外部系统（issue 跟踪、设计稿、模拟器等）的标准接口。 | agent 能拿到的信息和工具越全，越能自己完成任务。 |
| evals（评测集） | 一组带标准答案的任务，用来给 agent 或 skill 打分。 | 改了 prompt、skill、模型之后，靠它判断是变好还是变坏。 |
| Ralph loop | Geoffrey Huntley 提出的技巧：用一个死循环反复把同一份提示词喂给 agent，每轮只做一件事。 | 最简单的「无人值守」形态，也是很多工厂的原型。 |
| 留出场景集（holdout） | 一批端到端用户场景，放在 agent 看不到、改不了的地方，只用来验收。 | 防止 agent 为了交差去改测试。 |
| 数字孪生（digital twin） | 第三方服务（如 Okta、Slack）的行为仿制品。 | 可以大规模、无风险地跑验收。 |

## 1. 自主等级：从每步审批到黑灯工厂 {#levels}

| 等级 | 人做什么 | agent 做什么 | 要具备的条件 |
| --- | --- | --- | --- |
| L0 手写 | 写每一行代码 | 当搜索引擎、偶尔补全 | 无 |
| L1 助手 | 写重要代码，把零碎小活丢给 AI | 写单个测试、注释 | 无 |
| L2 结对（人每步审批） | 主导会话，逐行看、逐步批准 | 在会话里写大部分代码 | 有 CLAUDE.md，知道怎么跑测试 |
| L3 人审 diff | 同时开几个会话，整天审每个 diff | 写绝大部分代码，自己跑检查 | 一条全仓库验证命令；agent 能自查；worktree 隔离 |
| L4a 人看证据，合并仍由人批 | 写规格和完成条件，审计划，看证据包，批准合并 | 无人值守做完、自证，由独立 agent 审查 | agent 能把应用真跑起来并截图；写和审分开；审查规则放在改动碰不到的地方；任务契约和预算；UI 改动附前后截图或录屏审查包 |
| L4b human-on-the-loop | 定目标和风险线，只处理升级和高风险改动，抽查结果 | 自动接活、并行开发，低风险改动通过全部检查后自动合并 | 风险分级加 CODEOWNERS；合并队列；一步回滚；回滚率和事故率有监控；新门禁先观察再强制；UI 只对有基线可比的改动自动合并，新视觉方向仍按 L4a 由人挑、人批 |
| L5 黑灯工厂 | 写规格和验收场景，维护工厂本身，不写也不审代码 | 从接任务到上线、监控全流程 | agent 看不到的留出场景集；依赖服务的数字孪生；没有不可逆环节或都有自动回滚；长期数据证明质量不降；能承受高额 token 预算 |

这张表以 Dan Shapiro 的 0-5 级为主轴（他把 L5 叫黑灯工厂，并说 90% 的「AI 原生」开发者在 L2，几乎所有人卡在 L3）。我把他的 L4 拆成 4a 和 4b：区别在于合并是否还要人批。拆开是因为 Anthropic、Vercel、Cognition 的做法正好分落在这两档，而「低风险自动合并」是 human-on-the-loop 的分界线。条件一列综合自 Anthropic、OpenAI、StrongDM、Addy Osmani 的材料，出处见第 4 部分。

判断能不能升级，Addy Osmani 给了三个问题：做错了多快能知道？能多干净地撤回？靠什么证明做对了？三个答案如果是「很慢、很难、只能信它的总结」，就还不够格。

### 第二把尺子：仓库是否适合交给 agent {#readiness}

| Factory 就绪等级 | 含义 | 例子 |
| --- | --- | --- |
| 1 Functional | 代码能跑，但要手动配置，缺自动校验 | README、linter、类型检查、单元测试 |
| 2 Documented | 有基本文档和流程，部分自动化 | AGENTS.md、devcontainer、pre-commit hooks、分支保护 |
| 3 Standardized | 流程被自动化强制执行；Factory 称这是自主开发的最低门槛 | 集成测试、密钥扫描、分布式追踪、指标 |
| 4 Optimized | 反馈快，数据驱动改进 | CI 反馈快、部署频繁、能识别不稳定的测试 |
| 5 Autonomous | 系统能自我改进，复杂需求自动拆成并行任务 | 自我改进系统 |

上面的自主等级量的是「人管多少」，这把尺子量的是「仓库能不能让 agent 自己验证」。Factory 观察到，agent 表现差通常不是模型的问题，而是环境：没有 pre-commit hooks，agent 要等十分钟 CI 而不是五秒；环境变量没写，agent 只能猜。要升一级，需要通过上一级 80% 的条件。两把尺子要一起看：仓库停在就绪 2 级，人就很难放到 L4。

### 你现在在哪一级 {#where}

- **判断**：L2（结对，每步看、每步批），偶尔接近 L3。推测，待你确认
- **依据**：你每天用 Claude Code 写代码，在写 skill 并关心怎么验证 skill 好不好，自认 agent 工程新手。Shapiro 说大多数 AI 原生开发者在 L2；写 skill 是 L4 的典型动作，说明你已经在往上走
- **仓库就绪度**：未知。lobehub-mobile 的测试、CI、模拟器自动化情况我没看到，第 1 步的 prompt 会让 agent 只读评估

需要你回答的问题：

1. 你现在会逐行看 Claude 改的每一行吗？一天同时开几个会话？有没有让它无人值守跑过超过 30 分钟？
2. lobehub-mobile 有哪些自动检查（单测、类型检查、lint、E2E、CI）？agent 能不能自己在模拟器或 Web 上把应用跑起来并截图？
3. 你的 PR 谁来审、谁有合并权限？哪些改动团队规定必须人看（发版、权限、支付等）？有没有 OTA 热更新这类能快速回滚的发布方式？
4. 每月能接受多少 token 或订阅花费？
5. （v2 新增）lobehub-mobile 是 React Native / Expo 还是原生？有没有 PR 预览（OTA 二维码或测试包）？现在 UI 改动谁看、在什么设备上看？有没有设计师或现成的设计 token？

## 2. 升到下一级还缺什么 {#gap}

| 升级 | 缺什么 | 对应步骤 |
| --- | --- | --- |
| L2 → L3 | agent 能自己判断「做完没有」：一条全仓库验证命令，加上强制执行它的 hook；精简的 CLAUDE.md 写清命令和坑 | 第 1、2 步 |
| L3 → L4a | 不靠你读 diff 也能信结果：agent 能把应用真跑起来交证据；独立 agent 审查；任务契约写清完成条件；worktree 并行；错题本让同样的错不再出现 | 第 3 到 6 步 |
| L4a → L4b | 任务自动来、低风险自动走：issue 或定时触发；按风险分车道；可一步回滚；用回滚率和事故率守住质量；新门禁先观察 | 第 7、8 步 |
| L4b → L5 | 连证据都不用人看：agent 看不到的留出场景集；依赖服务的数字孪生；不可逆环节为零或有自动回滚；几个月的数据证明质量不降；能承受高额 token | 第 8 步的留出场景集是起点 |

### 黑灯工厂值不值得做 {#dark}

**支持的证据**

- ＋ StrongDM 自称不写不审代码，做的还是权限管理这种安全软件；靠代码库外的场景和数字孪生验收
- ＋ OpenAI 团队人审 PR 可选，审查大多在 agent 之间完成（自述）
- ＋ Cognition 说默认从 bug 报告到合并都不需要人，需要判断时才升级（自述）
- ＋ Anthropic 已允许负责人决定哪些低风险改动只靠自动检查合并，并说这条线还在往前移

**反对和风险**

- － Dex Horthy 全面关灯几个月后代码难以维护，最后重写；他认为模型目前维护不了代码质量，而且没有基准能衡量这一点
- － Armin Ronacher 的周末工厂烧了约 40 亿 token、35 小时，没交付任何有价值的东西（自述）
- － T3 Code 的自动合并漏过了坏 PR，用户升级后丢了数据（Julius 自己承认漏了几个坏 PR）
- － Anthropic 自己说还没有「回滚率上升就自动收紧审批」的熔断，工程师希望先有它再扩大零人审范围
- － StrongDM 的口号是每人每天至少 1000 美元 token，Simon Willison 认为这让它更像商业模式问题；Dex 说找不到他们公开的效果数据
- － 移动端特有：已发布的安装包和商店版本收不回（这是我的推断，不是来源原话），这一段必须留给人批

> **评估结论**
>
> 把黑灯工厂当成「按车道逐步扩大」的结果，而不是要一次跳到的目标。哪条车道能关灯，看它能不能同时满足：有 agent 看不到的验收场景、改动能一步撤回、度量证明关灯后回滚率不升。对一个要上应用商店的移动应用，发版环节短期内不该关灯。我同意队友「先开一条能验证、能回滚的全自动车道，其余停在 4 级」的建议，补充一点：这条车道的终点应该是合并进主干和内部测试包，而不是对外发版。

## 领先团队实际怎么做 {#teams}

| 团队 / 人 | 大致等级 | 关键做法（数字为自述） | 出处日期 |
| --- | --- | --- | --- |
| Anthropic Claude Code 团队 | L4b（低风险改动可零人批） | 约 90% 代码由 Claude 写和审；6 到 9 月合并 PR 翻倍多，需回滚的占比降 40% 以上（自述）。风险分三级：低风险自动检查全绿即可合并，中风险 1 人，高风险 2 人；agent 的批准不能顶替人。verify skill 把应用真跑起来；同一检查修 3 轮仍失败就交给人；39 项按 diff 触发的可靠性清单；REVIEW.md 从默认分支读，改动改不了评判它的规则；新门禁分 off / observe / enforce。他们自己说还没有「事故率上升就自动收紧审批」的熔断。 | claude.dev 2026-10-15、2026-11-16 |
| OpenAI（Codex 团队） | L4b 到 L5 边缘 | 5 个月 0 行手写，约 100 万行代码、约 1500 个 PR，3 名工程师起步（自述）。人可以审 PR 但不是必须，审查大多交给 agent 之间。每个 worktree 能启动一份应用和独立的日志指标；单次运行常超过 6 小时。AGENTS.md 约 100 行当目录，知识放 docs/；自定义 lint 强制分层架构；后台任务定期清理 AI 烂代码。Symphony 把 Linear 看板变成总控台，每个工单一个 agent，部分团队落地 PR 增加 500%（自述）。 | openai.com 2026-02-11、2026-04-27 |
| Cursor | L4a 到 L4b | 内部合并的 PR 中 35% 来自云端虚拟机里自主运行的 agent（自述，2026-02）。人看日志、录屏和在线预览而不是 diff。最大的质量决定因素是 agent 有没有完整的开发环境；云端 agent 要配密钥脱敏、网络策略、凭证管理。 | cursor.com 2026-02-26、2026-06-02 |
| Cognition（Devin） | 自称默认自主（L4b，部分 L5） | 2 月博客：每个 PR 仍由人审，Devin 自动修 lint、CI 和审查意见。11 月演讲：默认全自动，从 bug 报告到合并、监控不需要人，需要判断时才升级；一年合并 PR 增长 40 倍、工程师人数增长 2.7 倍（自述）。所有服务能在一台虚拟机里本地跑，第三方服务有 mock，每小时重建快照；Devin 自己维护测试 skill；Android 应用由 agent 维护 44 天，多数日子没有人发消息（自述）。 | cognition.com 2026-02-27；AIE Code 2026-11-12 |
| StrongDM | 自称 L5，公开的黑灯工厂案例 | 规则：代码不能由人写，也不能由人审。验收用放在代码库外的场景（像机器学习里的留出集），用 LLM 判断「满意度」而不是测试全绿；为 Okta、Jira、Slack、Google Docs 等做了数字孪生。口号是每个工程师每天至少花 1000 美元 token。Simon Willison 质疑这个成本；Dex Horthy 说没找到他们公开的效果数据。 | factory.strongdm.ai 2026-02-06 |
| Factory.ai | 卖工厂的公司 | Agent Readiness：9 个支柱、5 级，每级通过 80% 才能升级；在 Droid 里用 /readiness-report 打分。Factory 2.0 把工厂定义为「信号 → 计划 → 构建 → 测试 → 审查 → 发布 → 监控」的闭环。属于产品材料。 | factory.com 2026-01-20、2026-06-15 |
| Vercel（AI SDK） | L4a（每个 PR 都由人合并） | 一个任务一个 agent：分类、复现、修复、审查、文档、回移植。每个 agent 跑在隔离沙箱里，只拿它需要的密钥，网络受限，把所有 issue 和 PR 当攻击者输入。4 周后 25% 到 35% 的合并 PR 由工厂提交，7 月关闭的 issue 75% 以上由工厂关闭（自述）。每次运行标记为成功、有缺陷、被卡住或人工，后三种回流改进工厂。 | vercel.com 2026-08-12 |
| Replit | 产品方 | 专门的测试 subagent 用 Playwright 真点界面，抓「看着能用其实没接上」的 Potemkin 界面；自主运行时长从 20 分钟到 200 分钟以上，测试中位成本每次 0.20 美元（自述）。 | frontier.replit.com 2025-12-15 |
| Amp（Thorsten Ball） | 一线团队 | 每个 agent 一个云端 orb（沙箱），不占本地资源，于是要求 agent 给出「无可辩驳的证据」：端到端测试矩阵、截图表、演示视频。 | ampcode.com 2026-08-04 |
| poteto（pstack） | L4b（可验证的活过夜跑） | 过夜前四个条件：亲手做过一次知道好结果长什么样；agent 有你用的工具和信号；每个阶段能证明自己并能叫停；读过 transcript 并把重复失败变成工具或检查。过夜契约：目标、完成条件、独立 worktree、预先授权、逃生口；每轮一个改动、一次验证、一行决策日志，早上审日志。她自述上月发了 2500 个 PR。 | pstack 指南；X 2026-09-21 |
| T3 Code（Theo、Julius） | L4b，教训明显 | Theo 的 full-send skill 授权 agent 从做完、举证、审查、开 PR、盯 CI 一路到合并，但生产改动和删数据仍要问人。Julius 说 30 小时自动合了近 400 个网页性能 PR（自述），两天后在回复用户时承认调 loop 时漏过了几个坏 PR。 | GitHub；X 2026-10-18、2026-10-20（UTC） |
| yetone（magpie） | L4b | LESSONS.md 自述：代码由 agent 写、审、合并和发版；每晚复盘当天提交，教训按「规则 → 原因 → 证据」记，3 个不同日子出现就升级进 docs/code-standards.md。规范要求修复必须附「撤掉修复就失败」的测试；只看 diff 不算审查；每个会话用自己的 worktree；合并绑定审过的提交。3 个 /loop 并行接活的说法只有二手转述。 | GitHub magpie 仓库 |
| Kent C. Dodds | L4b | npx kcd-skills@latest autopilot 按 13 级阶梯给仓库打分：先「好 PR」（AGENTS.md、验证命令、自验证、PR 模板），再「审查和验证」（ship 循环、按风险配 AI 审查），再「爆炸半径」（开关、回滚、备份），最后持续改进循环；默认只有低风险自动合并。 | GitHub kcd-skills；X 2026-11-15 |

共同规律有六条。第一，agent 必须能看到真实产物（运行中的应用、截图、录屏），不能只看单测。第二，写代码的不给自己终审，审查者用干净上下文。第三，判断规则放在改动碰不到的地方。第四，按风险分车道，人只看高风险和证据。第五，每次犯错都改环境，不靠下次提醒。第六，新门禁先观察再强制，并用回滚率守住质量。

> 我们认为「有没有人读过代码」只是一个不精确的替代指标，真正的问题是：这个改动可能出什么错，哪种检查（自动的或人工的）最适合抓住它。
>
> —— Anthropic Claude Code 团队，2026-10-15

## 3. 落地步骤和可复制 prompt {#steps}

- **1. 只读体检：定位自主等级和仓库就绪度**：所有后续步骤都依赖这份事实，先量再改
- **2. 一条验证命令，加 Stop hook 强制执行**：Anthropic 文档：agent 有了能跑出通过或失败的检查，才能自己闭环
- **3. verify skill：给 agent 手和眼**：Claude Code 团队、OpenAI、Cognition 都让 agent 真跑应用并截图；移动端用第 5 部分的「UI 验证」prompt 和工具表
- **4. 独立审查，写的人不验收**：REVIEW.md 从默认分支读，3 轮修不好就交给人
- **5. 错题本和 skill 评测集**：把错误变成规则、lint 或评测题，顺带回答「skill 好不好」；审美意见用第 5 部分的「设计和审美」prompt 沉淀进 DESIGN.md
- **6. worktree 并行和任务契约**：有验证之后再并行，否则只是更快地产出没检查过的代码
- **7. 触发器：issue 打标签就开工，只开 PR**：任务自动来，先观察 2 周
- **8. 风险分车道、低风险自动合并、度量和留出场景集**：进入 L4b，并为评估 L5 积累数据

顺序的理由：先验证、后并行、再自动化。poteto 说不被信任的循环只会更快地产出没检查过的代码；Anthropic 说没有验证闭环，一个人只能同时盯一两个 Claude。每个 prompt 都不绑定技术栈，要求先给方案、等你确认，并附验收标准和证据要求。

### 第 1 步 · 只读体检

```text
目标：评估这个仓库现在适合让 coding agent 自主做到什么程度。只读，只出报告。在我确认前，不要创建、修改或删除任何文件，不要 push。

1. 先读：README、AGENTS.md / CLAUDE.md、.claude/ 目录（skills、hooks、settings）、CI 配置、构建脚本、测试目录、lint 和类型检查配置、PR / issue 模板、CODEOWNERS。分支保护能用 gh 查就查，查不到写「未知」。
2. 实际运行仓库里已有的检查命令（测试、类型检查、lint、构建），记录每条命令、耗时、是否通过。不要猜命令，找不到就写「没有」。
3. 用两把尺子打分，每项写证据（文件路径或命令输出）：
   A. 仓库就绪度：风格与校验、构建、测试、文档、开发环境、可观测性、安全（分支保护、密钥扫描、CODEOWNERS）、任务来源（issue / PR 模板）。每项写「通过 / 部分 / 缺失」。
   B. 自主等级 0-5：0-2 人写或逐行看；3 agent 写、人审每个 diff；4 人给规格和完成条件，agent 无人值守做完并自证，人看证据；5 人不写也不审代码。
4. 列出「agent 能不能自己证明改动是对的」的缺口：有没有一条全仓库验证命令；agent 能否把应用真正跑起来（浏览器、模拟器或 CLI）并截图；写代码和验收是否分开；agent 能否改到评判它的测试或规则；哪些改动完全没有自动验证。
5. 给出 3 个投入小、可撤销、最能提高自主程度的下一步。每项写：改哪些文件、怎么证明有效、对人工介入的影响。标出任何不可逆操作，但不要执行。

验收标准：
- 每个结论都附证据（路径或命令输出摘录），没有证据的写「未知」。
- 贴出你实际运行的命令和输出摘要。
- 最后贴出 git status 的输出，证明工作区没有被修改。
```

### 第 2 步 · 验证命令和 Stop hook

```text
目标：给仓库建一条「一键验证」命令，并让 agent 在宣布完成前必须跑过它。先出方案，等我确认后再写任何文件。

背景：写在 CLAUDE.md 里的规则，agent 大多数时候会遵守，但不保证。必须每次执行的检查交给 hook（工具在固定时机自动运行的脚本，由工具强制执行）。

1. 盘点现有检查（类型检查、lint、格式化、单元测试、构建），实际运行，记录耗时和结果。
2. 设计一条 verify 命令，按「快的先跑」排序，写明总耗时目标（例如 5 分钟内），更慢的检查留给 CI。
3. 设计一个 Stop hook：agent 每次想结束回合时运行快速检查；失败时把错误输出返回给 agent，不让它结束。说明它可能误伤的情况，以及怎么临时关闭。
4. 起草精简版 CLAUDE.md（如果也有 AGENTS.md，用引用避免维护两份）：只写 agent 读代码也找不到的东西，包括准确的验证命令、怎么跑单个测试、容易误导的旧代码、团队定下的约定。控制在 100 行以内，像目录一样指向更详细的文档。
5. 列出全部文件改动（新建或修改），等我确认。

确认后再执行。验收标准：
- 故意制造一个类型错误或失败的测试，演示 Stop hook 拦住了 agent，贴出被拦时的输出，然后恢复。
- 在干净工作区跑一次 verify，贴出全部通过的输出和耗时。
- 贴出 git diff。不要 push，不要开 PR。
```

### 第 3 步 · verify skill

```text
目标：写一个 verify skill，让 agent 能像测试工程师一样把应用真正跑起来、操作关键流程，并留下证据（截图、录屏、日志）。先出方案，确认前不写文件。

背景：单元测试全绿不代表功能能用。界面可能看着完整，但按钮没接上、数据是假的。

1. 判断项目类型和启动方式（Web、iOS / Android 模拟器、桌面、CLI、服务端），找出最快的冷启动路径。种子数据和测试账号从哪来？不能用真实用户数据或生产密钥。
2. 列出 5-10 条最重要的用户流程，做成「功能地图」：每条写入口、步骤、预期结果、需要的数据。
3. 设计 skill（放在 .claude/skills/verify/SKILL.md）：什么时候用（每次提交前、改了 UI 之后）；启动命令；用什么驱动应用（浏览器自动化、模拟器命令、移动端 MCP 等），写明选择理由；证据存在哪、怎么命名；失败时怎么报告。
4. 设计证据包格式：跑了哪些流程、每步截图路径、通过或失败、哪些没验证到（写「未验证」，不准省略）。
5. 列出要新增或修改的文件，等我确认。

确认后执行。验收标准：
- 对一个现有流程完整跑一遍 skill，贴出截图路径和证据包。
- 故意改坏一个按钮或文案再跑一次，证明 skill 能发现并报告失败，然后恢复。
- 报告从冷启动到第一张截图的耗时。
- 贴出 git diff。不要 push。
```

### 第 4 步 · 独立审查

```text
目标：建立「写代码的 agent 不能给自己验收」的机制。由一个没看过实现过程的独立审查 agent，对照任务规格和证据检查改动。先出方案，确认前不写文件。

1. 起草 REVIEW.md：按目录写这个仓库里「坏掉」长什么样；必须检查的点；可以跳过的路径；每条发现必须给出文件和行号作为证据；只报影响正确性的问题，跳过纯风格意见；发现分为「必须修 / 建议 / 原本就有」三级。
2. 设计审查 subagent（放在 .claude/agents/）：只读权限；输入是 diff、任务规格、verify 证据包；输出固定格式（结论、发现列表、没覆盖到的风险）。
3. 防篡改：审查规则和测试判定从默认分支读取，改动本身不能修改评判它的规则。如果一个改动动了 REVIEW.md、hooks 或测试的期望值，标为高风险，必须由我来看。
4. 收敛：同一项检查修 3 轮仍失败，就停下交给我，写明卡在哪里；第 3 轮以后只审新增的 diff。
5. 列出文件改动，等我确认。

确认后执行。验收标准：
- 在一个分支里埋一个真实的小 bug（例如边界条件），让审查 agent 审，贴出它的发现，然后还原。
- 用一个没有 bug 的小改动做对照，贴出审查结果，说明有没有误报。
- 贴出 git diff。不要 push。
```

### 第 5 步 · 错题本和 skill 评测

```text
目标：把 agent 反复犯的错变成规则、检查或评测题，让同样的错不再发生；同时给我写的 skill 建一个小评测集，判断改了 skill 之后是变好还是变坏。先出方案，确认前不写文件。

第一部分：错题本
1. 读最近 30 天的 git log（含提交正文）、被撤回的提交、反复修的同类问题、PR 里重复出现的审查意见。每条附提交号或 PR 号作为证据，没有证据的不收。
2. 起草 LESSONS.md 格式：规则（一句话）→ 原因 → 证据 → 出现过的不同日期数。升级规则：同一条出现在 3 个不同日期，就升级成更硬的形式。能机器检查的写成 lint、测试或 hook，不能的写进 CLAUDE.md 或 skill。
3. 给出在 CLAUDE.md 加一句「改代码前先读 LESSONS.md」的方案。

第二部分：skill 评测
4. 针对我指定的一个 skill，从真实使用中挑 10-20 个任务（成功和失败的都要）。每题写：输入、成功标准（优先能自动判断的，比如测试通过、文件存在、输出包含什么）、参考答案。
5. 设计跑法：每题跑 3 次，记录通过率；评判结果，不评判步骤。
6. 说明使用方法：改 skill 前后各跑一次，对比分数。

验收标准：
- 至少 3 条真实教训，每条有可以点开的证据。
- 评测集先跑一遍基线，贴出每题结果和总通过率。
- 先列出要新增的文件，等我确认后再写；最后贴出 git diff。不要 push。
```

### 第 6 步 · worktree 并行和任务契约

```text
目标：让多个 agent 能同时在这个仓库干活而互不干扰，并给每个任务定一份「任务契约」。先出方案，确认前不写文件。

背景：git worktree 是同一个仓库的多个独立工作目录，每个 agent 用一个，改动互不覆盖。

1. 检查新 worktree 能否直接工作：依赖安装；需要复制哪些被 gitignore 的小配置文件（密钥只用开发专用值，不复制生产密钥，也不复制大目录）；端口、模拟器、数据库会不会冲突。给出让每个 worktree 能独立启动应用的办法。
2. 写一份任务契约模板（放在 docs/ 或做成 issue 模板）：目标（写结果而不是活动）；完成条件（能自动判定通过或失败）；非目标；允许改动的范围；权限；要交的证据；什么情况停下来找人；预算（最长时间、最多轮数、token 上限）。
3. 并行规则：哪些任务可以并行（不碰同一批文件或同一套测试），哪些必须排队；一台机器同时只跑一套完整测试；合并前 rebase 到最新主干并重跑验证；合并时绑定已经审查过的那个提交，审查后又有新推送就重新审。
4. 列出文件改动，等我确认。

确认后执行。验收标准：
- 同时开 2 个 worktree，各做一个小改动，各自跑 verify，贴出两份输出，证明互不干扰。
- 用模板写一份真实的任务契约示例。
- 演示任务完成后删除 worktree 的命令和结果。
- 贴出 git diff。不要 push。
```

### 第 7 步 · 触发器和观察期

```text
目标：让任务自动找上 agent。给 issue 打上 ready-for-agent 标签（或定时、或 CI 失败）就自动开工，在独立环境里做完、附上证据、开 PR。第一阶段只开 PR，绝不自动合并。先出方案，确认前不写文件、不改仓库设置。

1. 选触发方式并说明理由：GitHub Actions 加无头模式的 coding agent、工具自带的定时任务，或其他编排工具。写清每种方式的成本和风险。
2. 准入规则：什么样的 issue 可以打标签（复现步骤、完成条件、范围都写清楚了）。不够清楚的，agent 只在 issue 里提问，不动代码。
3. 运行约束：独立 worktree 或容器；只给需要的权限（只能推到自己的分支、不能改 CI 配置、不能读生产密钥）；设置最大轮数和花费上限；失败 3 次就停，并在 issue 里写明原因。
4. 产出：PR 描述里必须有任务契约、verify 证据包、独立审查结果、「没验证什么」。
5. 观察期：先跑 2 周，只记录结果。每个 PR 标为「可直接合并 / 需要返工 / 应该拒绝 / 被环境卡住」，并写原因。
6. 列出要新增的文件，以及需要我手动做的设置（密钥、权限、分支保护），等我确认。

验收标准：
- 用一个真实的小 issue 端到端跑一次，贴出 PR 链接、证据包、审查结果和花费。
- 证明权限受限：贴出 agent 尝试推送到主干或修改 CI 文件时被拒绝的输出。
- 不要合并任何 PR。
```

### 第 8 步 · 风险车道、自动合并和留出场景集

```text
目标：按风险给改动分车道。低风险、能自动验证、能快速回滚的改动，通过全部自动检查后自动合并；同时建立度量和「留出场景集」，用数据判断哪些部分可以往黑灯工厂走。先出方案，确认前不写文件、不改仓库设置。

1. 风险分级由改动内容决定，不由作者决定：
   - 低：文档、文案、补测试、功能开关后面的新增代码。自动检查和独立审查全绿即可自动合并。
   - 中：普通功能改动。需要 1 个人看过证据后批准。
   - 高：认证、支付、权限、发版和构建配置、CI 工作流、依赖升级、数据迁移、审查规则本身。必须有人审代码。
   用 CODEOWNERS 和分支保护强制高风险路径必须由人批准。agent 的批准永远不能代替人。
2. 门禁分三档：off（关闭）/ observe（只记录本来会拦下什么）/ enforce（真正拦截）。新门禁至少 observe 2 周，看过误报再切到 enforce。
3. 回滚：每个自动合并的改动都要能一步撤回（revert 或关掉开关）。列出这个项目里「发出去就收不回」的环节（例如已发布的安装包、应用商店版本），这些环节永远停在人工审批。
4. 度量（每周自动生成报告）：每个 PR 的人工审批次数和等待时间、回滚率、上线后发现的缺陷、每个合并改动的 token 花费、agent 被卡住的原因分布。规则：回滚率或事故率上升，就把车道自动收紧一级。
5. 留出场景集：写 10-20 条端到端用户场景，放在写代码的 agent 看不到、改不了的位置（单独仓库或受保护目录），只用来验收；每周用它给主干打一次分。
6. 列出文件改动和需要我手动做的设置，等我确认。

验收标准：
- 用 20 个历史 PR 回放分级器，贴出分级结果，我来抽查是否合理。
- observe 模式运行后，贴出第一份周报。
- 演示一次对自动合并改动的一步回滚。
- 在我书面确认之前，不要在 enforce 模式下合并任何东西。
```

## 4. 六个问题逐项分析 {#six}

### 问题 1：任务从哪来

结论：把「人发 prompt」换成「事件进队列，agent 自己领」。常见入口有四类：issue 看板（OpenAI 的 Symphony 让每个 Linear 工单对应一个 agent；Matt Pocock 用 ready-for-agent 标签；Vercel 用 GitHub webhook）；告警和崩溃（Cognition 把 Sentry 崩溃、部署失败直接接到 Devin）；定时任务（OpenAI 的后台清理任务；Claude Code 的 /loop 和 /schedule）；聊天（Cognition 在 Slack 里 @Devin，客户报的 bug 转进来就开工）。

为什么：人的注意力是真正的瓶颈。OpenAI 发现一个人舒服地管 3 到 5 个会话就到头了，换成从看板领活后，部分团队落地 PR 增加 500%（自述）。Claude Code 文档说得直白：agent 唯一不能做的是决定开始，所以必须有东西替你按开始键。Kent C. Dodds 的口诀：每次你要亲自发 prompt 前，先问怎样才能不用你发也得到同样结果。

前提：任务要写得清楚才能自动化。Cognition 说成功率跟需求的具体程度成正比，Devin 像初级工程师一样需要明确需求。所以触发器前面要有准入规则（第 7 步）。

出处：openai.com/index/open-source-codex-orchestration-symphony、cognition.com/blog/how-cognition-uses-devin-to-build-devin、code.claude.com/docs/en/best-practices、x.com/kentcdodds/status/2122069021218750527

### 问题 2：怎么拆分和并行

结论：一个任务一个隔离环境（worktree、容器或云端虚拟机），每个环境能独立启动应用；合并时串行，经过合并队列重跑检查。分工按任务切：一个 agent 只干一件事。

为什么：OpenAI 让应用能按 worktree 启动，每个改动一份实例、一套独立日志和指标，任务结束就销毁；magpie 的规范要求每个会话用自己的 worktree，起因是一个过时的工作树冲掉了提交。Vercel 试过一个 agent 带多个 skill，发现难维护，改成一个任务一个 agent，各自有 prompt 和评测。Anthropic 的合并队列把每个改动叠到最新主干上重跑检查，防止两个单独通过的 PR 合起来把主干搞坏；Gas Town 的 Refinery 也是一次处理一个合并请求。

注意：Addy Osmani 提醒「假并行」，多个 agent 改重叠的文件，换来的是冲突和重复决策。Huntley 主张从单进程循环开始，每轮只做一件事，验证只用一个 subagent。Steinberger 则直接在主干上改、几乎不用 worktree，因为他认为自己才是瓶颈。所以并行要在验证之后再加（第 6 步排在第 3 步之后）。

出处：openai.com/index/harness-engineering、github.com/yetone/magpie/blob/main/docs/code-standards.md、vercel.com/blog/building-a-software-factory-for-ai-sdk、claude.dev/blog/solving-code-review-at-anthropic、addyosmani.com/blog/agentic-autonomy-levels、ghuntley.com/ralph

### 问题 3：质量怎么保证，又不靠人逐行看

结论：五层叠起来。一是验证闭环：agent 有能跑出通过或失败的检查。二是真实运行：把应用跑起来、操作、截图、录屏，E2E 优先。三是独立审查：没看过实现过程的 agent 来审，写的人不验收。四是规则在够不着的地方：审查规则从默认分支读，验收场景放在代码库外。五是兜底：合并队列、功能开关、分阶段发布、一步回滚。

为什么：测试会被钻空子。StrongDM 发现 agent 会用 return true 通过写得窄的测试，而且存在代码库里的测试可能被顺手改成迎合代码。Replit 把「看着能用、其实没接上」的界面叫 Potemkin 界面，只有真去点才抓得到。Claude Code 团队说运行整个应用比测试更重要，他们用 verify skill 启动模拟器或应用，内部测试中独立评分者对照评分标准检查，让任务成功率最多提高 10 个百分点（自述）。他们还把过去引发事故的 PR 做成评测集，每天给审查 agent 打分，并统计误报。审查要收敛：一个 PR 曾通宵来回审了 50 多轮，后来改成 3 轮上限、第 3 轮后只审新 diff。

人看什么：证据包，包括命令和输出、截图、审查发现、「没验证什么」。Cognition 让 Devin 先写基于源码的测试计划，再交回带章节和断言的录屏；Amp 要求 agent 给出无可辩驳的证据。只看 agent 的总结不算审查，Addy 把这叫「总结替代」。

出处：claude.dev/blog/how-the-claude-code-team-thinks-about-verification、claude.dev/blog/solving-code-review-at-anthropic、factory.strongdm.ai、frontier.replit.com/automated-self-testing、cognition.com/blog/testing-development、ampcode.com/notes/what-i-want-to-tell-you-about-orbs

### 问题 4：上下文和知识怎么沉淀

结论：分三层放。CLAUDE.md / AGENTS.md 短，只放 agent 读代码找不到的东西，当目录用；流程放 skill，需要时才加载；必须百分之百执行的规则放 hook、权限规则或 lint。错误要一路「升级」：先记进错题本，重复出现就变成规则，能机器检查的就变成 lint 或测试。

为什么：模型不会从错误里学习，但工具链可以（Simon Willison）。OpenAI 试过一个大 AGENTS.md，失败原因是挤占上下文、什么都重要等于什么都不重要、很快过时、没法机器检查，于是改成约 100 行的目录，知识放 docs/，并用 lint 和 CI 检查文档是否过期。Claude Code 文档建议 CLAUDE.md 少于 200 行；一条规则加了强调还被忽略，就该改成 hook。Mitchell Hashimoto 的说法：agent 每犯一次错，就改到它再也犯不了。magpie 把教训出现 3 个不同日子定为升级门槛；Anthropic 要求一条候选规则至少出现在 2 个 PR 里、能从 diff 识别，再让 3 个 agent 试着反驳，最后由人批准。规则也要定期清理，否则只会越堆越多。

出处：openai.com/index/harness-engineering、code.claude.com/docs/en/best-practices、mitchellh.com/writing/my-ai-adoption-journey、github.com/yetone/magpie/blob/main/LESSONS.md、claude.dev/blog/how-the-claude-code-team-thinks-about-verification、simonwillison.net/guides/agentic-engineering-patterns

### 问题 5：人必须在哪些节点介入

结论：人保留五件事：决定做不做（方向、品味、范围）；审高风险代码（认证、计费、自动更新、CI 工作流）；审会被别人照抄的架构模式；读证据；对结果负责。其余按风险分级：低风险自动检查全绿即可合并，中风险 1 人，高风险 2 人。

为什么：这是 Anthropic 的原话清单和分级表。风险等级由改动内容决定，不由作者决定：一个分类器读改动定级，另一个判断是否需要额外的人。agent 的批准永远不能顶替要求的人；批准只对应一个具体提交，之后有新推送就要重批。其他升级点：同一检查修 3 轮仍失败（Claude Code 团队）；验收互相矛盾、涉及生产或不可逆操作（Theo 的 full-send 也把生产改动和删数据留给人）。

怎么逐级放权：新门禁先 observe 只记录，再 enforce 真拦（Anthropic）；Kent 的 autopilot 默认只让低风险自动合并；Addy 建议一次只沿一个方向升级，并度量干预间隔、返工率、缺陷逃逸率。

出处：claude.dev/blog/solving-code-review-at-anthropic、claude.dev/blog/how-the-claude-code-team-thinks-about-verification、github.com/t3dotgg/tstack/blob/main/skills/full-send/SKILL.md、github.com/kentcdodds/kcd-skills、addyosmani.com/blog/agentic-autonomy-levels

### 问题 6：成本和安全的边界

结论：每次运行都要有预算（最多轮数、花费上限、并行数），有最小权限（只能推自己的分支、不能读生产密钥），在沙箱里跑，把外部输入当攻击者输入。不可逆操作（发版、删数据、改生产）永远要人批。

为什么，成本：Claude Code 无头模式有 --max-turns 和 --max-budget-usd；Addy 把预算列为每次运行契约的必填项。差距很大：StrongDM 的口号是每人每天 1000 美元以上，Replit 的自测试中位成本每次 0.20 美元（均为自述）。审查噪音也是成本：agent 会把每条小意见都修掉，于是多一轮提交和审查（Anthropic）。

为什么，安全：Claude Code 文档说 auto mode 的分类器是判断不是保证，「永远不能」的规则要写成 deny 规则或 hook，比如禁止读 .env；跑定时云任务前先用分支保护锁住主干。Vercel 让每个 agent 在隔离沙箱里只拿任务需要的密钥，并限制网络出口；Cursor 给云端 agent 做了密钥脱敏和网络策略；Cognition 让 agent 测试时完全不碰线上服务；OpenAI 在 Symphony 里不把 Linear 令牌暴露给子 agent。

出处：code.claude.com/docs/en/best-practices、addyosmani.com/blog/agentic-autonomy-levels、vercel.com/blog/building-a-software-factory-for-ai-sdk、cursor.com/blog/cloud-agent-lessons、simonwillison.net/2026/Feb/7/software-factory、openai.com/index/open-source-codex-orchestration-symphony

## 补查名单结果 {#people}

| 人 / 团队 | 结果 | 跟工厂有关的公开做法 | 出处 |
| --- | --- | --- | --- |
| Simon Willison | 找到 | Agentic Engineering Patterns 指南（红绿 TDD、先跑测试、agent 手动测试、subagent）；StrongDM 解读里把「怎么证明 agent 写的代码真的对」称为当下最关键的问题。 | simonwillison.net 2026-02-23、2026-02-07 |
| Hamel Husain | 找到 | 评测 coding agent：通用能力看公开基准，自己的工作流用来自真实失败的私有任务，每题要有可运行环境和代码化判定；再补测代码质量、过度设计等测试抓不到的东西。 | hamel.dev 2026-09-19 |
| Geoffrey Huntley | 找到 | Ralph：每轮只做一件事；主上下文当调度器，把重活派给 subagent，但验证只用 1 个 subagent 以免反压失灵；看着循环，见到失败就改到不再发生。2026-01 自称在做「level 9」的 loom 工厂，代码只给他自己用。 | ghuntley.com 2025-07-14、2026-01-17 |
| Thorsten Ball / Amp 团队 | 找到 | 见上表 Amp 一行。 | ampcode.com 2026-08-04 |
| Matt Pocock | 找到 | skills 仓库用 ready-for-agent 标签标出「写清楚了、可交给 AFK agent」的 issue，配 ready-for-human、needs-info 等分流标签。 | GitHub mattpocock/skills |
| Andrej Karpathy | 找到，但不是软件工厂 | autoresearch：人只写 program.md，agent 改训练代码、跑 5 分钟、看指标、保留或丢弃，整夜循环。是「目标可度量就交给循环」的研究版。 | GitHub karpathy/autoresearch 2026-03 |
| Mitchell Hashimoto | 找到 | harness engineering：agent 每犯一次错，就花时间改到它再也犯不了，要么写进 AGENTS.md，要么写成脚本工具（截图、只跑相关测试）。 | mitchellh.com 2026-02-05 |
| Armin Ronacher | 找到，含反例 | 「The Coming Loop」描述外层循环成为主流；但他放手让模型自己管流程的周末「工厂」烧了约 40 亿 token、35 小时，什么有价值的都没交付（自述）。 | lucumr.pocoo.org 2026-06-23、2026-09-07 |
| Peter Steinberger | 找到，反方向 | 同时推 3 到 8 个项目，直接在主干上改，基本不用 worktree；认为自己才是瓶颈，暂时不需要多 agent 编排。 | steipete.me |
| Steve Yegge | 找到 | Gas Town 编排 20 到 30 个 Claude Code；Refinery 角色串行处理合并队列：rebase、验证、通过才合并。现已退役，由 SDK 形态的 Gas City 接替。 | yegge.ai 2026-01-01 |
| Addy Osmani | 找到 | 两轴自主等级（单个 agent 放多远 × 编排多少 agent）；每次运行前写契约：目标、范围、非目标、权限、停止条件、证据、升级、预算；三个问题判断够不够格：多快知道错了、多干净能撤回、什么能证明对了。 | addyosmani.com 2026-07-02、2026-07-20 |
| swyx / Latent Space | 未能获取一手来源 | 只搜到第三方播客摘要（与 Warp 的 Zach Lloyd 谈「工厂即代码」），没有核实原节目内容，本版不引用。 | — |
| Replit、Vercel agent 团队 | 找到 | 见上表。 | — |
| Boris Cherny | 找到 | 他的配置帖说自己的设置很朴素；Anthropic 博客引用他：给 Claude 验证手段能让结果好 2 到 3 倍（他本人估计）。Armin 文中转引他「我不再 prompt Claude，我的工作是写循环」。 | X 2026-01-02；claude.dev 2026-10-15 |
| Dex Horthy（HumanLayer） | 找到，反例 | 2025 年 7 月全面关灯，几个月后代码难维护，第三次出事时决定重写；结论是模型目前维护不了代码质量，建议把审查放回来、前置规划，「快 2 到 3 倍但安全」。 | GitHub wsff.md |

未能获取：swyx / Latent Space 的一手内容（只搜到第三方摘要）；yetone 本人的 X 帖子（队友此前记录为仅关注者可见），所以「3 个 /loop」只有二手转述，本页只引用他仓库里的原文。

## 5. 从想法到上线：新项目、新需求和 UI/UX（v2） {#flow}

> **这一章的结论**
>
> 领先团队开新项目，都是先搭「agent 能看见、能验证」的环境和规则，再让 agent 写功能。做新需求，人只在四处拍板：做不做和范围、计划里撤不回的决定、视觉方向、上线放量。UI 是最难自动化的一段，现在能做到的是：把品味写成规则和检查，让 agent 在模拟器或浏览器里自己操作并交截图录屏，再由另一个 agent 按标准打分；人只从几个原型里挑方向、花 5 分钟看审查包、在真机上摸一下手感。没有找到任何团队把新视觉方向的审美判断完全交给 agent 的公开案例。

| 新词 | 是什么 | 为什么重要 |
| --- | --- | --- |
| 规格（spec） | 写给 agent 的需求说明：给谁用、解决什么、核心流程、不做什么、什么算做完。StrongDM 把起点叫「种子」，可以是几句话、一张截图或已有代码。 | agent 不会猜你没说的事；规格越清楚，越能无人值守做完。 |
| 验收场景 | 用「前提 / 操作 / 预期结果」写的用户场景，能被测试或模拟器操作自动检查。 | 「做完没有」从感觉变成能跑的检查。 |
| 设计 token | 颜色、字号、间距、圆角、动效时长等设计决定的具名变量，比如 primary、spacing-md。 | agent 用 token 而不是随手写数值，界面才不会越改越乱，也能用 lint 查。 |
| DESIGN.md | 放在仓库里的设计说明文件：token 的精确值，加上每个值为什么这样、怎么用、不要怎么用。Google 开源了一种格式。 | 把品味变成 agent 每次都会读的文字。 |
| 原型切换器 | 把 2-3 个一次性设计方案放在同一个页面里，用按钮或快捷键切换对比。 | 人从「提意见」变成「做选择题」，最省时间。 |
| 视觉回归 | 把页面截图和之前存好的基线图逐像素比较，有差异就报警。 | 能自动发现「别处被改坏了」，不用人一页页看。 |
| 评审 agent（evaluator） | 另一个没参与实现的 agent，按事先写好的标准给界面打分并写意见。 | Anthropic 发现 agent 给自己打分总是偏高，分开才有用。 |
| 模拟器 / 真机 | iOS Simulator、Android 模拟器是电脑上的虚拟手机；真机是实际的手机。 | agent 能在模拟器里自己操作截图；滚动和手势的手感只有真机上才准。 |
| PR 预览 | 每个改动自动生成一个能直接打开的版本：网页链接、测试包，或手机扫码打开的 OTA 预览（OTA：不发新安装包、直接下发新的 JS 代码）。 | 人审 UI 不用拉代码、不用自己编译。 |

| 阶段 | 人拍板 | 交给 agent | 证据 / 产出 | 依据 |
| --- | --- | --- | --- | --- |
| 起步 | 产品是什么、不做什么；架构分层和撤不回的取舍；挑 2-3 个代表性功能当样板 | 脚手架、CI、地图式 AGENTS.md、验证命令、verify skill、架构 lint | 新克隆一条命令跑起来并截图；跨层依赖被 lint 拦下 | OpenAI harness、Sora 安卓、StrongDM |
| 需求 | 做不做、做多大、什么算做完 | 把想法扩成规格草稿，补边界情况，写验收场景，列问题 | 规格 + 验收场景（一部分留出） | Anthropic 代码审查篇、OpenAI harness |
| 计划 | 批计划，重点看撤不回的决定 | 讲清数据流，给两种实现形状，拆成能各自验证的小 PR | 计划文件，每个 PR 自带验证方式 | Boris Cherny、Sora 安卓、pstack |
| 设计和审美 | 从原型里挑视觉方向；确认 DESIGN.md | 起草 DESIGN.md 和检查规则；做 2-3 个可切换原型并截图 | DESIGN.md、原型对比截图 | Cognition、Anthropic、OpenAI、pstack、Impeccable、Emil Kowalski |
| 实现 | 不在场，只处理升级 | 在 worktree 里照计划和样板做，只用已有组件和 token，每步跑验证 | 每步命令输出、diff | Sora 安卓、Claude Code 团队、pstack |
| UI 验证 | 不在场 | 在模拟器或浏览器里真操作，前后截图、录屏、规则检查、视觉回归、评审 agent 打分 | 证据包，未验证项单列 | Claude Code 团队、Cognition、Anthropic、T3 Code |
| 人审 | 看 5 分钟审查包；真机上摸新交互的手感 | 打包证据，列出「只有你能判断」的最多 5 条 | 前后对比、压缩录屏、预览入口 | Sora 安卓、Cognition、Expo、Kent C. Dodds |
| 上线 | 批对外发布和放量节奏 | 功能开关、放量计划、监控、回滚演练 | 开关有负责人、指标、移除条件 | Anthropic 代码审查篇、Kent C. Dodds |

下面每个阶段写结论、为什么和出处，再附一段可以直接复制给 coding agent 的 prompt。prompt 不绑定技术栈，都要求先出方案、等你确认，并写明验收标准和要交的证据。链接集中在第 6 部分的「v2 新增来源」。

### 起步：先搭环境和规则，再写功能 {#kickoff}

结论：新项目第一周的产出不是功能，而是四样东西：一页规格种子、能在每个 worktree 启动并被 agent 操作的应用、一条验证命令、写成 lint 的架构分层。然后由人挑 2-3 个代表性功能做样板，agent 照着样板往外扩。

为什么：OpenAI 的 harness 团队从空仓库起步，脚手架和 AGENTS.md 都让 Codex 生成；他们说早期进展比预期慢，原因不是模型不行，而是环境没交代清楚。之后的主要工作变成：让应用在每个 worktree 都能启动，接上浏览器调试协议让 agent 截图、看页面结构，给每个 worktree 配独立的日志和指标，再用自定义 lint 强制分层，报错信息直接写修复方法（Ryan Lopopolo，2026-02-11）。OpenAI 做 Sora 安卓版的团队走了另一条路，结论却一致：人手工搭好架构、模块划分、依赖注入、导航、登录和基础网络，再亲手写几个代表性功能，之后约 85% 的代码由 Codex 写（自述）；他们试过直接说「照 iOS 版把安卓 app 做出来，开始」，做出来能跑但体验差，很快放弃（Patrick Hum、RJ Marsan，2025-12-12）。

StrongDM 把起点叫「种子」，可以是 PRD、几句话、一张截图或已有代码，再配上尽量贴近真实环境的端到端验证和反馈循环，一直跑到留出场景全部通过；他们还把「需要来回讨论的工作」和「规格已经完整的工作」分开，只有后者才交给 agent 一口气做完（StrongDM Principles、Techniques 页面）。Anthropic 的长任务实验里，planner 把一两句话扩成高层产品规格，刻意不定死技术细节，怕规格里的错一路传到实现里（Prithvi Rajasekaran，2026-03-24）。Kent C. Dodds 的工作坊也从不变量、决策记录、基础组件目录和「当路由用的 AGENTS.md」开始（2026-11-10）。

对你：LobeHub mobile 不是空仓库，但新开模块或做大功能时同样适用。Sora 安卓「人定结构和样板、agent 往里填」的做法，比「从零全交给 agent」更贴近你的情况。

```text
目标：在写任何功能之前，先把「agent 能独立干活的环境」搭好。适用于新项目，或老仓库里新开的模块。只出方案，等我确认后再写文件。

1. 规格种子：用一页纸写清这个产品或模块给谁用、解决什么、核心 3-5 条用户流程、明确不做什么。我给的材料不够时，列出你需要我回答的问题（最多 5 个），不要自己编。
2. 地图式 AGENTS.md（或 CLAUDE.md）：控制在约 100 行，只写怎么启动、怎么验证、目录地图、去哪看详细文档；细节放 docs/ 下。
3. 一条验证命令：把类型检查、lint、单测、构建串起来，任何一步失败就以非 0 退出。
4. 能跑起来、能看见：应用能在每个 worktree 独立启动（端口、数据互不冲突）；写一个 verify skill，能启动应用、走一条核心流程、把截图存到固定目录。
5. 架构约束：画出分层（例如 类型 → 数据 → 服务 → 界面），写成 lint 或结构测试。报错信息里直接写「应该怎么改」，因为读报错的是 agent。
6. 样板：建议 2-3 个最有代表性的功能，由我审过后作为以后所有功能的样板；写清每个样板示范哪些规则。
7. 设计起点：如果有界面，起草 DESIGN.md（颜色、字体、间距、圆角等 token，以及每个值的用途和禁止做法）。

验收标准：
- 全新克隆后，一条命令完成安装和验证，并用 verify skill 产出第一张截图；贴出命令输出和截图路径。
- 故意写一处跨层依赖，证明 lint 能拦下且报错里有修复指引；然后撤销。
- 列出所有新增文件和用途，贴出 git diff。不要 push。
```

### 需求：人定做不做和什么算做完 {#req}

结论：人拍板「做不做、做多大、什么算做完」；agent 负责把想法扩成规格草稿、补齐边界情况、写成能自动检查的验收场景，并把一部分场景藏起来留作最后的独立验收。

为什么：Anthropic Claude Code 团队写明，人仍然负责「要不要做」和「方向、品味与范围」（2026-10-15）。OpenAI harness 团队说人的工作是排优先级、把用户反馈翻译成验收标准、验证结果（2026-02-11）。Anthropic 的实验里，写代码的 agent 和评审 agent 在每轮开工前先谈好一份「这一轮做完长什么样」的契约，把用户故事变成可测试的行为，再动手（2026-03-24）。把部分场景藏起来，是 StrongDM 防止 agent 改测试作弊的办法（见第 1、2 部分）。

```text
目标：把我的一个想法变成 agent 能直接执行、也能被自动验收的需求。只写文档，不改代码。先给大纲，等我确认再展开。

输入：我的想法（一两句话，可能附截图或参考链接）。

1. 先读相关代码和文档，用 5 句话以内复述：现在的产品在这一块是怎么工作的。
2. 写需求规格：用户是谁、要解决的问题、用户故事、明确不做什么。停留在产品层面，不要提前定死技术细节。
3. 写验收场景：每条用「前提 / 操作 / 预期结果」，覆盖正常路径、空状态、出错、极端数据（超长文字、大数量、弱网）。
4. 把验收场景分成两份：大部分给实现的 agent；另外 2-3 条放到实现 agent 看不到的位置，作为留出场景，最后由独立 agent 来跑。
5. 标出需要我拍板的地方：做不做、范围边界、会不会改变已有用户习惯、是不是撤不回的决定（数据格式、对外接口、发版）。最多 5 个问题。

验收标准：
- 规格和验收场景各一个文件草稿，贴给我看。
- 每条验收场景写明用什么方式自动检查（命令、测试、截图对比、模拟器操作），做不到的标「需人看」。
- 不改任何代码文件。
```

### 计划：先批计划，重点看撤不回的决定 {#plan}

结论：不是一两行的改动，都先出计划、人批了再动手。计划要回答三件事：数据怎么流、选哪种实现形状、拆成哪些能各自验证的小 PR。人重点看撤不回的决定，其余可以放手。

为什么：Boris Cherny 说他多数会话从 Plan 模式开始，跟 Claude 来回改到满意，再切到自动执行，常常一次做完（2026-01-02）；他在 Hacker News 上估计，好计划和给 Claude 验证手段，各能让难任务的结果好 2-3 倍（2025-12-13，自述）。Plan 模式下 Claude 只读代码、写计划，批准前不改源码（Claude Code 文档）。Sora 安卓团队的流程是：先让 Codex 总结这块代码怎么工作，人纠正理解，再一起写一份迷你设计文档，然后逐步执行；计划存成文件，审查时对照计划看实现，出了问题先查计划再查代码（2025-12-12）。

poteto 的 pstack 刻意没有「写计划」的 skill：先用 architect 画两种形状选一个，开放问题用原型回答而不是争论，设计定下来才写计划，每个 PR 自带验证步骤，「测试套件全绿」不算证明（pstack 指南 04、architect skill）。figure-it-out 要求先写出能被证伪的完成条件、先搭验证再干活，几小时的长任务至少留一个人工检查点。

```text
目标：写代码前拿出一份我能批的计划。用只读方式工作（如 Claude Code 的 Plan 模式），批准前不改任何源码。

1. 读相关文件，先讲清这块的数据怎么流动（接口 → 数据层 → 状态 → 界面），等我纠正你的理解后再继续。
2. 给出两种不同的实现形状：模块边界、主要类型或接口、状态放在哪。比较谁拥有哪块状态、调用方需要知道多少、以后改起来哪个便宜，推荐一个并说理由。
3. 遇到没有先例的界面或交互，不要在计划里空谈，标出来交给设计阶段做原型。
4. 把推荐方案拆成小 PR，每个 PR 写：改哪些文件、新增哪些状态、怎么验证（具体命令、要截的屏、要走的流程）。「测试全绿」不算验证。
5. 标出单向门（上线后很难撤回的决定），这些必须我批。
6. 把计划存成仓库里的文件，方便其他会话接着做。

验收标准：
- 计划文件贴给我，每个 PR 都有可执行的验证步骤。
- 列出你还不确定、需要我回答的问题。
- 批准前 git status 里只允许出现新增的计划文件。
```

### 设计和审美：能写成规则的写成规则，写不成的做选择题 {#design}

结论：品味拆成两类处理。能写成规则的（token、间距、点击区域、动效时长、禁用的 AI 套路）写进 DESIGN.md、设计 skill 和确定性检查，写一次、每次执行；写不成规则的（新视觉方向、新交互的感觉）让 agent 做 2-3 个可切换的原型并截图，人只做选择题。

为什么：Cognition 在 Devin 年度回顾里说，做视觉设计时 Devin 需要具体规格，比如组件结构、色值、间距；结果不容易验证时要额外的人审（2025-11-14）。Anthropic 发现模型不加引导会收敛到同一种安全平庸的样子，用按需加载的前端设计 skill 来纠正（2025-11-12）。OpenAI 把「品味不变量」写成自定义 lint，说人的品味只要捕获一次，就能在每一行代码上持续执行（2026-02-11）。pstack 的原型流程要求先说清这个原型要帮你做哪个决定，再把几个变体放在一个切换器后面截图对比，用完就扔；experience-first 原则的说法是：设计决定在一次性 HTML 里做比在正式代码里便宜，少做几个功能、把细节做对（过渡、对齐、间距、反馈、错误状态）。

| 做法 | 例子 | 能自动检查吗 | 出处 |
| --- | --- | --- | --- |
| DESIGN.md | YAML 写 token 精确值，Markdown 写原因和用法。Google 开源的格式自带 lint（检查断开的引用、WCAG 对比度）和两个版本之间的 diff | 部分能 | Google Labs，2026-04-21 |
| 设计 skill | Anthropic 的前端设计 skill，专门对抗模型「千篇一律」的默认样子；Emil Kowalski 的一组 skill，含 animate-expo（React Native / Expo 动效）、mobile-native、break-ui（用超长名字、空列表等极端数据压界面）、learn-taste（把你这次会话里的设计修改写成 DESIGN.md 规则） | 靠 agent 执行 | Anthropic 2025-11-12；Emil Kowalski 2026-07-02 |
| 确定性规则和 hook | Impeccable：62 条不用 LLM 的规则，hook 在 agent 宣布完成前扫描它改过的 UI 文件；yetone 的 kill-ai-slop：33 种 AI 套路的扫描器，只报告不改文件；Vercel Web Interface Guidelines：MUST / SHOULD / NEVER 规则（如移动端点击区域至少 44px），加一个审查 skill | 能 | pbakaus/impeccable；yetone/kill-ai-slop；Vercel 2026-01-12 |
| 写进项目规范和 lint | yetone 的 magpie：不用原生下拉框、点击不滚动页面、不用彩色左边框条标状态；OpenAI 把「品味不变量」写成自定义 lint | 能 | magpie code-standards；OpenAI 2026-02-11 |
| 每日审计 | Cognition 每天让 Devin 扫描过去 24 小时合并的 PR，标出硬编码颜色、非标准间距、该用共享组件没用的地方，并开工单；在 Slack 里发截图就让它把组件迁到设计系统 | 能 | Cognition 2026-02-27 |
| 样板和具体规格 | Sora 安卓团队先手写代表性页面，让 Codex「照刚看过的那个页面的架构做」；Cognition 说视觉设计要给组件结构、色值、间距 | 否，靠人提供 | OpenAI 2025-12-12；Cognition 2025-11-14 |

注意：yetone 的 native-feel-skill 讲的是跨平台桌面应用怎么有原生感（含 75 项发版审计），skill 里写明不用于纯移动应用，对 LobeHub mobile 只能参考思路。Impeccable 的 skill 描述里包含原生 iOS 和 Android 界面；Emil Kowalski 的 animate-expo 专门针对 React Native 和 Expo 动效。

```text
目标：把界面的品味变成 agent 能遵守、能检查的东西，并让我用最少时间定视觉方向。先出方案，等我确认后再写文件。

A. 设计规则（做一次，之后持续维护）
1. 从现有代码里提取设计 token（颜色、字体、字号、间距、圆角、阴影、动效时长），起草 DESIGN.md：每个 token 写值、用途、禁止做法；再加一段「这个产品给人的感觉」和 5-10 条不要做的事（例如：不要紫色渐变、不要卡片套卡片、不要满屏 emoji）。
2. 列出哪些规则能写成自动检查（硬编码颜色、非标准间距、点击区域太小、文案没走翻译），并给出检查方式。

B. 新界面或新交互（需要时）
3. 做 2-3 个明显不同的方案，用最轻的方式实现，放在临时目录，不进正式代码，放在一个切换器后面。
4. 每个方案按真实尺寸截图：小屏手机、大屏手机（有平板也截）、深色模式、长文案、空状态。动效和手势录短视频。
5. 写出各方案的取舍和你的推荐，由我来挑。

C. 我的修改意见
6. 我每次改设计（口头说或直接改代码），你把它整理成「规则 + 原因」追加进 DESIGN.md；能自动检查的同时补上检查。

验收标准：
- DESIGN.md 草稿和检查清单贴给我。
- 原型截图按方案并排给出，标注尺寸和状态，附原型目录路径。
- 明确说明原型是一次性的，不进主分支。
```

### 实现：人不在场，agent 守三条规矩 {#impl}

结论：实现阶段人不用在场，但 agent 要守三条：照着计划和样板做；只用已有组件和 token；每一步都跑验证，不改检查来过检查。

为什么：Sora 安卓团队发现，「照刚才那个页面的架构和模式做这个设置页」比「做个设置页」可靠得多；人定结构和不变量，Codex 在结构里填大量代码（2025-12-12）。Claude Code 团队规定同一个检查修 3 轮仍失败就交给人（2026-11-16）。pstack 的视觉一致性流程明确禁止为了过检查而改基线、改检查工具或重构组件（visual-parity playbook）。

```text
目标：按已批准的计划实现，一次只做一个能验证的小步。在独立 worktree 或分支里工作，不碰主分支。

1. 开工前重读计划文件、AGENTS.md、DESIGN.md 和样板功能，列出这次要遵守的规则。
2. 每次只做计划里的一个 PR 或一步：先写或更新一个会失败的检查，再改代码，再跑验证命令。不过就修；同一个检查修 3 轮仍失败，停下来告诉我卡在哪。
3. 界面只用已有组件和 token；需要新组件或新 token 时停下来问我，不要自己发明。
4. 每步结束记录：改了什么、跑了什么命令、结果如何。不准为了让检查通过而改检查本身或基线；你认为检查错了，单独提出来。
5. 发现计划行不通时，不要绕过去，先回来更新计划。

验收标准：
- 每一步都有对应的命令输出。
- 最终 diff 只包含计划内的改动；计划外的改动单独列出并说明理由。
- 不要 push，不要合并。
```

### UI 验证：三层检查都过了，人才看 {#uiverify}

结论：UI 验证分三层，从便宜到贵：确定性检查（设计规则、无障碍、和基线截图对比）→ agent 在真实运行环境里操作并截图录屏 → 独立评审 agent 按标准打分。三层都过了才交给人。

为什么：Claude Code 团队说把应用端到端跑起来比测试更重要，Web 用浏览器扩展、移动端用 iOS 或 Android 的 MCP，把启动和操作方法写成 verify skill（Addy Osmani，2026-11-16）；他们的审查流程里，UI 改动还要对照设计规范检查（2026-10-15）。Theo 的 full-send skill 写明：UI 改动要把应用跑起来亲眼看，mock 测试全绿不证明体验没问题。Cognition 让 Devin 用截图、点击、录屏测试自己的改动，并把登录这类重复步骤写成确定性脚本；他们也承认两个难点：截图时机不对会错过一闪而过的提示，模型有时用 JavaScript 直接触发状态，而不是真的去点界面（Ido Pesok，2026-05-29）。

审美能不能自动评？Anthropic 的实验说部分能：写四项标准（整体协调、有原创而不是模板、工艺、可用性），用带分数的例子校准评审 agent，让它用 Playwright 实际操作页面后打分，迭代 5-15 轮；分开的评审比让 agent 自评有效得多，因为 agent 给自己打分总是偏高。但作者也说，他常常更喜欢中间某一轮而不是最后一轮（Prithvi Rajasekaran，2026-03-24）。所以评审 agent 能把平庸的稿子推上去，最后的取舍仍要人做。需要像素级一致时（比如迁移 UI 库）才用截图对比：先冻结基线，差异不为零就是失败（pstack visual-parity）。

```text
目标：交给人之前，由 agent 自己证明 UI 改动是对的，并且没把别处弄坏。先出验证方案，等我确认后执行。

1. 构建并装到真实运行环境：Web 用浏览器自动化；移动端用 iOS 模拟器或 Android 模拟器（能连真机更好）；桌面用桌面自动化。说明你选哪个工具、为什么。
2. 按验收场景实际操作界面，不要用脚本直接改状态来「假装」走过流程。等界面稳定再截图，短暂出现的提示要专门等它出现。
3. 改动前后各截一组图：改动的页面在小屏、大屏、深色模式、长文案、空状态、出错状态下的样子。新交互或动效录一段 30 秒内的视频。
4. 跑确定性检查：设计规则（硬编码颜色、间距、点击区域、无障碍标签、文案翻译），以及没改动的页面和基线截图的对比。基线不准改，有差异就报告。
5. 派一个没参与实现的评审 agent，只给它 DESIGN.md、验收场景和截图录屏，按四项打分：整体是否协调、是不是像模板拼出来的、细节工艺、能不能顺利完成任务。每项写理由。
6. 输出证据包：每条验收场景标通过 / 失败 / 未验证；截图和录屏路径；检查输出；评审分数和意见。验证不到的写「未验证」，不准省略。

验收标准：
- 故意改坏一处（比如把按钮颜色改成硬编码值，或让一段文字溢出），证明检查或评审能抓到，然后恢复。
- 证据包完整，所有路径能打开。
```

### 人审：看审查包，不看 diff {#review}

结论：人看的是审查包，不是 diff。必须人看的只剩五类：视觉方向（从原型里挑）、真机上的手感（滚动、手势、动效节奏、触感反馈）、文案语气、新交互好不好懂、和品牌是否一致。

为什么：Sora 安卓团队写得很直白：Codex 看不到应用在设备上运行，感觉不到滚动不对劲或流程让人困惑，这类体验只能由团队来做（2025-12-12）。Devin 测完会返回带标注的关键截图，以及分章节、压缩了等待时间的录屏，让长测试真的能被看完（2026-05-29）。OpenAI 的 agent 修 bug 时录一段失败视频、一段修好后的视频（2026-02-11）。Expo 的 Agentic CI 在每个 PR 下回帖 PASS / FAIL、录屏、截图和浏览器预览，但文档提醒判决可能出错，设为必需检查前先人读几次证据（Expo 文档）。Kent C. Dodds 用 PR 模板让人审「意图、单向门还是双向门、系统图」而不是代码，并自述没读过自己产品 1% 的代码（2026-11-10）。

```text
目标：把这次 UI 改动整理成我 5 分钟内能看完的审查包。只整理，不改代码。

审查包按这个顺序：
1. 一段话：改了什么、为什么、风险等级（低 / 中 / 高）和理由。
2. 前后对比：改动最大的 3-6 个画面，前后并排，标注设备尺寸和状态。
3. 一段 60 秒内的录屏：只留操作、去掉等待，标出每一段在验证什么。
4. 预览入口：我能在自己手机或浏览器上直接打开的方式（预览链接、二维码或测试包），写清怎么打开。
5. 「只有你能判断」清单，最多 5 条：例如滚动和手势的手感、动效节奏、文案语气、新交互好不好懂、和品牌是否一致。每条写清看哪个画面、做哪个操作。
6. 自动化已经覆盖、我不用看的部分；以及没验证到的部分。

验收标准：
- 审查包是一个文件或一条 PR 评论草稿，所有链接和路径能打开。
- 人审清单不超过 5 条，每条对应一个具体画面或操作。
- 不发布、不合并。
```

### 上线：人批发布，agent 备好开关和回滚 {#launch}

结论：对外发布由人批；agent 准备功能开关、放量计划、监控和回滚演练。移动端要分清能撤回和撤不回两类改动。

为什么：Claude Code 团队用合并队列、功能开关和逐步放量，新行为通常先藏在开关后面（2026-10-15）。Kent C. Dodds 要求每个开关有负责人、指标和移除条件，发布后跑健康检查，备份要真的恢复过（2026-11-10）。Expo 文档里，PR 预览可以发一份 OTA 更新，在 PR 评论里附二维码，扫码就能看。已经发出去的安装包收不回，这一段建议始终人批（这是我的推断，延续第 2 部分）。

```text
目标：让这次功能安全地交到用户手里，出问题能快速收回。先出上线方案，等我批。

1. 给新功能加功能开关：写清负责人、用哪个指标判断好坏、什么条件下删掉开关。
2. 放量顺序：内部 → 小比例用户 → 全量。每一步写观察多久、看哪些指标（崩溃率、错误率、关键流程完成率）、什么情况立即回退。
3. 把改动分成两类：能快速撤回的（只改界面和逻辑，可以用开关或热更新收回）；撤不回的（要发新安装包、改数据格式、改对外接口）。撤不回的部分必须我批。
4. 写回滚步骤，并在测试环境演练一次。
5. 发布后自动检查：跑一次健康检查和核心流程冒烟测试，把结果发给我。

验收标准：
- 上线方案文件贴给我，含开关、放量表、回滚步骤。
- 回滚演练的命令输出。
- 不提交应用商店、不对外发布，等我批。
```

### 两句话的核实 {#quotes}

| 说法 | 一手原文 | 核实结论 |
| --- | --- | --- |
| Cognition：界面好不好看仍是人的强项 | 没找到这句原话。最接近的是 Devin 2025 年度回顾：做视觉设计时 Devin 需要具体规格，比如组件结构、色值和间距；结果不容易直接验证时，需要额外的人审（in visual design, Devin needs specifics like component structure, color codes, and spacing values. When outcomes aren't straightforwardly verifiable, additional human review is necessary） | 意思相近但更窄：Cognition 说的是「要人给具体规格、要人审」，没说审美是人的强项。2026 年的测试篇和 11 月的演讲里没找到审美相关说法 |
| Julius：审美类改动 CI 判断不了 | 不是 Julius 的原话，是队友「agent 工程实践」的归纳。Julius 原帖只说：调循环时「漏过了几个坏 PR」（2026-10-20）；「上周末 Theo 对我的 UI 回退很生气」（2026-10-26） | 原句未能获取。能确认的是 T3 Code 的自动合并出过 UI 回退，但他没把原因归到「CI 判断不了审美」 |

出处：Cognition「Devin's 2025 Performance Review」（2025-11-14）；Julius 的两条 X 帖（2026-10-20、2026-10-26）。链接见第 6 部分。

### 怎么把人在 UI 上的时间压到最低 {#uitime}

- **品味只说一次**：写进 DESIGN.md、设计 skill、lint 和 hook，每次自动执行（OpenAI、Impeccable、Emil Kowalski 的 learn-taste）
- **agent 先自己看**：真跑应用、截图、录屏，mock 测试不算数（Claude Code 团队、Cognition、T3 Code）
- **另一个 agent 先挑刺**：按写好的标准打分，把平庸的稿子推上去再给人（Anthropic）
- **人做选择题，不做问答题**：2-3 个原型放在切换器里比较（pstack、Emil Kowalski 的 prototype、Impeccable 的 live 模式）
- **证据压缩到 5 分钟**：前后对比、去掉等待的分章节录屏、手机扫码预览（Cognition、OpenAI、Expo）
- **按风险分车道**：有基线可比的 UI 改动走自动车道，新视觉方向必须人看（我的归纳，依据 Anthropic「方向、品味与范围由人负责」）

### 移动端怎么验证 UI {#mobile}

| 工具 / 做法 | 能做什么 | 注意 | 出处 |
| --- | --- | --- | --- |
| Claude Code 团队的做法 | 移动端改动用 iOS 或 Android 的 MCP 让 Claude 在模拟器里验证；怎么启动模拟器和应用写进 verify skill | 这是官方建议，没点名具体工具 | Addy Osmani，2026-11-16 |
| Maestro MCP | agent 在 iOS 模拟器、Android 模拟器或连上的 Android 真机上列设备、操作、读界面层级、截前后对比图；走通的路径存成 Flow 文件以后重跑 | 官方示例是删掉一个按钮后自己去屏幕上确认 | Ashish Kharche，maestro.dev，2026-10-23 |
| XcodeBuildMCP（现名 MobileBuildMCP） | iOS：构建、安装、截图、读界面层级、点击、滑动、录模拟器视频 | 工具文档建议按无障碍 id 或 label 点击，坐标只作后备；只覆盖 iOS 和 macOS | GitHub getsentry |
| agent-device | Callstack 的开源设备层：CLI、MCP 和 Node API，控制设备和模拟器上的移动、网页、TV、桌面应用，本地或云端 | React Native 项目可以考虑 | GitHub callstack |
| Expo Agentic CI | 每个 PR 由 agent 在远程模拟器上测，回帖 PASS / FAIL、录屏、截图和浏览器预览；先找原生代码相同的构建，再加上 PR 的 JavaScript | 文档提醒判决可能出错，设为必需检查前先人读几次证据 | Expo 文档 |
| PR 预览二维码 | 每个 PR 发一份 OTA 预览，PR 评论里附二维码，手机扫码就能看 | 适合人审，不能替代真机安装包测试 | Expo EAS Update 文档 |
| 真机体感 | 滚动、手势、动效节奏、触感反馈 | Sora 安卓团队：Codex 感觉不到滚动不对劲，这类体验只能由人来做 | OpenAI，2025-12-12 |

建议的组合：开发时让 agent 用一个移动端 MCP（上表任一）在模拟器里自查并截前后对比图；走通的路径存成可重跑的流程，变成回归测试；每个 PR 自动生成手机可扫码打开的预览；人只在真机上看审查包里列出的手感项。选哪个工具取决于 lobehub-mobile 的技术栈，第 1 步体检会给出答案。iOS 模拟器需要 macOS 机器，这一点会影响 agent 能不能在云端跑 iOS 验证（这是常识性约束，不是来源原话）。

### 对自主等级和 8 步路线的影响 {#impact}

自主等级：UI 改动按「有没有基线可比」分车道。有基线的（修 UI bug、重构、迁移、把颜色和间距规范化）可以像其他低风险改动一样走到 L4b，前提是有截图对比和设计规则检查；新视觉方向和新交互停在 L4a：agent 交原型和审查包，人挑、人批。第 1 部分等级表的 L4a、L4b 条件已据此更新。黑灯工厂一级：没有找到 UI 审美环节关灯的公开案例，Anthropic 的评审 agent 是研究实验，不是生产流程。

8 步路线：顺序不变。第 3 步（verify skill）做移动端时，直接用本章「UI 验证」prompt 和移动端工具表；第 5 步（错题本）加一个 UI 分支，用本章「设计和审美」prompt 把你的审美意见沉淀进 DESIGN.md。起步、需求、计划、实现、人审、上线这几段 prompt 是每次开新模块、做新需求时用的工作流，不占 8 步的位置。

## 6. 来源清单 {#sources}

- [How the Claude Code team thinks about verification](https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification) — claude.dev · Addy Osmani · 2026-11-16
- [How the Claude Code team does code review](https://claude.dev/blog/solving-code-review-at-anthropic/) — claude.dev · Addy Osmani 等 · 2026-10-15
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — Claude Code 官方文档
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — Anthropic Engineering · 2026-01-09
- [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/) — OpenAI · Ryan Lopopolo · 2026-02-11
- [An open-source spec for Codex orchestration: Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/) — OpenAI · Kotliarskyi, Zhu, Brock · 2026-04-27
- [The third era of AI software development](https://cursor.com/blog/third-era) — Cursor · Michael Truell · 2026-02-26
- [What we've learned building cloud agents](https://cursor.com/blog/cloud-agent-lessons) — Cursor · Josh Ma · 2026-06-02
- [How Cognition Uses Devin to Build Devin](https://cognition.com/blog/how-cognition-uses-devin-to-build-devin) — Cognition · 2026-02-27
- [Closing the Agent Loop: Devin Autofixes Review Comments](https://cognition.com/blog/closing-the-agent-loop-devin-autofixes-review-comments) — Cognition · 2026-02-10
- [Verifying Agentic Development at Scale](https://cognition.com/blog/testing-development) — Cognition · 2026-05-29
- [A New Age of Software Engineering（演讲逐字稿）](https://agents.conffab.com/aie-code-26/live/keynotes/sessions/1794511200.md) — AIE Code Summit · Walden Yan · 2026-11-12
- [Software Factories And The Agentic Moment](https://factory.strongdm.ai/) — StrongDM · Justin McCarthy · 2026-02-06
- [How StrongDM's AI team build serious software without even looking at the code](https://simonwillison.net/2026/Feb/7/software-factory/) — Simon Willison · 2026-02-07
- [The Five Levels: from Spicy Autocomplete to the Dark Factory](https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/) — Dan Shapiro · 2026-01-23
- [Agent Readiness overview](https://docs.factory.com/agent-readiness/overview) — Factory 文档
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory · 2026-01-20
- [Factory 2.0: From coding agents to software factories](https://factory.com/news/software-factory) — Factory · Grinberg, Reyes · 2026-06-15
- [Building a software factory for AI SDK](https://vercel.com/blog/building-a-software-factory-for-ai-sdk) — Vercel · Grammel, Dodds · 2026-08-12
- [Enabling Agent 3 to Self-Test at Scale](https://frontier.replit.com/automated-self-testing/) — Replit · 2025-12-15
- [What I Want to Tell You About Orbs](https://ampcode.com/notes/what-i-want-to-tell-you-about-orbs) — Amp · Thorsten Ball · 2026-08-04
- [Run work while you sleep（pstack 指南）](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/07-overnight.md) — GitHub cursor/plugins · poteto
- [pstack README](https://github.com/cursor/plugins/blob/main/pstack/README.md) — GitHub cursor/plugins · poteto
- [here's how i shipped 2,500 PRs last month to production](https://x.com/poteto/status/2102050467505430555) — X · @poteto · 2026-09-21
- [full-send skill](https://github.com/t3dotgg/tstack/blob/main/skills/full-send/SKILL.md) — GitHub t3dotgg/tstack · Theo
- [30 小时合了近 400 个 PR](https://x.com/jullerino/status/2111698488753078321) — X · @jullerino · 2026-10-18
- [漏过了几个坏 PR](https://x.com/jullerino/status/2112472177463460047) — X · @jullerino · 2026-10-20
- [T3 Code AGENTS.md](https://github.com/pingdotgg/t3code/blob/main/AGENTS.md) — GitHub pingdotgg/t3code
- [magpie LESSONS.md](https://github.com/yetone/magpie/blob/main/LESSONS.md) — GitHub yetone/magpie
- [magpie docs/code-standards.md](https://github.com/yetone/magpie/blob/main/docs/code-standards.md) — GitHub yetone/magpie
- [kcd-skills（autopilot）](https://github.com/kentcdodds/kcd-skills) — GitHub kentcdodds
- [「怎样才能不用我发也得到同样结果」](https://x.com/kentcdodds/status/2122069021218750527) — X · @kentcdodds · 2026-11-15
- [Boris Cherny 的 Claude Code 配置帖](https://x.com/bcherny/status/2007179832300581177) — X · @bcherny · 2026-01-02
- [Why Software Factories Fail](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/wsff.md) — GitHub humanlayer · Dex Horthy
- [Ralph Wiggum as a software engineer](https://ghuntley.com/ralph/) — Geoffrey Huntley · 2025-07-14
- [everything is a ralph loop](https://ghuntley.com/loop/) — Geoffrey Huntley · 2026-01-17
- [Agentic Engineering Patterns](https://simonwillison.net/guides/agentic-engineering-patterns/) — Simon Willison · 2026-02-23 起
- [Q: How should I evaluate a coding agent?](https://hamel.dev/blog/posts/evals-faq/how-should-i-evaluate-a-coding-agent.html) — Hamel Husain, Shreya Shankar · 2026-09-19
- [My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey) — Mitchell Hashimoto · 2026-02-05
- [The Coming Loop](https://lucumr.pocoo.org/2026/6/23/the-coming-loop/) — Armin Ronacher · 2026-06-23
- [Astra for Coding: Why Are We Doing This Again?](https://lucumr.pocoo.org/2026/9/7/astra-why/) — Armin Ronacher · 2026-09-07
- [Shipping at Inference Speed](https://steipete.me/posts/2025/shipping-at-inference-speed) — Peter Steinberger
- [Welcome to Gas Town](https://yegge.ai/essays/welcome-to-gas-town/) — Steve Yegge · 2026-01-01
- [Agentic Autonomy Levels](https://addyosmani.com/blog/agentic-autonomy-levels/) — Addy Osmani · 2026-07-02
- [Software Factories, Light and Dark](https://addyosmani.com/blog/software-factories/) — Addy Osmani · 2026-07-20
- [autoresearch](https://github.com/karpathy/autoresearch) — GitHub karpathy · 2026-03
- [skills（triage 标签）](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/triage-labels.md) — GitHub mattpocock

### v2 新增来源

- [Devin's 2025 Performance Review](https://cognition.ai/blog/devin-annual-performance-review-2025) — Cognition · 2025-11-14
- [Theo 对我的 UI 回退很生气](https://x.com/jullerino/status/2114567878829883488) — X · @jullerino · 2026-10-26
- [How we used Codex to build Sora for Android in 28 days](https://openai.com/index/shipping-sora-for-android-with-codex/) — OpenAI · Patrick Hum, RJ Marsan · 2025-12-12
- [Harness design for long-running application development](https://www.anthropic.com/research/harness-design-long-running-apps) — Anthropic · Prithvi Rajasekaran · 2026-03-24
- [Improving frontend design through Skills](https://claude.com/resources/articles/improving-frontend-design-through-skills) — Anthropic · 2025-11-12
- [The Principles（种子、验证、反馈）](https://factory.strongdm.ai/principles) — StrongDM
- [Techniques（Shift Work、Gene Transfusion 等）](https://factory.strongdm.ai/techniques) — StrongDM
- [Attractor（NLSpec 规格仓库）](https://github.com/strongdm/attractor) — GitHub strongdm
- [Boris Cherny 配置帖第 6 条：从 Plan 模式开始](https://x.com/bcherny/status/2007179832300581177) — X · @bcherny · 2026-01-02
- [Boris 在 Hacker News 的建议（Plan 与验证各 2-3 倍）](https://news.ycombinator.com/item?id=46256606) — Hacker News · bcherny · 2025-12-13
- [Choose a permission mode（Plan 模式）](https://code.claude.com/docs/en/permission-modes) — Claude Code 官方文档
- [Design before you write code（pstack 指南 04）](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/04-design.md) — GitHub cursor/plugins · poteto
- [Verify the result and open a PR（pstack 指南 06）](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/06-verify-and-ship.md) — GitHub cursor/plugins · poteto
- [Prototype playbook](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/prototype.md) — GitHub cursor/plugins · poteto
- [Visual parity playbook](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/visual-parity.md) — GitHub cursor/plugins · poteto
- [architect / figure-it-out / exhaust-the-design-space / experience-first](https://github.com/cursor/plugins/tree/main/pstack/skills) — GitHub cursor/plugins · poteto
- [Closing the Agentic Loop（工作坊介绍）](https://kentcdodds.com/talks/closing-the-agentic-loop-getting-agents-to-safely-build-verify-and-ship) — Kent C. Dodds · AIE Code Summit · 2026-11-10
- [DESIGN.md 格式规范](https://github.com/google-labs-code/design.md) — GitHub google-labs-code
- [Stitch's DESIGN.md format is now open-source](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/) — Google Blog · 2026-04-21
- [Impeccable](https://github.com/pbakaus/impeccable) — GitHub pbakaus · Paul Bakaus
- [Impeccable by Design](https://www.paulbakaus.com/impeccable-by-design/) — Paul Bakaus · 2026-07-03
- [Web Interface Guidelines（AGENTS.md）](https://github.com/vercel-labs/web-interface-guidelines) — GitHub vercel-labs
- [Web Interface Guidelines now available as an agent command](https://vercel.com/changelog/web-interface-guidelines-now-available-as-an-agent-command) — Vercel · John Phamous · 2026-01-12
- [Skills for Designers and Engineers](https://github.com/emilkowalski/skills) — GitHub emilkowalski
- [Agents with Taste](https://emilkowal.ski/ui/agents-with-taste) — Emil Kowalski · 2026-07-02
- [kill-ai-slop](https://github.com/yetone/kill-ai-slop) — GitHub yetone
- [native-feel-skill](https://github.com/yetone/native-feel-skill) — GitHub yetone
- [How to Verify UI Changes on iOS and Android with Your Coding Agent](https://maestro.dev/blog/verify-ui-changes-with-your-coding-agent) — Maestro · Ashish Kharche · 2026-10-23
- [XcodeBuildMCP 工具列表](https://github.com/getsentry/XcodeBuildMCP/blob/2847efff/docs/TOOLS.md) — GitHub getsentry
- [agent-device](https://github.com/callstack/agent-device) — GitHub callstack
- [Test pull requests with an AI agent（Agentic CI）](https://docs.expo.dev/agentic-workflows/agentic-ci/) — Expo 文档
- [GitHub Action for PR previews](https://docs.expo.dev/eas-update/github-actions/) — Expo 文档

## 7. 变更记录 {#changelog}

| 版本 | 日期 | 内容 |
| --- | --- | --- |
| v1 | 2026-11-17 | 首版：自主等级表（含黑灯工厂）、两把尺子、当前等级推测、8 步落地 prompt、六个问题分析、领先团队和补查名单 |
| v2 | 2026-11-17 | 新增第 5 部分「从想法到上线」：起步、需求、计划、设计和审美、实现、UI 验证、人审、上线 8 个阶段，每段附 prompt；UI/UX 重点写了品味怎么交给 agent、怎么自动验证、人怎么高效地看、移动端工具。核实了 Cognition 和 Julius 的两句话，都不是原话。等级表 L4a、L4b 加了 UI 条件（有基线可比的 UI 改动可自动合并，新视觉方向停在 L4a）；8 步路线顺序不变，第 3、5 步标注了对应的新 prompt；新增 1 个待确认问题；新增 32 条来源；页面标题去掉 v1。原因：冻鱼要求补上新项目和新需求的流程，而 UI 是最难自动验证、最花人时间的一段，需要单独讲清。 |

