# Agent 工程实践简报 · 2026-11-24

> 给冻鱼。窗口约 2026-11-23 → 2026-11-24（Asia/Kuala_Lumpur）。今天的主线是**「先旁观，再放手」**。今日概念是「影子模式」：新东西先跟着真实流量一起跑，结果只记下来、不生效，拿它和现有做法对比，攒够信心再让它真的做决定。今天有六条。第 1 条是 Anthropic 今天发的 Claude Ship：Claude 能审 PR、修 PR，还能按团队写的策略文件自动批准一部分 PR。Boris Cherny 建议先在「只观察模式」下跑，这就是影子模式。第 2 条是 poteto 在 pstack 里新加的 /reframe，作用是教你「这件事行家怎么叫」，可以和 /sharpen 配着用，对初学者特别有用。第 3 条是 Stanford CS146S 第 6 周作业：在不降低正确率的前提下，把 coding agent 的花费压下来。第 4 条是一篇新论文：说明书过期时，任务照样能完成，但每次都要多绕路，而且没有一个 agent 回头去修说明书。第 5 条是 Shreya Shankar 实验室的实验：挑「最符合条件的前 k 条」时，逐条打分反而比两两比较更准、更快。第 6 条补课 1.2 万星的并行 worktree 工具 Worktrunk。

## 今日概念：Shadow mode（影子模式）：新系统先跟着真实情况一起跑，只记录、不生效，对比够了再放权

**是什么**：你想把一件事交给新系统（新模型、新规则、新 agent），但又不放心。影子模式就是：**老做法照常负责真实结果，新系统同时拿到一模一样的输入，自己算一遍，把它「本来会怎么做」记下来，但不让它产生任何效果**。跑一段时间后，你手里就有一堆「老做法 vs 新系统」的成对记录，可以看两者有多少分歧、新系统在哪类情况下会犯错。指标达标了，再让它真正做决定。

几个常见的近亲：
- **Dark launch（暗发布）**：Martin Fowler 的说法，新功能在生产里真的被调用，但用户看不到结果，主要用来看性能和负载。
- **Canary（金丝雀发布）**：新版本真的对一小部分用户生效。影子模式比它更保守，**对谁都不生效**。
- **A/B 测试**：把流量分成两半，各走一边。影子模式是**同一批输入两边都跑**，所以可以逐条对比。

**解决什么问题**：
- 给 agent「写权限」或「批准权」之前，先看它在真实情况下**本来会做什么**，而不是看演示。今天第 1 条 Claude Ship 官方原话是：大多数团队应该先在 observe-only（只观察）模式下开 Claude Approvals，建立信心之后，再把它设成分支保护的必过项。
- 它能拿到**真实分布**的数据。测试集是你想得到的情况，影子期间碰到的是你想不到的情况。
- 出问题的代价是零：影子的结果本来就不生效，不用回滚。

**要注意的坑**（Alex Gude 和几篇 MLOps 文章都提到）：
- 影子和老做法**不一致**，不代表影子错了，两者也可能都错。最后要拿真实结果（比如这个 PR 后来有没有被 revert）来判对错。
- 影子模式不是免费的：它要多跑一遍。Claude Ship 的文档就写明，策略里用到 Claude 审查时，**哪怕在观察模式下也照常计费**。
- 影子不能有副作用。如果「只是看看」的 agent 会顺手发评论、改文件、调接口，它就不是影子了。

**和你已会的东西的关系**：
- 11-06「确定性 hooks」、11-21「棘轮」：新加一条拦截规则时，可以先只记录「它本来会拦下什么」，看误拦多不多，再改成真的拦。
- 11-17「差分测试」：差分测试是拿旧版本当标准答案，离线对比；影子模式是同样的思路，只是用在真实流量上。
- 11-22「成对比较」、11-23「错误分析」：影子跑出来的分歧记录，正好是做错误分析的好材料。先读这些分歧、归类计数，再决定能不能放权。

