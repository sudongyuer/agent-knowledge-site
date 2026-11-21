# Agent 工程实践简报 · 2026-11-16

## 今日概念：Code Mode（代码模式）：不让 agent 一次只调一个工具，而是让它写一小段程序，一次调完

**是什么**：平时 agent 用工具是一问一答：调一次 Read，看结果；再调一次 Bash，再看结果。每个中间结果都要塞回上下文给模型读。Code Mode 换了个做法：模型写一段 JavaScript，在里面连着调用好几个工具、把输出过滤好，最后只把需要的那一小部分交回给模型。Claude Code 2.1.323（2026-11-13 06:12，Asia/Kuala_Lumpur 发布）把它做成了实验开关。

**解决什么**：
- 省上下文。Anthropic 工程博客的例子：agent 按需读取工具定义，不再一开始就全部加载，token 从 150,000 降到 2,000，省了 98.7%。中间结果（比如一份 2 小时会议的逐字稿）可以在代码里直接从一个工具传给下一个，不用经过模型。
- 适合一连串相关的操作。官方文档列了三类：在很多文件里做同一种修改；搜索结果要先过滤再读；几条互不依赖的命令同时跑。

**限制**（官方文档原文要点）：
- 实验功能，默认关闭，以后可能改或删。
- 只能在终端里交互式运行 `claude` 时用，`-p`、Agent SDK、VS Code 面板、Desktop 都不行。不能和 agent teams、API key helper、OpenTelemetry 导出、网关或 Bedrock 一起用。
- auto mode 下，分类器审的是整段代码，看不到运行时才算出来的值（比如从搜索结果里拿到的路径）。必须管住的调用，还是要靠 deny 规则和 PreToolUse hook。
- 代码在前台最多跑 10 分钟。
- 项目里的 settings 文件开不了它，只能在自己的 shell 或 `~/.claude/settings.json` 里开。这样克隆来的仓库就没法替你打开它。

**和你已会的东西的关系**：
- 11 月 6 日讲的确定性 hooks 在这里照样生效：代码里的每个工具调用仍会经过你的 deny/ask 规则和 PreToolUse hook。想审代码本身，可以写一个匹配 `REPL` 工具的 PreToolUse hook，从 `tool_input.code` 里读出 JavaScript。注意：hook 起不来或超时，调用会被拒绝。
- 和你写 skill 有关：Anthropic 那篇文章提到，agent 写出来的好用函数可以存成文件，再配一个 SKILL.md，就成了可以反复用的 skill。
- 它本质上也是 context engineering：别让用不上的中间结果挤进上下文。

