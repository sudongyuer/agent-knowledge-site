# Agent 工程实践简报 · 2026-11-03

## 今日概念：Super-agent（超级 agent）/ Router–Worker 两层架构

**是什么**：DeepSeek Harness 团队 11 月 1 日发的长文提出的一种"常驻 agent"的系统设计。核心是把 agent 拆成两层：上面一个**常驻的 Router（路由层）**，只负责和人说话、记住全局情况、把活派出去，它自己不干具体的活（甚至可以没有 Bash 工具）；下面是很多个 **Worker（执行层）**，每个任务开一个，各自有独立的上下文和完整工具，干完向 Router 汇报，由 Router 统一回复人。驱动它的不再是人一句句打的 prompt，而是环境里的事件（群聊消息、PR 评论、CI 结果、邮件），文中叫 Trigger。外面再挂一个独立的 **Watchdog（看门狗）** 会话，定时检查各个 Worker 是不是真的在推进、有没有跑偏或卡死。

**解决什么**：作者观察到一个人同时最多盯 3 到 5 个 agent 会话，所以"单个任务的上限看模型，多个任务的上限看人的注意力"。两层架构让你永远只面对"一个 agent"，开会话、切上下文这些事交给系统。文中的对照实验很有说服力：同样约 300 条消息里混着约 20 个真实需求，单会话加"适当时用 subagent"的提示词，5 次里一次都没委派，p95 完成时间 29.5 分钟；改成"优先委派"的提示词也还有一次自己动手拖出长尾；而 Router 从结构上就不干活的 Super-agent，p50 12.4 分钟、p95 15.7 分钟，代价是多花缓存读取 token。结论是：**靠提示词让模型"记得委派"不可靠，要靠结构让它没法不委派。**

**和你已会的东西的关系**：这就是你想要的 software factory 的一张完整架构图。你学过的 Ralph loop 是"一个 Worker 怎么反复干活"，subagent 是 Worker 内部再拆，而 Super-agent 回答的是"谁来接需求、谁来派活、谁来盯进度"。它和你之前学的 lethal trifecta 也直接相关：文章第 8.4 节自己承认，事件驱动意味着更多不可信输入，云端 agent 一旦被提示注入，连着的每台机器都有风险。

