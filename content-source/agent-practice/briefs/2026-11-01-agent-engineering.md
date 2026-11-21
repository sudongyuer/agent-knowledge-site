# Agent 工程实践简报 · 2026-11-01

## 今日概念：Hillclimbing（爬坡迭代）

**是什么**：先有一套能打分的 eval（评测集），然后每轮只改一处（prompt、skill 描述、模型或 effort），跑分；分数涨了就留，没涨或变差就撤回，一步一步往"山顶"爬。关键配套是把评测样例随机分成两份：训练集让 agent 看失败记录、拿来改；测试集（held-out，留出集）它永远看不到，只用来验收。训练集涨、测试集不动，就说明在"背答案"（过拟合），要撤回。

**解决什么**：改 skill 或 prompt 时最常见的问题是凭感觉：改了几句、试两次觉得好像好了，其实可能只是运气，或者只是对那几个例子特别有效。爬坡把"改得好不好"变成可重复的数字，还专门防"对着考题改卷子"。

**和你已会的东西的关系**：你关心"怎么验证 skill 好不好用"，这就是下一步：eval 告诉你现在几分，hillclimbing 告诉你怎么安全地往上提。Anthropic 这篇文里说，最适合爬坡的地方正是 prompt 和 skill 这类文本（改起来便宜、能撤回），一个成功例子是只改 skill 的 description 来提高 skill 被正确触发的比例。还有两条硬规矩：不要把失败样例原文贴进 prompt；分数涨幅在噪声范围内就别合并。

