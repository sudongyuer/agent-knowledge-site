# Agent 工程实践简报 · 2026-11-21

> 给冻鱼。窗口约 2026-11-18 → 2026-11-21（Asia/Kuala_Lumpur）。今天的主线是：**人来定「什么算对」和「怎么快速迭代」，剩下的交给 agent 跑循环**。Matt Pocock 一条被收藏近 5000 次的「清理代码注释」prompt，正好引出今天的概念「棘轮」；Anthropic 讲了让 Claude 连续两周压测自家服务的「混沌循环」；Ankit Gupta 几乎只靠给 agent 鼓劲，就让它自己把大模型跑上了 FPGA 芯片。另有两个补课：OpenAI 官方的 skill 体检工具 plugin-eval，以及 8 万多星的 harness 入门课 learn-claude-code。

## 今日概念：Ratchet（棘轮）：某类违规的数量只许减少、不许增加的规则

**是什么**：棘轮是一种只能往一个方向转的齿轮（自行车后轮、扎带都是这个原理）。在代码库里，「棘轮」指这样一种规矩：**某类问题的数量只许减少，不许增加**。做法很简单：先数一数现在有多少处违规（比如 120 处 `any` 类型、300 条注释），把这个数记在仓库里的一个文件里当「基线」；CI 每次检查，数量比基线多了就不让合并；有人修掉几处，基线就跟着调低。时间一长，问题只会越来越少。

**解决什么问题**：想立一条新规矩（比如「不准写注释」「不准用 any」），但老代码里已经有几百处违规。一次全改完，PR 太大、风险太高；不改又没法开启这条规则。棘轮让你**今天就开启规则、拦住新增的违规**，老的慢慢还。Notion 就是这么把 React 类组件迁到函数组件、清掉 TypeScript 里不安全的 `any` 和 `as` 的，还开源了 ESLint 插件 eslint-seatbelt。Notion 文章里还有两个细节值得抄：基线文件用 TSV（一行一个「文件 + 规则 + 允许数量」），多人并行修改时不容易冲突；**基线往上调要人批准**。

**和你已会的东西的关系**：
- 11-19 讲的 poteto `/correct`：把每次纠正 agent 的内容写成确定性的检查。棘轮回答的是下一个问题：检查写好了，老代码里一大堆违规怎么办。
- 11-06 讲的「确定性 hooks」：规则放在 lint/CI 里，比写在 CLAUDE.md 里求 agent 遵守靠谱得多。
- 11-18 讲的「奖励作弊」：agent 遇到 lint 报错时，最省事的办法就是去改基线文件。所以「基线只许降、往上调必须由人批准」这一条一定要守住。
- 今天第 1 条 Matt Pocock 的 prompt 里明确写了「Take a ratchet approach」。

