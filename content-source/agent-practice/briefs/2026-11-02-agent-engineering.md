# Agent 工程实践简报 · 2026-11-02

## 今日概念：Ralph loop（拉尔夫循环）/ loop engineering（循环工程）

**是什么**：Geoffrey Huntley 提出的最简单的"让 agent 自己一直干活"的方式，最纯粹的形态就是一行 Bash：`while :; do cat PROMPT.md | claude-code ; done`。每一轮都开一个全新的 agent 进程（上下文是空的），它先读磁盘上固定的几个文件（需求规格 specs/、待办计划 fix_plan.md、记录怎么构建运行的 AGENT.md），只挑一件最重要的事做完、跑检查、更新计划、提交，然后退出；下一轮再从头读。轮与轮之间只靠文件和 git 交流。CS146S 课程把它归到 "loop engineering" 这个主题下，和 spec-driven development、software factory 并列。

**解决什么**：一个会话越聊越长，上下文窗口越满，agent 越笨（Huntley 原话：用得越多，结果越差）。Ralph 用"每轮清空、状态全写在磁盘上"绕开这个问题。配套的关键词是 backpressure（回压）：编译器、类型检查、测试、静态分析这些能在下一轮开始前把坏结果挡下来的东西，而且要快，因为每一轮都要等它们。

**和你已会的东西的关系**：你想要的 software factory，最小的"自动开工"单元就是这个循环；你写的 CLAUDE.md/AGENTS.md 就是每轮必读的那几个文件之一。Huntley 还强调人的位置是"坐在循环上，而不是循环里"：盯着输出，发现重复犯的错，就往 prompt 里加一条规则或者把问题从根上修掉，这和你之前学的 pit of success、验证 skill 是同一套思路。他也明确说现阶段不需要搞复杂的多 agent 互相通信，一个仓库、一个进程、一轮一件事就够。

