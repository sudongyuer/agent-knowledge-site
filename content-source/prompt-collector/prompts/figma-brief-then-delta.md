---
title: 第一条 prompt 当设计简报写全，后面每条只写「改什么、怎么改、什么不能动」
category: 设计
tags:
- 设计
- UI
- 需求对齐
- 范围控制
author: Alexia Danton（Figma 博客）; Greg Huntoon（Figma 博客，Cooking with constraints）;
  Esteban Suárez（Vercel 博客，How to prompt v0）; Lovable 官方文档; Anthropic（Claude Design
  帮助中心）; Google Labs（stitch-skills：enhance-prompt）
source_url: https://www.figma.com/blog/7-tips-for-using-figma-make-credits-more-efficiently/
date: '2026-11-21'
id: figma-brief-then-delta
additional_sources:
- https://www.figma.com/blog/designer-framework-for-better-ai-prompts/
- https://vercel.com/blog/how-to-prompt-v0
- https://docs.lovable.dev/prompting/prompting-one
- https://support.claude.com/en/articles/14604416-get-started-with-claude-design
- https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-utilities/skills/enhance-prompt/SKILL.md
variants:
- Figma（Greg Huntoon）TC-EBC 五段式：Task / Context / Elements / Behavior / Constraints；改稿时把「不准动的东西」写进
  Constraints
- v0（Esteban Suárez）：Build [产品界面] / Used by [谁] / in [什么时刻] / to [做什么决定]，再列平台、视觉调性、布局假设
- Lovable：改动 prompt 三件套——做什么、放哪里、什么必须保持不动
- Claude Design：好 prompt 含目标、布局、内容、受众；反馈要具体、点名设计系统组件、要 2–3 个变体
- Stitch enhance-prompt：模糊需求→「DESIGN SYSTEM (REQUIRED)」+ 编号页面结构；局部改动注明 This is a targeted
  edit
status: active
---

## 解决什么问题
让 agent 从零做一个新界面（或在 Figma Make / v0 / Lovable / Claude Design 这类出图工具里迭代）时用：第一条消息把目标、使用场景、元素、交互行为和约束一次讲全；之后每条修改只描述「差量」（delta，大白话：这一轮相对上一版的变化），并明确写出哪些地方不许动，避免每改一处就把别处也改坏。

## Prompt
原文 1（Figma 博客，Alexia Danton，英文）：
```text
Treat the initial prompt as the brief, and every follow-up as a delta.
```
中文大意：把第一条 prompt 当作设计简报（brief），之后的每一条都当作差量。原文说第一条要写清目标、背景、所有关键元素、行为和约束，以及最终「做完」长什么样；后续每条写清 What should change / How it will change / What should stay the same（改什么 / 怎么改 / 什么保持不变）。顺序上先搭结构，再加行为，最后才是内容和打磨；不要把不相关的改动塞进同一条。

原文 2（Figma 博客，Greg Huntoon 的 TC-EBC 示例，英文）：
```text
Task: Build an AI-powered meal suggestion app using pantry/fridge photo inputs
Context: Home cooking assistant for households with dietary restrictions
Elements: Camera input, pantry scanner, dietary settings form, meal suggestions list, recipe cards
Behavior: User uploads photos; app scans inventory, filters by diet prefs, suggests recipes
Constraints: Mobile-first, iOS/Android, accessible UI, supports multiple household profiles
```
中文大意：任务（做一个拍冰箱照片推荐菜谱的 App）/ 背景（给有饮食限制的家庭用）/ 元素（相机输入、食材扫描、饮食偏好表单、推荐列表、菜谱卡片）/ 行为（上传照片→识别库存→按偏好过滤→推荐）/ 约束（移动优先、iOS/Android、无障碍、多家庭成员档案）。作者的改稿技巧原话："For revision prompts, I always add directions in the Constraints part of the TC-EBC prompt to make it abundantly clear what the tool should not be adjusting."（改稿时，我总在 Constraints 里写明工具不该动什么。）他还建议给 Figma 帧而不是截图。

