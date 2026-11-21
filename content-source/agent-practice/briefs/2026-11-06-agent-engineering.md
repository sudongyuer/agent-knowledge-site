# Agent 工程实践简报 · 2026-11-06

## 今日概念：Deterministic hooks（确定性 hooks）vs optional MCP（可选 MCP）

**是什么**：MCP 和 Hooks 干的是两件不同的事。MCP 是「工具货架」：把扫描器、仓库、数据库之类的能力挂给 agent，**由模型决定要不要用**。Hooks 是「闸门」：挂在改文件、跑命令、调工具这些事件上，事件一发生就**必定执行**，模型没有投票权。Semgrep 的 Cris Thomas 用一句话说清：MCP 给 agent 能力，Hooks 给平台控制权。

**解决什么**：把「改完代码要扫安全」「危险命令不能跑」写进 prompt 或 CLAUDE.md，长会话里会被忘掉、被省掉、或扫完又改了代码。安全要的是「改了就一定扫」，这只有 hooks 能保证——就像 CI 不会「提醒」你跑测试，而是流水线里强制跑。

**和你已会的东西的关系**：CLAUDE.md / skills 是「尽量遵守的说明书」；MCP 让 agent **可以**调用 Semgrep 之类的工具；Hooks（PreToolUse / PostToolUse 等）让扫描、lint、禁命令在事件点**必跑**。本周 CS146S 第 7 周主题就是 Security，嘉宾 Isaac Evans（Semgrep）。正确叠法：能力用 MCP 暴露，强制检查挂在 hook 上。

