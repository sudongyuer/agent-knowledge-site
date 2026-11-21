# Agent 工程最佳实践综述 · 2026-11-15

这次按主题整理目前社区公认的 agent 工程做法，一共 7 条。每条都有原文出处，并附一段可以直接复制给 Claude Code 或 Codex 的 prompt。以前简报讲过的内容只用一句话指回原日期，篇幅留给以前没讲过的做法和新证据。

**已经讲过的，这次不重复：**
- 错误分析和 LLM 评委对齐人工标注：见 10-27 的三个月总结。
- Hillclimbing：11-01。
- 确定性 hooks：11-06。
- 「永远不要……」越积越多：11-11。
- 删掉 90% 的 harness：11-13。
- 说明书里的规则要么一直被遵守，要么从来没被遵守：11-14。
- Ralph loop：11-02。
- agent harness：11-10。
- 1,000 个 agent 证明费马定理的协作细节：11-11。
- ADR：11-13。

---

## 一、Evals（评测）

### 1. 评测集从 20–50 个真实失败开始。每题要有参考答案，判结果而不是判步骤，同一题跑多次，同时看 pass@k 和 pass^k

**要点**：Anthropic 这篇是目前讲 agent 评测最常被引用的入门文章。和以往讲过的错误分析相比，它补了几条具体做法：

- **起步规模**：不用等攒够几百道题，20–50 道来自真实失败的简单题就够起步。早期每次改动效果明显，小样本就看得出来。
- **参考答案**：每道题配一份「参考答案」，也就是一份已知能通过所有判分的输出。它能证明题目可解，也能证明判分逻辑配置对了。
- **判结果，不判步骤**：要求 agent 按固定顺序调用工具，测试会很脆，因为 agent 常常找到出题人没想到的正确做法。
- **两类评测分开**：
  - 「能力评测」问的是「能不能做到」，通过率本来就该低。
  - 「回归评测」问的是「以前会的还会不会」，通过率应接近 100%。
  - 能力评测的分数稳定变高以后，就把它「毕业」，转进回归评测。
- **同一题跑多次**：
  - **pass@k**：k 次里至少成功一次的概率。
  - **pass^k**：k 次全部成功的概率。
  - 单次成功率 75% 时，连跑 3 次全过的概率只有约 42%。
- **0 分先查题**：前沿模型跑 100 次都是 0 分，通常说明题目或判分坏了，不是 agent 不行。文中举例，Opus 4.5 在 CORE-Bench 上起初只有 42%。修掉判分 bug（比如要求 "96.124991…" 却判 "96.12" 为错）、换了限制更少的 harness 之后，分数升到 95%。

**术语**：
- **trial**：同一道题的一次独立运行。
- **transcript**：一次运行的完整记录，包括每次工具调用和中间结果。

**来源**：[Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)，Anthropic，作者 Mikaela Grace、Jeremy Hadfield、Rodrigo Olivares、Jiri De Jonghe，2026-01-09。

```
目标：为「我在这个仓库里让 coding agent 修 bug」这件事建一个小型评测集，能看出改 CLAUDE.md / AGENTS.md / skill / 模型之后，agent 是变好还是变坏。先出方案，等我确认再写文件、再跑。

1. 从 git 历史里挑 20 个「真实修过、并且修复时加了测试」的 bug（先列候选清单给我看：commit 哈希、改了哪些文件、新增了哪些测试）。挑不到 20 个就有几个算几个，说明原因。
2. 对每个候选做两项检查并贴出命令输出：(a) 切到修复前的 commit，新增测试确实失败；(b) 切到修复后的 commit，测试通过。这个修复后的版本就是「参考答案」。两项有一项不成立的题目剔除，并写明理由。
3. 每道题写成：任务描述（只写症状和「修好」的标准，不能泄露修法）、判分命令（只看测试结果，不检查 agent 走了哪些步骤）。把题目分成两组：「回归组」放你判断 agent 现在应该稳定能做对的，「能力组」放较难的。
4. 先挑 3 道题试跑：每道题在独立的 git worktree 里跑 3 次，每次都从干净环境开始。记录每次是否通过、轮数、token 或费用。试跑成本报给我，我确认后再跑全部。
5. 输出一张表：题目 / 分组 / 3 次结果 / pass@1 / pass^3。再按分组汇总。
6. 对每道 3 次全错的题，读 transcript，判断是「agent 真的做错了」还是「题目描述有歧义或判分有 bug」，各贴一段证据。后一种要先修题。
7. 跑完删除所有临时 worktree，贴出 git worktree list 和 git status，证明主工作区没被改动。

参考：Anthropic《Demystifying evals for AI agents》https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
```

