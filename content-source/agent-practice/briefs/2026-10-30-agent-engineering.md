# Agent 工程实践简报 · 2026-10-30

## 今日概念：Trunk-based development（主干开发）

**是什么**：所有人（和所有 agent）都直接往主分支 main 提交小改动，不开活好几天的功能分支。大改动拆成一串各自能编译、能跑、测试能过的小提交，一个一个合进去；还没做完的功能先藏在 feature flag（功能开关）后面。

**解决什么**：长寿分支会和 main 越走越远，最后合并变成一场灾难。主干开发让系统一直在"流动"，每次只集成一点点，出问题也只影响一小块。

**和你已会的东西的关系**：你现在大概是"开分支 → 开 PR → 合并"。Thorsten Ball 的观点是：以前主干开发难在拆分、加开关、兼容两种配置这些"元编程"体力活，现在这些恰好是 agent 最擅长的，所以门槛大降。它也和你想做的 software factory 直接相关：并行 agent 越多，长分支冲突越多，小步快合越重要。

**入门原文**：[Trunk Based Development 官网](https://trunkbaseddevelopment.com/)；agent 视角看 [Thorsten Ball 的帖子](https://x.com/thorstenball/status/2115852581364801911)（作者 Thorsten Ball）。

**上手 prompt**：
```
我想把手上这个功能改成"主干开发"的方式交付：拆成多个小提交，每个都能单独安全合进 main。
1. 先读仓库，确认实际的构建、类型检查、测试命令（看 package.json / Makefile / CI 配置等），不要猜。
2. 读懂我要做的功能（见下方描述），给出一个拆分计划：每一步是什么、为什么单独合进去是安全的（例如：先加字段/接口但不使用；新代码放在 feature flag 后面且默认关闭；新旧两套路径并存再逐个迁移）。
3. 只实现第 1 步，跑完上面确认过的检查命令。
验收标准：拆分计划里每一步都写明"合进 main 后线上行为是否变化"；第 1 步的 diff 小且独立；贴出检查命令的真实输出作为证据。不要一次性实现全部步骤。
功能描述：<在这里写>
```

## 本期条目

### 1. 让 agent 生成的标题、摘要、看板文字更好读：五条规则，可以直接做成 skill

Shreya Shankar 总结了批量生成 AI 文字的五条规则：每条以主语或动词开头（主语都一样就直接用动词）；把能区分各条的词放最前面；所有条目用同一句式、同一概念只用一个词；只在有意义时才制造差异；动词的褒贬要和看板用途一致。Hamel Husain 的用法是让 Codex 按这篇文章重命名项目里所有任务，方便以后找。

```
请把下面这篇文章的规则做成一个可复用的 skill，并用它整理本仓库里 agent 生成的文字。
原文：https://fsdatalab.github.io/blog/agent-text-at-scale/ （先完整读一遍，规则以原文为准）
1. 写一个 SKILL.md：name、description（写清什么时候用：生成会话标题、任务名、列表摘要、看板卡片等成批文字时），正文列出五条规则，每条配一个"改前/改后"例子。保持简短，不超过 60 行。
2. 在仓库里找出 agent 或脚本批量生成的文字（例如任务标题、changelog 条目、PR 标题模板、看板文案），挑 10 条按规则改写。
验收标准：输出一张"原文 | 改写 | 用了哪条规则"的表；改写后所有条目句式一致，区分信息在前两个词内；说明 SKILL.md 放在哪个路径。不要改任何业务逻辑。
```

原文：[Five Principles for Generating Readable AI Text in Bulk](https://fsdatalab.github.io/blog/agent-text-at-scale/)（作者 Shreya Shankar）；用法来自 [Hamel Husain 的帖子](https://x.com/HamelHusain/status/2115918321141109029)

### 2. 用状态图 + 模型检查找出状态机里的真 bug

poteto 宣布 pstack v0.15.36 里的 /statechart skill 已稳定：它把系统建成 TLA+ 模型去检查，再画成 Mermaid 状态图，适合和 /create-formal-verification-skill 搭配，用来找状态机和分布式系统里的 bug。她贴出的图里就有用它刚找到的两个真实 bug。登录流程、支付、离线同步、重试这类"状态多"的逻辑最适合用它。

```
我想检查本仓库里某段"有很多状态"的逻辑有没有隐藏 bug（例如登录/会话、离线同步、上传重试、订单或支付状态）。
1. 先在仓库里找出一个这样的状态机，列出它的所有状态、触发状态变化的事件、以及应该永远成立的规则（例如"未登录时不能发请求""同一条消息不会发两次"）。每条都标出对应的源码位置。
2. 用 TLA+（或你能运行的同类模型检查工具）把它建模，跑模型检查，找出违反规则的最短路径。
3. 把状态和违规路径画成 Mermaid stateDiagram。
验收标准：贴出模型文件、检查工具的真实运行输出、Mermaid 图；每个疑似 bug 都要回到源码确认是否真的能发生，并标注"已在代码里确认 / 只是模型问题"。先不要改代码。
```

原文：[poteto 的帖子](https://x.com/poteto/status/2115880102601101414)（作者 lauren / poteto）

### 3. 一个极端案例：agent 直接改线上代码、每小时发版，靠什么不翻车

Jacob Sansbury 写了 Spawn 团队怎么让一群 agent 自主开发产品，Simon Willison 称之为 agentic engineering 最前沿的案例。可借鉴的机制有：agent 之间不互相通知，通过代码本身协作（原文叫 stigmergy）；改动合入前，agent 只自己跑代码、用产品验证，完整测试套件每 15 分钟对最新代码跑一次；合入前由没写这段代码的辅助 agent 专门试着搞坏它；任何坏了的东西都当场派一个 agent 去修；付款这类无法撤销的外部操作只走少量写死的硬闸门。他们说过去一年 123,548 个改动里只回滚了 1,055 个（约 0.9%）。Simon 也提醒，这种做法放到出错代价更高的软件上未必行得通。

```
请帮我评估本仓库离"agent 自己发现问题、自己修"的闭环还差什么，只出报告，不改代码。
参考原文：https://x.com/jsnnsa/status/2115623382721126826
1. 读仓库和 CI 配置，确认实际的测试/构建/部署命令和触发方式。
2. 按这几项逐一打分（有 / 部分有 / 没有），每项都附文件路径作为证据：
   a. 错误和日志能不能被 agent 以纯文本方式读到并重放；
   b. 有没有"改动后自动跑、失败就能定位到最近改动"的测试节奏；
   c. 有没有让另一个 agent 或 reviewer 专门找茬的步骤；
   d. 哪些操作是不可逆的（付款、发消息、删数据、发版到应用商店等），它们有没有写死的人工或规则闸门；
   e. 回滚一次改动要多久、要几步。
3. 给出 3 个改进点，按投入从小到大排序，每个写清验收标准。
验收标准：每个判断都有文件路径或命令输出作证；对没有证据的项明确写"未找到"，不要推测。
```

原文：[How I Built the Most AI-Pilled Company in the World](https://x.com/jsnnsa/status/2115623382721126826)（作者 Jacob Sansbury）；点评见 [Simon Willison 的帖子](https://x.com/simonw/status/2115821668350435645)

## 本期去重用源链接（机器可读）
- https://trunkbaseddevelopment.com/
- https://x.com/thorstenball/status/2115852581364801911
- https://fsdatalab.github.io/blog/agent-text-at-scale/
- https://x.com/sh_reya/status/2115860470175612997
- https://x.com/HamelHusain/status/2115918321141109029
- https://x.com/poteto/status/2115880102601101414
- https://x.com/jsnnsa/status/2115623382721126826
- https://x.com/simonw/status/2115821668350435645