**入门原文**：[Automating eval design and hillclimbing with Claude](https://claude.dev/blog/automating-eval-design-and-hillclimbing/)（作者 Lance Martin，Anthropic，2026-09-28）

**上手 prompt**：
```
请用"爬坡迭代（hillclimbing）"的方法，提升本仓库里一个 skill 的触发准确率。先只做一轮，证明流程可行。
背景（若可联网先读）：https://claude.dev/blog/automating-eval-design-and-hillclimbing/
1. 找出仓库里的 skill（.claude/skills、.agents/skills 等目录下的 SKILL.md），列出路径。挑一个 description 最模糊的，说明理由。没有 skill 就停下告诉我。
2. 建一个最小 eval：写 20 条用户请求，一半应该触发这个 skill、一半不应该（要有容易混淆的近似请求）。每条写明期望结果和"为什么难"。随机分成训练集 14 条、测试集 6 条，存成 evals/<skill名>/cases.jsonl，标明 split。
3. 评分方式：对每条请求，只给你所有 skill 的 name + description，判断会不会选中这个 skill；跑 3 次，算准确率和三次之间的差距（噪声）。先记录基线分数。
4. 只看训练集的失败，提出一处对 description 的修改（从根上补缺失的触发条件或排除条件，不是换个说法），不要把任何样例原文抄进 description。
5. 用改后的 description 重跑训练集和测试集。规则：训练集涨但测试集不动，判为过拟合并撤回；任一变差就撤回；两边都涨且超过噪声才保留。
验收标准：贴出 cases.jsonl、基线和改后两组分数（含每次运行的结果和噪声）、description 修改前后的 diff，以及保留还是撤回的结论和理由。不要改 skill 的正文。
```

## 本期条目

### 1. 多个 agent 并行往主干合代码，到底该直接合、走 PR、还是上合并队列？有人做了个模拟器来算

Thorsten Ball 之前主张不用 PR、直接往主干提交，引发了争论。Luca Palmieri 用 Opus 写了一个浏览器里跑的模拟器，比较四种合代码方式：直接合到 main、只用合并队列（merge queue，排队把一批改动先在最新 main 上跑 CI 再合）当唯一 CI 关卡、PR 必须基于最新 main 再合、以及"agent 合并队列"（失败的一批被挪到一边二分查出是哪个改动坏的，由一个 agent 逐个解冲突，再对最新 main 跑一次 CI 才合）。你可以填自己团队的提交频率、CI 时长、失败率，看部署等待时间、被迫 rebase 次数和主干被卡住的时长。他说第四种"现在哪儿都买不到"。对你的"软件工厂"目标，这是决定并行 agent 怎么落地合代码前值得先算一下的账。

```
请帮我评估：如果多个 coding agent 同时在本仓库并行开发，现在的"合代码方式"会在哪里卡住。只出报告，不改配置。
参考原文：https://x.com/algo_luca/status/2116520160936833347 ，模拟器：https://lpalmieri.com/simulations/commit-integration/
1. 读仓库和 CI 配置（.github/workflows、分支保护说明、CONTRIBUTING、AGENTS.md / CLAUDE.md 等），确认现在用的是哪种方式：直接推 main、PR 必须最新、合并队列，还是别的。附文件路径作为证据；查不到的写"未知"，不要猜。
2. 从 git 历史里统计真实数据（贴出你用的命令和输出）：最近 30 天每天合入的提交或 PR 数、需要 rebase 或解冲突的比例（能估就估，说明估法）、main 上 CI 失败后多久修好。CI 单次时长能从配置或日志看到就填，看不到写"需我提供"。
3. 把这些数字整理成一张表，对应模拟器里的输入项（提交频率、CI 时长、失败率、冲突率），方便我直接填进模拟器。
4. 假设并行 agent 数量变成现在的 3 倍，按模拟器文中描述的四种方式，逐一说明在本仓库最先坏掉的是什么（例如 main 长时间红、rebase 排队、CI 资源不够）。
验收标准：给出现状判断和证据路径、数据表、四种方式的对比表，以及一条最小的下一步建议（例如先试合并队列）和它需要改哪些文件。不改任何文件。
```

原文：[Luca Palmieri 的帖子](https://x.com/algo_luca/status/2116520160936833347)（作者 Luca Palmieri / @algo_luca，2026-10-31）；模拟器 [Commit integration simulator](https://lpalmieri.com/simulations/commit-integration/)（作者 Luca Palmieri）；Thorsten Ball 转发评价 "That's so cool!"

### 2. 让 agent 把你每次口头教它的做法，当场沉淀成 skill；交代完长需求后让它"用自己的话复述一遍"

poteto（lauren）发了一份怎么带好一支 bot 团队的短指南，几条可以直接搬到 Claude Code / Codex：bot 少而精比多更好管；你每次教它怎么做一件事时，让它顺手给自己写成 skill，这样长对话里也能做得一致；把你在工作流里"手动复制粘贴给 bot"的环节列出来，问它能不能自己接过去；她最喜欢的一招是用语音一口气把想法倒出来，最后让 bot "restate this in your own words"（用自己的话复述），确认它真听懂了。

```
从现在起，这次会话里请按下面两条规矩工作，并先在本仓库里落地一次。
参考原文：https://x.com/poteto/status/2116576229319233596
规矩 A：每当我纠正你的做法、或教你某件事"应该这样做"时，在完成当前任务后，判断这条做法是否会重复用到。会的话，在仓库的 skill 目录（先确认本仓库实际用的是 .claude/skills 还是 .agents/skills，都没有就用 .claude/skills）里新建或更新一个 SKILL.md：frontmatter 写 name 和一句"什么时候用"的 description，正文只写可执行的步骤和验收方法，不写背景故事。已有相近 skill 就合并，不要新建重复的。
规矩 B：我给你一段长需求（尤其是口述、比较乱的）之后，先不要动手，用你自己的话复述：目标、范围（做什么、不做什么）、验收标准、你不确定的地方。等我确认再开始。
现在先执行一次：
1. 读本仓库最近 20 条提交信息、AGENTS.md / CLAUDE.md 和已有 skill，找出 1 个看起来反复手工做、但还没写成 skill 的流程（例如发版、加新页面、跑某类检查）。说明你根据哪些证据判断它是反复出现的。
2. 按规矩 A 把它写成 skill，步骤里涉及的命令必须先在仓库里确认真实存在。
3. 用一句话的模拟请求测试：说明哪句请求应该触发它、哪句相近的请求不应该触发。
验收标准：贴出新 SKILL.md 全文和证据（提交哈希或文件路径）；列出两条测试请求和你预期的触发结果；最后按规矩 B 的格式复述你理解的这两条规矩，等我确认。
```

原文：[poteto 的 bot 团队指南](https://x.com/poteto/status/2116576229319233596)（作者 lauren / @poteto，2026-10-31）

## 本期去重用源链接（机器可读）
- https://claude.dev/blog/automating-eval-design-and-hillclimbing/
- https://x.com/algo_luca/status/2116520160936833347
- https://lpalmieri.com/simulations/commit-integration/
- https://x.com/thorstenball/status/2116540225665089755
- https://x.com/poteto/status/2116576229319233596
- （看过未收）https://x.com/AnthropicAI/status/2116349211549843666 （安全研究，非工程实践）
- （看过未收）https://simonwillison.net/2026/Oct/29/how-i-built-the-most-ai-pilled-company-in-the-world/ （与 10-30 的 jsnnsa 条目同源）
- （看过未收）https://simonwillison.net/2026/Oct/31/how-we-took-over-chatgpt-accounts/
- （看过未收）https://x.com/claudeai/status/2116220869479428500 （套餐改名，产品新闻）
- （看过未收）https://claude.dev/blog/spending-your-effort/
- （看过未收）https://claude.dev/blog/claude-code-in-the-cloud/
