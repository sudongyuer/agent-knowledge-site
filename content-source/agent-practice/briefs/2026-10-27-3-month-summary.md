# Agent 工程实践 · 近三月总结（2026-07-27 → 2026-10-27）

> 给冻鱼 / **lobehub-mobile**（React Native · Expo）。只收录已打开核验的一手材料；窗口外旧文不作为论据。交付 Page 见同日 Canvas。

## 如果只做 5 件事（优先级）

1. 给 agent 可跑的验收闭环（`typecheck` / `lint` / `test` / Expo 启动证据），写进短 `CLAUDE.md`
2. `PostToolUse` hook 在 Edit/Write 后自动 format+lint；PR 前 fresh-context 审 diff
3. 把重复流程收成标准 `SKILL.md`，并删掉模型已会的散文指令
4. 对真实失败做 error analysis（约 100 traces），按失败模式建 pass/fail judge，勿用默认 0.5
5. 大改用 `claude --worktree` / `isolation: worktree`；需要规模时用 ultracode workflow，并要求对抗复核

## 1. Evals

### 演变
九月 Hamel/Shreya 把 error analysis 与样本量写进 FAQ 定稿：先标注再写 metric，约 100 traces、先自标 ≥30。同月强调 LLM judge 必须对齐人标（约 50 pass + 50 fail）、一失败模式一 judge。十月 Hamel 实测 decision model：默认阈值 0.50 常浪费性能，并公开呼吁「对 eval 做 eval」（BenchmarkGate）。

### 关键实践

