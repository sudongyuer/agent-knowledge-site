# Coding-Agent Prompt 库

给冻鱼用的 coding agent（Claude Code / Codex 等）常用 prompt 收藏。只收真实读到的内容，每条都标原文链接和作者。

## 目录结构
```
prompt-library/
├── README.md          # 本文件：结构、格式、去重规则、标签
├── index.jsonl        # 每条一行，方便检索/去重（由 scripts/build_index.py 从 entries 生成）
├── entries/<id>.md    # 每条 prompt 一个文件
├── pushes/            # 每次推送一个文件，记录推了哪些 id
└── scripts/build_index.py  # 改完 entries 后运行：python3 scripts/build_index.py
```

## 条目格式（entries/<id>.md）
YAML frontmatter：
```yaml
id: kz-root-cause-first-principles   # = 文件名，来源前缀 + 英文短名
title: 中文标题
tags: [找根因]
sources:                              # 原文链接 + 作者，可多条
  - url: https://...
    author: ...
variants: []                          # 合并进来的同思路其他版本（一句话 + 作者）
added: 2026-11-17
status: active                        # active / niche（小众场景）/ deprecated
```
正文固定 5 段：
1. **解决什么问题**：一句话说清场景；术语第一次出现用大白话解释。
2. **Prompt**：代码块。先放原文（中文就保留中文，英文附中文大意），再视情况放“增强版/通用版”——增强版一律标明“本库整理，非原文”。
3. **已知坑 & 评论区改进**：只写真实读到的评论，带作者和链接；本库自己的提醒标“本库提醒”。
4. **来源**：markdown 链接 + 作者。
5. **标签**。

id 前缀：`kz-` 卡兹克原帖；`cc-` 陈成（@chenchengpro）；`anthropic-` Anthropic 官方文档或官方实践文章；`shopify-` Shopify 官方；`lenny-` Lenny's Newsletter 及文中署名的作者；`cmt-` 评论区/转发里网友给出的新 prompt。
设计板块新增前缀（2026-11-18）：`openai-` OpenAI 官方文档/博客/Cookbook；`emil-` Emil Kowalski（emilkowalski/skills 与其博客、X）；`jakub-` Jakub Krehel（jakubkrehel/skills）；`vercel-` Vercel 官方仓库；`expo-` Expo 官方 skills；`impeccable-` Paul Bakaus 的 Impeccable；`gstack-` Garry Tan 的 gstack；`huashu-` 花叔 huashu-design；`geoco-` Tommy Geoco（@designertom）。
设计板块新增前缀（2026-11-21）：`figma-` Figma 官方博客（同条合并 v0 / Lovable / Claude Design / Stitch 的官方提示指南）；`uupm-` nextlevelbuilder 的 ui-ux-pro-max-skill；`uiskills-` ibelick/ui-skills（Julien Thibeaut）；`hallmark-` Nutlope/hallmark；`kubai-` 枯白 Kubai（@Kubai087）的《999 个小技巧》系列。

## 去重规则
1. 新条目先查 `index.jsonl` 的 title/tags 和 entries 正文，看是否已有同一思路。
2. 同一思路只留一条主条目（选最完整、最好用的版本），其他版本写进主条目的 `variants`，并在正文“变体”里给原文和出处。
3. 思路相近但用法明显不同的（例如“先问再出 3 版方案” vs “先读代码列改动清单”），分成两条，正文互相链接。
4. 评论区对某条的修正，合并进那一条的“已知坑”，不单独建条目；评论区给出的全新 prompt 才单独建 `cmt-` 条目。
5. 没有原话的不写成引用；推测或本库自己的话必须标出来。

## 标签列表
| 标签 | 含义 |
|---|---|
| 找根因 | 查 bug 的本质原因 |
| 需求对齐 | 动手前对齐目标、范围、验收标准 |
| 方案评审 | 评估、挑战、对比方案 |
| 重构/降复杂度 | 清理历史包袱、降低理解成本 |
| 性能 | 卡顿、速度、包体积 |
| 复盘沉淀 | 复盘并沉淀成规则/自动化/Skill/文档 |
| 验证/自审 | 要证据、自我审查、对照规格检查 |
| 代码审查 | 审 PR / diff |
| 执行/交付 | 实现、提交、合并的流程 |
| 范围控制 | 防止 agent 越界乱改 |
| 调研 | 搜现成方案、跨领域借鉴 |
| 自主运行 | 无人值守、长时间自己跑 |
| 文档输出 | 输出报告/文档 |
| UI | 界面、交互、视觉、演示 |
| 运营 | 客服、内部流程、日常事务（非开发） |
| 营销 | 文案、获客、商品或品牌宣传 |
| 产品 | 产品方案、PRD、GTM |
| 设计 | 设计板块总标签：视觉/交互方案、审美、设计还原与审查（与「UI」可并用：UI 偏界面实现，设计偏出方案、remix、品味） |
| 视觉风格 | 设计子标签：配色、字体、布局，去「AI 味」，参考图/设计系统 |
| 动效 | 设计子标签：动画、缓动、时长、手势、转场 |
| 交互细节 | 设计子标签：状态（空/错/加载）、触控、表单、可访问性等细节 |
| 设计还原 | 设计子标签：按 Figma/截图/现有界面精确实现 |
| 设计审查 | 设计子标签：设计走查、对照规范挑错、截图自查迭代 |
| 移动端 | 设计子标签：iOS/Android/React Native/Expo、原生体验 |
| 界面文案 | 设计子标签：按钮、报错、空状态、确认弹窗、开关说明等界面里的文字（与「营销」区分：营销是宣传文案） |
| 财务 | 报表、口径、数字与叙事是否一致 |

