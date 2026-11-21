# Agent 工程实践简报 · 2026-11-08

## 今日概念：Agent memory（agent 记忆）/ Dreaming（做梦整理）

**是什么**：每次新开一个会话，agent 的上下文窗口都是空的。Agent memory 是它从「做过的事、被纠正过的错」里留下来、下次还能读到的知识，通常存成一个会持久保存的记忆文件夹。它不是改模型权重，也不是同一段对话里临时记住的东西，更不是 compaction（把同一会话里的旧回合压成摘要，好腾出空位继续聊）。人的大脑会在睡着时回放白天的经历，把有用的巩固下来；agent 也可以在两次任务之间的空闲时间回头看日志和笔记：改错、写新笔记、建索引，再把最重要的几条「顶」到下次一开场就会自动读到的位置。Anthropic 把这种离线整理叫做 dreaming（做梦），并引用了 Letta 和加州大学伯克利分校提出的 sleep-time compute（睡眠计算）。

**解决什么**：没有跨会话记忆，后台跑的 agent 每次开工都会重踩同样的坑。但记忆写错或写太滥会更糟。文章里 Claude 玩《口袋妖怪》时，旧模型 Sonnet 3.7 把能从屏幕直接读到的状态也记下来，写了 413 个文件、225 个文件夹，后来花大量步数在整理文件而不是玩游戏，只拿到 1 枚徽章；更新的 Fable 5 只写了 9 个文件加一个 `global.md`（当前目标、计划和自己的记忆规则），拿到 4 枚徽章。记错也会被后续会话当真：Claude 把山顶洞穴入口的位置记反了，三次掉下悬崖后几乎放弃；用 dreaming 对照原始会话记录改掉这条笔记后，它直接走回洞穴并到达下一座城。

**和你已会的东西的关系**：CLAUDE.md / AGENTS.md 是你写给 agent 的说明书；memory 是 agent 自己从经验里留下的笔记。Claude Code 的 auto memory 就是这种机制：索引写在 `MEMORY.md` 里，每次会话开始只注入前 200 行或 25KB（先到为准），细节放在按需打开的主题文件里。昨天讲的 background agents 解决的是「人不在时任务继续跑」；dreaming 也是空闲时间里跑，但干的是整理记忆，不是做原来那件事。你要的 software factory 要跨多次触发、多次后台运行还记得教训，靠的就是这类跨会话记忆，而不是把一切塞进越来越长的 prompt。