**1.1 先做失败分类，再写 eval**  
要点：Open coding → axial coding → 饱和后再定 metric。  
来源：[Error analysis FAQ](https://hamel.dev/blog/posts/evals-faq/why-is-error-analysis-so-important-in-llm-evals-and-how-is-it-performed.html) — Hamel Husain, Shreya Shankar（2026-09-01 更新）

```
你在 lobehub-mobile（Expo/RN）仓库。任务：为「agent 改代码后的真实失败」做 error analysis，不要先写 rubric。

步骤：
1. 收集约 100 条多样 traces（优先：CI 失败日志、崩溃/Sentry、PR 被打回评论、本地 typecheck/test 失败输出）。没有线上数据就用最近 30 天 git/CI 产物合成。
2. 你先对至少 30 条做 open coding：每条只记「第一个实质失败」+ 证据路径/命令输出摘录。
3. Axial coding：归并失败 taxonomy（例：导航状态丢失、Expo Router 类型错、原生模块未 mock、样式在 Android 崩、网络层未处理离线）。
4. 输出 `docs/evals/failure-taxonomy.md`：每类含定义、例证 ≥2、出现次数。
验收：taxonomy ≥5 类；每类有可复现命令或日志片段；你贴出至少 5 条原始标注摘录作为证据。禁止编造不存在的日志。
```

**1.2 一失败模式一 judge，先对齐人标**  
要点：≥50 pass/50 fail；先人工看分歧再调 prompt。  
来源：[LLM judge FAQ](https://hamel.dev/blog/posts/evals-faq/what-should-i-do-when-i-cant-get-my-llm-judge-to-agree-with-human-reviewers.html) — Hamel, Shreya（2026-09-19/21）

```
仓库：lobehub-mobile。选定单一失败模式：「Expo Router 深链进入后返回栈错误」。

1. 准备 ≥50 条 pass 与 ≥50 条 fail 的人标案例（可用精简 trace JSON：路由序列 + 期望栈）。留出 held-out 测试集勿用于调 prompt。
2. 写 `evals/judges/deep-link-backstack.md`：只要 binary pass/fail + 简短理由；禁止同时评 UI 美观。
3. 在训练集上跑 judge，列出与人标分歧的 10 例并手工解释原因后，才允许改 judge prompt。
4. 在 held-out 上报告 agreement。
验收：贴出 confusion 数字、3 条分歧原文、最终 judge 全文。agreement 未达你设的最低线则标 FAIL 并说明缺口（缺上下文/标签糊/模式过大）。
```

**1.3 决策模型：调阈值，别信默认 0.5**  
要点：先定 precision/recall 底线，再比成本；必要时校准概率。  
来源：[Decision model evals](https://hamel.dev/blog/posts/decision-model-evals/) — Hamel Husain, Antaripa Saha（2026-10-20）

```
在 lobehub-mobile 建最小实验：用已有 binary 标签的 CI/agent traces（≥80 条）测一个 decision/LLM-judge 分数。

1. 设定业务底线：precision≥0.8 且 recall≥0.8（告警场景）；达不到则报告不可用。
2. 用保存的分数做分层 5-fold 调阈值，对比默认 0.50。
3. 输出 `docs/evals/threshold-report.md`：最优阈值、P/R/F1、与 0.50 的差值。
验收：必须贴出调参用的命令/脚本输出；禁止只说「感觉 0.5 够用」。
```

**1.4 对公开 benchmark 保持怀疑**  
要点：BenchmarkGate——grader/harness 质量差时分数不可信。  
来源：[Hamel · BenchmarkGate](https://x.com/HamelHusain/status/2112937350070448508)（2026-10-21）

```
审查本仓库任何「agent 评分脚本」或第三方 coding bench 适配层：读 grader 与环境假设，找 3 个可作弊或误杀路径。
输出 `docs/evals/bench-risks.md`。验收：每条风险附文件:行号与复现思路；无则写「未发现自动化评分」。
```

## 2. Skill / Prompt 精简

### 演变
十月共识：模型越强，脚手架应越短。poteto 持续缩小 pstack；Geoffrey 主张删 skill pack、把系统测起来。同期 Anthropic 将 Agent Skills 捐赠 AAIF，SKILL.md 成跨工具标准——该精的是内容，不是格式。

### 关键实践

**2.1 审计并瘦身 skills**  
来源：[poteto](https://x.com/poteto/status/2114099131845423142)（2026-10-24）；[Geoffrey Huntley](https://ghuntley.com/agency/)（2026-10-13）

```
扫描 lobehub-mobile 的 `.claude/skills/**/SKILL.md` 与 `.agents/skills/**/SKILL.md`（若有）。

对每个 skill：
- description 是否短且可触发？
- 正文是否教模型「已会的通用 RN 知识」？能用 eslint/tsconfig/测试表达的规则列「应删除」。
输出 `docs/agent/skills-audit.md`：保留 / 合并 / 删除建议表。
然后只执行「删除」类中你有把握的 ≤3 个文件改动（或标出 PR 草稿）。
验收：贴出审计表 + `git diff --stat`；每个删除理由一句话。
```

**2.2 新能力写成标准 SKILL.md，不塞进 CLAUDE.md**  
来源：[Donating Agent Skills](https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation) — Anthropic；[bcherny](https://x.com/bcherny/status/2113333859907747871)（2026-10-22）

```
为 lobehub-mobile 新增 skill：`expo-verify`（目录 `.claude/skills/expo-verify/SKILL.md`）。
YAML：name + 短 description（何时触发）。
正文：如何跑 typecheck、lint、单测、以及 `npx expo start`/`expo export` 中你仓库真实存在的命令；要求贴 stdout。
若某命令不存在，先读 package.json 再写，禁止臆造脚本名。
验收：创建文件；再开一个只读子任务验证 description 可被匹配；贴 `cat` 全文。
```

**2.3 代码即环境：用类型/测试取代散文规则**  
来源：[Matt Pocock](https://x.com/mattpocockuk/status/2113278075978809631)（2026-10-22）

```
找出 CLAUDE.md / AGENTS.md 里 ≥5 条「禁止/必须」散文规则，能下沉为 TypeScript 类型、eslint rule 或测试的，优先改代码。
每条：原文 → 新约束位置 → 证明（`tsc`/`eslint`/`jest` 输出）。
验收：至少落地 2 条硬约束；剩余记入 backlog。禁止只改文档不改可执行检查。
```

## 3. Context engineering

### 演变
本季实践从「手管 token」转向「短常驻指令 + 按需加载 + 证据」。Thorsten：别手算 context，一线程一任务，compaction 够用。Claude Code 2.1.277 起无 CLAUDE.md 时可读 AGENTS.md，跨工具指令文件合流。

### 关键实践

**3.1 重写短 CLAUDE.md（指向子文档）**  
来源：[power user tips](https://support.claude.com/en/articles/14554000-claude-code-power-user-tips)；[code review 文中 CLAUDE.md 指引](https://claude.dev/blog/solving-code-review-at-anthropic/)（2026-10-15）

```
把 lobehub-mobile 根目录 CLAUDE.md（或新建）压到约 ≤2.5k tokens 量级的信息密度：
必含：包管理器与关键脚本（从 package.json 实读）、目录地图、RN/Expo 约定、禁止事项、验收命令。
长规范改放到 `docs/agent/*.md` 并用链接引用。
若同时维护 AGENTS.md：共享内容放 AGENTS.md，CLAUDE.md 仅 `@`/`See` 引用 + Claude 特有规则（2026-09-18 起无 CLAUDE.md 时会读 AGENTS.md）。
验收：贴最终 CLAUDE.md 全文 + `wc -c`；列出你删除的重复段。
```

**3.2 AGENTS.md 写「什么不算证据」**  
来源：[Thorsten Ball How I work with Agents](https://x.com/thorstenball/status/2114386050638336082)（2026-10-25）

```
在 AGENTS.md 增加章节「Evidence」：
- 不算证据：agent 自称完成、无输出的 “tests passed”
- 算证据：命令 stdout、失败栈、Expo 日志关键行、截图路径
并加一条：完成功能必须贴出验收命令全文输出。
验收：`git diff` 该文件；用一个小改动演示你遵守该规则（贴真实命令输出）。
```

**3.3 盲测文档是否真被用到**  
来源：同上 Thorsten（Eval agentic knowledge）

```
选一条你认为重要的 AGENTS.md/skill 规则。spawn 或顺序跑 4 次盲任务（同一小 bugfix）：
A/B 有该规则，C/D 临时移走。
比较：是否遵守、是否一次过验收命令。
输出 `docs/agent/doc-ablation.md`。验收：表格 + 结论（保留/改写/删除）。
```

## 4. Claude Code / Codex 工作流（CLAUDE.md · AGENTS.md · subagent · hooks · worktree）

### 演变
九月 Claude Code 原生读取 AGENTS.md（无 CLAUDE.md 时）。十月官方 power tips 与 code review 文把并行 worktree、hooks、subagent、验证升为默认生产力路径；subagent 支持 `isolation: worktree`。

### 关键实践

**4.1 配置 PostToolUse format/lint hook**  
来源：[power user tips · Hooks](https://support.claude.com/en/articles/14554000-claude-code-power-user-tips)

```
在 lobehub-mobile 的 `.claude/settings.json`（或项目 settings）添加 PostToolUse：matcher `Write|Edit`，command 跑仓库真实存在的 format+lint（先读 package.json）。
要求：失败不静默吞掉（按你们约定 `|| true` 仅用于非阻塞格式化时需注释说明）。
验收：改一个 tsx 触发 hook；贴 settings 片段与 hook 输出。
```

**4.2 并行 worktree 修两个无关 bug**  
来源：同上 power tips；[sub-agents isolation](https://code.claude.com/docs/en/sub-agents)

```
用 `claude --worktree`（或文档等价方式）开两个隔离 worktree，分别修两个互不依赖的小问题（你先列出 issue）。
每个 worktree：改代码 → 跑验收命令 → 准备独立 commit/PR 说明。
验收：贴两个 worktree 路径、`git status`、各自测试输出。禁止在同一工作区交错改文件。
```

**4.3 定义 verify-app subagent**  
来源：power tips · Subagents；[sub-agents docs](https://code.claude.com/docs/en/sub-agents)

```
创建 `.claude/agents/verify-app.md`：
frontmatter：name/description/tools（偏读+ bash）/model 适中。
正文：对 lobehub-mobile 执行固定验收清单（typecheck、lint、相关 jest、必要时 expo export --dry 或项目文档指定命令），只返回摘要+原始输出路径。
然后对「刚改的导航文件」调用该 subagent。
验收：贴 agent 文件全文 + subagent 回报中的命令输出摘录。
```

**4.4 跨工具指令：AGENTS.md 优先共享**  
来源：[Simon Willison 引 Thariq](https://simonwillison.net/2026/Sep/18/thariq-shihipar/)（2026-09-18）

```
检查 Claude Code 与 Codex 是否重复维护两份几乎相同的项目说明。
合并为 AGENTS.md（共享）+ 必要时极短 CLAUDE.md（仅 Claude 特有）。
验收：说明加载优先级；`git diff`；确认 Codex 路径 `.agents/` 或文档所述位置仍能读到 skills。
```

## 5. 多 Agent 编排

### 演变
十月 Claude Code dynamic workflows / Ultracode 把编排写进可重跑 JS，中间结果不进主 context；Simon 用其跑 12h+ 实验并提醒「无法人审时的价值对齐」。Thorsten 强调异步批处理与盲测编排知识。Automations 文给出定时 agent 的书签/账本模式。

### 关键实践

**5.1 小规模 ultracode 审计**  
来源：[workflows docs](https://code.claude.com/docs/en/workflows)；[Simon 2026-10-16](https://simonwillison.net/2026/Oct/16/)

```
对 lobehub-mobile 运行（或手写等价）一个小 workflow：审计 `src/**` 中缺失无障碍标签 / 危险的 `any`（二选一，先缩小到一个目录）。
要求：每文件 agent → 合并去重 → 至少一个 adversarial 复核 agent 淘汰误报。
先小切片（单目录）估用量。
验收：贴 findings 列表（文件:行）+ 被复核打落的误报例；说明是否保存为 `.claude/workflows/`。
```

**5.2 生成器与评审分离**  
来源：Claude Code team review（PR 前 subagent 审）；与 Thorsten「要证据」一致（2026-10）

```
实现一个小功能后：主 agent 不得自评「完成」。必须另起 fresh-context subagent（或 /code-review）只审 diff，对照验收命令输出。
验收：贴 reviewer 发现的问题（可无）+ 你据此修改的 diff；若 reviewer 零问题，仍须贴其完整检查清单输出。
```

**5.3 定时摘要用书签而非固定窗口**  
来源：[Building effective agent automations](https://claude.dev/blog/building-effective-agent-automations/) — Lance Martin, CJ Avilla（2026-10-08）

```
设计（可先写文档不部署）一个每日 PR/CI 摘要 agent 规格：`bookmarks.json` 每源进度、源失败不得报「无更新」、发送成功后才推进书签。
输出 `docs/agent/daily-brief-spec.md`。验收：规格含失败三规则与确认发送规则；附伪代码。
```

## 6. 自动验证闭环

### 演变
十月 Claude Code 团队公开其多层评审：PR 前验证 → AI 审 → 安全 → CI → 按风险定人数 → 回滚；事故变 eval。官方 tips 称验证是 #1。与 Geoffrey「verification / agency」同月共振。

### 关键实践

**6.1 落地「未贴输出即未完成」**  
来源：[How the Claude Code team does code review](https://claude.dev/blog/solving-code-review-at-anthropic/) — Osmani et al.（2026-10-15）；power tips Verification

```
任选 lobehub-mobile 一个真实小修复。完成标准：
1) 实现；2) 跑项目真实验收命令并贴全文 stdout；3) fresh subagent 审 diff；4) 若 hook/CI 本地可跑则跑。
禁止用自然语言代替输出。验收：四段证据齐全，否则任务失败。
```

**6.2 REVIEW.md 沉淀重复评论**  
来源：同上 code review 文

```
从最近 PR 评论收集重复 nit，写成短 `REVIEW.md`（失败长什么样、要文件:行证据、跳过路径、限制 nits）。
验收：文件存在；用 `/code-review` 或 subagent 对一个开放 diff 跑一次并贴是否遵循 REVIEW.md。
```

**6.3 事故/失败入回归集**  
来源：code review 文「incidents are the eval」

```
把最近 5 个生产/CI 事故或严重 PR revert 编成 `evals/regression/`：每个含复现步骤 + 期望红/绿命令。
验收：至少 3 个可在本地跑的检查；贴一次运行输出。
```

## 去重用源链接

- https://claude.dev/blog/solving-code-review-at-anthropic/
- https://hamel.dev/blog/posts/decision-model-evals/
- https://hamel.dev/blog/posts/evals-faq/why-is-error-analysis-so-important-in-llm-evals-and-how-is-it-performed.html
- https://hamel.dev/blog/posts/evals-faq/what-should-i-do-when-i-cant-get-my-llm-judge-to-agree-with-human-reviewers.html
- https://hamel.dev/blog/posts/evals-faq/how-many-examples-do-i-need-for-an-eval.html
- https://x.com/poteto/status/2114099131845423142
- https://ghuntley.com/agency/
- https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation
- https://x.com/bcherny/status/2113333859907747871
- https://x.com/thorstenball/status/2114386050638336082
- https://support.claude.com/en/articles/14554000-claude-code-power-user-tips
- https://code.claude.com/docs/en/sub-agents
- https://code.claude.com/docs/en/workflows
- https://simonwillison.net/2026/Oct/16/
- https://simonwillison.net/2026/Sep/18/thariq-shihipar/
- https://claude.dev/blog/building-effective-agent-automations/
- https://x.com/HamelHusain/status/2112937350070448508
- https://x.com/mattpocockuk/status/2113278075978809631
