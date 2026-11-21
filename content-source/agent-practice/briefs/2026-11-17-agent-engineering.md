# Agent 工程实践简报 · 2026-11-17

## 今日概念：Differential testing（差分测试）：拿旧版本当「标准答案」，对比新旧两版的输出

**是什么**：同一批输入，分别喂给旧代码和新代码，比较两边的输出。只要有一处不一样，就说明新代码可能有 bug，或者改了原有行为。旧代码在这里充当「预言机」（oracle），也就是判断结果对不对的依据。这样你就不用为每个输入手写期望结果。这个方法由 William McKeeman 在 1998 年命名，当时用来测 C 编译器。

**解决什么**：
- 重构、换库、大迁移时，你最担心的是「看起来能跑，但某个边角行为变了」。手写测试只能覆盖你想得到的情况。差分测试用大量随机输入，或者一份真实流量样本，去找那些你没想到的差异。
- Anthropic 昨天（11 月 16 日）发的验证文章把它列为最值得投入的三种测试之一，并给了两个要点：一是先把无关的差异「归一化」掉，比如空格、时间戳、字段顺序；二是维护一张「已批准的差异」清单，写明哪些不同是有意为之。

**和你已会的东西的关系**：
- 11 月 12 日讲的属性测试，是先写一条「永远成立的规律」再随机找反例。差分测试连规律都不用写，规律就是「新旧结果必须一样」。两者可以合起来用：用属性测试的库生成随机输入，再用差分测试比较新旧两版的输出。
- 它特别适合交给 agent 去重构：agent 改完代码，差分测试会告诉它哪里和旧版不一样，这就是一个它自己就能跑的验证闭环。
- 局限：旧版本身就有的 bug，新版照样复制过去的话，差分测试发现不了。它只能证明「行为没变」，证明不了「行为是对的」。

