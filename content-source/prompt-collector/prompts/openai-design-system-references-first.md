---
title: 动手前先给三样东西：设计系统、参考截图/情绪板、真实内容
category: 设计
tags:
- 设计
- UI
- 视觉风格
- 设计还原
author: OpenAI Developers 博客（Designing delightful frontends with GPT-5.4）; OpenAI
  Cookbook（Frontend with GPT-5）; Gui Vilela (@guivilelaa_); MystiqueMide（@MystiqueMide）;
  Aryan Mahajan（@aryanXmahajan）
source_url: https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4
date: '2026-11-18'
id: openai-design-system-references-first
additional_sources:
- https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_frontend
- https://x.com/guivilelaa_/status/2120298976419238016
- https://x.com/MystiqueMide/status/2092374362913411474
- https://x.com/aryanXmahajan/status/2092734004521054231
variants:
- OpenAI Cookbook：附一张现有界面截图 + "Can you make a login page for this website that maintains
  the same theme"
- OpenAI frontend-skill：开工前先写 visual thesis / content plan / interaction thesis 三样
- '@MystiqueMide：最大的错误是想一次生成整个前端；AI 写第一行代码前先定设计系统、把产品规划好'
status: active
---

## 解决什么问题
让 agent 做界面前，与其用形容词（「高级」「好看」）描述，不如先喂给它三样实料：**设计系统**（design system，大白话：一套统一的颜色、字体、间距、组件规范，常写成 design tokens 设计变量）、**视觉参考**（截图或情绪板 mood board，大白话：一张拼贴的风格参考图）、**真实内容**（真实文案和数据，而不是占位文字）。OpenAI 官方指南把这几条列为「只采纳几条就从这几条开始」的快速清单。对已有产品（比如 LobeHub）做新页面时，这条比任何审美 prompt 都重要。

## Prompt
原文 1（OpenAI GPT-5.4 前端指南「Practical tips quickstart」）：
```text
1. Select low reasoning level to begin with.
2. Define your design system and constraints upfront (i.e., typography, color palette, layout).
3. Provide visual references or a mood board (i.e., attach a screenshot) to provide visual guardrails for the model.
4. Define a narrative or content strategy upfront to guide the model's content creation.
```
中文大意：1. 先用低推理档位；2. 一开始就定义设计系统和约束（字体、配色、布局）；3. 给视觉参考或情绪板（比如附一张截图），作为视觉护栏；4. 先定好叙事或内容策略，指导模型写内容。

原文 2（OpenAI Cookbook，附一张现有仪表盘截图后说的话）：
```text
Can you make a login page for this website that maintains the same theme
```
中文大意：给这个网站做一个登录页，保持同样的主题风格。（截图里的现有界面就是参考。）

原文 3（OpenAI frontend-skill 的「Working Model」，开工前先写三样）：
```text
Before building, write three things:

- visual thesis: one sentence describing mood, material, and energy
- content plan: hero, support, detail, final CTA
- interaction thesis: 2-3 motion ideas that change the feel of the page

Each section gets one job, one dominant visual idea, and one primary takeaway or action.
```
中文大意：动手前先写三样：视觉主张（一句话说清情绪、材质、能量感）；内容计划（首屏、支撑、细节、最终行动按钮）；交互主张（2–3 个改变页面感觉的动效想法）。每个区块只有一个任务、一个主视觉、一个要点或动作。（App 界面版本里，skill 要求 "Default to Linear-style restraint"：克制的层级、强排版和间距、少颜色、信息密而可读、卡片只在卡片本身就是交互时才用。）

通用版（本库整理，非原文）：
```text
做 [页面/功能]。动手前先读这些，并在回复里复述你理解的约束：
- 设计系统：[DESIGN.md / tokens 文件 / 组件库路径]，只用里面已有的颜色、字号、间距和组件；
- 视觉参考：[截图/链接]，说出你从参考里提取的布局节奏、字号层级、间距和图片处理方式；
- 真实内容：[真实文案/数据样例]，不要用占位文字。
先给我一句视觉主张和内容计划，我确认后再写代码。
```

