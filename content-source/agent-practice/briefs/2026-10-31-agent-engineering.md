# Agent 工程实践简报 · 2026-10-31

## 今日概念：Pit of Success（成功之坑）

**是什么**：一种设计思路：把系统设计成"顺手做的就是对的，想做错反而要费劲"。人（或 agent）不用记住一堆规则，顺着最省力的路走，自然就掉进"成功的坑"里。这个词是 Rico Mariani 讲语言设计时提出的，Jeff Atwood 那篇文章让它广为人知。

**解决什么**：规则写在文档里，靠人记、靠 agent 读，总会漏；尤其是 agent，每次进来都是"新人"，上下文很少。与其在 CLAUDE.md 里写"不要直接调用 X"，不如让错误的写法根本编译不过、lint 报错、或者正确的写法有现成的脚手架一键生成。

**和你已会的东西的关系**：poteto 昨天的帖子说的就是这件事：agent 写代码会像一条湍急的河，唯一的办法是改造系统，让"连上下文很少的 agent 也能干好活"，原话是 make the easy thing the right thing。它是之前讲过的 agent-ready 代码库再往前一步：agent-ready 是让仓库能给反馈，pit of success 是让默认路径本身就是对的。也和你写 skill 的经验相关：能下沉成类型、lint、脚手架的规则，就别再写成 skill 里的散文。

