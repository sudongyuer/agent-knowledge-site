# Agent 工程实践简报 · 2026-11-09

## 今日概念：Instruction hierarchy（指令层级）

**是什么**：模型收到的文字不是一样大的。开发者写的系统消息最大，你在对话里说的话其次，工具返回的内容（读到的文件、搜到的网页、命令输出）最小，被当成「资料」而不是「命令」。OpenAI 2024 年的论文把这套排序正式提出来，并训练模型在冲突时听级别高的那一方。

**解决什么**：防提示注入。网页或文件里藏一句「忽略之前的指令」，模型不该照做，因为它只是工具输出。论文报告这种训练让防系统提示泄露的能力提高了 63%，对训练时没见过的越狱也提高了 30% 以上。

**和你已会的东西的关系**：10-29 讲过的「致命三要素」靠的就是这套排序来降低风险。但它有个副作用，正好撞上你天天用的 CLAUDE.md / AGENTS.md：这两个文件是作为「指令」塞进上下文的，而 agent 读你的代码时，代码只是「工具输出」。所以说明书过期时，agent 会听说明书、不听代码（见今天第 1 条）。理解这个排序，你就知道：想让 agent 优先相信什么，就要把这条规则写进它当成「指令」的那个位置。

**入门原文**：[The Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions](https://arxiv.org/abs/2404.13208)（Eric Wallace 等 / OpenAI，2024）

**上手 prompt**：
```
目标：画出这个仓库里 coding agent 会读到的每一类文字分别处在哪一级「指令层级」，并找出级别放错的地方。

1. 先读仓库，列出 agent 会接触的所有文字来源及路径：用户级和项目级说明书（CLAUDE.md、AGENTS.md、.cursor/rules 等）、skills、hooks 配置、MCP 服务描述、README/docs、代码注释、测试输出。不存在的直接写「没有」，不要编造。
2. 按三级分类并制表：作为指令进入上下文的（说明书、skill 正文、系统提示）、作为工具输出进入的（读文件、命令结果、网页）、介于两者之间或不确定的。每行写清你的依据（引用官方文档或配置原文）。
3. 找出两类问题并引用原文：(a) 写成命令口吻、其实是在描述代码现状的句子（例如「我们用 X 库」「入口在某文件」），这类一旦过期就会以指令身份压过代码；(b) 外部内容（网页、第三方文档、issue 文本）可能被复制进指令文件的地方。
4. 给出不超过 8 行的修改建议：哪些描述句应该改成「去哪里查」的指针，哪些规则要保留为指令。先给方案，等我确认再改文件。
5. 交付：分级表、问题清单（带文件路径和行号）、修改建议。

参考：Wallace 等《The Instruction Hierarchy》https://arxiv.org/abs/2404.13208
```

## 本期条目

### 1. 说明书过期时，agent 九成会听说明书、不听代码；在用户级说明书里加一句话就能扭过来

- **要点**：佐治亚理工的 Xiaonan Xu 和科罗拉多大学博尔德分校的 Wenjing Wu 做了 40 个 Python 小项目，故意让 CLAUDE.md / AGENTS.md 要求一种写法（比如用 print），而现有代码统一用另一种（比如 logging），让 Claude Code 和 Codex CLI 加功能，共 320 次运行。不加干预时，90.1% 的选择跟着过期文件走；Claude Code 在 80 次里有 79 次在回复里点出了冲突，照样跟文件走；Codex CLI 有 20 次干脆把能用的旧代码改成文件要求的样子（中位数删了 198 行），其中 17 次原有测试挂了。在用户级说明书（`~/.claude/CLAUDE.md` 或 `~/.codex/AGENTS.md`）加一句「文档和代码冲突时以现有代码为准，并在最终回复里列出每处不一致」后，跟代码走的比例从 4.2% 升到 91.4%，没有再改旧代码，测试通过率从 89.4% 到 100%。作者的解释就是今日概念：文件以指令身份进来，代码只是工具输出。局限：只测了 Python、单轮无人值守运行。
- **链接**：[Stale Instruction Files Override the Code in Coding Agents: A One-Sentence Fix](https://arxiv.org/abs/2610.30571)，Xiaonan Xu、Wenjing Wu；数据和脚本：[stale-docs-data](https://github.com/WenJing95/stale-docs-data)

```
目标：在我的用户级 agent 说明书里加入「代码优先」规则，并在这个仓库里做一次小实验，证明它对当前使用的 agent 真的有效。

1. 先确认我用的是哪种 agent 及其用户级说明书路径（Claude Code 是 ~/.claude/CLAUDE.md，Codex CLI 是 ~/.codex/AGENTS.md；其他工具请查官方文档）。贴出文件现状；不存在就说明，并先给我看要创建的内容。
2. 拟加入这句原文（英文原句来自论文，保持不改）：
   "When a repository's documentation and its existing code disagree, follow the conventions used in the existing code, and in your final reply point out each inconsistency you found between the documentation and the code."
   先给我看 diff，等我确认再写入。
3. 做对照实验，不碰真实代码：在临时目录或 git worktree 里复制本仓库一小块（或新建一个 3–5 个模块、带测试的玩具项目）。在项目说明书里故意写一条和现有代码相反的约定（例如日志方式、路径处理、错误返回方式），再提一个不提约定、只描述行为的小功能需求。
4. 用非交互模式各跑至少 2 次：不加这句 vs 加这句（加的方式是用单独的配置目录，不要改动我真实的用户级文件，除非我已在第 2 步确认）。每次记录：新代码跟了文件还是跟了代码、是否改动了已有文件（删了多少行）、原有测试是否通过、最终回复有没有点出冲突。贴出命令和输出。
5. 交付：对照表、实验目录路径、结论（这句话在我的环境里是否有效；无明显差异也如实说）。

参考：Xiaonan Xu、Wenjing Wu《Stale Instruction Files Override the Code in Coding Agents: A One-Sentence Fix》https://arxiv.org/abs/2610.30571
```

### 2. 把「说明书里的引用还在不在」做成每次 CI 都跑的检查：356 个仓库里 23% 有指向已删除代码的引用

- **要点**：Christoph Treude 和 Sebastian Baltes 把 CLAUDE.md、AGENTS.md 这类文件和代码慢慢对不上的现象叫做 context rot（上下文腐烂，这里指配置文件过期，不是上下文窗口变长后效果变差的那个意思）。他们直接拿一个检查 README 的老工具 DOCER 去扫 356 个仓库的 612 个配置文件：先用正则从说明书里抽出代码名和路径，再用 `git grep` 分别在「说明书首次提交时」和「当前 HEAD」两个版本里查找，当时存在、现在没了的就算过期。结果 82 个仓库（23.0%）至少有一条过期引用，例子包括改名的函数、删掉的脚本、不再存在的文件路径。人工抽查 50 条，64% 是真过期，其余是误报或说不清，所以要人过一遍再改。作者明确说这套两次 `git grep` 的做法不需要新工具、能放进 CI。配合第 1 条：那句话是兜底，这个检查是从源头减少过期。
- **链接**：[Context Rot in AI-Assisted Software Development](https://arxiv.org/abs/2606.09090)，Christoph Treude、Sebastian Baltes

```
目标：给这个仓库加一个能在本地和 CI 跑的检查，找出 agent 说明书（CLAUDE.md、AGENTS.md、.cursor/rules、copilot-instructions 等，以及 skills 正文）里指向已不存在代码的引用。

1. 先读仓库：列出所有 agent 说明书和 skill 文件路径；确认仓库的脚本语言、CI 平台和已有 lint 命令（从配置文件里读，不要猜）。
2. 实现最小检查脚本：从说明书里抽出看起来像代码元素的引用（反引号里的标识符、文件路径、脚本名、包名），在当前 HEAD 里用 git grep 或文件存在性检查确认它们还在；可选地再在该说明书首次提交时的版本里查，只把「当时在、现在没了」的标成过期，减少误报。排除说明书自身和 README 的匹配。
3. 在当前仓库上跑一遍，贴出完整输出。对每条命中，人工判断（并写明理由）是真过期、误报还是说不清。不要自动改说明书。
4. 故意做一次破坏验证：在临时分支里把一个被说明书引用的函数或文件改名，确认检查会失败并指出具体行；然后还原。贴出证据。
5. 接进 CI（或 pre-commit），失败信息要写清「哪个文件第几行引用了什么、现在找不到」。交付：脚本路径、CI 改动 diff、首次运行结果表、破坏验证证据、以及给 AGENTS.md 的一句话：重命名或删除代码时，同一个 PR 里更新说明书。

参考：Christoph Treude、Sebastian Baltes《Context Rot in AI-Assisted Software Development》https://arxiv.org/abs/2606.09090
```

### 3. 无人值守跑 Claude Code 时，让「需要人点允许」的操作直接被拒、任务继续，而不是卡住等你

- **要点**：Claude Code 2.1.319（11 月 6 日）新增 `permissions.denyInsteadOfPrompting`：原本会停下来等你点允许的工具调用，开了之后直接拒绝，告诉 Claude 被拒了，本轮继续，对终端会话、subagent 和 agent team 都生效。以前只有 `claude -p --permission-prompts none` 在打印模式下能做到。对你想搭的 software factory 来说，后台任务最怕的就是半夜卡在一个权限弹窗上；这个开关只会收紧、不会放行任何东西。第三方整理站称它是「只能收紧」的设置，项目级和本地级配置里写了会被忽略，要放在用户级或托管配置里；值必须是布尔 `true`，写成字符串会让整份配置不生效（这两点来自第三方实测，不是官方文档原文，动手时请以本机报错为准）。同版还给 `/tasks` 加了「Earlier in this session」，可以重新打开已经结束的 subagent 并继续给它发消息。
- **链接**：[Claude Code changelog 2.1.319](https://code.claude.com/docs/en/changelog)，Anthropic；第三方实测：[developersdigest](https://www.developersdigest.tech/blog/claude-code-deny-instead-of-prompting-2026)

```
目标：为这个仓库的无人值守 agent 运行配好「遇到要人批准的操作就直接拒绝并继续」，并证明它不会卡住，也没有意外放行任何操作。

1. 先确认环境：运行 claude --version，确认不低于 2.1.319；读取用户级 ~/.claude/settings.json、项目 .claude/settings.json 和 .claude/settings.local.json，贴出与 permissions 相关的现有配置。版本不够就停下告诉我。
2. 列出这个仓库里会无人值守跑 agent 的入口（CI 任务、定时脚本、claude -p 调用、后台/并行 worktree 脚本），从仓库里找，没有就说没有。
3. 提出方案：denyInsteadOfPrompting 放在哪一级（用户级设置，或单次运行用 --settings 内联 JSON），值写布尔 true；同时列出这些任务真正需要的最小 allow 规则，让正常步骤不被误拒。先给我 diff，等我确认。
4. 在临时目录或 worktree 里验证：让 agent 做一件需要一个「未被允许」操作的小任务（例如运行一个没在 allow 列表里的命令）。分别在开和不开这个设置时用非交互方式运行，贴出输出：开了以后应看到该调用被拒、agent 继续并在最终回复里说明它做不了什么；同时确认没有任何本应被拒的操作被执行。
5. 交付：配置 diff、两次运行的输出对照、被拒操作清单，以及给 AGENTS.md 的不超过 4 行说明：无人值守任务遇到被拒操作时应如何在最终回复里报告。

参考：Claude Code changelog 2.1.319 https://code.claude.com/docs/en/changelog
```

## 本期去重用源链接（机器可读）
- https://arxiv.org/abs/2404.13208
- https://arxiv.org/abs/2610.30571
- https://arxiv.org/html/2610.30571
- https://github.com/WenJing95/stale-docs-data
- https://arxiv.org/abs/2606.09090
- https://code.claude.com/docs/en/changelog （2.1.319 条目）
- https://github.com/anthropics/claude-code/releases/tag/v2.1.319
- https://www.developersdigest.tech/blog/claude-code-deny-instead-of-prompting-2026
- （看过未收）https://x.com/HamelHusain/status/2119584949032693767 等 Hamel 11-08/09 一串「私有 eval 不是私有 benchmark」回复（与 11-06、11-08 已收内容同一观点）
- （看过未收）https://x.com/poteto/status/2119521036660314339 （formal-verification + statechart 用法，10-30/11-04/11-06 已收）
- （看过未收）https://simonwillison.net/ 11-08 SQLite C vs Rust 研究报告（个人实验，可照做性弱）
- （看过未收）https://x.com/Grirku/status/2119514130524574115 、https://x.com/Slonski_rt/status/2119514279640781000 （hooks 入门帖，非一线来源，与 11-06 hooks 概念重叠）
- （看过未收）Anthropic engineering 索引无 11-06 后新文