**入门原文**：[Machine Learning Deployment: Shadow Mode](https://alexgude.com/blog/machine-learning-deployment-shadow-mode/)（Alexander Gude，2020-06-30）。讲得很直白，例子是机器学习模型，但道理可以照搬到 agent 上。延伸：[Dark Launching](https://martinfowler.com/bliki/DarkLaunching.html)（Martin Fowler，2020-04-29），很短。

**上手 prompt**：
```
目标：给我打算交给 agent 或自动规则来做的一个决定（例如「这个 PR 能不能自动批准」「这条 lint/hook 规则要不要拦」「这条 issue 归哪类」），先跑一次「影子模式」回测：让新做法在历史真实数据上给出它本来会做的决定，只记录、不生效，再和当时真实发生的结果对比，告诉我它现在能不能放权。全程用简体中文、大白话。

1. 先问我要做影子测试的是哪个决定、新做法是什么（一个 prompt、一个脚本，或一条规则），以及「真实结果」从哪里来（例如 git 历史、PR 记录、CI 日志）。读完仓库里相关的文件后，用 3 行复述你的理解，等我确认。
2. 找历史数据（只读）：从 git log 或我同意的数据源里取最近 30–50 个真实样本，记下每个样本当时的实际决定和后来的结果（例如有没有被 revert、有没有出 bug 修复提交）。需要用 gh 之类的命令行工具时，先确认本机装了、也登录了；没有就告诉我，换成只用 git 的方案。
3. 影子运行：让新做法对每个样本独立给出决定和一句理由，结果写进仓库外的临时目录（JSONL 格式）。不准发评论、不准改任何文件、不准调用会产生副作用的接口。
4. 对比：做一张表，包括「两边一致」「新做法更宽松」「新做法更严格」三类各有几条，每类列出样本编号。重点把「新做法放行了，但后来出了问题」的样本逐条拿出来，附上证据（提交号或 PR 号）。
5. 结论：按「放权前必须修的」「可以接受的」「数据不够、判断不了的」三类写清楚，并建议下一步是继续只观察、缩小范围后放权，还是可以放权。没有证据的地方写「猜测」。
6. 验收：表里每个数字都能对应到临时目录里的记录；交出临时目录路径和复现命令；整个过程不修改我的仓库，也不对外发出任何东西。

参考：https://alexgude.com/blog/machine-learning-deployment-shadow-mode/ ；https://claude.com/resources/articles/introducing-claude-ship
```

---

## 本期条目

### 1. Claude Ship：Claude 审 PR、修 PR，再按团队写在仓库里的策略文件决定能不能批准。官方和 Boris Cherny 都建议先在「只观察」模式下跑，等信任了再放权

- **要点**：Anthropic 11-23 发布 Claude Ship（beta，面向 Claude Team 和 Enterprise，只支持 GitHub 仓库）。Boris Cherny 11-24 04:21（Asia/Kuala_Lumpur）发帖介绍，抓取时有 4694 赞、1567 次收藏。它由三部分组成：
  1. **Code Review**（已正式上线）：从多个角度审 PR，先收集问题，再**对抗式地逐条核实**，然后分类贴到 PR 上。审查级别分 Quick、Standard、Deep 三档。官方数据：在 Claude Code 团队，6 月到 9 月合并的 PR 数量翻了一倍多，被 revert 的比例下降了 40% 以上（Claude 的审查只是他们流程里的一层）。
  2. **PR Steward**（beta）：负责让 PR 保持绿灯，CI 挂了、有合并冲突、有审查意见，它都会去修。**它被设计成不批准、也不合并 PR**。每推一次代码，它都会留言说明改了什么、怎么撤回。在 PR 里评论 `@claude <指令>` 可以指挥它，`@claude stop` 让它停手。
  3. **Claude Approvals**（beta）：按团队写在仓库里的**策略文件**决定批不批，官方说它「像一个更聪明的 CODEOWNERS」。常规改动可以自动批，特定情况要求人来签字。官方建议：**先开 observe-only（只观察）模式建立信心**，再把它设成分支保护的必过项。
- **个人怎么用**：任何人都可以在 Claude Code 里用新的 `/ship` 命令。它会推送代码、开 PR、审查，并继续处理审查意见和失败的检查。最后能不能合并，取决于你的权限和仓库的分支规则。`/ship` 按普通 Claude Code 用量计费，今天开始逐步放出，更新后不一定马上能看到。
- **成本提醒**：仓库级的 Claude Ship 按 token 计费。策略里用到 Claude 审查时，**即使在观察模式下也会触发计费的 Code Review**。开启 Zero Data Retention、HIPAA 配置或客户自管密钥的组织不能用。
- **评论区值得记的**：有人建议策略一开始收得很窄，只放行依赖升级、只改测试、只改文档这几类，之后按 **revert 率**（不是感觉）慢慢放宽，并要求每次批准都写明理由。另一条建议是：在观察模式里检查每次批准评估的是哪个提交、哪个版本的策略，还可以故意在一个低风险 PR 通过之后，再推一个改权限的提交，看它会不会被重新审。
- 你不需要 Team 或 Enterprise 也能学这个思路：下面的 prompt 让 agent 帮你起草一份「自动批准策略」，然后在你仓库的历史 PR 上做影子回测（今日概念）。

```
目标：为这个仓库起草一份「哪些 PR 可以自动批准、哪些必须有人看」的策略文件，并在历史 PR 上用「只观察」的方式回测：策略本来会批哪些、拦哪些，和后来的真实结果对不对得上。只读分析，不改仓库的任何设置，也不在任何 PR 上留言。

1. 先读仓库：README、AGENTS.md/CLAUDE.md、CODEOWNERS（如果有）、CI 配置、分支保护相关的说明文档。弄清哪些目录是高风险的（权限、支付、鉴权、数据库迁移、构建和发布配置、依赖锁文件以外的依赖变更等），每一类都要在仓库里找到依据，不要凭空列。
2. 起草策略（Markdown，放在仓库外的临时目录）：分「可以自动批」「必须一人审」「必须指定的人审」三档。每一档写清判断条件，条件尽量写成可以机械检查的（改了哪些路径、改动行数、是否只改测试或文档、CI 是否全绿）。需要人判断的条件单独标出来。第一版要保守，自动批的范围只放最窄的几类。
3. 取历史数据（只读）：如果装了 gh CLI 并已登录，取最近 40 个已合并的 PR（标题、改动文件、行数、CI 结果）。没有 gh 就用 git log 里的合并提交代替，并注明。再找出后来被 revert 的，或者紧接着有 fix/hotfix 提交修它的 PR，标成「后来出了问题」。
4. 影子回测：按策略给每个 PR 判一档，附一句理由，结果写成 JSONL。统计：自动批了几个；其中「后来出了问题」的有几个，逐个列出 PR 号和证据；被拦下的 PR 里有多少其实是很简单的改动（说明策略可能太严）。
5. 根据回测改一版策略，再回测一次，给出前后两版的对比表。自动批的范围扩大，只能有回测数据支持，不能凭感觉。
6. 交付：最终的策略文件、两次回测的 JSONL 和对比表、临时目录路径、复现命令；再列一份「这份策略管不到的风险」清单（例如同一个 PR 在批准之后又推了新提交）。不修改仓库，不发评论，不改任何 GitHub 设置。

参考：Claude Ship 官方介绍 https://claude.com/resources/articles/introducing-claude-ship ；Boris Cherny https://x.com/bcherny/status/2124961488691740941
```

来源：[Introducing Claude Ship](https://claude.com/resources/articles/introducing-claude-ship)（Anthropic，2026-11-23）；[Boris Cherny 发布帖](https://x.com/bcherny/status/2124961485801836573)、[「先在一个仓库上用观察模式跑」](https://x.com/bcherny/status/2124961488691740941)（Boris Cherny，2026-11-24 04:21 Asia/Kuala_Lumpur）

---

### 2. pstack 新 skill /reframe：先教你「这件事行家怎么叫」，再用这些词重写你的需求描述。poteto 说「你只能 prompt 你想象得到的东西」

- **要点**：poteto 11-24 08:50（Asia/Kuala_Lumpur）发帖介绍 pstack 新加的 `/reframe`，抓取时有 684 赞、463 次收藏。用途是：你知道自己想要什么，但说不清楚。它可以和 `/sharpen` 配着用。两个 skill 都是 `disable-model-invocation: true`，也就是只有你手动输入命令时才会触发，agent 不会自己调用。
- **/reframe 做什么**（[SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/skills/reframe/SKILL.md)，11-24 06:32 加入，08:41 又补了一条规则）：
  1. 先读你的文件、代码和描述本身，不读摘要。如果你的描述可能指好几种问题，先列出 2–3 种可能，每种给出对应的术语和区分它们的迹象，然后挑最可能的那种讲，并说明为什么挑它。
  2. 给 8–12 个术语，**按「对最终做出来的东西影响多大」排序**。每个术语都要给：一句大白话的意思、它对应你描述里的哪一部分、一个用到这个词的真实项目、论文或系统（带链接），以及学会它以后你可以怎么指挥 agent。
  3. 找 2–3 个解决过同类问题、但叫法不同的相邻领域，说明哪些做法能搬过来、哪里不适用。
  4. 指出你没提但应该关心的事。
  5. 用新学的词重写你的描述。
  6. 每个链接都要打开，确认它确实这样用这个词；确认不了的引用就删掉。
- **/sharpen 做什么**（[SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/skills/sharpen/SKILL.md)）：把任务做**深**，不是做**大**。重写之前先回答四个问题：这个领域的顶尖行家会做哪些你没要求的事？他们会从哪种最原始的材料入手？他们会用哪些具体方法和工具？除了你和 agent 自己，还有什么能证明结果是对的？重写后的 prompt 要让 agent 对「做个实验就能决定」的选择先做原型、按观察结果推荐，产品和偏好上的选择留给你。
- **为什么适合你**：你一直在补 agent 工程的术语，这个 skill 就是专门干这个的。比如你想要「改了 skill 以后，确认它没有变差」，它可能会告诉你这叫 regression eval、held-out set、pairwise comparison，并附上原文。评论区有一条提醒值得记：重写后的 prompt 读起来更清楚，不等于更好，它可能悄悄丢掉了真正要紧的约束。所以**同一个任务要拿新旧两版 prompt 各跑一次，比较输出**，下面的 prompt 已经把这一步写进去了。
- 不装 pstack 也能用，下面是通用版：

```
目标：我有一个想让 agent 做的事，但我说不清楚。请先教我这件事在行家那里怎么叫，再用这些词重写我的需求，最后用实际运行证明新写法比旧写法好。全程用简体中文、大白话，术语保留英文原文。

1. 先问我要做什么（我会用自己的话描述），再读仓库里和这件事相关的文件和代码。如果我的描述可能指好几种不同的问题，先列出 2–3 种，每种给出对应的术语和区分它们的迹象，告诉我你认为最可能是哪种、为什么，等我确认。
2. 给我 8–12 个术语，按「对最终做出来的东西影响多大」从大到小排。每个术语写：一句大白话的意思；它对应我描述里的哪一句；一个真实用到这个词的项目、论文或文档（附链接）；学会它以后我可以怎么指挥 agent。每个链接你都要实际打开，确认它确实这样用这个词，确认不了就删掉，不要凑数。
3. 找 2–3 个解决过同类问题、但叫法不同的相邻领域，说明哪些做法能搬过来、哪里不适用。
4. 指出我没提、但应该关心的 2–3 件事。
5. 用新学的词重写我的需求，写成一个能直接交给 coding agent 的 prompt，里面要有：目标、约束、做完的判断标准，以及什么证据能证明做对了（这个证据不能只是 agent 自己说做好了）。
6. 验证：挑一个小而具体的例子，在仓库外的临时目录或单独的 git worktree 里，用无头模式（先确认本机实际可用的命令，例如 claude -p 或 codex exec）分别用我的原始描述和新 prompt 各跑一次。对比两次的输出，指出新 prompt 有没有丢掉原来的某个约束。
7. 交付：术语表、重写后的 prompt、两次运行的输出路径和对比结论。如果新 prompt 没有明显更好，就如实说。

参考：pstack /reframe https://github.com/cursor/plugins/blob/main/pstack/skills/reframe/SKILL.md ；/sharpen https://github.com/cursor/plugins/blob/main/pstack/skills/sharpen/SKILL.md
```

来源：[you can only prompt what you can imagine](https://x.com/poteto/status/2125029185379008573)（poteto，2026-11-24 08:50 Asia/Kuala_Lumpur）；[reframe/SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/skills/reframe/SKILL.md)、[sharpen/SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/skills/sharpen/SKILL.md)（poteto）

---

### 3. CS146S 第 6 周作业「Agent 成本优化」：同一个事故修复任务，要求修得对，还要花得尽量少。花费压到基线的一半就拿满分

- **要点**：Mihail Eric 11-24 02:50（Asia/Kuala_Lumpur）发帖说「token 不是免费的」，这周的作业就是让 agent 省着花钱跑。作业仓库 11-19 加入 week6，11-24 02:02 又更新了一次。作业内容：
  - 一个为课程专门写的仓库 Switchyard（webhook 投递系统，TypeScript、Python、Go 三个服务），给一个线上事故（重复扣款）。agent 要修好代码，还要从日志里算出影响范围，输出 `out/impact.json`。
  - 只能用 Claude Code 或 Codex 的无头模式，只能用价目表上的 4 个模型（每家一个中档、一个小档），每次运行上限 2 美元、10 分钟，不能有人插手。
  - 评分：正确性 35 分，成本 35 分（花费等于基线得 0 分，降到基线一半或更低得满分），报告 30 分。最后用一个**没见过的事故**来评，所以只针对这一个工单写的 prompt「一文不值」。
- **作业给的「省钱杠杆」清单**，对你自己的项目同样适用：
  - 换模型：用小模型代替中档模型。
  - 分工：中档模型诊断，小模型改代码，检查失败了才升级。
  - 推理强度：机械的步骤调低。
  - 上下文：写 AGENTS.md/CLAUDE.md 和仓库地图，告诉 agent 该读什么、别读什么。
  - 拆分：把一次调用拆成几次无头调用。
  - 工具：工具白名单、skills、hooks、subagent、解析证据的脚本。
  - 验证：agent 停下前先跑你写的检查。
  - 缓存：保持 prompt 前缀稳定，让后面的调用能命中缓存。
  - 停止：限制轮数，检查通过就停。
- 作业还特别要求：**改任何东西之前先读日志**，看 token 花在哪里、漏了哪些场景、agent 当时是怎么想的才走错的。这和 11-23 讲的错误分析是同一个思路。另外，每个改动要多跑几次，因为结果不稳定的设置在隐藏测试上会吃亏。

```
目标：给我在这个仓库里经常让 agent 做的一类任务，测出一次运行到底花多少钱、钱花在哪里，然后在正确率不下降的前提下把成本降下来，每一步都有数据。全程用简体中文。

1. 先问我是哪类任务（例如「修一个有复现步骤的 bug」「给一个模块补测试」），再从仓库里挑 3 个这类任务的真实例子（从 git 历史里找已经修好的问题，回退到修复之前的版本，在单独的 git worktree 里做）。每个例子都要有一个能自动判断对错的检查，例如原修复提交里带的测试，没有就先写一个并给我确认。
2. 跑基线：用无头模式（先确认本机实际可用的命令和参数，例如 claude -p 加输出 JSON 的选项，或 codex exec）按我平时的设置，每个例子跑 2 次。记录每次的：是否通过检查、输入/输出/缓存 token、花费（能从工具输出里拿到就用，拿不到就写明怎么估算的）、工具调用次数、耗时。整理成一张表。
3. 看日志找浪费：读基线运行的记录，按「读了不需要读的文件」「同一个命令反复跑」「走错方向后又回头」「说明书里的信息过期导致绕路」等归类，计数，按 token 占比从多到少排。每一类都附上日志里的具体位置。
4. 一次只动一个杠杆：可以从这几个里选：换小模型、限制只能用哪些工具、在 AGENTS.md/CLAUDE.md 里加仓库地图或「不要读」清单、拆成「诊断」和「修改」两次调用、加一个停下前必须跑的检查、限制最大轮数。每改一处，3 个例子各跑 2 次，和基线比通过率和花费。通过率下降的改动直接撤掉。
5. 交付：基线表、每次改动的对比表（改了什么、通过率、平均花费、相对基线的变化）、最终推荐的配置（以 diff 的形式给我，先不要写进仓库），以及所有运行日志的路径。不要为了这 3 个例子写专门的提示，最终配置要对同一类的新任务也适用。

参考：CS146S Week 6 作业 https://github.com/mihail911/modern-software-dev-assignments/blob/main/week6/assignment.md
```

来源：[Tokens are not free…](https://x.com/mihail_eric/status/2124938541075677221)（Mihail Eric，2026-11-24 02:50 Asia/Kuala_Lumpur）；[Week 6: Agent Cost-Optimization](https://github.com/mihail911/modern-software-dev-assignments/blob/main/week6/assignment.md)（Mihail Eric，CS146S）

---

### 4. 说明书过期的「隐藏成本」：任务照样能完成，所以没人发现；但每次都要多绕几步，而且 732 条记录里没有一个 agent 回头修说明书

- **要点**：11-09 介绍过两篇关于 CLAUDE.md/AGENTS.md 过期的论文：一篇讲 agent 会听过期的说明书、不听代码，另一篇讲怎么在 CI 里查出失效的引用。这周 X 上又有人翻出这个话题（Vox 的帖子抓取时有 126 次收藏）。这里补一篇 11-06 发在 arXiv 上、简报还没讲过的新论文，Tural Mehtiyev 等人的《When Instruction Files Go Stale》：
  - 从活跃开源仓库里挑了 3 条真实的过期指令：一条测试命令、一个代码位置、一个「怎么加组件」的流程。每条做三个版本：保持过期、改成正确的、直接删掉。让两个模型修 22 个维护任务，按单次工具调用分析了 732 条运行记录。
  - 结果：只要过期指令和任务有关，agent 就会照着做，有时正确信息就在别处也一样。过期的测试命令让 Claude Sonnet 5.5 **每次平均多出约 2 次工具调用，比用正确命令时多三分之一**，但**任务成功率不受影响**。另外两种情况没测出明显差别。
  - agent 通常能从眼前的失败里绕出来，但**没有一次去修那份说明书**，所以下一次还会踩同样的坑。论文把这叫做「文档债」：过期指令是债，每次会话多花的步骤就是利息。
  - 把指令改对，就不会再去碰旧路径。直接删掉，也能避免大部分问题。
- **和第 3 条的关系**：只看「任务成没成」的 eval，看不到这种浪费。要看运行过程里的工具调用才能发现，这也是第 3 条作业强调先读日志的原因。下面的 prompt 和 11-09 的不一样：不是去扫说明书，而是**从你过去的会话记录里**找出说明书带来的浪费。

```
目标：从我过去的 coding agent 会话记录里，找出「因为 AGENTS.md/CLAUDE.md 等说明书内容过期而多走的冤枉路」，算出每条过期指令大概浪费了多少次工具调用，再给出修改建议。只读分析，最后的修改先给我看。

1. 先确认会话记录在哪里、是什么格式：先查当前 agent 工具的官方文档或本机目录（例如 Claude Code 通常在 ~/.claude/projects/ 下，Codex 有它自己的会话目录），不要猜。只取和这个仓库有关的最近 20–30 个会话。如果找不到，就告诉我，并改成：用无头模式在这个仓库里跑 5 个日常小任务，保存运行记录后再分析。
2. 列出仓库里所有 agent 说明书（AGENTS.md、CLAUDE.md、子目录里的同类文件、skills 正文）里写到的命令、路径和流程，逐条在当前代码里核实：命令真的跑一下（只跑测试、lint、构建这类只读或无害的命令，有副作用的先问我），路径检查是否存在。
3. 在会话记录里找证据：agent 执行了说明书里的命令或路径，结果失败（命令不存在、路径找不到、测试目录不对），然后换了一种做法才成功。每一处都记下：会话文件、位置、对应说明书的哪一行、从失败到绕回来多花了几次工具调用。
4. 汇总：每条过期指令一行，写明出现几次、合计多花几次工具调用、建议怎么处理（改成正确的内容，或者直接删掉），按浪费从多到少排。
5. 给出说明书的修改 diff（先不要写入），再给 AGENTS.md/CLAUDE.md 加一条规则的建议，例如：「执行说明书里的命令或路径失败、换了做法才成功时，在最终回复里指出这一行，并附上修改建议」。
6. 验收：每个数字都能对应到具体的会话文件和位置；交出分析结果的路径；没有我的确认，不修改任何文件。

参考：Mehtiyev 等《When Instruction Files Go Stale: Documentation Debt and Hidden Cost in Coding Agents》https://arxiv.org/abs/2611.09802
```

来源：[When Instruction Files Go Stale: Documentation Debt and Hidden Cost in Coding Agents](https://arxiv.org/abs/2611.09802)（Tural Mehtiyev、Biruk Tadesse、Lawrence Arkoh、Wesley Assunção，2026-11-06）；X 上的讨论：[Vox 的帖子](https://x.com/Voxyz_ai/status/2124880659889938848)（2026-11-23 23:00 Asia/Kuala_Lumpur）

---

### 5. 给 11-22「成对比较」补一个反例：从一堆记录里挑「最符合条件的前 k 条」时，逐条打分再排序，比两两比较更准，也快 8 倍

- **要点**：Shreya Shankar（Hamel 的 evals 课合作者）的实验室 11-23 发了一篇博客，作者是 Jianhong Shi 和 Shreya Shankar。他们本来打算在自家的 SQL 引擎 Quail 里加一个「用两两比较选出前 k 条」的功能，做完实验后放弃了：
  - 三个业务任务：销售通话里客户是否承诺购买、合同里是否有竞业或排他条款、医学文章里是否记录了恶心呕吐等副作用。四种方法都用 40 亿参数的模型。「逐条打分（问一个是/否问题，取模型偏向『是』的程度当分数）再排序」在 Precision@25 上和两两比较打平或更好（合同任务 96% 比 80%，药物副作用任务 28% 比 20%），速度快 8.2 倍（几何平均）。
  - 原因之一是**交换两条记录的先后顺序，模型就可能改主意**。他们测了 8 个模型：Qwen3-0.6B 在合同任务上只有 0.6% 的记录对交换顺序后答案不变；最稳定的模型在药物副作用任务上也有 12% 的记录对改了答案。两两比较时只要错一次，一条本该进前 k 的记录就可能被淘汰，后面再也捞不回来。
  - 另一个原因：两两比较只给出谁赢，丢掉了「有多确定」这个信息。
- **怎么理解**：这和 11-22 讲的规则并不矛盾。这三个任务都有明确的是/否标准，属于「客观标准直接判定」。11-22 推荐成对比较，是针对文风、语气这类主观质量。新增的教训是：**用成对比较的地方，一定要做「交换顺序」测试**，看看你的裁判有多容易被顺序带偏。

```
目标：检查我在用的 LLM 裁判（成对比较或打分都行）有多容易被「输入的先后顺序」带偏，并判断我这个场景该用成对比较还是逐条打分。只读，不修改裁判本身。

1. 先问我裁判在哪里（prompt 文件或代码路径）、它评的是什么，以及手上有没有人工标注过的样本。把裁判 prompt 原文展示给我。
2. 判断标准是什么类型：如果评判标准能写成「是/否」的明确条件（有没有、对不对、符不符合），把它标成「客观」；如果是文风、语气、好不好读这类，标成「主观」。说明理由。
3. 交换顺序测试（成对比较的裁判）：取至少 30 对样本，每对按 A/B 和 B/A 各判一次（能用无头模式就用，先确认本机实际可用的命令）。统计两次结论一致的比例，并列出不一致的样本编号。如果是打分裁判，就把同一条样本放在不同的上下文位置或换一种格式各打一次分，看分数会不会变。
4. 如果是「客观」标准、又有人工标注：再试一版逐条判定（每条样本单独问是/否），和成对比较的结果一起对照人工标注，比较准确率和调用次数。
5. 交付：一致率、不一致的例子、两种方法的准确率和调用次数对比，以及你的建议（继续成对比较并加上正反各判一次、改成逐条判定，或者先补人工标注）。所有运行记录放在仓库外的临时目录，并交出路径。

参考：Jianhong Shi、Shreya Shankar《Supporting LLM-Powered Top-k Queries in Quail》https://fsdatalab.github.io/blog/ai-score/
```

来源：[Supporting LLM-Powered Top-k Queries in Quail](https://fsdatalab.github.io/blog/ai-score/)（Jianhong Shi、Shreya Shankar，Full Stack Data Lab，2026-11-23）；[Shreya Shankar 发帖](https://x.com/sh_reya/status/2124923481238163649)（2026-11-24 01:50 Asia/Kuala_Lumpur）

---

### 6. 补课 · Worktrunk：1.2 万星的 git worktree 管理工具，专门为「同时开好几个 agent 并行干活」设计

- **要点**：简报讲过很多次并行 worktree 的做法，但没介绍过目前最流行的工具。Worktrunk（max-sixty/worktrunk，抓取时约 12,717 星，Rust 写的，MIT 或 Apache-2.0 许可，今天还有提交）是这样介绍自己的：Claude Code、Codex 这类 agent 已经能自己干较长的活，同时管 5–10 个以上是可行的。git 自带的 worktree 让每个 agent 有自己的工作目录、互不干扰，但用起来很别扭：开一个新 worktree，分支名要敲三遍。
  - 核心命令：`wt switch -c -x claude feat`，一步完成「建分支 + 建 worktree + 进目录 + 启动 Claude」；`wt list` 能看到每个 worktree 的状态，`--full` 还会显示 CI 状态和 AI 生成的摘要；`wt remove` 一次清掉 worktree 和分支；`wt switch pr:123` 直接切到某个 PR 的分支。
  - 进阶功能：在创建、合并前、合并后等时机运行的 hooks；用 LLM 生成提交信息；一条命令完成合并加清理；在 APFS、btrfs、XFS 文件系统上，多个 worktree 共享 `node_modules/`、`target/` 这类构建缓存，不用每个都重新装（用的是写时复制）；用 `hash_port` 给每个 worktree 分配不同的开发服务器端口。
  - 安装：`brew install worktrunk && wt config shell install`（也可以用 cargo，Windows 用 winget）。
- **对你的用处**：在 Mac Studio 上同时开几个 Claude Code 时，最常见的麻烦是每个 worktree 都要重装依赖，还有开发服务器端口冲突。上面那两个功能正好对应这两个问题。下面的 prompt 先让 agent 在你的仓库里试一遍，有证据再决定用不用。

```
目标：评估并试用 Worktrunk（git worktree 管理工具，https://github.com/max-sixty/worktrunk ），看它能不能让我在这个仓库里同时跑 2–3 个 coding agent，并且互不干扰。只在新建的 worktree 里操作，不动我当前的工作目录和未提交的改动。

1. 先读 Worktrunk 的 README 和 https://worktrunk.dev 上和安装、switch、list、remove、hooks、共享构建缓存相关的文档，用 5 行总结它能做什么。检查本机是否已经装了；没装的话，把安装命令给我，等我确认后再装。
2. 读这个仓库：确认包管理器、依赖目录（如 node_modules）、开发服务器命令和端口配置、构建产物目录，以及当前的 git 状态（有没有未提交的改动、当前在哪个分支）。先贴出 git status。
3. 试用：用 Worktrunk 建 2 个 worktree（分支名用 try-wt-a、try-wt-b），各自完成依赖安装（如果文件系统支持共享缓存，就试一下共享，并记录耗时和占用的磁盘空间，和普通安装对比），各自启动开发服务器，确认端口不冲突。贴出命令和输出。
4. 在其中一个 worktree 里启动一个 agent 做一个很小的无害改动（例如改一条注释），确认另一个 worktree 和我的主工作目录完全不受影响（贴出三个目录各自的 git status）。
5. 清理：用 Worktrunk 删掉这两个 worktree 和分支，贴出 git worktree list 和 git branch 证明清理干净了。
6. 交付：一张表，列出「手写 git worktree 命令 vs Worktrunk」在步骤数、耗时、磁盘占用上的对比；再写一段建议：这个仓库要不要用它、需要什么配置（例如 hooks、端口规则），配置先给 diff，不要写入。

参考：https://github.com/max-sixty/worktrunk ；https://worktrunk.dev
```

来源：[max-sixty/worktrunk](https://github.com/max-sixty/worktrunk)（Maximilian Roos，[@max_sixty](https://x.com/max_sixty)）；文档 [worktrunk.dev](https://worktrunk.dev)

---

## 扫描记录

- **GitHub**（带 token 调 API，按 stars 排序）：搜了 claude-code skills（11-10 之后新建）、agent skills（11-12 之后新建）、AGENTS.md（11-01 之后新建）、claude plugin（11-10 之后新建）、subagent（11-01 之后新建）、mcp agent（11-15 之后新建）、codex skills（11-10 之后新建），以及 claude-code（3000 星以上、11-21 之后有提交）、evals agent、context engineering、harness engineering、worktree agents（11-15 之后有提交）。近两周新建的高星仓库仍然以营销、游戏、视频、设计类 skill 为主，没收。高星但简报从没提过的：max-sixty/worktrunk（约 1.27 万星，收入第 6 条）；同类的并行 agent 桌面或终端工具 NanmiCoder/cc-haha（约 1.55 万星）、generalaction/emdash（约 6300 星）、supabitapp/supacode、johannesjo/parallel-code、savannahfeder/agentbox；还有 paperclipai/paperclip（约 11.6 万星，管理多个 agent 的应用）、NousResearch/hermes-agent（约 26.6 万星），已列进 watchlist「待评估」。几个和「说明书过期」相关的小仓库：rkkautsar/trace2rules（从会话记录里挖出有证据的 AGENTS.md 规则）、rjcuff/Woolly、frc9427liu-tech/memrot（检查 CLAUDE.md/AGENTS.md 里过期、矛盾、臃肿的内容），星数都很少，只记下来。
- **官方插件市场**：claude-plugins-official 今天仍是 317 个，和 11-23 的快照比没有增删（已存成 plugins-snapshot-2026-11-24.txt）。11-23 一天有多次提交：security-guidance 的说明和修复、vercel 和 wix 的版本升级，以及「Plugin workflows: hardening (#7206)」（看提交标题是仓库自己的工作流加固）。openai/plugins 的 plugins/ 目录仍是 62 项，最新提交仍是 11-19 03:14（Asia/Kuala_Lumpur），之后没有新提交。
- **X**：扫了一线实践者 11-22 之后的帖子，又用中英文关键词各搜了一轮。收了 Boris Cherny 的 Claude Ship（第 1 条，评论区两条有用的建议已写进条目）、poteto 的 /reframe（第 2 条，评论区有一条提醒已写进条目，其余大多是让 bot 帮忙安装的回复）、Mihail Eric 的第 6 周作业（第 3 条）、Shreya Shankar 的实验室博客（第 5 条）、Vox 引出的过期说明书论文（第 4 条）。看过没收：Akshay（@akshay_pachaar）的「怎么写真正有用的 Agent Skill」（288 次收藏，第一条是「写 skill 之前，先不带 skill 跑 3 个真实任务，记下 agent 做错的地方，这份清单就是你的 skill」；正文被截断，拿不到全文，所以没收）；Matt Pocock「I've been cooking」（只有一张图，看不到内容）；Simon Willison 试用 Ladybird 浏览器、datasette-charts 插件；@VibeKitLab 等几条提醒「只要有任何 CLAUDE.md，Claude Code 就不读 AGENTS.md，在 CLAUDE.md 第一行写 @AGENTS.md」（互动很低，没去官方文档核实）；Bitdefender 关于说明书供应链攻击的转述（11-20 已讲）。中文关键词的结果互动都很低，以搬运和营销为主。
- **HN**（近 4 天，60 分以上）：新出现的、和工程相关的只有「The next circle of security hell」（237 分，Gentoo 维护者的博客）和「0rwx – A simple model of AI usage, inspired by Unix permissions」（69 分），都只看了标题，没收。其余高分帖是模型发布（GLM-5.4、Inkling 2 Mini）、Anthropic 上市、能源等新闻。Dragos、OpenRouter、worker755 这几篇 11-23 已经看过。
- **博客**：claude.com 收了 Claude Ship（第 1 条）。Shreya 实验室博客收了第 5 条。Simon Willison 近两天写的是 Muru、Ladybird 和 datasette-charts，偏个人项目，没收。hamel.dev、anthropic.com/engineering 这次没去逐篇翻，X 上也没看到新文章的消息。

## 本期去重用源链接（机器可读）

- https://alexgude.com/blog/machine-learning-deployment-shadow-mode/
- https://martinfowler.com/bliki/DarkLaunching.html
- https://claude.com/resources/articles/introducing-claude-ship
- https://x.com/bcherny/status/2124961485801836573
- https://x.com/bcherny/status/2124961488691740941
- https://x.com/poteto/status/2125029185379008573
- https://github.com/cursor/plugins/blob/main/pstack/skills/reframe/SKILL.md
- https://github.com/cursor/plugins/blob/main/pstack/skills/sharpen/SKILL.md
- https://x.com/mihail_eric/status/2124938541075677221
- https://github.com/mihail911/modern-software-dev-assignments/blob/main/week6/assignment.md
- https://arxiv.org/abs/2611.09802
- https://x.com/Voxyz_ai/status/2124880659889938848
- https://fsdatalab.github.io/blog/ai-score/
- https://x.com/sh_reya/status/2124923481238163649
- https://github.com/max-sixty/worktrunk
- https://worktrunk.dev
- （看过未收）https://x.com/akshay_pachaar/status/2124118137671155887 （正文被截断）
- （看过未收）https://x.com/mattpocockuk/status/2124960763450126399 （只有图）
- （看过未收）https://news.ycombinator.com/item?id=50610334 、https://news.ycombinator.com/item?id=50605445 （只看了标题）
- （补课候选）https://github.com/NanmiCoder/cc-haha 、https://github.com/generalaction/emdash 、https://github.com/paperclipai/paperclip 、https://github.com/rkkautsar/trace2rules
