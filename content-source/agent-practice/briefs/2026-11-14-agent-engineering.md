# Agent 工程实践简报 · 2026-11-14

## 今日概念：Dependency cooldown（依赖冷却期）：新发布的包先晾几天，再允许安装

**是什么**：在包管理器里设一个「最短发布时间」，比如 3 天或 7 天。某个包的新版本发布不满这个时间，安装时就当它不存在，自动用更早的版本。不需要额外工具，主流包管理器都内置了这个配置，只是名字和单位各不相同：
- npm（11.10.0 起）：`.npmrc` 里写 `min-release-age=7`，单位是**天**
- pnpm（10.16 起）：`pnpm-workspace.yaml` 里写 `minimumReleaseAge: 10080`，单位是**分钟**（pnpm 11 默认已开 1 天）
- Yarn（4.10 起）：`.yarnrc.yml` 里写 `npmMinimalAgeGate: "7d"`
- Bun（1.3 起）：`bunfig.toml` 的 `[install]` 下写 `minimumReleaseAge = 604800`，单位是**秒**
- uv（0.9.17 起）：`pyproject.toml` 的 `[tool.uv]` 下写 `exclude-newer = "7 days"`

**解决什么**：供应链投毒通常是这样：有人盗了某个流行包的发布权限，推一个带恶意代码的新版本。pnpm 官方博客说，这类恶意版本大多在一小时内就会被发现并下架。所以你晚几天再装，基本就躲过去了。agent 的问题在于它装依赖很勤快，经常顺手 `npm install 某某@latest`。Semgrep CEO Isaac Evans 上周在 Stanford CS146S 讲课时说，依赖冷却期是「最便宜、最有效的供应链防御」，并且要用确定性 hook 强制执行，而不是在说明书里叮嘱 agent。

**和你已会的东西的关系**：
- 11 月 6 日讲过「确定性 hooks vs 可选 MCP」：冷却期就是那条原则的现成例子。写进包管理器配置，agent 想绕都绕不过去。
- 11 月 10 日讲过恶意包往 CLAUDE.md、hooks 里下毒：那是包装进来**之后**的危害，冷却期是在**装之前**把门关上。
- 注意单位：pnpm 写 `7` 是 7 分钟，Bun 写 `7` 是 7 秒，npm 写 `10080` 是大约 27 年。另外 npm 低于 11.10 的版本会直接忽略这个配置，不报错。

