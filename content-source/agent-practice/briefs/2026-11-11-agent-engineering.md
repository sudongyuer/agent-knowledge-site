# Agent 工程实践简报 · 2026-11-11

## 今日概念：Blackboard（黑板架构）：多个 agent 不互相发消息，而是都去读写同一块「公共白板」

**是什么**：一群 agent 合作时，最直觉的做法是让它们互相聊天、互相派活。黑板架构反过来：大家不直接对话，只往一个共享的地方（数据库表、仓库里的任务文件、issue 列表）写「我认领了什么、做到哪、发现了什么」，再从那里读别人的进度。这个思路来自上世纪 80 年代的 AI 研究（Wikipedia 叫 blackboard system），现在又因为大规模多 agent 回来了。

**解决什么**：agent 多了以后最大的问题不是不够聪明，而是「忘了项目现在什么状态」，导致重复劳动、互相覆盖。Anthropic 11 月 9 日发的实验里，1,000 个 agent 用 Lean 重新证明费马大定理，没有任何专用协作平台，只给了 Git 和一个共享 Postgres 数据库，没有聊天工具。领头 agent 开工 10 分钟就自己建了五张表：公告、分派、留言板、子任务（谁先认领谁负责）、完成记录。28.7 小时后证完。作者明确说，之前早期尝试失败正是因为 agent「丢了项目状态、不再有效协作」。

**和你已会的东西的关系**：你用 subagent 或并行 worktree 时，主 agent 靠对话把结果「带回来」，这是消息式协作；一旦并行的 agent 多于两三个、或者跨会话，就需要一个所有人都能看的状态源，这就是黑板。你给 software factory 规划的「触发器自动开工」，背后也需要一张任务表让每个 agent 先认领再动手，否则两个 agent 会抢同一个 issue。它和昨天的 agent harness 是两层：harness 管单个 agent 的循环，黑板管多个 agent 之间的状态。