**入门原文**：[Exploring Super-agent Design: Towards a More Autonomous Agent System](https://x.com/DeepSeekHarness/status/2116857257245987236)（DeepSeek Harness 团队，执笔 Yujia Qiao，X 长文）；看不了 X 长文可读 [offloop 的完整英译](https://offloop.org/learn/exploring-deepseek-super-agent-design)；原型代码在 [deepseek-ai/dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype)（官方声明是研究原型，不能直接上生产）。CS146S 讲师 Mihail Eric [转发时说](https://x.com/mihail_eric/status/2117301688784846953)，Lee Robinson 在他课上讲的很多观点和这篇一致。

**上手 prompt**：
```
目标：用 Super-agent 的 Router–Worker 思路，审视并改造我在这个仓库里跑 coding agent 的方式，让"主会话只派活、不干活"由结构保证，而不是靠我提醒。

背景（来自 DeepSeek Harness 团队《Exploring Super-agent Design》）：常驻 Router 只负责和人交互、记全局、派任务，不执行具体工作；每个任务一个独立上下文的 Worker，干完向 Router 汇报；事件先过代码规则（快路径）再交给模型判断（慢路径）；独立 Watchdog 定时检查 Worker 是否有实质进展。他们的实验里，只靠提示词"适当时用 subagent"，主会话 5 次中 0 次委派。

步骤：
1. 先读仓库里所有 agent 配置：CLAUDE.md、AGENTS.md、.claude/（agents、skills、settings、hooks）、.agents/ 等。列出文件路径和每个文件现在规定了什么，作为证据。不要猜。
2. 按上面四个要素（Router 只派活 / Worker 隔离 / 快慢路径过滤 / Watchdog）逐条打分：已有、部分有、没有。每条都给出依据（文件和行）。
3. 只落地一处改动，优先"让主会话从结构上派活"：例如定义一个工具受限的 router 角色（不给编辑和 shell 类工具），和一个工具完整的 worker subagent 定义；或者在 AGENTS.md 里写清"多步任务一律交给 worker，每个 worker 只处理一件事并返回：做了什么、证据、未解决问题"。改之前先告诉我方案，等我确认。
4. 验证：给我设计 3 条测试请求（一条小事、一条多步任务、两条同时到达的任务），说明在新配置下应该怎样分派，并实际跑其中一条，贴出 agent 是否真的委派了的证据（会话记录片段或 subagent 输出）。
5. 最后列出这个仓库离"事件驱动 + Watchdog"还缺什么，各用一句话说明需要什么外部触发源。不要自己去接任何外部服务。
```

## 本期条目

### 1. 选模型别信公开榜单：Vik Paruchuri 用 OCR 基准举例，正确答案会被判错、后处理脚本能刷分，要切出和你任务相关的片段，再用自己的数据测

- **要点**：Hamel Husain 推荐 Vik Paruchuri 的一场演讲，拆了几个流行 OCR 基准的问题：ParseBench 有题期望 310 吉瓦而正确值是 303，73% 的图表题问的是图上没印出来的数；olmOCR-bench 里模型正确保留原文的大小写反而被判错，一个 700 行的输出后处理器能加 1 到 2 分，比很多模型之间的差距还大；OmniDocBench 用编辑距离打分，导致用 HTML 写对的表格比用 Markdown 写错一个数扣分还多。还有一个模型总分排最后，但内容和表格两项都赢了第一名，说明总分会掩盖你真正关心的能力差异。视频后半段讲怎么按自己的任务切基准、怎么造答案经过核实的测试、怎么在自己的文档上测模型。对你的启发：App 里任何 LLM 功能换模型前，先建一个小而准的私有测试集。
- **链接**：[Hamel Husain 的推荐帖（含视频和章节时间点）](https://x.com/HamelHusain/status/2117384307593646230)，演讲者 Vik Paruchuri；Shreya Shankar 也[推荐了这场](https://x.com/sh_reya/status/2117385096236093673)，强调应用开发者可以从公开基准里挖出对自己有信号的片段。

```
目标：为本仓库里的一个 LLM 功能建立"私有小评测集"，以后换模型或改 prompt 时先跑它，而不是看公开榜单。

1. 先读仓库，找出所有调用 LLM 的功能（API 调用、prompt 文件、模型配置），列出路径作为证据。如果没有 LLM 功能，直接告诉我并停下。
2. 让我从中选一个功能；我没选的话，挑调用最频繁或最关键的一个，并说明理由。
3. 从仓库里已有的真实样例（测试 fixture、日志、示例输入、文档里的例子）收集 20 到 30 条输入。不要编造数据；真实样例不够时，告诉我缺多少，并说明我该从哪里补。
4. 为每条写"期望结果"和打分规则，必须先检查打分规则本身：
   - 正确但格式不同的答案（大小写、换行、HTML 与 Markdown 等）不能被判错；
   - 能用确定性代码判断的（字段是否存在、数值是否相等）用代码判断，不要用模型打分；
   - 按任务类型分组打分（例如分类、抽取、生成），不只给一个总分。
5. 写一个可重复运行的评测脚本（先确认仓库实际的语言和运行命令），对当前模型跑一遍，贴出每组的得分和失败样例。
6. 交付：评测集文件路径、脚本路径、运行命令、真实输出。指出我的打分规则里你认为最可能"冤枉正确答案"的一处。

参考：Vik Paruchuri 的演讲（Hamel Husain 推荐）https://x.com/HamelHusain/status/2117384307593646230
```

### 2. 给长时间跑的 agent 配一个"看门狗"：不是查进程活没活，而是查任务有没有实质进展

- **要点**：同一篇 Super-agent 文章里最容易单独搬走的一块。作者指出，很多故障不是进程崩了，而是模型陷入无效循环或偏离目标，所以传统的存活探针不够。他们的做法是一个独立于主系统的 Watchdog 会话，靠定时消息驱动：处理 API 报错、状态恢复失败这类基础故障，同时用模型判断各个 Worker 有没有实质进展、有没有偏离总目标，发现问题就介入；对间歇性故障持续复查直到恢复。另一个可照搬的点是事件过滤分快慢两路：先用确定性代码（来源、白名单、群范围）挡掉大部分噪音，剩下的才交给模型判断，这样成本和延迟才撑得住。
- **链接**：[Exploring Super-agent Design](https://x.com/DeepSeekHarness/status/2116857257245987236) 第 3.1 节和第 6 节，DeepSeek Harness 团队（Yujia Qiao 执笔）。

```
目标：给我在本仓库里长时间运行的 agent 任务（循环脚本、后台会话、并行 worktree 等）加一个"看门狗"检查，判断每个任务是否有实质进展，而不只是进程是否存活。

1. 先读仓库，找出现有的长跑方式和它们留下的痕迹：日志目录、计划/待办文件、分支和 worktree、提交记录。列出路径和命令作为证据，不要猜。若没有任何长跑任务，告诉我并给出最小的示例场景后停下。
2. 写一个只读的检查脚本 scripts/watchdog（语言按仓库已有的来），对每个任务输出：最近一次提交时间、最近 N 轮日志里是否反复出现同一错误、计划文件里完成项是否有变化、改动是否集中在与目标无关的文件。用确定性规则先判"明显卡住"，只有规则判不了的情况才列为"需要模型判断"，并附上要给模型看的最小证据片段。
3. 再写一个 prompt 文件 prompts/watchdog.md，用于让一个独立的 agent 会话读取第 2 步的输出，对"需要模型判断"的任务给出：在推进、原地打转、偏离目标、外部故障 四选一，并附理由和建议动作。它只能写报告，不能修改代码或停止任务。
4. 用仓库里真实存在的一个任务或日志跑一遍，贴出脚本输出和判断结果。
5. 告诉我如何定时运行它（例如 cron 或 CI 定时任务），但不要替我装定时任务，等我确认。

参考：DeepSeek Harness 团队《Exploring Super-agent Design》第 3.1、6 节 https://x.com/DeepSeekHarness/status/2116857257245987236
```

### 3. 把别人用 AI 生成的 PR 当成"附带示例的 bug 报告"，再让模型帮你分拣

- **要点**：Simon Willison 发 LLM 新版本时说，很多维护者抱怨 AI 辅助的 PR 泛滥，但他这个受影响最大的项目并不觉得是负担：他让前沿模型帮忙分拣，挑出最有用的修复；这一版收了 12 位作者的修复，几乎都是 AI 辅助的，审阅负担比预期小得多。他的心态是把这些 PR 看成附带示例的 bug 报告：有时直接合，有时自己另写修复。对你的用处：别人（或你自己的 agent）开来的 PR，先让 agent 判断它揭示了什么真问题，再决定合、改还是重写。
- **链接**：[LLM 新版本发布说明](https://simonwillison.net/2026/Nov/2/llm/)，Simon Willison（2026-11-02）。

```
目标：帮我分拣本仓库当前所有打开的 PR，把每个 PR 当作"附带示例的 bug 报告"来读，而不是只决定合或不合。

1. 先确认你能用的方式读取 PR（例如 gh CLI 是否已登录、仓库远程地址），贴出确认命令和结果。读不到就停下告诉我缺什么。只读，不要评论、合并、关闭或打标签。
2. 对每个打开的 PR，逐个读描述、diff 和 CI 结果，输出一行表格：PR 链接、它揭示的真实问题一句话、证据（复现步骤或相关代码位置）、建议（直接合 / 小改后合 / 问题成立但我自己重写更好 / 不成立）、理由。
3. 对建议"直接合"或"小改后合"的，在本地切新分支检出，跑仓库实际的类型检查和测试命令（先读仓库确认命令），贴出真实结果。不要推送。
4. 找出多个 PR 指向同一根因的情况，合并成一条，并说明更好的一处修复应该改在哪里。
5. 最后按"修复价值 / 审阅成本"排序，告诉我先看哪三个。

参考：Simon Willison《LLM 新版本发布说明》https://simonwillison.net/2026/Nov/2/llm/
```

## 本期去重用源链接（机器可读）
- https://x.com/DeepSeekHarness/status/2116857257245987236
- https://offloop.org/learn/exploring-deepseek-super-agent-design
- https://github.com/deepseek-ai/dsh-superagent-prototype
- https://x.com/mihail_eric/status/2117301688784846953
- https://x.com/HamelHusain/status/2117384307593646230
- https://x.com/sh_reya/status/2117385096236093673
- https://simonwillison.net/2026/Nov/2/llm/
- （看过未收）https://x.com/thorstenball/status/2117147179265433866 （一句 prompt 让 Amp 跑 52 分钟重建旧站，体验分享无可照做步骤）
- （看过未收）https://x.com/mihail_eric/status/2117294731214688313 （CS146S W7 周四 Semgrep Isaac Evans 讲 agent 代码安全，讲座预告，下期可跟进内容）
- （看过未收）https://simonwillison.net/2026/Nov/2/census-bureau-super-intelligence/ （非 agent 工程）
- （看过未收）https://www.anthropic.com/engineering 、https://claude.dev/blog/ （无新文，最新分别为 10-13、10-15）
