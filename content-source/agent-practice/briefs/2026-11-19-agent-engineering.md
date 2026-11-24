# Agent 工程实践简报 · 2026-11-19

## 今日概念：Bottleneck / Theory of Constraints（瓶颈 / 约束理论）：产出取决于最慢的那一环，先改善瓶颈才有效

**是什么**：一条流水线一天能产出多少，取决于最慢的那一环，不取决于最快的那一环。约束理论（Theory of Constraints）的核心就一句话：先找到瓶颈，再改善瓶颈；在非瓶颈环节提速，只会让活在瓶颈前面越堆越多。

**为什么现在要懂**：哈佛的 Fiona Chen 和 James Stratton 用 Jellyfish 平台的数据（655 家公司、约 72 万名工程师、4.45 亿条 GitHub/Jira/日历事件）研究 AI 编程工具的效果，论文 11-14 刚更新（工作论文，尚未经过同行评审）。结论很直接：
- 公司用上 AI agent 一年后，代码行数在已有 AI 助手的基础上又多了 44%，PR 多了 36%。
- 真正上线的工作（Jira issue 完成数）只多了约 14%，而且只是勉强显著。
- **代码审查成了瓶颈**：从提交审查到批准的时间多了 56%，排队等审的时间多了 60%，每个改动收到的评论多了 39%。79% 的公司已经用了 AI 审查工具，但仍然基本保留人工把关。
- 审查难以分摊：83% 的审查是由熟悉那块代码的人做的，所以写代码再快，也卡在那几个懂行的人身上。

HN 上这篇的报道有 319 分、439 条评论。

**和你已会的东西的关系**：
- 你用 Claude Code 写得越快，PR 越多，自己和同事的审查压力就越大。11-16 讲的「PR 描述开头留一段人话」、11-17 讲的「检查规则放在 agent 碰不到的地方」，其实都是在给审查这个瓶颈减负。
- 今天第 3 条 poteto 的 /correct，也是同一个思路：把审查时反复指出的问题变成机器自动拦截，人就少审一点。

