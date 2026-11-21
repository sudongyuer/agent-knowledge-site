---
title: "工厂蓝图 v2 研究笔记"
date: 2026-11-17
tags:
  - research-notes
  - software-factory
  - v2
---

# 工厂蓝图 v2 研究笔记（2026-11-17）：从想法到上线 + UI/UX
Page（同一份）: https://cursor.com/canvas/store-a29ce92a-6fc0-47dd-87ed-19add9a31dea/b3de5cb1-d420-4bb9-ae14-3313844a917e

## 两句话核实
- Cognition「界面好不好看仍是人的强项」：原文找不到这句。最接近的是 Devin's 2025 Performance Review（Cognition Team, 2025-11-14, https://cognition.ai/blog/devin-annual-performance-review-2025）："in visual design, Devin needs specifics like component structure, color codes, and spacing values. When outcomes aren't straightforwardly verifiable, additional human review is necessary." 意思是：视觉设计要人给具体规格；结果不容易自动验证时要人审。testing-development（Ido Pesok, 2026-05-29）与 AIE 演讲（2026-11-12）中未找到审美相关表述。
- Julius「审美类改动 CI 判断不了」：不是 Julius 原话，是队友「agent 工程实践」的归纳（transcript pos 191「教训是」）。Julius 原帖只有：2026-10-20 "tuning the loop and it's let a few bad PRs slip by"（x.com/jullerino/status/2112472177463460047）；2026-10-26 "theo was mad at my ui regressions last weekend"（x.com/jullerino/status/2114567878829883488）。

## 起步
- OpenAI harness（Ryan Lopopolo, 2026-02-11）：空仓库，首个 commit 2025-08 末；脚手架（结构、CI、格式、包管理、框架）由 Codex 按少量模板生成，AGENTS.md 也由 Codex 写；早期慢是因为环境欠规格；app 每个 worktree 可启动；CDP + DOM 快照/截图/导航 skill；每 worktree 临时可观测栈（LogQL/PromQL）；AGENTS.md ~100 行当地图，docs/ 是记录系统；exec-plans 入库；分层架构 Types→Config→Repo→Service→Runtime→UI 用自定义 lint 强制，错误信息写修复指引；"taste invariants"；人：排优先级、把用户反馈翻成验收标准、验证结果；agent 可端到端：复现 bug、录失败视频、修、驱动应用验证、录修复视频、开 PR、处理反馈、需要判断时才升级、合并（仅限该仓库，作者说不要假设可推广）。
- StrongDM principles/techniques 页面：Seed（PRD/几句话/截图/已有代码）→ 验证 harness（端到端、尽量接近真实）→ 反馈；holdout 场景通过才停；Shift Work：把交互式工作和完整规格的工作分开；Gene Transfusion：给 agent 具体范例；Attractor 仓库用 NLSpec（自然语言规格）。
- OpenAI Sora Android（Patrick Hum, RJ Marsan, 2025-12-12）：4 名工程师，28 天（10-08 到 11-05，2025），约 50 亿 token，约 85% 代码由 Codex 写，99.9% 无崩溃率（均自述）；人手工打地基：架构、模块化、DI、导航、认证、基础网络，再手写几个代表性功能；"Build the Sora Android app based on the iOS code. Go" 被放弃——能跑但体验差；Codex 看不到 app 运行，不能感到滚动不对、流程困惑，"Only our team could cover these experiential tasks"；计划流程：先让 Codex 总结数据流→人纠正→迷你设计文档→逐步执行；计划存文件；审查时对照计划；瓶颈变成做决定、给反馈、集成。
- Anthropic harness design（Prithvi Rajasekaran, 2026-03-24）：planner 把 1-4 句扩成产品规格（高层，含用 frontend design skill 生成的视觉语言）；generator/evaluator 每个 sprint 先谈「sprint 契约」；自评偏乐观，分离评审更可调；前端四标准：Design quality / Originality / Craft / Functionality，few-shot 校准，Playwright MCP 实际操作页面，5-15 轮，最长 4 小时；作者常更喜欢中间某一轮。
- Kent C. Dodds 工作坊页（AIE Code Summit 2026-11-10）：autopilot → invariants、决策记录、primitives catalog、AGENTS.md 是路由；审查用 PR 模板（意图、单向/双向门、系统图）"review systems instead of code"；自述「没读过产品 1% 的代码，大多数 PR 由 agent 写和合并」；feature flag 要有 owner、指标、移除条件。
- T3 Code AGENTS.md：不可妥协项（开放、性能、远程、多端 web/desktop/mobile RN），Theo 的口味段落（简单系统、反对范围蔓延）。