**入门原文**：[Falling Into The Pit of Success](https://blog.codinghorror.com/falling-into-the-pit-of-success/)（作者 Jeff Atwood）；agent 视角看 [poteto 的帖子](https://x.com/poteto/status/2116191971714953262)（作者 lauren / poteto）。

**上手 prompt**：
```
请帮我把当前仓库往"成功之坑"（pit of success）的方向改一步：让 agent 顺手写出来的就是对的，写错反而会被立刻拦住。
背景（若可联网先读）：https://blog.codinghorror.com/falling-into-the-pit-of-success/ 和 https://x.com/poteto/status/2116191971714953262
1. 先读仓库，确认实际的类型检查、lint、测试命令（看 package.json / Makefile / CI 配置等），不要猜。
2. 找出 5 条"目前只靠文档或口头约定维持"的规则：来源包括 CLAUDE.md / AGENTS.md / skills / README / 代码评审里反复出现的意见。每条标出原文位置。
3. 对每条判断能不能改成"默认就对"：例如用类型让错误用法编译不过、加一条 lint 规则（报错信息里直接写正确做法）、提供一个封装好的函数或生成脚本让正确写法比错误写法更省事、或在测试里固化。写出改法和成本。
4. 只实现成本最低、最有把握的 1 条，并把文档里对应的散文规则删掉或缩成一句指向新检查的话。
验收标准：贴出一张"规则 | 现在靠什么维持 | 改成什么 | 成本"的表；对实现的那条，演示故意写错时检查失败、改对后通过（贴命令和真实输出）；附 diff。不要做大重构。
```

## 本期条目

### 1. 让一个模型写、另一个模型审时，审查循环停不下来：给 reviewer 加"概率 × 严重度"门槛

Vox 发现用 Opus 写代码、用 Codex 审时，审查方总会挑出"理论上可能、实际几乎不会发生"的 bug，写代码的一方照改，审查方又挑下一个，循环停不下来。他的做法是在审查 prompt、skill 或 AGENTS.md 里加一句：每个 bug 按"多常发生"和"多严重"各打 1 到 10 分，两数相乘低于 5 就只记成 issue，不改代码（阈值按项目调）；再给写代码的一方加一句"不要为没人提过的罕见或未来情况做设计"。

```
请给本仓库的"AI 代码审查"加一道门槛，防止审查和修复无限循环。
参考原文：https://x.com/Voxyz_ai/status/2115518965443076573
1. 先找出仓库里所有给 agent 用的审查相关说明：AGENTS.md、CLAUDE.md、REVIEW.md、.claude/agents、.claude/skills、.agents/skills、CI 里调用 AI 审查的配置。列出路径；没有就说明。
2. 在审查用的那份说明里加入规则：每个发现都要给出"发生频率"和"严重程度"各 1–10 分及一句理由；两数相乘低于阈值（先用 5）的只写进一个待办列表（例如 docs/review-backlog.md 或 issue 草稿），不要求改代码；高于阈值的必须附文件:行号和能复现的触发条件。
3. 在写代码方的说明（AGENTS.md 或 CLAUDE.md）里加一句："不要为没人提过的罕见或未来情况做设计。"如果两份文件是导入关系，只改一处，别重复。
4. 拿当前分支相对 main 的 diff（没有就用最近一次合并的提交）实际跑一次审查，按新规则输出结果。
验收标准：贴出改动的 diff；贴出这次审查的完整输出，包含每条发现的两个分数和乘积，以及哪些被放进待办、哪些要求修复；说明阈值 5 在本仓库是否合适、建议怎么调。不要改业务代码。
```

原文：[Vox 的帖子](https://x.com/Voxyz_ai/status/2115518965443076573)（作者 Vox / @Voxyz_ai，2026-10-28）

### 2. 谁写 eval，谁就决定产品变成什么样：把 trace 和评分标准交给懂业务的人

Mihail Eric（CS146S 讲师）发了一篇 Monaco 团队的实践长文。和你最相关的两条：一是 agent 的每次运行都留下 trace（完整执行记录：看到了什么上下文、调了哪些工具、哪一步出错），并且非工程师也能读；二是 eval 的评分标准、标注样例和失败类型由最懂业务的人来定，而不是工程师猜"好输出长什么样"。文中原话的意思是：在 agent 时代，测试才是产品的事实来源，而写 eval 的人决定产品变成什么样。

```
请帮我把本仓库里一个 AI/agent 功能的评估，改成"由懂业务的人定标准"的形式。只搭框架，不改功能代码。
参考原文：https://x.com/mihail_eric/status/2116218920587960346
1. 先读仓库，找出调用 LLM 或 agent 的功能，以及现有的日志、trace、eval 或测试。列出路径；如果没有调用 LLM 的功能，就改用"coding agent 在本仓库完成任务"作为评估对象，并说明。
2. 选一个功能，确认它的每次运行能不能留下可读的 trace（输入、上下文、工具调用、输出）。如果不能，写出最小的记录方案（先不实现）。
3. 新建 evals/<功能名>/README.md，给非工程师用：
   - 一张空的评分表模板：样例编号 | 输入 | 输出 | 通过/不通过 | 失败类型 | 备注
   - 一份"失败类型"清单，先留空，说明由业务负责人在看过至少 30 条真实记录后填写
   - 一句说明：评分标准以这份文件为准，工程师不得自行修改
4. 从仓库已有的真实数据或日志里挑 5 条样例填进表的前两列（没有真实数据就留空，不要编造）。
验收标准：贴出新文件全文；说明 trace 目前缺什么；所有样例都标明来自哪个文件或日志；明确写出哪些部分需要我或业务负责人来填。
```

原文：[Principles for Building Effective Vertical AI Products](https://x.com/mihail_eric/status/2116218920587960346)（Mihail Eric 发布的 X 长文，2026-10-30）

## 本期去重用源链接（机器可读）
- https://blog.codinghorror.com/falling-into-the-pit-of-success/
- https://x.com/poteto/status/2116191971714953262
- https://x.com/Voxyz_ai/status/2115518965443076573
- https://x.com/mihail_eric/status/2116218920587960346
- （看过未收）https://x.com/AmpCode/status/2116188879648911570 （1 小时视频，未观看）
- （看过未收）https://x.com/poteto/status/2116302165702783320
- （看过未收）https://x.com/stretchcloud/status/2116020268187459632
- （看过未收）https://simonwillison.net/2026/Oct/30/nesformer/
