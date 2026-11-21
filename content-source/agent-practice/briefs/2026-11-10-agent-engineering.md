# Agent 工程实践简报 · 2026-11-10

## 今日概念：Agent harness（agent 外壳 / 运行框架）

**是什么**：模型本身只会「读一段文字、吐一段文字」。真正去读文件、跑命令、改代码的，是包在模型外面的那层程序，这层程序就叫 harness。它做的事其实就是一个循环：把你的话和工具清单发给模型；模型回一个「我要调用某工具」的请求；harness 在你电脑上真的执行它；把结果塞回对话；再问模型下一步，直到模型说做完了。Claude Code、Codex、Amp 都是 harness。CS146S 讲师 Mihail Eric 用大约 200 行 Python、只给三个工具（读文件、列目录、改文件）就写出了一个能用的 coding agent。

**解决什么**：把 agent 从「黑盒魔法」变成你能拆开看的东西。模型一样，换个 harness 效果可以差很多，差别就在 harness 往上下文里放了什么、给了哪些工具、怎么压缩长对话、怎么拦危险操作。

**和你已会的东西的关系**：你配过的 CLAUDE.md / AGENTS.md、skills、hooks、MCP、权限设置，全都是在往 harness 里插零件：说明书和 skill 是它每轮塞进上下文的文字，hooks 是它在循环某个节点上强制执行的脚本，MCP 是额外的工具，权限是它执行工具前的那道闸。Mihail Eric 在 11 月 8 日的 Latent Space 访谈里说，今年 CS146S 第一课就是先手写一个 200 行的 agent，再用代理截下真实 Claude Code 的请求，读它的系统提示、计划提示和压缩提示；他还提到 Claude Code 的系统提示随模型变强一直在变长又变短。懂了这个循环，你调 skill、写 hooks 时就知道自己在改循环的哪一步。

