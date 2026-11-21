# Agent 工程实践 · 关注名单

维护给冻鱼的简报源。每期先查这些人/站点近 1–2 周是否有可照做的工程材料，再写条目。

## 人（X / 博客）

| 名字 | 句柄 / 站点 | 关注主题 |
| --- | --- | --- |
| Hamel Husain | [@HamelHusain](https://x.com/HamelHusain) · [hamel.dev](https://hamel.dev) | evals、error analysis、LLM/decision judge、prompt 迭代 |
| Simon Willison | [@simonw](https://x.com/simonw) · [simonwillison.net](https://simonwillison.net) | Claude Code / Codex 实验、skills、agent 工作流 |
| Boris Cherny | [@bcherny](https://x.com/bcherny) | Claude Code、Agent Skills、验证闭环 |
| Andrej Karpathy | [@karpathy](https://x.com/karpathy) | agent/LLM 工程直觉（有实质帖再收） |
| lauren (poteto) | [@poteto](https://x.com/poteto) | pstack、skill 精简、验证/ harness |
| Matt Pocock | （X 账号当前 suspended；改跟其公开站点/课程与 skills 仓库） | TypeScript / agent skills 教学 |
| Thorsten Ball | [@thorstenball](https://x.com/thorstenball) · [ampcode.com](https://ampcode.com) | harness、orbs、证据优先、多 agent |
| Geoffrey Huntley | [@GeoffreyHuntley](https://x.com/GeoffreyHuntley) · [ghuntley.com](https://ghuntley.com) | loop engineering、verification、删脚手架 |

## 机构 / 文档

| 源 | URL | 关注主题 |
| --- | --- | --- |
| Anthropic Engineering | https://www.anthropic.com/engineering | agent evals、context engineering、harness、managed agents |
| Anthropic News | https://www.anthropic.com/news | Skills / MCP / 产品工程公告 |
| Claude Code Docs | https://code.claude.com/docs | CLAUDE.md、subagent、hooks、worktree、workflows |
| Claude Help · power tips | https://support.claude.com/en/articles/14554000-claude-code-power-user-tips | 团队日常工作流 |
| Agent Skills 规范 | https://agentskills.io | SKILL.md 开放标准（已捐赠 AAIF） |
| AAIF | https://aaif.io | Agent Skills / MCP 治理 |

## GitHub 热门形态（按需扫 stars/近期 commit）

- 仓库内 `CLAUDE.md` / `AGENTS.md` 范例（团队共享、短、可指到子文档）
- `.claude/skills/**/SKILL.md`、`.claude/agents/*.md`、`.claude/workflows/*.js`
- `.agents/skills/**/SKILL.md`（Codex 侧）
- 精选列表如 VoltAgent/awesome-agent-skills（作发现用，条目仍须核验原文）



## CS146S Fall 2026（自学跟课）

课程与作业源（先扫更新再写简报）：

| 源 | URL | 关注主题 |
| --- | --- | --- |
| 课程官网 The Modern Software Developer | https://www.themodernsoftware.dev/ | 逐周主题、嘉宾、课件/阅读列表 |
| 作业仓库 | https://github.com/mihail911/modern-software-dev-assignments | weekN assignment；截止与评分口径 |
| 中文跟课笔记（次级） | https://www.heyuan110.com/posts/ai/2026-09-11-cs146s-fall-2026-follow-along/ | 对照用；主题以官网 JS/课件为准 |
| 讲师 Mihail Eric | https://www.mihaileric.com/ · [@mihail_eric](https://x.com/mihail_eric) | 200 行 agent、课程讲义 |

嘉宾（官网 Fall 2026 日程；个人站点已核验 HTTP 200）：

| 嘉宾 | 周次 / 角色 | 站点 |
| --- | --- | --- |
| Lee Robinson | W3 · Model Behavior @ SpaceX | https://leerob.com |
| Boris Cherny | W4 · Creator of Claude Code @ Anthropic | https://borischerny.com · [@bcherny](https://x.com/bcherny) |
| Eno Reyes | W5 · CTO @ Factory | https://www.linkedin.com/in/enoreyes · Factory docs |
| Silas Alberti | W6 · SVP Research @ Cognition | https://sil.as |
| Isaac Evans | W7 · CEO @ Semgrep | https://www.linkedin.com/in/isaacevans · semgrep.dev/blog |
| Rajesh Bhatia | W8 · Senior Director @ Cloudflare | https://www.linkedin.com/in/rajeshbh · Cloudflare Agents / AI Gateway docs |
| Elad Gil | W9 · Investor @ Gil Capital | https://eladgil.com |
| Amjad Masad | W9 · CEO @ Replit | https://amasad.me · blog.replit.com |

补充文档源（课内常引）：

- MCP 规范：https://modelcontextprotocol.io/
- Agent Skills：https://agentskills.io
- AGENTS.md：https://agents.md/
- Factory Agent Readiness：https://factory.ai/news/agent-readiness
- Claude Code docs：https://code.claude.com/docs

## 简报归档

- 目录：`briefs/`
- 命名：`YYYY-MM-DD-agent-engineering.md`
- 每期文末保留「去重用源链接」列表，下期收录前比对。
- `briefs/2026-10-27-3-month-summary.md` — 近三月主题总结（Page 交付）

- Jesse Vincent (obra) — https://github.com/obra/superpowers ，skills 方法论框架（brainstorming→writing-plans→subagent-driven-development、TDD、verification-before-completion、git worktrees）。2026-11-17 用户问起，此前简报未介绍过。

## 2026-11-17 补课审计新增（见 briefs/2026-11-17-catch-up.md）

| 项目 | 链接 | 作者 | 关注点 |
| --- | --- | --- | --- |
| Claude 官方插件市场 | https://github.com/anthropics/claude-plugins-official | Anthropic | 新增插件；feature-dev、frontend-design、skill-creator、pr-review-toolkit、claude-md-management |
| OpenAI 插件市场 | https://github.com/openai/plugins | OpenAI | Codex 侧新增插件 |
| Expo Skills | https://github.com/expo/skills | Expo 团队 | RN/Expo 专用 skill（冻鱼主栈） |
| gstack | https://github.com/garrytan/gstack | Garry Tan | 角色化 software factory、/qa 真浏览器 |
| Compound Engineering | https://github.com/EveryInc/compound-engineering-plugin | Kieran Klaassen、Trevin Chow（Every） | 沉淀循环 /ce-compound |
| DESIGN.md | https://github.com/google-labs-code/design.md | Google Labs | 设计 token 规范 + lint |
| awesome-design-md | https://github.com/VoltAgent/awesome-design-md | VoltAgent | 品牌 DESIGN.md 范例 |
| mobile-mcp | https://github.com/mobile-next/mobile-mcp | Mobile Next | agent 操作 iOS/Android 模拟器 |
| agent-skills | https://github.com/addyosmani/agent-skills | Addy Osmani | 全生命周期工程 skill |
| Spec Kit | https://github.com/github/spec-kit | GitHub | SDD 工具 |
| OpenSpec | https://github.com/Fission-AI/OpenSpec | Fission AI | 轻量 SDD |
| awesome-claude-code | https://github.com/hesreallyhim/awesome-claude-code | hesreallyhim | 发现源（条目须核验原文） |

扫描规则（防再漏）：每期除人名单外，按 stars 扫 GitHub（claude-code / agent skills / claude plugin / spec-driven / AGENTS.md / DESIGN.md 等关键词、近 3 个月有提交）和两个官方插件市场的新增条目，对照 briefs/ 去重。

## 2026-11-18 发现扫描新增

| 项目 | 链接 | 作者 | 关注点 |
| --- | --- | --- | --- |
| backpass | https://github.com/kunchenguid/backpass | Kun Chen（[@kunchenguid](https://x.com/kunchenguid)） | 用会话记录给 AGENTS.md/CLAUDE.md 做「梯度下降」 |
| SkillOpt | https://github.com/microsoft/SkillOpt | Microsoft Research | skill 当参数训练、验证集把关 |
| external-sandbox | https://github.com/prime-radiant-inc/external-sandbox | Simon Willison / Prime Radiant | 外部沙箱协议 + 三种实现 |
| FrontierHarness Eval | https://runta.com/blog/ | Runta | harness × 模型 评测榜 |
| 待评估 | mksglu/context-mode、JuliusBrussee/caveman、Graphify-Labs/graphify、t3dotgg/tstack | — | 高星但未介绍。anthropics/skills 的设计相关部分已在 briefs/2026-11-18-design-special.md 介绍 |

- Prime Radiant（https://primeradiant.com ，Jesse Vincent 团队，Superpowers 出品方）博客 https://blog.primeradiant.com/ 加入定期扫描。

## 2026-11-18 Design 专题新增（见 briefs/2026-11-18-design-special.md）

| 项目 | 链接 | 作者 | 关注点 |
| --- | --- | --- | --- |
| frontend-design 官方文章 / Cookbook | https://claude.com/resources/articles/improving-frontend-design-through-skills · https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics | Prithvi Rajasekaran、Justin Wei、Alexander Bricken（Anthropic Applied AI） | 反 AI slop 提示、先规划再写代码、默认长相清单、截图自查 |
| anthropics/skills（设计相关） | https://github.com/anthropics/skills | Anthropic | frontend-design 副本、webapp-testing、brand-guidelines、canvas-design、theme-factory |
| Taste Skill | https://github.com/Leonxlnx/taste-skill | Leonxlnx（[@lexnlin](https://x.com/lexnlin)） | 艺术指导 + 参考图 + 无头 Chrome 检查 / finish gate |
| Matt Pocock skills（prototype） | https://github.com/mattpocock/skills | Matt Pocock | 3 个结构不同的可切换 UI 原型 |
| ui-ux-pro-max-skill | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | nextlevelbuilder | 社区高星综合 UI skill（使用前需自测） |
| apple-design-skill | https://github.com/dickwu/apple-design-skill | dickwu | 按 Apple HIG 做跨平台 UI 审查 |
| Jenny Wen / 原型筛选 | https://simonwillison.net/2026/jan/24/dont-trust-the-process/ | Jenny Wen（Anthropic Design Lead）；Simon Willison 转述 | 做东西变便宜后，关键是选择和筛选 |

扫描补充：收集 design skill 时同时扫 frontend-design / DESIGN.md / anti-slop / taste skill / UI UX skill 等关键词，对照 briefs/ 去重。

## 2026-11-19 发现扫描新增

| 项目 | 链接 | 作者 | 关注点 |
| --- | --- | --- | --- |
| toolsmith | https://github.com/prime-radiant-inc/toolsmith | Jesse Vincent（Prime Radiant） | 工具匠子 agent，沉淀可复用工具目录 |
| /correct（pstack） | https://github.com/cursor/plugins/blob/main/pstack/skills/correct/SKILL.md | poteto | 纠正 → 确定性检查 |
| planning-with-files | https://github.com/OthmanAdi/planning-with-files | OthmanAdi | 文件化计划 + hook，扛 /clear |
| 待评估 | wshobson/agents、shareAI-lab/learn-claude-code、rohitg00/agentmemory、mvanhorn/last30days-skill、Nutlope/hallmark、alibaba/open-code-review | — | 高星但未介绍 |

- Fiona Chen（https://fion.ac ）AI 编程生产率实证研究，论文更新时复查。

## 2026-11-20 发现扫描新增

| 项目 | 链接 | 作者 | 关注点 |
| --- | --- | --- | --- |
| claude-security | https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-security | Anthropic | 威胁建模 + 每个发现独立验证；无隔离，陌生仓库配 sandbox-runtime |
| agent_skills（socratic-tutor） | https://github.com/janestreet/agent_skills | Jane Street | 苏格拉底式家教 skill；skill 写法范本 |
| Bitdefender Labs | https://www.bitdefender.com/en-us/blog/labs/ | Andrei Anton-Aanei 等 | 针对 agent 指令文件 / hooks 的供应链攻击 |
| 待评估 | Mastra Factory（https://github.com/mastra-ai/template-factory ）、StarSling（https://starsling.dev ）、官方插件 session-report / receipts / project-artifact / code-simplifier / hookify | — | 未深入介绍 |

- 官方插件市场快照：2026-11-20 claude-plugins-official 共 317 个插件，下期对比新增。
