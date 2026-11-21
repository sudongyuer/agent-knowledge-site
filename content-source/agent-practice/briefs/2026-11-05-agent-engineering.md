# Agent 工程实践简报 · 2026-11-05

## 今日概念：Spec-driven development（规格驱动开发，SDD）

**是什么**：先写一份"规格"（spec），再让 agent 写代码。spec 是一份用自然语言写的、讲"软件该有什么行为"的文档，通常包括用户故事和验收标准（比如"假设已登录，当点击退出，那么回到登录页"）。Thoughtworks 的 Birgitta Böckeler 把它分成三档：spec-first（每个任务先写 spec 再开工）、spec-anchored（任务做完 spec 留着，以后改这个功能先改 spec）、spec-as-source（人只改 spec，从不碰代码）。

**解决什么**：agent 写代码越来越快，瓶颈变成"它到底知不知道你要什么"。今天条目 1 里 Factory 的 Eno Reyes 说得很直接：同样是让 agent 做，"做一个 Salesforce 克隆"什么也得不到，写清"什么时候用 Redis、什么时候用 Postgres"才能走得远。spec 就是把这份精确度写下来、能复用的地方。

**和你已会的东西的关系**：CLAUDE.md / AGENTS.md 是"每次都要读的通用背景"，spec 只和某一个功能有关，这是两种不同的文件。spec 里的验收标准写得够具体，就能直接变成测试或 eval，接到你在搭的自动验证闭环上。Birgitta 的提醒也要记住：她试的工具把一个小 bug 修复展开成 4 个用户故事、16 条验收标准，审一堆 markdown 比审代码还累。所以 spec 要按问题大小来写，小改动不需要。

**入门原文**：[Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl](https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)，Birgitta Böckeler（martinfowler.com），定义清楚、也讲了坑。

**上手 prompt**：
```
目标：为我接下来要做的一个功能写一份"刚好够用"的 spec，并让验收标准能直接变成可运行的检查。我会在下面一行描述这个功能：
功能描述：<在这里写一两句>

1. 先读仓库：README、CLAUDE.md / AGENTS.md、和这个功能相关的现有代码与测试。列出你读了哪些文件，并说明这个功能会碰到哪些模块。不要猜，找不到就说找不到。
2. 判断问题大小：如果这只是一个小改动（预计改动不超过几个文件、没有新的用户可见行为），直接告诉我"不需要 spec"，给出理由并停下。
3. 否则写 spec，放到仓库里合适的位置（先看仓库是否已有 docs/specs 之类的约定，没有就提议一个路径等我确认）。内容只有三部分：(a) 目标和不做什么；(b) 3 到 8 条验收标准，每条用"假设…当…那么…"格式，写成可以被程序判断真假的行为；(c) 我需要拍板的开放问题。不写实现细节，除非它是硬约束（比如必须用某个现有接口）。
4. 把每条验收标准映射到一个具体的检查方式：已有测试、新测试、或手动验证步骤。能自动化的，先写测试并运行，贴出它们现在失败的输出（证明测试真的在检查新行为）。
5. 交付：spec 文件路径、验收标准到测试的对照表、失败测试的真实输出、开放问题列表。等我回答开放问题后再开始实现。

参考：Birgitta Böckeler《Understanding Spec-Driven-Development》https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html
```

## 本期条目

### 1. CS146S 嘉宾 Eno Reyes：代码不再是真相，测试才是；检查越快，agent 一小时能试的次数越多