**入门原文**：[everything is a ralph loop](https://ghuntley.com/loop/)（作者 Geoffrey Huntley）；最早的完整版带提示词示例是 [Ralph Wiggum as a "software engineer"](https://ghuntley.com/ralph/)（作者 Geoffrey Huntley）。

**上手 prompt**：
```
目标：在当前仓库里搭一个最小的 "Ralph loop"（每轮全新上下文、一轮只做一件事、状态全写在磁盘上），先手动跑一轮验证，不要无限循环。

步骤：
1. 先读仓库，确认实际的构建、类型检查、lint、测试命令（看 package.json / Makefile / CI 配置等），并实际跑一遍，贴出命令和结果摘要。不要猜命令。
2. 新建以下文件（若已有同类文件，复用并说明）：
   - specs/README.md：只写一个我接下来要做的小功能或小改进的规格（先问我要哪一个；如果我没给，就从 TODO/FIXME 或 issue 模板里挑一个最小的，并说明来源）。
   - fix_plan.md：把这个规格拆成按优先级排列的待办清单，每项能在一次会话内做完。
   - 在 AGENTS.md（或 CLAUDE.md，二者有导入关系就只改一处）里补一段"如何构建/测试"，写第 1 步确认过的真实命令。
   - PROMPT.md：每轮的固定指令。必须包含：先读 specs/、fix_plan.md、AGENTS.md；只做 fix_plan.md 里最重要的一项；动手前先搜索代码确认它还没被实现；做完必须跑第 1 步的检查命令且全部通过才能提交；更新 fix_plan.md（勾掉完成项、记下新发现的问题）；新加的测试要写一句"为什么存在"；学到的正确命令写回 AGENTS.md；然后结束。
   - scripts/ralph.sh：循环脚本，必须有最大轮数参数（默认 3）、每轮日志写到 logs/ralph-<轮次>.log，fix_plan.md 没有未完成项时自动停止。不要用 --dangerously-skip-permissions 之类跳过权限的参数，除非我明确同意。
3. 不要运行循环脚本。只手动执行一轮：按 PROMPT.md 完成 fix_plan.md 的第一项。
4. 交付：贴出新增文件的路径、这一轮改了什么（diff 摘要）、检查命令的真实输出、fix_plan.md 的前后对比。列出你认为这个仓库的"回压"缺口（哪类错误目前没有自动检查能挡住）。
```

## 本期条目

### 1. Claude Code mods：用一个小 JS 文件改造 Claude Code 本身，比如给危险命令加拦截、给"删测试骗绿灯"加闸

- **要点**：Claude Code 2.1.287 起有了 mods：一个跑在会话里的 JS/TS 模块，本质是装在插件里的 hooks，能看到会话里的每个事件（工具调用、提交 prompt、回合开始结束、界面渲染），可以"旁观 / 改写 / 直接拒绝"。和 settings 里的 shell hook 比，它常驻会话、能存状态、能画界面、能注册斜杠命令。最省事的做法是直接用自然语言让 Claude 帮你写，它会问是否开启热重载；`claude plugin validate` 检查、`claude plugin test` 跑测试。文中的 Blast Radius 示例会在 `rm -rf`、`git reset --hard`、force push 前先列出将被影响的文件再让你确认，但作者也提醒它只看命令文本，是安全网不是权限系统，硬性禁止仍要用 permission rules。另外，mod 和插件一样拥有 Claude Code 的全部权限，只装可信来源的。
- **链接**：[Getting started with Claude Code mods](https://claude.dev/blog/getting-started-with-claude-code-mods/)，Addy Osmani（Anthropic，2026-10-01）；完整示例代码在 anthropics/claude-code-playground。

```
目标：给我写一个 Claude Code mod，叫 test-guard，防止 agent 为了让检查变绿而删除、跳过或弱化测试。

前置：先运行 `claude --version`，确认 ≥ 2.1.287；不满足就停下告诉我。先读本仓库，确认测试文件的实际命名规则和位置（例如 *.test.*、*.spec.*、__tests__/、tests/），以及测试框架里"跳过"的写法（例如 .skip、.only、xit、@pytest.mark.skip 等），列出证据（文件路径）。不要猜。

行为要求：
1. 在 tool.call 上拦截 Edit / Write / Bash：
   - 删除或重命名测试文件（包括 Bash 里的 rm / git rm / mv）→ 不放行，返回 deny，理由里写清"要删测试请先在对话里说明原因并让用户确认"。
   - 对测试文件的编辑如果新增了跳过/只跑某个用例的标记，或删掉的断言多于新增的断言 → 不放行，返回 deny 并说明是哪一行。
   - 其他调用一律原样 next(e) 放行。
2. 在 AbovePrompt 上画一行提示，显示本会话被拦下的次数；没有拦截时返回 next(e) 不占位置。计数存在 $.state 里，确保热重载后不丢。
3. 写 tests/test-guard.test.ts，至少覆盖：删测试文件被拒、加 .skip 被拒、正常修改测试被放行、普通源码修改被放行。

验收：贴出 `claude plugin validate` 和 `claude plugin test` 的完整输出，全部通过。说明这个 mod 挡不住的情况（例如通过脚本间接删文件），并建议哪些应改用 permission rules 硬性禁止。不要安装到全局，只在本会话用 --plugin-dir 加载。
```

### 2. 别从零写 eval：Hamel 和 Shreya 把 eval 方法论做成了一套 skill，可直接装，也是"skill 组怎么设计"的好范本

- **要点**：Hamel Husain 和 Shreya Shankar 发布的 evals skills，用一个入口 skill（evals-start）判断你的处境再分派：已有 eval 流程就走 eval-audit（按严重度列问题），有 trace 还没分析就走 error-discovery（做标注界面、挑样本、归纳失败模式）；另有生成合成数据、写 LLM judge、用人工标注校准 judge（TPR/TNR）、评 RAG、做审阅界面等。作者原话是这些只是起点，要按你的数据和领域改；文章也说"文档告诉 agent 做什么，遥测告诉它做没做成"。对你有两层用处：一是 App 里有 LLM 功能就能直接审一遍；二是"一个路由 skill + 多个单一职责 skill"的结构，可以照搬到你自己写的 skill 上。
- **链接**：[Evals Skills for Coding Agents](https://hamel.dev/blog/posts/evals-skills/)，Hamel Husain、Shreya Shankar（2026-03-02，8-31 更新）；仓库 ai-evals-course/evals-skills。

```
目标：评估本仓库里 LLM 功能的 eval 现状，并借鉴 evals skills 的结构整理我自己的 skill。

1. 先读仓库，找出所有调用 LLM 或 agent 的功能，以及现有的日志、trace、eval、测试。列出路径作为证据。若完全没有 LLM 功能，跳到第 4 步，并说明。
2. 安装 Hamel Husain 的 evals skills 之前，先把安装命令 `npx skills add https://github.com/ai-evals-course/evals-skills` 和它会写入的目录告诉我，等我确认再装。装好后先读一遍每个 SKILL.md，报告里面有没有会联网、改全局配置或执行外部脚本的步骤。
3. 运行 evals-start skill，按它选中的 skill 执行。如果选的是 eval-audit，每个诊断方向各开一个 subagent 并行调查，最后合成一份报告，存到 docs/evals/audit-<日期>.md。报告里每个问题要附文件路径或数据证据、严重度、下一步；没有证据的结论标"推测"。
4. 对照 evals skills 的结构（一个入口 skill 负责分派 + 多个单一职责 skill），检查本仓库 .claude/skills、.agents/skills 等目录下已有的 skill：列出职责重叠的、description 写不清"什么时候用"的、缺少验证步骤的。给出重组建议，只落地风险最低的一处修改，并说明怎么验证改完后触发更准确。
```

## 本期去重用源链接（机器可读）
- https://ghuntley.com/loop/
- https://ghuntley.com/ralph/
- https://claude.dev/blog/getting-started-with-claude-code-mods/
- https://hamel.dev/blog/posts/evals-skills/
- （看过未收）https://x.com/addyosmani/status/2116986087390486816 （ultrathink 中途提效小技巧，单条 tip）
- （看过未收）https://x.com/thorstenball/status/2116943219850440750 （主干开发后续讨论，10-30 已讲概念）
- （看过未收）https://x.com/karpathy/status/2116957135661945283 （周末项目展示）
- （看过未收）https://x.com/HamelHusain/status/2116987667716223160 （对 benchmark 公司的评论，无可照做）
- （看过未收）https://www.anthropic.com/engineering （最新仍为 10-13 source control，10-29 已看过）
