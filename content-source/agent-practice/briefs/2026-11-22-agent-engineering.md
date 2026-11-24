# Agent 工程实践简报 · 2026-11-22

> 给冻鱼。窗口约 2026-11-20 → 2026-11-22（Asia/Kuala_Lumpur）。今天的主线是**「怎么判断 agent 做得好不好」**。今日概念是「成对比较」：不让人或模型给一份输出打绝对分，只问「A 和 B 哪个更好」。Matt Pocock 想用这个办法让 agent 学会你的写作口味；Ponytail 也是靠这个办法证明自己的规则一版比一版好。另外三条：CS146S 讲师 Mihail Eric 画了一张「软件工厂」全景图；HN 580 分的文章说，用 AI 写代码的开发者其实已经被「升职」成了架构师；补课 Hamel 的《"It's Hard to Eval" Is a Product Smell》：如果连你都很难检查 AI 的产出，用户也一样难检查。

## 今日概念：Pairwise comparison（成对比较）：不打绝对分，只问「A 和 B 哪个更好」

**是什么**：评估输出质量有两种问法。一种是**直接打分**：「这段回答打几分（1–5）？」另一种是**成对比较**：把两个版本并排放，只问「哪个更好？（也可以选平手）」。人和模型都有这个特点：凭空给出一个稳定的绝对分数很难，但两个版本摆在一起挑出更好的那个，又快又稳定。Chatbot Arena 给模型排名用的就是这个办法：大量「二选一」投票累积成排行榜。

**解决什么问题**：
- **主观的质量**（语气、文风、文案好不好、回复写得清不清楚）没法写成测试，直接打分又不稳定，今天打 4 分明天打 3 分。换成成对比较，结果明显更稳定。Eugene Yan 的综述引用了多项研究：成对比较时，LLM 裁判和人的判断更接近。
- **改 prompt 或 skill 时判断有没有变好**：新版和旧版跑同一批任务，逐对比较哪个好，比分别打分再对比平均分可靠。
- 它有个出名的坑：**位置偏见**。模型裁判倾向于选放在前面的那个。解决办法是每对比较都随机打乱顺序，或者正反各比一次。

**什么时候不该用**：客观的对错（测试过没过、有没有违反规定、是否忠于原文）应该用直接判定，最好是 pass/fail。两个都错的时候，「更好的那个」照样是错的。Eugene Yan 总结的规则是：**客观标准直接判定，主观标准成对比较**。

**和你已会的东西的关系**：
- 11-15 讲的「LLM-as-judge（让模型当裁判）」：成对比较是裁判的一种问法，同样需要用人工标注来校准（TPR/TNR）。
- 11-01 讲的「爬坡迭代」：每次改一点，只有「新版在成对比较里赢了旧版」才保留。今天第 5 条的 Ponytail 就是这么迭代的。
- 11-18 讲的「奖励作弊」：裁判如果偏爱长回答或者排在前面的回答，agent 就会往这个方向钻空子，所以要打乱顺序，并让裁判先通过自测。
- 今天第 2 条 Matt Pocock 的「打分器 app」，就是请你本人来当成对比较的裁判。