原文 3（v0 官方博客模板，英文）：
```text
Build [product surface: components, data, actions].
Used by [who],
in [what moment],
to [what decision or outcome].
Constraints:
- platform / device
- visual tone
- layout assumptions
```
中文大意：做[什么界面：组件、数据、操作]，给[谁]用，在[什么时刻]，用来[做什么决定/达成什么结果]；约束写平台设备、视觉调性、布局假设。原文理由："v0 optimizes for assumed usage. If you don't define the context of use, it will guess."（不交代使用场景，它就会自己猜。）

原文 4（Lovable 文档示例，英文）：
```text
Add a filter dropdown to the orders table so users can filter by status. Only change the orders page. Keep the table's existing styling and leave the rest of the app unchanged.
```
中文大意：给订单表加一个按状态筛选的下拉框；只改订单页；保留表格现有样式，App 其他地方不动。文档的总结："A good change prompt has three parts: what to build, where it goes, and what must stay untouched."

原文 5（Stitch enhance-prompt 的局部修改示例末行，英文）：
```text
Context: This is a targeted edit. Make only this change while preserving all existing elements.
```

通用版（本库整理，非原文；第一条写简报，之后用差量模板）：
```text
【第一条：简报】
任务：做 [界面/功能]。
使用场景：给 [谁] 用，在 [什么时刻/环境，比如单手、通勤、弱网]，用来 [完成什么决定或结果]。
元素：[列出必须出现的组件和数据]。
行为：[用户操作 → 系统反应，按步骤写]；空、加载、出错状态各怎么显示。
约束：平台 [iOS/Android/Expo]，设计系统 [DESIGN.md / theme 路径，只用已有 token 和组件]，视觉调性 [三个形容词]，不做 [明确排除的东西]。
完成标准：[可检查的条目，例如 375pt 宽不溢出、深浅色都检查过、给出模拟器截图]。
先只搭结构和主流程，不做动效和细节打磨；做完给我截图。

【之后每一条：差量】
这一轮只改：[具体元素]。
怎么改：[改成什么样，给数值或参照]。
保持不变：[其余页面、布局、样式、文案、已经确认过的部分]。
改完列出改动的文件，并截图对比改前改后。
```

## 已知坑 & 评论区改进
- **一条消息只做一类改动。** Figma（Alexia Danton）原文建议先结构、再行为、最后内容和打磨，不要把不相关的改动打包进一条。
- **反馈越具体越好，点名组件。** Claude Design 帮助中心建议反馈时具体指出元素、提到设计系统里的组件名，并可以要 2–3 个变体对比；也可以直接让它做可访问性/对比度检查。
- **Lovable 文档里的「先问我」句式**（"Ask me any questions you need in order to fully understand what I want from this feature and how I envision it."）与 [kz-clarify-then-three-options](kz-clarify-then-three-options.md) 同一思路，不重复收。
- **本库提醒**：「保持不变」这一行和 [cmt-only-change-what-i-point](cmt-only-change-what-i-point.md) 是同一类范围控制；在 Claude Code / Codex 里写代码时同样适用，不只是出图工具。

## 来源
- [7 tips for using Figma Make credits more efficiently](https://www.figma.com/blog/7-tips-for-using-figma-make-credits-more-efficiently/) — Alexia Danton（Figma 博客，2026-05-22）
- [Cooking with constraints: a designer's framework for better AI prompts](https://www.figma.com/blog/designer-framework-for-better-ai-prompts/) — Greg Huntoon（Figma 博客，2026-01-05）
- [How to prompt v0](https://vercel.com/blog/how-to-prompt-v0) — Esteban Suárez（Vercel 博客）
- [Lovable：Prompting one](https://docs.lovable.dev/prompting/prompting-one) — Lovable 官方文档
- [Get started with Claude Design](https://support.claude.com/en/articles/14604416-get-started-with-claude-design) — Anthropic 帮助中心
- [stitch-skills：enhance-prompt/SKILL.md](https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-utilities/skills/enhance-prompt/SKILL.md) — Google Labs

## 标签
设计、UI、需求对齐、范围控制