**入门原文**：[How we evolve code: Notion's "ratcheting" system using custom ESLint rules](https://www.notion.com/blog/how-we-evolved-our-code-notions-ratcheting-system-using-custom-eslint-rules)（Ankit Sardesai、Jake Teton-Landis，Notion，2025-03-03）；开源实现 [eslint-seatbelt](https://github.com/justjake/eslint-seatbelt)（Jake Teton-Landis）

**上手 prompt**：
```
目标：给当前仓库的一条代码规则加上「棘轮」：今天就开启这条规则、拦住新增违规，老违规先记成基线，以后只许减少。

1. 先读仓库，弄清楚：用的是什么语言和 lint 工具（看 package.json、pyproject.toml、Makefile、CI 配置等实际存在的文件），lint、类型检查、测试的真实命令是什么。把命令原样列给我。
2. 和我确认要棘轮的规则。如果我没指定，就从下面挑一条在这个仓库里违规最多、又最值得改的，说明理由：显式 any / 类型断言、ts-ignore 或 eslint-disable 这类抑制注释、console.log、TODO 注释。
3. 实现棘轮：
   - 优先用这个 lint 工具现成的方案（JS/TS 可以评估 eslint-seatbelt 或 ESLint 自带的 suppressions 功能，先查清它在当前版本里是否可用）；没有现成方案，就写一个小脚本，按「文件 + 规则」统计违规数，和仓库里的基线文件（TSV，一行一个 文件<TAB>规则<TAB>数量）比较。
   - 规则：任何文件的数量超过基线，CI 失败；低于基线时，本地运行会自动把基线调低。
   - 基线文件往上调（数量变多，或新增条目）时 CI 必须失败，并提示「需要人工批准」。agent 不许自己调高基线来让检查通过。
4. 接进现有的 CI 或 pre-commit（只改必要的配置），不要改业务代码。
5. 验收，每条都给命令输出作证据：
   a. 在干净分支上运行检查，结果通过，同时打印基线总数；
   b. 临时在某个文件里新增一处违规，检查失败，报错信息指出文件和规则；撤掉这处改动；
   c. 临时修掉一处老违规，运行后基线自动减 1；
   d. 手动把基线某行数字改大，检查失败并提示需要人工批准；撤掉这处改动。
最后给我：改了哪些文件、基线总数、以后怎么用（一段话）。

参考：Notion《How we evolve code: Notion's "ratcheting" system using custom ESLint rules》https://www.notion.com/blog/how-we-evolved-our-code-notions-ratcheting-system-using-custom-eslint-rules ；eslint-seatbelt https://github.com/justjake/eslint-seatbelt
```

---

## 本期条目

### 1. Matt Pocock 的「每日 prompt」：把代码注释分成四类（废话 / 借口 / 过期 / 决策记录），分别删掉、开 issue 或挪进 ADR，最后用 lint 规则加棘轮防止它们长回来；poteto 跟帖推荐 pstack 的 /no-comments

- **要点**：Matt Pocock 11-20 发的这条 prompt，我抓取时有 4986 次收藏、2852 个赞。核心是给注释分四类，每类有固定的处理办法：
  - **Tautology（废话）**：只是把代码一眼能看出来的事再说一遍，删掉。
  - **Excuse（借口）**：很多注释是 agent 给烂实现找的理由（比如「这里先这样处理」），然后这个烂实现会被抄到别处。删掉注释，同时**开 issue 去修那个烂实现**。
  - **Stale（过期）**：说的是已经不存在的代码或实现，删掉。
  - **Decision Record（决策记录）**：记录了重要又不直观的决定，挪进 ADR（11-13 讲过的「架构决策记录」）。
  - 收尾三步：加一条禁止注释的 lint 规则，并且「Take a ratchet approach」（就是今天的概念）；在仓库里建一个 `/delete-comment` skill，以后可以重复跑；估算一下删完能少多少行代码。
- poteto 转发时说「试试 pstack 的 /no-comments，或者干脆让 agent 把它变成 lint 规则」（1105 次收藏）。/no-comments 的做法是开一个叫 Comment Sicko 的子 agent 用新鲜视角审查注释，主 agent 再逐条核对它的结论；写着「do not remove」「改之前先找某某」这类**约束型注释**的，优先改成类型、运行时检查、测试或 CI lint，并且要等人批准后再删。
- 对你有什么用：让 agent 写的代码往往注释特别多，而「借口」类注释最隐蔽。这个分类直接能拿来做一次代码库体检。
- 下面的 prompt 只出报告和草稿，不直接删，以免一次 PR 太大。

```
目标：按「四类注释」体检当前仓库（或我指定的目录）的代码注释，先出报告和改动草稿，不直接提交。

1. 先读仓库，确认语言、lint 工具和测试命令（从 package.json / Makefile / CI 配置等实际文件里读，不要猜），并告诉我扫描范围（默认：业务源码目录，排除 vendor、生成代码、node_modules、测试快照）。
2. 列出范围内每一条注释（文件:行号 + 原文），逐条归类，并写一句理由：
   - Tautology：只是复述代码 → 删除
   - Excuse：给一个临时/取巧实现找理由 → 删除，并起草一个 issue（标题 + 问题描述 + 涉及文件）去修那个实现
   - Stale：说的东西和当前代码对不上 → 删除（写出对不上的证据）
   - Decision Record：记录了重要、不直观的决定 → 起草一份 ADR（背景 / 决定 / 后果），存到仓库已有的 ADR 目录；没有就建议放在 docs/adr/ 下
   另外单独标出「约束型注释」（例如 do not remove、不要改这里、改之前先问某人）：给出能把这条约束变成类型、运行时检查、测试或 lint 的最小方案，等我批准，不要直接删。
   许可证头、生成代码标记、lint/类型抑制注释不要动，单独列出来。
3. 输出：
   a. 一张汇总表：四类各多少条、预计删掉多少行；
   b. 每条注释的分类明细；
   c. Excuse 类对应的 issue 草稿、Decision Record 类对应的 ADR 草稿；
   d. 一个「禁止新增注释」的 lint 规则方案，并采用棘轮：记下现有数量当基线，只许减少，往上调必须由人批准；
   e. 一个可复用的 /delete-comment skill 草稿（SKILL.md：什么时候用、步骤、验收标准）。
4. 先只在一个目录里真正执行删除和挪动作为试点，执行后运行 lint、类型检查和测试，贴出命令输出证明没有改坏东西；其余目录只给方案。
5. 验收：每个分类判断都有原文依据；试点目录检查全部通过；没有动约束型注释和许可证头。

参考：Matt Pocock 的 prompt https://x.com/mattpocockuk/status/2123798388227403983 ；poteto 的 /no-comments skill https://github.com/cursor/plugins/blob/main/pstack/skills/no-comments/SKILL.md
```

来源：[Matt Pocock 的 X 帖「Prompt of the day」](https://x.com/mattpocockuk/status/2123798388227403983)（Matt Pocock，2026-11-20）；[poteto 的转帖](https://x.com/poteto/status/2123898792487576021)（poteto，2026-11-20）；[pstack /no-comments SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/skills/no-comments/SKILL.md)（poteto）

---

### 2. Anthropic「混沌循环」：上线前让 Claude Code 在预发环境里连续跑两周，故意把服务往死里压、看监控、修问题；结果上线一周 20 亿次请求里只有 60 次服务端错误，从没回滚

- **要点**：Anthropic 工程师 Vivek Nair 11-17 在 claude.dev 写了 Claude Docs 后端是怎么扛住上线的。循环本身很简单：一个一直开着的 Claude Code 会话当协调者，**挑场景 → 跑压测 → 读监控 → 提修复方案 → 部署到预发环境 → 再来**，具体活交给子 agent（最忙那周一般同时 11 个，最多 30 个）。几个关键设计：
  - **故意挑「被害妄想」级别的场景**：一天新建 1000 万篇文档、2.2 万个连接同时重连、杀掉正在加载文档的服务器、数据库卡住。
  - **两条不变量**（不管怎么改都必须成立）：文档必须几乎瞬间打开；服务器确认收到的编辑必须真的保存下来。
  - **审批门**：开跑前就说清楚，哪些决定必须问人，主要是难以撤销的，比如改数据库 schema、改 key 的布局。容易撤销的改动 Claude 自己改、自己部署。
  - **让系统对 Claude「看得清」**：每条数据库查询都上报名字和扫描行数/返回行数；Claude 发现缺监控就自己补。他们甚至为了信号干净选了没有垃圾回收的 Rust，依赖尽量少，必须用的依赖直接 vendor 进来。
- 实际效果：有一篇大文档占了约 3 GB 内存，Claude 一路用更细的内存分析定位到「每敲一个键就把文档复制进好几个数据结构」，改成写时复制后降到约 180 MB，上线所需的内存优化型 pod 从 500 多个降到约 50 个。预演过的 10 个场景里有 7 个在生产环境真的发生了。
- 成本也写得很坦白：大约花了 12.5 万美元推理费；作者估计小团队做同样的两周冲刺大概 3000 到 1 万美元，但他说这个数他自己没实际跑过。
- 他给小团队的五步：让 Claude 能读到监控（多数监控服务都有 MCP）；写一个 10 倍真实流量、还会故意搞破坏的压测脚本；技术选型偏向 Claude 好测量的；先把最重要的技术不变量写下来交给 Claude；难以撤销的事让 Claude 停下来给几个选项和推荐。
- 对你：移动端也有对应的东西，比如弱网、App 被系统杀掉后恢复、超长列表、大量离线数据同步。下面的 prompt 只要求在本地或预发环境做，先出计划再动手。

```
目标：给当前项目搭一个小型「混沌循环」：在本地或预发环境里反复「施压 → 看指标 → 修 → 再压」，找出上线前会出问题的地方。绝对不要碰生产环境。

1. 先读仓库，弄清楚：这是什么类型的项目（后端服务 / Web / 移动端 / 库），有没有本地或预发环境，怎么启动，现在有哪些日志、监控、性能指标可以读（列出真实命令或 MCP，没有就写「没有」）。
2. 写一份 CHAOS_PLAN.md，等我确认后再动手：
   a. 2–3 条「不变量」：无论怎么改都必须成立的事，每条都要能用命令或测试自动检查（例如：保存成功的数据重启后还在；首屏在 N 秒内出来；离线期间的操作恢复网络后不丢）；
   b. 至少 5 个「被害妄想」场景，结合项目类型来挑：10 倍流量、大量连接同时重连、依赖服务卡住或超时、进程被杀、超大数据、弱网或断网、App 在后台被系统杀掉后恢复；每个场景写清怎么制造、看什么指标、什么算挂了；
   c. 审批门：哪些改动你可以自己做（容易撤销的：加日志/指标、改配置、局部修复），哪些必须停下来问我（难撤销的：数据结构或 schema、存储格式、公共 API、依赖升级），问我时给 2–3 个选项和推荐；
   d. 如果缺指标，先列出要补哪些（例如每个查询的耗时和扫描量、内存占用、渲染耗时）。
3. 我确认后，每次只跑一个场景：施压 → 读指标 → 写下观察 → 提出修复 → 能自己改的就改 → 重跑同一场景对比前后数据 → 跑全部不变量检查和现有测试。
4. 每轮在 CHAOS_LOG.md 里追加：场景、施压命令、修复前后的关键数字（必须来自实际运行输出）、改了什么、不变量是否全过。数字拿不到就写「未测得」，不要估。
5. 验收：至少跑完 3 个场景；每个修复都有前后对比数据；不变量检查和测试全部通过（贴命令输出）；所有需要审批的改动都停下来问过我。

参考：Vivek Nair《Using a "chaos loop" to harden the Claude Docs launch》https://claude.dev/blog/chaos-loop-claude-docs-launch/
```

来源：[Using a "chaos loop" to harden the Claude Docs launch: 60 server errors across billions of requests](https://claude.dev/blog/chaos-loop-claude-docs-launch/)（Vivek Nair，Anthropic，2026-11-17）

---

### 3. 不会写 Verilog 也让 agent 把大模型跑上了 FPGA：作者事后让 agent 翻日志复盘，发现人给的设计建议它大多自己也能想到，真正起作用的是「怎么快速迭代」和「什么算对」这两类指导

- **要点**：Ankit Gupta 11-20 写了这次实验（HN 110 分）：一个云端 agent 连续跑了好几天，先把模型完整跑通且输出与参考实现逐位一致（bit-exact），再把速度提高到 33 倍，总共花了大约 1 万美元 token。他自己几乎没给什么高明的 prompt，多半是「再快 2 倍，你可以的」。
- 最值得看的是**复盘**：中途有懂行的创业者给了他一大段 FPGA 设计经验，他贴了进去。后来他让 agent 读完全部日志，回答「这些建议你到底用了哪些」，agent 的回答是：
  - 设计点子大多在它的计划里早就有了，五个「数值上偷工减料」的建议全被拒绝，因为会改变输出的每一位，违反了「bit-exact」这条规矩；
  - **流程建议立刻见效**：人说「别做那种要跑几个小时的事」，它就停掉一个已经跑了约 24 小时的仿真，改成「C 测试 → 综合 → 逻辑深度检查」的短循环，更快拿到硬件结果。代价是有两个只有完整仿真才能发现的卡死问题漏到了板子上，后来集成时为此损失了 38 小时。
- 作者的结论：**人仍然擅长定义「怎么快速迭代」和「什么算对」，探索交给 agent**。那段经验里的「验证阶梯」也很好抄：单块单元测试 → 一层对着真实权重做联合仿真 → 完整多 token 解码逐个 token 对比参考实现；仿真结果、时序签核和板上实测**分开记录，绝不拿其中一个冒充另一个**；**每个公布的数字都链接到出处报告**。
- 和 11-17 讲的「差分测试」（拿可信的参考实现当标准答案）是一回事，这次是在硬件这种你完全不熟的领域里用上了。

```
目标：在让 agent 长时间自主优化某个东西之前（性能、包体积、启动时间、内存都行），先把「什么算对」和「怎么快速迭代」写成文件，跑通一轮再放手。

1. 先读仓库，和我确认这次要优化的指标和目标值。找出现有的「标准答案」来源：参考实现、旧版本、现有测试、固定输入的预期输出（快照）。没有的话，先提出怎么造一个（例如录下当前版本对一组固定输入的输出）。
2. 写 LOOP_CONTRACT.md，内容包括：
   a. 正确性合同：哪些输出必须与标准答案完全一致、哪些允许误差（写清误差上限）；明确禁止为了提速去改变这些输出；
   b. 验证阶梯：从最快到最慢列 3–4 级检查（例如：单元测试 → 模块集成测试 → 完整端到端对比标准答案），写清每级的真实命令和大概耗时；规定每次小改动只跑前两级，合并或里程碑时才跑全部；
   c. 时间预算：单次检查超过 N 分钟就停下来换更快的办法，并记录下来；
   d. 证据规则：本地测试、模拟器/仿真结果、真机或线上实测分开记录，不能拿一种结果冒充另一种；报告里的每个数字都要附上产生它的命令和日志文件路径。
3. 按合同跑一轮：先记录基线数字，再做一个小优化，按阶梯验证，把前后数字和日志路径写进 LOOP_LOG.md。
4. 最后做一次复盘：读 LOOP_LOG.md，列出哪些规则真的拦住了问题、哪些规则拖慢了速度却没带来价值，建议怎么改合同。
5. 验收：LOOP_CONTRACT.md 里每级检查的命令都实际跑通过（贴输出）；优化前后数字都有日志出处；标准答案对比全部通过。

参考：Ankit Gupta《Vibecoding an inference chip》https://ankitg.me/blog/vibecoding-inference-chip/
```

来源：[Vibecoding an inference chip](https://ankitg.me/blog/vibecoding-inference-chip/)（Ankit Gupta，2026-11-20）；[HN 讨论](https://news.ycombinator.com/item?id=50579297)

---

### 4. 补课：OpenAI 官方插件市场里的 plugin-eval，给 skill 做「体检」：把 token 成本拆成三档（平时就占的 / 调用时加载的 / 用到才读的），还能跑真实基准、对比改前改后

- **要点**：openai/plugins（Codex 的官方插件市场，今天共 65 个插件）里有个 `plugin-eval`，至少从 2026 年 6 月起就在仓库里，历史简报没介绍过。它既是 Codex 插件，也是一个本地 Node.js 命令行工具（需要 Node 20+），用来评估一个 skill 或插件：打多少分、为什么、先修什么。
- 最值得学的是它的**三档 token 预算**，正好说明一个 skill 为什么要写短：
  - `trigger_cost_tokens`：还没调用就可能占着上下文的部分，比如名字、description、起手示例。装的 skill 越多，这部分越贵；
  - `invoke_cost_tokens`：调用时加载的主体指令（SKILL.md 正文）；
  - `deferred_cost_tokens`：references、脚本这些用到才读的部分。
  - 这就是「渐进披露」：贵的内容尽量往后两档挪。
- 常用命令：`analyze`（静态报告，结果固定、可重复）、`explain-budget`（解释 token 预算）、`init-benchmark` + `benchmark`（在隔离的临时目录里真跑 `codex exec`，生成可编辑的场景文件）、`compare before.json after.json`（对比改前改后）。设计文档里写明：静态 token 数是本地估算，拿到真实用量后可以用 `--observed-usage` 喂回去校准。
- 它是为 Codex skill 设计的，但三档预算和「改前改后对比」的思路对 Claude Code 的 skill 一样适用。同一天 poteto 也说 pstack v0.15.46 做了大量删减，skill 都短了很多。

```
目标：给我自己写的一个 skill 做一次「体检 + 精简」，用数据证明精简后没有变差。

1. 先找到我要体检的 skill（问我名字或路径；常见位置：.claude/skills/、~/.claude/skills/、.agents/skills/、~/.codex/skills/），读完它的全部文件。
2. 按三档估算 token（用 tiktoken 或同类分词器；装不了就按字符数 ÷ 4 粗估，并注明是粗估）：
   - 平时就占：name + description（以及任何会常驻上下文的部分）
   - 调用时加载：SKILL.md 正文
   - 用到才读：references/、scripts/、其他附属文件
   输出一张表，并指出哪些内容放错了档（例如正文里大段示例、背景介绍，应该挪到 references/）。
3. 检查 description：能不能让 agent 在该用的时候想起它、不该用的时候不误用。写出 5 个「应该触发」和 5 个「不应该触发」的用户请求。
4. 在改动之前先建基线：根据这个 skill 的用途写 3–5 个真实任务场景，每个写清验收标准；用当前版本各跑一次（能用无头模式就用，例如 claude -p 或 codex exec，先确认本机实际可用的命令），记录是否达标、用了多少 token 或时间、哪些步骤被跳过。
5. 精简：删掉重复和不说也会做对的内容，把细节挪到「用到才读」那一档，保持 SKILL.md 只做指路。
6. 用同样的场景再跑一次，给出改前改后对比表（三档 token、每个场景是否达标）。只有达标数没下降才保留改动，否则还原并说明原因。
7. 验收：所有数字都来自实际计算或运行（附命令）；改前改后的 SKILL.md diff 给我；没有改这个 skill 以外的文件。

参考：OpenAI plugin-eval README https://github.com/openai/plugins/tree/main/plugins/plugin-eval ；技术设计 https://github.com/openai/plugins/blob/main/plugins/plugin-eval/references/technical-design.md
```

来源：[plugin-eval](https://github.com/openai/plugins/tree/main/plugins/plugin-eval)（OpenAI，openai/plugins 官方插件市场）；[Plugin Eval Technical Design](https://github.com/openai/plugins/blob/main/plugins/plugin-eval/references/technical-design.md)（OpenAI）

---

### 5. 补课：learn-claude-code（8 万多星）：17 节递进课，从「一个循环 + bash」开始，每节只加一种 harness 机制，最后做到「由目标决定什么时候停」；适合想弄懂 Claude Code 内部在干什么的初学者

- **要点**：shareAI-lab 的这个仓库（今天 GitHub 搜索结果显示约 8.07 万星），11-19 的简报里列过「待评估」，今天正式介绍。它的观点是：「会干活的能力」来自模型训练，我们工程师要做的是 **harness**（工具、知识、观察、动作接口、权限），这和 11-10 讲的「agent 外壳」是同一回事。
- 新版主线是根目录下的 `s01`–`s17`，每节有中英日文 README 和可运行的 `code.py`，每节配一句话概括：
  - s01 一个循环 + bash 就是一个 agent；s03 先划边界再给自由（权限）；s04 在工具前后留插口（hooks）；
  - s06 子 agent 用全新的 `messages[]`，只把最终文本当作一条工具结果交回去（这就是子 agent 能省上下文的原因）；
  - s07 skill 先列目录、用到时再展开；s08 上下文压缩；s09 记忆；s10 持久化的任务图；s13 队友协作 + 任务绑定的工作目录（worktree）；s14 MCP；
  - s17 目标循环：每次准备停下时由独立的判断器审查，目标不可能、执行失败或超过续跑上限才把控制权交还给用户。
- 对你：你已经学过 subagent、hooks、skills、memory 这些词，这门课让你用一两百行 Python 亲手把它们跑一遍，读完再看 Claude Code 的行为会清楚很多。需要你自己的 `ANTHROPIC_API_KEY`。

```
目标：用 shareAI-lab/learn-claude-code 当教材，带我（agent 工程初学者）弄懂 subagent 为什么能省上下文。全程用简体中文、大白话。

1. 把 https://github.com/shareAI-lab/learn-claude-code 克隆到一个临时目录（不要放进我的项目仓库）。先按我们平时审陌生仓库的方式只读检查：列出 .claude/、hooks、.mcp.json、package.json scripts、requirements.txt 里有没有会自动执行的东西，有可疑项就停下来告诉我。
2. 读 README-zh.md，以及 s01_agent_loop/ 和 s06（子 agent 那一节）的 README 与 code.py。用不超过 15 行的大白话讲清楚：主循环每一轮在做什么；子 agent 的 messages[] 和主 agent 的有什么不同；为什么只把最终文本交回去。
3. 动手实验（需要我在 .env 里填 API key，填之前先问我；不要读取或打印 key 本身）：
   - 用同一个任务（例如「统计这个仓库每个目录下的 .py 文件行数并总结」）分别跑 s01 和 s06 的 code.py；
   - 在两个脚本里各加一行，打印每轮发给模型的 messages 条数和总字符数（只加打印，不改逻辑）；
   - 给我一张对比表：轮数、主 agent 上下文最终有多大、结果是否正确。
4. 最后出 3 道小题考我（一次一道，等我回答再给下一道），检查我是否真的懂了。
5. 验收：每个结论都能对应到代码的具体行号；对比表的数字来自实际运行输出；实验结束后列出你改过的文件，并把它们还原。

参考：learn-claude-code https://github.com/shareAI-lab/learn-claude-code
```

来源：[shareAI-lab/learn-claude-code](https://github.com/shareAI-lab/learn-claude-code)（shareAI-lab）

---

## 扫描记录

- **GitHub**（未登录 API，按 stars 排序）：搜了 claude code / skills / codex / subagent·AGENTS.md / claude plugin / mcp（近 1 个月新建），以及 claude-code / agent skills / codex（5000 星以上、近一周有提交）、context engineering、evals。新出现的高星仓库大多是视频、动画、贴图类 skill，和工程实践无关，没收。高星但没介绍过的列进 watchlist「待评估」：affaan-m/ECC、rtk-ai/rtk、headroomlabs-ai/headroom、harbor-framework/harbor、erkamyaman/rust-anything、jmanico/grim-prompter、Leonxlnx/cook、kyy-logs/code-review-gate-skill。扫描后半段又碰到了 API 限流。
- **官方插件市场**：claude-plugins-official 今天仍是 317 个，和 11-20 的快照比**没有新增也没有删除**（最新提交是 11-21 09:17 的主题示例改动，Asia/Kuala_Lumpur）；快照已存成 plugins-snapshot-2026-11-21.txt。openai/plugins 共 65 个，收录了 plugin-eval（第 4 条），codex-security、test-android-apps 待评估。
- **X**：扫了一线实践者近三天的帖子，还用中英文关键词各搜了一轮。收了 Matt Pocock 和 poteto（第 1 条）。看过没收：poteto 的 pstack v0.15.46（skill 大幅删减，已在第 4 条顺带提到）；Hamel Husain「做 eval 时好流程远比工具重要」（只有一张图，内容不够）；Thariq 的 AIE Code 演讲预告（要看视频，下期再看）；中文关键词结果的互动都很低，营销号居多。Matt Pocock 原帖的回复里没有高互动的补充。注意：Matt Pocock 的 X 账号 @mattpocockuk 目前可以正常访问，关注名单里写的「suspended」已经过时。
- **HN**（近 4 天）：收了「Vibecoding an inference chip」（第 3 条）。看过没收：「If you stop writing code, you also get worse at reviewing it」（cekrem，323 分，讲不亲手写代码审查能力也会退化，观点文、没有可照做的方法；可以配合 11-20 介绍的 socratic-tutor 刻意练习）、Frostbite（AI 设计并验证 CPU，偏研究新闻）、Tokendoctor（34 分，热度低）。「How the Claude Code team thinks about verification」和 FrontierHarness 之前已经收过。
- **博客**：claude.dev 收了 chaos loop（第 2 条）。Simon Willison 近三天没有 agent 工程实践方面的长文；他转引的 Daniel Stenberg 那段话（agent 把 curl 改写成 Rust 的那三周里，curl 本身又修了 200 多个 bug，改写版都没有）可以和 rust-anything 这类「整个改写」项目对照着看，没收。Hamel 的《"It's Hard to Eval" Is a Product Smell》（2026-06-29）和《Claude's new auto eval tool》（2026-09-30）以前没介绍过，下期补课候选。ghuntley.com、Prime Radiant 博客首页没抓到文章列表。

## 本期去重用源链接（机器可读）

- https://www.notion.com/blog/how-we-evolved-our-code-notions-ratcheting-system-using-custom-eslint-rules
- https://github.com/justjake/eslint-seatbelt
- https://x.com/mattpocockuk/status/2123798388227403983
- https://x.com/poteto/status/2123898792487576021
- https://github.com/cursor/plugins/blob/main/pstack/skills/no-comments/SKILL.md
- https://claude.dev/blog/chaos-loop-claude-docs-launch/
- https://ankitg.me/blog/vibecoding-inference-chip/
- https://news.ycombinator.com/item?id=50579297
- https://github.com/openai/plugins/tree/main/plugins/plugin-eval
- https://github.com/openai/plugins/blob/main/plugins/plugin-eval/references/technical-design.md
- https://github.com/shareAI-lab/learn-claude-code
- （看过未收）https://x.com/poteto/status/2123824683862855898 （pstack v0.15.46：skill 大幅删减，新增 Gemini 4 Neon 审查员）
- （看过未收）https://x.com/HamelHusain/status/2123825850332422230 （好流程比工具重要，只有图）
- （看过未收）https://cekrem.github.io/posts/if-you-stop-writing-code-you-also-get-worse-at-reviewing-it/ （HN 323）
- （看过未收）https://architectlabs.com/blog/frostbite （HN 621，AI 设计 CPU）
- （看过未收）https://simonwillison.net/2026/Nov/18/daniel-stenberg/
- （补课候选）https://hamel.dev/blog/posts/eval-smell/ 、https://hamel.dev/blog/posts/claude-auto-evals/
