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

## 2026-11-21 发现扫描新增

| 项目 | 链接 | 作者 | 关注点 |
| --- | --- | --- | --- |
| plugin-eval | https://github.com/openai/plugins/tree/main/plugins/plugin-eval | OpenAI | skill/插件体检：三档 token 预算（trigger / invoke / deferred）、codex exec 基准、改前改后 compare |
| learn-claude-code | https://github.com/shareAI-lab/learn-claude-code | shareAI-lab | 17 节递进 harness 课（s01 循环 → s17 目标循环）；已从「待评估」转为已介绍 |
| Chaos loop（claude.dev） | https://claude.dev/blog/chaos-loop-claude-docs-launch/ | Vivek Nair（Anthropic） | 预发环境长时间压测循环、不变量、难撤销改动的审批门、对 agent 可读的监控 |
| eslint-seatbelt / Notion 棘轮 | https://github.com/justjake/eslint-seatbelt · https://www.notion.com/blog/how-we-evolved-our-code-notions-ratcheting-system-using-custom-eslint-rules | Jake Teton-Landis、Ankit Sardesai（Notion） | lint 违规基线只降不升 |
| pstack /no-comments | https://github.com/cursor/plugins/blob/main/pstack/skills/no-comments/SKILL.md | poteto | 子 agent 审注释，约束型注释改成类型、测试或 lint |
| Ankit Gupta 博客 | https://ankitg.me/ | Ankit Gupta | 长时间 autoresearch 循环、验证阶梯、agent 自我复盘 |
| 待评估 | affaan-m/ECC、rtk-ai/rtk（CLI 输出压缩代理）、headroomlabs-ai/headroom（压缩工具输出）、harbor-framework/harbor（agent 评测框架）、erkamyaman/rust-anything、jmanico/grim-prompter（威胁建模 skill）、Leonxlnx/cook、kyy-logs/code-review-gate-skill、openai/plugins 的 codex-security / test-android-apps、Hamel《"It's Hard to Eval" Is a Product Smell》https://hamel.dev/blog/posts/eval-smell/ 与《Claude's new auto eval tool》https://hamel.dev/blog/posts/claude-auto-evals/ | — | 高星或高相关，但还没介绍 |

