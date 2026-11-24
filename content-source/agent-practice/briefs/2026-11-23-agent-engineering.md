# Agent 工程实践简报 · 2026-11-23

> 给冻鱼。窗口约 2026-11-21 → 2026-11-23（Asia/Kuala_Lumpur）。今天的主线是**「先看真实记录，再动手」**。今日概念是「错误分析」：在写任何 eval 之前，先亲自读一批 agent 的真实输出，记下哪里不对，再把这些问题归类、计数，最后才决定要检查什么。今天有四条：第 1 条是 X 上收藏 4000 多次的「给代码库除草」prompt：让 agent 翻 git 历史，找出人和 agent 反复犯的错，把每一种都改成「犯不了」。第 2 条补课 Hamel 试用 Anthropic 自动 eval 插件后写的评测，他的结论是没把「看数据」放在中心的 eval 工具就不值得用。第 3 条补课 2.5 万星的中文友好课程《Learn Harness Engineering》。第 4 条是 HN 上的 Dragos 调查：他们往 AI 服务发了约 200 万条带「诱饵密钥」的 prompt，发现至少 3 家服务商被入侵。结论是 agent 能读到什么，就可能把什么发出去。

## 今日概念：Error analysis（错误分析）：先读一批真实记录、写下问题、归类计数，再决定写什么 eval

**是什么**：错误分析是做 eval 的第一步，也是 Hamel Husain 和 Shreya Shankar 认为最重要的一步。做法借自社会科学的「质性研究」，一共四步：

1. **攒一批记录（traces）**：agent 真实跑过的对话、日志、改动和输出。还没有真实数据，就先造一批贴近真实的输入跑一遍。
2. **开放编码（open coding）**：你本人一条一条地读，像写日记一样用自己的话记下「这里不对」。一开始不要套分类。建议先自己标至少 30 条，然后才看 agent 给的建议。每条先只记**第一个出错的地方**，因为前面错了，后面常常跟着错。
3. **轴向编码（axial coding）**：把这些零散笔记归成几类，形成一张「失败分类表」，然后**数每一类各有多少条**。Hamel 说这一步最重要，可以让 LLM 帮忙归类。
4. **反复迭代，直到「饱和」**：让 agent 去剩下的记录里找你描述过的那几类问题，你来判断它找得对不对。一直做到再读新记录也发现不了新的失败类型为止，这叫 theoretical saturation（理论饱和）。他们的经验是，大约 100 条多样的记录就够用了。

**解决什么问题**：
- 不做这一步，人们通常会直接套用「有用性、准确性、简洁性」这类通用指标。这些指标量不出**你这个应用**特有的毛病，分数好看，却没有用。
- 它告诉你**先修哪个**。分类表计完数，最多的那一类就是最该写检查的。
- 它也是写裁判的前提。11-15 讲的「LLM 当裁判」，需要拿人工标注去校准，这批标注就从错误分析里来。

**和你已会的东西的关系**：
- 11-15「LLM-as-judge」、11-22「成对比较」讲的是**怎么检查**；错误分析决定**检查什么**，排在它们前面。
- 11-01「爬坡迭代」：先用错误分析找到失败类别，再针对这一类改 prompt 或 skill，改完重新计数，看它有没有变少。
- 今天第 2 条：Hamel 批评 Anthropic 的自动 eval 插件，第一条理由就是它「还没看数据，就催你选一个失败去写 eval」，等于跳过了错误分析。
- 对你写 skill 也一样：判断 skill 好不好用，不要先写评分标准。先让它跑 20–30 次，把输出读一遍。