## 需求/计划
- Boris Cherny 线程第 6 条（2026-01-02）：多数会话从 Plan 模式开始，来回改到满意再切 auto-accept，常能一次做完；HN 评论（2025-12-13）：Plan 2-3 倍、给验证 2-3 倍。Claude Code permission-modes 文档：Plan 模式只读不改源码，批准后才编辑。
- pstack 04-design：/architect 两种形状；/arena 多候选+跨厂商评审；先原型后计划；README-first；pstack 无规划 skill，设计定了才写计划；multi-phase plan：每个 PR 自带验证，测试全绿不算证明。prototype playbook：决定先于原型；变体放一个切换器；截图对比；原型是一次性的。figure-it-out：可证伪完成条件、先建验证 harness、多小时任务留一个检查点。experience-first：少而精、先用一次性 HTML 原型、细节（过渡、对齐、间距、反馈、错误态）。
- Anthropic code review（2026-10-15）：人负责「要不要做」「方向、品味和范围」、风险代码、读证据；UI 改动对照设计规范检查；给 Claude「对照设计稿的截图」。

## 设计/审美
- Google DESIGN.md（blog 2026-04-21；repo google-labs-code/design.md）：YAML token + Markdown 理由；lint（断引用、WCAG 对比度）和 diff。
- Impeccable（Paul Bakaus；repo pbakaus/impeccable；博文 2026-07-03）：PRODUCT.md + DESIGN.md；critique/audit；62 条确定性规则、不用 LLM；设计 hook 在 agent 宣布完成前扫描编辑过的 UI 文件；live 模式在浏览器里比较变体；支持原生 iOS/Android 屏（skill 描述）。
- Vercel Web Interface Guidelines：AGENTS.md MUST/SHOULD/NEVER（例：移动端点击目标 ≥44px，尊重 prefers-reduced-motion）；web-design-guidelines review skill；changelog 2026-01-12（John Phamous）。
- Emil Kowalski skills（repo emilkowalski/skills；Agents with Taste 2026-07-02）：每个界面方面一个 skill；animate-expo（RN/Expo）、mobile-native、break-ui（极端数据）、prototype（切换器）、learn-taste（把会话里的设计修正写成 DESIGN.md 规则）。
- Anthropic Improving frontend design through Skills（2025-11-12）：distributional convergence，skill 按需加载。
- yetone kill-ai-slop：33 种 AI slop 特征，扫描器不改文件；native-feel-skill：跨平台桌面原生感，75 项发版审计，明确不用于纯移动 app。magpie code-standards GUI 规则：不用原生 select、点击不滚动页面、不用彩色左边框条。
- Cognition 博客（2026-02-27）：设计系统漂移——Slack 里发截图让 Devin 迁移组件；每日审计 24 小时内合并的 PR，标出硬编码颜色、非标准间距，开 Linear 工单。

## UI 验证 / 人审
- Claude Code verification（Addy Osmani 2026-11-16）：端到端比测试重要；Web 用 Chrome 扩展、移动端用 iOS 或 Android MCP；写 verify skill；功能地图当评分标准；同一检查 3 轮失败交人。
- Cognition testing（Ido Pesok 2026-05-29）：computer use 截图/点击/录制；登录写成确定性脚本放进 testing skill；带标注截图的测试报告 + 带章节的视频，压缩空闲时间；难点：toast 截图时机、用 JS 触发状态作弊。
- T3 full-send：UI 要跑起来亲眼看，mock 测试全绿不证明体验。
- pstack 06：UI 改动在运行中的 app 里走一遍；像素级用 visual-parity（冻结基线、图像 diff、非零即失败、不准改基线/harness）。create-verification-skill：Launch/Doctor/Drive/Evidence/Cleanup + feature map。

## 移动端
- Maestro MCP（Ashish Kharche 2026-10-23）：iOS 模拟器 / Android 模拟器 / 连接的 Android 真机；list_devices/run/inspect_screen/take_screenshot；before/after；通过的路径存成 .maestro/ Flow。
- XcodeBuildMCP（现名 MobileBuildMCP，getsentry）：iOS/macOS；TOOLS.md：screenshot、snapshot_ui、tap（推荐用无障碍 id/label）、swipe、record_sim_video。
- Callstack agent-device：CLI/MCP/Node API，控制移动/网页/TV/桌面 app（设备与模拟器，本地或云端）。
- Expo Agentic CI 文档：每个 PR 在远程模拟器上由 agent 测，评论 PASS/FAIL + 录屏 + 截图 + 浏览器预览；警告：判决可能错，设为必需检查前先人读几次证据。EAS Update PR 预览：PR 评论附二维码。

## 未能获取
- Cognition「界面好不好看仍是人的强项」原句；Julius「审美类改动 CI 判断不了」原句（是队友归纳）。
- yetone X 帖子（仅关注者可见）；swyx/Latent Space 一手内容（沿用 v1）。
- 没有找到任何领先团队把「新视觉方向」的审美判断完全交给 agent 并上线的公开案例（Anthropic 的 evaluator 是研究实验）。
- Theo 本人关于新功能/UI 流程的独立长文未找到，只有 AGENTS.md、full-send、Julius 帖子。

## 页面更新（已完成）
EditCanvas 已改同一份 Page：新增第 5 部分（8 个阶段 + 8 段 prompt + 两句话核实 + 压低人审时间 + 移动端工具表 + 对等级/路线的影响）；L4a/L4b 加 UI 条件；第 3、5 步注明对应新 prompt；新增 1 个待确认问题；来源和变更记录改为第 6、7 部分；v2 新增 32 条来源；标题去掉 v1。