### 2. 让 AI 替你读 trace 找问题：最好的工具能找回人工发现问题中的 87%，但「看起来没问题、其实没达到产品目标」的失败全都漏掉了。人要留在循环里

**要点**：Hamel Husain 和 Antaripa Saha 做了一个对照实验。数据是一个真实公寓租赁 AI 的 100 条生产 trace，领域专家先人工标出 39 个失败。然后把标注藏起来，让 3 个评测平台自带的 agent 和 3 个 coding agent 用同一段 prompt 自己找问题。

- **找回率**：最好的找回了 87.2% 的人工标注失败。Codex 和 Factory Droid 都是 84.6%，Claude Code 是 79.5%。
- **意外收获**：每个系统都多找到 17–20 个人工漏掉的小问题。
- **误报**：每个系统有 3–14 条误报。
- **全都漏掉的**：只看 trace 时显得「一切正常」的失败。比如：
  - 客户一提异议，agent 就放弃，没有去争取。
  - 在短信里用了 Markdown，用户手机上看到一堆星号和井号。
  - 该转人工的对话没有转。
- **为什么会漏**：这些标准往往是读了 trace 之后才意识到的，作者称之为 criteria drift（标准漂移）。没有一个工具会反过来问用户「什么算好」。

作者的建议：人先自己标注，让 agent 在旁边学你的标注，归纳出失败分类，再去其余 trace 里找疑似案例，交给你确认或驳回。

（作者也提醒：样本只有一个数据集、39 个失败，系统之间的差距只来自少数几条 trace，不能拿来给厂商排名。）