**入门原文**：[Theory of constraints](https://en.wikipedia.org/wiki/Theory_of_constraints)（Wikipedia）；论文 [Artificial Intelligence in the Firm: Bottlenecks in Software Production](https://fion.ac/jellyfish.pdf)（Fiona Chen、James Stratton，Harvard，2026-11-14 版）；[HN 讨论](https://news.ycombinator.com/item?id=50538303)

**上手 prompt**：
```
目标：用这个仓库的 git 历史（如果能访问，也用 PR 数据）找出我们交付流程里真正的瓶颈，只出报告，不改任何文件。

1. 先确认数据来源：git log 一定可用；如果仓库在 GitHub 且本机有已登录的 gh，就用 gh 只读命令拉最近 90 天已合并的 PR（创建时间、首次审查时间、批准时间、合并时间、改动行数、评论数、审查人）。拿不到的字段写「无数据」，不要估。
2. 按周统计：提交数、改动行数、PR 数、PR 中位数大小，以及每个 PR 的「等审时间」（创建到首次审查）、「审查时间」（首次审查到批准）、「合并等待」（批准到合并）。
3. 找瓶颈：哪个阶段耗时中位数最长、过去 90 天增长最快？审查是否集中在少数几个人身上（列出每人审查的 PR 数占比）？大 PR 和小 PR 的等审时间差多少？
4. 给出 3 条最能缓解瓶颈的做法，按「投入小、效果大」排序，每条写清改哪里、怎么衡量是否有效。例如：把 agent 产出的改动拆成更小的 PR、在 CLAUDE.md/AGENTS.md 里要求 PR 附测试命令和输出、把审查中反复出现的意见变成 lint 或 CI 检查。
5. 验收：每个结论都附上统计用的命令和原始数字；样本少于 20 个 PR 时明确说明结论不可靠。

参考：Fiona Chen、James Stratton《Artificial Intelligence in the Firm: Bottlenecks in Software Production》https://fion.ac/jellyfish.pdf
```

---

## 本期条目

### 1. Jesse Vincent（Superpowers 作者）新出 toolsmith 插件：agent 想写临时脚本时，交给专门的「工具匠」子 agent 写成可复用的工具并登记在册，下次直接找来用

- **要点**：Jesse 原本在 AGENTS.md 里写了「同一件事要做两次，就写个脚本」，agent 也照做了，但脚本都是顺手写的，丢在临时目录里，之后再也找不到。他意识到「写个工具」本身是一项独立任务，应该交给一个专心做这件事的子 agent。
- toolsmith 的做法：
  - SessionStart 和 SubagentStart 两个 hook 往每个 agent 的上下文里塞几行说明：什么算工具、怎么搜工具目录、没有就去找 toolsmith，不要自己写。
  - toolsmith 子 agent 在 `~/.local/share/toolsmith/tools` 维护一个 git 仓库，分通用工具和各项目专用工具两份目录。已有就直接用，相近的就扩展，没有才新写。
  - 项目自己要交付的脚本、测试、构建代码不算「工具」，照常写在项目里。你明确说「写到临时目录」时，以你的话为准。
- 他用了两周，攒下几十个小工具，比如统计 HTML 字数、找 iOS 设备 ID、管理临时 EC2 机器等。
- 安装（Claude Code，需 2.1.271 以上）：`claude plugin marketplace add prime-radiant-inc/prime-radiant-marketplace`，然后 `claude plugin install toolsmith@prime-radiant-marketplace`。Codex 侧见仓库 README。仓库 11-17 刚发布，目前星数很少，属于早期项目。

```
目标：评估「把 agent 写的一次性辅助脚本沉淀成可复用工具」对这个仓库值不值得做，先出报告，不安装任何东西、不改文件。

1. 在仓库里和常见临时位置（如 tmp/、scratch/、scripts/、.claude/ 下以及 git 未跟踪的文件）找出 agent 或人写过的一次性辅助脚本：日志过滤、数据转换、调 API、批量改文件等。用 git status、git log 和文件修改时间作证据，列出路径、用途、大概用了几次。
2. 把它们分成两类：(a) 项目要交付的代码（应该正式放进仓库）；(b) 只是帮 agent 干活的工具（适合放进一个独立的工具目录）。每条说明判断理由。
3. 对 (b) 类，设计一个最小方案：工具放在哪里、目录说明（catalog）长什么样、在 CLAUDE.md/AGENTS.md 里加哪几行规则让 agent 先查目录再动手写。规则不超过 5 行。
4. 对比直接安装 toolsmith 插件（https://github.com/prime-radiant-inc/toolsmith ）的方案：它用 SessionStart/SubagentStart hooks + 一个专门的子 agent + ~/.local/share/toolsmith/tools 下的 git 仓库。列出两种方案各自的优缺点，以及对本仓库的建议。
5. 验收：清单里每个脚本都有路径证据；方案部分给出要加的规则原文；最后给出「建议做 / 不建议做」和理由。

参考：Jesse Vincent《The Toolsmith》https://blog.primeradiant.com/the-toolsmith/
```

来源：[The Toolsmith](https://blog.primeradiant.com/the-toolsmith/)（Jesse Vincent，Prime Radiant，2026-11-17）；[prime-radiant-inc/toolsmith](https://github.com/prime-radiant-inc/toolsmith)；[Jesse 的 X 帖](https://x.com/obra/status/2123213240071344327)

---

### 2. Thorsten Ball（Amp）：靠斜杠命令触发 skill 可能是个反模式，好的 skill 应该让 agent 自己在需要时找到

- **要点**：这是个人观点，但很值得用来检查自己的 skill。Thorsten 说他们团队不用任何额外的工作流 skill，「直接告诉模型你想要什么」。理由有三条：
  - skill 应该写得足够好被发现（主要靠 description），agent 在需要时自己会用，不需要你敲斜杠命令。
  - 如果某件事非得用斜杠命令按固定步骤触发，那为什么要让模型当流程执行器，而不是给它一个高层目标让它自己想办法？
  - 代码库本身应该清楚到 agent 读得懂。如果人必须告诉 agent「什么时候、用哪个 skill 做审查」，说明前面某个地方出了问题。
- 评论区 Dave Bettin 说，他换到 Amp 后删掉了 90% 的 skill，两个月没有需要恢复的。
- 对你的意义：你在写 skill，可以用这三条做个体检。注意这和 11-12 讲的 poteto「把纠正变成检查」不冲突：确定要执行的规则交给 lint/hook，判断类的事交给模型，中间那层靠斜杠命令硬触发的流程最值得怀疑。

```
目标：给我的 skills（项目里的 .claude/skills、.agents/skills，以及 ~/.claude/skills 下的，先列出实际存在的位置）做一次「可发现性和必要性」体检，只出报告和修改建议，不删除、不修改任何文件。

1. 列出每个 skill：路径、name、description 原文、SKILL.md 行数，以及它是否主要靠斜杠命令手动触发（看 description 和正文里有没有「用 /xxx 调用」之类的写法）。
2. 对每个 skill 判断三件事并给理由：
   a. 可发现性：只看 description，agent 能不能在真正需要的时候想到用它？description 有没有写清「什么情况下用」？
   b. 必要性：如果删掉它，只给 agent 一句高层目标，当前模型大概率能不能做好？哪些内容是模型自己就会的通用常识，可以删？
   c. 该不该换形式：里面有没有「每次都必须执行」的规则，更适合改成 lint、测试或 hook，而不是写在 skill 里？
3. 分成三组输出：保留（只改 description）、合并或精简、建议删除或改成检查。每个建议删除的 skill，写出删除后用什么替代（一句高层指令、一条检查，或什么都不用）。
4. 对「保留」组，给出改写后的 description 原文，要求写清触发场景。
5. 验收：每个判断都引用 SKILL.md 里的原文作证据；不要凭空推测 skill 的用途。

参考：Thorsten Ball 在 X 上的观点 https://x.com/thorstenball/status/2122922612770632070
```

来源：[Thorsten Ball 的 X 帖](https://x.com/thorstenball/status/2122922612770632070)（2026-11-18，点赞 143、收藏 88）；[Dave Bettin 的回复](https://x.com/dbettin/status/2123134911809003866)

---

### 3. poteto 的 /correct skill：让 agent 自己回顾被你纠正过的错误，然后替你把它写成确定性的检查

- **要点**：11-12 讲过 poteto 的观点「每次纠正 agent，都变成 lint 或架构上的改动」。昨天 AI Engineer Code Summit 放出了她这段演讲的片段，标题就是「同一个错误纠正了好几次，就把它变成检查」（收藏 97）。poteto 在回复里补了一句：可以直接用 pstack 里的 `/correct` skill，它会让 agent 回顾自己犯过的错，再帮你建好确定性检查（这条回复收藏 94）。
- skill 的说明里写了优先级：先试架构改动，再试类型，再写一条报错信息里直接写出修法的 lint，再写测试，最后才写文档；并且要求证明每条检查能拦住过去真实犯过的错误。
- 和今天的「今日概念」连起来看：每多一条自动检查，人工审查就少一件事，瓶颈就松一点。

```
目标：把我最近反复纠正 agent 的问题变成自动检查。先出清单和方案，我确认后再动手。

1. 从这些地方找「同一类错误至少出现 2 次」的证据：最近 30 次提交里的修复提交（git log -p）、PR 审查评论（如果能用 gh 只读访问）、CLAUDE.md/AGENTS.md 里「不要……」「必须……」这类规则。每条列出出现次数和具体例子（提交哈希、文件和行号，或评论原文）。
2. 对每类错误，按这个顺序选最强的拦截方式，并说明为什么上一档做不到：(1) 改架构让错误写不出来；(2) 用类型让错误编译不过；(3) 加一条 lint，报错信息里直接写出正确做法；(4) 加一条测试；(5) 最后才是写进文档。
3. 对每条拟加的检查，说明怎么证明它有效：在一个临时分支上把过去那次真实的错误重新引入，检查必须失败；改回正确写法，检查必须通过。
4. 我确认后，每条检查单独一个提交，提交信息里写清它拦的是哪次历史错误；完成后贴出「引入错误 → 检查失败」「修正 → 检查通过」的命令和输出。
5. 如果某条规则做成检查后，CLAUDE.md/AGENTS.md 里对应的文字可以删掉，列出来让我决定。

参考：poteto 的 /correct skill https://github.com/cursor/plugins/blob/main/pstack/skills/correct/SKILL.md
```

来源：[AI Engineer 发布的 poteto 演讲片段](https://x.com/aiDotEngineer/status/2123068725410869585)（2026-11-18；视频本期未观看，内容以帖文为准）；[poteto 的回复](https://x.com/poteto/status/2123208699309347294)；[/correct SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/skills/correct/SKILL.md)（poteto）

---

### 4. 【补课】planning-with-files（约 2.8 万星）：把计划写进磁盘上的三个文件，再用 hook 每轮提醒 agent 看，上下文被清空也不丢计划

- **要点**：这是社区里很火、但简报一直没介绍过的项目（作者 GitHub 用户名 OthmanAdi），走的是 Manus 那种「用文件当外部记忆」的路线。它让 agent 在磁盘上维护三个文件：`task_plan.md`（计划）、`findings.md`（发现）、`progress.md`（进度）；再用生命周期 hook 每轮把计划的关键部分塞回上下文，所以 `/clear`、上下文压缩、甚至崩溃之后，agent 都能从文件里接着干。
- README 声称带 skill 时断言通过率 96.7%（29/30），盲测 A/B 3 比 3 胜出；这是作者自己的评测，详见仓库 docs/evals.md。
- 安装：`npx skills add OthmanAdi/planning-with-files --skill planning-with-files -g`，支持 Claude Code、Codex 等。
- 和你已会的东西的关系：11-08 讲过 agent 记忆，这是最朴素也最好用的一种：记忆就是仓库里的 markdown 文件。

```
目标：给一个需要跨多轮、可能被 /clear 打断的长任务，建立「文件化计划」，让任何新会话都能从文件接着做。

1. 先读仓库，确认没有已有的计划文件约定（如 docs/plans、PLAN.md、.claude/ 下的计划目录）；有就沿用，没有就在仓库根目录下建一个被 .gitignore 忽略的目录（例如 .agent-plan/），并告诉我你的选择。
2. 在其中建三个文件：task_plan.md（目标、验收标准、分阶段步骤，每步有「未开始/进行中/完成」状态）、findings.md（读代码时的发现和决定，每条附文件路径）、progress.md（按时间记录做了什么、跑了哪些命令、结果如何）。
3. 工作规则：每完成一步立刻更新 task_plan.md 状态和 progress.md；做决定前先读 findings.md；每次开始工作（包括 /clear 之后）先读三个文件再动手。
4. 可选：如果我同意，在 .claude/settings.json 里加一个 hook，在每次提交 prompt 时把 task_plan.md 的「当前阶段」一节注入上下文。先给我看 hook 配置原文，不要直接写入。
5. 验收：演示一次——做完第一步后，假设上下文被清空，只靠三个文件说出当前进度和下一步；贴出三个文件的内容。

参考：OthmanAdi planning-with-files https://github.com/OthmanAdi/planning-with-files
```

来源：[OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files)（OthmanAdi，MIT）

---

## 本期去重用源链接（机器可读）

- https://en.wikipedia.org/wiki/Theory_of_constraints
- https://fion.ac/jellyfish.pdf
- https://news.ycombinator.com/item?id=50538303
- https://complexdiscovery.com/harvard-researchers-find-ai-coding-agents-shifted-the-bottleneck-to-code-review/
- https://blog.primeradiant.com/the-toolsmith/
- https://github.com/prime-radiant-inc/toolsmith
- https://x.com/obra/status/2123213240071344327
- https://x.com/thorstenball/status/2122922612770632070
- https://x.com/dbettin/status/2123134911809003866
- https://x.com/aiDotEngineer/status/2123068725410869585
- https://x.com/poteto/status/2123208699309347294
- https://github.com/cursor/plugins/blob/main/pstack/skills/correct/SKILL.md
- https://github.com/OthmanAdi/planning-with-files
- （看过未收）https://x.com/poteto/status/2123159537016533493 （poteto 讲怎么用 Grok Bot 自动化日常，点赞 6.5k；偏个人自动化，不是 agent coding）
- （看过未收）https://x.com/dexhorthy/status/2122723620120297625 （希望模型会说「这样更简单」，点赞 1.7k，只是愿望无做法）
- （看过未收）https://github.com/google-labs-code/stitch-skills （Google Stitch 设计 skill，需 Stitch MCP；设计专题已覆盖同类）
- （看过未收）https://opencode.ai/product/browse （HN 331，产品发布）
- （看过未收，后续可评估）wshobson/agents（42k）、shareAI-lab/learn-claude-code（80k，从零写 nano Claude Code，适合学 harness）、rohitg00/agentmemory（30k）、mvanhorn/last30days-skill（70k）、Nutlope/hallmark（57k，反 AI slop 设计 skill）、alibaba/open-code-review（54k）
