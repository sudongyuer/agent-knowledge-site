---
title: "工厂蓝图 v3 研究笔记"
date: 2026-11-23
tags:
  - research-notes
  - software-factory
  - v3
---

# 工厂蓝图 v3 研究笔记（2026-11-23）：本周公开的工厂流水线
Page（同一份）: https://cursor.com/canvas/store-a29ce92a-6fc0-47dd-87ed-19add9a31dea/b3de5cb1-d420-4bb9-ae14-3313844a917e

## 收集方式
- 队友「agent 工程实践」11-18 到 11-22 的简报：本轮无法用 ReadTranscript 读队友对话（只能读自己的），改读盒子上已构建的知识站内容 /workspace/brief-1122/site/content-source/agent-practice/briefs/。「AI 前沿简报」本周产出未能获取（无可读副本）。
- 一手来源：用 webFetch 读原文；X 帖用 X 公共读取接口。

## 一手核实过的
- Runway, Building a Software Factory（Alejandro Alvarez, 2026-11-20）https://runway.com/news/engineering/building-a-software-factory ：7 站（Write / Pass CI / Review / Approve / QA / Fix breaks / Run the line）逐站交给 agent，每站「先决定怎么评判再看结果」。云端 agent 服务 10 月驱动 38% 合并 PR（6 月 0.1%）；11 月上半月抽样 100 个 agent PR，78 个无人类 commit。AI reviewer 与写代码 agent 同上下文（计划、diff、周边代码），评论线程被解决或导致改动的比例 93%（9 月 84%），重建后每次审查成本约 1/3。风险评级：独立 agent 定低/中/高，拿不准往高；低风险 AI 单独批准即可合并，中风险看仓库上限，高风险人批，迁移、CI 和部署配置、密钥、认证始终由 owner 批。陪跑：9-10 月 AI 批准的 977 个 PR 人反对 15 个（约 1.5%）；10 月中起允许仅 AI 批准合并。首次批准等待中位数 2.3h → 约 5min；仅 AI 批准合并的回滚率约 0.10%，人批准约 1/200（作者说按风险档对比后相当）。QA 循环头 4 天找到 86 个确认 bug，74 个修复、67 个经重跑验证，68/71 个修复 PR 全由 agent 写，中位修复 4.6h；11 月起每个合并必须先在自己的预览环境通过验证运行。主干告警两周约 140 次，只有 1 次叫人，中位 23 分钟转绿；生产自动回滚触发过。调度器：先只读影子模式，上线后两周派发 14,000+ 个 agent 任务、约 1,900 个 PR、排序 442 次合并。安全护栏：只读影子模式；在将要合并的那个提交上重新检查门禁；外部操作可安全重复；人介入按规则；回滚一步完成。工程师职责：找 agent 浪费精力处、清阻塞（权限、环境、预览部署）、让代码库对 agent 友好、保持度量诚实；摩擦地图（按目录比较同等大小 PR 的审查负担）+ 三种处方（清理+复用检查 / 写文档 / 测试钉住）；首次清理 23 个 PR，相关文件重复行降 16%。均为自述。
- OpenAI, How OpenAI's Performance Factory keeps ChatGPT fast（Okay Zed, Cyrus Forbes, 2026-11-19）https://openai.com/index/how-openai-performance-factory-keeps-chatgpt-fast/ ：演进六步（手工 → Codex 搭档 → 可复用 skill perf-forensics，用过去回归做 evals → 人当复制粘贴的代理 → 告警自动起云端会话 → 工厂）。四部件：可配置工作流的任务服务（config.toml 写状态、转换、哪步要工程师；每状态一份 Markdown prompt）、派活循环、云端 Codex API（服务身份、可收窄权限）、事件订阅唤醒。Regression Workflow：检测 → 找根因（agent）→ 提修复（agent）→ 审查部署（工程师）→ 验证恢复（agent）。对抗式审查：另一会话反驳诊断和修复。100 个根因建议人工评分 70% 准确。三个多月 1,700+ 调查、600+ 找到根因。修复比诊断难，架构取舍要工程师。评估：用过去事故回测，剥离泄露答案的信息，禁用记忆和事故报告，事后检查 transcript；单独评估交接摘要。每天一个 agent 扫最近运行的工具错误和权限错误，自动开修复任务。均为自述。
- Cognition, Introducing Devin Bots（2026-11-17）https://devin.ai/blog/introducing-devin-bots ：给 Bot 一个要负责的结果而非任务。Android Bot：2026-09-28 开始，44 天，1,134 个合并 PR、344,651 行 Kotlin、2,841 个截图测试、1,217 张票；人发 183 条消息（约每 6 个 PR 一条），22 天没发；多数消息是需要人决定的事（如 PR 需要安全审查）；每天 Slack 日报带录屏；应用在 Google Play 公开测试。Layout Bot：每 3 小时检查，3 周 159 个 PR，卡顿降 70%。Needs You 收件箱。工程师定义成功标准、建反馈、定独立程度（访问、可改什么、花钱和发版何时要批准）。均为自述。
- Anthropic, chaos loop（Vivek Nair, 2026-11-17）https://claude.dev/blog/chaos-loop-claude-docs-launch/ ：上线前两周 Claude Code 协调者 + 子 agent（常 11 个，峰值 30）在预发压测、故意破坏；开跑前约定难撤销的决定（schema、key 布局、文档存储方式）要问人；两条不变量；遥测覆盖每次查询；选无 GC 的运行时让信号干净。上线后 2B 请求 60 次服务端错误、无回滚、约 50 个 pod。约 $125,000 推理费，作者说可省一半；小团队估 $3,000-10,000（未实测）。五步建议。
- Mihail Eric X 帖（2026-11-21 03:51 吉隆坡时间）https://x.com/mihail_eric/status/2123866740019077553 ：只拿到开头（"Agent readiness comes first..."），其余要点（触发、编排循环、隔离沙箱、指标看每 PR 成本/周期/人工介入次数）转引自队友 11-22 简报。
- Chen & Stratton, Artificial Intelligence in the Firm（工作论文，2026-11-19 版）https://fion.ac/jellyfish.pdf ：摘要核实：445M 事件、720,542 人、655 家公司；AI 大幅增加代码产出，对最终软件产出影响小，对就业无可检测影响；代码审查成为瓶颈。具体百分比（44%、36%、14%、56%、60%）来自队友简报，未在摘要中核实，蓝图未引用。
- Thorsten Ball X 帖（2026-11-18）https://x.com/thorstenball/status/2123125155568435654 ：只拿到开头；「别逐行看 diff，先造工具」要点转引自队友 11-20 简报。
- FrontierHarness Eval v1.1（Runta, Shilin Zhu, 2026-11-17）https://runta.com/blog/introducing-frontierharness-eval-v1-1/ ：核实 64.5% 花费落在未通过的运行（52.7% 失败 + 11.8% 超时）；步数与成本秩相关 +0.51，prompt 大小、工具数、缓存命中率非主因；最划算 5 种 harness 失败运行约四分之三以最终答案结束（68% Pi 到 82% Codex CLI）。
- Bitdefender（2026-11-17）https://www.bitdefender.com/en-us/blog/labs/how-ai-agents-become-new-targets-in-github-malware-campaign ：搜索结果摘要核实 22 个恶意仓库、AGENTS.md/CLAUDE.md + session-start hook、窃取凭证并感染其他 agent 配置；细节转引队友 11-20 简报。

## 转引自队友简报（附原文链接，未逐字核实）
- Simon Willison 外部沙箱（2026-11-16）https://blog.primeradiant.com/external-sandboxes-for-coding-agents/
- backpass https://github.com/kunchenguid/backpass ；SkillOpt https://www.microsoft.com/en-us/research/blog/skillopt-agent-skills-as-trainable-parameters/
- 棘轮概念（Notion eslint-seatbelt），本版未单列来源链接
- Mani Doraisamy（2026-11-20）https://manidoraisamy.com/developer-to-architect.html

## 未能获取
- 队友对话本身（ReadTranscript 只能读自己的）；「AI 前沿简报」本周产出。
- t3code、yetone、Geoffrey Huntley、StrongDM 本周新的一手材料（搜到的都是旧内容或第三方）。
- poteto pstack 本周版本更新：只有第三方转述，未核实，蓝图未写。

## 对蓝图的改动
见蓝图第 7 部分 v3 行：新增 v3 本周新证据小节；第 9、10 步与安全补丁各附 prompt；L4a → L4b 缺口；黑灯正反证据；六个问题 v3 补充；7 个术语；13 条来源。自主等级判断不变。
