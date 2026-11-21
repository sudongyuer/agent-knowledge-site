# Agent 工程实践简报 · 2026-10-28

> 给冻鱼。窗口约 **2026-10-27 → 2026-10-28**（Asia/Kuala_Lumpur）。严格窗口内几乎无新一手长文；本期以「今日概念」+ 近两日一手 X 实践为主。只收录已核验材料。

## 今日概念：Agent-ready codebase（agent 就绪代码库）

**大白话**：不是先换更强的 coding agent，而是先让仓库「自带说明书 + 快反馈 + 本地能验证」。缺类型/测试/文档/可跑命令时，环境会打败任何 agent。

**解决什么问题**：同一模型在不同仓库效果差一截时，多数人怪模型；真正瓶颈常是仓库没法给 agent 闭环反馈。

**和你会的东西的关系**：你已在写 skill / 想做 software factory——agent-ready 是工厂的地基：先让任意仓库达到「Documented → Standardized」，agent 才谈得上自主并行。

**入门**：
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory Team（2026-01-20）
- 模型页：[Agent Readiness overview](https://docs.factory.ai/agent-readiness/overview)（5 级；先冲 Level 3 Standardized）

**上手 prompt**（复制给 Claude Code / Codex）：

```
你在当前仓库做一次「Agent-ready」审计，不要绑任何特定技术栈。

目标：对照 Factory Agent Readiness 的思路，判断仓库离「agent 能可靠干活」还差什么，并给出可合并的最小修复。

必读背景（若可联网）：https://factory.ai/news/agent-readiness 与 https://docs.factory.ai/agent-readiness/overview
五级：1 Functional → 2 Documented → 3 Standardized → 4 Optimized → 5 Autonomous；先把目标定为 Level 3。

步骤：
1. 探测仓库：读 README、AGENTS.md/CLAUDE.md（若有）、package/锁文件、CI 配置、测试与 lint/typecheck 脚本。先确认「真实本地验收命令」是什么（不要猜；在仓库里找并试跑最小子集）。
2. 按支柱打勾/打叉（每条附证据：文件路径或命令输出摘录）：
   - Style & Validation（formatter/linter/typecheck）
   - Build（可复现安装与构建命令是否写清）
   - Testing（本地可跑的单测/集成测）
   - Documentation（AGENTS.md 或等价；新人/agent 如何 setup、如何证明改对了）
   - Dev environment（.env 模板、一键启动本地依赖）
   - 其余支柱（observability/security/task discovery）只记明显缺口
3. 估当前大概在哪一级，并列出「升到 Level 3」的优先修复清单（最多 5 项，按 ROI）。
4. 只实现清单里风险最低的 1–2 项（例如补最短 AGENTS.md「如何跑测 + 什么算证据」、或补一条本地 typecheck/test 脚本说明）。不要大重构。

验收：
- 输出一张表格：支柱 | 现状 | 证据 | 建议
- 对你改动的文件：贴出 diff 摘要，并实际跑通你写下的验收命令，贴关键输出
- 明确写：当前估级、下一件该做的事
```

## 本期条目

### 1. 给 agent 的最好反馈是类型与可捕获行为，不是再堆散文规则
- **要点**：agents 靠反馈活着；用类型让非法状态不可表示，再用 property/fuzz/expect（打印并捕获行为）测试缩小 review 面——把常踩坑编码进结构，而不是写进更长的 skill。
- **链接**：[poteto · 2026-10-26](https://x.com/poteto/status/2114626630429913383) — lauren (poteto)，转述 Yaron Minsky 演讲；视频 [How to improve your codebase for agents](https://www.youtube.com/watch?v=rUYP4C29yCw)

```
你在当前仓库。目标：找 1 个「agent 常写错、但散文规则拦不住」的状态/行为，用类型或不变量测试把它变成硬反馈。

步骤：
1. 扫最近失败：CI 日志、测试失败、PR 打回评论、或 git 里反复改同一处的文件。归纳「第一个实质失败」是什么。
2. 选成本最低的一种加固（按语言实际工具来，先读仓库确认）：
   - 类型/枚举/品牌类型：让非法组合编译不过
   - 或 expect/fixture/快照测试：打印关键行为并固化期望
   - 或一条 property/fuzz（若仓库已有框架）
3. 实现最小改动；不要借机大重构。
4. 写一段 ≤10 行的 AGENTS.md/CLAUDE.md 补充：说明「这类错误靠什么自动拦」，删掉等价的散文禁止句（若存在）。

验收：
- 演示：人为制造旧错误路径时，typecheck 或测试必须失败（贴命令+输出）
- 正确路径仍然通过（贴命令+输出）
- 列出改动文件与为什么这比再写一条 skill 更稳
```

### 2. 写代码不再是瓶颈时，CI 变成 verification 层
- **要点**：5 人 agent 产出可≈50 人 PR 量；人审不过来时，信任落在 CI。优化是一叠纸割伤（更快 typecheck/lint、sparse checkout、预装依赖、均衡分片）；test impact 有用但到量也会撑不住。
- **链接**：[mihail_eric · 2026-10-26](https://x.com/mihail_eric/status/2114732082778013954) — Mihail Eric（CS146S）

```
你在当前仓库。目标：把「agent 改完能否信任」从口头保证，推进到可自动跑的 verification，并砍掉最痛的 CI/本地反馈延迟。

步骤：
1. 找到真实门禁：读 CI 配置与 package scripts，列出 PR 上会跑的检查，以及开发者本地应对的最短命令。对每条记录：大约耗时、是否可本地复现。
2. 找出 Top 3 纸割伤（例如：用了慢 typecheck、全量测、重复安装依赖、未分片、文档命令与真实命令不一致）。每条附证据。
3. 只做 1 个高 ROI 修复，例如：
   - 文档化并跑通「本地 5 分钟内」的最小验证集（typecheck/lint/受影响测试）
   - 或给 agent/人类同一套 `verify` 脚本，命令与 CI 子集对齐
   - 或修正 README/AGENTS.md 里过时的测试命令
4. 在 AGENTS.md/CLAUDE.md 写清：合并前必须出示哪些命令输出才算「做完」。

验收：
- 贴出「修复前/后」你实际跑的验证命令与关键耗时或输出摘要
- 说明这条门禁拦的是哪类 agent 假完成
- 不要改无关业务功能
```

---

## 本期去重用源链接（机器可读）

- https://factory.ai/news/agent-readiness
- https://docs.factory.ai/agent-readiness/overview
- https://x.com/poteto/status/2114626630429913383
- https://www.youtube.com/watch?v=rUYP4C29yCw
- https://x.com/mihail_eric/status/2114732082778013954
- https://hamel.dev/blog/posts/evals-faq/what-does-a-good-eval-dashboard-look-like.html
- https://code.claude.com/docs/en/hooks-guide
- https://x.com/HamelHusain/status/2114935968604299552
- https://x.com/mihail_eric/status/2113277483701395508
- https://x.com/thorstenball/status/2114989330754117943