**入门原文**：[Q: Why is "error analysis" so important in AI evals, and how is it performed?](https://hamel.dev/blog/posts/evals-faq/why-is-error-analysis-so-important-in-llm-evals-and-how-is-it-performed.html)（Hamel Husain、Shreya Shankar，2025-06-27 首发，2026-09-01 更新）。篇幅很短，几分钟就能读完。

**上手 prompt**：
```
目标：陪我给一个 prompt、skill 或 agent 工作流做一次「错误分析」（Hamel Husain 的方法：开放编码 → 轴向编码 → 计数），找出它最常见的几类失败，作为以后写 eval 的依据。全程用简体中文，用大白话。

1. 先问我分析哪个对象（文件路径或直接贴给你），以及它平时处理什么样的输入。读完后用 3 行说明它的用途。
2. 攒记录：优先用真实记录（问我有没有现成的日志、会话导出或输出文件）。没有的话，写 25 个贴近真实的输入（覆盖常见情况和 5 个左右的边界情况），先给我确认，再逐个运行（能用无头模式就用，例如 claude -p 或 codex exec，先确认本机实际可用的命令）。输入和输出原样保存到一个临时目录，不要放进我的项目仓库。
3. 开放编码由我来做：做一个最简单的本地标注页面（一个静态 HTML 文件即可，左边显示输入，右边显示输出，下面有一个备注框和「通过/不通过」按钮，结果存成 JSON）。不要在聊天里贴长文本让我读。打开页面前告诉我文件路径。
4. 我标完至少 20 条后，你读我的备注，提出 3–7 个失败类别（轴向编码）。每个类别给一句定义，并附上我标过的 2 条例子的编号。由我确认、合并或改名。
5. 用确认后的类别去检查我还没标的记录，每条给出类别和理由。拿不准的标「待人工确认」，不要硬分。
6. 输出：一张表（类别、定义、条数、占比、代表例子的编号），按条数从多到少排；再写清排第一的那一类最可能的原因（有证据才写，没证据写「猜测」）。
7. 验收：每个数字都能对应到保存下来的记录文件和我的标注 JSON；交出临时目录路径；不修改被分析的 prompt/skill 本身，只给改进建议。

参考：https://hamel.dev/blog/posts/evals-faq/why-is-error-analysis-so-important-in-llm-evals-and-how-is-it-performed.html
```

---

## 本期条目

### 1. 「给代码库除草」：让 agent 翻 git 历史、修 bug 的提交和 review 评论，找出人和 agent 反复犯的错，然后把每一种都改成「犯不了」

- **要点**：Ray Fernando 11-22 03:22（Asia/Kuala_Lumpur）分享了自己的「pstack 狠招 prompt」，抓取时有 **4052 次收藏**，大意是：

  > Use /poteto-mode on this repo. First, find the mistakes agents and humans keep repeating here: read the git log, past bug fixes and review comments. Then make each one impossible instead.

  （用 /poteto-mode 处理这个仓库。先找出 agent 和人在这里反复犯的错：读 git log、过去修 bug 的提交和 review 评论。然后把每一种错都变成「不可能犯」。）
- pstack 作者 poteto 11-22 23:28（Asia/Kuala_Lumpur）转发了这条，配文「今天适合给代码库除除草」，又有 1445 次收藏。
- 这个 prompt 背后是 pstack 里的一条原则 **Encode Lessons in Structure（把教训写进结构）**：发现自己第二次写同一条指令时，就该把它做成 lint、元数据标记、运行时检查或脚本，而不是再多写一段文字。原文的推论是：「能用结构修的，就只用结构修，那条指令只是症状。」实在需要人判断、没法自动化的，就把指令放到更显眼的位置，并附上一个出错的例子。
- 和往期的区别：11-19 的 /correct 是**每被纠正一次**就补一条检查；11-21 的「棘轮」是让违规数只减不增。今天这条是**一次性回头翻历史**，把已经重复发生过的错找出来集中处理。评论区有人说得很直接：「同一个 bug 第二次回来，就说明少了一个测试，把它变成会让构建失败的检查。」
- 不装 pstack 也能用，下面的 prompt 把这个思路改写成了通用版本。

```
目标：从这个仓库的历史里找出「人和 agent 反复犯的错」，并把其中最值得做的几种改成机器能自动拦住的检查（lint 规则、类型约束、测试、脚本或 CI 步骤），而不是在文档里多写一句「注意」。先只读分析，等我确认后再改代码。

1. 先读 README、AGENTS.md/CLAUDE.md、package.json/Makefile/CI 配置等实际存在的文件，弄清这个仓库的 lint、类型检查和测试命令，并实际跑一次，记下当前基线（通过/失败数、耗时）。
2. 挖历史（只读）：
   a. git log 最近 6 个月里，提交信息含 fix/bug/revert/hotfix 的提交，看它们改了什么；
   b. 如果装了 gh CLI 并已登录，读最近 30 个已合并 PR 的 review 评论（只读）；没有就跳过并注明；
   c. AGENTS.md/CLAUDE.md 等指令文件里「不要…」「必须…」「注意…」这类规则。
3. 归类：把找到的问题归成「同一种错」，只保留出现 2 次及以上的。每一种列出：一句话描述、出现次数、证据（提交号、PR 编号或文件行号）。
4. 对每一种错给出「怎么让它犯不了」的方案，按这个顺序优先选择：类型约束 > lint 规则 > 测试 > 脚本或 CI 检查 > 实在不行才改文档（改文档要附一个出错的例子）。写清楚预计改动量，以及这条检查在当前代码上会不会立刻报错（会的话报多少处）。
5. 停下来，把清单给我挑。我选中的条目，在新分支上逐个实现。每加一条检查，都要先证明它真能拦住错误：临时制造一次这种错误，展示检查失败的输出，再撤掉；然后展示在当前代码上通过（或者给出存量违规的处理方案）。
6. 如果某条规则已经被结构化检查覆盖，就在 AGENTS.md/CLAUDE.md 里删掉那条重复的文字规则，或者改成一句话指向这个检查，并在报告里列出删改前后的对比。
7. 验收：附上第 1 步和最后的 lint、类型检查和测试结果对比；每条新检查都有「拦住」和「放行」两段命令输出；只在新分支上改动，不 push，不改 CI 的密钥和部署配置。

思路来源：Ray Fernando 分享的 pstack prompt https://x.com/RayFernando1337/status/2124222002076733869 ；pstack 原则 Encode Lessons in Structure https://github.com/cursor/plugins/blob/main/pstack/skills/principle-encode-lessons-in-structure/SKILL.md
```

来源：[Sharing my pstack NSWF prompt](https://x.com/RayFernando1337/status/2124222002076733869)（Ray Fernando，2026-11-22 03:22 Asia/Kuala_Lumpur）；[it's a good day to do some gardening of your codebase!](https://x.com/poteto/status/2124525336994177412)（poteto，2026-11-22 23:28 Asia/Kuala_Lumpur）；[principle-encode-lessons-in-structure/SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-encode-lessons-in-structure/SKILL.md)、[poteto-mode/SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/SKILL.md)（poteto）

---

### 2. 补课 · Hamel 试用 Anthropic 自动 eval 插件：能发现问题，但它催你在看数据之前就选题，一个裁判同时管 4 件事，讲解也看不懂。他的结论是「没把看数据放在中心的 eval 工具，不值得用」

- **要点**：Anthropic 在官方 `claude-api` 插件里加了 `build_eval` 和 `hill-climb` 两个命令，帮你搭 eval、检查评分器，再围绕 eval 迭代改进你的应用（11-01 讲「爬坡迭代」时介绍过 Anthropic 那篇方法文章）。Hamel Husain 和 Isaac Flath 拿一个公寓租赁客服助手的对话记录直播试用，写了这篇评测。
- **问题**：
  1. **还没看数据就催你选题**：Claude 先列出几种可能的失败，让你马上挑一个做 eval。可他们自己还没读过对话，根本判断不了这是不是真问题、值不值得先做。Hamel 的观点是：agent 可以帮你找问题，但决定先管哪种失败，必须先做错误分析（今日概念）。
  2. **让人确认判断，却不给足够的上下文**：Claude 让他们去编辑器里读 `inputs.md` 里的长对话，再回到聊天框里告诉它哪些标签错了。Hamel 觉得这很荒唐，既然用的是 coding agent，就应该让它**直接做一个标注网页**。他们最后确实让 Claude 做了一个。
  3. **一个评估器管得太多**：一个「转接电话」评估器同时检查 4 种失败（1 种用 LLM 裁判，3 种用代码判断），四项全过才算通过。Hamel 建议一个评估器只管一种错误，至少要把「代码能判的」和「需要 LLM 裁判的」分开。另外它对评估器的解释写得像 AI 套话，他宁愿直接看代码或裁判 prompt：**评估器的 prompt 一定要亲自读一遍**。
- **优点**：开箱就能发现别的自动 eval 方案找不到的问题（人工转接、格式、语音场景等），是他见过「一次性找问题」效果最好的。
- **结论**：暂时不用，以后可以再看看（插件作者已经接受反馈，说会改）。他目前更推荐自己和 Shreya 做的 [Evals Skills](https://hamel.dev/blog/posts/evals-skills/)（11-02 介绍过）。下面的 prompt 把他的三条批评变成了一份「验货清单」，可以用来检查任何 agent 帮你生成的 eval 或评估器。

```
目标：检查一个由 AI 工具或 agent 生成的 eval/评估器（评分脚本、LLM 裁判 prompt、测试用例集都算）是否靠谱，按 Hamel Husain 的三条批评逐项验货。只读，不修改评估器本身，最后给我改进建议。

1. 先问我评估器在哪里（文件路径），以及它评的是哪个应用或 prompt、手上有没有真实的输入输出记录。把评估器的完整代码或裁判 prompt 原文展示给我，不要只给概括。
2. 验货项 A「是不是先看了数据」：这个评估器针对的失败，有没有证据表明在真实记录里真的出现过？去记录里找出至少 3 条实际出现这种失败的例子（给出文件和位置）。找不到就标「未经数据证实」。
3. 验货项 B「范围是否单一」：列出它实际在检查的每一个判断点。超过 1 个的，建议怎么拆，并把每个判断点归为「代码就能判（正则、结构、调用顺序等）」或「需要 LLM 裁判」。
4. 验货项 C「人能不能看懂、能不能校准」：
   a. 用 3–5 行大白话重写它的通过/不通过规则，不许用它原来的术语；
   b. 从记录里抽 10 条，让评估器跑出结果，再做一个简单的本地网页（静态 HTML 即可，显示输入、输出、评估结果，可以填「我同意/不同意」），让我逐条确认；
   c. 根据我的确认结果，算出它和我的一致率，以及它漏判、错判各几条。
5. 输出：A/B/C 三项各给「合格 / 需改 / 不合格」并附证据；一份拆分和改写建议（裁判 prompt 给出改后的全文，代码检查给出伪代码）；说明哪些结论因为样本太少还不可靠。
6. 验收：所有引用都能对应到具体文件和行号；第 4 步的网页路径和我的确认结果 JSON 都要交出来；全程不改评估器和被评的应用代码。

参考：Hamel Husain《Claude's new auto eval tool》https://hamel.dev/blog/posts/claude-auto-evals/
```

来源：[Claude's new auto eval tool](https://hamel.dev/blog/posts/claude-auto-evals/)（Hamel Husain，2026-09-30）

---

### 3. 补课 · 《Learn Harness Engineering》：2.5 万星、有简体中文版的「harness 工程」项目制课程（14 讲 + 8 个项目）。最实用的是它的「最小 harness 四件套」：AGENTS.md + init.sh + feature_list.json + 进度日志

- **要点**：walkinglabs 的开源课程，教你搭建让 coding agent 可靠干活的「环境、状态管理、验证和控制机制」（11-10 讲过「agent harness」这个概念）。抓取时约 25,900 星，2026-03 创建，11-21 还在更新，提供简体中文等 15 种语言。每一讲回答一个具体问题，对初学者很友好，例如：
  - L04「为什么一个巨大的指令文件会失败？」→ 渐进式披露：给 agent 一张地图，而不是一本百科全书；
  - L06「为什么初始化需要单独的阶段？」→ agent 开工前先验证环境是健康的；
  - L07「为什么 agent 会越界又做不完？」→ 一次只做一个功能，写清楚什么算完成；
  - L09「为什么 agent 过早宣布完成？」→ 有信心不等于做对了；
  - L12「为什么每次会话都必须留下干净的状态？」→ 下一次会话能不能顺利，取决于这一次收没收好尾；
  - 后面新增的 L13 循环工程、L14 图工程，以及对 Claude Code、Codex、Pi、DeepSeek 四家 harness 设计的拆解。
- 8 个项目都围绕同一个 Electron 知识库应用展开，每个项目都会比较「弱 harness」和「强 harness」跑同一个任务的效果。
- **快速开始**部分说，不用读完 14 讲，先在仓库根目录放四个文件：`AGENTS.md`（操作手册）、`init.sh`（安装 + 验证 + 启动）、`feature_list.json`（有哪些功能、哪些做完了）、`claude-progress.md`（每次会话做了什么）。这和 Anthropic《Effective harnesses for long-running agents》里的做法一脉相承，课程仓库里也有一个 `skills/harness-creator/` 可以帮你生成。
- 对你：可以把它当作 CS146S 之外的第二条自学路线，中文版直接读。下面的 prompt 不一次性全装，只做第一个最有用的件：**init.sh 式的「一键体检」**。

```
目标：参考《Learn Harness Engineering》第 6 讲「初始化需要单独的阶段」，给当前仓库做一个「一键体检」脚本，让任何 agent 开工前跑一下，就知道环境是否健康、基线测试是否通过。在新分支上做，不 push。

1. 先读 README、AGENTS.md/CLAUDE.md、package.json/Makefile/CI 配置等实际存在的文件，列出这个仓库真正使用的：依赖安装命令、lint、类型检查、单元测试、（如果有）构建命令，以及运行时需要的环境变量名（只列变量名，不要读取或打印任何值）。每个命令都注明出处（文件和行号）。
2. 在新分支上写一个脚本（文件名和语言跟随仓库已有习惯，例如 scripts/ 下的 shell 脚本；仓库已有类似脚本就改进它，不要另起一个），要求：
   a. 检查运行时版本是否符合仓库要求（例如 .nvmrc、engines、.tool-versions 等实际存在的文件）；
   b. 检查必需的环境变量是否已设置，只报「已设置/缺失」，绝不打印值；
   c. 按顺序跑 lint → 类型检查 → 单元测试，每一步都打印通过/失败和耗时，任何一步失败就停下，并给出一行「下一步该看什么」的提示；
   d. 最后输出一行总结，退出码要正确（全部通过为 0）。
3. 实际运行两次：一次在当前环境；一次故意制造一个失败（例如临时取消一个必需环境变量，或临时引入一个类型错误），证明脚本会正确报错并返回非 0。然后恢复原状。
4. 在 AGENTS.md/CLAUDE.md 中加一句「开工前先运行 <脚本路径>，失败先修环境再写代码」。文件不存在就先问我放哪里。
5. 验收：贴出两次运行的完整输出和退出码；git diff 只包含这个脚本和那一句文档改动；脚本运行结束后工作区干净（git status 证明）。

参考：https://github.com/walkinglabs/learn-harness-engineering （中文：docs-readme/zh-CN/README.md；第 6 讲 docs/zh/lectures/lecture-06-why-initialization-needs-its-own-phase/）
```

来源：[walkinglabs/learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering)（walkinglabs）；[中文 README](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs-readme/zh-CN/README.md)；[课程网站](https://walkinglabs.github.io/learn-harness-engineering/)

---

### 4. HN · Dragos 往 AI 服务发了约 200 万条带「诱饵密钥」的 prompt：至少 3 家服务商被入侵，有的转售商能看到并留存客户 prompt，还有服务商没有遵守隐私设置。原文说「agent 能读到什么，就会发出去什么」

- **要点**：Dragos 首席研究官 HD Moore 团队从 2026 年 7 月到 11 月，向常用 AI 服务发了约 200 万条 prompt，每条都埋了独一无二的 URL 或 canary（金丝雀）凭证。canary 就是「诱饵」，正常系统永远不会去用它，一旦被用了，就说明有人看过这条 prompt。发现：
  1. **至少 3 家服务商被入侵**，最早可以追溯到 7 月中旬，3 家都是被告知后才知道。最大的一起偷走了几百个诱饵 AWS 密钥，有的密钥被发出几小时后就有人去试，随后被用来列 S3、翻 Secrets Manager、开 Bedrock、加自己的 IAM 用户，累计调用了上万次 AWS API。有些被偷的请求还标了「零数据保留（ZDR）」：攻击者已经进了门，隐私开关就挡不住了。
  2. **推理市场里的转售商**用平台自带的日志功能，就能查看并留存客户的 prompt，不需要任何漏洞。
  3. **隐私设置被无视**：例如发给美国服务商的 prompt 被传到了中国的 AI 机构，只用过一次的 URL 几个月后还有人访问。
- **建议**（原文最后一节）：能自托管最好；否则直接用一线服务商，少走中转；用路由服务时自己指定上游，并且验证隐私设置真的生效；**在 agent 和流水线发出去的上下文里放一个诱饵凭证，一旦被使用就当作安全事件处理**（Thinkst 的免费 Canarytoken 就能用）；能开「密钥过滤」就开。
- 对你：用 Claude Code 时，`.env`、本地配置里的密钥都可能被 agent 读进上下文，再发给模型服务。如果你或团队用了 API 中转或路由工具，经过的每一跳都能看到完整的 prompt。HN 上 101 分（11-22 13:11 Asia/Kuala_Lumpur 发布）。

```
目标：检查当前仓库和我的 coding agent 配置里，有哪些密钥可能被 agent 读进上下文并发给模型服务，然后给出收紧方案。只读检查，任何修改都先给我看再做。全程绝不打印任何密钥的值（只报文件路径、变量名、行号）。

1. 列出仓库里可能含密钥的文件：.env* 文件、各类本地配置、证书和密钥文件、CI 配置里的明文值。只报路径、变量名或键名，以及它们是否被 .gitignore 忽略、是否已经进了 git 历史（用 git log 按文件名查，不要输出文件内容）。
2. 检查 agent 能不能读到它们：读取本仓库的 agent 配置（例如 .claude/settings.json、.claude/settings.local.json、.codex/ 等实际存在的文件），说明当前有没有禁止读取 .env 这类文件的权限规则；如果没有，起草一份最小的拒绝规则，写法以官方文档为准，并附上你查的文档链接。
3. 检查请求发到哪里：在仓库配置和当前 shell 的环境变量名里（只看变量名，例如 *_BASE_URL、*_API_BASE），找出 agent 或应用是否把模型请求指向了非官方的中转或路由地址。只报变量名和它所在的文件，地址本身可以显示，密钥不能显示。
4. 给出建议清单，按风险排序：哪些密钥应该轮换（例如已经进过 git 历史的），哪些应该从 agent 可读范围里移除，是否建议在 agent 会读到的地方放一个诱饵凭证（canary）。诱饵凭证需要我自己去 canarytokens.org 生成，你只告诉我放在哪里，以及触发后该怎么处理。
5. 停下来等我确认，再在新分支上应用第 2 步的拒绝规则。应用后验证：让一个新的 agent 会话尝试读取 .env，展示它被拒绝的输出。
6. 验收：报告里不出现任何密钥值（结束前自己 grep 一遍报告确认）；每条结论都附文件路径或命令输出；只改 agent 权限配置这一个文件，不 push。

参考：Dragos《Three breaches, endless leaks: Your AI supply chain needs canaries》https://www.dragos.com/blog/ai-supply-chain-security-canary-tokens
```

来源：[Three breaches, endless leaks: Your AI supply chain needs canaries](https://www.dragos.com/blog/ai-supply-chain-security-canary-tokens)（HD Moore，Dragos，2026-11-19）；[HN 讨论](https://news.ycombinator.com/item?id=50596511)

---

## 扫描记录

- **GitHub**（带 token 调 API，按 stars 排序）：搜了 claude-code skills、agent skills（11-08 之后新建）、AGENTS.md、subagent（10-23 之后新建）、claude plugin、codex skills（11-01 之后新建）、mcp agent（11-08 之后新建），以及 claude code / agent skills（3000 星以上、11-20 之后有提交）、context engineering、evals agent、harness engineering（11-15 之后有提交）。近两周新建的高星仓库仍然以游戏、动画、营销、视频类 skill 为主，没收。高星但简报从没提过的：walkinglabs/learn-harness-engineering（约 2.6 万星，收入第 3 条）；thedotmack/claude-mem（约 11.9 万星，只在 11-17 补课里点过名，没展开）、farion1231/cc-switch（约 15.6 万星，多家 coding agent 的配置切换桌面工具）、Egonex-AI/Understand-Anything（约 9.4 万星，代码转知识图谱）、tt-a1i/archify（约 9.9 万星，生成架构图的 skill）、deusyu/harness-engineering（约 6300 星，harness 工程中文学习档案）、sybil-solutions/skill-distill（11-21 新建，约 450 星，把一次好的会话蒸馏成开源模型也能照做的 skill）、EL4CTEO/fast-anything（11-21 新建，约 1900 星，先 profile 再只重写慢的 5%），已列进 watchlist「待评估」。
- **官方插件市场**：claude-plugins-official 今天仍是 317 个，和 11-22 的快照比没有增删。最新提交是 11-21 09:17（Asia/Kuala_Lumpur，主题示例加音效），之前是 security-guidance 的几个修复和 aikido 的 bump。快照已存成 plugins-snapshot-2026-11-23.txt。openai/plugins 的 plugins/ 目录仍是 62 项，最新提交仍是 11-19 03:14（Asia/Kuala_Lumpur），之后没有新提交。
- **X**：扫了一线实践者 11-21 之后的帖子，又用中英文关键词各搜了一轮。收了 Ray Fernando 和 poteto 的「除草」prompt（第 1 条，评论区多是叫好和收藏，有一条有用的补充已写进条目）。看过没收：Matt Pocock 在构思 /the-perfect-typescript-codebase skill（385 次收藏，163 条评论；他说这个 skill 描述 lint 规则、CI 等，早期版本自用效果很好，但还没发布，而且绑定 TypeScript，等发布了再看）；Thorsten Ball「忘掉 4 个月前你以为重要的大部分上下文管理做法」（只有一句话，没有展开）；Geoffrey Huntley 关于「正确性/验证正当时」的帖子（只配了一张图）；@shantanugoel 的 Skillmeister（162 次收藏，用一个「路由 skill」代替注册几十个 skill，减少上下文污染，等有更多使用反馈再看）；Thariq、Simon Willison、Hamel 这两天的帖子（闲聊或模型新闻）。中文关键词的结果互动都很低，以课程搬运和营销为主。
- **HN**（近 4 天）：收了 Dragos 的诱饵密钥调查（第 4 条）。只看了标题、没收：OpenRouter「Data Processing Incidents on Inference Providers」（279 分，推理服务商数据处理事故公告，只看了标题）；「Show HN: I built a game where you are an LLM's subagent」（268 分，游戏）；「AI is giving everyone the same advice」（124 分）；「Agent swarm trying to solve P vs. NP」（100 分）；其余高分帖是 Anthropic 上市、能源、模型发布等新闻。cekrem、Frostbite、Signal 这几篇 11-21、11-22 已经看过。
- **博客**：hamel.dev 补课收了 claude-auto-evals（第 2 条），站上没有新文章。claude.dev 11-17 之后没有新文章。anthropic.com/engineering 最新仍是 11-06 的 agent 记忆那篇。Simon Willison 近两天转了 Graham Dumpleton 的 Muru 开发日记和《AI as a lifestyle choice》（AI 写了大部分代码，但判断什么还不够好仍然靠人），偏感想，没收。ampcode.com/news 的 11-21「Puck in the Car」是产品新闻。Prime Radiant 博客和 ghuntley.com 首页这次没抓到文章列表。

## 本期去重用源链接（机器可读）

- https://hamel.dev/blog/posts/evals-faq/why-is-error-analysis-so-important-in-llm-evals-and-how-is-it-performed.html
- https://x.com/RayFernando1337/status/2124222002076733869
- https://x.com/poteto/status/2124525336994177412
- https://github.com/cursor/plugins/blob/main/pstack/skills/principle-encode-lessons-in-structure/SKILL.md
- https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/SKILL.md
- https://hamel.dev/blog/posts/claude-auto-evals/
- https://github.com/walkinglabs/learn-harness-engineering
- https://www.dragos.com/blog/ai-supply-chain-security-canary-tokens
- https://news.ycombinator.com/item?id=50596511
- （看过未收）https://x.com/mattpocockuk/status/2124500662436151797 （/the-perfect-typescript-codebase，未发布）
- （看过未收）https://x.com/thorstenball/status/2124526763472494940
- （看过未收）https://x.com/shantanugoel/status/2123863545335218492 （Skillmeister）
- （看过未收）https://openrouter.ai/blog/announcements/data-processing-incidents-on-inference-providers/ （HN 279）
- （补课候选）https://github.com/shanraisshan/claude-code-best-practice 、https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering 、https://github.com/deusyu/harness-engineering 、https://github.com/sybil-solutions/skill-distill