- Matt Pocock 的 X 账号 [@mattpocockuk](https://x.com/mattpocockuk) 2026-11-20 正常发帖（「Prompt of the day」系列），上面人名单里写的「suspended」已过时，以后照常扫。
- Thariq（[@trq212](https://x.com/trq212)，Anthropic）、cat（[@_catwu](https://x.com/_catwu)）加入 X 扫描名单。
- 官方插件市场快照：2026-11-21 claude-plugins-official 仍为 317 个插件，与 11-20 相比没有增删（plugins-snapshot-2026-11-21.txt）；openai/plugins 共 65 个。

## 2026-11-22 发现扫描新增

| 项目 | 链接 | 作者 | 关注点 |
| --- | --- | --- | --- |
| Ponytail | https://github.com/DietrichGebert/ponytail | Dietrich Gebert | 「最懒资深工程师」skill：写代码前的七级阶梯、shortcut 注释记技术债；规则迭代靠成对对比 + 盲评裁判（约 19.6 万星，已介绍） |
| Hamel《"It's Hard to Eval" Is a Product Smell》 | https://hamel.dev/blog/posts/eval-smell/ | Hamel Husain | 为可核对而设计：出处、假设、未验证清单（已从补课候选转为已介绍） |
| 软件工厂全景图 | https://x.com/mihail_eric/status/2123866740019077553 | Mihail Eric | 触发 → 分诊 → 规格 → 实现 → 审查 → 验证 → 发布 → 监控；指标：每 PR 成本、周期、人工介入次数 |
| Mani Doraisamy 博客 | https://manidoraisamy.com/ | Mani Doraisamy | 开发者转架构师：先定架构和数据模型，再约束 AI |
| Eugene Yan | https://eugeneyan.com/writing/ | Eugene Yan | LLM 裁判、成对比较 vs 直接打分、评测方法综述 |
| 待评估 | shanraisshan/claude-code-best-practice（约 6.9 万星）、muratcankoylan/Agent-Skills-for-Context-Engineering（约 1.8 万星）、ai-boost/awesome-harness-engineering、FailproofAI/failproofai、colbymchenry/codegraph、stablyai/orca、MiniMax-AI/mcode-stack、phuryn/mini-harness、Matt Pocock /vector skill（发布后看）、Hamel《Claude's new auto eval tool》https://hamel.dev/blog/posts/claude-auto-evals/ | — | 高星或高相关，但还没介绍 |

- 官方插件市场快照：2026-11-22 claude-plugins-official 仍为 317 个插件，与 11-21 相比没有增删（plugins-snapshot-2026-11-22.txt）；openai/plugins 自 11-19 03:14（Asia/Kuala_Lumpur）起无新提交。

## 2026-11-23 发现扫描新增

| 项目 | 链接 | 作者 | 关注点 |
| --- | --- | --- | --- |
| 「给代码库除草」prompt | https://x.com/RayFernando1337/status/2124222002076733869 | Ray Fernando（[@RayFernando1337](https://x.com/RayFernando1337)）；poteto 转发 | 翻 git 历史、bug 修复和 review 评论，找重复犯的错，改成结构化检查（4052 收藏，已介绍） |
| pstack principle-encode-lessons-in-structure / poteto-mode | https://github.com/cursor/plugins/tree/main/pstack/skills | poteto | 第二次写同一条指令就改成 lint、检查或脚本；poteto-mode 是 pstack 总入口 |
| Hamel《Claude's new auto eval tool》 | https://hamel.dev/blog/posts/claude-auto-evals/ | Hamel Husain | 自动 eval 插件评测：先看数据、一个评估器只管一种错误、要做标注网页（已从补课候选转为已介绍） |
| Learn Harness Engineering | https://github.com/walkinglabs/learn-harness-engineering | walkinglabs | 14 讲 + 8 个项目的 harness 课程，有简体中文版；最小 harness 四件套（约 2.6 万星，已介绍） |
| Dragos 研究博客 | https://www.dragos.com/blog/ai-supply-chain-security-canary-tokens | HD Moore（Dragos） | 诱饵凭证追踪 prompt 泄露；AI 路由和转售商风险 |
| 待评估 | thedotmack/claude-mem（约 11.9 万星）、farion1231/cc-switch（约 15.6 万星）、Egonex-AI/Understand-Anything、tt-a1i/archify、deusyu/harness-engineering（中文 harness 学习档案）、sybil-solutions/skill-distill、EL4CTEO/fast-anything、Skillmeister（@shantanugoel，路由 skill）、Matt Pocock /the-perfect-typescript-codebase skill（发布后看）；此前的 shanraisshan/claude-code-best-practice、muratcankoylan/Agent-Skills-for-Context-Engineering 仍待评估 | — | 高星或高相关，但还没介绍 |

- 官方插件市场快照：2026-11-23 claude-plugins-official 仍为 317 个插件，与 11-22 相比没有增删（plugins-snapshot-2026-11-23.txt）；最新提交是 11-21 09:17（Asia/Kuala_Lumpur）的主题示例更新。openai/plugins 的 plugins/ 目录仍为 62 项，自 11-19 03:14（Asia/Kuala_Lumpur）起无新提交。

## 2026-11-24 发现扫描新增

| 项目 | 链接 | 作者 | 关注点 |
| --- | --- | --- | --- |
| Claude Ship（Code Review / PR Steward / Claude Approvals / `/ship`） | https://claude.com/resources/articles/introducing-claude-ship | Anthropic；Boris Cherny 发布 | 审 PR → 修 PR → 按仓库里的策略文件批准；Approvals 先开观察模式（已介绍） |
| pstack /reframe、/sharpen | https://github.com/cursor/plugins/tree/main/pstack/skills/reframe · https://github.com/cursor/plugins/tree/main/pstack/skills/sharpen | poteto | 教行家术语再重写需求；把任务做深而不是做大（已介绍） |
| CS146S Week 6「Agent Cost-Optimization」 | https://github.com/mihail911/modern-software-dev-assignments/blob/main/week6/assignment.md | Mihail Eric | 价目表 + 无头运行 + 成本杠杆清单；用没见过的事故评分（已介绍） |
| 《When Instruction Files Go Stale》 | https://arxiv.org/abs/2611.09802 | Tural Mehtiyev、Biruk Tadesse、Lawrence Arkoh、Wesley Assunção | 文档债：过期指令不影响成功率但多花工具调用，agent 不会修说明书（已介绍） |
| Full Stack Data Lab 博客 | https://fsdatalab.github.io/blog/ | Shreya Shankar 实验室 | 逐条打分 vs 成对比较、交换顺序一致性（已介绍 ai-score 一篇） |
| Worktrunk | https://github.com/max-sixty/worktrunk · https://worktrunk.dev | Maximilian Roos（[@max_sixty](https://x.com/max_sixty)） | 并行 agent 用的 worktree CLI、共享构建缓存、每个 worktree 独立端口（约 1.27 万星，已介绍） |
| 待评估 | NanmiCoder/cc-haha（约 1.55 万星）、generalaction/emdash（约 6300 星）、supabitapp/supacode、johannesjo/parallel-code、savannahfeder/agentbox、paperclipai/paperclip（约 11.6 万星）、NousResearch/hermes-agent、rkkautsar/trace2rules、rjcuff/Woolly、frc9427liu-tech/memrot、Akshay「how to write Agent SKILLS that actually work」（https://x.com/akshay_pachaar/status/2124118137671155887 ，需拿到全文）、Matt Pocock「I've been cooking」（等公开） | — | 高星或高相关，但还没介绍 |

- Shreya Shankar（[@sh_reya](https://x.com/sh_reya)）、Akshay（[@akshay_pachaar](https://x.com/akshay_pachaar)）加入 X 扫描名单。
- 官方插件市场快照：2026-11-24 claude-plugins-official 仍为 317 个插件，与 11-23 相比没有增删（plugins-snapshot-2026-11-24.txt）；11-23 有 security-guidance 修复、vercel/wix bump、Plugin workflows hardening (#7206) 等提交。openai/plugins 的 plugins/ 目录仍为 62 项，自 11-19 03:14（Asia/Kuala_Lumpur）起无新提交。

## 大厂工程博客（2026-11-25 加入，冻鱼推荐；只收和 agent 工程实践相关的文章）
- Uber Engineering：https://www.uber.com/blog/engineering/ ，X @UberEng
- Shopify Engineering：https://shopify.engineering/ ，X @ShopifyEng
- Airbnb Engineering：https://medium.com/airbnb-engineering ，X @AirbnbEng
- Meta Engineering：https://engineering.fb.com/ ，X @Meta_Engineers
- Netflix TechBlog：https://netflixtechblog.com/ ，X @NetflixEng
（来源：meng shao @shao__meng 2026-11-24 的帖子及评论）

## 2026-11-25 新增
| 名称 | 链接 | 作者 | 备注 |
| --- | --- | --- | --- |
| Siren（沙箱逃逸倾向评测） | https://safeguards.anthropic.com/2026/siren/ | Oscar O'Rahilly、Darya Kaviani（Anthropic） | 在系统提示里写清沙箱规则 + 「缺东西就停下来说」，越界率降 68%–96%（已介绍） |
| Anthropic 企业 coding agent 安全指南 | https://claude.com/resources/articles/enterprise-guide-to-securing-coding-agents | Anthropic | 六个问题自查表、failIfUnavailable、least agency（已介绍） |
| Skills over MCP / Tasks / Elicitation | https://claude.com/resources/articles/skills-over-mcp-tasks-and-more | Anthropic | MCP 服务器自带 skill；claude.ai 连接器 + skill 合并为插件（已介绍） |
| 宝玉 | https://x.com/dotey | 宝玉（@dotey） | 中文一线实践者，验证五条经验（已介绍 2124603209394078089），加入 X 扫描名单 |
| Pekka Enberg | https://x.com/penberg | Pekka Enberg（@penberg） | 验证阶梯：测试 → 形式化 → 读规格（已介绍），加入 X 扫描名单 |
| 待评估 | imuratalpay/ui-diff（约 139 星，UI PR 前后截图 + 像素差异）、AyushRajSinghParihar/weaponized-curiosity（约 168 星）、jvasic/claude-queue、koorchik/swarmy、bluesky-social/diderot、sybil-solutions/inference-optimisation-skill（约 2569 星，推理调优）、morluto/rea（约 47.7 万星，agent 逆向工程，超出本简报主题）、Kent C. Dodds「PRs are going away」视频（https://x.com/kentcdodds/status/2125272609193673186 ，未看） | — | 高星或高相关，但还没介绍 |

- 官方插件市场快照：2026-11-25 claude-plugins-official 仍为 317 个插件，与 11-24 相比没有增删（plugins-snapshot-2026-11-25.txt）；11-24 有 Claude Security 插件 v0.13.0、bigquery-data-analytics 源迁移等提交。openai/plugins 的 plugins/ 目录仍为 62 项，自 11-19 03:14（Asia/Kuala_Lumpur）起无新提交。

## 2026-11-26 新增
| 名称 | 链接 | 作者 | 备注 |
| --- | --- | --- | --- |
| 《Migrating our Messages API to Rust》 | https://www.anthropic.com/research/migrating-api-to-rust | Lance Martin、Jake Eaton 等（Anthropic） | 生产系统当验证器；checkpoint + 指纹；内层 / 外层 / 记忆三层循环；100 多处被改弱的断言（已介绍） |
| NVIDIA SkillSpector | https://github.com/NVIDIA/SkillSpector | NVIDIA | 装 skill 前的静态扫描器，约 2.77 万星，17 类 71 种模式（补课，已介绍） |
| Claude Code `PreSkillShellCommand` hook | https://code.claude.com/docs/en/hooks | Anthropic | v2.1.332 起可拦截 skill 加载时的注入命令，只能拦不能放行（已介绍） |
| Artificial Analysis Coding Agent Index · Harness Comparisons | https://artificialanalysis.ai/methodology/coding-agents-benchmarking · https://x.com/ArtificialAnlys | Artificial Analysis（@ArtificialAnlys） | 固定模型只换 harness；花费差异大于分数差异（已介绍），加入 X 扫描名单 |
| shrink-anything | https://github.com/EL4CTEO/shrink-anything | EL4CTEO | 删死代码 + 跑你的测试 + 测试数不许变少（约 279 星，已介绍） |
| Jason Wei 博客 | https://www.jasonwei.net/blog/asymmetry-of-verification-and-verifiers-law | Jason Wei | 验证不对称 / verifier's rule（今日概念入门原文） |
| 待评估 | ertembiyik/xcslot（约 91 星，并行 worktree 复用 Xcode 构建缓存，和冻鱼的移动端开发相关）、Developing-Gamer/agent-sim（约 597 星，Linux 上的 iOS 模拟器 + MCP，早期）、usejog/joggernaut、orkhanfarmanli/orchestrate-skills、Larusajs/Handoff-Check、chszlab AgenticAlgorithmEngineering（HN 70 分）、jayd.ml Rockbox 移植 + auto-rockbox 工具包（https://jayd.ml/2026/11/14/rockbox-on-yp3.html ）、Forever Security「AGENTS.md 植入让 Codex 关掉审批」报告（未找到原文） | — | 高星或高相关，但还没介绍 |

- 官方插件市场快照：2026-11-26 claude-plugins-official 仍为 317 个插件，与 11-25 相比没有增删（plugins-snapshot-2026-11-26.txt）；11-25 只有 Claude Security 插件 v0.13.1 提交。openai/plugins 的 plugins/ 目录仍为 62 项，自 11-19 03:14（Asia/Kuala_Lumpur）起无新提交。

## 2026-11-27 新增
| 名称 | 链接 | 作者 | 备注 |
| --- | --- | --- | --- |
| Off the Laptop（CS146S W8 幻灯片） | https://off-the-laptop.rajesh.workers.dev/ | Rajesh Bhatia（Cloudflare） | 后台 agent 七条原则：等待免费 / 原路回复 / 醒来先看现实 / 密钥不进沙箱 / 安全在模型外 / 只为决策和失败打扰人 / 重复活写成代码（已介绍）；讲座录像「Recording soon」，出了再看 |
| 《Building always-on agents》 | https://claude.com/resources/articles/building-always-on-agents | William Hu（Anthropic） | 事件收件箱 / 定时器 / 记忆 / 权限 / 发件箱五部件（补课，已介绍） |
| NVIDIA SkillEvaluator | https://github.com/NVIDIA/SkillEvaluator | NVIDIA | skill 质量分 + harness-check + 装/不装对比的 Skill Lift，约 4583 星（补课，已介绍） |
| Notion 官方 MCP 注入推销指令（用户报告） | https://www.reddit.com/r/ClaudeCode/comments/1y4qm5o/heads_up_if_you_wire_notions_official_mcp_into/ | r/ClaudeCode 用户 | 工具返回内容当数据；可疑 MCP 只在 subagent 里调用（已介绍，未独立复现） |
| skill-distill | https://github.com/sybil-solutions/skill-distill | sybil-solutions | 会话蒸馏成 skill + 学生模型三次验证，约 920 星（从待评估转为已介绍） |
| T3 Code | https://github.com/pingdotgg/t3code | pingdotgg | 多 agent 控制面板，每任务一个 worktree，手机批准；默认 Full access，约 8.1 万星（补课，已介绍） |
| Mihail Eric | https://x.com/mihail_eric | Mihail Eric | CS146S 每周嘉宾讲座总结帖，继续每期扫 |
| 待评估 | Donchitos/Claude-Code-Game-Studios（约 4.1 万星，49 个角色 agent + 75 个 skill 的游戏工作室模板，偏游戏）、zucchini-chat/one-fact-one-place（「同一事实只在一处」的 pre-commit hook）、xtong629/trellis-agent（约 103 星，eval 优先的小 agent 框架）、Google Workspace MCP 强制令（https://techstackups.com/articles/google-workspace-ai-agents-mcp/ ，平台政策） | — | 高星或高相关，但还没介绍 |

- 官方插件市场快照：2026-11-27 claude-plugins-official 仍为 317 个插件，与 11-26 相比没有增删（plugins-snapshot-2026-11-27.txt）；11-26 以来无新提交（最后一次是 Claude Security v0.13.1，11-26 06:51 Asia/Kuala_Lumpur 合并）。openai/plugins 的 plugins/ 目录仍为 62 项，自 11-19 03:14（Asia/Kuala_Lumpur）起无新提交。
