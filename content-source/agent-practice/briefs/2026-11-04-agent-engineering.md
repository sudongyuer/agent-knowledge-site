# Agent 工程实践简报 · 2026-11-04

## 今日概念：Formal verification（形式化验证）/ 模型检查（model checking）

**是什么**：测试只检查"有人想到要写的那几种情况"；形式化验证是让工具把**规定范围内的所有情况**都走一遍。最容易上手的一种叫模型检查：你用大白话说出一条"绝对不能发生"的规则（比如"同一个任务不能同时跑两次"），agent 把相关代码的状态和动作写成一个小模型（常用 TLA+ 语言，配套的检查器叫 TLC），检查器把所有可能的操作顺序穷举一遍。规则被打破时，它会给出一串具体步骤（反例），告诉你"先点这里、再点那里、就出 bug"。

**解决什么**：并发、重试、队列、缓存、通知这类"顺序会打结"的地方，测试全绿也可能藏着 bug。Dante 的实测里，一个应用 240 个测试全过，模型检查却找到了"失败任务连按两次重试，同一个渲染同时跑两份"的反例，用时约 20 分钟。Martin Kleppmann 的判断是：以前写证明太贵，现在 agent 会写，而且检查器会无情拒绝错误的证明，所以模型"胡说"也没关系，它只能重试到对为止。

**和你已会的东西的关系**：它是你一直在搭的"自动验证闭环"里最硬的一环。evals 和测试是抽样检查，形式化验证是在声明的范围内穷举。今天的条目 1 就是 poteto 说的：与其让 agent 互相审代码，不如把 token 花在"实际跑一遍 + 形式化验证"上。要注意的是，它只保证模型和边界之内的事（比如"最多 6 个任务"），模型和代码对不上，PASS 就没有意义。