**入门原文**：[Evaluating the Effectiveness of LLM-Evaluators (aka LLM-as-Judge)](https://eugeneyan.com/writing/llm-evaluators/)（Eugene Yan）。直接看「direct scoring vs. pairwise comparisons」和文末的使用建议两部分。

**上手 prompt**：
```
目标：给我自己写的一个 prompt 或 skill 做一次「成对比较」评估，判断改动后的新版本是不是真的比旧版本好。全程用简体中文。

1. 先问我要比较哪两个版本（文件路径、git 提交，或者我直接贴给你）。读完两个版本，用 3 行大白话说明它们的区别。
2. 根据这个 prompt/skill 的用途，写 8–12 个真实的输入场景（覆盖常见情况和 2–3 个边界情况），先给我看，我确认后再继续。
3. 每个场景用两个版本各跑一次（能用无头模式就用，例如 claude -p 或 codex exec；先确认本机实际可用的命令），把输出原样保存到一个临时目录，不要放进我的项目仓库。
4. 把评判标准分成两类，先给我确认：
   - 客观标准（格式对不对、有没有违反明确规则、事实对不对）：每个输出单独判 pass/fail，不做比较；
   - 主观标准（清晰度、语气、有没有废话）：做成对比较。
5. 成对比较的做法：每对输出随机决定谁当 A、谁当 B，并记录对应关系；每对正反顺序各比一次，两次结论不一致就记为平手。由独立的子 agent 当裁判，它只能看到场景、两个输出和标准，不知道哪个是新版。
6. 正式评判前，先抽 3 对给我本人盲评，算一下裁判和我的一致率；低于 2/3 就先修改裁判的说明，再继续。
7. 输出：一张表（场景、客观项新/旧是否 pass、成对比较结果胜/负/平），总的胜负平统计，以及新版输掉的场景各自输在哪里。
8. 验收：所有结论都对应到保存下来的原始输出文件；交出随机分配 A/B 的记录；如果新版在任何客观项上比旧版差，结论就是「不采用」，不管成对比较赢了多少。

参考：Eugene Yan《Evaluating the Effectiveness of LLM-Evaluators》https://eugeneyan.com/writing/llm-evaluators/
```

---

## 本期条目

### 1. CS146S 讲师 Mihail Eric 的「软件工厂」全景图：先让 agent 能自己启动、自己验证，然后让每次失败都变成一条文档、skill、lint 规则或工具；衡量指标是每个 PR 的成本、周期和人工介入次数，不看代码行数

- **要点**：Mihail Eric（Stanford CS146S 的讲师）11-21 凌晨（Asia/Kuala_Lumpur）发了一张图，把大家说的「软件工厂」拆成几个部件（抓取时 527 次收藏）：
  - **触发**：Slack、Linear、GitHub issue、定时任务、报警，都可以自动开一个任务；
  - **编排循环**：分诊 → 写规格（**人批准**）→ 实现 → 审查（**按风险分级，由人审**）→ 验证（**人做产品检查**）→ 发布 → 监控。监控发现的新问题再回到分诊；
  - **每次运行一个隔离沙箱**，里面没有生产环境的凭证，「隔离就是权限」；
  - **工厂定义写成代码**：skills、规则（AGENTS.md）、自动化配置，管着每一个环节。
- 他写的几条原则：
  - **agent 就绪是第一步**：如果 agent 不靠人帮忙就启动不了开发环境，那还谈不上建工厂（10-28 讲过「agent 就绪代码库」）；
  - **每个改动都过同一道关**：CI、静态分析、测试、AI 审查员，再加一个 AI 裁判按规格给整次运行打分。最好的基准是**你自己的历史**：拿过去的 PR 重放，比较不同模型和配置的成本和质量；
  - **每次失败都要让系统变好**：缺陷漏出去了，就查清原因，把它变成文档、skill、lint 规则或工具（和 11-19 的 /correct、11-21 的「棘轮」是一个思路）；
  - 人从工人变成管理者：计划同步做，执行异步跑，按风险分配审查。指标看**每个 PR 的成本、周期时间、每个 PR 需要几次人工介入**，不看代码行数，也不看 token 数。
- 对你：下面的 prompt 不会搭工厂，它先帮你看清当前仓库离「工厂」还差几步，以及过去的 PR 能不能当基准用。

```
目标：对照「软件工厂」的几个部件，给当前仓库做一次只读的差距体检，并找出可以当基准重放的历史 PR。不要修改任何文件。

1. agent 就绪：读 README、AGENTS.md/CLAUDE.md、package.json/Makefile/CI 配置等实际存在的文件，然后在一个干净的临时副本（git worktree 或临时目录）里真的按文档试一遍：安装依赖、启动开发环境、跑 lint、类型检查和测试。记录每一步的命令、是否成功、哪一步卡住了、卡住的那一步是否需要人（账号、密钥、手动点击、本地服务）。
2. 按下面每个部件给出「已有 / 部分 / 没有」并附证据（文件路径或命令输出）：
   a. 触发：issue/PR 模板，有没有能自动开任务的入口；
   b. 规格：开工前有没有写规格或计划的约定，有没有人批准这一步；
   c. 验证：CI 里有哪些自动检查；有没有能看到真实界面的检查（截图、端到端测试）；
   d. 隔离：agent 能不能在没有生产凭证的环境里完整跑起来；
   e. 失败沉淀：最近 20 个修 bug 的提交里，有几个同时新增了测试、lint 规则或文档（用 git log 统计，列出提交号）；
   f. 指标：能不能从 git/GitHub 拿到每个 PR 从开到合并的时间、review 轮数（只读查询，有 gh CLI 才查）。
3. 基准候选：从最近 3 个月合并的 PR 里挑 5 个适合重放的（改动小于 300 行、有明确的 issue 或描述、合并时 CI 是绿的、有测试能判断对错），列出 PR 编号、标题、为什么适合，以及重放时用什么命令判断成功。
4. 最后给我：最该先补的 3 件事（每件说明预计工作量和怎么验证补好了），按「让 agent 不靠人就能启动和验证」优先排序。
5. 验收：每个结论都附命令输出或文件路径；无法验证的写「未验证」并说明原因；仓库工作区在结束时和开始时完全一致（用 git status 证明）。

参考：Mihail Eric 的软件工厂全景图 https://x.com/mihail_eric/status/2123866740019077553
```

来源：[Here are all the components of what people call a software factory](https://x.com/mihail_eric/status/2123866740019077553)（Mihail Eric，2026-11-21 03:51 Asia/Kuala_Lumpur）

---

### 2. Matt Pocock：让 agent 学会你的写作风格，不要写风格指南，而是做一个「左滑右滑」的打分器，让 agent 一句一句发例句给你评，或者让你二选一，由它自己总结你的口味

- **要点**：Matt Pocock 11-22 凌晨（Asia/Kuala_Lumpur）的新想法，抓取时 1133 次收藏：
  1. 做一个「打分器」小 app，agent 一次发一句例句给你，你像刷交友软件一样快速打分；
  2. 两种模式：单句打 1–4 分，或者「这几句哪句更好」（多选一，就是今天的概念）；
  3. 和 agent 一起列好文章大纲，然后一句一句往下写；
  4. agent 可以自己提出关于你风格的假设（比如「他不喜欢排比」），用例句去验证，慢慢积累出一份风格档案。
- 评论区有人说到了点子上：「一句一句给句子打分，比写一份谁也说不清的风格指南强。」
- 对你：这个方法不只能用在写文章上。App 里的文案、提交信息、给用户的报错提示，凡是「好不好」说不清的东西，都可以先用打分器收集你的偏好，再把总结出的规则写进 skill。下面的 prompt 先做一个最小版本。

```
目标：做一个本地的「口味打分器」小工具，通过我快速二选一，收集我对某类文字的偏好，最后整理成一份可以放进 skill 的风格规则。全程用简体中文。

1. 先问我要收集哪类文字的口味（例如：App 界面文案、报错提示、git 提交信息、PR 描述、技术博客的句子）。再问我要 5–10 条我认为写得好的现有例子（可以从仓库里找，找到的先给我确认）。
2. 做一个最小的本地工具，放在仓库外的临时目录，不要修改我的项目。用仓库里已有的语言，或者单个 HTML 文件加一个很小的本地脚本。每次显示两条候选文字，我按左/右键选更好的，按空格表示平手，按 s 表示两条都不好。结果按行追加到一个 JSONL 文件，记录两条候选、各自对应的假设、显示顺序、我的选择、时间。
3. 候选由你生成：每一轮你先写下一条关于我口味的假设（例如「偏好主动语态」「不要感叹号」「数字用阿拉伯数字」），再生成一对只在这一点上不同的句子，左右位置随机。
4. 每 10 轮之后读一次 JSONL，更新假设表（假设、支持次数、反对次数、平手次数），把 5 次以上、而且有 80% 以上倾向的假设标为「已确认」。
5. 我说结束时，把已确认的假设写成一份不超过 20 行的风格规则草稿，每条附一对正反例。草稿只给我看，不要写进任何 skill 文件。
6. 验收：工具能在本机跑起来（给出启动命令和一次实际运行的截图或终端输出）；JSONL 里的显示顺序确实是随机的（统计左右各占多少）；风格规则里每一条都能对应到 JSONL 里的具体记录。

参考：Matt Pocock https://x.com/mattpocockuk/status/2124214098984370645
```

来源：[Thinking about a new, very simple way of getting an agent to write in your style](https://x.com/mattpocockuk/status/2124214098984370645)（Matt Pocock，2026-11-22 02:51 Asia/Kuala_Lumpur）

---

### 3. HN 580 分：《We promoted developers into architects without informing them》：AI 只会照着需求写代码，不会反驳需求；你得先定好架构和数据模型，规定 agent 改动它们之前必须先问你

- **要点**：Mani Doraisamy 11-20 的文章（HN 580 分、309 条评论）。起因是同事用 vibe coding 写了个记录新安装用户的日志，AI 写了一串 try/catch：先尝试拿邮箱，失败了拿用户 ID，再失败就记一条错误日志。每一步背后都要调好几次 Google API，而这段代码又是安装后第一个执行的，结果欢迎页要 15 秒才能打开。正确的做法是**反驳需求**：只记时间戳，或者先显示欢迎页再异步记录。AI 不会这样做，因为它不知道你有多少用户，而且总是照着需求原样实现。
- 他的结论：**只写需求不写架构，AI 就会替你决定架构**。AI 默认会兼顾功能需求、安全和向后兼容，常见后果是为了安全牺牲性能，以及数据模型里堆出好几个版本的冗余表和字段。开发者现在的新工作是：反驳需求、先设计数据模型、让 AI 在这个约束里写代码，并且规定「**要改架构或数据模型，必须先问我**」；还要明确告诉它什么时候需要向后兼容，什么时候应该删掉旧逻辑。作者在文末补充：也别完全不写代码，关键部分时不时亲手写一写，否则很容易画出不落地的空中楼阁。
- 对你：这和 11-13 的 ADR、11-05 的规格驱动开发是一回事，只是换了个角度：最值得写下来交给 agent 的是**架构约束**，不是需求。

```
目标：给当前仓库写一份「架构约束」，让 coding agent 改动架构和数据模型之前必须先问我。不要修改业务代码。

1. 先读仓库：目录结构、入口、数据模型或 schema 定义（数据库 schema、ORM 模型、类型定义、API 契约、本地存储结构等实际存在的文件）、网络请求和缓存层、现有的 AGENTS.md/CLAUDE.md 和 ADR 目录（如果有）。
2. 整理出「架构事实」清单，每条附文件路径作为证据，例如：数据存在哪里、有哪些核心实体和关系、哪些调用在启动或首屏的关键路径上、哪些地方必须向后兼容（已发布的 API、本地持久化格式、数据库迁移）。
3. 找出 3–5 个「AI 很容易不打招呼就改」的高风险点（例如在关键路径上加同步网络调用、新增表或字段而不是复用、为了兼容保留重复逻辑），说明为什么高风险。
4. 起草一节不超过 25 行的「架构约束」，准备放进 AGENTS.md（如果仓库用的是 CLAUDE.md，就放进 CLAUDE.md）：
   - 必须先问我才能做的改动（新增或修改数据模型、在关键路径上加网络调用、引入新依赖、改变持久化格式等，以第 2 步的实际情况为准）；
   - 向后兼容的规则：哪些必须兼容，哪些可以直接删掉旧版本；
   - 遇到需求和这些约束冲突时：停下来说明冲突和代价，给出 2 个选项，不要自己选。
   先把草稿给我审，我同意后再写进文件。
5. 验收：草稿里每条约束都能对应到第 2 步的一条架构事实；再设计 2 个「会触发约束」的假任务，说明 agent 按这份约束应该在哪一步停下来问我（只写出预期，不用真的执行）。

参考：Mani Doraisamy《We promoted developers into architects without informing them》https://manidoraisamy.com/developer-to-architect.html
```

来源：[We promoted developers into architects without informing them](https://manidoraisamy.com/developer-to-architect.html)（Mani Doraisamy，2026-11-20）；[HN 讨论](https://news.ycombinator.com/item?id=50579331)

---

### 4. 补课：Hamel Husain《"It's Hard to Eval" Is a Product Smell》：如果你都很难检查 AI 的产出，用户也一样难；先把产品设计成方便核对（标出处、列假设、写明哪些没验证），evals 自然就好做了

- **要点**：Hamel 2026-06-29 的文章，昨天列为补课候选，以前的简报没介绍过。他最常听到的反对意见是「我们的产品很难做 eval」，他认为这本身就是产品设计有问题（product smell）。举了三个例子：
  - **数据问答 agent**：只回答一个数字「上季度净收入 421 万」，用户除了自己重算一遍，没法核对。更好的设计是附上可以核对的东西：指标口径从哪来、中间计算、按维度拆开后的分布、实际跑的 SQL，以及一份**没能验证的清单**；
  - **体育课教案生成器**：不要从零写一份教案，而是先找最接近的现成教案再改，这样只需要检查改了哪些地方；
  - **工伤医疗报告**：50 页的意见书没法一次核对，于是把产品改成研究助理，让医生边看边逐条确认事实。
- 他总结了四个设计问题：用户到底要核对什么？能拿什么可信的东西来对照？专家核对时靠哪些信号？能不能拆成用户可以逐个接受、修改或拒绝的小块？共同的关键词是**出处（provenance）**，加上渐进披露，避免信息太多把用户淹没。他还提到，写代码本来是最容易验证的工作，但 Cursor、Devin 仍然会录一段界面改动的视频，让人更容易核对。
- 对你：这条有两个用法。第一，LobeHub 本身就是 AI 产品，可以用它检查 AI 功能的输出好不好核对。第二，用在你自己用的 coding agent 上：让 agent 交付时附上证据和「没验证的清单」，你审查起来也会快很多。下面的 prompt 走第二种，任何仓库都能用。

```
目标：把「方便核对」的原则用在 coding agent 的交付上：为当前仓库写一份「交付报告格式」，让 agent 每次完成任务都交出我能快速核对的证据。先起草，不要直接写进文件。

1. 先读仓库的 AGENTS.md/CLAUDE.md（如果有）、CI 配置，以及 lint、类型检查、测试、构建的实际命令（从 package.json、Makefile 等实际存在的文件里确认，原样列给我）。
2. 用 Hamel 的四个问题分析这个仓库里 agent 的典型改动，每个问题写 2–3 行：
   a. 我审一个改动时，到底要核对什么（行为对不对、有没有破坏别的地方、界面看起来对不对……）；
   b. 能拿什么可信的东西对照（测试、类型检查、截图对比、改动前后的输出）；
   c. 资深工程师审查时靠哪些信号（改动范围是否超出任务、有没有新依赖、有没有改公共接口）；
   d. 能不能把改动拆成我可以逐个接受或拒绝的小块。
3. 根据分析起草一份不超过 20 行的「交付报告格式」，至少包含：改了什么以及每处改动的原因（附文件和行号）；跑了哪些命令、结果如何（附真实输出摘要）；界面改动附截图或录屏路径（如果仓库能跑起来）；明确列出「没验证的部分及原因」；超出任务范围的改动单独列出。
4. 拿最近一次真实的改动（我的未提交改动，或者最近一个提交）按这个格式试写一份报告，给我看效果。
5. 验收：试写的报告里，每条结论都有证据（命令输出、文件行号或截图路径）；「没验证的部分」至少诚实列出 1 项，或者说明为什么确实没有；我同意后，才把格式写进 AGENTS.md 或 CLAUDE.md。

参考：Hamel Husain《"It's Hard to Eval" Is a Product Smell》https://hamel.dev/blog/posts/eval-smell/
```

来源：[“It’s Hard to Eval” Is a Product Smell](https://hamel.dev/blog/posts/eval-smell/)（Hamel Husain，2026-06-29）

---

### 5. 补课：Ponytail（约 19.6 万星）：一个让 agent 像「最懒的资深工程师」那样写代码的 skill。写代码前先过一遍七级阶梯，能复用就不新写；更值得学的是它的评测方法：每改一条规则，都要在成对对比里赢过旧版才保留

- **要点**：DietrichGebert/ponytail，2026-06 创建，今天 GitHub 显示 196,387 星，昨天还在更新，但简报从没介绍过（GitHub 扫描按 stars 排序时发现的）。整个项目核心只是一个 prompt：[`skills/ponytail/SKILL.md`](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md)（约 3.5 KB），另有一份精简版 AGENTS.md。
- **阶梯**：先读懂任务和要改的代码，然后按顺序找第一个能完整解决问题的选项：①这个东西真的需要吗？②代码库里已经有了吗？③标准库或平台自带的功能能做吗？④已经装的依赖能做吗？⑤能不能一行写完、一眼看懂？⑥都不行才写最少的代码。**永远不能省的**：信任边界上的校验、防止数据丢失的错误处理、安全、无障碍。有分支、循环、解析、涉及钱或安全的逻辑，至少留一个小测试。每次回复的结尾写明跳过了什么、哪些没检查。知道有局限的捷径，要写成 `shortcut: <局限>, <什么时候升级>` 格式的注释，以后用 `/ponytail-debt` 收集成一份技术债清单。
- **评测方法**（[benchmark 文档](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/results/2026-10-07-agentic.md)）：39 个任务（包括一个真实的 FastAPI + React 仓库，以及带隐藏检查的修 bug 和安全任务），每个任务、每个版本各跑 5 次，共 585 个会话。每个会话在全新的临时目录里跑，关闭 CLAUDE.md 和自动记忆。结果是代码量 -53%、成本 -26%，安全任务全部通过。文档里写明：**每次改规则，都要在成对对比里赢过当前版本才合入**；回复质量用盲评的模型裁判评，**每一对都打乱顺序**，裁判先通过自测才能用。这正好就是今天概念的实际用法。
- 注意：这么高的星数和「-53% 代码」都是作者自己报告的，换到你的仓库效果不一定一样。它的 Codex 版会装两个生命周期 hook，装之前先审一遍。下面的 prompt 不直接安装，而是在你的仓库上做一次小规模 A/B 对比。

```
目标：在不改动我的项目的前提下，判断 Ponytail 这个 skill 在我的仓库上是否真的「代码更少但不更差」。全程用简体中文。

1. 把 https://github.com/DietrichGebert/ponytail 克隆到仓库外的临时目录，先只读审查：列出 hooks/、scripts/、package.json scripts、各平台插件配置里所有会自动执行的东西，以及会联网或写到 ~ 下的地方。发现可疑项就停下来告诉我，不要安装任何东西。
2. 读 skills/ponytail/SKILL.md 和 benchmarks/results/2026-10-07-agentic.md，用不超过 10 行大白话概括它的规则和评测方法。
3. 从我的仓库里挑 3 个小任务（例如一个小功能、一个 bug 修复、一个重命名要改到所有调用处），每个都写清验收标准，以及用哪条命令判断对错（先读仓库确认实际的测试和类型检查命令）。给我确认后再继续。
4. 每个任务在两个独立的 git worktree 里各跑一次：A 组不加载任何额外 skill；B 组只在本次会话的上下文里加载 SKILL.md（例如用 --plugin-dir 或把内容作为系统提示附加；先确认本机实际支持的方式，不要全局安装）。两组用相同的模型和设置。
5. 对每个任务记录：验收命令是否通过、diff 行数、新增依赖数、新增测试数、耗时或 token（能拿到就拿）。
6. 回复质量用成对比较：由一个看不到组别的子 agent 当裁判，两组回复随机排顺序、正反各比一次，标准是「是否如实描述改动、是否说清风险、是否容易读」。
7. 输出一张对比表和结论：只有 B 组在所有任务上验收都通过，才说它「代码更少但不更差」；否则列出它省掉了什么不该省的东西。
8. 验收：所有数字都来自实际运行（附命令和输出摘要）；结束后删除临时 worktree，并用 git status 和 git worktree list 证明我的仓库恢复原状。

参考：Ponytail https://github.com/DietrichGebert/ponytail ；评测方法 https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/results/2026-10-07-agentic.md
```

来源：[DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)（Dietrich Gebert）；[Agentic benchmark: Ponytail 5 vs Ponytail vs no skill](https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/results/2026-10-07-agentic.md)（Dietrich Gebert，2026-10-07）

---

## 扫描记录

- **GitHub**（带 token 调 API，按 stars 排序）：搜了 claude-code skills / agent skills / AGENTS.md / claude plugin / subagent / codex skills（近 1 个月新建）、mcp agent（11 月新建），以及 claude code / agent skills（3000 星以上、近 4 天有提交）、context engineering、evals agent。近一个月新建的高星仓库仍然以动画、像素画、视频、营销类 skill 为主，和工程实践无关，没收。高星但简报从没提过的：DietrichGebert/ponytail（收入第 5 条）；shanraisshan/claude-code-best-practice（约 6.9 万星）、muratcankoylan/Agent-Skills-for-Context-Engineering（约 1.8 万星）、ai-boost/awesome-harness-engineering（约 5200 星）、FailproofAI/failproofai（约 1 万星，agent 运行观测和约束）、colbymchenry/codegraph、stablyai/orca、MiniMax-AI/mcode-stack（约 740 星，MiniMax Code 团队的日常工作流）、phuryn/mini-harness（教学用 harness，约 1400 行 Python），列进 watchlist「待评估」。
- **官方插件市场**：claude-plugins-official 今天仍是 317 个，和 11-21 的快照比没有新增也没有删除（11-21 之后的提交只有主题示例和一个 bump），快照已存成 plugins-snapshot-2026-11-22.txt。openai/plugins 最新提交是 11-19 03:14（Asia/Kuala_Lumpur，Codex Security 的代码归属调整），之后没有新提交。
- **X**：扫了一线实践者近两天的原创帖，又用中英文关键词各搜了一轮。收了 Mihail Eric（第 1 条）和 Matt Pocock（第 2 条）。看过没收：Matt Pocock 的 /vector（2001 次收藏，给非开发者的「把工作委托给 AI」六步 skill，还没发布，等发布了再看）、Matt Pocock「好的 ADR 是好东西」（ADR 11-13 讲过）、Thorsten Ball《Joy & Curiosity #107》（X 文章，正文没抓到）、Thariq 和 poteto 这两天的帖子（闲聊，或者已在 11-21 收过）、Simon Willison 两条 Gemini 4 思考档位的对比（属于模型新闻）。中文关键词结果互动都很低，以搬运和营销为主。Matt Pocock 打分器那条的评论区没有高互动的补充。
- **HN**（近 4 天）：收了 Mani Doraisamy 的「开发者被升职为架构师」（第 3 条）。看过没收：「LLM assisted reverse engineering」（315 分）、「LLMs can read and write executables byte by byte」（190 分），偏逆向工程，不是 agent 工作流；Signal「限制移动操作系统里的 AI agent 抓取数据」（571 分，隐私和平台新闻）；「Show HN: Mastra Factory」（156 分，watchlist 里已列为待评估）；「Show HN: OpenComputer」（117 分）。cekrem 和 Frostbite 11-21 已经看过。
- **博客**：hamel.dev 补课收了 eval-smell（第 4 条）；《Claude's new auto eval tool》仍是补课候选。claude.dev 11-17 之后没有新文章。Simon Willison 近两天的长文和 agent 工程无关。anthropic.com/engineering、Prime Radiant 博客、ghuntley.com 首页这次没抓到文章列表。

## 本期去重用源链接（机器可读）

- https://eugeneyan.com/writing/llm-evaluators/
- https://x.com/mihail_eric/status/2123866740019077553
- https://x.com/mattpocockuk/status/2124214098984370645
- https://manidoraisamy.com/developer-to-architect.html
- https://news.ycombinator.com/item?id=50579331
- https://hamel.dev/blog/posts/eval-smell/
- https://github.com/DietrichGebert/ponytail
- https://github.com/DietrichGebert/ponytail/blob/main/benchmarks/results/2026-10-07-agentic.md
- （看过未收）https://x.com/mattpocockuk/status/2123810087361810663 （/vector，未发布）
- （看过未收）https://x.com/mattpocockuk/status/2124058139477594142 （ADR）
- （看过未收）https://x.com/thorstenball/status/2124206451715604938 （Joy & Curiosity #107，正文未抓到）
- （看过未收）https://www.slowchronicle.com/posts/llm-assisted-reverse-engineering （HN 315）
- （看过未收）https://signal.org/blog/protecting-your-privacy/ （HN 571）
- （补课候选）https://hamel.dev/blog/posts/claude-auto-evals/ 、https://github.com/shanraisshan/claude-code-best-practice 、https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering
