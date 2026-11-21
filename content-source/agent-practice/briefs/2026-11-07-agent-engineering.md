# Agent 工程实践简报 · 2026-11-07

## 今日概念：Background agents（后台 / 异步 agent）

**是什么**：前台 agent 是你坐在终端里、一问一答地推；background agent 是你把任务交出去之后，它在**另一条会话 / 云端 / 定时触发**里自己跑，你只在需要拍板或验收时回来。Claude Code 文档把并行干活拆成几档：同会话里的 subagent、用 `claude agents` 看管的后台会话（agent view）、实验性的 agent teams、以及可在机器关掉后继续跑的 Projects / 云端定时任务。关键不是「会不会开多个窗口」，而是**协调权在谁手里、工人能不能互聊、改同一份文件时怎么隔离**。

**解决什么**：软件工厂要的是「你睡觉时任务还在推进」。如果每件事都要你盯着终端，吞吐会被你本人卡住。Background agents 把「你在不在场」从必要条件里拿掉——前提是验收、权限和隔离已经先铺好，否则就是无人看管的乱改。

**和你已会的东西的关系**：CLAUDE.md / skills 仍是说明书；hooks 仍是闸门（后台会话一样会触发）。和 11-03 的 Super-agent（Router–Worker）比：那是**架构角色**；background agents 是**运行时态**——工人可以是后台的。和你要的 software factory 直接对上：触发器开工 → 后台跑 → 验证闭环收结果。CS146S 下周（11/10、11/12）就是 Week 8 Background Agents，嘉宾 Cloudflare 的 Rajesh Bhatia。