**入门原文**：[Every Test Passed, and There Was Still a Bug: Finding Ordering Bugs with pstack and TLA+](https://dantelearn.com/blog/en/posts/2026/10/pstack-tla-formal-verification)，Dante（Quokka Labs），用相册打比方讲 TLA+，并完整记录了一次真实找 bug 的过程。想知道"为什么是现在"，读 [Prediction: AI will make formal verification go mainstream](https://martin.kleppmann.com/2025/12/08/ai-formal-verification.html)，Martin Kleppmann。可直接用的工具是 poteto 的 [create-formal-verification-skill](https://github.com/cursor/plugins/blob/main/pstack/skills/create-formal-verification-skill/SKILL.md)（pstack 插件，Claude Code 里 `/plugin marketplace add cursor/plugins` 然后 `/plugin install pstack@cursor-plugins`）。

**上手 prompt**：
```
目标：在这个仓库里找一处"操作顺序可能打结"的代码，用模型检查（默认 TLA+ 和 TLC）验证一条它必须遵守的规则，并留下一个以后每次改动都能一键重跑的检查。

1. 先读仓库，找出候选：并发或异步任务、重试、队列、锁、缓存失效、状态机、按钮连点等。列出 3 个候选，每个写清：文件和函数位置、它对用户做出的承诺（一句大白话，比如"同一请求不会被同时执行两次"）、违反时的后果、现有测试是否覆盖了交错顺序。选"后果最重、测试最难覆盖"的一个，说明理由，等我确认后再继续。
2. 把这条承诺写成一条不变式（invariant）。用 TLA+ 写一个小模型：模型里的每个动作都要标注对应的代码文件和行号；代码里不可分割的一步，在模型里也只能是一步。不要为了让检查通过而简化掉代码里真实存在的等待或交错。
3. 先证明检查会失败：至少做 2 个故意改坏的变体（例如去掉一个判断、调换两步顺序），贴出 TLC 把它们抓出来的输出。从没见过失败的检查不算数。
4. 对真实代码跑检查。如果规则被打破，不要改产品代码，也不要放宽规则：用代码里的函数名，把反例写成一串编号步骤，告诉我用户在界面或接口上怎样触发它。
5. 交付：一条重跑命令（固定工具版本）、模型文件路径、验证的边界和假设（例如"最多 N 个任务"）、没覆盖到的部分，以及一个项目内的 skill 或 AGENTS.md 段落，写清"改动了哪些文件时必须重跑这个检查"。

参考：Dante《Every Test Passed, and There Was Still a Bug》https://dantelearn.com/blog/en/posts/2026/10/pstack-tla-formal-verification ；poteto 的 create-formal-verification-skill https://github.com/cursor/plugins/blob/main/pstack/skills/create-formal-verification-skill/SKILL.md
```

## 本期条目

### 1. 别再让 agent 互相审代码了，把 token 花在"跑给我看"上：要不可辩驳的证据

- **要点**：poteto（pstack 作者）11 月 3 日发帖说，她现在认为"对抗式评审"大多是浪费 token，agent 在抽象的代码评审里容易陷进挑小毛病和"以后可能用得上"的建议里。更好的用法是"实际运行 + 形式化验证"，她已经把 pstack 改成少用 interrogate skill，以后可能整个删掉。她在回复里澄清，指的是让 agent 只读代码、不实际运行、也不用确定性检查器的那种评审，跨模型评审也一样。Thorsten Ball 转发时只加了一句 "Give me irrefutable proof that this works"（给我这个能用的不可辩驳的证据），并举了自己的例子：让 agent 自己搭一个 GitLab 实例，再对着它做集成，agent 开了 MR 和 issue、推了提交，还录了自己操作的视频，他再去看那些提交，"这不比单元测试更能证明它能用吗？" CS146S 讲师 Mihail Eric 同一天也说，最好的 AI 开发者会给 agent 一个检查自己工作的办法：端到端测试、冒烟测试、浏览器、应用运行录屏。
- **链接**：[poteto 的原帖](https://x.com/poteto/status/2117437607940681849) 和 [她的澄清回复](https://x.com/poteto/status/2117440753551204735)，lauren (poteto)；[Thorsten Ball 的转发](https://x.com/thorstenball/status/2117487350657720363) 和 [GitLab 例子](https://x.com/thorstenball/status/2117633844773900543)，Thorsten Ball；[Mihail Eric 的播客要点](https://x.com/mihail_eric/status/2117659931570757848)，Mihail Eric。

```
目标：把我在这个仓库里"让 agent 审代码"的环节，换成"让 agent 拿出不可辩驳的运行证据"。以后任何改动，完成标准都是证据，而不是评审意见。

1. 先读仓库里的 agent 配置（CLAUDE.md、AGENTS.md、.claude/ 下的 agents、skills、hooks、settings，.agents/ 等），找出所有"让模型只读 diff 给意见"的环节：评审 subagent、review skill、提交前 hook 等。列出文件路径和原文作为证据。没有就直接说。
2. 再读仓库，弄清这里能拿到哪些"真实运行"的证据，并实际执行一遍确认命令可用：测试、类型检查、构建、启动应用、调用接口、浏览器或模拟器截图和录屏、日志。每种都贴出命令和真实输出片段。不要猜命令。
3. 写一份"证据清单"规则，放进 AGENTS.md（或仓库已有的同类文件），内容是：按改动类型（界面、接口、数据、并发、配置）分别规定必须交付的证据；"测试通过"不能单独作为证据，必须附上对真实行为的观察；拿不到证据时必须明说"未验证"以及原因。
4. 对第 1 步找到的评审环节逐个给建议：删掉、改成"先跑再说"、还是保留（只有当它确实挡住过真实问题时才保留，并给出证据）。先给我方案，等我确认再改。
5. 用仓库里最近的一次真实改动（看 git log）演示新规则：按清单收集证据，贴出结果，并指出这次改动当时有哪一项其实没被证明。

参考：poteto https://x.com/poteto/status/2117437607940681849 ；Thorsten Ball https://x.com/thorstenball/status/2117633844773900543
```

### 2. 跑评测前先审"判卷器"：Prime Intellect 发现公开基准里，判卷脚本冤枉对的答案、模型还能上网抄到答案

- **要点**：Prime Intellect 11 月 3 日发布了公开评测审计，Hamel Husain 转发称它把一个基准"几乎刷满"。几个能直接拿去检查自己评测的问题：OfficeQA Pro v2 用正则加 Python 抽取判卷，`FY2014 (fiscal year 2014)` 这种正确答案因为"抽出来的数字个数和标准答案不同"被判错，带一句解释超过 250 字符也被判错；同一个基准开着网络，模型直接从 Hugging Face 找到了答案；AutomationBench 把工具参数用散文描述而不是 JSON Schema，模型只能猜参数。修好之后，同一个模型的得分取决于计分方式：部分得分 92.15%，严格计分 70.83%。Hamel 的结论是：一定要亲眼看数据，不要信第三方指标，最好用自己的私有评测。和昨天"建私有评测集"那条是配套的：建好之后要审判卷器和泄漏。
- **链接**：[Learnings from Auditing Public Evaluations](https://www.primeintellect.ai/blog/auditing-public-evaluations)，Prime Intellect（2026-11-03）；[Hamel Husain 的转发点评](https://x.com/HamelHusain/status/2117746902402039859)，Hamel Husain。

```
目标：审计这个仓库里现有的评测或测试判分逻辑（LLM 评测、快照测试、带打分的脚本都算），找出"冤枉正确答案"和"答案泄漏"两类问题，并给出可验证的修复。

1. 先读仓库，找出所有判分的地方：评测脚本、grader、断言、LLM-as-judge 的 prompt、快照文件。列出路径作为证据。完全没有就告诉我并停下。
2. 冤枉正确答案：对每个判分器，构造 5 条"意思正确但写法不同"的输出（多了解释、大小写或空格不同、数字格式不同、同义表达、顺序不同），实际跑判分器，贴出哪些被误判。只用仓库里真实的样例来改写，不要编造新任务。
3. 答案泄漏：检查被测的 agent 或模型在评测时能不能接触到标准答案，例如网络访问、读得到答案文件或 fixture 的路径、日志里出现期望值、prompt 里夹带了答案。每一处写清泄漏途径和证据。
4. 计分方式：如果有部分得分，同时算出严格计分的结果，贴出两种分数的差距，并告诉我哪个更反映真实能力。
5. 修复：先把方案给我确认。能用确定性代码判断的，改成更宽容但仍然确定的规则；只有语义判断才用 LLM 判卷，而且要附上它和人工标注的一致率检查方法。修完后重跑第 2 步，贴出前后对比。

参考：Prime Intellect《Learnings from Auditing Public Evaluations》https://www.primeintellect.ai/blog/auditing-public-evaluations
```

## 本期去重用源链接（机器可读）
- https://dantelearn.com/blog/en/posts/2026/10/pstack-tla-formal-verification
- https://martin.kleppmann.com/2025/12/08/ai-formal-verification.html
- https://github.com/cursor/plugins/blob/main/pstack/skills/create-formal-verification-skill/SKILL.md
- https://x.com/poteto/status/2117437607940681849
- https://x.com/poteto/status/2117440753551204735
- https://x.com/thorstenball/status/2117487350657720363
- https://x.com/thorstenball/status/2117633844773900543
- https://x.com/mihail_eric/status/2117659931570757848
- https://www.primeintellect.ai/blog/auditing-public-evaluations
- https://x.com/HamelHusain/status/2117746902402039859
- https://x.com/PrimeIntellect/status/2117691977487831483
- （看过未收）https://x.com/HamelHusain/status/2117688053129171206 （转发 10-21 的 SWE-bench Multimodal 文章 https://sankalp.bearblog.dev/swe_multimodal/ ，与本期条目 2 同主题，未单列）
- （看过未收）https://x.com/bcherny/status/2117693181651542387 （Claude 团队插件自动连接，产品公告）
- （看过未收）https://x.com/AnthropicAI/status/2117710942826123294 （FlashProve 可证明推理，研究新闻）
- （看过未收）https://simonwillison.net/ 11-03 两篇（模型权重解读、OSINT），非 agent 工程
- （看过未收）https://www.anthropic.com/engineering 、https://claude.dev/blog/ 无新文