**入门原文**：[Differential Testing for Software](https://www.cs.tufts.edu/comp/150FP/archive/bill-mckeeman/DifferentailTesting.pdf)（William M. McKeeman，Digital Technical Journal，1998）；[How the Claude Code team thinks about verification](https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification) 中的「Differential tests」一节（Addy Osmani，2026-11-16）

**上手 prompt**：
```
目标：在这个仓库里，给一处「重构前后行为应保持不变」的代码建立差分测试，让以后的重构有一个自动的对照组。先给方案，等我确认后再写文件。

1. 先读仓库，找 3 个适合做差分测试的候选：纯函数或输入输出清晰的模块，例如解析、格式化、序列化、数据转换、计算逻辑，最好是最近有人改过、或者准备重构的。每个候选写明文件路径、入口函数、输入和输出类型，以及为什么适合。
2. 我选定一个后，做以下几件事：
   - 把当前版本冻结成「旧实现」作为参照：从 git 的某个提交复制一份，或者在测试里引用旧提交的代码，说明你用的是哪种方法和哪个提交哈希。
   - 写一个输入生成器：优先使用仓库已有的属性测试库；没有的话，先读仓库确认语言和依赖，告诉我推荐用哪个库，等我同意后再装。另外，仓库里如果有真实的样例数据或 fixture，也一起作为输入。
   - 写一个归一化函数，把无关的差异去掉（例如空白、键的顺序、浮点数精度、时间戳），并逐条说明每项归一化的理由。
   - 建一个「已批准差异」清单文件，格式为「输入特征 / 旧输出 / 新输出 / 为什么允许」，一开始可以为空。
3. 测试先跑一次「旧实现对旧实现」，证明在没有改动时一定通过，贴出运行输出。然后故意在新实现里改一个小行为（例如边界值处理），证明测试能抓到，贴出失败输出和最小复现输入，最后把这个改动还原。
4. 交付：新增文件清单、运行测试的命令（先读仓库确认真实的测试命令）、两次运行的输出，以及一句话说明这个测试不能证明什么（旧版本身的 bug 测不出来）。

参考：https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification ；https://www.cs.tufts.edu/comp/150FP/archive/bill-mckeeman/DifferentailTesting.pdf
```

---

## 本期条目

### 1. Claude Code 团队怎么验证 agent 写的代码：检查规则放在改动碰不到的地方；新的拦截规则先「只记录不拦截」；按 diff 触发对应的检查清单

- **要点**：Addy Osmani 在 claude.dev 发文（2026-11-16），说 Claude Code 仓库约 90% 的代码由 Claude 编写和审查，并公开了团队的验证做法。挑几条能直接照抄的：
  - **用 verify skill 跑通整个应用**：把启动模拟器或本地服务、操作应用、检查结果的步骤写成一个叫 verify 的 skill，放在 `.claude/skills/`，并尽量靠近相关代码。Claude 提交前会先用它。移动端的建议是让它通过 iOS 或 Android 的 MCP 去操作。
  - **失败三轮就交给人**：Claude 自己跑检查、自己修，同一个检查修了三轮还是失败，就停下来找人。
  - **按 diff 触发的可靠性清单**：团队维护一份 39 项的清单，每项包括「从 diff 能看出的触发条件 + 要做的检查 + 对应的事故或 PR」。Claude 读 diff，只检查触发条件命中的那几项（通常 3 到 10 项），这样就没人需要记住过去的每次事故。
  - **改动不能修改评判它的规则**：Code Review 读的是默认分支上的 REVIEW.md，不是 PR 里改过的那份。只有针对某个具体提交的审查才算数，审查期间又推了新提交，结果就作废。
  - **新的拦截规则先开观察模式**：提交拦截规则（这次会话里没跑过 /code-review 或 /verify 就不让提交）分 off、observe、enforce 三档。observe 只记录「本来会拦下的提交」，先看误报。enforce 才真正拦截；同一会话被拦两次后放行，防止 Claude 卡死。每个提交都会标记「怎么验证的」，没验证就标 `none`，方便事后查询。
  - **把漏掉的问题变成规则**：一个问题在至少两个 PR 里出现过、并且能从 diff 看出来，才考虑写成规则；先让三个 agent 尝试推翻它，再由人在 PR 里批准。flaky 测试不能靠加 sleep 或重试混过去：找不到根因就删掉这个测试，并写下理由。规则文件也要定期清理。
- **为什么对你有用**：你想做的「软件工厂」，前提是不用逐个读 diff。这篇给出了把验证本身当成系统来维护的具体做法。下面的 prompt 先落地其中最容易上手的两条：按 diff 触发的检查清单，和只记录不拦截的提交检查。

```
目标：给这个仓库建两样东西：(A) 一份「按 diff 触发的可靠性检查清单」；(B) 一个提交前验证检查，先只开「观察模式」（只记录，不拦截）。先出方案，等我确认后再改文件。

A. 可靠性检查清单
1. 读 git log（至少最近 300 个提交）、revert 提交、含 fix/hotfix/regression 字样的提交，以及仓库里的事故或复盘文档（如果有）。找出重复出现的问题类型。
2. 只保留同时满足两个条件的条目：至少在 2 个提交或 PR 里出现过；从 diff 本身就能判断是否相关。每条写成：
   - 触发条件：diff 里出现什么就要检查，比如改了哪类路径、哪种文件、哪种 API 或字段；
   - 检查内容：要验证什么，怎么验证；
   - 证据：对应的提交哈希或 PR 链接。
3. 存成 docs/reliability-checklist.md（如果仓库已有约定的目录，就按约定放，并说明理由）。在 AGENTS.md 或 CLAUDE.md 里加不超过 5 行的规则：提交前读当前 diff，只检查触发条件命中的条目，并在回复里列出命中了哪几条、各自检查的结果。
4. 自测：挑 3 个历史上出过问题的提交，对每个提交的 diff 跑一遍这份清单，展示命中了哪些条目、能否发现当时的问题。再挑 2 个干净的提交作为对照，展示没有误报。

B. 观察模式的提交检查
1. 先读仓库，确认现在有哪些 git hook、pre-commit 配置、CI 检查，以及真实的测试、构建、lint 命令（不要猜）。
2. 设计一个提交前检查：提交信息末尾必须带一行 `Verified-by: <方式>`，方式可以是 tests / e2e / manual / none。设置三档模式，由一个配置项控制：
   - off：什么都不做；
   - observe：缺这一行，或者写的是 none，就把提交哈希、时间和原因写进日志文件，但照常放行；
   - enforce：缺这一行就拦下提交；但提交信息里写明了「为什么没验证」，就放行。
   默认设为 observe。
3. 把规则文件和检查脚本放在改动「碰不到」的位置，并说明你怎么保证这一点。例如 CI 里从默认分支读取规则，而不是从当前 PR 读取。
4. 交付：所有新增或修改文件的 diff；观察模式在一次缺 `Verified-by` 的测试提交上的日志输出；一句话说明我什么时候可以切到 enforce（例如观察一周、误报少于多少）。

参考：https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification
```

来源：[How the Claude Code team thinks about verification](https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification)（Addy Osmani，claude.dev，2026-11-16）

### 2. 注意 Claude Code 2.1.325 的改动：无人值守的 /loop 和定时任务，现在遇到「声明了 allowed-tools 或 hooks 的 skill」会停下来等你批准

- **要点**：Claude Code 2.1.325（npm 发布时间 2026-11-14 04:07，Asia/Kuala_Lumpur）有几条会影响「人不在也能跑」的改动，都写在官方 CHANGELOG 里：
  - 定时任务和 `/loop` 遇到声明了 `allowed-tools` 或 hooks 的 skill，运行前会先询问。想让它无人值守地跑，要把 `Skill(name)` 加进 `permissions.allow`。
  - 沙箱里的 Bash 命令默认改走正常的权限流程，不再自动放行。想恢复原来的行为，要设置 `sandbox.autoAllowBashIfSandboxed: true`。
  - Desktop、IDE、SDK 里的「Always allow」改了规则：只有保存后能真正放行同一条命令时，才会单独提供保存规则的选项。依赖这类规则的定时任务，现在可能停下来等你。
  - 隔离的 worktree 会话或 agent，现在会被拒绝运行 `git bisect run`、`git maintenance register|start` 和 `scalar` 的设置命令。
- **为什么对你有用**：升级后你的定时 agent「没报错，但一直卡在等批准」，原因可能就是这几条。下面的 prompt 让 agent 先查清楚哪些地方受影响，再给出只放行必要权限的改法。

```
目标：检查这台机器和这个仓库里的 Claude Code 无人值守配置（定时任务、/loop、后台 agent、CI 里的 claude -p），找出升级到 2.1.325 及以后版本会停下来等人批准、或者行为改变的地方。只读，先出报告，等我确认后再改。

1. 运行 `claude --version` 记录当前版本。读取 ~/.claude/settings.json、项目的 .claude/settings.json 和 .claude/settings.local.json，以及仓库里所有 SKILL.md（包括 .claude/skills/ 和插件目录）。
2. 列一张表：每个 skill 的名字 / 路径 / frontmatter 里有没有 allowed-tools / 有没有 hooks / 是否被定时任务、/loop 或 CI 调用（写出证据，例如调用它的脚本路径和行号）。标出「既声明了 allowed-tools 或 hooks，又会被无人值守调用」的 skill。这些在 2.1.325 起需要 `Skill(name)` 出现在 permissions.allow 里，否则会停下来询问。
3. 检查 sandbox 配置：如果开了沙箱，并且依赖沙箱命令自动放行，标出来。在 2.1.325 起这需要 `sandbox.autoAllowBashIfSandboxed: true`。
4. 检查有没有在 worktree 隔离环境里运行 `git bisect run`、`git maintenance register` 或 `git maintenance start`、`scalar` 的脚本或 skill，列出位置。
5. 给出最小的修改建议（diff 形式，不要直接改）：只给真正需要无人值守运行的 skill 加 `Skill(name)`，并逐个说明理由；不要一刀切地放开所有 skill。对每个建议，说明不加会怎样、加了以后多了什么风险。
6. 如果版本允许，用一个只读的小 skill 实际跑一次 `/loop` 或 `claude -p`，证明修改前会停下来询问、修改后能跑通。贴出两次的输出。

参考：https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md （2.1.325 一节）
```

来源：[Claude Code CHANGELOG · 2.1.325](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)（Anthropic）

### 3. 多 agent 并行的分工规则：任务之间共用文件或测试就排队一个个做，互不相干才并行；每个子 agent 只交回固定格式的结果

- **要点**：Google Antigravity 11 月 13 日上线了 Dynamic Workflows（`/run-workflow`）：主 agent 先写一段 Python 脚本，你审过以后才运行。脚本用 `parallel()` 并行跑子 agent，用 `pipeline()` 按顺序一个个跑。每个子 agent 有自己独立的对话，看不到脚本，也看不到彼此，只按 JSON Schema 交回结构化结果。官方文档里有一条通用规则：任务之间互不相干（每个文件审一遍、每个包审计一遍）才用并行；共用同一批文件、同一套测试或同一个数据库，就用 pipeline 一个个做。并行改代码时，用 `workspace="branch"` 给每个 agent 分配独立的 git worktree。`parallel()` 里只要有一项失败，其余的都会被取消。
- **和以前讲过的关系**：10 月 27 日讲过 Claude Code 的 dynamic workflows，思路一样：中间结果留在脚本变量里，不进主对话。这次值得记的是上面那条「什么时候能并行」的判断规则，换哪个工具都适用。

```
目标：我想把一个大任务拆给多个 agent 并行做。先帮我判断怎么拆才安全，只出方案，不改代码。

任务：<在这里写你的任务，例如「给所有 API 模块补错误处理」>

1. 先读仓库，把任务拆成具体的工作项，每项写清：要改哪些文件、要跑哪些测试（先读仓库确认真实的测试命令）、依赖哪些共享资源（同一个文件、同一个配置、同一个数据库或快照、同一个生成的产物）。
2. 画出冲突表：任意两项如果会改到同一个文件，或者共用会被修改的测试状态，就标为「冲突」。按冲突关系分组：
   - 组内没有冲突的项：可以并行，每项在独立的 git worktree 或分支里做；
   - 有冲突的项：排成顺序执行，说明顺序和理由。
3. 给每个子 agent 写一份完整的、自包含的任务说明（它看不到其他 agent 和主对话），要求它只交回一个固定格式的 JSON，至少包括 status / changed_files / tests_run / test_result / notes。给出这个 JSON Schema。
4. 写清合并方案：worktree 按什么顺序合回来、合并后跑哪些检查；任意一个子任务失败时，其他任务是停下还是继续，以及理由。
5. 最后估算：并行能省多少时间；哪一项最容易成为瓶颈；哪一项其实不值得拆出去，交给单个 agent 做更好。

参考：https://antigravity.google/docs/dynamic-workflows/
```

来源：[Dynamic Workflows (/run-workflow)](https://antigravity.google/docs/dynamic-workflows/)（Google Antigravity 官方文档）；上线日期见 [AI Frontier Post 教程](https://aifrontierpost.com/articles/antigravity-dynamic-workflows-run-workflow-tutorial/)

---

## 本期去重用源链接（机器可读）

- https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification
- https://www.cs.tufts.edu/comp/150FP/archive/bill-mckeeman/DifferentailTesting.pdf
- https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md （2.1.325；2.1.326 看过未收：Code Mode 可与 agent teams 同开）
- https://antigravity.google/docs/dynamic-workflows/
- https://aifrontierpost.com/articles/antigravity-dynamic-workflows-run-workflow-tutorial/
- （看过未收）https://x.com/trq212/status/2122438326431154210 （Thariq：软件工厂是暂时问题，更值得想的是人和 agent 协作的工作区；观点，无可照做的步骤）
- （看过未收）https://x.com/dexhorthy/status/2122469140539879620 （「代码库里禁用 pin 和 stamp 两个词」，没说明原因）
- （看过未收）https://x.com/sammy_capital/status/2122308362545053933 （harness 7 招的二手汇总，没附原文出处）
- （看过未收）https://code.claude.com/docs/en/llm-gateway （LLM gateway，11-07 已讲）