**入门原文**：[The components of agent memory](https://www.anthropic.com/research/components-of-agent-memory)（Lance Martin / Anthropic Engineering，2026-11-06）；操作对照：[How Claude remembers your project](https://code.claude.com/docs/en/memory)（Claude Code 官方文档，写清了 `MEMORY.md` 的注入上限）。

**上手 prompt**：
```
目标：盘点这个仓库里「跨会话还记得的东西」，分清人写的说明书和 agent 自己留下的经验笔记，并设计一份刚好够用的记忆方案。不要绑定某一家云产品或某一个 agent 品牌。

1. 先读仓库：README、CLAUDE.md / AGENTS.md、已有的 memory / MEMORY.md / 会话笔记 / 经验文档，以及 Claude Code 或同类工具的本地记忆目录（如果这台机器上有）。列出路径。说明当前有没有「下次开新会话还能读到」的经验笔记；没有就直说。
2. 按三列制表：内容类型（例：构建命令、编码约定、被纠正过的偏好、已验证的业务规则、可随时从代码/界面重新读到的状态）、现在放在哪、它更该是人写的说明书还是 agent 写的记忆。能从代码、测试或界面重新读到的状态，标成「不该写入记忆」。
3. 给出最小方案：(a) 人写的说明书继续放哪、写什么；(b) agent 记忆放哪、一篇笔记应包含什么（规则、怎么知道它是对的、已知陷阱）；(c) 每次会话自动读入的索引如何保持短小（对照：Claude Code 只注入 MEMORY.md 的前 200 行或 25KB）。先给我方案，等我确认再改文件。
4. 若动手改了文件：贴出改动前后的目录树和索引原文。再写 1 条故意错误的记忆（例如一条和代码现状相反的规则），说明下次 dreaming / 人工核对时应该怎么抓住它。
5. 交付：对照表、方案、文件路径、以及写进 AGENTS.md 不超过 8 行的「什么该写进记忆、什么不该写、索引太大时怎么办」。

参考：Lance Martin《The components of agent memory》https://www.anthropic.com/research/components-of-agent-memory ；Claude Code 记忆文档 https://code.claude.com/docs/en/memory
```

## 本期条目

### 1. 记忆要写成「已验证的规则 + 依据 + 陷阱」，不要堆未经检验的猜测；更强的模型被要求「只记失败」反而会变差

- **要点**：Anthropic 在 Continual Learning Bench 上让模型每答完一题就往持久记忆目录里写笔记，下一题从全新会话开始、只能靠这些笔记。较弱的 Sonnet 4.6 只写了一堆未检验的猜测；Opus 5 第一次把环闭合：多数条目包含一条规则、它怎么知道这条规则是对的、先前的答案，以及对路上陷阱的警告。他们只告诉模型「有一个记忆文件夹可用」，对更强的模型这就够了；一旦改成「只记录失败」，Opus 5 和 Opus 4.7 从记忆里拿到的提升会少掉一大截。对你的启发是：记忆是对「将来还会用到什么」的预测，写已核对过的规则，不要写成流水账或失败清单。
- **链接**：[The components of agent memory](https://www.anthropic.com/research/components-of-agent-memory)，Lance Martin / Anthropic，2026-11-06。

```
目标：检查这个仓库（或本机 agent 记忆目录）里已有的跨会话笔记，把「未检验的猜测 / 流水账」改成「规则 + 依据 + 陷阱」，并证明一次对照原始记录的纠错能抓住错误笔记。

1. 先读现有记忆：MEMORY.md、主题笔记、经验文档、CLAUDE.md 里被当成「经验」写下的段落。列出路径。完全没有记忆文件就停在这一步，告诉我缺什么，并提议最小的记忆目录结构，不要编造已经存在的笔记。
2. 抽查至少 10 条（不够就全部看完），每条标成四类之一并引用原文：已验证的规则、未检验的猜测、可重新从代码/界面读到的状态、已经过期或自相矛盾。给出各类计数。
3. 把问题最明显的 3 到 5 条改写成闭环格式：规则是什么、根据哪次运行/哪段日志/哪次纠正知道它对、有哪些已知陷阱。删掉或下沉那些能随时重新读到的状态。先给我改写草案，等我确认再写入。
4. 做一次 dreaming 式核对：对照 git 历史、测试输出或会话日志（有哪样用哪样，不要编造 transcript），检查改写后的笔记。另外故意留 1 条和现状相反的错误笔记，跑你的核对称它抓出来，贴出证据，然后再删掉这条错误笔记。
5. 交付：分类表、改写前后对照、核对命令或步骤、抓住错误笔记的证据、以及「禁止只记失败、禁止把可重读状态写入记忆」写进 AGENTS.md 的不超过 6 行说明。

参考：Lance Martin《The components of agent memory》https://www.anthropic.com/research/components-of-agent-memory
```

### 2. 多个 agent 同时写同一份共享记忆页会互相覆盖：一页一个作者、关键事实引用原文

- **要点**：Anthropic 让多个 agent 通过 dreaming 给一批收购合同建 wiki，用来写法律简报。一开始没有告诉它们「合同条款最重要」，几个 agent 同时改同一张共享条款表，结果互相覆盖，57 条应被评分的合同事实只保住 41 条（72%）。后来每个合同由一个 agent 独自写一页，并且条款按原文摘录而不是摘要进共享表，57 条全部保住。同一篇文章里，对约 35 万个内部文件（大约 4.2 亿 token）建 wiki：只用搜索约 53 分，只用 wiki 约 48 分，搜索加 wiki 随着 wiki 变厚从 54 分升到 61 分，每题大约少用 2 万 token。对你并行开工人的启发：共享产物要有明确的单写者，索引和链接可以共享，可写的事实页不要让两个人同时改。
- **链接**：[The components of agent memory](https://www.anthropic.com/research/components-of-agent-memory) 中「Dreaming can focus memory on a specific goal」一节，Lance Martin / Anthropic，2026-11-06。

```
目标：为这个仓库里「多个 agent / 多次并行任务会共同维护」的文档或记忆，改成「每个可写页只有一个作者」，并证明共享可写页真的会丢信息。

1. 先读仓库，找出会被并行任务同时更新的文件：共享笔记、状态页、wiki、经验文档、MEMORY.md、汇总表。列出路径和现在谁在写它们。没有并行维护的文件，就选一个适合拆开的共享文档做演练，并说明为什么选它。
2. 设计规则：(a) 哪些页是只读索引（可以有很多读者、由协调员更新链接）；(b) 哪些页是事实页（每次只允许一个工人写）；(c) 关键事实是原文摘录还是摘要（容易被评分或容易被覆盖的，优先原文摘录）。先给我规则，等我确认。
3. 做一次对照实验并贴证据：准备一份有若干个独立条目的共享页（可以用虚构但结构真实的条目）。第一轮让两个工人（或两次并行编辑）同时改同一页；第二轮改成每人只写自己的分页，再由协调员只更新索引。统计两轮各保住了多少条目。
4. 不要为了实验改生产数据：在隔离目录或 worktree 里做。做完后给出推荐的目录约定。
5. 交付：单写者规则、两轮对照的条目保留数、目录约定、以及写进 AGENTS.md 不超过 6 行的「并行任务禁止同时写同一文件」。

参考：Lance Martin《The components of agent memory》https://www.anthropic.com/research/components-of-agent-memory
```

### 3. 公开榜上挤在同一分数的模型，题目稍改就拉开大差距：给你自己的 eval 也做「轻微改写」变体

- **要点**：Justin Lo 11 月 7 日发布 MaxxBench：把 89 道公开的 DeepSWE 编程题做了小改动（改说明书或起始代码），主工程问题不变。他写道，DeepSWE 上挤在 74% 附近的模型，在 MaxxBench 上会拉开 23 个百分点。我核对了当时的公开榜：Claude Opus 5.5 在 DeepSWE 上 74.2%、MaxxBench 上 76.4%；Gemini 3.8 Flash 在 DeepSWE 上 73.8%、MaxxBench 上 53.4%，两者相差正好 23.0 个百分点。一个具体例子：原题让每个浏览器写自己的报告文件；改写后额外要求文件名全小写，于是 `Chrome__Headless_.xml` 变成 `chrome__headless_.xml`。Hamel Husain 当天转发时说「工业基准综合体正踩在薄冰上」。对你写 skill / agent 评测的启发不是去刷这座新榜，而是：现有用例先保留，再各自做一道「同一问题、要求稍有不同」的变体，看 agent 是改方案还是复读旧答案。
- **链接**：[Justin Lo 的发布帖](https://x.com/loresjpg/status/2118880329490637049)，Justin Lo（@loresjpg）；榜单与例题：[MaxxBench](https://maxxbench.unlap.ai/)；[Hamel 的转发](https://x.com/HamelHusain/status/2119138141793841376)，Hamel Husain。

```
目标：给这个仓库里已有的 agent / skill / prompt 评测补一组「轻微改写」变体，用来检查模型是在解决当前要求，还是在复读它见过的旧解法。

1. 先读仓库，找出评测用例：eval 目录、skill 测试样例、fixture、回放脚本。列出路径。完全没有就停下，告诉我要先有什么，不要编造用例。
2. 从现有用例里挑 5 到 10 道「有明确可观察验收」的题。对每一道只改一处，且改完后主任务仍然成立。优先这类改动：文件名或标识符的大小写/前缀、说明书里多一条约束、起始代码里一个和题面一致的小差异。不要泄露「这题在考你有没有注意改动」。
3. 原题和变体用仓库里已有的命令各跑至少 3 次（命令先从仓库确认）。记录通过率，并检查失败的变体：agent 是忽略了新约束，还是套用了原题的旧答案（例如仍写出旧文件名）。贴出命令和输出证据。
4. 把变体保存在原用例旁边，命名上能看出它是配对的改写，而不是全新题目。再加一条说明：以后新增评测必须同时提供至少一个轻微改写变体。
5. 交付：配对表（原题、改了什么、原题通过率、变体通过率、失败原因）、变体文件路径、以及「分数接近时先看变体是否一起掉下来」写进评测说明的一小段话。差异不明显也如实报告。

参考：Justin Lo / MaxxBench https://x.com/loresjpg/status/2118880329490637049 ；https://maxxbench.unlap.ai/ ；Hamel Husain https://x.com/HamelHusain/status/2119138141793841376
```

## 本期去重用源链接（机器可读）
- https://www.anthropic.com/research/components-of-agent-memory
- https://x.com/AnthropicAI/status/2118814753154064501
- https://code.claude.com/docs/en/memory
- https://x.com/loresjpg/status/2118880329490637049
- https://maxxbench.unlap.ai/
- https://x.com/HamelHusain/status/2119138141793841376
- （看过未收）https://claude.com/resources/articles/improving-skill-creator-test-measure-and-refine-agent-skills （2026-03-03，skill-creator 评测与触发调优；和冻鱼关心的 skill 验证相关，但是旧文，未当本期新条目）
- （看过未收）https://ampcode.com/news/spaces （2026-11-06，昨日已收）
- （看过未收）https://x.com/thorstenball/status/2119046616598343754 （中途换模型/思考力度的观点帖，可照做性弱）
- （看过未收）https://x.com/GeoffreyHuntley/status/2119079022403424657 （同时盯 5–10 个 /goal 循环；与 11-02 Ralph loop 同家族）
- （看过未收）https://x.com/karpathy/status/2119114537442189652 （TristanTube 一次性 demo，非工程实践）
- （看过未收）https://simonwillison.net/2026/Nov/ （近几日为 datasette / LLM CLI / 非 agent 工程）
- （看过未收）https://hamel.dev/ 、https://claude.dev/blog/ 无 11-06 后新文
- （看过未收）https://www.anthropic.com/engineering 索引页 11-06 条即本篇 research 文（昨日只扫了 engineering 列表、未打开 /research）
- （看过未收）CS146S W8 Background Agents 仍是 11/10、11/12，嘉宾 Rajesh Bhatia；W7 Isaac Evans 讲座内容仍待公开
