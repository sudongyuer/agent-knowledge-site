# Agent 工程实践简报 · 2026-11-13

本期素材主要来自 AI Engineer Code Summit 2026（11 月 10–12 日，旧金山）。会议的逐字稿和幻灯片存档在 [Conffab AgentPass](https://agents.conffab.com/aie-code-26)，下面引用的数字都出自这些存档或讲者自己的仓库。

## 今日概念：ADR（Architecture Decision Record，架构决策记录）：每个重要决定写一页短文，说清「为什么这么定、什么情况下可以改」

**是什么**：一个仓库里放一个文件夹（常见是 `docs/adr/` 或 `doc/arch/`），每做一个重要的技术决定，就写一个编号的小 markdown 文件，比如「ADR 7：列表用自研虚拟滚动，不用第三方库」。格式只有五段：标题、背景（当时有哪些约束和取舍）、决定（「我们将……」）、状态（提议 / 已采纳 / 已废弃 / 被 ADR-12 取代）、后果（好的坏的都写）。决定被推翻时旧文件不删，标成「被取代」。这个做法是 Michael Nygard 2011 年提出的，每篇控制在一两页。

**解决什么**：Nygard 原文说，新人看到一个奇怪的旧决定只有两种反应：盲目接受，或者盲目改掉，两种都可能出事。agent 每次开会话都是「新人」，问题更严重：它看到一段别扭的代码，要么照抄这个模式，要么顺手「优化」掉，而那段代码可能正是为某个没写测试的性能要求留的。Kent C. Dodds 这次的 workshop 把它列成让 agent 自主干活的地基之一，原话是「decision records that say when it's OK to change them」（写明什么时候可以改的决策记录）。

**和你已会的东西的关系**：
- 11 月 10 日讲过 canon / not canon：说明书描述「现在是什么样」，ADR 属于「历史和理由」，不是当前状态的权威描述。所以 AGENTS.md 里只放一行路由，比如「改架构前先查 docs/adr/，和已采纳的 ADR 冲突要先提新 ADR」，不要把 ADR 内容抄进去。
- 11 月 11 日讲过「说明书里堆的『永远不要……』」：ADR 的「后果」和「什么时候可以改」正好给规则写上例外和过期条件，避免变成没人敢动的禁令。
- 能变成 lint 或测试的约束，还是优先写成检查（见今天第 1 条）；ADR 管的是检查表达不了的「为什么」。

**入门原文**：[Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)（Michael Nygard，2011，提出 ADR 的原文，很短）；模板合集：[joelparkerhenderson/architecture-decision-record](https://github.com/joelparkerhenderson/architecture-decision-record)

**上手 prompt**：
```
目标：给这个仓库建立 ADR（架构决策记录）机制，并补写 3 条最重要的历史决策，让以后的 coding agent 改架构前知道「为什么这么做、什么时候可以改」。先出方案，等我确认再写文件。

1. 先读仓库：确认是否已经有 ADR、设计文档或决策记录（搜 docs/adr、doc/arch、decisions、RFC 等目录和关键词）。有就沿用现有位置和格式，没有就建议放在 docs/adr/，并说明理由。
2. 从代码和 git 历史里找 3 个「看起来别扭但很可能是故意的」决定，例如自研而不用常见库、特殊的目录分层、刻意不做的优化、锁死的依赖版本。每个给出证据：文件路径、相关 commit（git log / git blame 的输出片段）。找不到证据的不要编理由，标成「原因待我确认」。
3. 每条按 Michael Nygard 的格式起草，一两页以内：
   - 标题：ADR-NNN：一个名词短语
   - 背景：当时的约束和取舍（只写有证据的）
   - 决定：「我们将……」
   - 状态：提议 / 已采纳（没有证据证明团队采纳过的，一律写「提议」）
   - 后果：好的、坏的都列
   - 什么时候可以改：写成可检查的条件，例如「当某依赖支持 X 时」「当某指标超过 Y 时」
4. 在 agent 说明书（CLAUDE.md / AGENTS.md，以仓库里实际存在的为准）里起草不超过 3 行的路由规则：改哪类代码前要先读 ADR、和已采纳 ADR 冲突时怎么办（先停下来提新 ADR，不要直接改）。不要把 ADR 正文抄进说明书。
5. 全部以草稿形式给我看，我确认后再写入；写入后贴出 `git diff --stat`。

参考：Michael Nygard《Documenting Architecture Decisions》https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
```

## 本期条目

### 1. poteto：先别急着搭软件工厂，「别把一个烂循环自动化」：每次纠正 agent，都变成 lint 或架构上的改动，代码审查改成看验证证据

- **要点**：poteto（Lauren Tan）11 月 11 日在 AI Engineer Code Summit 主会场的演讲「All Code Is Slop (Except Mine)」。几个硬数字和做法：
  - 「注释是负债」：注释会过期，agent 会拿它当偷懒的借口，而且没法强制执行。幻灯片显示 Grok Bot 代码里的注释从 7 月 31 日的 65,824 条降到演讲当天的 1,227 条，「别这样做」的提醒都换成了错误信息写明根因的 lint 规则。
  - 原则：每纠正一次 agent，就加一条确定性检查，或者通过更好的 API 设计和架构让这个问题根本不可能出现。做够多次以后，代码审查里能挑的东西越来越少，agent 可以自己合并大部分 PR。
  - 审查对象从代码变成「验证产物」：视频、截图、图、形式化验证结果。运行时验证 skill 里带一份 feature map（从用户角度列出所有功能、怎么进入、靠什么证明它能用），再配上 agent 可以复用的自制 CLI。
  - 结果：10 月团队合并约 11,000 个 PR，约 227 人至少提过 1 个 PR，回滚率稳定在约 0.5%；冷启动从 5 月的 2,304 ms 降到 1,395 ms（-39%）。
  - 结论原话大意：如果你的内循环产出的是 slop，自动化它只会产出更多 slop，还要烧更多 token。所以先在代码库里打地基（lint、静态分析、运行时验证、形式化验证），再上外层自动化。
- **和你的关系**：你的目标就是「software factory」，这条正好是它的先后顺序：先把单次会话的产出质量用检查兜住，再让触发器自动开工。
- **链接**：[演讲直播回放（YouTube）](https://www.youtube.com/watch?v=ZZ19zhYnDKY)（poteto 11 月 11 日在 [X 帖](https://x.com/poteto/status/2120577296277119129) 里给的链接）；[逐字稿 + 幻灯片存档](https://agents.conffab.com/aie-code-26/live/keynotes/sessions/1794420600.md)（Conffab）；演讲里提到的 skill：[pstack](https://github.com/cursor/plugins/tree/main/pstack)（`/no-comments`、`/create-verification-skill`、`/statechart`）；UI 属性测试库 [antithesishq/bombadil](https://github.com/antithesishq/bombadil)

```
目标：把这个仓库里「写给未来 agent 或人看的告诫」找出来，挑最值得的 3 条变成会失败的检查（lint 规则、类型约束或测试），让问题没法再出现，而不是靠注释提醒。先出清单和方案，等我确认再改代码。

1. 先读仓库：确认语言、lint 工具和配置位置、测试框架，以及实际的 lint 和测试命令（从 package.json / Makefile / CI 配置里找，不要猜）。
2. 扫描三类告诫来源，每条记下文件路径和原文：
   - 代码注释里的 TODO / FIXME / HACK / NOTE / 「不要」「必须」「注意」/ "don't" / "must" / "never"
   - agent 说明书（CLAUDE.md / AGENTS.md / .cursor/rules 等，以实际存在的为准）里的禁令
   - 最近 30 次提交的 commit message 和 revert 提交里反复出现的修正
3. 把它们分成三类并制表：
   A. 能写成 lint / 类型 / 测试的（例如「不要直接 import 某模块」「这个函数必须传 X」）
   B. 能通过改 API 或架构直接消灭的（例如把容易误用的参数改成必填类型，或收拢成一个入口函数）
   C. 只能靠文字说明的（真正的「为什么」，适合写进决策记录，不适合写成注释）
   每行写一句理由。
4. 从 A、B 里挑 3 条收益最高的，给出实现方案：检查放在哪里、报错信息怎么写。报错信息要直接告诉 agent 根因和正确做法，而不只说「禁止」。
5. 我确认后实现。每条都要证明有效：先在临时分支故意写一个违规例子，贴出检查报错的完整输出；再贴出当前代码通过检查的输出。最后删掉对应的旧注释或说明书条目，贴出 diff。
6. 汇报：新增了哪些检查、删了多少条注释或禁令、还有哪些属于 C 类留待写成决策记录。

参考：poteto（Lauren Tan）AI Engineer Code Summit 2026 演讲「All Code Is Slop (Except Mine)」https://www.youtube.com/watch?v=ZZ19zhYnDKY ；逐字稿 https://agents.conffab.com/aie-code-26/live/keynotes/sessions/1794420600.md
```

### 2. 评测 agent 配置别只看通过率：Philipp Schmid 的 350 题实验里，几种 harness 分数差不多，但成本能差近 2 倍

- **要点**：Google DeepMind 的 Philipp Schmid 11 月 11 日的演讲「I deleted 90% of my harness (And It Got Better)」。他大约每半年从零重写一次 coding agent 的外壳（harness），每次都问：哪些工具和系统提示已经变成模型的累赘？这次的实验：
  - 自建约 350 题的 eval（编码、知识工作、终端命令），用同一个模型跑 4 种 harness：只有 bash；bash 加一个看图工具；两种带结构化文件读写工具的 harness。
  - 只看分数，四种几乎一样。但看每题 token 数和每题成本，「bash + 看图」比工具更多的 harness 便宜接近 2 倍，缓存命中率也更高。只看分数的话，这个差别根本看不出来。
  - 原因：能力强的模型只有 bash 时，会写一个内联脚本一次改完多个文件（他测到每次 bash 调用串 2.2 到 3.7 条命令），而不是一个文件一个文件地调编辑工具。弱一些的模型每次只串 1.3 到 1.8 条，工具少了反而占不到便宜。
  - 他也坦白每题只跑了 1 次，分数的小差异可能是噪声，应该多跑几次。
- **和你的关系**：你在迭代自己的 skill 和 CLAUDE.md。比较两个版本时，除了「做对没有」，还要记录 token、轮数、耗时、成本，并且每题多跑几次，否则会选错，或者以为没区别。
- **链接**：[逐字稿 + 幻灯片存档](https://agents.conffab.com/aie-code-26/live/keynotes/sessions/1794424800.md)（Philipp Schmid，AI Engineer Code Summit 2026，Conffab）

```
目标：给我当前用的 coding agent 配置做一个小型 A/B 评测，比较两个版本（例如：现在的说明书 vs 精简版；装某个 skill / MCP vs 不装），同时记录正确率和成本，判断哪个更好。先出方案，等我确认再跑。

1. 先读仓库：确认 agent 说明书（CLAUDE.md / AGENTS.md）、skills、MCP 配置的实际位置；确认我用的 agent CLI 是否支持无交互运行并输出结构化结果（例如 Claude Code 的 `claude -p` 加 JSON 输出，Codex 的 `codex exec`）。先跑 `--help` 确认真实参数名，不要凭记忆写。
2. 和我确认要比较的 A、B 两个版本。B 版本放在单独的 git worktree 或临时分支里，不要改我当前的工作区。
3. 从仓库最近的 issue、commit 或我给的需求里挑 5 到 8 个小任务，每个写清楚：任务描述、自动判定对错的命令（测试、lint、grep 某个结果都行）。不能自动判定的任务不要选。
4. 写一个脚本：每个任务在 A、B 下各跑 3 次，每次从干净状态开始，记录：是否通过、输入/输出 token、轮数（turns）、耗时、成本（CLI 有报告就用它的数，没有就写「未提供」，不要估算）。结果存成 CSV。
5. 先只跑 1 个任务 × 1 次，把原始输出贴给我，确认字段解析正确，再跑全量。
6. 汇报：一张表（每个版本的通过率、token / 轮数 / 成本的中位数），再加三句话结论：哪个更好、差别在噪声范围内还是范围外、成本差主要来自哪里。附上每次运行的原始日志路径。

参考：Philipp Schmid「I deleted 90% of my harness (And It Got Better)」，AI Engineer Code Summit 2026，逐字稿 https://agents.conffab.com/aie-code-26/live/keynotes/sessions/1794424800.md
```

### 3. Kent C. Dodds 开源了 autopilot：一条命令按「好 PR、审查与验证、限制爆炸半径」三根支柱给仓库打分，告诉你离「agent 自己合 PR」还差什么

- **要点**：Kent C. Dodds 在 11 月 10 日的 workshop「Closing the Agentic Loop」里说，他产品里的代码他自己读过的不到 1%，大部分 PR 由 agent 编写并合并。能做到这一点靠的是外围的一整套系统，workshop 从 `npx kcd-skills@latest autopilot` 开始。根据 [kcd-skills 仓库 README](https://github.com/kentcdodds/kcd-skills)，autopilot 是他的 skills 里唯一与技术栈无关的通用工具，主要功能：
  - `audit` 按三根支柱给仓库打分：好的 PR、审查与验证、限制爆炸半径。之后 `score` / `report` 生成成熟度报告（可以输出 HTML）。
  - 后续步骤会开一个「安装 PR」，并在 PR 合并后修改仓库设置。所以第一次用时只跑审计和报告。
  - workshop 介绍里列出的产出：不变量清单和写明何时可以改的决策记录、primitives catalog（基础组件目录）、「当路由器而不是小说」的 AGENTS.md、围绕意图和「单向门 / 双向门」（不可逆 / 可逆的决定）组织的 PR 模板；feature flag 必须有负责人、指标和移除条件；部署后做健康检查；备份要真正恢复过一次才算数。
- **链接**：[kentcdodds/kcd-skills](https://github.com/kentcdodds/kcd-skills)（npm 包 `kcd-skills`，当前 1.6.0）；[workshop 介绍](https://ai.engineer/code/2026/llms-full.txt)（AI Engineer Code Summit 2026 日程，搜「Closing the Agentic Loop」）

```
目标：用 Kent C. Dodds 的 autopilot 给这个仓库做一次「agent 自主化成熟度」体检，只出报告，不改任何东西。

1. 先确认本机有 Node 20 或更高版本（`node -v`）。运行 `npx kcd-skills@latest autopilot`，读它打印的说明，然后用中文总结给我：它会做哪几步，哪些步骤会写文件、开 PR、修改代码托管平台的仓库设置。
2. 这次只做只读部分：运行 audit 和 report，产物放在 `.autopilot/` 下（先跑 `npx kcd-skills@latest --help` 和 `npx kcd-skills@latest autopilot` 确认实际参数）。不要开 PR，不要改仓库设置，不要 push，不要修改仓库里已有的文件。需要的托管平台信息（分支保护、CI 状态等）用只读方式获取；拿不到就标成「未知」，不要猜。
3. 把审计结果按三根支柱（好的 PR / 审查与验证 / 限制爆炸半径）整理成表：每项写当前得分、依据（文件路径或命令输出）、最便宜的下一步。
4. 挑 3 个「投入小、收益大、可逆（双向门）」的改进，给出具体方案和预计工作量，等我挑选。不可逆（单向门）的改动单独列出并说明风险。
5. 最后贴出 `git status`，证明工作区没有被改动（`.autopilot/` 产物除外，并提醒我是否要把它加进 .gitignore）。

参考：Kent C. Dodds，kcd-skills / autopilot https://github.com/kentcdodds/kcd-skills ；AI Engineer Code Summit 2026 workshop「Closing the Agentic Loop」
```

## 本期去重用源链接（机器可读）

- https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- https://github.com/joelparkerhenderson/architecture-decision-record
- https://agents.conffab.com/aie-code-26
- https://www.youtube.com/watch?v=ZZ19zhYnDKY
- https://x.com/poteto/status/2120577296277119129
- https://agents.conffab.com/aie-code-26/live/keynotes/sessions/1794420600.md
- https://github.com/antithesishq/bombadil
- https://agents.conffab.com/aie-code-26/live/keynotes/sessions/1794424800.md
- https://github.com/kentcdodds/kcd-skills
- https://ai.engineer/code/2026/llms-full.txt
