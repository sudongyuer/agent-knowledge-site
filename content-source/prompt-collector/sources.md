# 高质量 Prompt 来源清单

供每周巡查使用。目标是找到一线团队和大牛**真实在用、可复制**的 prompt，而不是贩卖「1000 条提示词」的合集。

- 核实日期：2026-11-17（America/Los_Angeles）
- 原则：宁缺毋滥；链接均已实地打开或用官方 API/GitHub 核实。星标数字是当天快照，会变。
- 开发 / coding agent 仍是重点，同时覆盖产品、设计、运营、增长营销、写作、研究、法务、财务、销售和通用 prompt 工程。
- 本文件只登记**来源**。不要把未审核的 prompt 写进 `entries/`。

## 每周怎么巡查

1. 先刷「必看」里的官方文档/库和卡兹克、Lenny：有新文或改版再精读。
2. X：先看固定账号，再跑搜索（不要指望 `min_faves` 过滤器，X 搜索 API 不支持按赞数过滤，需自己看 `public_metrics`）。
3. GitHub：看官方 skills/plugins、awesome-claude-code 本周新增，点进源头读全文。
4. 非开发：Anthropic 团队系列、Lenny、Shopify、HubSpot、Every，只收能看到**完整原文**的条目。
5. 去重后再考虑入库。来源不明、泄露系统提示、只有标题没有原文的，一律不收。

### 建议搜索词

```
from:Khazix0918 (prompt OR 提示词 OR CLAUDE.md OR skill)
from:chenchengpro (prompt OR CLAUDE.md OR Agent)
from:bcherny (CLAUDE.md OR prompt OR skills OR "Claude Code")
from:dotey (prompt OR 提示词 OR skill)
from:simonw ("Claude Code" OR prompt OR Codex)
("Claude Code" OR Codex OR CLAUDE.md OR AGENTS.md) (prompt OR prompts OR 提示词 OR "I use") -is:retweet
lang:zh ("Claude Code" OR Codex OR 提示词) (常用 OR 分享 OR 工作流) -is:retweet
```

高收藏帖还要读：原文、评论区、引用（quote）。发现入口帖后用 `get_posts_quoted_posts`。

## 必看

### Anthropic Claude Code Best Practices