**入门原文**：[The Emperor Has No Clothes: How to Code Claude Code in 200 Lines of Code](https://www.mihaileric.com/The-Emperor-Has-No-Clothes/)（Mihail Eric，2026 年 1 月）；进阶：[Demystifying Claude Code](https://www.mihaileric.com/Demystifying-Claude-Code/)（Mihail Eric）；访谈：[How Stanford Teaches AI-Native Engineering](https://latent.space/p/one_million_ai_engineer_special_how_stanford_teaches_ai-native_engineering_mihail_eric_monaco/)（Latent Space，2026-11-08）

**上手 prompt**：
```
目标：在一个全新的临时目录里，照着 Mihail Eric《The Emperor Has No Clothes》的思路，写一个最小 coding agent，让我亲眼看清 agent 循环的每一步。不要改动当前仓库的任何文件。

1. 先读原文 https://www.mihaileric.com/The-Emperor-Has-No-Clothes/ ，用 5 行以内复述它的循环：发消息、模型返回工具调用、本地执行、把结果送回、继续。
2. 在临时目录（例如 /tmp/mini-agent）用我机器上已有的语言和 LLM SDK 实现：只有三个工具（读文件、列目录、按「旧字符串替换为新字符串」改文件，旧字符串为空表示新建文件），总代码不超过 250 行。API key 从环境变量读，没有就停下告诉我需要哪个变量，不要编造或写死 key。
3. 每一轮把这些打印出来：发给模型的消息条数、模型返回的工具名和参数、工具执行结果的前 200 字符。
4. 验收：让它在临时目录里完成「新建 hello.py，写一个返回 'hello' 的函数，再加一个调用它的测试文件并运行」。贴出完整终端输出，证明至少发生了 3 次工具调用、文件真的生成、测试真的通过。
5. 最后写一张对照表：这个 200 行 agent 缺了哪些东西，而我日常用的 coding agent（先确认是哪个）是靠哪些机制补上的（系统提示、说明书、skills、hooks、权限、上下文压缩、subagent）。每一项注明依据来自官方文档还是你的推测。

参考：Mihail Eric《The Emperor Has No Clothes》https://www.mihaileric.com/The-Emperor-Has-No-Clothes/
```

## 本期条目

### 1. 给仓库里每一类文字标「可信级别」：哪些描述今天的真实状态（canon），哪些只是计划和历史（not canon）

- **要点**：Basis 的 Michael Crabtree 写了他们怎么把 monorepo 改造成适合 agent 的样子（Mihail Eric 在 11 月 8 日的 Latent Space 访谈里把它列为推荐阅读）。核心一条叫 Canonicality：仓库里每份文字要么是「系统今天就是这样」的真相，要么是意图和历史记录，绝不能两者都是。他们发布了一张 Authority Map：根目录和嵌套的 AGENTS.md、skills、docs/、docstring 和代码注释算 canon；.specs/ 规格、Linear 工单、.notes/ 决策记录、PR 描述、Slack 讨论算 not canon，agent 可以读来理解「为什么这么写」，但不能当成现状。配套做法还有：自动加载的上下文默认不放（Default-no），根 AGENTS.md 约 300 行且每行都被争论过；每份 canon 文件的 frontmatter 里写 owner，CI 检查新 skill 必须有 owner；每天有扫描器查 skills 和 AGENTS.md 的过期、矛盾、重复和断链，再派 worker 修小问题。作者说正因为先划清了 canon，扫描器才能查矛盾，因为 canon 按定义应该自洽。他们报告三个月里人均 token 用量涨了 5 倍多，每周提交量涨到 2.5 倍（这是他们自报的数字，和其他改动混在一起）。这正好接昨天的「说明书过期」话题。顺带一个反向数据点：Stanislav Sorokin 在 X 上自己复现昨天那篇论文，用 6 条过期说明、两个 agent 各 12 次，结果是两边都 0 次跟着过期说明走，Claude Code 12 次都提醒了文档过期，Codex 0 次提醒，而且也没顺手修 AGENTS.md。样本小、设计也和论文不同（他的过期内容是文件位置，agent 看代码 import 就能发现；论文测的是写法约定，这是我的解读），所以两边结论都别当定论，最稳的还是在自己仓库里测。
- **链接**：[How We Made Our Monorepo Ergonomic for Agents](https://www.getbasis.ai/blogs/how-we-made-our-monorepo-ergonomic-for-agents#canon-vs-not-canon)，Michael Crabtree（Basis，2026-05-19）；反向复现：[Stanislav Sorokin 的 X 帖](https://x.com/stas_sorokin_/status/2119907385208709149)

```
目标：给这个仓库建一张「Authority Map」，标清 agent 读到的每一类文字是 canon（描述系统今天的真实状态，可以当真相）还是 not canon（计划、规格、历史、讨论，只用来理解意图），并把这条规则写进 agent 说明书。

1. 先读仓库，列出 agent 可能读到的所有文字来源及路径：根目录和子目录的 CLAUDE.md / AGENTS.md / .cursor/rules、skills、docs/、README、ADR 或设计文档、规格/计划文件夹、CHANGELOG、代码注释、PR 模板等。不存在的直接写「没有」，不要编造。
2. 按 canon / not canon / 说不清 三类制表，每行写一句理由。参考 Basis 的划分：说明书、skills、docs、docstring、注释算 canon；规格、计划、工单、决策记录、PR 描述、聊天记录算 not canon。
3. 找出混在一起的文件：同一份文件里既有「现在就是这样」的描述，又有「打算这样做」或「当初为什么」的内容。引用原文并给出文件路径和行号。
4. 抽查 canon：从每份说明书和 skill 里挑出最多 5 条事实性描述（命令、路径、约定），去代码和配置里核对，贴出核对命令和结果，标出已经不成立的。
5. 先给方案、等我确认再改文件：(a) 在根说明书加不超过 6 行的 Authority Map 摘要和一句「not canon 只用于理解意图，与代码冲突时以代码和 canon 为准」；(b) 混合文件怎么拆；(c) 是否给 canon 文件加 owner 字段。
6. 交付：分类表、混合文件清单、抽查结果、改动 diff 草案。

参考：Michael Crabtree《How We Made Our Monorepo Ergonomic for Agents》https://www.getbasis.ai/blogs/how-we-made-our-monorepo-ergonomic-for-agents
```

### 2. 恶意软件包已经开始往 CLAUDE.md、AGENTS.md、MCP 配置和 SessionStart hooks 里下毒：把这些文件当代码一样审

- **要点**：Socket 安全团队（Kush Pandya）11 月 6 日分析了 RubyGems 上的恶意包 `strutil-core` 1.0.1，属于 Shai-Hulud 蠕虫一系。安装时就会执行，除了偷云、CI、包仓库、SSH 等凭据（沙箱里看到它读了 `.claude/.credentials.json` 和 `.codex/auth.json`），还专门对 AI coding 工具下手：在你家目录里找 AI 工具的 `settings.json`、`config.json`、`mcp.json`，加一个叫 `workspace-tools` 的 MCP 服务器去跑它自己，或者加 `SessionStart` hook；拿到 Git 凭据后，还会往仓库里提交 `.claude/settings.json`、`.cursor/mcp.json`、`CLAUDE.md`、`AGENTS.md` 和打开文件夹就运行的 `.vscode/tasks.json`，其中 AGENTS.md 让 agent 在第一条命令前先跑一个安装脚本。别人一打开这个仓库就可能再次中招，取决于工具的信任和审批设置。还有个陷阱：被偷的 GitHub token 一旦被撤销，它的监控程序会删掉你的家目录，所以要先清掉监控服务再撤 token。Socket 说这个包公开了约 5 小时，没确认有受害者。对你的启发是：agent 配置文件现在就是攻击面，在 X 上已有人建议把 AGENTS.md、CLAUDE.md、`.cursor/mcp.json` 放进 CODEOWNERS，像代码一样审。
- **链接**：[Shai-Hulud Descendant Surfaces in Malicious Ruby Gem That Steals Credentials and Poisons AI Tools](https://socket.dev/blog/shai-hulud-descendant-malicious-ruby-gem)，Kush Pandya（Socket）

```
目标：检查我的机器和这个仓库里，有没有被加入可疑的 agent 配置（MCP 服务器、hooks、会让 agent 执行脚本的说明书），并把这类文件纳入代码审查。只读检查，没有我确认不要删除或修改任何文件。

1. 列出这台机器上 AI coding 工具的用户级配置文件（例如 ~/.claude/settings.json、~/.claude.json、~/.codex/、~/.cursor/mcp.json 等，以实际存在的为准），以及本仓库里的 .claude/、.cursor/、.codex/、.gemini/、.vscode/tasks.json、CLAUDE.md、AGENTS.md 和所有 skills。
2. 逐个贴出其中的：所有 MCP 服务器条目（名字、command、args）、所有 hooks（尤其 SessionStart）、所有会在打开文件夹时自动运行的任务、说明书里所有「先运行某脚本/某命令」的句子。对每一项说明它从哪来：用 git log 查是谁、哪次提交加的；用户级的写「不在版本控制里，需要我确认」。
3. 特别标出这些危险信号：名为 workspace-tools 的 MCP 服务器；指向 ~/.config/index.js、.github/init.js 或 /tmp 下脚本的命令；用 node/bun/python 运行仓库里不认识文件的条目；要求 agent 在第一条命令前先执行安装脚本的说明书。没有发现就明确写「未发现」。
4. 提方案（等我确认再改）：在 CODEOWNERS 里把 CLAUDE.md、AGENTS.md、.claude/、.cursor/、.codex/、.vscode/tasks.json、skills 目录指给需要审查的人；如果仓库有 CI，再加一个检查，对这些路径的改动在 PR 里显式提醒。
5. 交付：配置清单表（来源、是否可疑、理由）、CODEOWNERS 和 CI 的 diff 草案。如果真的发现可疑项，先停下来告诉我，不要自己处理，也不要撤销任何 token。

参考：Kush Pandya（Socket）https://socket.dev/blog/shai-hulud-descendant-malicious-ruby-gem
```

### 3. agent 写的 PR 描述太长没人看：开头留一段人话，全文折叠进 `<details>`

- **要点**：Simon Willison 现在大部分改动都是 Claude Code 或 Codex 开的 PR。他说 agent 写的 PR 描述准确又完整，问题是太完整，读起来像水文，人一看就不想读。他的做法：PR 开头放一段最短的、经过人判断的说明（这个 PR 为什么存在、值不值得细看），常配一张截图；agent 写的完整长文整段放进 GitHub Markdown 支持的 `<details><summary>` 折叠块里，summary 写模型名和推理强度，比如「Claude Opus 5.5 Medium」，让读者一眼知道折叠里是什么。开头那段不一定是他亲手写的，有时 agent 已经写出来了埋在长文里，他只是挑出来；他对读者的承诺是：开头这段代表他本人判断过、值得你花时间。对你多 agent 并行开 PR 的工作流，这能直接降低审 PR 的负担。
- **链接**：[Hide your slop PR descriptions behind &lt;details&gt;&lt;summary&gt;](https://simonwillison.net/2026/Nov/9/details-summary/)，Simon Willison（2026-11-09）

```
目标：把这个仓库里 agent 开 PR 的描述格式改成「一段人话开头 + 完整说明折叠」，并写进 agent 说明书或做成 skill，让以后每个 agent 开的 PR 都照做。

1. 先读仓库：是否已有 PR 模板（.github/pull_request_template.md 等）、agent 说明书里有没有关于 PR 描述的规则、最近 5 个 PR 的描述长什么样（用 gh 或仓库实际可用的方式读取，不能读就说明）。
2. 拟定格式：
   - 第一段：不超过 3 句，说清这个 PR 解决什么问题、改了什么、审的人最该看哪里；有界面改动时附截图。
   - 然后是 <details><summary>模型名 + 推理强度（例如 Claude Opus 5.5 Medium）</summary> ... </details>，里面放完整的问题描述、方案细节和验证步骤（含实际跑过的命令和结果）。
   - 开头那段由 agent 起草，但要标注「待我确认」，我确认后再去掉标注。
3. 把规则写进合适的位置（说明书里不超过 6 行，或一个独立的 PR 描述 skill，你判断哪个更合适并说明理由），同时更新 PR 模板。先给我看 diff，等我确认。
4. 验收：用当前分支或一个示例改动，按新格式生成一份 PR 描述的 Markdown，贴出原文；说明你怎么确认 <details> 在 GitHub 上会折叠（引用 GitHub 文档或用 gh 预览）。不要真的开 PR。

参考：Simon Willison《Hide your slop PR descriptions behind <details><summary>》https://simonwillison.net/2026/Nov/9/details-summary/
```

## 本期去重用源链接（机器可读）
- https://www.mihaileric.com/The-Emperor-Has-No-Clothes/
- https://www.mihaileric.com/Demystifying-Claude-Code/
- https://latent.space/p/one_million_ai_engineer_special_how_stanford_teaches_ai-native_engineering_mihail_eric_monaco/
- https://x.com/mihail_eric/status/2119836042270580846
- https://www.getbasis.ai/blogs/how-we-made-our-monorepo-ergonomic-for-agents
- https://x.com/stas_sorokin_/status/2119907385208709149
- https://socket.dev/blog/shai-hulud-descendant-malicious-ruby-gem
- https://x.com/virusbtn/status/2119728225547165882
- https://x.com/timwork_notes/status/2119860213918605489
- https://simonwillison.net/2026/Nov/9/details-summary/
- https://x.com/simonw/status/2119650353142747181
- （看过未收，待跟进）https://x.com/poteto/status/2119841446308221152 poteto 11-11（周三）AI Engineer 演讲：团队上月 11,000 个 PR 如何不降质量；有录像/文字后收
- （看过未收，可作备选）https://www.monaco.com/blog/agent-developer-workspaces 、https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents 、https://latent.space/p/reviews-dead/ （Latent Space 访谈 show notes）
- （看过未收）https://x.com/thorstenball/status/2119829717369122873 （调试即「假设 → 证明 → 二分」，太短）
- （看过未收）Simon 11-09 Beep Locator、llm-anthropic 0.31（个人项目/模型发布）
- （看过未收）Anthropic engineering 索引无 11-06 后新文；Claude Code changelog 本次抓取超时未查
