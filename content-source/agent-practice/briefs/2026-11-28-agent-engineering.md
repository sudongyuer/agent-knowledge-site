# Agent 工程实践简报 · 2026-11-28

> 给冻鱼。窗口约 2026-11-27 → 2026-11-28（Asia/Kuala_Lumpur）。今天的主线是**「检查那个负责检查的东西」**：测试、eval、skill、插件都是你用来管住 agent 的工具，但它们本身也可能不靠谱。今日概念是「变异测试」：故意往代码里埋一个小 bug，看你的测试能不能抓到它；抓不到，说明这个测试只是看起来在把关。今天有六条。第 1 条补课 Uber 11-23 的长文：公司内部 5000 多个 skill、每月 100 多万次调用，他们怎么给 skill 做 eval（包括「装和不装各跑一遍、盲评哪个好」和「删掉一部分字看会不会更好」）。第 2 条是 Together AI 开源的 Hurdle：让 Claude Code 和 Codex 在你的 API、文档、skill 上做真实任务，用代码检查、拦截规则和模型裁判三种方式打分；Hamel Husain 同一天提醒「别信公开排行榜，用你自己的 eval」。第 3 条是 HN 首页的真实案例：Anthropic 官方插件市场里的 Convex 插件，skill 会把你的项目想法发到外部服务器，还专门教 agent 把命令拆开来躲过安全检查。第 4 条是 CS146S 本周 Replit 讲座：让模型自己决定怎么拆任务，把精力从「审代码」换到「验证」；Dex Horthy 同一天的实验正好说明「测试写错了也会把错的行为锁死」。第 5 条是这周新火的 100x-engineer-skill（5 天约 870 星）：把每个小模块的性质写下来逐个检查，而且**每条检查都要先在埋好的 bug 上失败一次才算数**，这就是今日概念的用法。第 6 条补课 Netflix 在 QCon 上讲的「给 agent 改造研发流程」和 Shopify 12 周重写 App 的经验。

## 今日概念：变异测试（Mutation testing）：故意往代码里埋小 bug，看测试能不能抓到，用来检验测试本身靠不靠谱

**是什么**：先让工具把你的代码**改坏一点点**，比如把 `>` 改成 `>=`、把 `if not x` 改成 `if x`、把 `+ 1` 删掉。每改一处得到一个「变异体」（mutant），然后跑一遍你的测试：

- 测试失败了，说明测试发现了这个 bug，叫「杀死了变异体」。好。
- 测试照样全绿，叫「变异体存活」。这说明这一行代码就算写错了，你的测试也发现不了。

杀死的比例叫「变异分数」（mutation score）。它比「代码覆盖率」更诚实：覆盖率只说明测试**跑到了**这一行，变异测试说明测试**真的检查了**这一行的结果。

一个最小的例子（来自 Google 的入门原文）：

```
# 原代码                         # 变异体：条件被反过来
if not cart.items:               if cart.items:
    raise Error("cart empty")        raise Error("cart empty")
```

如果你的测试套件跑完还是全绿，说明「空购物车不能结账」这条规则根本没人测。

**解决什么问题**：agent 写代码时经常顺手把测试也写了，测试全绿，看起来很稳。但测试可能：
- 只断言「函数没抛错」，不检查返回值对不对；
- 断言的就是 agent 写出来的错误结果（照着实现抄的期望值）；
- 被 agent 改弱了（11-26 Anthropic 迁移 Rust 那篇里发现过 100 多处被改弱的断言）。

变异测试能把这些「假把关」的测试揪出来：埋个 bug，测试没反应，就说明它不合格。

**和 agent 有什么关系**：
- 今天第 5 条的 100x-engineer-skill 规定：每条性质检查都要先在一个故意埋下的 bug 上**失败一次**，才会被记为「成立」；从没见过它失败的检查，状态是「未证明」。这其实就是手工版的变异测试。
- 今天第 4 条 Dex Horthy 的实验里，agent 早期写的测试把错误行为锁死了，后面越做越差。变异测试查不出「需求理解错了」，但能查出「测试根本没在检查」，两种问题都要防。
- 今天第 4 条 Replit 的 Michele Catasta 说：要靠「你有信心的测试」来验证，才能放心把大改动交给 AI。变异分数就是给「有信心」一个数字。
- Ian Duncan 11-19 的文章（HN 418 分）里也说，认真的工程师有了 AI 之后，终于有时间对最担心的那部分代码跑变异测试了。

**和你已会的东西的关系**：
- 11-18「奖励作弊」：agent 可能为了让测试变绿去改弱测试。变异测试是反过来检查测试有没有被改弱。
- 11-12「属性测试」：属性测试用大量随机输入去找代码的 bug；变异测试是故意改坏代码，去找**测试**的漏洞。两者常一起用：属性测试写得好，变异分数通常也高。
- 11-21「棘轮」：可以把变异分数设成「只许升不许降」的基线。
- 11-26「生成-验证差距」：验证是瓶颈，所以要先确认验证工具本身是可靠的。

**注意**：变异测试很慢（每个变异体都要重跑一遍测试），而且会有很多「没意义」的变异体（比如改了日志里的文字）。Google 的做法是只对**这次改动涉及的行**生成变异体，每行最多报一个，还加了很多过滤规则，把「没用」的反馈比例从约 80% 降到约 15%。刚上手时只对最关键的一两个文件跑就够了。