**入门原文**：[Code execution with MCP: Building more efficient agents](https://www.anthropic.com/engineering/code-execution-with-mcp)（Adam Jones、Conor Kelly，Anthropic，2025-11-04）；Claude Code 官方文档 [Run tool calls from code with Code Mode](https://code.claude.com/docs/en/code-mode)（Anthropic）

**上手 prompt**（先在终端运行 `claude --version` 确认版本不低于 2.1.323，再用 `CLAUDE_CODE_EXPERIMENTAL_CODE_MODE=1 claude` 启动，会话顶部会显示 `Code Mode (experimental) is on`）：
```
目标：在这个仓库里试用 Code Mode，判断它值不值得我常开。只读，不要修改任何文件。

1. 先检查会妨碍 Code Mode 的配置：读取 ~/.claude/settings.json、项目的 .claude/settings.json 和 .claude/settings.local.json，列出所有 PreToolUse 和 UserPromptSubmit hook，写明每个 hook 的 matcher、timeout 和 onFailure。官方文档说，在 Code Mode 下 PreToolUse hook 起不来或超时，工具调用会被拒绝。请标出哪些 hook 有这个风险，以及建议的改法（只给建议，不要改）。
2. 做一个多步骤的只读任务：读取仓库里所有 Markdown 文件，列出指向本地文件、但目标文件不存在的链接。输出表格：所在文件 / 行号 / 链接 / 为什么判断为不存在。
3. 任务完成后报告：你写了几段代码、一共调用了多少次工具、哪些调用是并行跑的、交回给你读的输出大概有多大。把每段代码原样贴出来，好让我对照 Ctrl+O 打开的记录查看。
4. 最后用 3 句话说明：这类任务用 Code Mode 和平时一次调一个工具比，好在哪、差在哪。再列出这个仓库里另外 2 种适合 Code Mode 的任务，每种附上它在仓库里的具体例子（文件路径）。

参考：https://code.claude.com/docs/en/code-mode ；https://www.anthropic.com/engineering/code-execution-with-mcp
```

---

## 本期条目

### 1. 换模型或改 prompt 之前，先写好判定规则，再看「每解决一个任务花多少钱」：Fable 5.2 和 Opus 5.5 通过率差不多，但每解决一个任务的成本是 2.8 倍

- **要点**：Garry Tan 在 g-harness-evals 仓库里公开了一份对比报告。在固定版本的 Claude Code 2.1.322 里，三个模型各把 52 个编程任务做两遍，任务用自带的测试判对错。
  - 通过率：Fable 5.2 是 82.7%，Opus 5.5 是 84.6%。差 -1.9 个百分点，95% 区间是 -9.6 到 +5.8。区间里包含 0，所以结论是「没测出差别」，而不是「Opus 更好」。
  - 成本：每解决一个任务，Fable 5.2 花 $1.83，Opus 花 $0.65，是 2.80 倍（区间 2.05 到 3.99 倍）。结论：Opus 继续当默认编程模型。
  - 做法上值得照抄的三点：一是先写好判定规则再跑（「通过率明显更低，或者每解决一个任务明显更贵，就不换」），这叫预注册，防止看到结果后再改标准。二是报告「这次实验最小能测出多大的差距」：52 题大约是 11.5 个百分点，比这小的差距根本测不出来。三是每个任务跑两遍，并统计两遍结果不一致的比例。
  - 另一个数据点（还在跑，只完成 10%）：Dex Horthy 在 slopcodebench 上测 Anthropic 推荐的那句「you are the long term owner of this codebase」（11 月 11 日讲过）。加上这句后，每个任务用的 token 翻倍，但每个「通过」的成本差不多；加了这句，模型也更常写正式的测试。还看不出结果是否更好。
- **为什么对你有用**：你改 skill、换模型、加一句 prompt 时，只看「这次好像更好了」很容易被噪音骗。按「每个通过花多少钱」和「区间有没有包含 0」去判断，结论才站得住。

```
目标：在这个仓库里建一个最小的 A/B 对比评测，用来判断「换模型 / 改 prompt / 改 skill」到底有没有用。先出方案，等我确认后再写文件，确认前不要跑任何会花钱的调用。

1. 先读仓库，找出可以当评测任务的材料：近期修过的 bug、有测试的 issue、git 历史里「改代码 + 补测试」的提交。挑 20 到 30 个任务，每个任务必须能用仓库里已有或新补的测试自动判对错。列出每个任务的来源（提交哈希或 issue 链接）和判分命令。判分命令要先读仓库确认真实的测试命令，不要猜。
2. 写一个 PREREGISTRATION.md，在跑任何实验之前固定下来：
   - 要对比的两个配置 A 和 B（例如两个模型，或有无某句 prompt）；
   - 判定规则，例如「B 的通过率差值 95% 区间整体低于 0，或每个通过的成本比值区间整体高于 1，就不采用 B」；
   - 每个任务跑几遍（至少 2 遍）、工具版本固定在哪个版本、超时多久。
3. 写运行和统计脚本：每次尝试记录 任务 / 配置 / 第几遍 / 是否通过 / token / 费用 / 用时。统计时输出：
   - 两边的通过率和 95% 区间（按任务做 bootstrap）；
   - 每个通过的平均成本，以及两边的成本比值和区间；
   - 同一任务两遍结果不一致的比例；
   - 按当前任务数，大约能测出多大的通过率差距（最小可检测差距）。
4. 先只用 2 个任务做一次试跑，把原始记录和统计输出贴给我，证明脚本能跑通。
5. 交付：文件清单、试跑输出、完整跑一次的预计费用和时间。并提醒我：区间包含 0 时，结论只能写「没测出差别」。

参考：https://github.com/garrytan/g-harness-evals/blob/cc8619d977f126ddb6d8f03a4b6cd02c5634c1bc/docs/benchmarks/2026-11-12-fable-5-2-coding-cc322/report.md
```

来源：[Fable 5.2 vs Fable 5.1 and Opus 5.5 in Claude Code 2.1.322: report](https://github.com/garrytan/g-harness-evals/blob/cc8619d977f126ddb6d8f03a4b6cd02c5634c1bc/docs/benchmarks/2026-11-12-fable-5-2-coding-cc322/report.md)（Garry Tan，g-harness-evals 仓库）；[Garry Tan 的推文](https://x.com/garrytan/status/2121464508225053153)（2026-11-14 12:45，Asia/Kuala_Lumpur）；[Dex Horthy 的中途结果](https://x.com/dexhorthy/status/2122136000067723334)（2026-11-16 09:13，Asia/Kuala_Lumpur）

### 2. Kent C. Dodds：软件工厂的秘诀是让 agent 吐槽你的代码库；每次手动发 prompt 前，先问自己「怎样才能不用我来发」

- **要点**：Kent C. Dodds 这两天发了两句话。第一句：「软件工厂的秘诀，是让 agent 抱怨它在你的产品或代码库里干活时讨厌什么。」第二句：「下次你开一个 agent 会话、或者给它发 prompt 时，问自己：怎样才能让我不用亲自发这条，也得到同样的结果？这就是搭软件工厂的方法。」
- **怎么理解**：agent 卡住的地方，比如测试命令找不到、文档过期、某个脚本要人手动点，就是你的工厂缺零件的地方。让 agent 每次做完都留一条「阻力记录」，攒够了再统一修。你每次手动发的 prompt，就是下一个该交给触发器或 routine 的候选。11 月 13 日讲过他的 autopilot 打分工具，可以看哪根支柱最弱；这里是日常持续收集的做法。

```
目标：给这个仓库加一个「agent 阻力记录」机制，让 agent 每次干完活都留下它遇到的阻力，方便我定期修掉。先出方案，等我确认后再改文件。

1. 先读仓库：找出 agent 说明文件（AGENTS.md、CLAUDE.md 或同类文件），以及已有的文档目录约定。判断阻力记录放在哪里最合适（例如 docs/agent-friction.md），并说明理由。
2. 给说明文件写一段规则的 diff（不超过 8 行），内容是：每次任务结束前，往阻力记录里追加一条，格式为「日期 / 任务一句话 / 卡在哪 / 花了多少轮才绕过去 / 建议怎么从根上修（改脚本、补文档、加检查、改结构）」。没有阻力就写「无」，不能省略。
3. 现在就补第一批记录：回顾 git log 里最近 20 个提交和仓库现状，亲自试跑一遍安装、构建、测试、lint 的标准流程（先读仓库确认真实命令），把你作为 agent 实际碰到的每个阻力写成记录。每条都要附证据：失败的命令和输出、过期文档的路径和行号，或者自相矛盾的两处位置。
4. 再列出一张「我可能一直在手动发的 prompt」清单：根据仓库里的脚本、CI 配置和提交模式，推断哪些重复操作可以改成由触发器自动启动（例如 PR 打开时、CI 失败时、每天定时）。每条写清触发条件、agent 要做什么、怎么验证它做对了。
5. 输出：说明文件的 diff、阻力记录初稿、按「修了之后省事程度」排序的前 5 个修复建议。等我确认后再动手修。

参考：https://x.com/kentcdodds/status/2122028323555651636 ；https://x.com/kentcdodds/status/2122069021218750527
```

来源：[Kent C. Dodds：让 agent 吐槽代码库](https://x.com/kentcdodds/status/2122028323555651636)（2026-11-16 02:05，Asia/Kuala_Lumpur）；[Kent C. Dodds：怎样才能不用我来发这条](https://x.com/kentcdodds/status/2122069021218750527)（2026-11-16 04:47，Asia/Kuala_Lumpur）

---

## 本期去重用源链接（机器可读）

- https://www.anthropic.com/engineering/code-execution-with-mcp
- https://code.claude.com/docs/en/code-mode
- https://github.com/garrytan/g-harness-evals/blob/cc8619d977f126ddb6d8f03a4b6cd02c5634c1bc/docs/benchmarks/2026-11-12-fable-5-2-coding-cc322/report.md
- https://x.com/garrytan/status/2121464508225053153
- https://x.com/dexhorthy/status/2122136000067723334
- https://x.com/kentcdodds/status/2122028323555651636
- https://x.com/kentcdodds/status/2122069021218750527
- （看过未收）https://x.com/marcos_placona/status/2122019312915669299 （CLAUDE.md 软链到 AGENTS.md，在不支持软链的检出里会变成 9 字节文本；10-29 已讲 @AGENTS.md 导入）
- （看过未收）https://x.com/notTruckpr/status/2122070939940561052 （/doctor prompt-audit，11-15 综述已讲）
- （看过未收）https://x.com/bobm67/status/2121979605913321522 （Downloads 里的 AGENTS.md 劫持 Codex，10-29 已讲）
- （看过未收）https://x.com/0xsdy/status/2121738906785796528 （Anthropic harness design 三 agent 复述，11-15 综述已讲）
- （看过未收）https://x.com/dexhorthy/status/2121660606256435325 （No AI Slop Manifesto，理念宣言，无可照做的步骤）