**入门原文**：[Dependency Cooldowns](https://cooldowns.dev/)（各包管理器配置对照表，含单位和版本要求）；背景读 [Package Managers Need to Cool Down](https://nesbitt.io/2026/03/04/package-managers-need-to-cool-down.html)（Andrew Nesbitt）；出处 [Mihail Eric 转述 Isaac Evans 在 CS146S 的分享](https://x.com/mihail_eric/status/2121314052320444471)

**上手 prompt**：
```
目标：给这个仓库加上「依赖冷却期」（dependency cooldown），让任何人或 agent 都装不上发布不满 7 天的包版本。先出方案，等我确认再改文件。

1. 先读仓库：找出用了哪些包管理器（看 lockfile、package.json 的 packageManager 字段、pyproject.toml、CI 配置等），并确认每个包管理器在本地和 CI 里的实际版本（跑 --version，CI 里看 setup 步骤）。列出证据：文件路径和命令输出。
2. 对每个包管理器，按 https://cooldowns.dev/ 查对应的配置键、单位和最低版本，写出要改的配置。必须换算对单位（npm 按天、pnpm 按分钟、Bun 按秒、Yarn 和 uv 写时长字符串）。如果当前版本低于最低支持版本，明确告诉我：配置会被静默忽略，并给出升级方案或一个在版本过低时让安装失败的检查。
3. 列出需要豁免的包（例如本组织自己发布的内部包），只豁免确实归我们所有的 scope，说明理由。不确定的标成「待我确认」。
4. 验证：配置写好后，找一个发布不到 7 天的真实包版本（用 npm view <pkg> time 或对应命令查发布时间）尝试安装，贴出被拒绝或被降级的输出；再跑一次正常安装，证明现有 lockfile 不受影响。不要提交任何改动。
5. 最后给我一张表：包管理器 / 版本 / 配置文件 / 配置值 / 验证结果，并贴出 git diff。

参考：cooldowns.dev https://cooldowns.dev/ ；Isaac Evans（Semgrep）在 Stanford CS146S 的分享，Mihail Eric 转述 https://x.com/mihail_eric/status/2121314052320444471
```

## 本期条目

### 1. 说明书里的规则，agent 要么每次都听，要么一次都不听：2,053 条真实规则里，54% 每次遵守，37% 从没遵守过

- **要点**：意大利萨莱诺大学和日本奈良先端科学技术大学院大学（NAIST）的研究者，从 268 个 GitHub 仓库里拿到 621 份 AGENTS.md / CLAUDE.md / copilot-instructions 快照，以及 agent 按这些文件写出的 6,541 个 commit。他们把每条规则变成一个能自动判断「这个 commit 遵守了没有」的检查脚本，最后有 2,053 条规则能拿真实 commit 打分。平均遵守率 59.8%，但分布是两极的：54.4% 的规则每次都遵守，37.3% 一次都没遵守，中间状态只有 8.3%。「开发流程」类（提交格式、分支规则）最差，平均 34.0%；测试类 49.2%。分工具看，Copilot 66.0%，Claude Code 52.2%，Codex 51.2%。作者提醒：流程类的差距在更严格的样本筛选下不显著，只能算方向性结论。
- **能直接照做**：抽查几条规则发现都被遵守了，并不能说明其余规则也被遵守。应该给每条重要规则单独做一次测试；测出来总不被遵守的，改写成 hook、lint 或 CI 检查。论文的方法本身就能照搬：一条规则对应一个检查脚本，拿历史 commit 去跑。
```
目标：测出这个仓库的 agent 说明书（AGENTS.md、CLAUDE.md、.github/copilot-instructions.md 等，以仓库里实际存在的为准）中，哪些规则 agent 真的在遵守，哪些从没被遵守。只读分析，不改任何文件。

1. 找出仓库里所有 agent 说明书文件，逐条抽取「明确、可执行、能在 commit 里看出来」的规则（例如「测试文件放在 X 目录」「不许用 Y 库」「commit message 用 Z 格式」）。只能靠人判断、在代码里留不下痕迹的规则（如「先想清楚再写」）单独列出，标成「不可检查」。
2. 用 git log 找出最近由 agent 写的 commit（看 Co-authored-by、提交者名字、commit message 里的工具标记等；判断依据要贴出来）。如果分辨不出哪些是 agent 写的，就用最近 50 个 commit，并在报告里说明这个限制。
3. 对每条可检查规则写一个小检查脚本：输入一个 commit，输出「遵守 / 违反 / 不适用」（commit 没碰到这条规则管的文件就算不适用）。先用一个明显遵守和一个明显违反的例子验证脚本本身是对的，再拿去跑真实 commit。
4. 输出一张表：规则原文 / 所在文件和行号 / 适用的 commit 数 / 遵守率 / 一个违反的 commit 哈希作证据。适用 commit 少于 3 个的，标成「样本太少」。
5. 对遵守率为 0 或很低的规则，给出处理建议：改写措辞、删掉，还是改成 hook / lint / CI 检查（写出具体检查长什么样）。等我确认再动手。

参考：Voria、Kashiwa、Catolino、Palomba，《Do They Do as They Are Told? Investigating Coding Agents' Adherence to Explicit Instructions in Context Files》https://arxiv.org/abs/2611.13709
```
- **原文**：[Do They Do as They Are Told? Investigating Coding Agents' Adherence to Explicit Instructions in Context Files](https://arxiv.org/abs/2611.13709)（Gianmario Voria、Yutaro Kashiwa、Gemma Catolino、Fabio Palomba）；解读：[Your AGENTS.md rules are switches, so test each one like code](https://andreasrau.tech/writing/agentic-coding-paper-2026-11-13/)（Andreas Rau）

### 2. Claude Code 的 advisor：日常用便宜模型干活，只在关键节点请更强的模型「看一眼」

- **要点**：Claude Code 官方文档新增了 advisor tool（实验功能）。开启后，主模型在三个时刻会去问一个更强的模型：定方案之前、同一个错误反复出现时、宣布完成之前。advisor 能看到完整对话（包括每次工具调用和结果），给出建议，代码还是由主模型来写。开启方式：会话里输入 `/advisor opus`，或启动时加 `--advisor`，或在设置里写 `"advisorModel": "opus"`；关闭用 `/advisor off`。advisor 的档次必须不低于主模型。官方的说法是：它适合「大部分步骤很常规、但方案好坏决定结果」的长任务，比如大重构、反复出现的 bug；短任务用处不大。它不支持 Bedrock、Google Cloud、Microsoft Foundry，只能走 Anthropic API 或 Claude Platform on AWS。
- **和以前讲的关系**：11 月 13 日讲过「评测 agent 配置别只看通过率，还要看成本」。advisor 就是一个典型的待测配置，值得用你自己的任务对比一下「换更强主模型」和「便宜主模型 + advisor」。
```
目标：在这个仓库里对比两种 Claude Code 配置，看 advisor tool 值不值得开：A = 只用当前主模型；B = 当前主模型 + /advisor 设为更强一档的模型。只测试，不合并任何改动。

1. 先读 https://code.claude.com/docs/en/advisor ，确认我当前的 Claude Code 版本、主模型和账号类型支持 advisor（跑 claude --version，并说明依据）。不支持就停下来，告诉我原因。
2. 从仓库的 git 历史里挑 3 个过去真实发生过、已经修好的问题（最好是一个多文件重构、一个反复出错才修好的 bug、一个小改动），把代码切回修复前的 commit，在独立的 git worktree 里分别用 A 和 B 各跑一次。验收标准用当初修复时加的测试，或者仓库现有的测试命令（先读仓库确认实际命令）。
3. 每次运行记录：是否通过验收、用了多少轮、token 或费用（用 /cost 或会话结束时的统计）、advisor 被调用了几次、在什么时刻被调用。
4. 输出对比表，并给结论：在哪类任务上 B 更值，在哪类任务上没区别。样本只有 3 个，结论要注明「仅供参考」，不要夸大。
5. 跑完删除临时 worktree，贴出 git worktree list 和 git status，证明主工作区没被改动。

参考：Anthropic，Claude Code 文档「Escalate hard decisions with the advisor tool」https://code.claude.com/docs/en/advisor
```
- **原文**：[Escalate hard decisions with the advisor tool](https://code.claude.com/docs/en/advisor)（Anthropic，Claude Code 文档）

### 3. 让 agent 去「交付安全功能」，而不是只去找 bug：从 CI 里每个 GitHub Action 锁死到具体版本开始

- **要点**：同样来自 Isaac Evans 在 CS146S 第 7 周的分享（Mihail Eric 整理）。他的判断是：前沿模型已经能自己找漏洞、写出能用的攻击代码，挡住攻击的「人才稀缺」门槛没了；而公开漏洞里只有不到 2% 真被利用过，所以逐个追 bug 补不过来，真正的杠杆在预防上，四条：① agent 至少跑在容器里（microVM 最好），凭据和 agent 能碰到的东西分开；② 用 hook 强制，不靠说明书叮嘱，比如依赖冷却期、扫描密钥的 hook；③ 让 agent 针对一个业务风险直接把防护做出来，例如把 CI 里每个 GitHub Action 锁到确切版本、删死代码，他的比喻是一次事故动辄六位数美元，让 agent 修只要几分钱；④ 漏洞集中在新写的代码里，老代码会像混凝土一样越来越硬，现在新代码大多是 agent 写的，防护就该放在 agent 写代码的地方。
- **能直接照做**：第 ③ 条最好上手，下面这个 prompt 让 agent 把 workflow 里引用的 Action 锁到 commit SHA。
```
目标：把这个仓库 CI 里引用的所有第三方 GitHub Action 锁定到完整的 commit SHA，防止上游打 tag 后被篡改导致供应链攻击。先出方案，等我确认再改文件。

1. 找出 .github/workflows/ 和 .github/actions/ 下所有 uses: 引用（包括可复用 workflow 和组合 action 里的）。列成表：文件 / 行号 / 当前引用（如 actions/checkout@v4）/ 是否已是 40 位 SHA。仓库没有 GitHub Actions 的话就停下来告诉我。
2. 对每个还没锁定的引用，用只读方式查出当前 tag 实际指向的 commit SHA（例如 git ls-remote https://github.com/<owner>/<repo> refs/tags/<tag>，注意 annotated tag 要取解引用后的 ^{} 那一行）。贴出每条命令的输出作为证据，查不到的不要猜，标成「未解析」。
3. 改写为 uses: owner/repo@<完整SHA> # <原tag>，保留注释方便以后升级。本地 action（uses: ./...）和同组织内的 action 单独列出，问我要不要一起锁。
4. 检查仓库是否已有 Dependabot 或 Renovate 配置；如果没有，给出一个让它自动更新 SHA 锁定版本的最小配置草稿，但不要提交。
5. 验证：如果仓库能用 actionlint 或类似工具，就跑一次并贴出结果；最后贴出 git diff，不要 push、不要开 PR。

参考：Isaac Evans（Semgrep）在 Stanford CS146S 的分享，Mihail Eric 转述 https://x.com/mihail_eric/status/2121314052320444471
```
- **原文**：[Mihail Eric：Isaac Evans 在 The Modern Software Developer 课上谈「Black October」后的 AI 代码安全](https://x.com/mihail_eric/status/2121314052320444471)（Mihail Eric 转述 Isaac Evans，Semgrep CEO）

## 本期去重用源链接（机器可读）

- https://cooldowns.dev/
- https://nesbitt.io/2026/03/04/package-managers-need-to-cool-down.html
- https://deniz.in/delaying-fresh-installs-7-day-package-gates-for-npm-pnpm-yarn-bun-and-uv
- https://pnpm.io/blog/releases/10.16
- https://x.com/mihail_eric/status/2121314052320444471
- https://arxiv.org/abs/2611.13709
- https://andreasrau.tech/writing/agentic-coding-paper-2026-11-13/
- https://code.claude.com/docs/en/advisor