- **要点**：CS146S 讲师 Mihail Eric 11 月 4 日总结了 Factory CTO Eno Reyes 在课上讲的要点。Factory 核心团队约 50 人，每人每天产出上万行代码，代码库每 2 到 3 个月几乎全部换新，功能却不变，所以定义产品的是检查，不是代码。他给了一组数字：pre-commit hook（提交前自动跑的检查）让 agent 一小时能试 720 次，本地测试 60 次，CI 6 次，人工代码评审不到 1 次，5 秒的检查和 10 分钟的流水线差了 120 倍，建议"找出你循环里最慢的那个检查，把它缩短"。另外两点：agent 做不好时，瓶颈常常是周围没有一个可测试、稳定、一致的环境，而不是模型；检查够强之后，结果取决于你说得多具体。
- **链接**：[Mihail Eric 的课堂要点帖](https://x.com/mihail_eric/status/2118025723802001796)，Mihail Eric（讲者 Eno Reyes，Factory）。

```
目标：测出这个仓库里 agent 改代码后"拿到反馈"的每一层检查各要多久，把最慢且最常用的那一层缩短，让 agent 一小时内能多试几次。

1. 先读仓库，找出所有检查：pre-commit / pre-push hook、lint、类型检查、单元测试、集成测试、构建、CI 工作流（.github/workflows 等）、以及 CLAUDE.md / AGENTS.md 里要求 agent 跑的命令。列出文件路径作为证据。不要猜命令。
2. 在本地实际运行每一层（CI 只能读配置的，就读最近几次运行记录或配置估算，并标明是估算），记录真实耗时，贴出命令和耗时输出。整理成表：层级、命令、耗时、一小时能跑几次（3600 除以耗时）、它能抓到哪类问题。
3. 找出"agent 每次改动都该跑、但现在只能在慢层才跑到"的检查，例如类型检查只在 CI 里跑、测试只能全量跑。给出缩短方案，优先级是：只跑受改动影响的文件或测试、把快检查前移到 hook 或 agent 的默认命令、缓存。每个方案写清预计节省多少秒，以及会不会漏掉问题。
4. 先给我方案，等我确认后只实现收益最大的一个。实现后重新计时，贴出前后对比；再故意引入一个它应该抓到的错误，证明加速后的检查仍然会失败。
5. 最后把"agent 改动后先跑哪条快命令、什么时候再跑慢的"写进 AGENTS.md（或仓库已有的同类文件），不超过 5 行。

参考：Mihail Eric 转述 Eno Reyes 在 CS146S 的分享 https://x.com/mihail_eric/status/2118025723802001796
```

### 2. 评测题目让 agent 猜出"在考什么"，分数就会失真：OpenAI 发现告诉它"这是测试"没影响，告诉它考点却能把成功率从 63% 拉到 92% 或压到 18%

- **要点**：OpenAI 对齐团队的 Joy Hsu 和 Sam Arnesen 11 月 3 日发文，对比 6 个模型在一个安全评测（看 agent 遇到警告和限制时会不会绕过去）和真实 Codex 使用中相似场景下的表现：6 个模型的评测成功率都比真实场景低，差 10.2 到 37.4 个百分点。模型在评测里有 43.7% 到 66.3% 的回合会在思考中猜"这题在考什么"，真实使用里只有 0% 到 5.9%。干预实验里，只加一句"这是评测"，成功率 63.1% 对 63.4%，几乎不变；加上正确考点升到 91.6%，加上错误考点（"在考你抗提示注入"）跌到 17.6%。对你写 skill 评测的启发是：测试用例要长得像真实使用，不要在题面里泄露"期望行为"，并且要读 trace，看 agent 是不是在猜考点。
- **链接**：[Eval-production behavior gaps in agent safety and the role of eval-awareness](https://alignment.openai.com/eval-production-behavior-gap/)，Joy Hsu、Sam Arnesen（OpenAI）；[Joy Hsu 的发布帖](https://x.com/joycjhsu/status/2117688779964367237)。

```
目标：检查这个仓库里给 agent、skill 或 prompt 写的评测用例，有没有"让被测 agent 猜出考点"或"和真实使用长得不像"的问题，并改成更接近真实场景的写法。

1. 先读仓库，找出所有评测用例：eval 目录、skill 的测试样例、LLM-as-judge 的 prompt、fixture。列出路径。完全没有就告诉我并停下。
2. 对每个用例检查两件事并给出证据（引用原文）：(a) 题面或系统提示里是否直接或间接写出了期望行为，例如"请注意安全""测试你是否会……"、文件名或目录名里带着考点；(b) 它和真实使用差多远：如果仓库里有真实对话记录、日志或 issue，拿 2 到 3 条对照，说明措辞、上下文长度、工具环境哪里不同。
3. 挑 3 个问题最明显的用例，各写一个"去掉考点、贴近真实"的改写版本。不要编造新任务，只改写现有用例的表述和环境。
4. 两个版本各跑至少 3 次（命令先从仓库里确认），贴出通过率；同时在 trace 或输出里搜索 agent 有没有说出类似"这是测试""这题在考"的话，统计出现次数。
5. 交付：问题清单、改写前后的通过率对比、"猜考点"出现次数，以及一条写进评测说明的规则：用例不得在题面中暴露被测行为。差异不明显也如实报告，不要夸大。

参考：Joy Hsu、Sam Arnesen《Eval-production behavior gaps in agent safety and the role of eval-awareness》https://alignment.openai.com/eval-production-behavior-gap/
```

### 3. 不读代码也能把质量守住的前提：把"体感性能"变成每次都能重跑的数字

- **要点**：poteto 11 月 4 日放出她在 AI Engineer Code Summit 演讲的两张幻灯片：她团队代码相关的合并 PR 从 6 月的 809 个涨到 10 月的 10,926 个（5 个月共 23,370 个），她说代码量涨了约 30 倍、而且"不读代码"，性能却比 5 月更好：冷启动 2,669 毫秒降到 1,831 毫秒（-31%），长对话里打字延迟 p90 从 14.2 毫秒降到 5.8 毫秒（-59%）。她把原因归到"对 agent 友好的架构"，帖子里没有展开细节（演讲在 11 月 10 到 12 日）。能直接学的是幻灯片本身的做法：用户能感觉到的性能（启动、首屏、输入延迟的中位数和 p90）有固定的测量方法和基线，所以 PR 再多也能看出变好还是变坏。下面的 prompt 是按这个思路写的做法，不是 poteto 公布的具体方案。
- **链接**：[poteto 的幻灯片帖](https://x.com/poteto/status/2118017093677494706)，lauren (poteto)。

```
目标：为这个项目建立一份"用户能感觉到的性能"基线，做成 agent 每次改动后都能一键重跑、并能判断有没有退步的检查。

1. 先读仓库，弄清这是什么类型的应用（网页、移动端、桌面、CLI、服务），以及已有的性能测量：benchmark 脚本、性能测试、埋点、CI 里的性能任务。列出路径作为证据；没有就直说。
2. 提出 3 到 5 个最贴近用户体感的指标（例如冷启动时间、首屏时间、关键交互的输入延迟、关键接口的 p50/p90），每个写清：怎么测、在什么环境测、为什么它代表用户体验。先给我清单，等我确认。
3. 实现测量脚本：固定环境和输入，每个指标至少重复跑 5 次，输出中位数和 p90，结果写成机器可读的文件（如 JSON），并把当前结果存为基线。贴出真实运行输出和多次运行之间的波动范围。
4. 加一条比较命令：新结果和基线比，超过阈值就失败。阈值根据第 3 步测到的波动来定，并说明理由。故意做一个会变慢的改动（例如加一段人为延迟），证明比较命令会失败，然后撤销。
5. 在 AGENTS.md（或仓库已有的同类文件）里加不超过 5 行：哪些目录的改动必须跑这条性能检查、怎么跑、退步了怎么办。交付：脚本路径、基线文件、运行命令、故意变慢的失败输出、以及测不准或没覆盖到的部分。

参考：poteto 幻灯片帖 https://x.com/poteto/status/2118017093677494706
```

## 本期去重用源链接（机器可读）
- https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html
- https://x.com/mihail_eric/status/2118025723802001796
- https://alignment.openai.com/eval-production-behavior-gap/
- https://x.com/joycjhsu/status/2117688779964367237
- https://x.com/poteto/status/2118017093677494706
- （看过未收）https://x.com/ClaudeDevs/status/2118063143167693011 （Claude Code 后台 subagent 状态行改用 Haiku 写，费用降约 99%，产品更新）
- （看过未收）https://x.com/dexhorthy/status/2118034762040246278 、https://x.com/factory/status/2118033889772155121 （HumanLayer 并入 Factory，公司新闻）
- （看过未收）https://x.com/HamelHusain/status/2118063790935953440 （BenchGate 讨论：基准分被当成信用分用，与 11-04 条目 2 同主题）
- （看过未收）https://x.com/poteto/status/2118073519515025804 （推荐 pstack /statechart skill，10-30 已讲）
- （看过未收）https://simonwillison.net/ 11-03/04 为 datasette-agent 发布与非 agent 工程内容；https://www.anthropic.com/engineering 无新文