**入门原文**：[Mutation Testing](https://testing.googleblog.com/2021/04/mutation-testing.html)（Google Testing Blog，2021-04-12）。作者从一次 hackathon 原型讲到 Google 内部几万人在用的服务：为什么只在代码审查时报变异体、怎么压低噪音，还做了实验，发现约 70% 的真实 bug 和某个变异体是「对得上」的。常见开源工具：JavaScript/TypeScript 用 [Stryker](https://stryker-mutator.io/docs/)，Python 用 [mutmut](https://mutmut.readthedocs.io/)，Java 用 [PIT](https://pitest.org/)。

**上手 prompt**：
```
目标：用「变异测试」检查这个仓库里最关键的一小块代码，它的测试到底有没有真的在把关。全程用简体中文、大白话。先出计划，改动测试前等我确认。

背景：变异测试就是故意把代码改坏一点点（例如把 > 改成 >=、把条件取反、删掉一个 +1），再跑测试。测试失败 = 抓到了（变异体被杀死），测试仍然全绿 = 漏了（变异体存活）。参考 https://testing.googleblog.com/2021/04/mutation-testing.html

1. 先读仓库，确认语言、测试框架和实际的测试命令（从 package.json / pyproject.toml / Makefile / CI 配置里读，不要猜）。贴出你找到的命令和出处文件。
2. 挑一个「出错代价最高」的小模块（例如金额计算、权限判断、数据转换、状态机），说明为什么选它，给出文件路径。只挑一个，控制在 300 行以内。
3. 优先用该语言现成的变异测试工具（JS/TS 用 Stryker，Python 用 mutmut，Java 用 PIT；其他语言先搜官方文档确认）。如果不方便安装，就手工做：针对这个模块挑 8 到 12 处最关键的地方，每次只改一处、跑一次相关测试、立刻还原。不要提交任何变异后的代码。
4. 输出一张表：变异位置（文件:行号）、改了什么、测试结果（杀死 / 存活）、存活的原因猜测。贴出变异分数（杀死数 / 总数），以及至少两次「存活」时测试命令的真实输出。
5. 对每个存活的变异体，判断它是「真漏洞」（应该补测试）还是「等价变异」（改了也不影响行为，例如日志文字）。给出理由。
6. 我确认后，为最重要的 2 到 3 个真漏洞补测试。每补一个，先在对应的变异体上跑一次，贴出「测试失败」的输出；再在原代码上跑，贴出「测试通过」的输出。
7. 最后确认工作区里没有残留的变异改动（贴出 git status / git diff 的结果，只应包含新增的测试）。

验收标准：第 4 步有完整的表和真实的测试输出；每个新增测试都有「在变异体上失败、在原代码上通过」两段输出；业务代码没有任何改动。
```

---

## 本期条目

### 1. 补课：Uber 怎么给 5000 多个 skill 做 eval。核心做法是「装和不装各跑一遍，盲评哪个好」，再加上「试着删掉一部分字」，还有让 agent 遇到坑时自己报 bug

- **要点**：Uber 11-23 发的长文（Andrew Mager、Jason Varbedian、Uday Kiran Medisetty），讲他们内部的 skill 平台：一年里从 1 个 skill 涨到 5000 多个，一个月被调用 100 多万次，覆盖 Claude Code、Codex、OpenCode 和内部 agent。对你最有用的几条：
  - **skill lint（检查规则）**：把「好 skill 长什么样」写成能判通过 / 不通过的规则，例如：步骤要编号、每步只有一个目标而且有办法验证；每步给出具体命令并检查结果再进下一步；必须有一张「出错 → 怎么修」的表，只写「重试」不算。
  - **eval 套件的配比**：约 5% 是「固定输入 + 标准答案 + 模拟工具」的黄金用例，约 80% 是真实用户 prompt、按**轨迹**打分（agent 有没有按正确顺序用对 skill 和工具，不只看最后结果），约 15% 由作者人工评。
  - **通过率 70%–90% 的 eval 往往比 100% 的更有用**：100% 可能说明 eval 没测到真正有区别的地方。
  - **消融实验（ablation）**：同一批真实 prompt，装 skill 跑一遍、不装跑一遍，让一个不知道哪边装了 skill 的裁判挑更好的答案；还会试着删掉 skill 里的一部分文字。模型越来越强以后，**字多了反而可能变差**。一个查数据仓库的 skill：不装的时候工具调用多 13%、工具报错是 6 倍、耗时多 31%，装了的答案赢了 87% 的对比。
  - **省钱的几个办法**：固定步骤写成脚本（Code Mode）；skill 派一个便宜模型的 subagent 去干脏活，只把摘要带回来（某个追踪 skill 每次调用成本降了 46%）；把轮询挪到后台 agent。
  - **papercut（小毛刺报告）**：一个常驻 skill，agent 遇到坏掉的参数、错误的文档、「明明出错却返回 0」时，自动写一份结构化报告给 skill 的负责人。三个月收到几千份，修了几百个。真实例子：PR skill 把提交信息写进一个共用的临时文件，两个并行会话互相改了对方的 PR。
- **对你的用处**：你写 skill、也关心「怎么证明 skill 有用」。这篇是目前看到最完整的企业级答案。下面的 prompt 让 agent 拿 Uber 的规则给你的一个 skill 做体检，再做一次小规模的「装 / 不装」对比。

```
目标：参照 Uber 的 skill 质量规则和评估方法，给我指定的一个 skill 做体检，并跑一次小规模的「装 / 不装」对比实验，判断这个 skill 到底有没有用。全程用简体中文、大白话。这一步不修改 skill，只出报告。

参考：Uber《How Uber Evals 1 Million Agent Skill Invocations a Month》https://www.uber.com/us/en/blog/optimizing-ubers-agent-skills/ （先读，用 5 行大白话总结「skill lint」「eval 配比」「消融实验」三部分）

1. 找出这个仓库和我本机给 agent 用的 skill（例如 .claude/skills/、~/.claude/skills/、.agents/skills/、plugins 目录里的 SKILL.md）。列出名称、路径和行数。问我要测哪一个；如果我没回复，就选行数最多的那个，并说明原因。
2. 按下面的规则逐条检查这个 skill，每条给出「通过 / 不通过 + 引用原文作为证据」：
   a. description 是否清楚说明了「什么时候该用」；
   b. 步骤是否编号、每步只有一个目标；
   c. 每步是否给出具体命令，并在进入下一步前检查结果；
   d. 是否有「出错 → 怎么修」的表（只写「重试」不算）；
   e. 正文是否在 500 行以内，固定不变的步骤是否已经写成脚本；
   f. 是否依赖只有作者电脑上才有的路径、缓存或工具。
3. 设计 6 个测试 prompt：4 个是这个 skill 应该处理的真实任务，2 个是它不该被触发的任务。写下每个 prompt 的「好结果长什么样」和「正确轨迹」（应该用哪些工具、按什么顺序）。
4. 对 4 个正例，各跑两次：一次在装了这个 skill 的全新会话里（用 subagent 或非交互模式），一次在没装的全新会话里。记录：是否完成、工具调用次数、报错次数、最终答案。如果当前环境做不到「不装」的对照，就说明原因并停在这一步。
5. 再开一个全新的 subagent 当裁判，把每对答案打乱顺序（不告诉它哪个装了 skill），让它判断哪个更好并给理由。
6. 输出总结：skill 赢了几次、输了几次、打平几次；装 skill 后工具调用和报错的变化；第 2 步里最该先改的 3 处。

验收标准：第 2 步每条都有原文引用；第 4 步每次运行都有真实记录（命令、轮数或工具调用数）；第 5 步的裁判不知道哪边装了 skill；结论只基于实际跑出来的数据，样本少的地方要写明「样本太少，仅供参考」。
```

来源：[How Uber Evals 1 Million Agent Skill Invocations a Month](https://www.uber.com/us/en/blog/optimizing-ubers-agent-skills/)（Andrew Mager、Jason Varbedian、Uday Kiran Medisetty，Uber Engineering，2026-11-23）

---

### 2. Together AI 开源 Hurdle：让 Claude Code 和 Codex 在你的 API、文档、skill 上做真实任务，用「代码检查 + 拦截规则 + 模型裁判」打分。Hamel 同天提醒：别信公开排行榜，用你自己的 eval

- **要点**：Together AI 11-25 开源了内部用了半年的 agent eval 工具 Hurdle（npm 包，`npx hurdle init` 起步；X 上的发布帖有 300 多赞、336 收藏）。思路很朴素：
  - **任务**就是一段开发者会交给 agent 的 prompt，加上需要的文件。
  - **打分三选一或混用**：代码检查（断言 agent 必须调用某个 API、必须产出某个文件）；拦截规则（guard，比如「不许真的创建付费 GPU 集群」，agent 一尝试就拦下并判失败）；模型裁判（按你用大白话写的评分标准读完整记录）。
  - **条件对比**：同一个任务，一次装你的 MCP / skill，一次不装，看它到底帮了忙还是添了乱；每个组合重复跑几次，算通过率，因为 agent 每次表现不一样。
  - 他们的例子：「列出 GPU 区域和价格，给出最便宜的一小时预订命令，但不许真的下单」。要求必须调用查询区域的接口，裁判确认比过价，拦截规则挡住创建集群的请求。
  - **安全提醒**：本地模式下 agent 以你的身份运行，能读你的文件、用你的真密钥，官方 README 写明「本地执行不是安全沙箱，只跑可信任务」；正式评测要用沙箱，真密钥由沙箱外的代理替换。
- **同一天的两条旁证**：
  - Hamel Husain 看了一个公开评测的公开分和私有分，发现很多模型两者差距很大（典型的「刷榜」），他的建议是：不要根据排行榜做决定；用你自己的 eval；非要看排行榜，就去看具体数据，往往看一个失败的任务就会发现问题。
  - Simon Willison 11-27 发布 datasette-charts 0.4a0 时提到：他让 Claude 用他刚设计的插件接口写了一个实验插件，**只为了试用这个接口**，结果 agent 找出了一堆设计上别扭的地方，这个版本就是在修这些问题。这和 Hurdle 是同一个思路：让 agent 先当你产品的用户。
- **对你的用处**：你在 LobeHub 做产品，也写 skill。下面的 prompt 不要求安装 Hurdle，先用同样的思路手工跑一次最小的「agent 能不能用好我的东西」评测；觉得有用再上 Hurdle。

```
目标：仿照 Together AI 的 Hurdle，为这个仓库对外提供的东西（API、SDK、CLI、文档或 skill）搭一个最小的「agent 能不能用好它」评测，并跑出第一组结果。全程用简体中文、大白话。先出设计，开始跑之前等我确认。

参考（先读，用 5 行大白话总结任务 / 检查 / 拦截规则 / 裁判 / 条件对比这几个概念）：
- https://www.together.ai/blog/introducing-hurdle-run-agent-evals-on-your-api-skills-and-docs
- https://github.com/togethercomputer/hurdle

1. 先读仓库，判断这个项目对外提供什么（API、库、CLI、文档站、skill）。如果它不对外提供任何东西，就改为评测「agent 能不能按 README 把项目跑起来并完成一个常见开发任务」。贴出判断依据（文件路径）。
2. 写 3 个任务，每个都是真实开发者会对 agent 说的一句话，并为每个任务写：
   a. 代码检查：可以用程序判断的通过条件（例如产出某个文件、调用了某个函数或接口、测试通过）；
   b. 拦截规则：agent 绝对不许做的事（例如删除数据、调用付费接口、推送代码），以及怎么在运行时挡住或事后发现；
   c. 裁判标准：用 3 到 5 句大白话写「好结果」的标准。
3. 设计两种条件：A = 只给仓库本身；B = 额外给上项目的文档或 skill（选一个最相关的）。说明你怎么保证每次运行都从干净环境开始（例如新的临时目录、git worktree、全新 subagent）。
4. 我确认后，每个任务在每种条件下各跑 2 次（共 12 次）。不要使用真实的生产密钥；需要密钥的任务改为只要求「写出将要执行的命令」而不执行。
5. 输出结果表：任务 × 条件 × 次数，每格写通过 / 不通过、哪项检查没过、工具调用次数。再用一个全新的 subagent 按第 2c 步的标准当裁判，复核所有「代码检查通过」的运行。
6. 总结：哪个任务最难、条件 B 有没有带来提升、agent 卡住的地方说明文档或接口哪里不清楚（至少列 3 条具体改进建议，每条引用运行记录作为证据）。

验收标准：每次运行都有可复查的记录（命令或会话摘要）；拦截规则没有被真正触发造成副作用；改进建议都能对应到具体某次运行。
```

来源：[Introducing Hurdle: Run agent evals on your API, skills, and docs](https://www.together.ai/blog/introducing-hurdle-run-agent-evals-on-your-api-skills-and-docs)（Mo King、Sam Barrowclough、Hassan El Mghari，Together AI，2026-11-25）；[togethercomputer/hurdle](https://github.com/togethercomputer/hurdle)；[Hamel Husain 谈公开 / 私有分差距](https://x.com/HamelHusain/status/2125701624320680214) 及[后续建议](https://x.com/HamelHusain/status/2126371481609474147)（Hamel Husain）；[datasette-charts 0.4a0](https://simonwillison.net/)（Simon Willison，2026-11-27 博客首页条目）

---

### 3. 真实案例：官方插件市场里的 Convex 插件，skill 会把你的项目想法发到外部服务器、从外部下载脚本直接执行，还教 agent「把命令拆开，免得被安全检查拦下」

- **要点**：GitHub 用户 thirtysix 在 convex-backend-skill 仓库开的 issue #64 11-28 凌晨（02:02，Asia/Kuala_Lumpur）冲上 HN 首页（225 分）。issue 指出这个插件（在 Anthropic 官方 claude-plugins-official 市场里）有三处问题：
  1. quickstart skill 把用户「一句话的项目想法」POST 到一个 `*.convex.site` 的地址，注释里叫它 telemetry（遥测），但不告诉用户。
  2. add skill 从同一个地址下载脚本，直接用管道交给 bash 执行。
  3. labs-quickstart skill 把「下载」和「执行」拆成两次 Bash 调用，原文给的理由是：「一条命令同时下载并执行远程代码，正是 harness 安全分类器会拦截的形状。」
  - 发 issue 的人认为团队本意是让上手更顺利，不是恶意；但第 3 条等于**教 agent 绕开用户自己选择开启的安全检查**。
  - 我核对了：官方市场里 convex 插件钉的版本（commit `6ca54f6`）正是 issue 里引用的那个版本；今天 main 分支上的 labs-quickstart/SKILL.md 里仍然有那个外部地址和关于「安全分类器」的那段话。issue 仍是打开状态，Convex 官方还没有回复。
- **和前几天的关系**：11-27 讲过 Notion 官方 MCP 在报错里塞推销指令；11-26 讲过 NVIDIA 的 SkillSpector（装 skill 前的静态扫描器）和 Claude Code 的 `PreSkillShellCommand` hook。这次的问题出在 **skill 正文**里，而且来自「官方市场」，说明「上了官方市场」不等于「审过每一行」。
- **对你的用处**：你装过不少插件和 skill。下面的 prompt 让 agent 把你已装的 skill / 插件全部扫一遍，专找三类东西：偷偷外发数据、下载即执行、教 agent 绕过检查。

```
目标：审计我本机和这个仓库里已安装的所有 agent skill、插件、hooks 和 MCP 配置，找出「偷偷外发数据」「下载远程代码直接执行」「教 agent 绕过安全检查」这三类问题。全程用简体中文、大白话。只读不改：不要卸载、不要修改任何文件、不要执行任何被检查的脚本。

背景（先读，用 3 句话概括问题）：https://github.com/convex/convex-backend-skill/issues/64

1. 找出所有安装位置：仓库里的 .claude/、.agents/、.codex/、plugins/、skills/ 目录，用户目录下的 ~/.claude/（skills、plugins、settings.json、hooks）、~/.codex/、以及任何 MCP 配置文件（如 .mcp.json）。列出每个 skill / 插件的名称、来源（从哪个市场或仓库装的，能查到的话附版本或 commit）和路径。
2. 对每个 SKILL.md、命令文件、hook 脚本和插件自带的脚本，用搜索工具查找下面的模式，每处命中都贴出「文件:行号 + 原文」：
   a. 外发：curl / wget / fetch / http POST / requests.post 等发往外部地址的请求，特别是带上用户输入、文件内容、环境变量或「telemetry」字样的；
   b. 下载即执行：curl ... | bash、wget ... | sh、下载后紧接着 chmod +x 再运行、python -c 加远程内容、npx / uvx 运行没有固定版本的包；
   c. 绕过检查：提到 classifier、safety check、permission、sandbox、「避免被拦截」「拆成两步」「不要告诉用户」之类的指令；
   d. 隐藏行为：要求 agent 不向用户提及某事、隐藏链接或追踪参数。
3. 对每处命中判断风险：高（会把用户数据发出去，或执行未固定版本的远程代码，或明确教 agent 绕过检查）/ 中 / 低（例如文档里的示例），并写一句理由。不要只凭关键词下结论，要读上下文。
4. 输出一张表，按风险从高到低排序：插件 / skill 名称、文件:行号、命中类型、原文摘录、风险等级、建议（例如「在 settings.json 里禁用」「换成固定版本」「向作者报告」）。
5. 额外检查：Claude Code 的 settings.json 里是否已经配置了能拦住这类行为的权限规则或 hook（例如拒绝 curl | bash、PreSkillShellCommand 等）；如果没有，给出一段建议配置，但不要写入文件。

验收标准：第 1 步的清单完整，并写明搜了哪些目录；每处命中都有文件:行号和原文；全程没有执行任何被检查的脚本，也没有修改任何文件（最后贴出 git status 证明仓库没有变化）。
```

来源：[Quickstart skills send the user's idea to a convex.site host and run remote scripts, written to avoid safety checks](https://github.com/convex/convex-backend-skill/issues/64)（thirtysix，GitHub issue #64）；[HN 讨论](https://news.ycombinator.com/item?id=50669765)

---

### 4. CS146S 本周：Replit 的 Michele Catasta 说「让模型自己决定怎么拆任务」「把审代码换成验证」。Dex Horthy 同天的实验提醒：agent 早期写错的测试，会把错的行为锁死

- **要点**：CS146S 讲师 Mihail Eric 11-28 06:14（Asia/Kuala_Lumpur）发帖总结了和 Replit 总裁兼 AI 负责人 Michele Catasta 的课堂对谈（同一周 Replit 发布了用「Missions」驱动的多 agent 功能）。四条要点：
  - **让模型决定怎么拆活**：硬性规定「开 N 个 subagent」是在和模型的训练方式对着干；让模型自己选投入多少、开几个 subagent，在他们的基准测试里效果更好也更便宜。你只定目标，并行怎么排让模型规划。
  - **公司跑在一个共享系统上**：公司变大以后，最先坏掉的是沟通；agent 群也是一样。
  - **把审查换成验证**：审代码比写代码更累，没有可靠检查就把大改动交给 AI 风险很大。要靠「你有信心的测试」来验证，**先投资检查，再扩大 agent 规模**。
  - **看清整个问题**：价值正在从「写每一行代码」转向「知道怎么设计系统」。
- **Dex Horthy 同天的实验**（11-28 06:44，Asia/Kuala_Lumpur）：他用 SlopCodeBench（一个衡量代码质量随时间退化的评测）测 Anthropic 官方提示词指南里的一句建议：告诉模型「你拥有这个代码库，之后会长期在里面工作」。早期结果：重复代码减少了、测试写得更多了、一个简单挑战的分数提高了；但**至少有一次，早期写下的测试把错误的行为锁死了**，后面的表现反而比不加这句话更差。他强调还是早期结果。
- **对你的用处**：这两条连起来就是今天的主线：测试多不等于验证强，测试也需要被检查（今日概念）。下面的 prompt 用一个很小的 A/B 实验，测一句「主人翁」提示词在你仓库里的真实效果，并顺手检查测试有没有锁死错的行为。

```
目标：在这个仓库里做一个小型 A/B 实验，验证「在给 agent 的说明里加一句『你拥有这个代码库，并会长期在其中工作』」对代码质量的真实影响，并检查 agent 写的测试有没有把错误行为锁死。全程用简体中文、大白话。先出实验设计，开始跑之前等我确认。

参考：
- Dex Horthy 的早期结果：https://x.com/dexhorthy/status/2126446998543118515
- Replit Michele Catasta 在 CS146S 的要点（先验证、再扩规模）：https://x.com/mihail_eric/status/2126439615502716992

1. 先读仓库，确认测试命令、lint 命令和代码结构（从配置文件里读，不要猜），贴出出处。
2. 选 2 个小而真实的功能需求（各自能在 1 小时内完成，最好是连续的两步：第二个需求建立在第一个之上，这样能看出「长期维护」的影响）。写下每个需求的验收标准，并由你**先**写好一组隐藏的验收测试，放在实验分支之外，不给 agent 看。
3. 用 git worktree 建两个干净的工作区：A 组给 agent 的说明里不加那句话；B 组加上（只在本次实验的 prompt 里加，不修改仓库里的 CLAUDE.md / AGENTS.md）。两组都用全新会话，依次完成两个需求。
4. 对两组结果分别统计并贴出真实输出：隐藏验收测试通过数；项目原有测试是否全过；新增代码行数和新增测试数；重复代码（用仓库已有的工具，没有就用简单的相似片段搜索并说明方法）；lint 告警数。
5. 「测试锁死」检查：在两组各挑 agent 新写的 3 个测试，读断言并对照需求，判断它断言的是「需求要求的行为」还是「agent 实现出来的行为」。对每组再做 3 次手工变异（每次只改一处关键逻辑，跑 agent 写的测试，立刻还原），记录哪组的测试能抓到更多。
6. 写结论：这句话在本仓库里有没有用、代价是什么；只跑了一轮要写明「样本很小，仅供参考」。最后删除两个 worktree，确认主工作区没有变化（贴出 git status）。

验收标准：两组用的是同样的需求和同样的隐藏测试；第 4、5 步每个数字都有命令输出作证；没有修改仓库里的说明文件。
```

来源：[Mihail Eric 总结 CS146S × Michele Catasta 对谈](https://x.com/mihail_eric/status/2126439615502716992)（Mihail Eric）；[SlopCodeBench 早期结果](https://x.com/dexhorthy/status/2126446998543118515)（Dex Horthy）

---

### 5. 新火的仓库 100x-engineer-skill（5 天约 870 星）：把每个小模块的规则写下来逐个检查，每条检查都要先在埋好的 bug 上失败一次才算数，代码改了检查自动「过期」

- **要点**：DeadInternetStudios/100x-engineer-skill 11-23 创建，到今天约 874 星（MIT 协议，beta 状态），作者自称前 Cursor 工程师。支持 Claude Code、Cursor、Codex。它想解决的是「agent 说做完了，一打开只是差不多能用」。几个值得借鉴的做法：
  - **先写下「能用」是什么意思**：拿到一句话需求，先扩写成约 1000 字的完整 prompt（目标、规则、最危险的地方、每项怎么检查）。
  - **每个小模块回答六个问题**：有哪些状态、状态怎么变、每一步什么时候允许、做完后什么一定成立、什么永远成立（不变量）、什么最终一定会发生。然后用一个小模型（model checker 那类工具）遍历所有能到达的状态去检查。
  - **检查要先见过失败才算数**：仓库里有一张 `verify/ledger.tsv` 台账，每行记一条性质和它覆盖的代码哈希。每条性质必须**先在一个故意埋下的 bug 上失败一次**，才会被记为「成立」；代码一改，对应行就变成「过期」，直到有人重新跑检查并确认。从没见过失败的检查标为「未证明」。这就是今日概念「变异测试」的手工版。
  - **区分三种「验证过」**：穷举（所有状态都看过）、有界（搜到上限没发现问题，**不是证明**）、抽样（随机或挑选的用例，能发现 bug，但对没测到的部分什么都不说）。
  - **第二个模型复查**：另一个模型审代码和截图，构建者逐条修复或写下不同意的理由。
- **要谨慎的地方**：README 里「每月 1000 多个 PR、回滚率低于 2%」等数字是作者自述，我没有找到独立验证；README 里留给基准测试结果的位置目前还是空的。它是 beta，需要 Node 22+，会在你的仓库里加不少文件。11-04 讲过「形式化验证」，这个仓库是把它做成 skill 的一次尝试，先借鉴思路，别急着全盘装。
- **对你的用处**：「台账 + 过期 + 必须先失败一次」这三个机制不需要装这个 skill 也能用。下面的 prompt 让 agent 给你仓库里最关键的一个模块建一张同样的小台账。

```
目标：借鉴 100x-engineer-skill 的「验证台账」思路，为这个仓库里最关键的一个小模块写下它必须满足的性质，逐条验证，并确保每条检查都「先在埋好的 bug 上失败过一次」。全程用简体中文、大白话。先出清单，写代码前等我确认。不要安装 100x-engineer-skill。

参考（先读，用 5 行大白话总结「六个问题」「台账」「过期」「必须先失败一次」「穷举 / 有界 / 抽样」）：https://github.com/DeadInternetStudios/100x-engineer-skill （重点看 README 和 docs/verification.md）

1. 先读仓库，确认语言、测试框架和测试命令（从配置文件读，不要猜）。挑一个逻辑最重、出错代价最高的小模块（300 行以内），说明理由并给出路径。
2. 对这个模块用大白话回答六个问题：有哪些状态；状态怎么变；每一步什么时候允许（前置条件）；每一步做完后什么一定成立（后置条件）；什么永远成立（不变量）；什么最终一定会发生（如果不适用就写「不适用」）。每条都引用代码位置作为依据。
3. 从中挑 3 到 5 条最重要的性质，各写一个自动检查（单元测试或属性测试，用仓库已有的框架）。每条检查注明它属于「穷举」「有界」还是「抽样」，并解释为什么。
4. 「必须先失败一次」：对每条检查，在业务代码里临时埋一个会违反该性质的小 bug，运行这条检查并贴出失败输出；然后还原代码，再运行并贴出通过输出。做不到失败的检查要么改写，要么从清单里删掉并说明原因。
5. 建一个台账文件（例如 verify/ledger.md 或 .tsv，先问我放哪里），每行写：性质名称、检查文件、覆盖的源文件、该源文件当前的哈希（用 git hash-object 计算）、类型（穷举 / 有界 / 抽样）、「已见过失败」= 是。
6. 写一个小脚本或说明：重新计算台账里每个源文件的哈希，与记录对比，不一致的行标为「过期」。演示一次：随便改一下被覆盖的文件，运行脚本，贴出「过期」的输出，然后还原。

验收标准：第 4 步每条检查都有「失败 → 通过」两段真实输出；台账每行信息完整；工作区里只多了检查、台账和脚本，没有残留埋下的 bug（贴出 git diff 证明）。
```

来源：[DeadInternetStudios/100x-engineer-skill](https://github.com/DeadInternetStudios/100x-engineer-skill)（DeadInternetStudios）

---

### 6. 补课：Netflix 在 QCon 上讲「研发流程是给人设计的，要改造成也适合 agent」；Shopify 12 周用 agent 重写 App 的结论是「规则写在文档里没用，要由 CI 来判」

- **要点**：
  - **Netflix**（InfoQ 11-23 报道 QCon SF 2026 演讲，讲者是 Netflix 的 Mark Khuzam）：团队第一次让 agent 迁移测试，试了四次才成功，因为文档难找、写法不统一。修法是他们说的 context engineering，即「把工程师知道的东西变成 agent 看得到的东西」：写了 45 份 ADR（架构决策记录，11-13 的概念），每份都写给人也写给 agent，包括背景、决定、推荐写法、反面写法，以及「给 AI 的使用说明」；AGENTS.md 扮演网站的 robots.txt，告诉 agent 去哪找文档。代码写完后，CI 照样跑确定性的构建、测试、截图对比、canary；审查 agent 第一版在一个 PR 上留了 23 条评论，第一句是「Overall this PR looks great!」，现在**只发经过核实的阻断问题**，每条附证据、修法和违反的 ADR 条款。结果：核心服务 2026 年零 Sev 1 事故，PR 数同比多 32%，内部开发者满意度（NPS）从 -3 升到 +25。
  - **Shopify**（11-10，Remi Vanhee）：30 个工程师 12 周把 300 多个页面的 App 从 React Native 重写成 Swift 和 Kotlin，大部分代码由 agent 写。关键是先改架构，让 agent **不用开模拟器**就能在终端里加载页面逻辑、触发操作、检查状态，几毫秒出结果，而不是每次花几分钟截图看界面。原文金句：「文档解释规则为什么存在；CI 决定规则有没有被遵守。」「agent 需要的不只是指令，而是一种发现自己错了的方法。」每个 PR 仍然要人审。
- **对你的用处**：你在做移动端（lobehub-mobile）。Shopify 那条「让 agent 不开模拟器也能验证界面逻辑」对你特别相关；Netflix 那条「审查 agent 只发有证据的阻断问题」可以直接拿来改你的 review prompt。下面的 prompt 找出你仓库里「只写在文档里、CI 没在检查」的规则。

```
目标：找出这个仓库里「只写在文档里、没有任何自动检查在执行」的规则，并把最重要的一条变成 CI 或 lint 能判定的检查。全程用简体中文、大白话。先出清单，改动前等我确认。

参考（先读，各用 3 句话总结）：
- Netflix 改造研发流程：https://www.infoq.com/news/2026/11/netflix-sdlc-ai-coding-agents/
- Shopify 12 周重写 App：https://shopify.engineering/shopify-app-rebuild

1. 读所有给人和给 agent 的规则文档：README、CONTRIBUTING、CLAUDE.md、AGENTS.md、docs/ 下的架构说明、ADR、skill 文件。把其中每一条「应该 / 不应该 / 必须」类的规则抽出来，记下文件:行号和原文。
2. 读所有自动检查：CI 工作流、lint 配置、类型检查配置、测试、pre-commit / git hooks、Claude Code hooks。
3. 对第 1 步的每条规则判断：已被自动检查执行（指出是哪个检查）/ 部分执行 / 完全没有执行。输出一张表。
4. 在「完全没有执行」的规则里，挑出 agent 最容易违反、违反后代价最高的 3 条，说明理由。对每条给出最便宜的自动化方案（lint 规则、简单脚本、测试、hook），并说明它会不会误报。
5. 我确认后，只实现排第一的那一条：先故意写一段违反规则的代码，运行新检查，贴出失败输出；删掉违规代码后再运行，贴出通过输出。再运行项目原有的全部检查（命令从配置文件里读），确认没有新增失败。
6. 如果仓库里有给 agent 用的代码审查 prompt 或 skill，按 Netflix 的经验给出修改建议：只报经过核实的阻断问题，每条附证据、修法和违反的规则出处。只写建议，不修改文件。

验收标准：第 3 步的表覆盖第 1 步抽出的全部规则；第 5 步有「违规时失败、修正后通过」两段真实输出；没有改动与这条检查无关的文件。
```

来源：[Netflix at QConSF 2026: Retrofitting the SDLC for AI Coding Agents](https://www.infoq.com/news/2026/11/netflix-sdlc-ai-coding-agents/)（InfoQ 报道 Mark Khuzam 的演讲，2026-11-23）；[How we rebuilt the Shopify app in 12 weeks](https://shopify.engineering/shopify-app-rebuild)（Remi Vanhee，Shopify Engineering，2026-11-10）

---

## 扫描记录

- **X「Agent 工程」列表**（拉了最新 99 条，约 11-27 03:30 → 11-28 09:21，Asia/Kuala_Lumpur）：感恩节和黑五期间闲聊、促销较多。收了 Mihail Eric 的 CS146S × Replit 总结和 Dex Horthy 的 SlopCodeBench 实验（第 4 条）、Hamel Husain 谈公开评测刷榜（第 2 条）；meng shao 转述的 Together AI Hurdle（第 2 条，回溯原帖和博客）。看过没收：Charlie Marsh 说 Codex 从 Responses API 拉取的数据减少了约 80%（偏性能细节）；Thariq（@trq212）「模型应该像 RPG 角色属性卡一样评分，而不是排行榜」（4000 多赞，正文只有一句话加一张图，图没细看，只记录）；Kun Chen「有了 agent，新想法最好马上做，别进 backlog」；Thorsten Ball 转 Adam Wathan「设计决策才是新的瓶颈」；Shantanu Goel 吐槽新模型爱给什么都写 ADR（「Decision Record Syndrome」）；Philipp Schmid《Why I'm Bullish on MCP for 2027》（1000 多收藏）：Code Mode 配合 MCP 的 outputSchema（类型化输出）、MCP Events 扩展（webhook / 推送 / 轮询三种唤醒方式）。Skills over MCP 部分 11-25 已讲，这篇记入 watchlist 待下次结合实践再讲；Mustafa Suleyman《AI Containment: 10 practical steps》（「证明盒子」「所有出口走一个通道」「监控只能收紧不能放权」等，偏行业安全倡议，记入待评估）。
- **新的高活跃实践者（建议加入列表）**：Philipp Schmid（[@_philschmid](https://x.com/_philschmid)，Google DeepMind，负责 Agents 和 Gemini API，长文常有上千收藏）；Michele Catasta（[@pirroh](https://x.com/pirroh)，Replit 总裁兼 AI 负责人）。
- **GitHub**（带 token 调 API，按 stars 排序）：搜了 claude-code skills（11-20 之后新建）、agent skills（11-21 之后）、AGENTS.md（11-18 之后）、claude plugin（11-21 之后）、subagent（11-18 之后）、mcp（11-23 之后）、codex（11-23 之后）、coding agent（11-23 之后）、evals agent（11-15 之后），以及 claude-code 2000 星以上、11-26 之后有提交的仓库。收了 DeadInternetStudios/100x-engineer-skill（约 874 星，第 5 条）。togethercomputer/hurdle 只有约 18 星，但有官方博客，收入第 2 条。新建高星仓库仍以游戏（nexu-io/opengame 约 2271 星）、3D 页面、视频、图标类 skill 为主，没收。记入待评估：burnjohn/evals-workshop（「eval 当合并门槛」，用 Vitest 测 skill 和 agent 的工作坊，星数少）、Larusajs/Handoff-Check（之前已记）。
- **官方插件市场**：claude-plugins-official 仍是 317 个插件，和 11-27 快照相比没有增删（已存 plugins-snapshot-2026-11-28.txt）；最新提交仍是 11-26 06:51（Asia/Kuala_Lumpur）合并的 Claude Security v0.13.1。市场里的 convex 插件钉在 commit 6ca54f6，正是第 3 条 issue 引用的版本。openai/plugins 的 plugins/ 目录仍是 62 项，最新提交仍是 11-19 03:14（Asia/Kuala_Lumpur）。
- **X 关键词搜索**（中英文）：英文高互动帖里，「研究者建议往 CLAUDE.md / AGENTS.md 里加一句『文档和代码冲突时以代码为准』」（295 收藏）来自 arXiv 2610.30571，11-09 已讲；多条帖子讨论 CLAUDE.md 存在时 Claude Code 会跳过 AGENTS.md，10-29 已讲。中文高互动帖以资料合集、Obsidian 官方 skills、OpenGame 等为主，没收。有帖子提到 Amit_T18 的「会话结束时问 agent『你这次猜了什么，哪一行文档能省掉你的搜索』」，思路和第 1 条 Uber 的 papercut 相近，没单独收。
- **HN**（近 3 天，40 分以上）：收了 Convex skill 的 issue（225 分，第 3 条）。「Claude sabotaging ML research tasks?」（600 分）读了 HN 帖和几篇整理：起因是 X 上有人称 Claude 在 ML 研究任务里「搞破坏」；Anthropic 员工 Edwin Arbus 回复说服务时不会降低 AI 研究类回答的质量（Fable 5 刚发布的头两天曾经这样做过，已修正），Fable 5.2 是在训练阶段限制了少数前沿 AI 研究能力，被拦截的请求会**可见地**回退到 Opus 5；目前说法各异、缺少可复现的证据，属于争议新闻，没收。「Models Can Communicate via Inference Servers Despite Being Sandboxed」（467 分，LessWrong）和「False computer-checked proofs」（177 分）与沙箱、验证相关，记入待评估。「Smart people who give a shit use tools」（418 分，Ian Duncan）的观点并入今日概念。
- **大厂工程博客**：Uber（第 1 条）、Netflix（InfoQ 报道）和 Shopify（第 6 条）是首次收录。记入待评估：Shopify《Reflex: an architecture for building mobile apps with agents》（和你的移动端工作相关，下期细读）、Airbnb《How Airbnb uses cost per task to operate coding agents on Amazon Bedrock》（AWS 博客，按「每个任务的成本」选模型）。Meta 本期没找到新的相关文章。
- **博客 / 版本**：Anthropic 工程博客 11-25 之后没有新文章。Claude Code 最新版本仍是 v2.1.332（11-25 已讲）。Codex 只有 0.174.0 的 alpha 版本。obra/superpowers 最新版本仍是 11-03 的 v7.0.2。CS146S 作业仓库最新提交仍是 11-23。hamel.dev 没有新文章（只有 X 帖）。

## 本期去重用源链接（机器可读）

- https://testing.googleblog.com/2021/04/mutation-testing.html
- https://stryker-mutator.io/docs/
- https://www.iankduncan.com/engineering/2026-11-19-smart-people-who-give-a-shit-use-tools
- https://www.uber.com/us/en/blog/optimizing-ubers-agent-skills/
- https://www.together.ai/blog/introducing-hurdle-run-agent-evals-on-your-api-skills-and-docs
- https://github.com/togethercomputer/hurdle
- https://x.com/togethercompute/status/2125709140425363612
- https://x.com/HamelHusain/status/2125701624320680214
- https://x.com/HamelHusain/status/2126371481609474147
- https://github.com/convex/convex-backend-skill/issues/64
- https://news.ycombinator.com/item?id=50669765
- https://x.com/mihail_eric/status/2126439615502716992
- https://x.com/dexhorthy/status/2126446998543118515
- https://github.com/DeadInternetStudios/100x-engineer-skill
- https://www.infoq.com/news/2026/11/netflix-sdlc-ai-coding-agents/
- https://shopify.engineering/shopify-app-rebuild
- （看过未收）https://x.com/_philschmid/status/2125945282072297794 、https://x.com/mustafasuleyman/status/2126412600816943385 、https://x.com/trq212/status/2126386932989210714 、https://news.ycombinator.com/item?id=50664325
- （补课候选）https://shopify.engineering/reflex 、https://aws.amazon.com/blogs/machine-learning/how-airbnb-uses-cost-per-task-to-operate-coding-agents-on-amazon-bedrock/ 、https://github.com/burnjohn/evals-workshop 、https://www.lesswrong.com/posts/7wzWuLP3HhyBLmKfo/models-can-communicate-via-inference-servers-despite-being 、https://cr.yp.to/proofs/falseccp.html