**入门原文**：[Run agents in parallel](https://code.claude.com/docs/en/agents)（Claude Code 官方，把 subagent / agent view / teams / Projects 对照清楚）；预备课材料：[Coding agents · Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/integrations/coding-agents/)（agent 离机后怎么观测与控流量）。

**上手 prompt**：
```
目标：盘点这个仓库里「可以交给后台 / 异步 agent」的工作，并写清每类工作的启动方式、验收标准和隔离要求。不要绑定某一家云产品。

1. 先读仓库：README、CLAUDE.md / AGENTS.md、CI、定时脚本、已有的 agent / subagent / workflow 配置。列出路径。说明当前有没有「人不在终端前也能推进」的入口；没有就直说。
2. 按三列制表：任务类型（例：长测试、PR 照看、大范围搜索、批量迁移）、适合前台还是后台、为什么。后台任务必须写清：成功长什么样、失败怎么停、结果交到哪里。
3. 挑 1 个最值得先后台化的任务。设计最小方案：(a) 如何触发（本地命令 / CI / 定时）；(b) 工作目录如何隔离（worktree 或其他），避免和前台改同一文件；(c) 完成后如何用仓库已有检查证明没退步。先给我方案，等我确认。
4. 实现后真跑一次（可用一个故意会失败的变体证明验收会红），贴出命令、日志路径、通过/失败证据。
5. 交付：对照表、方案说明、重跑命令、以及写进 AGENTS.md 不超过 8 行的「什么任务可以丢后台、什么必须前台盯」。

参考：Claude Code《Run agents in parallel》https://code.claude.com/docs/en/agents ；Cloudflare AI Gateway · Coding agents https://developers.cloudflare.com/ai-gateway/integrations/coding-agents/
```

## 本期条目

### 1. Amp 11 月 6 日上线 Spaces：一个「协调员」会话帮你开工人、汇总结果；人坐船长椅，需要时再下机舱

- **要点**：Amp（Thorsten Ball 团队）11 月 6 日发布 Spaces：一个 space 里有一个专职协调的 agent，负责替你开线程、分活、盯进度；团队可在同一个 space 里丢反馈、开讨论，再 @ agent 执行。他们自己用 space 做安全审查：先把代码库切成 16 块并行审、再开线程核对发现、把摘要留在 space 里给人看。和 11-03「Super-agent / Router–Worker」是同一类想法，但这次是**可协作的产品形态**：协调发生在对话层，而不是只在一次 prompt 里。下面的 prompt 不绑定 Amp，把「协调员 + 隔离工人 + 汇总验收」落成你仓库里能跑的编排。
- **链接**：[Spaces](https://ampcode.com/news/spaces)，Amp / Sourcegraph，2026-11-06。

```
目标：为这个仓库设计并落地一个「协调员 agent + 多个工人」的最小编排，用来完成一类可并行的审查或迁移任务。

1. 先读仓库，确认并行能力：subagent / agent 配置、worktree、CI 矩阵、已有的编排脚本。列出路径；没有就说明缺什么，并提议只用「多个隔离 worktree + 一个汇总脚本」的最小替代。
2. 选一个适合并行的任务（例如：按目录做安全/风格审查、或一批互不依赖的文件迁移）。写清：协调员负责什么、每个工人的输入输出格式、工人之间是否允许互聊（默认不允许，只向协调员汇报）。
3. 实现：(a) 协调员 prompt 或脚本，负责拆分任务、启动子工人、收集结果；(b) 工人必须在隔离目录或 worktree 里改文件；(c) 汇总成一份给人看的摘要（问题列表 + 证据路径）。先给我拆分方案，等我确认再跑。
4. 真跑一轮，贴出：拆了几块、每块命令、汇总摘要。故意在一块里塞一个应被抓到的问题，证明汇总不会漏。
5. 交付：编排入口路径、工人约定、一次真实汇总、以及「何时不该用协调员（任务强依赖、必须同一会话上下文）」的说明。

参考：Amp《Spaces》https://ampcode.com/news/spaces
```

### 2. Coding agent 流量先过一层 LLM Gateway：可观测、限流、计费归属、DLP；Claude Code 改三个环境变量即可接 Cloudflare AI Gateway

- **要点**：agent 一旦后台化、多人共用密钥，你就看不见「谁在烧 token、有没有把密钥带出仓库」。Cloudflare AI Gateway 的 Coding agents 文档说明：把 agent 指到 Gateway 而不是直连厂商，可得到请求日志、缓存、限流、成本归因，以及用 DLP 扫 prompt/响应里的密钥与敏感数据。Claude Code 专用页给出可照做配置：`ANTHROPIC_BASE_URL` 指到 gateway 的 anthropic 端点，再用 `ANTHROPIC_CUSTOM_HEADERS` 带上 `cf-aig-authorization`。注意：开响应侧 DLP 会缓冲整段流式输出、拉高首 token 延迟；低延迟场景可先只扫 Request。这是 W8「Background Agents」嘉宾栈里的控制面预习。
- **链接**：[Coding agents](https://developers.cloudflare.com/ai-gateway/integrations/coding-agents/)、[Claude Code 接入](https://developers.cloudflare.com/ai-gateway/integrations/coding-agents/claude-code/)，Cloudflare Docs（Claude Code 页标注更新于 2026-08-17）。

```
目标：评估并把这个项目的 coding agent（Claude Code / Codex / 其他）流量接到一层 LLM Gateway（可用 Cloudflare AI Gateway，或其他兼容 Anthropic/OpenAI 端点的网关），做到「能看见请求、能挡密钥、能归因成本」。

1. 先读仓库与本机配置：agent 如何认证、是否已有代理 / BASE_URL、有无团队密钥管理。列出当前直连路径作为证据。不要猜账号 ID。
2. 对照网关文档，写出最小接入方案：需要哪些环境变量或 settings.json env、密钥放哪（BYOK vs 网关代持）、如何在仪表盘确认日志出现。若团队没有 Cloudflare 账号，改成「等价清单」：必须具备的能力（日志、限流、密钥扫描）和任一网关的对照表，然后停下等我选供应商。
3. 若已选定 Cloudflare：按文档配置 Claude Code（或仓库实际用的 agent）的 BASE_URL 与授权头；发一条无敏感内容的探测 prompt；在网关 Logs 里截取/记下 model、token、latency 作为证据。
4. 若启用 DLP：先用 Request-only 策略，故意在 prompt 里放一个假 API key 样例，证明会被 flag/block；说明对 streaming 首包延迟的影响。
5. 交付：配置落点（settings 路径或 shell profile，密钥打码）、一次真实日志证据、回滚步骤、以及写进 AGENTS.md 不超过 5 行的「本地直连 vs 经网关」约定。

参考：https://developers.cloudflare.com/ai-gateway/integrations/coding-agents/ ；https://developers.cloudflare.com/ai-gateway/integrations/coding-agents/claude-code/
```

### 3. Skill 不是「又一篇 markdown」：文件夹 + 渐进披露 + 按需 hooks；Anthropic 内部体感最强的是「产品验证」类 skill

- **要点**：Thariq Shihipar（Claude Code）在《How we use skills》里把内部上百个 skill 收成九类，并强调：skill 是**文件夹**（脚本、参考、资源），不是单文件；用文件系统做 context engineering——SKILL.md 只指路，细节在 `references/` 等里按需读（progressive disclosure）。另有 **on-demand hooks**：只在调用该 skill 时启用、会话结束失效，例如 `/careful` 挡危险 shell、`/freeze` 只许改某目录——和 11-06「全局确定性 hooks」互补：全局管永远该强制的，按需管偶尔才要的。文中明确：内部**产品验证类 skill**对输出质量提升最可测，值得有人专花一周把它做好。description 要写成「何时触发」，不是给人看的摘要。
- **链接**：[Lessons from building Claude Code: How we use skills](https://claude.dev/blog/lessons-from-building-claude-code-how-we-use-skills/)，Thariq Shihipar / Anthropic，2026-06-03。

```
目标：把这个仓库里一个「又长又常被忽略」的 skill（或 CLAUDE.md 里一大段流程）改成：短 SKILL.md + 渐进披露文件 +（可选）仅在该 skill 启用时生效的 hooks，并证明验证步骤真的会跑。

1. 先读现有 skills / commands / CLAUDE.md。挑 1 个最臃肿或最常被跳过验证步骤的。贴出原路径和大约行数。没有 skill 就从 CLAUDE.md 里抽一段「本该可复用」的流程。
2. 重写成文件夹结构：SKILL.md（目标、何时用、指向子文件）、gotchas.md、必要时 references/ 与 scripts/。description 写成触发条件（动词/场景），不要写成功能简介。先给我目录树和 SKILL.md 草案，等我确认。
3. 若该流程有「只在此时才该强制」的约束（例如只在碰生产配置时禁 rm/force-push），加上 skill 级 on-demand hooks 或仓库等价机制；说明为什么不放进全局 hooks。
4. 加或改一条可运行的验证：故意破坏一次，贴出失败输出；修好后再跑通，贴出成功输出。
5. 交付：新旧结构对比、触发 description、hooks 范围说明、验证命令与证据。

参考：Thariq Shihipar《How we use skills》https://claude.dev/blog/lessons-from-building-claude-code-how-we-use-skills/
```

## 本期去重用源链接（机器可读）
- https://code.claude.com/docs/en/agents
- https://developers.cloudflare.com/ai-gateway/integrations/coding-agents/
- https://developers.cloudflare.com/ai-gateway/integrations/coding-agents/claude-code/
- https://ampcode.com/news/spaces
- https://claude.dev/blog/lessons-from-building-claude-code-how-we-use-skills/
- （看过未收）https://ampcode.com/news/service-accounts （2026-11-03，团队属主线程 / CI 用服务账号；与 Spaces 同家族，本期用 Spaces）
- （看过未收）https://ampcode.com/news/close-the-loop （站点标注反馈回 agent，产品 UI，可照做性偏 Amp）
- （看过未收）https://claude.dev/blog/seeing-like-an-agent/ （工具设计演进；与 progressive disclosure 重叠，概念位留给 Background agents）
- （看过未收）https://claude.dev/blog/getting-started-with-claude-code-mods/ （mods 中间件 hooks；与 11-06 hooks 同主题延伸）
- （看过未收）https://background-agents.com/summit/sessions/rajesh-bhatia/ （Rajesh 2026-05 访谈摘要；课件未出，作 W8 预习指针）
- （看过未收）https://x.com/ClaudeDevs/status/2118063143167693011 （Haiku 写后台状态行，产品更新，11-05 已排除）
- （看过未收）https://x.com/mihail_eric/status/2118393053539139788 （Meetup 宣传）
- （看过未收）https://www.anthropic.com/engineering 、https://simonwillison.net/ 、https://hamel.dev 近 48h 无新的可照做 agent 工程长文
- （看过未收）CS146S W7 Isaac Evans 讲座内容仍待公开；W8 Background Agents 11/10、11/12