## 已知坑 & 评论区改进
- **推理档位不是越高越好。** OpenAI 原话："For simpler websites, more reasoning is not always better. In practice, low and medium reasoning levels often lead to stronger front-end results"（简单页面用低、中档推理效果往往更好，不容易想太多）。本库提醒：这是针对 GPT-5.4 的观察，换模型要自己试。
- **浮层要单独提醒。** OpenAI 同文给了一句可直接用的约束："Keep fixed or floating UI elements from overlapping text, buttons, or other key content across screen sizes. Place them in safe areas, behind primary content where appropriate, and maintain sufficient spacing."（固定或悬浮的元素在各种屏幕尺寸下都不能盖住文字和按钮，放在安全区。）对移动端特别有用。
- **「别用通用设计 skill，用参考图」派（X，约 2200 收藏）**：Gui Vilela 原话（葡萄牙语）"Usem referências, mandem prints … Monta um bom design system pro projeto, pra IA sempre seguir os mesmos padrões"（用参考、发截图……给项目建一套好的设计系统，让 AI 一直遵守同样的规范），并点名可以从 Mobbin、Dribbble 等找参考。[原帖](https://x.com/guivilelaa_/status/2120298976419238016)
- **Agustín Ruiz（@aguscruiz）在同一讨论里的做法**：他说自己总是基于 Brave 已有的样式和设计系统用 AI，在项目核心放了一份 design.md，确保做出来的东西用现有样式；他也认同「只靠 Claude 从零设计，大概率会得到通用款」。原话："I've built a design.md file in our core that makes sure that things that get built use our preexisting styles and all."（[来源](https://x.com/aguscruiz/status/2120526372963504349)）
- **Emil Kowalski 的回应（同一讨论）**：同意通用设计 skill 的问题，所以他的 skill 不强加风格，只管小而具体的规则（比如不从 scale 0 开始动画）。见 [emil-taste-as-rules](emil-taste-as-rules.md)。[来源](https://x.com/emilkowalski/status/2120462021141434397)
- 相关：Anthropic 设计师 Nate Parrott 也建议告诉 Claude 你希望它看起来像什么（字体、颜色、情绪板），见 [anthropic-remix-liked-options](anthropic-remix-liked-options.md)。按设计稿精确还原见 [jakub-build-design-match](jakub-build-design-match.md)。

- **变体（2026-11-21 补充）：别想一次生成整个前端。** @MystiqueMide 原话："The biggest mistake people make is trying to one-shot the entire frontend. Don't. Before your AI writes one line of code, define your design system and plan the product properly."（[原帖](https://x.com/MystiqueMide/status/2092374362913411474)；帖子后半部分被截断，本库只读到这一段。）
- **400 多条回复的共识。** @aryanXmahajan 在自己一条引来 400 多条回复的帖子之后，总结回复里反复被推荐的 5 件事（原话）："Start with a real design system / Give the AI a browser so it can inspect what it built / Check desktop and mobile / Run multiple review passes / Have a human with taste make the final call"，并补充："AI makes every revision faster. It still doesn't finish the frontend in one prompt."（[原帖](https://x.com/aryanXmahajan/status/2092734004521054231)）没有设计系统时，可以先用 [uiskills-create-design-md](uiskills-create-design-md.md) 从现有代码反推一份。

## 来源
- [OpenAI：Designing delightful frontends with GPT-5.4](https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4)（含 frontend-skill 全文；博客里指向的 openai/skills GitHub 路径本次未能打开，以博客内全文为准）
- [OpenAI Cookbook：Frontend with GPT-5](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_frontend)
- [Gui Vilela @guivilelaa_ 的帖子及评论区](https://x.com/guivilelaa_/status/2120298976419238016)
- [@MystiqueMide：别一次生成整个前端](https://x.com/MystiqueMide/status/2092374362913411474) — MystiqueMide
- [@aryanXmahajan：400+ 回复后的 5 条共识](https://x.com/aryanXmahajan/status/2092734004521054231) — Aryan Mahajan

## 标签
设计、UI、视觉风格、设计还原
