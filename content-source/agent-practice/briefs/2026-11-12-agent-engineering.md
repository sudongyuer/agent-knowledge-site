# Agent 工程实践简报 · 2026-11-12

## 今日概念：Property-based testing（属性测试）：不写具体例子，写「永远成立的规律」，让机器自己去找反例

**是什么**：平时的单元测试是「举例子」：输入 "abc"，期望输出 "cba"。属性测试反过来，你只写一条永远该成立的规律（属性），比如「字符串反转两次等于原字符串」，再由测试库自动生成成百上千个随机输入（空串、超长串、emoji、奇怪的 Unicode）去轰炸。一旦有输入让规律不成立，它会把这个反例缩到最小，交给你复现。Python 里最常用的库是 Hypothesis，JS/TS 常用 fast-check，几乎每种语言都有对应的库。

**解决什么**：单元测试只能测你想到的情况。Geoffrey Huntley 在 11 月 12 日发的演讲文稿里举了个例子：反转字符串的函数不支持 emoji，但你从没写过这个用例，它就漏过去了。agent 写代码时这个问题更严重：agent 自己写测试，通常也只测它自己想到的情况。属性测试能把业务规则直接变成检查，比如他举的「申请退款的客户只会被退款一次」。

**和你已会的东西的关系**：之前讲过 Ralph loop（让 agent 循环干活）和 hooks（确定性检查）。Huntley 的原话是 Ralph 从来不只是关于循环，而是阻止循环在坏代码上「收口」。属性测试就是一种很强的阻止手段：agent 每轮改完都要过一遍随机轰炸，比只跑它自己写的几个例子难糊弄得多。它也是 11 月 4 日讲的形式化验证（TLA+）的轻量版：形式化验证穷举所有状态，属性测试随机抽样，上手成本低很多。