**来源**：[Do Automated Evals Work?](https://parlance-labs.com/blog/posts/auto-evals/)，作者 Antaripa Saha、Hamel Husain（Parlance Labs），2026-07-11。

```
目标：用「我标注、agent 学习并找疑似案例」的方式，给我能拿到的 agent 运行记录做一轮错误分析，而不是让 agent 一次性自己下结论。全程数据只留在本机，不上传到任何外部服务。先出方案，等我确认再写文件。

1. 先盘点我手上有哪些 agent 运行记录可用（例如 CI 里 agent 任务的日志、导出的 agent 会话、被打回的 PR 及其评论），列出路径、条数和格式。没有就停下来，告诉我需要先收集什么。
2. 写一个最小的本地标注工具（单个 HTML 文件或命令行脚本都行）：一次显示一条记录，我可以写一句「哪里不对」或标「没问题」，结果存到本地 JSON。贴出启动命令。
3. 我先标 20 条。标完后，你只根据我的标注归纳失败分类：每类写定义，并列出我标注里的 2 条原文作为例子。不准加我的标注里没有体现的类别。
4. 用这个分类去扫剩下的记录，每类找出最多 5 条「疑似」案例，每条要引用具体的轮次或工具调用作为证据，交给我逐条确认或驳回。
5. 根据我的确认和驳回，更新分类定义，然后报告：你提出的疑似案例里，我确认了多少条，驳回了多少条；被驳回的主要是哪种误判。
6. 最后列出你认为「只看记录判断不出来、需要我补充产品背景」的地方，以问题的形式问我。

参考：Antaripa Saha、Hamel Husain《Do Automated Evals Work?》https://parlance-labs.com/blog/posts/auto-evals/
```

---

## 二、Skill / prompt 的精简与迭代

### 3. 官方现在列了一张「可以不用再做的事」清单。说明书只写 agent 读代码也得不到的信息；同一个错误纠正了两次，就做一次复盘，并把机械性规则改成检查

**要点**：Claude Code 官方的 Best practices 页面现在是这样定规矩的：

- **两个问题**：
  - 「它读代码能不能找到这个信息？」
  - 「它真的会去找吗？」
  - 两个都是「是」，就别写进 CLAUDE.md。
- **CLAUDE.md 只留四类内容**：
  - 怎么验证工作：精确的测试、类型检查、lint 命令，以及怎么只跑一个测试文件。
  - 代码里容易误导人的地方。
  - 不在仓库里的团队决定。
  - 已经纠正过两次的事。
- **用 `/init` 和 `/doctor` 删减**：`/init` 生成初稿之后，主要工作是删行，官方的 memory 指南建议控制在 200 行以内。`/doctor` 会建议删掉 Claude 能自己从代码里得出的内容。`/doctor prompt-audit` 会标出为旧模型写的、指向已不存在的文件的、或者彼此矛盾的指令。
- **只在某个目录生效的规则**：放进 `.claude/rules/`，用 `paths:` 限定范围，agent 只有在处理那个目录时才会加载。
- **团队流程**：写成 skill。有副作用的流程（比如发版）加上 `disable-model-invocation: true`，这样只有你手动输入命令时才会运行。

**「可以不用再做的事」清单里的几条**：
- **不用再加 IMPORTANT 或全大写来强调**：加多了反而会让 Claude 过度执行。真不能有例外的规则就改成 hook 或 deny 规则；规则淹没在长文件里，就把文件改短。
- **不用再写 think hard 这类词**：它们只是普通文字。真正控制思考深度的是 effort 设置；只有 `ultrathink` 还能让单轮多想一些。
- **不用再叫它「别偷懒、一直干到完」**：这种话更容易导致做过头。给它一个能跑的检查才有用。
- **不用在 CLAUDE.md 里描述架构和目录结构**：Claude 自己会读仓库。

**怎么迭代**：
- **OpenAI 的 Codex 最佳实践**：同一个错误 Codex 犯了两次，就让它做一次复盘（retrospective），然后更新 AGENTS.md。
- **Matt Pocock 的 retro skill**：把复盘拆成导航、自动检查、编码规范、工具开销、无效指令（no-ops）等几类。
  - **机械性的违规直接做成确定性检查，不写成规则**：比如禁用某个 API、固定的 import 写法、文件必须放在哪。
  - **编码规范交给 reviewer 执行，不交给写代码的 agent**：写代码的 agent 上下文压力最大，reviewer 只需要看 diff。

**来源**：
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)（Anthropic，Claude Code 文档）
- [Best practices](https://learn.chatgpt.com/guides/best-practices)（OpenAI，Codex 指南）
- [mattpocock/skills 里的 retro skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/retro/SKILL.md)（Matt Pocock）

```
目标：按 Claude Code 官方 Best practices 的标准，审计这个仓库里所有给 agent 读的说明（CLAUDE.md、AGENTS.md、.claude/rules/、各类 SKILL.md，以仓库里实际存在的为准），把它们变短、变准。只读分析，等我确认后再改。

1. 先读 https://code.claude.com/docs/en/best-practices ，重点读「Tell Claude what it can't see」「Enforce the rules that can't have exceptions」「What you can stop doing」三节。找出仓库里所有说明文件，贴出每个文件的路径和行数（wc -l）。
2. 逐条检查每一行，归入以下一类，并写一句理由：
   - 保留：agent 读代码得不到（团队决定、误导性代码、验证命令、已纠正两次的事）
   - 删除：agent 读代码就能得到（目录结构、架构描述、通用编程常识），或者属于官方清单里的过时写法（IMPORTANT/全大写强调、think hard、「别偷懒一直干」）
   - 改成确定性检查：不能有例外的机械性规则（写出具体是 hook、deny 规则、lint 规则还是 CI 检查，以及大致长什么样）
   - 改成按目录加载的规则或 skill：只在某个目录或某个流程才用到的内容
   - 交给 reviewer：属于判断性的编码规范，在审查时用而不是写代码时用
3. 用 git log 和 PR 评论（如能读到）找证据：哪些错误被纠正过两次以上，但说明文件里还没写。列出来，并给出建议写法。
4. 输出一张表：原文 / 文件和行号 / 归类 / 理由；再给出修改后的说明文件草稿和预计的行数变化。不要动任何文件。
5. 我确认后再改。改完验证：如果是 Claude Code，提醒我在会话里跑 /context all 和 /doctor prompt-audit 并把输出贴回来；如果是 Codex，用 codex 让它列出加载了哪些指令文件。最后贴出 git diff。

参考：Anthropic《Best practices for Claude Code》https://code.claude.com/docs/en/best-practices ；OpenAI Codex《Best practices》https://learn.chatgpt.com/guides/best-practices ；Matt Pocock retro skill https://github.com/mattpocock/skills/blob/main/skills/engineering/retro/SKILL.md
```

---

## 三、Context engineering（上下文工程）

### 4. 给项目建一份「统一语言」词汇表 GLOSSARY.md：一个概念只用一个词，人、agent 和代码都这么叫

**要点**：「统一语言」（ubiquitous language）是领域驱动设计（DDD）里的一个老概念：开发者、业务方和代码说同一套词。Matt Pocock 11-11 发帖说，他的课里最让学员惊讶的不是 agent 相关的内容，而是 DDD：建立统一语言，和 agent 对话时用它，再按它重构代码。他的 skills 仓库 README 解释了这样做的好处：agent 被丢进一个项目后要边做边猜行话，所以经常用 20 个词说 1 个词就能说清的事。仓库里举的例子是这样的：

- **之前**：「把某个 section 里的 lesson 变成 'real'（也就是在文件系统里给它分配位置）时出了问题」
- **之后**：「materialization cascade 出了问题」

README 还说，有了统一语言，变量、函数和文件的命名都会一致，agent 更容易在代码库里找东西，思考时也更省 token。

他的 domain-modeling skill 有几条规定：
- **词汇表只放定义**：GLOSSARY.md 里不能有实现细节，也不能拿它当 spec 或草稿本。
- **当场纠正用词**：用户的用词和词汇表冲突时，立刻指出来。模糊的词要换成精确的规范词，比如「account」到底指 Customer 还是 User。
- **和代码对照**：用户描述的规则和代码不一致时，直接指出矛盾。
- **ADR 少写**：只有在决定「难以撤回、没有上下文会让人意外、确实是在几个方案间权衡后选的」这三条都满足时，才建议写 ADR。

这和 Anthropic 对 context engineering 的定义一致：找到「最少、但信号最强的那组 token」。

**来源**：
- [Matt Pocock 的帖子](https://x.com/mattpocockuk/status/2120503390333768170)（2026-11-11）
- [mattpocock/skills](https://github.com/mattpocock/skills) README 和 [domain-modeling skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md)（Matt Pocock）
- 原则出处：[Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)（Anthropic Applied AI 团队）

```
目标：为这个仓库建立一份「统一语言」词汇表 GLOSSARY.md，让我、agent 和代码对同一个业务概念用同一个词。先出草稿和问题清单，等我确认再写文件，不改任何代码。

1. 读代码（类型定义、数据模型、路由、主要模块名）、README、已有文档和最近 50 个 commit message，找出项目里的业务概念。对每个概念，列出它在代码和文档里出现过的所有叫法，以及出现位置（文件:行号）。
2. 找出三类问题，各给证据：
   (a) 同一个概念有多个名字（例如 user / account / member 混用）
   (b) 同一个名字指不同的东西
   (c) 文档的说法和代码的实际行为矛盾（例如文档说可以部分取消，代码只支持整单取消）
3. 对每个有歧义的地方，用选择题的形式问我该用哪个词、它的边界在哪里。可以举具体的边界场景帮我判断。我回答之前不要替我决定。
4. 根据我的回答起草 GLOSSARY.md：每个词写一句定义、它「不是」什么、以及要避免的同义词。不写任何实现细节，不写成 spec。
5. 列出「如果统一用词，需要改名的代码位置」清单，按影响范围排序，只列出来、不动手。
6. 只有当某个决定同时满足「难以撤回、没有上下文会让人意外、确实是在几个方案间权衡后选的」三条时，才建议我写一篇 ADR，并说明这三条分别怎么满足。
7. 写入后，在 CLAUDE.md 或 AGENTS.md 里加一行指向 GLOSSARY.md 的指针（措辞先给我看），贴出 git diff。

参考：Matt Pocock domain-modeling skill https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md ；Matt Pocock 帖子 https://x.com/mattpocockuk/status/2120503390333768170
```

---

## 四、Claude Code / Codex 工作流

### 5. 让 agent 无人看管地跑之前，先回答五个问题。「做完」交给 Stop hook 把关，并行任务各开一个 worktree

**要点**：Claude Code 官方文档列了无人看管运行前要回答的五个问题：
1. 它知道什么算做完吗？比如一个目标条件、一份 spec，或者一个要变绿的失败测试。
2. 它能检查自己的工作吗？
3. 它能碰哪些东西？
4. 什么会让它停下来？比如 `--max-turns`、`--max-budget-usd` 或开销上限。
5. 结果交到哪里，由谁拍板？

文档里几个具体做法：
- **Stop hook**：agent 每次想结束这一轮时，自动运行你的脚本。脚本以退出码 2 结束，agent 就会被打回去继续干，stderr 里的内容会作为原因交给它。官方示例是 `pnpm tsc --noEmit 1>&2 || exit 2`。连续拦截 8 次都没有新的工具调用时，Claude Code 会放行。这比在 CLAUDE.md 里写「结束前跑一下类型检查」可靠，因为后者只是「大多数时候」会被遵守。
- **worktree 补齐被忽略的文件**：新 worktree 里没有 `.env` 这类被 gitignore 的文件，可以在仓库根目录建一个 `.worktreeinclude`（语法同 `.gitignore`），让这些文件自动复制进每个新 worktree。只放小文件，`node_modules` 这类大目录不要放。
- **纠正两次就重来**：同一件事纠正两次还不对，就 `/clear`，然后把学到的东西写进一条新 prompt，别再纠正第三次。
- **独立审查**：用 `/code-review`，或者另开一个会话来审。不要让写代码的那个会话自己审，因为它会被自己的推理带偏。

OpenAI 的 Codex 最佳实践建议每条 prompt 写清四件事：目标（Goal）、上下文（Context）、约束（Constraints）、什么时候算完成（Done when）。它列的常见错误包括：
- 多个任务在同一批文件上同时跑，不用 git worktree。
- 手动跑还不稳定，就设成定时任务。
- 一个会话从头用到尾，导致上下文越来越臃肿。

**以前讲过的**：PostToolUse 自动格式化 hook 和用 worktree 并行，见 10-27 三个月总结；需要人批准的操作直接拒绝，见 11-09。

**来源**：
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)，「Let Claude run without you」「Give Claude a check to run」「Run sessions in parallel」三节（Anthropic）
- [Best practices](https://learn.chatgpt.com/guides/best-practices)（OpenAI，Codex 指南）

```
目标：为这个仓库准备一套「可以放心让 agent 自己跑」的最小配置：一个确定性的完成检查，加上并行 worktree 的准备。先出方案，等我确认再写文件。

1. 读仓库，找出真实存在的验证命令（类型检查、lint、单测，以及怎么只跑一个测试文件）：从 package.json、Makefile、CI 配置等处读取，贴出原文。不准编造脚本名。挑一个最快、最能代表「代码没坏」的检查，实际跑一次，贴出耗时和输出。
2. 确认我用的工具和版本（claude --version 或 codex --version）。
   - 如果是 Claude Code：起草 .claude/settings.json 里的 Stop hook，命令是「上一步选定的检查，失败时把输出写到 stderr 并 exit 2」。参考 https://code.claude.com/docs/en/best-practices 里的写法。
   - 如果是 Codex：说明它没有同等的 Stop hook，改为起草 AGENTS.md 里的「Done when」段落，并在报告里写明这只是建议、不是强制。
3. 列出这个仓库新开 worktree 后缺少的、被 gitignore 的小文件（例如 .env.example 对应的 .env），起草 .worktreeinclude。不准包含 node_modules 等大目录，也不要把任何密钥内容贴给我，只列文件名。
4. 针对「让 agent 无人看管跑一个任务」，按五个问题各写一句我们仓库的答案：做完的标准 / 怎么自检 / 能碰什么 / 什么时候停（turn 上限或预算上限）/ 结果交到哪、谁批准。
5. 我确认后再写入。验证：新开一个 worktree，故意引入一个类型错误，让 agent 尝试结束，贴出 Stop hook 拦截的输出；再修好，贴出放行的输出。最后删除这个 worktree，贴出 git worktree list 和 git status。

参考：Anthropic《Best practices for Claude Code》https://code.claude.com/docs/en/best-practices ；OpenAI Codex《Best practices》https://learn.chatgpt.com/guides/best-practices
```

---

## 五、多 agent 编排

### 6. 多个 agent 并行之前，先把测试改成「给 agent 看的」：输出要短，错误能被 grep 搜到，要有快速抽样模式，任务也要能拆开

**要点**：Nicholas Carlini 让 16 个 Claude 在一个共享仓库里并行，从零写一个 Rust 版 C 编译器。数字如下：
- 规模：将近 2,000 个 Claude Code 会话，花了接近 2 万美元。
- 产出：10 万行代码，能编译 Linux 6.9（x86、ARM、RISC-V），在大多数编译器测试套件上通过率 99%。
- 协作方式：没有总调度 agent。每个 agent 往 `current_tasks/` 写一个文件来「锁」住一个任务，靠 git 同步来避免两个 agent 抢同一个任务。

他说大部分精力花在「agent 周围的环境」上：

- **测试必须近乎完美**：判卷有漏洞，agent 就会去解错的问题。后期新功能老是弄坏旧功能，他就加了 CI 和更严格的检查，让新提交不能破坏已有代码。
- **别污染上下文**：
  - 测试只在屏幕上打几行，详细内容写进日志文件。
  - 出错的行以 `ERROR` 开头，原因写在同一行，这样 grep 一下就能找到。
  - 汇总统计提前算好，不让 agent 自己去算。
- **agent 没有时间感**：放着不管，它会花好几个小时跑测试。所以默认提供 `--fast` 选项，只跑 1% 或 10% 的随机样本。抽样对每个 agent 是固定的，不同机器之间是随机的，这样整体仍覆盖全部文件，每个 agent 又能准确发现回归。
- **并行要能拆**：有很多独立的失败测试时，每个 agent 各挑一个就行。编译 Linux 内核却是一个整体任务，16 个 agent 撞上同一个 bug，修完还互相覆盖。他的解法是拿 GCC 当「已知正确的参照」：随机让大部分文件用 GCC 编译，只把剩下的交给自己的编译器，这样就能定位是哪些文件出的问题，让各个 agent 去修不同文件里的 bug。
- **分工**：专门安排一个 agent 合并重复代码，一个优化编译器本身的性能，一个改进生成代码的效率，一个以 Rust 开发者的视角改结构，一个写文档。

**以前讲过的**：Router–Worker（11-03）、黑板架构（11-11）、1,000 个 agent 的费马证明（11-11）。

**来源**：[Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)，Nicholas Carlini（Anthropic Safeguards 团队），2026-02-05。

```
目标：让这个仓库的测试输出更适合 agent 读，为以后多个 agent 并行修问题做准备。先只读评估，等我确认再改。

1. 找出仓库的测试入口（package.json scripts、Makefile、CI 配置等，贴出原文），完整跑一次，记录：总耗时、输出的行数和字节数（例如用 2>&1 | wc -l 和 wc -c）、失败信息在输出中的位置。如果全量测试超过 10 分钟，先只跑一个子集并说明。
2. 按以下标准逐项评估，每项给「符合 / 不符合」和证据：
   (a) 正常情况下，屏幕输出是否只有几行摘要，详细内容写进日志文件
   (b) 每个失败是否单独一行，以固定前缀（如 ERROR）开头、原因写在同一行，能被 grep 一次找到
   (c) 是否在最后给出汇总统计（通过 / 失败 / 跳过的数量）
   (d) 是否有快速模式，能按固定种子只跑一部分测试（不同种子覆盖不同子集）
   (e) 失败的测试之间是否相互独立，能不能分给不同的 agent 各修一个
3. 对不符合的项，给出最小改动方案：优先用测试框架自带的 reporter 或参数，其次才写一个包装脚本。写出具体文件和改法，不要动现有测试的断言。
4. 我确认后再改。验证：分别用改前和改后的方式跑同一组测试，贴出两次的输出行数对比；再故意让一个测试失败，贴出用 grep ERROR（或你选的前缀）找到它的输出；如果加了快速模式，用两个不同的种子各跑一次，贴出两次跑的测试不完全相同的证据。
5. 贴出 git diff，不要提交。

参考：Nicholas Carlini《Building a C compiler with a team of parallel Claudes》https://www.anthropic.com/engineering/building-c-compiler
```

---

## 六、自动验证闭环

### 7. 「做完」要由结构保证，不能靠 agent 自己说：每项功能默认标为失败，没打开过证据就不准改成通过；验收交给一个没参与构建、也没有写权限的 evaluator

**要点**：这是 Anthropic 关于长时间运行 agent 的两篇文章，加上一个配套示例仓库。

- **2025-11 那篇的发现**：Claude 常常只跑了单元测试或 curl 就宣布功能完成，其实端到端根本不通。所以要先写一份功能清单，全部默认标为「未通过」，每次只做一项，每轮结束提交 git 并更新进度文件。文中说，用 JSON 写清单比用 Markdown 更不容易被模型乱改。
- **2026-03 那篇的三个 agent**：
  - planner（规划者）：把一句话需求扩成产品 spec。
  - generator（构建者）：按 spec 写代码。
  - evaluator（评审者）：用 Playwright 像真人一样操作运行中的应用，然后打分。
- **为什么要单独的评审者**：agent 评自己的作品时会自信地夸奖，哪怕质量明显一般。作者发现，单独调教一个评审者让它挑剔，比让构建者批判自己的作品容易得多。
- **成本对比**：同一个「复古游戏制作器」需求，单个 agent 跑 20 分钟、花 9 美元，做出来的游戏实体不响应输入；完整 harness 跑 6 小时、花 200 美元，质量差别一眼可见。换上更新的模型并简化 harness 后，一次运行约 3 小时 50 分钟、124.70 美元。
- **怎么简化**：作者第一次一口气大幅删减，结果没能复现原来的效果，也分不清哪些部分真正起作用。之后他改成一次只删一个组件，看对结果的影响。

配套仓库 cwc-long-running-agents 把这些做法拆成三个可以单独拿走的部件：

- **Default-FAIL 合约**：每项功能在 `test-results.json` 里一开始都是 `false`。一个 PreToolUse hook 规定，agent 必须先用 Read 工具打开过证据文件（截图、日志、结果文件），才允许修改这个文件。
- **全新上下文的 evaluator**：一个没有 Write/Edit 工具的 subagent，在从没见过构建过程的上下文里审 diff 和截图，返回 `PASS` 或 `NEEDS_WORK`。
- **agent 自己维护交接**：agent 写 `PROGRESS.md` 并在关键节点提交 git，另有一个 Stop hook 兜底，把还没提交的内容提交掉。

仓库 README 也指出，Claude Code 内置的 `/goal` 提供了现成的「构建、检查」循环：设一个完成条件，每一轮结束后由一个单独的快速模型检查是否达成。

**以前讲过的**：「别让 agent 互相审，要跑给我看」（11-04）；Ralph loop（11-02）。

**来源**：
- [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)，Prithvi Rajasekaran（Anthropic），2026-03-24
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)，Justin Young（Anthropic），2025-11-26
- [anthropics/cwc-long-running-agents](https://github.com/anthropics/cwc-long-running-agents)（Anthropic，Code with Claude 2026 的示例仓库，官方说明不维护）

```
目标：在这个仓库里搭一个最小的「默认失败 + 独立评审」验证闭环，让 agent 不能在没看过证据的情况下宣布功能完成。先出方案，等我确认再写文件。

1. 先读 https://github.com/anthropics/cwc-long-running-agents 的 README 和 claude-code-config/.claude/ 下的 hooks 与 agents/evaluator.md（只读，不要直接整个复制进来）。用几句话向我解释三个部件各自怎么工作，以及 README 里提到的已知缺口。
2. 确认我的工具和版本（claude --version）。如果不是 Claude Code，说明哪些部件用不了，改为给出等价的「包装脚本」方案。
3. 和我一起挑一个正在做、能拆成 3–5 个可验证小项的功能。起草 test-results.json，每项都写成 {"passes": false}，并为每项写清楚「什么证据算数」（例如某条命令的输出文件、截图路径、日志文件），这些证据要能在本仓库里真实生成。
4. 起草三样东西，只给我看草稿：
   (a) 一个 PreToolUse hook：拦截对 test-results.json 的写入，除非本会话之前读过一个符合证据规则的文件
   (b) 一个 evaluator subagent：只给读取类工具，不给 Write/Edit；输入是 diff 和证据文件，第一行只能输出 PASS 或 NEEDS_WORK，后面列出具体问题
   (c) 一份 PROGRESS.md 模板：当前在做哪一项、做完了什么、下一步、已知问题
5. 我确认后再写入。验证并贴出输出：
   - 不读证据直接把某项改成 true：被 hook 拦下的输出
   - 先读证据再改：成功的输出
   - 对一次真实改动调用 evaluator：它返回的完整结果
6. 贴出 git diff，不要 push、不要开 PR。

参考：Prithvi Rajasekaran《Harness design for long-running application development》https://www.anthropic.com/engineering/harness-design-long-running-apps ；Justin Young《Effective harnesses for long-running agents》https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents ；anthropics/cwc-long-running-agents https://github.com/anthropics/cwc-long-running-agents
```

---

**如果只做一件事**：先做第 5 条，把仓库真实的检查命令接到 Stop hook 上。其他做法都要先有一个 agent 能自己跑的「通过 / 失败」信号才能起作用。

## 本期去重用源链接（机器可读）

- https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- https://parlance-labs.com/blog/posts/auto-evals/
- https://code.claude.com/docs/en/best-practices
- https://learn.chatgpt.com/guides/best-practices
- https://github.com/mattpocock/skills
- https://github.com/mattpocock/skills/blob/main/skills/engineering/retro/SKILL.md
- https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md
- https://x.com/mattpocockuk/status/2120503390333768170
- https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- https://www.anthropic.com/engineering/building-c-compiler
- https://www.anthropic.com/engineering/harness-design-long-running-apps
- https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- https://github.com/anthropics/cwc-long-running-agents