## 怎么用（评论区里读到的共识）
- **别每次全念一遍，按场景挑 2–3 条。** 十句全上，“改个按钮都要先开一轮战略研讨会，两天就能把你每周额度烧穿”（[@LanzhiAI](https://x.com/LanzhiAI/status/2122349831146606972)）；“我最多同时用三条，多了反而顾不过来”（[@limulus6](https://x.com/limulus6/status/2122297598396821595)）。@LanzhiAI 的建议：日常写需求用第 2 句；架构重构才用第 3、6 句；第 10 句写进 Skill。
- **按场景选（@huhood35 让 AI 整理的场景表，[原帖](https://x.com/huhood35/status/2122548110593548396)）**：根因不清/反复出问题→第一性原理；需求模糊→先提问再给 3 版；需求本身可能有问题→质疑问题定义；大改动/架构→推演二阶三阶影响；方案基本确定→红队找反例；老项目/重构→分析 Git 历史；代码难维护→新人视角；性能问题→分析慢的 PR；反复踩坑→复盘沉淀。
- **素材比追问强度重要。** “提示词决定它想多深，素材决定它想得对不对”——给它能跑的测试、真实日志、线上数据（[@Shawnbysolgrid](https://x.com/Shawnbysolgrid/status/2122638521047425342)）。
- **反复要说的规则，写进规则文件；必须遵守的，做成 hook/lint。** 见 [kz-retro-to-rules](entries/kz-retro-to-rules.md)。
- **模型越强，有些话越不用说。** 有评论认为“现在的模型并不需要这样 prompt”（[@rae1101x](https://x.com/rae1101x/status/2122597589606654144)）；Anthropic 官方文档也列了“可以不再说的话”，例如 think hard、“keep going / don't be lazy”（[来源](https://code.claude.com/docs/en/best-practices)）。

## 来源阅读记录
- 2026-11-17：卡兹克原帖全文（10 条）；原帖回复约 200 条（按 conversation_id 翻完全部分页）；原帖的引用转发（quote）全部分页；陈成 @chenchengpro 引用转发正文（9 条）、其评论区 11 条回复、其 2 条引用转发；Anthropic《Best practices for Claude Code》官方文档。
- 图片里的内容读不到，没有收录（例如 @AAAce4518 的“睡前指令”截图、@X_GavinXu 的“豆包整合版”）。
- 2026-11-17：从巡查候选入库（非开发）：Shopify 客服兜底、Shopify 商品描述模板、Lenny 文中 Vybhav / Rishi 的产品方案与 PRD 挑刺、Nate Parrott 多方案 Remix、Alice Fong 叙事一致性检查（原文为叙述，代码块为本库整理）。
- 2026-11-18：设计板块扩充（13 条新条目 + remix 条目挂 3 个变体）。读取：anthropics/skills 的 frontend-design SKILL.md；Anthropic Cookbook《Frontend Aesthetics》与博客《Improving frontend design through Skills》；OpenAI《Designing delightful frontends with GPT-5.4》（含 frontend-skill 全文）、《Frontend with GPT-5》、GPT-5 Prompting Guide 前端段；emilkowalski/skills（learn-taste、animate-expo、mobile-native、prototype、gestures、break-ui）与博文《Agents with Taste》；Emil 在 X 上的高收藏帖及 /learn-taste 评论区；Gui Vilela「别用通用设计 skill」帖及评论区；Tommy Geoco 装 skill 前检查帖；pbakaus/impeccable（README、SKILL.src.md、craft-floor、ios.md、adapt.native.md）；expo/skills 的 expo-native-ui；vercel-labs/web-interface-guidelines（README、command.md）；garrytan/gstack 的 design-review；jakubkrehel/skills 的 build-design；alchaincyf/huashu-design 的 SKILL.md 与 polish-loop.md。
- 2026-11-21：设计板块第二轮扩充（20 条新条目 + 4 条旧条目挂变体，共 61 条）。读取：expo/skills 的 expo-design-system（SKILL.md、audit.md、native-slop.md）、expo-animation、expo-data-fetching、expo-web-to-native；emilkowalski/skills 的 review-animations、apple-design；jakubkrehel/skills 的 interface-review、better-writing、explain-interface；ibelick/ui-skills 的 improve-ui、create-design-md、fixing-accessibility、fixing-motion-performance、baseline-ui；nextlevelbuilder/ui-ux-pro-max-skill 的 pro-rules.md 与 SKILL.md；Nutlope/hallmark 的 review-finish.md、interaction-and-states.md 等；Leonxlnx/taste-skill 的 copy-tells.md；google-labs-code/stitch-skills 的 enhance-prompt、design-md；Figma 博客两篇（Alexia Danton、Greg Huntoon）；Vercel《How to prompt v0》；Lovable、Bolt 文档；Claude Design 帮助中心；X 上 Emil Kowalski 两条设计系统帖及评论区、Emil「animate from their trigger」帖及评论区、Tony Dinh 设计系统帖及评论区、@dr_cintas DESIGN.md 帖、@MystiqueMide 与 @aryanXmahajan 的前端流程帖、枯白 Kubai《999 个小技巧》004/009/015/017/020 期及其串内 prompt 回复和「去 AI 味 5 条指令」帖。
- 2026-11-21 读不到、未收录：Emil 演示原点动画的视频；Tony Dinh 帖的配图；@dr_cintas 贴在图片里的 DESIGN.md 模板；枯白 Kubai 各期的演示视频；Google Stitch 官方 prompting 页面（抓取为空）。

## 巡查来源清单
- 高质量来源清单（按领域与优先级，供每周巡查）：[sources.md](sources.md)，机器可读副本为 [sources.jsonl](sources.jsonl)。