**入门原文**：[the answer to ai is engineering](https://ghuntley.com/answer/)（Geoffrey Huntley，2026-11-12，看「property-based testing」一节）；概念背景：[What is Property Based Testing?](https://hypothesis.works/articles/what-is-property-based-testing/)（David R. MacIver，Hypothesis 作者）

**上手 prompt**：
```
目标：在这个仓库里给一个纯函数加上第一组属性测试（property-based test），并证明它能抓到普通单元测试漏掉的问题。先给方案，等我确认再写代码。

1. 先读仓库：确认语言、测试框架、实际的测试命令（从 package.json / pyproject / Makefile / CI 配置里找，不要猜）。说明是否已经装了属性测试库（例如 JS/TS 的 fast-check、Python 的 Hypothesis，或该语言的同类库）。没有就推荐一个并说明理由，安装前先问我。
2. 挑 1 到 2 个候选函数：纯函数，最好处理字符串、日期、金额、序列化/反序列化、排序/去重之类边界情况多的逻辑。列出文件路径和理由。
3. 为每个函数写 2 到 3 条属性，用一句中文先说明规律，例如：
   - 往返性：decode(encode(x)) == x
   - 不变量：排序后长度不变、元素集合不变
   - 幂等：f(f(x)) == f(x)
   - 业务规则：同一订单无论调用几次，最多退款一次
   不要把具体实现逻辑抄进属性里，否则测试等于实现本身。
4. 跑测试，贴出完整输出。如果找到反例，贴出测试库缩小后的最小反例，分析根因，先给修复方案等我确认；如果没找到，说明生成了多少个用例、覆盖了哪些边界（空值、超长、Unicode、负数等）。
5. 在 agent 说明书（CLAUDE.md / AGENTS.md，以实际存在的为准）里起草不超过 4 行的规则：哪类函数改动时要求同时补属性测试，以及跑哪个命令。等我确认再写入。

参考：Geoffrey Huntley《the answer to ai is engineering》https://ghuntley.com/answer/ ；David R. MacIver《What is Property Based Testing?》https://hypothesis.works/articles/what-is-property-based-testing/
```

## 本期条目

### 1. 别指望 agent 自觉：把「不许这么做」变成会失败的检查（back pressure），再用说明书给未来的 agent 留待办

- **要点**：Huntley 在 AI DevCon New York 的演讲文稿（11 月 12 日）里讲了两个可以直接抄的做法。第一个叫 back pressure（反压）：循环会不断生成、提交、编译代码，阻止它在坏输出上收口的最好办法是确定性检查，他强调「这些不是 skills，这是工程」。具体手段：代码编译不过就挡住 git push（pre-commit hook 或 prek），再加静态分析规则，比如「API 层不许被 SQL 层引用」这类领域隔离。他说这原本要靠架构评审，但 agent 很笨，照样会这么写，所以用检查把大部分代码审查的需求工程化掉。第二个是「AGENTS.md 提醒」：他打了临时补丁后，没开 Jira 工单，而是让 agent 在 AGENTS.md 里写一条「7 天后去掉这些补丁」，下一个接手这台机器的人或 agent 就自动把补丁和版本锁回退了，因为上游已经修好。
- **链接**：[the answer to ai is engineering](https://ghuntley.com/answer/)（Geoffrey Huntley，2026-11-12，章节「don't let the loop close: back pressure」「the AGENTS.md reminder trick」）；[X 帖](https://x.com/GeoffreyHuntley/status/2120602355066659231)

```
目标：给这个仓库加一层「反压」：把 agent 常犯、靠说明书文字挡不住的错误变成会让提交或推送失败的确定性检查。先出方案，等我确认再改。

1. 先读仓库：列出现有的 git hooks（.husky / lefthook / pre-commit / prek / .git/hooks 等，以实际存在为准）、lint 和类型检查配置、CI 里的检查步骤，以及 agent 说明书（CLAUDE.md / AGENTS.md）里所有「不要 / 禁止 / 必须」类规则。没有的写「没有」。
2. 找出说明书里写了、但没有任何自动检查兜底的规则，逐条引用原文和文件行号。再看 git log 最近 30 个提交，找出 agent 或人违反过这些规则的实际例子（贴 commit 哈希），没找到就写没找到。
3. 挑 3 条最值得自动化的，每条给出：
   - 用什么检查实现（lint 规则、依赖方向/模块边界检查、类型检查、脚本），优先用仓库已有工具；
   - 挂在哪一层（pre-commit、pre-push、CI），以及为什么。慢的检查不要挂 pre-commit；
   - 失败时的报错文案，要直接告诉 agent 该怎么改。
4. 每条检查都要证明有效：在临时分支上故意制造一次违规，贴出检查失败的输出；再撤销违规，贴出通过的输出。不要把演示用的违规提交到主分支。
5. 检查上线后，把说明书里对应的那条文字规则改短，或者改成「由 X 检查保证」，给出 diff。
6. 额外：如果仓库里有临时补丁、版本锁、绕过代码（搜 TODO/HACK/FIXME/workaround/pin），列出来，并为每个起草一条写进说明书的到期提醒，格式：「YYYY-MM-DD 后：检查 <上游条件>，满足则删除 <文件/行>，并删除本条」。等我确认再写入。

参考：Geoffrey Huntley《the answer to ai is engineering》https://ghuntley.com/answer/
```

### 2. Cloudflare 给约 3,900 个仓库批量生成 AGENTS.md：短、结构化、由程序生成后让团队审，再由代码审查机器人提醒它何时过期

- **要点**：Mihail Eric（CS146S 讲师）11 月 11 日说，Cloudflare 生产力平台负责人 Rajesh Bhatia 会来 CS146S 客座讲课，并提到 Cloudflare 一年内研发团队 93% 在用 AI 编码工具、每个合并请求都有 AI 审查、约 3,900 个仓库生成了 AGENTS.md。对应的 Cloudflare 博客（2026-04-20）讲了做法。起因是 agent 改出来的东西「看起来对，但对这个仓库是错的」，通常因为不知道正确的测试命令、团队现行约定、哪些地方不能碰。所以文件刻意保持短而信息密度高，固定分五块：Repository（运行时、测试/lint 命令）、How to navigate（目录结构）、Conventions、Boundaries（例如不改 gen/ 里的生成文件）、Dependencies（依赖谁、被谁依赖）。生成流程：从服务目录拉归属和依赖，分析仓库识别语言、构建系统、测试框架和目录，再由模型生成，并开合并请求给负责团队审改。他们的原话是「过时的 AGENTS.md 可能比没有更糟」，所以用 AI 代码审查在仓库变化时提示该更新 AGENTS.md。博客也提到下一步是云端后台 agent。
- **链接**：[The AI engineering stack we built internally — on the platform we ship](https://blog.cloudflare.com/internal-ai-engineering-stack/)（Cloudflare Blog，2026-04-20）；[Mihail Eric 的 X 帖](https://x.com/mihail_eric/status/2120591276575961596)（2026-11-11）

```
目标：参照 Cloudflare 的五段式结构，为这个仓库生成（或重写）一份短而准确的 AGENTS.md，并加一个「过期检测」，让它不会悄悄过时。只生成草稿，等我审完再提交。

1. 先读仓库，收集事实，每条都要有出处（文件路径或命令输出）：运行时和语言版本、包管理器、实际的安装/测试/lint/类型检查/构建命令（从 package.json scripts / Makefile / CI 配置读，并实际跑一遍测试和 lint 命令，贴出是否成功）、主要目录各放什么、已有约定（从 lint 配置、现有说明书、README、CONTRIBUTING 里找）、不能碰的地方（生成文件、vendor、迁移文件等）、对外依赖的服务或包。
2. 按五段写草稿，总长不超过 40 行：
   ## Repository / ## How to navigate this codebase / ## Conventions / ## Boundaries / ## Dependencies
   只写 agent 读代码推断不出、或容易推断错的信息；能从代码直接看出的不写。拿不准的写「待确认」并单独列给我，不要猜。
3. 如果已有 CLAUDE.md / AGENTS.md，逐条对比：哪些保留、哪些已过时（引用原文并说明证据）、哪些缺失。不要删除我写的内容，先列出来让我决定。
4. 过期检测：写一个小脚本或 CI 步骤，检查 AGENTS.md 里提到的命令和路径是否仍然存在（例如 scripts 里还有没有这个命令、目录还在不在），不存在就失败并指出哪一行。演示一次：临时改名一个被引用的目录，贴出失败输出，再改回来。
5. 交付：AGENTS.md 草稿、与旧文件的对比表、过期检测脚本和演示输出、「待确认」清单。

参考：Cloudflare《The AI engineering stack we built internally — on the platform we ship》https://blog.cloudflare.com/internal-ai-engineering-stack/
```

### 3. AWS 用 agent 团队写出整套 AWS 本地模拟器：先让测试对着「真东西」跑通，再让 agent 照着测试写实现

- **要点**：AWS 11 月 11 日发布 AWS Emulator，代码全部由 agent 编写和测试。Swami Sivasubramanian 在 Werner Vogels 博客的客座文章里讲了方法：agent 从公开 API 描述推导出端到端的「保真测试」（fidelity tests），先改测试直到它在真实 AWS 上通过（这样测试记录的就是真实行为），再写模拟器直到通过同一个测试，仍然失败的测试就指向模拟器的缺口。一组 agent 找缺口并给每个缺口提 issue，另一组认领 issue、写测试、实现、审查。每个改动都要过合并门禁：多个安全 agent 各自从不同攻击角度审查，另有一个通用代码审查者，还有确定性检查阻止 agent 碰不该碰的代码。他自己的教训最值得记：用 agent 重建当年手写、花了约四个月的复制引擎时，他盯了四个晚上才发现 agent 根本没法检查自己的结果；给了 spec 和测试环境之后，重建只用了约两小时。他的结论是：agent 写代码、自己检查时，工程师的工作是给它们自主空间，并搭好判定「何时算对」的 spec、测试和合并门禁。Simon Willison 也提到，项目头三周就有 29,684 个提交。
- **链接**：[AWS Emulator and the engineer's job when agents write the code](https://www.allthingsdistributed.com/2026/11/aws-emulator-and-the-engineers-job-when-agents-write-the-code.html)（Swami Sivasubramanian，All Things Distributed，2026-11-11）；[Test your applications against AWS locally with AWS Emulator](https://aws.amazon.com/blogs/aws/test-your-applications-against-aws-locally-with-aws-emulator/)（AWS News Blog）；[aws-emulator](https://simonwillison.net/2026/Nov/11/aws-emulator/)（Simon Willison，2026-11-11）

```
目标：用「先对真东西校准测试、再让实现追测试」的方法，给这个仓库依赖的一个外部服务做一个本地替身（fake/mock server），让 coding agent 写代码时能在本地自测。先出方案，等我确认再写。

1. 先读仓库：列出代码调用的外部服务（HTTP API、云服务、第三方 SDK），每个注明调用位置和现在测试里是怎么处理的（真实调用 / 手写 mock / 跳过）。挑一个最常被调用、又最难在本地测的作为对象，说明理由。
2. 写「保真测试」：从官方 API 文档或 SDK 类型定义里挑 5 到 10 个仓库实际用到的行为（包括错误情况，例如 404、限流、字段缺失），写成端到端测试。每个测试注明它依据的文档段落或类型定义位置。
3. 校准：如果我能提供测试账号或沙箱环境，先让这些测试对着真实服务跑通，贴输出；如果不能，明确说明测试只是依据文档写的、没对真实服务校准过，并标出哪些行为最可能和真实服务不符。不要用我的生产凭据，不要在真实服务上做写操作，除非我明确同意。
4. 实现本地替身，直到同一组测试全部通过，贴出测试输出。替身做不到的行为，写进一个「已知不支持」清单，不要假装支持。
5. 在 agent 说明书（CLAUDE.md / AGENTS.md）里起草不超过 3 行：本地如何启动替身、测试如何指向它、哪些行为仍然必须在真实环境验证。等我确认再写入。

参考：Swami Sivasubramanian《AWS Emulator and the engineer's job when agents write the code》https://www.allthingsdistributed.com/2026/11/aws-emulator-and-the-engineers-job-when-agents-write-the-code.html
```