**入门原文**：[Safely scaling multi-agent teams with Claude Fable 5.2](https://claude.dev/blog/safely-scaling-multi-agent-teams-with-fable-5-2/)（Barry Zhang、Tianyi Peng、Elle Najt、Keller Scholl、Lance Martin，claude.dev，2026-11-09）；背景：[Blackboard system](https://en.wikipedia.org/wiki/Blackboard_system)（Wikipedia）

**上手 prompt**：
```
目标：给这个仓库加一块最小的「任务黑板」，让多个并行 agent（不同 worktree 或不同会话）通过同一个文件认领任务、汇报进度，不再靠我在中间转述。先给方案，等我确认再写文件。

1. 先读仓库：现在有没有任务清单、TODO 文件、issue 模板、agent 说明书（CLAUDE.md / AGENTS.md 等）里关于并行工作的规则。没有就写「没有」，不要编造。
2. 设计一个放在仓库里的黑板文件（例如 .agents/board.md 或 .agents/board.jsonl，你选并说明理由），至少包含：任务 id、一句话描述、状态（open / claimed / done / blocked）、认领者（agent 或分支名）、认领时间、完成证据（命令输出或 PR 链接）。
3. 写清规则，加进说明书，不超过 8 行：动手前先认领，已被认领的不碰；认领超过约定时间没更新视为可接手；完成必须附证据；遇到阻塞写 blocked 和原因，不要静默放弃。并说明在多个 worktree 里怎么避免同时改这个文件产生冲突（例如每个 agent 只追加一行，或每任务一个文件），给出你的选择和理由。
4. 验收：用两个模拟 agent（可以是你自己先后扮演两个角色）演示一次「A 认领 1 号、B 看到后认领 2 号、A 完成并附证据」，贴出黑板文件每一步的内容和 git diff。
5. 交付：黑板文件格式、说明书改动 diff、演示记录，并列出这个方案在 agent 数量变多时会先在哪里出问题。

参考：Anthropic《Safely scaling multi-agent teams with Claude Fable 5.2》https://claude.dev/blog/safely-scaling-multi-agent-teams-with-fable-5-2/
```

## 本期条目

### 1. 一句话决定 agent 是「顺手重构」还是「只做你要的」：告诉它代码归谁

- **要点**：Anthropic 给新模型 Claude Fable 5.2 发的官方提示指南里有一节「Say who owns the code」。在他们的小型编码任务测试里，prompt 不提代码归属、或者说代码是别人的，模型倾向于在原有结构上往上叠，即使会重复已有代码，看到附近的问题也只报告不修。加一句 `This codebase is yours: what it's for and how it's built are your call, and you'll keep building on it.` 后，合并重复代码的比例从不到十分之一升到约一半。代价也写得很清楚：输出 token 约 1.5 倍，多出很多没人要的测试和文档，约六到十次里有一次改了现有功能的行为（effort 越高越常见），结尾总结常漏掉小改动，所以要看 diff 不要只看总结。还有一条反直觉的：同一个 prompt 里写了「No drive-by refactors」也压不住这句话，仍有约三分之一会合并代码。结论是两种场景分开用：要 agent 边做边还技术债时加，要外科手术式小改时别加。Simon Willison 11 月 10 日也专门引了这一节。这些都是 Anthropic 自测数据，换模型、换任务效果可能不同，最好在自己仓库里测一次。
- **链接**：[Prompting Claude Fable 5.2 · Say who owns the code](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2#say-who-owns-the-code)（Anthropic 官方文档）；引用：[A quote from Prompting Claude Fable 5.2](https://simonwillison.net/2026/nov/10/prompting-claude-fable-52/)（Simon Willison，2026-11-10）

```
目标：在这个仓库里做一个小 A/B 实验，验证「声明代码归属」这一句话对我所用 coding agent 的影响，然后决定把它放进哪种工作模式。不要合并任何实验分支。

1. 先读仓库，挑一个真实的小改动任务：最好是新功能会自然碰到已有重复代码的地方。用 3 句话写清任务和验收标准，先给我确认。
2. 建两个独立的 git worktree（或临时分支），用同一个模型、同样的 effort，对同一任务各跑一次：
   A 组：只给任务描述。
   B 组：任务描述前加一句：This codebase is yours: what it's for and how it's built are your call, and you'll keep building on it.
   每组如果条件允许跑 2 到 3 次，跑不了就说明只跑了几次。
3. 对每次结果统计并制表：改动文件数、增删行数（贴 git diff --stat）、是否合并了重复代码、是否新增了没要求的测试或文档、是否改变了已有功能的行为（跑仓库实际的测试命令，先读仓库确认命令是什么）、agent 结尾总结漏掉了哪些改动。
4. 根据结果给建议：哪些场景（例如我自己长期维护的模块、重构任务）在说明书或任务 prompt 里加这句话，哪些场景（例如别人的代码、只修一个 bug）明确不加。写成不超过 5 行的说明书草案，等我确认再写入。
5. 交付：对照表、每组的 diff --stat 和测试输出、建议草案。说明样本量很小，结论只代表这个仓库。

参考：Anthropic《Prompting Claude Fable 5.2》Say who owns the code 一节 https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2#say-who-owns-the-code
```

### 2. 说明书和记忆里堆积的「永远不要……」会让 agent 越来越不敢动：定期清理，并把例外写进规则本身

- **要点**：同一份指南的「Keep caution from piling up」一节说，记忆、笔记、说明书、agent 之间的消息会不断累积谨慎指令，新模型照做得很严格，于是会去要不必要的批准、不做常规工作，多 agent 场景最常见。Anthropic 模拟测试里的几个数字：上下文里十几条旧笔记中有一条写「永远不要重试」，工具忙时的重试率从几乎每次掉到约四成；在规则末尾明确列出「重试属于无需批准的步骤」，重试率从几乎为零回到约一半，而一句笼统的「放开点做」毫无作用；负责人批准过某步骤，在「永远不要」规则下模型只有约一成会去做，另写一句「已批准的步骤可以做」也没多大用，把规则本身改成「先取得批准」才升到约九成。指南的迁移清单还建议删掉原因已不成立的谨慎条款、把绝对化规则改写成带范围和原因的版本，检查说明书、skills 和 agent 文件里遗留的「多用 subagent」指令（新模型在鼓励委派的环境里会大量开 subagent，成本可能占大头）。另一节「Finish the whole task」给了一段官方文字，用来减少 agent 半途停下来问「要不要我继续」：区分普通障碍（报错、超时、工具失败，要先诊断再绕过）和有意设置的阻碍（标了不准碰的文件、被收回的权限，要停下报告）。他们回放会话测出，加这段后留着能做的活就停下的会话约少一半，输出 token 多约 30%。
- **链接**：[Prompting Claude Fable 5.2 · Keep caution from piling up](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2#keep-caution-from-piling-up)、[Review instructions written for earlier models](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2#review-instructions-written-for-earlier-models)、[Finish the whole task](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2#finish-the-whole-task)（Anthropic 官方文档）

```
目标：审计这个仓库和我本机给 coding agent 的所有说明书、skills、agent 定义和记忆文件，找出过时或过度的谨慎规则、遗留的「多用 subagent」指令，给出精简和改写方案。只读分析，没有我确认不要修改任何文件。

1. 列出所有相关文件及路径：仓库里的 CLAUDE.md / AGENTS.md / .cursor/rules / skills / .claude/agents 等，以及用户级的同类文件和 agent 记忆文件（以实际存在的为准）。不存在的写「没有」。
2. 逐条摘出三类句子，引用原文并标文件和行号：
   (a) 绝对化的谨慎规则：「永远不要」「绝不」「必须先问」「遇到错误立即停止」之类；
   (b) 推动委派的句子：「尽量用 subagent」「并行开多个 agent」之类；
   (c) 让 agent 少想或卡字数的风格规则。
3. 对每条判断：原因是否还成立（用 git log / git blame 查是什么时候、为什么加的，查不到就写查不到）；是否和另一条矛盾；是否该保留、删除，或改写成「范围 + 原因 + 例外」的形式。改写时把例外直接写进规则本身，例如「对可安全重复的读请求，失败可以重试最多 2 次，无需批准」，不要另起一行说「可以放开点」。
4. 单独检查：说明书里有没有区分「普通障碍要自己诊断解决」和「有意的阻碍要停下报告」。如果没有，参考官方指南 Finish the whole task 一节，起草一段不超过 6 行的版本，并保留对危险或不可逆操作的确认要求。
5. 交付：问题清单表（原文、位置、类别、建议、理由）、改写后的 diff 草案、预计删掉的总行数。

参考：Anthropic《Prompting Claude Fable 5.2》https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2#keep-caution-from-piling-up
```

### 3. 1,000 个 agent 的协作细节：领头只给方向，任务树往下拆，安全靠沙箱和逐条拦截

- **要点**：今日概念那篇文章里还有几个能直接借鉴的工程细节。分工：只设一个领头和 999 个助手，领头把 60 个目标分给 16 到 17 人一组、每组指定一个组长写计划拆子任务；后来助手自己往子任务表加任务，到第 5.6 小时已有 73 个助手写了 756 个任务，其中只有 16 个是组长；领头还会说「不要等我」，让空闲的助手自己找活。拆解：最难的一块（Langlands–Tunnell）组长最初估计成功率不到 1%，最后组织成一棵任务树，谁觉得一块太大就在下面拆小块，最多 10 层、2,418 个任务，每块可以先假设下层已证明，几百个助手因此能并行。教训：早期助手把 60 个目标里的 47 个判为预算内做不完，结果大部分都证出来了，作者说 agent 容易放弃难题、误判难度，这时人的鼓励有用；运行中 harness 自动提醒了领头 19 次剩余时间并鼓励继续。隔离：每个 agent 单独一台轻量虚拟机，因为单机在约 100 个 agent 时内存、磁盘或 CPU 就不够，超过一半的 100-agent 运行要中途停掉或重启；只能推自己的分支、开合并请求；没有网络；每个 shell 命令和文件编辑执行前都过一个 LLM 分类器，一旦拦截整个团队停下等人审查。这次一百多万次工具调用没有一次被拦。
- **链接**：[Safely scaling multi-agent teams with Claude Fable 5.2](https://claude.dev/blog/safely-scaling-multi-agent-teams-with-fable-5-2/)，Barry Zhang、Tianyi Peng、Elle Najt、Keller Scholl、Lance Martin（claude.dev，2026-11-09）

```
目标：参考 Anthropic 1,000-agent 实验的组织方式，为这个仓库写一个「大任务拆解 + 并行执行」的 skill，让我以后能把一个大改动交给一个领头 agent 去拆、派给多个并行 agent 执行。先给草案，等我确认再写文件。

1. 先读原文 https://claude.dev/blog/safely-scaling-multi-agent-teams-with-fable-5-2/ ，用不超过 8 行总结它的分工（领头 / 组长 / 助手）、任务树拆解规则、隔离与审查措施，只写原文里有的。
2. 再读这个仓库：我目前用哪个 coding agent、是否支持 subagent 或并行 worktree、有没有共享任务清单（没有就写没有），以及合并前必须通过的检查（先读仓库确认实际命令）。
3. 起草 skill（SKILL.md 格式，frontmatter 里的 description 写清什么时候用），内容包括：
   - 领头的职责：拆解成可独立验证的单元，每个单元写清验收命令；只给方向，允许执行者自己往下拆；
   - 执行者的职责：先认领再动手，只在自己的 worktree 或分支上改，完成必须贴验收命令输出；一块太大就拆成子任务写回清单，而不是硬做或放弃；
   - 对「这块做不完」的判断：要求写出具体卡在哪、试过什么，领头可以重新分配，不能直接丢弃；
   - 合并：只能通过 PR 或合并请求，不直接推主分支；
   - 并行数量上限和理由（结合我机器的实际资源，先查 CPU 和内存）。
4. 验收：拿仓库里一个真实但小的多文件改动，按 skill 走一遍拆解（只做到列出任务树和每个单元的验收命令，不实际执行），贴出结果，并指出 skill 哪里还不够具体。
5. 交付：SKILL.md 草案、演练结果、你对哪些做法在 2 到 5 个 agent 的小规模下其实没必要的判断。

参考：Anthropic《Safely scaling multi-agent teams with Claude Fable 5.2》https://claude.dev/blog/safely-scaling-multi-agent-teams-with-fable-5-2/
```

## 本期去重用源链接（机器可读）
- https://claude.dev/blog/safely-scaling-multi-agent-teams-with-fable-5-2/
- https://en.wikipedia.org/wiki/Blackboard_system
- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2
- https://simonwillison.net/2026/nov/10/prompting-claude-fable-52/
- （看过未收）https://platform.claude.com/docs/en/models/fable-5-2/whats-new-fable-5-2 （迁移说明，偏模型发布）
- （看过未收）https://claude.dev/blog/which-claude-model-should-you-build-with/ （选模型，偏产品）
- （看过未收）Simon 11-10 Gemini 4 Carbon / Muse Ember（模型发布，属泛 AI 新闻）
- （看过未收）https://x.com/HamelHusain/status/2120255044180435166 （evals-industrial complex 吐槽，太短）
- （仍待跟进）poteto 11-11 AI Engineer 演讲（11,000 PR/月不降质量），等录像或文字
