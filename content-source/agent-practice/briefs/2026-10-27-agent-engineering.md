# Agent 工程实践简报 · 2026-10-27

> 给冻鱼（LobeHub mobile）的第一期。窗口约 **2026-10-13 → 2026-10-27**（Asia/Kuala_Lumpur）。只收录已打开核验的一手材料；不做泛 AI 新闻。

## 本期条目

### 1. 自动验证闭环：把「人是否读过 diff」换成「哪一层检查该接住什么」
- **要点**：Claude Code 团队把评审做成持续多层检查（PR 前验证 → AI 审 → 安全审 → CI → 按风险定人数 → merge queue/回滚）；事故与 revert 直接变成 reviewer 的每日 eval。
- **照做**：给 agent 可跑的检查（测试/构建/截图），要求出示输出而非口头「做完」；PR 前用 fresh-context subagent 或 `/code-review`；短 `CLAUDE.md` + 按目录的 `REVIEW.md`；把重复评论下沉成 lint/skill；设 review 轮次上限（他们内部约 3 轮后要求改方案）。
- **链接**：[How the Claude Code team does code review](https://claude.dev/blog/solving-code-review-at-anthropic/) — Addy Osmani, Morgan Westlee Lunt, Qing Wang（2026-10-15）

### 2. Evals：决策模型别用默认 0.5 阈值；先定 precision/recall 底线再比成本
- **要点**：Hamel 用 100 条租赁客服 trace 测多款 decision model：默认阈值 0.50 常浪费性能；应用方应先设最低 precision/recall，再调阈值，必要时做概率校准，并按失败模式拆 judge。
- **照做**：人标一批 pass/fail → 存模型分数 → 让 coding agent 做分层交叉验证调阈值（文内有可改 prompt）→ 用 Platt scaling 等检查校准是否真改善 → 一个 failure mode 一个 judge。
- **链接**：[How To Use Decision Models for Evals](https://hamel.dev/blog/posts/decision-model-evals/) — Hamel Husain, Antaripa Saha（2026-10-20）

### 3. Skill / 指令精简：模型越强，脚手架应越短；优先把系统测起来
- **要点**：poteto 称自己在持续简化 pstack——能力越强，指令越少，skills 最终可能缩成「保存的 prompt」。Geoffrey Huntley（10/13）同向：约束已不在模型，而在愿景、验证与 agency；建议删 skill pack，把整条系统置于测试之下。
- **照做**：本周扫一遍 `.claude/skills` / AGENTS.md：删掉模型已会的步骤；能用测试/类型/CI 表达的规则不要写散文；对每条 skill 做「有/无」盲测（见第 5 条）再决定去留。
- **链接**：
  - [poteto · 2026-10-24](https://x.com/poteto/status/2114099131845423142) — lauren (poteto)
  - [nobody should type code by hand anymore. here's what's left.](https://ghuntley.com/agency/) — Geoffrey Huntley（2026-10-13）

### 4. Agent Skills 捐赠 AAIF：SKILL.md 成跨 Claude Code / Codex / Cursor 等的可移植约定
- **要点**：Anthropic（Boris Cherny 同步）将 Agent Skills（`SKILL.md` + 脚本/资料文件夹）捐赠给 Linux Foundation 下的 Agentic AI Foundation；自 2025-12 以来 70+ 平台接入，约 100 万 skills 发布。与 MCP 并列的开放标准。
- **照做**：新能力优先写成标准 skill 目录（description 短、正文按需加载），放进 `.claude/skills/`（及 Codex 侧 `.agents/skills`），而不是塞进无限膨胀的 CLAUDE.md；关注 agentskills.io 规范与安全指引路线图。
- **链接**：[Donating Agent Skills to the Agentic AI Foundation](https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation) — Anthropic / Boris Cherny 相关声明（2026-10-22）；[bcherny 帖](https://x.com/bcherny/status/2113333859907747871)

### 5. Context / 证据优先工作流：写 What 不写 How；AGENTS.md 要盲测；高爆炸半径才人审
- **要点**：Thorsten Ball（Amp）总结 2026-10 实践：暴露全 SDLC、让 agent 自建迭代工具、要不可辩驳证据、异步批任务、compaction 别手管 context；用盲测对照评估 AGENTS.md/skills 是否真被用到。
- **照做**：在 AGENTS.md 写「这不算证据」清单；任务结束要求测试输出/前后数字/端到端演示；spawn 5 个盲 agent（有/无某文档）做对照；人只审中心路径与 migration。
- **链接**：[How I work with Agents（X Article）](https://x.com/thorstenball/status/2114386050638336082) — Thorsten Ball（2026-10-25）；镜像摘要：[Intelligent Artifact](https://intelligentartifact.com/posts/how-i-work-with-agents-thorsten-ball/)

### 6. Claude Code 工作流：并行 worktree + hooks + 验证优先
- **要点**：官方 power-user 指南强调验证是 #1；`claude --worktree` / subagent `isolation: worktree` 并行互不踩；`PostToolUse` 等 hooks 做确定性格式化/检查；团队共享短 CLAUDE.md，错一次就写回。
- **照做**：本地开 3–5 个 worktree 会话；迁移类任务用 `isolation: worktree` 或 `/batch`；`settings.json` 加 `PostToolUse` → `Write|Edit` 跑 format/lint；`Stop` hook 做长任务确定性验收。
- **链接**：[Claude Code power user tips](https://support.claude.com/en/articles/14554000-claude-code-power-user-tips) — Claude Code 团队；subagent/worktree 细节：[Create custom subagents](https://code.claude.com/docs/en/sub-agents)

### 7. 多 agent 编排：Ultracode / dynamic workflows 把编排写进可重跑脚本
- **要点**：Claude Code dynamic workflows 用 JS 脚本编排几十到上百 subagent，中间结果进脚本变量而非主 context；可对抗复核、可保存为 `/` 命令。Simon Willison（10/16）用 Ultracode 跑 12h+ 生成 Rust SPARQL-in-SQLite，并提醒：规模大到无法人审时代价与价值要对齐。
- **照做**：对「全仓审计 / 大迁移 / 交叉核对研究」在 prompt 写 `ultracode:` 或 `/effort ultracode`；要求脚本里加 adversarial verify；跑通后 `/workflows` → `s` 存到 `.claude/workflows/`；小切片先估用量再放大。
- **链接**：
  - [Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows) — Claude Code Docs
  - [Simon Willison · 2026-10-16](https://simonwillison.net/2026/Oct/16/) — Simon Willison（含 Ultracode 实验与对 Claude Code 团队 code review 文的引用）

---

## 本期去重用源链接（机器可读）

- https://claude.dev/blog/solving-code-review-at-anthropic/
- https://hamel.dev/blog/posts/decision-model-evals/
- https://x.com/poteto/status/2114099131845423142
- https://ghuntley.com/agency/
- https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation
- https://x.com/bcherny/status/2113333859907747871
- https://x.com/thorstenball/status/2114386050638336082
- https://support.claude.com/en/articles/14554000-claude-code-power-user-tips
- https://code.claude.com/docs/en/sub-agents
- https://code.claude.com/docs/en/workflows
- https://simonwillison.net/2026/Oct/16/
- https://hamel.dev/blog/posts/evals-faq/why-is-error-analysis-so-important-in-llm-evals-and-how-is-it-performed.html
- https://hamel.dev/blog/posts/evals-faq/what-should-i-do-when-i-cant-get-my-llm-judge-to-agree-with-human-reviewers.html
- https://hamel.dev/blog/posts/evals-faq/how-many-examples-do-i-need-for-an-eval.html
- https://simonwillison.net/2026/Sep/18/thariq-shihipar/
- https://claude.dev/blog/building-effective-agent-automations/
- https://x.com/HamelHusain/status/2112937350070448508
- https://x.com/mattpocockuk/status/2113278075978809631
# also: briefs/2026-10-27-3-month-summary.md