**入门原文**：[MCP Gives Agents Tools. Hooks Give Security Control.](https://semgrep.dev/blog/2026/mcp-vs-hooks-ai-agent-security)，Cris Thomas（Space Rogue）/ Semgrep，2026-10-05。操作概览：[Semgrep Guardian overview](https://docs.semgrep.dev/semgrep-guardian/overview)。

**上手 prompt**：
```
目标：把这个仓库里「靠 prompt / CLAUDE.md 提醒 agent 去做」的强制检查，改成事件触发的 hooks，让模型没法跳过。

1. 先读仓库：CLAUDE.md、AGENTS.md、.claude/settings*、hooks 配置、MCP 配置、pre-commit / CI。列出所有「改代码后应跑」的检查（lint、类型、安全扫描、禁危险命令等），每条标明现在靠什么触发：prompt 提醒、MCP 可选调用、hook、CI。贴出文件路径作为证据。不要猜。
2. 挑出「漏跑会造成真实伤害」的检查（例如密钥泄漏扫描、危险 shell、生产配置改动）。对每一条说明：如果只写在 prompt 里，模型可能怎样跳过。
3. 给出方案：哪些改成 PreToolUse / PostToolUse（或仓库已有的等价 hook），哪些仍留给 CI。Hook 脚本要确定性（固定命令、固定退出码），失败时要能把结果回传给 agent 让它改，而不是只静默挡掉。先给我方案，等我确认。
4. 实现后验证两件事并贴证据：(a) 故意引入一个 hook 应抓到的问题，证明 hook 会失败；(b) 在会话里不提「请扫描」，只改文件，证明 hook 仍然会跑。
5. 交付：hook 配置路径、触发事件表、前后对比（prompt 提醒 vs hook）、以及「仍然只靠 prompt 的检查」清单和原因。

参考：Cris Thomas《MCP Gives Agents Tools. Hooks Give Security Control.》https://semgrep.dev/blog/2026/mcp-vs-hooks-ai-agent-security
```

## 本期条目

### 1. 「私有 eval」不是再造一份私有榜：要对你真实系统写、持续维护的高质量检查；有 traces 没测试集时，按 7 步从失败模式开写

- **要点**：Hamel Husain 11 月 5 日说别靠公开基准（基准有硬伤，有模型已背答案），要做 private evals；随后澄清：关键不是「私有」而是 **specific to your tasks / measure your real system**——又一份抽象的 private benchmark 往往也烂，他说的 private evals 是「在你真实系统上、持续维护的高质量测试」。Kritin Vongthongsri 同一天把 Hamel FAQ 收成可照做的 7 步：拉约 100 条生产 traces → 大白话记错 → 归类并计数 → 给 top3 写 pass/fail → 与人工标签对照 → 新失败进数据集。目标是「长得像真实失败的测试集」，不是通用指标好看。
- **链接**：[Hamel 的原帖](https://x.com/HamelHusain/status/2118357661750288570) 与 [澄清回复](https://x.com/HamelHusain/status/2118383681031254059)，Hamel Husain；[7 步起步帖](https://x.com/kritinv07/status/2118382835530690852)，Kritin Vongthongsri；步骤出处：[AI Evals FAQ](https://hamel.dev/blog/posts/evals-faq/)，Hamel Husain / Shreya Shankar。

```
目标：如果这个仓库已有 agent / LLM 相关的生产 traces 或会话日志，但没有「对着真实失败」的评测集，按 error analysis 从 traces 写出 top3 的 pass/fail 检查。

1. 先读仓库，找出 traces / 日志 / 会话记录的位置与格式（目录、表、导出文件、可观测性工具导出）。列出路径；完全没有就告诉我缺什么并停下，不要编造 traces。
2. 抽样约 100 条近期、尽量多样的 traces（不同用户/工作流优先）。先由你自己用大白话标注至少 30 条「哪里不对」，只写用户视角的问题，先不要猜根因。贴出抽样方法和标注样例。
3. 把笔记归成失败类型并计数，给出 top3。每类写清：定义、出现次数、一条代表性 trace 的引用。
4. 只给 top3 各写一条二进制 pass/fail 检查：能确定性判断的用代码断言；必须靠判断的才用 LLM judge，并准备至少若干条人工 Pass/Fail 标签做对照。先给我检查草案，等我确认再实现。
5. 跑检查，贴出通过率；把新发现的失败样例追加进数据集。交付：失败分类表、检查脚本路径、运行命令、真实输出、以及「这不是通用指标、只覆盖这三类失败」的说明。

参考：Hamel Husain https://x.com/HamelHusain/status/2118383681031254059 ；Kritin 的 7 步 https://x.com/kritinv07/status/2118382835530690852 ；Hamel《AI Evals FAQ》https://hamel.dev/blog/posts/evals-faq/
```

### 2. 每个 PR 用「生产场景回放」测 agent 改动：看真实会话变好还是变坏，而不只打静态 eval 分

- **要点**：Ben Hylak / Raindrop 11 月 5 日公开 Simulations（公开 beta）：PR 一开，从触及改动代码的近期生产会话里挑场景，在沙箱里对 PR 新版本重放；工具与服务用 traces 建成有状态的模拟副本，不写生产；GitHub 评论里直接标「影响了几条 / 几条变差」，并给出并排对比（例：`lookup_order` 改成只返回最新订单后，改地址改到了错的那单）。和传统 eval 的差别：eval 对着你维护的数据集打分；回放跑的是 **PR 上的真实 agent 代码 + 真实场景**。下面的 prompt 不绑定 Raindrop，把同一思路落成仓库内可重跑的 before/after 回放。
- **链接**：[Ben Hylak 的发布帖](https://x.com/benhylak/status/2118407746076950882)，ben hylak；产品说明：[Raindrop Simulations](https://www.raindrop.ai/simulate/)。

```
目标：为这个仓库的 agent / LLM 功能建立「改动前后、用真实场景回放对比」的流程，使每次相关 PR 都能看到哪些会话变好、哪些变差。

1. 先读仓库，确认：(a) agent 入口与工具调用位置；(b) 是否已有生产 traces / 会话日志（含工具入参出参）。列出路径。没有 traces 就停下，说明要先开始记录什么字段。
2. 设计最小回放器（语言按仓库已有的来）：输入一条历史会话 + 当前代码版本，在隔离环境重跑（工具打到 fixture / 录制回放，禁止写真实外部系统）。先跑 1 条证明能通，贴出命令和输出。
3. 选一个近期真实改动（或我指定的分支），自动挑 5 到 10 条「会碰到改动路径」的历史会话，分别在改动前 commit 与当前 HEAD 上回放。产出并排对比：最终回复、关键工具调用、是否更差（给出你的判定规则）。
4. 把回放做成一条本地命令（例如 scripts/replay-scenarios），可选接到 CI：相关路径变更时跑，失败时打印变差的会话 id。故意做一个会弄坏行为的改动，证明命令会失败，然后撤销。
5. 交付：回放脚本路径、fixture 约定、一次真实 before/after 对比、测不准之处（例如新工具在旧 traces 里从未出现过时怎么办）。

参考：Ben Hylak / Raindrop Simulations https://x.com/benhylak/status/2118407746076950882 ；https://www.raindrop.ai/simulate/
```

### 3. 形式化要降温：约束 + 经验验证 + 形式化分层叠用；「教 agent 怎么跑应用」和「TLA+ 证明」是两种不同的 verification skill

- **要点**：poteto 11 月 5 日长帖给形式化降温：它不能保证无 bug，只能保证在假设下符合 spec，而 spec 来自人的意图，不是数学。她用 `/statechart` 把隐式状态机画给人看，缩小评审面；模型检查（TLA+/TLC）适合查端到端性质，但有 spec↔代码漂移，所以她用 **empirical verification（真跑）** 交叉确认。近中期建议分层：types/lint/API 约束 → tests/evals/真实使用 → 关键路径形式化。回复里还强调：`/create-verification-skill`（经验：教 agent 怎么跑你的应用）和 `/create-formal-verification-skill`（形式语言）是两回事，应一起用；她的游戏里每个子系统各自维护一份形式化 skill，由 agent 跟着改。
- **链接**：[poteto 的长帖](https://x.com/poteto/status/2118416074601545968)、[经验 vs 形式澄清](https://x.com/poteto/status/2118425409276801121)、[每子系统一份 FV skill](https://x.com/poteto/status/2118419507685544058)，lauren (poteto)；[statechart skill](https://github.com/cursor/plugins/tree/main/pstack/skills/statechart)。

```
目标：盘点这个仓库的验证层，补齐「经验验证 skill」，只对真正需要的关键子系统加或更新形式化检查，并证明检查会红。

1. 先读仓库：测试、lint/类型、evals、hooks、已有的 verification / formal-verification skill、TLA+ 或其他模型。按三层制表：约束与护栏、经验验证（真跑）、形式化。每层列出路径和覆盖了什么；空的就标空。
2. 若还没有「教 agent 如何启动应用、跑关键路径、收集不可辩驳证据」的经验验证 skill，起草一个（放在仓库约定的 skills 目录），内容只写：怎么跑、跑完看什么、失败长什么样。先给我草案，等我确认再写入。
3. 从业务里挑 1 个「顺序会打结」的子系统（状态机、重试、队列、权限切换等）。说明为什么它值得形式化、其他模块为什么先不值得。等我确认。
4. 对该子系统：用 statechart 或等价方式画出隐式状态机给人看；若已有形式化模型则对照代码查漂移；没有则写最小不变式模型。必须先做至少 2 个故意破坏，贴出检查器抓到的输出，再跑真实代码。
5. 交付：三层对照表、经验验证 skill 路径、形式化文件路径、重跑命令、故意破坏的失败证据、以及「改了哪些文件必须重跑哪一层」写进 AGENTS.md 的不超过 8 行说明。

参考：poteto https://x.com/poteto/status/2118416074601545968 ；https://x.com/poteto/status/2118425409276801121 ；statechart skill https://github.com/cursor/plugins/tree/main/pstack/skills/statechart
```

## 本期去重用源链接（机器可读）
- https://semgrep.dev/blog/2026/mcp-vs-hooks-ai-agent-security
- https://docs.semgrep.dev/semgrep-guardian/overview
- https://x.com/HamelHusain/status/2118357661750288570
- https://x.com/HamelHusain/status/2118383681031254059
- https://x.com/kritinv07/status/2118382835530690852
- https://hamel.dev/blog/posts/evals-faq/
- https://x.com/benhylak/status/2118407746076950882
- https://www.raindrop.ai/simulate/
- https://x.com/poteto/status/2118416074601545968
- https://x.com/poteto/status/2118425409276801121
- https://x.com/poteto/status/2118419507685544058
- https://github.com/cursor/plugins/tree/main/pstack/skills/statechart
- （看过未收）https://x.com/thorstenball/status/2118384838965424458 （agent 回归少于人：观点帖，可照做性弱，与 11-04 证据优先同家族）
- （看过未收）https://agentskills.io/ （Progressive disclosure 常青说明，作概念备选未用；本周用 hooks）
- （看过未收）https://www.anthropic.com/engineering 、https://claude.dev/blog/ （无 11-04 后新文）
- （看过未收）https://simonwillison.net/ 近几日（datasette-agent / 非 agent 工程）
- （看过未收）@bcherny RT ClaudeDevs Haiku 状态行（11-05 已排除的产品更新）
- （看过未收）@mihail_eric Vertical Agent Meetup（活动宣传）
- （看过未收）CS146S W7 Security · Isaac Evans 讲座内容待公开后跟进；下周 W8 Background Agents（11/10、11/12）