- 链接：[https://code.claude.com/docs/en/best-practices](https://code.claude.com/docs/en/best-practices)
- 类型：official_docs　领域：coding_agent　建议频率：weekly
- 为什么值得看：官方把 CLAUDE.md、skills、hooks、deny rules 讲清楚：哪些指令该写进 prompt，哪些必须用确定性机制执行；还有可复制的短 prompt 模式（描述结果、给出自检方式、指向参考实现）。
- 怎么巡查：每周打开该页并对照 https://code.claude.com/docs/llms.txt 看文档是否新增或改版；重点看 CLAUDE.md、skills、hooks、验证/完成标准相关段落。
- 质量信号：Anthropic 官方文档，2026-11-17 可访问，内容与当前 Claude Code 产品一致。

### Anthropic Claude Code Prompt Library

- 链接：[https://code.claude.com/docs/en/prompt-library](https://code.claude.com/docs/en/prompt-library)
- 类型：official_prompt_library　领域：coding_agent　建议频率：weekly
- 为什么值得看：官方按任务/角色整理的可复制 Claude Code prompt，来自 Common workflows、Best practices 和 Anthropic 内部团队实践，并解释「为什么有效」。
- 怎么巡查：每周打开页面看是否新增卡片；每条点开 Why this works，只收录带模式说明、可迁移到自己项目的条目。
- 质量信号：官方库，明确标注来源指南，prompt 短、可直接粘贴。

### How Anthropic teams use Claude Code

- 链接：[https://claude.com/resources/articles/how-anthropic-teams-use-claude-code](https://claude.com/resources/articles/how-anthropic-teams-use-claude-code)
- 类型：company_guide　领域：coding_agent　建议频率：monthly
- 为什么值得看：Anthropic 工程团队自己怎么用 Claude Code：CLAUDE.md、MCP、子 agent、GitHub Actions 等一线工作流，不是营销空话。
- 怎么巡查：每月重读一次；同时在 https://claude.com/resources/articles 搜索 “How Anthropic” 看是否有新工程案例。
- 质量信号：官方第一手内部实践文章。

### Anthropic Prompting Best Practices

- 链接：[https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- 类型：official_docs　领域：general_prompt_eng　建议频率：weekly
- 为什么值得看：当前 Claude 模型（含 Opus/Sonnet 系列）的官方 prompt 工程总手册：先看模型专页再看通用技法，覆盖清晰指令、few-shot、XML 结构、tool use、agentic prompting。
- 怎么巡查：每周看该页及同目录模型专页是否更新，尤其是新模型发布后：https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview
- 质量信号：官方平台文档，按模型分册，持续更新。

### Anthropic Claude Cookbooks

- 链接：[https://github.com/anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks)
- 类型：official_cookbook　领域：general_prompt_eng、research、coding_agent　建议频率：weekly
- 为什么值得看：官方 notebook/recipe，含分类、摘要、tool use、客户服务 agent、metaprompt、评测等可复制实现，不只是原则。
- 怎么巡查：每周看 GitHub 最近 commit 与 registry.yaml；优先读新增大模型/agent/评测类 notebook。
- 质量信号：官方仓库，2026-11-17 核实 54,795 stars，最近 push 2026-11-04。

### Anthropic Official Agent Skills

- 链接：[https://github.com/anthropics/skills](https://github.com/anthropics/skills)
- 类型：github_repo　领域：coding_agent　建议频率：weekly
- 为什么值得看：官方 Agent Skills 仓库：SKILL.md 格式、模板和示例技能，是 Claude Code / Codex 等直接加载的标准，比第三方 skill 合集更值得当基准。
- 怎么巡查：每周看新 commit、新 skill 目录和 SKILL.md 模板变化；只把结构或指令模式学走，不要整库照搬。
- 质量信号：官方仓库，2026-11-17 核实 196,381 stars，最近 push 2026-11-16。

### OpenAI Prompt Engineering Guide

- 链接：[https://developers.openai.com/api/docs/guides/prompt-engineering](https://developers.openai.com/api/docs/guides/prompt-engineering)
- 类型：official_docs　领域：general_prompt_eng　建议频率：weekly
- 为什么值得看：OpenAI 官方 prompt 工程指南，强调角色消息、模型快照钉死、用评测套件迭代；是通用最佳实践的基准页。
- 怎么巡查：每周打开该页；新模型发布后再对照 Cookbook 里对应 prompting guide。
- 质量信号：官方 API 文档。

### OpenAI Codex Prompting Guide

- 链接：[https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide)
- 类型：official_docs　领域：coding_agent　建议频率：weekly
- 为什么值得看：官方给 Codex/编码 agent 的 starter prompt 和工具使用规则（自主性、代码库探索、并行 tool call、前端质量），可直接对照自己的 AGENTS.md 或系统提示。
- 怎么巡查：每周打开该页（也可追加 .md 取纯文本）；关注 Recommended Starter Prompt 是否改版。
- 质量信号：官方 Cookbook，含完整推荐起始 prompt。
- 备注：文档提到亦可参考开源 Codex CLI 作为参考实现。

### OpenAI Cookbook

- 链接：[https://cookbook.openai.com](https://cookbook.openai.com)；其它链接：[https://github.com/openai/openai-cookbook](https://github.com/openai/openai-cookbook)
- 类型：official_cookbook　领域：general_prompt_eng、coding_agent、research　建议频率：weekly
- 为什么值得看：官方示例库：模型专属 prompting guide、prompt 优化、评测飞轮、Codex 工作流等，常有可复制的系统提示和评测方法。
- 怎么巡查：每周看 https://github.com/openai/openai-cookbook 最近 commit，并浏览 cookbook.openai.com 新增 examples；优先 prompting、codex、evaluation。
- 质量信号：官方仓库，2026-11-17 核实 77,211 stars，当天仍有 push。

### ChatGPT Learn: Prompting and Codex Best Practices

- 链接：[https://learn.chatgpt.com/docs/prompting](https://learn.chatgpt.com/docs/prompting)；其它链接：[https://learn.chatgpt.com/guides/best-practices](https://learn.chatgpt.com/guides/best-practices)
- 类型：official_docs　领域：coding_agent、general_prompt_eng、product　建议频率：weekly
- 为什么值得看：面向实际使用者的官方 prompting 页，含 Codex 专项：目标/上下文/约束/完成标准，以及带示例的工作流 prompt。
- 怎么巡查：每周打开这两页，收集带「When to use / example user prompts / verification」结构的新示例。
- 质量信号：OpenAI 官方 Learn 文档，2026-11-17 可访问。

### Google Gemini Prompt Design Strategies

- 链接：[https://ai.google.dev/gemini-api/docs/prompting-strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)
- 类型：official_docs　领域：general_prompt_eng　建议频率：weekly
- 为什么值得看：Gemini 官方提示设计策略：清晰指令、few-shot、结构化输出、推理与 agentic 工作流，并给出系统指令模板。
- 怎么巡查：每周打开该页，尤其在 Gemini 新版本发布后看新增「Gemini N strategies」章节。
- 质量信号：Google AI for Developers 官方文档。

### Google Gemini Prompt Gallery

- 链接：[https://ai.google.dev/gemini-api/prompts](https://ai.google.dev/gemini-api/prompts)
- 类型：official_prompt_library　领域：general_prompt_eng、growth_marketing、writing、research、coding_agent　建议频率：weekly
- 为什么值得看：官方可交互 prompt 画廊，覆盖营销文案、博客、研究助手、代码、结构化 JSON 等，适合跨领域取样，但要挑有约束和格式的，不要只收标题党条目。
- 怎么巡查：每周浏览画廊新增卡片；点进能看到完整 prompt 的条目再考虑收录。
- 质量信号：官方 gallery，2026-11-17 可访问。

### AGENTS.md 开放格式

- 链接：[https://agents.md/](https://agents.md/)；其它链接：[https://github.com/agentsmd/agents.md](https://github.com/agentsmd/agents.md)
- 类型：official_docs　领域：coding_agent　建议频率：monthly
- 为什么值得看：给 coding agent 写仓库级说明的开放约定，被 Codex 等识别；适合对照自己的 AGENTS.md/CLAUDE.md 该写什么。
- 怎么巡查：每月看官网和 GitHub 仓库是否更新格式说明或示例；不把它当成 prompt 倾销站。
- 质量信号：格式主站可访问；GitHub agentsmd/agents.md 2026-11-17 核实 25,528 stars，最近 push 2026-09-10。

### Anthropic 各部门如何用 Claude（官方系列）

- 链接：[https://claude.com/resources/articles/how-anthropic-uses-claude-marketing](https://claude.com/resources/articles/how-anthropic-uses-claude-marketing)；其它链接：[https://claude.com/resources/articles/how-anthropic-uses-claude-legal](https://claude.com/resources/articles/how-anthropic-uses-claude-legal)；[https://claude.com/resources/articles/how-the-product-designer-who-built-claude-design-uses-it-to-explore-ideas-before-building-them](https://claude.com/resources/articles/how-the-product-designer-who-built-claude-design-uses-it-to-explore-ideas-before-building-them)；[https://claude.com/resources/articles/how-anthropics-finance-team-uses-claude-to-shape-the-narrative-behind-the-numbers](https://claude.com/resources/articles/how-anthropics-finance-team-uses-claude-to-shape-the-narrative-behind-the-numbers)；[https://claude.com/resources/articles/how-anthropics-business-development-team-uses-claude-to-run-inbound-and-outbound-at-scale](https://claude.com/resources/articles/how-anthropics-business-development-team-uses-claude-to-run-inbound-and-outbound-at-scale)；[https://claude.com/resources/articles/how-anthropic-enables-self-service-data-analytics-with-claude](https://claude.com/resources/articles/how-anthropic-enables-self-service-data-analytics-with-claude)；[https://claude.com/resources/articles/how-an-anthropic-sales-leader-uses-claude-cowork-to-run-a-4-000-account-book](https://claude.com/resources/articles/how-an-anthropic-sales-leader-uses-claude-cowork-to-run-a-4-000-account-book)
- 类型：company_guide　领域：growth_marketing、legal、design、finance、sales_bd、research、operations　建议频率：weekly
- 为什么值得看：顶尖实验室把自己的增长营销、法务、设计、财务、商务拓展、数据分析怎么用 Claude 写出来了，带真实工作流、skills 设计和少量可复制说法，是非开发领域最硬的一手来源。
- 怎么巡查：每周在 https://claude.com/resources/articles 搜索 “How Anthropic uses” / “How Anthropic's” 看新文；已有文章如有实质更新再精读。
- 质量信号：全部为 claude.com 官方文章，2026-11-17 已逐篇打开确认可访问。

### 数字生命卡兹克 @Khazix0918

- 链接：[https://x.com/Khazix0918](https://x.com/Khazix0918)；其它链接：[https://x.com/Khazix0918/status/2122268349707219333](https://x.com/Khazix0918/status/2122268349707219333)；[https://github.com/KKKKhazix/khazix-skills](https://github.com/KKKKhazix/khazix-skills)
- 类型：x_account　领域：coding_agent、chinese_community　建议频率：weekly
- 为什么值得看：中文圈最活跃的高质量 coding-agent prompt 分享者之一。起点帖「我用 Agent 干活最爱说的几句 Prompt」（2026-11-16）列出 10 条可直接复制的工作原则型 prompt，截至核实当天约 4,900 收藏 / 4,100 赞 / 200+ 回复 / 70 条转发，评论区和引用里常有一线开发者补自己的常用句。配套开源仓库 khazix-skills（22,343 stars，最近 push 2026-11-15）把部分能力做成可安装 skill。
- 怎么巡查：每周看 from:Khazix0918 新帖；对高互动「常用 prompt」帖用对话和 get_posts_quoted_posts 读评论区与引用。同步看 https://github.com/KKKKhazix/khazix-skills 新 skill。公众号「数字生命卡兹克」在简介中被提及，但无稳定可验证的公开 URL，暂不作为巡查入口。
- 质量信号：账号约 11.4 万关注，起点帖高收藏且内容为完整可复制 prompt；GitHub 仓库活跃。

### Lenny's Newsletter

- 链接：[https://www.lennysnewsletter.com/](https://www.lennysnewsletter.com/)；其它链接：[https://www.lennysnewsletter.com/p/how-to-use-chatgpt-in-your-pm-work](https://www.lennysnewsletter.com/p/how-to-use-chatgpt-in-your-pm-work)；[https://www.lennysnewsletter.com/p/how-to-use-perplexity-in-your-pm](https://www.lennysnewsletter.com/p/how-to-use-perplexity-in-your-pm)；[https://www.lennysnewsletter.com/p/five-proven-prompt-engineering-techniques](https://www.lennysnewsletter.com/p/five-proven-prompt-engineering-techniques)；[https://www.lennysnewsletter.com/p/ai-prompt-engineering-in-2025-sander-schulhoff](https://www.lennysnewsletter.com/p/ai-prompt-engineering-in-2025-sander-schulhoff)
- 类型：newsletter　领域：product、growth_marketing、general_prompt_eng　建议频率：weekly
- 为什么值得看：产品/增长领域最值得定期看的 newsletter 之一，多篇文章带 PM 真实在用的可复制 prompt（反馈总结、PRD 评审、增长研究、竞品拆解）。免费篇《How to use Perplexity in your PM work》列出 27 条读者贡献的完整研究型 prompt；ChatGPT 那篇有部分全文在付费墙后，但可见若干高质量短 prompt。
- 怎么巡查：每周打开档案/最新一期，搜索 prompt、ChatGPT、Claude、Perplexity、AI；优先收录带「actual prompts」的文章，付费墙后只收录能读到原文的条目。
- 质量信号：Lenny Rachitsky 产品社区；文章含读者/一线 PM 原句，而非空泛清单。
- 备注：部分历史文章为付费订阅。2026-11-17 能完整打开 Perplexity 一文；ChatGPT 一文为付费，只能核实可见部分。

## 常看

### Simon Willison's Weblog

- 链接：[https://simonwillison.net/](https://simonwillison.net/)；其它链接：[https://simonwillison.net/guides/agentic-engineering-patterns/](https://simonwillison.net/guides/agentic-engineering-patterns/)
- 类型：blog　领域：coding_agent、research　建议频率：weekly
- 为什么值得看：一线实践者博客，经常完整贴出自己刚跑过的 Claude Code / coding agent prompt，并拆解「引用已有实现、给自检手段、用子 agent」等模式，可直接学写法。
- 怎么巡查：每周看首页和 /guides/agentic-engineering-patterns/；搜索页用 Claude Code、prompt、sub-agent、Codex。
- 质量信号：长期高产出，文章里是真实完整 prompt 而非要点列表。X @simonw 也可作发现入口。

### Hamel Husain Blog

- 链接：[https://hamel.dev/](https://hamel.dev/)；其它链接：[https://hamel.dev/blog/posts/evals/](https://hamel.dev/blog/posts/evals/)；[https://hamel.dev/blog/posts/field-guide/](https://hamel.dev/blog/posts/field-guide/)
- 类型：blog　领域：research、general_prompt_eng　建议频率：weekly
- 为什么值得看：评测与错误分析驱动的 prompt 改进，而不是堆技巧。适合判断一条 prompt 该不该收、该怎么迭代，常有可迁移的分析框架。
- 怎么巡查：每周看 https://hamel.dev/ 新文章；重点读 evals、error analysis、field guide。X @HamelHusain 作提醒。
- 质量信号：作者在 OpenAI 做 evals；博客是该主题的公认一手来源。注意：这里少有「一键复制就能用」的业务 prompt，更多是方法。

### Geoffrey Huntley：Ralph 循环

- 链接：[https://ghuntley.com/ralph/](https://ghuntley.com/ralph/)；其它链接：[https://ghuntley.com/](https://ghuntley.com/)；[https://ghuntley.com/loop/](https://ghuntley.com/loop/)
- 类型：blog　领域：coding_agent　建议频率：weekly
- 为什么值得看：把长期 coding-agent 工作收成可循环的 PROMPT.md 方法（Ralph loop），博客里有可复制的计划/构建提示思路，是「如何把 prompt 写成可重复运行的规格」而不是单次对话技巧。
- 怎么巡查：每周看 ghuntley.com 新文，尤其 ralph/loop 相关；X @GeoffreyHuntley。GitHub 上有相关材料，但以博客为权威入口。
- 质量信号：作者个人站点可访问，该技法在 coding-agent 圈被广泛引用。

### Matt Pocock / AI Hero Skills

- 链接：[https://www.aihero.dev/skills](https://www.aihero.dev/skills)；其它链接：[https://www.aihero.dev/skills-catalog](https://www.aihero.dev/skills-catalog)；[https://x.com/mattpocockuk](https://x.com/mattpocockuk)
- 类型：blog　领域：coding_agent　建议频率：weekly
- 为什么值得看：面向真实工程师的可安装 Claude Code skills（需求、PRD、issue、TDD、分诊等），是「写成 skill 的工作流 prompt」，不是泛泛的 ChatGPT 清单。
- 怎么巡查：每周看 skills 与 catalog 页是否新增；必要时看 X @mattpocockuk。部分内容可能偏课程/产品，只收公开可复制的 skill 说明。
- 质量信号：2026-11-17 页面可访问；作者在开发者教育领域有长期产出。

### HumanLayer: Writing a good CLAUDE.md

- 链接：[https://www.humanlayer.dev/blog/writing-a-good-claude-md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- 类型：blog　领域：coding_agent　建议频率：monthly
- 为什么值得看：专门讲如何写 CLAUDE.md：短、只写 agent 无法从代码里发现的上下文、避免把任务规则塞进总是加载的文件。质量信号强，适合当写作标准而不是每周新 prompt 源。
- 怎么巡查：每月打开确认是否修订；同时看 https://www.humanlayer.dev/blog 是否有后续 agent 实践文。
- 质量信号：2026-11-17 可访问；被 awesome-claude-code 等策展列表引用。

### addyosmani/agent-skills

- 链接：[https://github.com/addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)；其它链接：[https://skills.addy.ie](https://skills.addy.ie)
- 类型：github_repo　领域：coding_agent　建议频率：weekly
- 为什么值得看：Chrome / Google 工程师 Addy Osmani 的 production-grade agent skills，面向 Claude Code、Codex、Cursor，比大而全的 awesome 倾销更值得逐份读。
- 怎么巡查：每周看 GitHub 最近 commit 与新 skill；官网 https://skills.addy.ie 可作浏览入口。
- 质量信号：2026-11-17 核实 118,500 stars，最近 push 2026-11-14，作者身份可核对。

### hesreallyhim/awesome-claude-code

- 链接：[https://github.com/hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
- 类型：awesome_list　领域：coding_agent　建议频率：weekly
- 为什么值得看：目前最活跃的 Claude Code 策展清单，指向官方文档、CLAUDE.md 范文、高质量 skills 和文章，适合当发现入口；本身不是 prompt 原文库，需点进源头再收录。
- 怎么巡查：每周看 README 与最近 commit/PR，只 follow 有说明、有来源、最近仍维护的条目。
- 质量信号：2026-11-17 核实 58,205 stars，当天仍有 push；人工策展，但 issue 很多，要自己过滤。

### anthropics/claude-plugins-official

- 链接：[https://github.com/anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- 类型：github_repo　领域：coding_agent　建议频率：weekly
- 为什么值得看：Anthropic 官方维护的高质量 Claude Code 插件目录，比民间 skill 合集更干净，常含可复用的工作流指令。
- 怎么巡查：每周看仓库新增插件与文档变化。
- 质量信号：官方仓库，搜索核实约 47,527 stars，2026-11-17 仍有 push。

### Boris Cherny @bcherny

- 链接：[https://x.com/bcherny](https://x.com/bcherny)
- 类型：x_account　领域：coding_agent　建议频率：weekly
- 为什么值得看：Claude Code 相关核心人物（简介为 Claude @anthropicai），偶尔在 X 和官方 workshop/文档里分享真实用法；不是每周都有可复制 prompt，但出现时优先级很高。
- 怎么巡查：每周看 from:bcherny 新帖，尤其提到 CLAUDE.md、skills、best practices、工作流的内容；并回链到官方文档核实。
- 质量信号：账号已核实，约 64 万关注；内容以实践和产品说明为主。

### 陈成 @chenchengpro

- 链接：[https://x.com/chenchengpro](https://x.com/chenchengpro)；其它链接：[https://x.com/chenchengpro/status/2122321666898538758](https://x.com/chenchengpro/status/2122321666898538758)
- 类型：x_account　领域：coding_agent、chinese_community　建议频率：weekly
- 为什么值得看：UmiJS 等开源作者、一线工程实践者。引用卡兹克起点帖时分享了自己的常用 prompt（先分析再改、在 worktree 中逐步实现再一次性提交等），冻鱼点名觉得有用；评论/引用质量高于普通转发。
- 怎么巡查：每周看 from:chenchengpro，以及他引用/回复的高收藏 prompt 帖；读全文（含可能的后续楼或图片）。
- 质量信号：起点转发帖 2026-11-16 发布，核实当天约 516 收藏 / 490 赞；账号身份可核对。
- 备注：该帖可见文本在 API 中可能被截断，巡查时需打开原帖确认是否有更长版本或线程续帖。

### 宝玉 baoyu.io / @dotey / baoyu-skills

- 链接：[https://baoyu.io/blog/why-i-cant-write-good-prompts-with-ai-and-templates](https://baoyu.io/blog/why-i-cant-write-good-prompts-with-ai-and-templates)；其它链接：[https://baoyu.io/](https://baoyu.io/)；[https://x.com/dotey](https://x.com/dotey)；[https://github.com/JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills)
- 类型：blog　领域：writing、coding_agent、chinese_community、general_prompt_eng　建议频率：weekly
- 为什么值得看：中文圈少有「讲如何写好 prompt，而不是贩卖模板」的作者；博客强调目标—编写—测试—评估—迭代。GitHub JimLiu/baoyu-skills（27,629 stars，最近 push 2026-11-06）提供可安装的翻译、写作、发布类 skills。
- 怎么巡查：每周看 baoyu.io 新文、from:dotey、以及 baoyu-skills 新 skill。
- 质量信号：站点、X 账号与 GitHub 仓库均已核实可访问且互相指向。

### Shopify: AI Prompts for Ecommerce

- 链接：[https://www.shopify.com/blog/ai-prompts](https://www.shopify.com/blog/ai-prompts)
- 类型：company_guide　领域：growth_marketing、operations、writing　建议频率：monthly
- 为什么值得看：Shopify 官方电商 prompt 示例文（2026-11-14 更新），14 条完整可复制 prompt，覆盖商品描述、定价、客服（含不得编造政策的兜底句）、库存策略、个性化推荐，并解释每条为什么有效。
- 怎么巡查：每月打开该文看是否增补；同时在 shopify.com/blog 搜索 AI prompts / Sidekick。帮助中心 https://help.shopify.com/en/manual/ai-powered-tools/sidekick/generate-content 可顺带看。
- 质量信号：官方博客，带完整原文和策略说明，不是第三方「1000 条 ChatGPT 提示」合集。

### HubSpot Loop Book Prompt Library

- 链接：[https://www.hubspot.com/loop-book-prompt-library](https://www.hubspot.com/loop-book-prompt-library)；其它链接：[https://offers.hubspot.com/loop-marketing-prompts](https://offers.hubspot.com/loop-marketing-prompts)
- 类型：official_prompt_library　领域：growth_marketing、writing、product　建议频率：monthly
- 为什么值得看：HubSpot 把 Loop Marketing 书中的 prompt 做成可搜索官方库：客户洞察、品牌故事、Buyer Sim 压力测试、内容拆分等，是营销领域少见的「公司官方、可复制、带方法论」来源。
- 怎么巡查：每月打开图书馆页，按章节浏览；点 Expand 看全文后再收录。offers.hubspot.com 上另有相关下载，注意是否要注册。
- 质量信号：2026-11-17 主库页面可访问，能看到多条完整度较高的 prompt 标题与正文开头。
- 备注：部分条目在未展开时被截断，收录前必须展开或复制到全文。

### Every.to 写作与 prompt 文

- 链接：[https://every.to/p/how-to-make-ai-write-less-like-ai](https://every.to/p/how-to-make-ai-write-less-like-ai)；其它链接：[https://every.to/p/the-ultimate-guide-to-prompt-engineering](https://every.to/p/the-ultimate-guide-to-prompt-engineering)；[https://every.to/](https://every.to/)
- 类型：newsletter　领域：writing、general_prompt_eng　建议频率：weekly
- 为什么值得看：Dan Shipper 团队的 Every 常写「如何让 AI 写出不像 AI 的文字」和 prompt/context engineering；强调先给研究与品牌上下文，而不是只调一句指令，对内容/营销写作有实操价值。
- 怎么巡查：每周看 every.to 新文，关键词 prompt、writing、Spiral、context engineering；只收带完整示例或可迁移流程的文章。
- 质量信号：2026-11-17 已打开《How to Make AI Write Less Like AI》确认可访问。部分文章可能付费。

### YC: State-Of-The-Art Prompting For AI Agents

- 链接：[https://www.ycombinator.com/library/MS-state-of-the-art-prompting-for-ai-agents](https://www.ycombinator.com/library/MS-state-of-the-art-prompting-for-ai-agents)；其它链接：[https://www.youtube.com/watch?v=DL82mGde6wo](https://www.youtube.com/watch?v=DL82mGde6wo)
- 类型：video　领域：general_prompt_eng、operations、coding_agent　建议频率：monthly
- 为什么值得看：Y Combinator 官方 Startup Library 节目，整理顶级 YC AI 创业公司的 prompt 与工程实践（结构化输出、元提示、escape hatch、evals 等），是「公司级系统提示」而不是个人妙招。
- 怎么巡查：每月打开 Library 页或 YouTube 看是否有续集/相关新节目；有新访谈再记录其中公开的 prompt 片段。
- 质量信号：YC 官方 Library 与 YouTube 链接均能检索到（2025-05-30 左右发布）。直接抓取 Library 页几乎无正文，内容以视频为准。
- 备注：WebFetch 对该 Library 页几乎返回空，巡查应看视频/转写，不要只依赖页面 HTML。

### Microsoft Copilot Prompt Gallery

- 链接：[https://www.adoption.microsoft.com/en-us/copilot/prompt-gallery/](https://www.adoption.microsoft.com/en-us/copilot/prompt-gallery/)；其它链接：[https://m365.cloud.microsoft/copilot-prompts](https://m365.cloud.microsoft/copilot-prompts)；[https://learn.microsoft.com/en-us/copilot/manage/copilot-prompt-gallery](https://learn.microsoft.com/en-us/copilot/manage/copilot-prompt-gallery)
- 类型：official_prompt_library　领域：operations、writing、product　建议频率：monthly
- 为什么值得看：微软官方 Copilot 提示画廊，面向办公/运营场景（Word、Excel、PowerPoint、组织共享提示），是大公司公开的工作向 prompt 库。
- 怎么巡查：每月打开 Adoption 画廊与 Microsoft Learn 说明页，看新增分类；应用内画廊可能需登录，登录不到则只收公开页上的完整原文。
- 质量信号：官方支持/Learn/Adoption 文档互相引用。部分提示只在登录后的 Copilot 产品里可见。

### DAIR.AI Prompt Engineering Guide

- 链接：[https://www.promptingguide.ai/](https://www.promptingguide.ai/)；其它链接：[https://github.com/dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)
- 类型：guide　领域：general_prompt_eng　建议频率：monthly
- 为什么值得看：长期被引用的系统化 prompt 工程教科书（技巧、论文、RAG、agents），适合打底，不是每周新业务 prompt 的来源。
- 怎么巡查：每月看站点新章节和 GitHub commit；若长期无更新，仍可当词典查，不必每次强行找新条目。
- 质量信号：GitHub 2026-11-17 核实 80,148 stars；最近 push 为 2026-03-11，更新频率已放缓。

### Learn Prompting

- 链接：[https://learnprompting.org/](https://learnprompting.org/)；其它链接：[https://learnprompting.org/docs/introduction](https://learnprompting.org/docs/introduction)
- 类型：guide　领域：general_prompt_eng　建议频率：monthly
- 为什么值得看：Sander Schulhoff 发起的公开 prompt 工程指南，覆盖基础技法、agent、安全；与 Lenny 访谈互为补充。部分进阶课是付费的，只巡查公开文档。
- 怎么巡查：每月看 docs 目录是否新增公开章节；不要把付费课当成必采源。
- 质量信号：官方站点 2026-11-17 可检索确认；创始人在 prompt 安全/研究社区活跃。

## 偶尔

### x1xhlol/system-prompts-and-models-of-ai-tools

- 链接：[https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools)
- 类型：github_repo　领域：general_prompt_eng、coding_agent、product　建议频率：monthly
- 为什么值得看：目前最全的公开 AI 产品系统提示合集（Cursor、Claude Code、Perplexity、v0、Devin 等），适合研究顶尖产品如何写系统提示，不适合当「可直接复制到生产」的模板。
- 怎么巡查：每月看仓库是否有新目录或大更新；只学习结构和模式，交叉验证，不把泄露内容当官方、不整段搬进自己的产品。
- 质量信号：2026-11-17 核实 144,723 stars，最近 push 2026-10-12。来源多为非官方/泄露，准确性与合法性需自行判断。
- 备注：非官方汇编。巡查目的是学习产品级系统提示的结构，禁止把版权不明的长文当已核实官方原文入库。

### Andrej Karpathy @karpathy

- 链接：[https://x.com/karpathy](https://x.com/karpathy)
- 类型：x_account　领域：coding_agent、general_prompt_eng　建议频率：weekly
- 为什么值得看：常有关于 LLM 编程、agent 工作方式的高信号原则，但很少定期发布可复制的 prompt 模板。值得扫，不要期望每周都有条目。
- 怎么巡查：每周扫 from:karpathy，只在帖子真正给出可执行指令或可引用原则时才深入。
- 质量信号：账号已核实，约 445 万关注；不是 prompt 库。

### anthropics/k12-teacher-skills

- 链接：[https://github.com/anthropics/k12-teacher-skills](https://github.com/anthropics/k12-teacher-skills)
- 类型：github_repo　领域：education　建议频率：monthly
- 为什么值得看：Anthropic 与 Learning Commons 合作的 K-12 教师 skills 和评测量表，是官方跨出工程领域、带 rubric 的少见来源。
- 怎么巡查：每月看仓库更新；若新增 skill/评测标准再读。
- 质量信号：官方仓库，2026-11-17 核实 633 stars，最近 push 2026-10-14。星标不高但来源硬。

### a16z 相关 AI/agent 文章

- 链接：[https://a16z.com/context-is-king/](https://a16z.com/context-is-king/)；其它链接：[https://a16z.com/nine-emerging-developer-patterns-for-the-ai-era/](https://a16z.com/nine-emerging-developer-patterns-for-the-ai-era/)
- 类型：blog　领域：general_prompt_eng、product、coding_agent　建议频率：monthly
- 为什么值得看：有关于「context 比 prompt 技巧更重要」、把 prompt 当源码管理的投资人观察，但不是可复制 prompt 库。只在出新的实践向长文时看。
- 怎么巡查：每月在 a16z.com 搜索 prompt、agents、context engineering；没有新的实践文就跳过。
- 质量信号：上述两篇 2026-11-17 可检索确认。未找到 a16z 官方 prompt 库。

## 设计 / UI 专项（2026-11-18 新增）

给「大牛们怎么用 agent 做出顶级 UI/UX」这条线用。巡查时额外跑这些 X 搜索：

```
from:emilkowalski (skill OR agents OR taste)
from:designertom (skill OR agent)
("Claude Code" OR Codex OR Cursor) (UI OR design) (skill OR prompt) (slop OR taste OR "design system") -is:retweet
lang:zh (UI OR 设计 OR 前端) (提示词 OR skill) (AI味 OR 审美 OR 高级感) -is:retweet
from:Kubai087 (999 OR Prompt OR 提示词)
```

### Anthropic 官方前端设计：frontend-design skill + Frontend Aesthetics cookbook

- 链接：[https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)；其它链接：[https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb)；[https://claude.com/resources/articles/improving-frontend-design-through-skills](https://claude.com/resources/articles/improving-frontend-design-through-skills)
- 类型：official_docs　领域：design、coding_agent　优先级：必看　建议频率：monthly
- 为什么值得看：Anthropic 官方对「AI 味」界面的定义和解法：2025 年的 ~400 token 审美块（字体/配色/动效/背景）和 2026 年版 skill 的两遍法（先写设计计划、对照五类 AI 默认款自查、截图自评）。官方甚至把 Claude 自己的奶油底+陶土色列为破绽，是最硬的反 AI 味来源。
- 怎么巡查：每月看 anthropics/skills 里 frontend-design/SKILL.md 的提交记录，有改动就精读 diff；同时在 claude.com/resources/articles 搜 frontend / design。
- 质量信号：官方仓库（anthropics/skills 2026-11-18 约 19.7 万 star）+ 官方博客，作者署名 Anthropic Applied AI 团队。

### OpenAI：Designing delightful frontends with GPT-5.4（含 frontend-skill）

- 链接：[https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4](https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4)；其它链接：[https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_frontend](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_frontend)
- 类型：official_docs　领域：design、coding_agent　优先级：必看　建议频率：monthly
- 为什么值得看：OpenAI 官方给 Codex/GPT 做前端的指南：快速清单（低推理、先定设计系统、给参考图/情绪板、先定内容）、可直接贴的「Frontend tasks」硬规则、frontend-skill 全文（visual thesis / content plan / interaction thesis，App 用 Linear 式克制）。冻鱼用 Codex，这是官方标准。
- 怎么巡查：每月打开博客（URL 后加 .md 可拿纯文本），并在 developers.openai.com 搜 frontend / design 看是否出了新模型版本的指南。
- 质量信号：官方博客，2026-11-18 可访问。博客里链接的 openai/skills GitHub 路径当天 404，以博客内全文为准。

### Emil Kowalski：emilkowalski/skills + aiforui.dev + @emilkowalski

- 链接：[https://github.com/emilkowalski/skills](https://github.com/emilkowalski/skills)；其它链接：[https://aiforui.dev/skills](https://aiforui.dev/skills)；[https://emilkowal.ski/ui/agents-with-taste](https://emilkowal.ski/ui/agents-with-taste)；[https://x.com/emilkowalski](https://x.com/emilkowalski)
- 类型：github_repo　领域：design、coding_agent、mobile　优先级：必看　建议频率：weekly
- 为什么值得看：设计工程师（曾在 Vercel、Linear，Sonner/Vaul 作者）把动效、手势、移动端手感写成小而严格的规则型 skill：animate、animate-expo（RN/Expo）、mobile-native、gestures、prototype、learn-taste、break-ui 等。《Agents with Taste》是「怎么把品味写成 skill」的最好示范，直接对口冻鱼写移动端设计 skill。
- 怎么巡查：每周看 from:emilkowalski 新帖（新 skill 都会发帖，常有 2000+ 收藏）和仓库提交；aiforui.dev/skills 每个 skill 页有用法和示例 prompt。
- 质量信号：2026-11-18 约 5.8 万 star，最近 push 2026-11-15；X 新 skill 帖 1700–10600 收藏。

### Expo 官方 skills（expo/skills）

- 链接：[https://github.com/expo/skills](https://github.com/expo/skills)；其它链接：[https://docs.expo.dev/skills/](https://docs.expo.dev/skills/)
- 类型：github_repo　领域：mobile、design、coding_agent　优先级：必看　建议频率：weekly
- 为什么值得看：Expo 团队官方的 agent skills：expo-native-ui（HIG/Material 风格、语义色、原生控件、屏幕完成前的走查清单）、expo-design-system（token 主题、设计系统漂移审计与评分、20 个 native slop 破绽清单）、expo-animation（按压反馈、haptics 规则、Reanimated）、expo-data-fetching（每屏四种状态）、expo-web-to-native（重设计而非换皮）等。React Native / Expo 移动端最权威的 agent 规则来源。（2026-11-21 补读 expo-design-system 的 audit.md / native-slop.md、expo-animation、expo-data-fetching、expo-web-to-native。）
- 怎么巡查：每周看仓库提交和 README 的 skill 列表；重点读 plugins/expo/skills/ 下与 UI、设计系统、动画相关的 SKILL.md。
- 质量信号：官方仓库，2026-11-18 约 4200 star、当天有 push；也在 Claude Code 官方插件市场和 Codex 官方市场上架。

### Jakub Krehel：jakubkrehel/skills + Interfaces 杂志

- 链接：[https://github.com/jakubkrehel/skills](https://github.com/jakubkrehel/skills)；其它链接：[https://interfaces.dev/](https://interfaces.dev/)；[https://jakub.kr/](https://jakub.kr/)
- 类型：github_repo　领域：design、coding_agent　优先级：常看　建议频率：weekly
- 为什么值得看：设计工程师的界面 skill 套件：build-design（按 Figma/截图精确还原、差异表）、better-ui/typography/colors/accessibility/layout/writing、interface-review（审 PR 的界面回归）、state-machine、variant、break。每个都写清「做完的标准」，适合拿来学怎么写设计 skill。
- 怎么巡查：每周看仓库提交；interfaces.dev 有新文章时读与 agent 相关的。
- 质量信号：2026-11-18 约 1.2 万 star，当天有 push。

### Vercel Web Interface Guidelines + web-design-guidelines skill

- 链接：[https://github.com/vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines)；其它链接：[https://vercel.com/design/guidelines](https://vercel.com/design/guidelines)；[https://github.com/vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- 类型：official_docs　领域：design、coding_agent　优先级：常看　建议频率：monthly
- 为什么值得看：Vercel 设计团队公开的几百条界面细节规范（交互、焦点、表单、动画、排版、内容、文案），附一个只输出「文件:行号」的审查命令和 AGENTS.md，可在生成和审查两头用。
- 怎么巡查：每月看 README 和 command.md 是否改版。
- 质量信号：Vercel 官方仓库（约 1200 star，agent-skills 约 3.4 万 star）；致谢名单含 Paco Coursey 等设计工程师。

### Paul Bakaus：Impeccable（pbakaus/impeccable）

- 链接：[https://github.com/pbakaus/impeccable](https://github.com/pbakaus/impeccable)；其它链接：[https://impeccable.style/docs](https://impeccable.style/docs)
- 类型：github_repo　领域：design、mobile、coding_agent　优先级：常看　建议频率：monthly
- 为什么值得看：目前最火的设计 skill 之一：24 个设计命令（critique、audit、polish、harden、adapt 等）+ 62 条不靠 LLM 的反 AI 味检测规则。最值得摘的是 reference/ 下的 craft-floor.md（质量底线和禁用清单）和 ios.md / android.md / adapt.native.md（原生 App 规则与模拟器验证）。
- 怎么巡查：每月看 skill/reference/ 目录的变化；不建议整库安装前不读（live 模式会在特定情况下以关闭审批/沙箱方式调用 codex/claude CLI）。
- 质量信号：2026-11-18 约 11.3 万 star，当天有 push；作者曾在 Google 做十年 devrel（其 X 自述）。也有反对声音认为通用设计 skill 会拉低效果。

### Garry Tan：gstack 的设计类 skill（design-review 等）

- 链接：[https://github.com/garrytan/gstack](https://github.com/garrytan/gstack)；其它链接：[https://github.com/garrytan/gstack/blob/main/design-review/SKILL.md.tmpl](https://github.com/garrytan/gstack/blob/main/design-review/SKILL.md.tmpl)
- 类型：github_repo　领域：design、coding_agent　优先级：偶尔　建议频率：monthly
- 为什么值得看：YC CEO 公开的 Claude Code 配置，其中 /design-review 的「走查→逐条最小修复→每条单独提交→前后截图→回滚→风险自控」流程很成熟，可以直接借鉴。
- 怎么巡查：每月看 design-review、plan-design-review、design-consultation 目录的变化。文件是模板（含 {{PREAMBLE}} 等占位符），只借流程。
- 质量信号：2026-11-18 约 14.2 万 star，当天有 push。

### 花叔：huashu-design（中文设计 skill）

- 链接：[https://github.com/alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design)
- 类型：github_repo　领域：design、chinese_community　优先级：常看　建议频率：monthly
- 为什么值得看：中文社区最成体系的设计 skill，中文原文可直接用：「三方向门」、打磨环（逐屏截图、每轮只改最伤的三处）、模板装饰清单、Gate 文件。定位是 HTML 原型/幻灯片/动画，不是生产 App，但方法可迁移。
- 怎么巡查：每月看 SKILL.md 和 references/ 的更新（默认分支是 master）。
- 质量信号：2026-11-18 约 3 万 star，最近 push 2026-11-10；X 中文圈常被列入「去 AI 味」skill 清单。

### Tommy Geoco @designertom

- 链接：[https://x.com/designertom](https://x.com/designertom)；其它链接：[https://x.com/designertom/status/2114786186250379759](https://x.com/designertom/status/2114786186250379759)
- 类型：x_account　领域：design　优先级：偶尔　建议频率：weekly
- 为什么值得看：常点评设计师做的 agent skill，给过「装设计 skill 前先审」的清单和可粘贴 prompt。适合跟进设计 skill 圈的新动向和理性评价。
- 怎么巡查：每周扫 from:designertom (skill OR agent OR Claude OR Codex)。
- 质量信号：2026-11-18 核实帖子约 340 收藏、36 回复。

### Julien Thibeaut（@Ibelick）：ibelick/ui-skills

- 链接：[https://github.com/ibelick/ui-skills](https://github.com/ibelick/ui-skills)；其它链接：[https://www.ui-skills.com](https://www.ui-skills.com)
- 类型：github_repo　领域：design、coding_agent　优先级：常看　建议频率：monthly
- 为什么值得看：小而严的 UI skill 合集：improve-ui（只读审查，每条发现要过规则/运行时/唯一修法三道证明，最多三条）、create-design-md（从代码反推 DESIGN.md，不把偶然写法升格成规范）、fixing-accessibility、fixing-motion-performance、baseline-ui。偏网页/Tailwind，但审查方法和边界写法可直接迁移到 RN。
- 怎么巡查：每月看 skills/ 目录下各 SKILL.md 的提交记录；新 skill 出现时精读。
- 质量信号：2026-11-21 精读 improve-ui、create-design-md、fixing-accessibility、fixing-motion-performance、baseline-ui 全文；MIT 许可，作者署名 Julien Thibeaut。（last_verified 2026-11-21）

### nextlevelbuilder：ui-ux-pro-max-skill

- 链接：[https://github.com/nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)；其它链接：[https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/references/pro-rules.md](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/references/pro-rules.md)
- 类型：github_repo　领域：design、mobile　优先级：偶尔　建议频率：monthly
- 为什么值得看：体量很大的 UI/UX 规则库（风格、配色、字体 CSV + 搜索脚本）。真正值得摘的是 references/pro-rules.md：专门针对 iOS/Android/RN/Flutter 的交付前检查单（图标、点按反馈、深浅色对比度、安全区、小屏横屏、大字号）。
- 怎么巡查：每月看 references/ 下 pro-rules.md 和 quick-reference.md 的变化；其余数据库部分不必跟。
- 质量信号：2026-11-18 记录约 15 万 star；2026-11-21 精读 pro-rules.md 全文和 SKILL.md 优先级表。（last_verified 2026-11-21）

### Google Labs：stitch-skills

- 链接：[https://github.com/google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills)
- 类型：github_repo　领域：design、coding_agent　优先级：偶尔　建议频率：monthly
- 为什么值得看：Google Stitch 配套的 agent skills。多数 skill 需要接 Stitch MCP 才能用，但 enhance-prompt（把模糊需求改写成带「DESIGN SYSTEM (REQUIRED)」和页面结构的 prompt、局部修改注明 targeted edit）和 design-md（五段式 DESIGN.md 结构）的写法可脱离 Stitch 使用。
- 怎么巡查：每月看 plugins/stitch-utilities 和 stitch-design 下的 SKILL.md；X 中文圈 2026-11 中旬有大量转发，注意区分搬运和实测。
- 质量信号：Google Labs 官方仓库；2026-11-21 精读 enhance-prompt、design-md，浏览 react-native 相关检查清单。（last_verified 2026-11-21）

### Nutlope：Hallmark（网页设计 skill）

- 链接：[https://github.com/Nutlope/hallmark](https://github.com/Nutlope/hallmark)
- 类型：github_repo　领域：design　优先级：偶尔　建议频率：monthly
- 为什么值得看：主体是网页落地页设计流程（主题、版式、首屏审查），和 App 关系弱；值得摘的是 references/review-finish.md 的「不知情审查者」收尾审查（第一词给结论、最多八条、只审不修，含 App 屏幕条款）和 interaction-and-states.md 的状态规则（Undo over confirm 等）。
- 怎么巡查：每月看 skills/hallmark/references/ 的提交；只跟审查和交互状态相关文件。
- 质量信号：2026-11-18 记录约 5.7 万 star；2026-11-21 精读 review-finish.md、interaction-and-states.md。MIT，Hallmark contributors。（last_verified 2026-11-21）

### Leonxlnx：taste-skill

- 链接：[https://github.com/Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
- 类型：github_repo　领域：design、marketing　优先级：偶尔　建议频率：monthly
- 为什么值得看：定位公司官网/落地页，和 App 设计关系弱；references/copy-tells.md 的网站文案「AI 味」词表和「每条禁令旁配一个正面做法」原则可用于 App 的营销类文案。
- 怎么巡查：每季度看 references/copy-tells.md 是否更新（文件自注明 tells 会随模型代际变化）。
- 质量信号：2026-11-18 记录约 11.8 万 star；2026-11-21 精读 copy-tells.md。（last_verified 2026-11-21）

### AI 出图/建站工具官方提示指南（Figma Make、v0、Lovable、Bolt、Claude Design）

- 链接：[https://www.figma.com/blog/7-tips-for-using-figma-make-credits-more-efficiently/](https://www.figma.com/blog/7-tips-for-using-figma-make-credits-more-efficiently/)；其它链接：[https://www.figma.com/blog/designer-framework-for-better-ai-prompts/](https://www.figma.com/blog/designer-framework-for-better-ai-prompts/)；[https://vercel.com/blog/how-to-prompt-v0](https://vercel.com/blog/how-to-prompt-v0)；[https://docs.lovable.dev/prompting/prompting-one](https://docs.lovable.dev/prompting/prompting-one)；[https://support.bolt.new/design-system/use-design-system](https://support.bolt.new/design-system/use-design-system)；[https://support.claude.com/en/articles/14604416-get-started-with-claude-design](https://support.claude.com/en/articles/14604416-get-started-with-claude-design)
- 类型：official_docs　领域：design、prompt_engineering　优先级：偶尔　建议频率：quarterly
- 为什么值得看：各家官方都在教同一件事：第一条 prompt 写成简报（目标、使用场景、元素、行为、约束），之后每条只写差量并写明「什么不能动」；Bolt 给了对照设计系统全项目审计的 prompt。适合补充需求对齐和范围控制类条目。
- 怎么巡查：每季度搜一次 Figma 博客 Make 标签、v0 博客、Lovable/Bolt 文档的 prompting 页面；Stitch 官方 prompting 页（stitch.withgoogle.com/docs/learn/prompting/）2026-11-21 抓取为空，下次用浏览器再试。
- 质量信号：均为官方博客/文档，Figma 两篇有作者署名（Alexia Danton 2026-05-22，Greg Huntoon 2026-01-05），v0 文章署名 Esteban Suárez。（last_verified 2026-11-21）

### 枯白 Kubai @Kubai087（《999 个小技巧，让你 Vibe 的产品更有质感》）

- 链接：[https://x.com/Kubai087](https://x.com/Kubai087)；其它链接：[https://x.com/Kubai087/status/2122917792903209141](https://x.com/Kubai087/status/2122917792903209141)
- 类型：x_account　领域：design、mobile、chinese_community　优先级：常看　建议频率：weekly
- 为什么值得看：App Icon 设计师的日更设计教程，每期讲一个界面细节（圆角、等待状态、连续性、浮层选型、控件选型、动效节奏等），多数附可直接复制的诊断型 prompt：先盘点、出决策表、等确认再改，并要求只改我的代码和组件。中文社区里对 App 设计最实用的来源之一。
- 怎么巡查：每周扫 from:Kubai087 (999 OR Prompt OR 提示词)；prompt 通常在同串的自回复里，用 conversation_id 找作者本人的回复并读全文。作者 2026-11-18 上线了教程合集站 Vibe Design Tips（帖内短链，未打开核实）。
- 质量信号：2026-11-21 核实：去 AI 味 5 条指令帖约 429 赞 / 507 收藏；连续性 015 期约 385 赞 / 466 收藏；液态玻璃 010 期约 2039 赞 / 2732 收藏。（last_verified 2026-11-21）

## 按领域索引

### 开发 / Agent coding（重点）

- 必看 · [Anthropic Claude Code Best Practices](https://code.claude.com/docs/en/best-practices)
- 必看 · [Anthropic Claude Code Prompt Library](https://code.claude.com/docs/en/prompt-library)
- 必看 · [How Anthropic teams use Claude Code](https://claude.com/resources/articles/how-anthropic-teams-use-claude-code)
- 必看 · [Anthropic Claude Cookbooks](https://github.com/anthropics/claude-cookbooks)
- 必看 · [Anthropic Official Agent Skills](https://github.com/anthropics/skills)
- 必看 · [OpenAI Codex Prompting Guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide)
- 必看 · [OpenAI Cookbook](https://cookbook.openai.com)
- 必看 · [ChatGPT Learn: Prompting and Codex Best Practices](https://learn.chatgpt.com/docs/prompting)
- 必看 · [Google Gemini Prompt Gallery](https://ai.google.dev/gemini-api/prompts)
- 必看 · [AGENTS.md 开放格式](https://agents.md/)
- 必看 · [数字生命卡兹克 @Khazix0918](https://x.com/Khazix0918)
- 常看 · [Simon Willison's Weblog](https://simonwillison.net/)
- 常看 · [Geoffrey Huntley：Ralph 循环](https://ghuntley.com/ralph/)
- 常看 · [Matt Pocock / AI Hero Skills](https://www.aihero.dev/skills)
- 常看 · [HumanLayer: Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- 常看 · [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
- 常看 · [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
- 常看 · [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- 常看 · [Boris Cherny @bcherny](https://x.com/bcherny)
- 常看 · [陈成 @chenchengpro](https://x.com/chenchengpro)
- 常看 · [宝玉 baoyu.io / @dotey / baoyu-skills](https://baoyu.io/blog/why-i-cant-write-good-prompts-with-ai-and-templates)
- 常看 · [枯白 Kubai @Kubai087（《999 个小技巧，让你 Vibe 的产品更有质感》）](https://x.com/Kubai087)
- 常看 · [YC: State-Of-The-Art Prompting For AI Agents](https://www.ycombinator.com/library/MS-state-of-the-art-prompting-for-ai-agents)
- 偶尔 · [x1xhlol/system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools)
- 偶尔 · [Andrej Karpathy @karpathy](https://x.com/karpathy)
- 偶尔 · [a16z 相关 AI/agent 文章](https://a16z.com/context-is-king/)

### 通用 prompt 工程

- 必看 · [Anthropic Prompting Best Practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- 必看 · [Anthropic Claude Cookbooks](https://github.com/anthropics/claude-cookbooks)
- 必看 · [OpenAI Prompt Engineering Guide](https://developers.openai.com/api/docs/guides/prompt-engineering)
- 必看 · [OpenAI Cookbook](https://cookbook.openai.com)
- 必看 · [ChatGPT Learn: Prompting and Codex Best Practices](https://learn.chatgpt.com/docs/prompting)
- 必看 · [Google Gemini Prompt Design Strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)
- 必看 · [Google Gemini Prompt Gallery](https://ai.google.dev/gemini-api/prompts)
- 必看 · [Lenny's Newsletter](https://www.lennysnewsletter.com/)
- 常看 · [Hamel Husain Blog](https://hamel.dev/)
- 常看 · [宝玉 baoyu.io / @dotey / baoyu-skills](https://baoyu.io/blog/why-i-cant-write-good-prompts-with-ai-and-templates)
- 常看 · [Every.to 写作与 prompt 文](https://every.to/p/how-to-make-ai-write-less-like-ai)
- 常看 · [YC: State-Of-The-Art Prompting For AI Agents](https://www.ycombinator.com/library/MS-state-of-the-art-prompting-for-ai-agents)
- 常看 · [DAIR.AI Prompt Engineering Guide](https://www.promptingguide.ai/)
- 常看 · [Learn Prompting](https://learnprompting.org/)
- 偶尔 · [x1xhlol/system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools)
- 偶尔 · [Andrej Karpathy @karpathy](https://x.com/karpathy)
- 偶尔 · [a16z 相关 AI/agent 文章](https://a16z.com/context-is-king/)

### 产品

- 必看 · [ChatGPT Learn: Prompting and Codex Best Practices](https://learn.chatgpt.com/docs/prompting)
- 必看 · [Lenny's Newsletter](https://www.lennysnewsletter.com/)
- 常看 · [HubSpot Loop Book Prompt Library](https://www.hubspot.com/loop-book-prompt-library)
- 常看 · [Microsoft Copilot Prompt Gallery](https://www.adoption.microsoft.com/en-us/copilot/prompt-gallery/)
- 偶尔 · [x1xhlol/system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools)
- 偶尔 · [a16z 相关 AI/agent 文章](https://a16z.com/context-is-king/)

### 设计 / UI

- 必看 · [Anthropic 各部门如何用 Claude（官方系列）](https://claude.com/resources/articles/how-anthropic-uses-claude-marketing)
- 必看 · [Anthropic 官方前端设计：frontend-design skill + Frontend Aesthetics cookbook](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)
- 必看 · [OpenAI：Designing delightful frontends with GPT-5.4（含 frontend-skill）](https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4)
- 必看 · [Emil Kowalski：emilkowalski/skills + aiforui.dev + @emilkowalski](https://github.com/emilkowalski/skills)
- 必看 · [Expo 官方 skills（expo/skills）](https://github.com/expo/skills)
- 常看 · [Jakub Krehel：jakubkrehel/skills + Interfaces 杂志](https://github.com/jakubkrehel/skills)
- 常看 · [Vercel Web Interface Guidelines + web-design-guidelines skill](https://github.com/vercel-labs/web-interface-guidelines)
- 常看 · [Paul Bakaus：Impeccable（pbakaus/impeccable）](https://github.com/pbakaus/impeccable)
- 偶尔 · [Garry Tan：gstack 的设计类 skill（design-review 等）](https://github.com/garrytan/gstack)
- 常看 · [花叔：huashu-design（中文设计 skill）](https://github.com/alchaincyf/huashu-design)
- 偶尔 · [Tommy Geoco @designertom](https://x.com/designertom)
- 常看 · [Julien Thibeaut（@Ibelick）：ibelick/ui-skills](https://github.com/ibelick/ui-skills)
- 偶尔 · [nextlevelbuilder：ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- 偶尔 · [Google Labs：stitch-skills](https://github.com/google-labs-code/stitch-skills)
- 偶尔 · [Nutlope：Hallmark（网页设计 skill）](https://github.com/Nutlope/hallmark)
- 偶尔 · [Leonxlnx：taste-skill](https://github.com/Leonxlnx/taste-skill)
- 偶尔 · [AI 出图/建站工具官方提示指南（Figma Make、v0、Lovable、Bolt、Claude Design）](https://www.figma.com/blog/7-tips-for-using-figma-make-credits-more-efficiently/)
- 常看 · [枯白 Kubai @Kubai087（《999 个小技巧，让你 Vibe 的产品更有质感》）](https://x.com/Kubai087)

### 运营

- 必看 · [Anthropic 各部门如何用 Claude（官方系列）](https://claude.com/resources/articles/how-anthropic-uses-claude-marketing)
- 常看 · [Shopify: AI Prompts for Ecommerce](https://www.shopify.com/blog/ai-prompts)
- 常看 · [YC: State-Of-The-Art Prompting For AI Agents](https://www.ycombinator.com/library/MS-state-of-the-art-prompting-for-ai-agents)
- 常看 · [Microsoft Copilot Prompt Gallery](https://www.adoption.microsoft.com/en-us/copilot/prompt-gallery/)

### 增长与营销

- 必看 · [Google Gemini Prompt Gallery](https://ai.google.dev/gemini-api/prompts)
- 必看 · [Anthropic 各部门如何用 Claude（官方系列）](https://claude.com/resources/articles/how-anthropic-uses-claude-marketing)
- 必看 · [Lenny's Newsletter](https://www.lennysnewsletter.com/)
- 常看 · [Shopify: AI Prompts for Ecommerce](https://www.shopify.com/blog/ai-prompts)
- 常看 · [HubSpot Loop Book Prompt Library](https://www.hubspot.com/loop-book-prompt-library)

### 写作 / 内容

- 必看 · [Google Gemini Prompt Gallery](https://ai.google.dev/gemini-api/prompts)
- 常看 · [宝玉 baoyu.io / @dotey / baoyu-skills](https://baoyu.io/blog/why-i-cant-write-good-prompts-with-ai-and-templates)
- 常看 · [Shopify: AI Prompts for Ecommerce](https://www.shopify.com/blog/ai-prompts)
- 常看 · [HubSpot Loop Book Prompt Library](https://www.hubspot.com/loop-book-prompt-library)
- 常看 · [Every.to 写作与 prompt 文](https://every.to/p/how-to-make-ai-write-less-like-ai)
- 常看 · [Microsoft Copilot Prompt Gallery](https://www.adoption.microsoft.com/en-us/copilot/prompt-gallery/)

### 研究与分析

- 必看 · [Anthropic Claude Cookbooks](https://github.com/anthropics/claude-cookbooks)
- 必看 · [OpenAI Cookbook](https://cookbook.openai.com)
- 必看 · [Google Gemini Prompt Gallery](https://ai.google.dev/gemini-api/prompts)
- 必看 · [Anthropic 各部门如何用 Claude（官方系列）](https://claude.com/resources/articles/how-anthropic-uses-claude-marketing)
- 常看 · [Simon Willison's Weblog](https://simonwillison.net/)
- 常看 · [Hamel Husain Blog](https://hamel.dev/)

### 法务

- 必看 · [Anthropic 各部门如何用 Claude（官方系列）](https://claude.com/resources/articles/how-anthropic-uses-claude-marketing)

### 财务

- 必看 · [Anthropic 各部门如何用 Claude（官方系列）](https://claude.com/resources/articles/how-anthropic-uses-claude-marketing)

### 销售与商务拓展

- 必看 · [Anthropic 各部门如何用 Claude（官方系列）](https://claude.com/resources/articles/how-anthropic-uses-claude-marketing)

### 教育

- 偶尔 · [anthropics/k12-teacher-skills](https://github.com/anthropics/k12-teacher-skills)

### 中文社区（交叉索引）

- 必看 · [数字生命卡兹克 @Khazix0918](https://x.com/Khazix0918)
- 常看 · [陈成 @chenchengpro](https://x.com/chenchengpro)
- 常看 · [宝玉 baoyu.io / @dotey / baoyu-skills](https://baoyu.io/blog/why-i-cant-write-good-prompts-with-ai-and-templates)

## 未列入或未能充分验证

这些名字在任务或常识里常被提起，但本次核实后**不作为定期巡查源**（或缺稳定公开 URL，或几乎不发布可复制 prompt）。以后若发现稳定来源再补。

- **yetone（@yetone）**：账号已核实（avante.nvim 作者，约 10.6 万关注），但未找到他稳定公开的 prompt 库或「常用 prompt」专栏，暂不列入。
- **lauren / poteto（@poteto）**：账号已核实，但未找到可供巡查的公开 prompt/skill 库；不凭印象列入。
- **卡兹克公众号「数字生命卡兹克」**：X 简介中有此名称，没有核实到稳定、可公开打开的文章 URL（微信链接不稳定），暂不以公众号为入口，只巡查 X 和 GitHub。
- **Notion 官方 prompt 库**：未找到 Notion 官方公开的可复制 prompt 图书馆；只有第三方转述「Notion 如何用 AI」，来源不够硬。
- **Figma 官方 prompt 库**：未找到 Figma 官方提示库。社区插件或客户故事不能代替官方库。设计领域以 Anthropic 设计师 Nate Parrott 那篇和上方「设计 / UI 专项」里的来源为准（2026-11-18 更新）。
- **a16z 官方 prompt 库**：没有找到。只有 context/agent 方向的评论文章，已放入「偶尔」。
- **ComposioHQ/awesome-claude-skills 及类似超大 skill 倾销仓库**：星标很高，但体量过大、质量不齐，不符合宁缺毋滥；需要时通过 awesome-claude-code 的策展条目点进去，不整库巡查。
- **GitHub 上大量「CLAUDE.md / AGENTS.md」模板仓库**：用宽泛关键词搜索会被无关高星仓库淹没；只跟官方、已核实作者和 awesome 策展，避免按星标盲收。
- **设计类 skill（2026-11-21 更新）**：taste-skill、hallmark、ui-ux-pro-max-skill、stitch-skills、ibelick/ui-skills 已于 2026-11-21 精读相关文件并列入上方「设计 / UI 专项」（均为偶尔/常看，只跟与 App 设计相关的文件）。仍未收的部分：hallmark 的 Floor 和主题体系（网页落地页，和 anthropic、impeccable 条目重叠）、taste-skill 的主体规则（只针对公司官网）、stitch-skills 中必须接 Stitch MCP 的 skill（含 React Native 转换）、ui-ux-pro-max 的搜索脚本和 CSV 风格库。
- **Rauno Freiberg、Paco Coursey**：仍没有找到他们公开的、可巡查的 agent prompt 或 skill 合集（Paco 出现在 Vercel 规范的致谢名单里）。v0 和 Lovable 的官方提示指南已于 2026-11-21 读过，并入上方「AI 出图/建站工具官方提示指南」。Google Stitch 官方 prompting 页（stitch.withgoogle.com/docs/learn/prompting/）抓取内容为空，未读到。Cursor 的 Design Mode（cursor.com/docs/agent/design-mode，在页面上点选/标注元素）是工具功能不是 prompt，只读了搜索摘要，不列入。
- **X 上的设计类推荐帖（2026-11-21）**：大量「N 个设计 skill 推荐」「286 个 prompt 网站」类清单帖（中英文都有，含 Stitch / Hallmark / Impeccable 的搬运介绍）只列链接、没有可复用的 prompt，不列入；@MengTo 的 three.js / 3D 落地页工作流多为视频，prompt 在外链里，和移动端无关，不列入。

## 维护

更新来源时同时改 `sources.md` 和 `sources.jsonl`（一行一个来源）。`last_verified` 用 America/Los_Angeles 日期。不要改同目录下其它任务正在写的 `README.md`、`entries/`、`pushes/`，除非只在 README 末尾追加指向本文件的一行。
