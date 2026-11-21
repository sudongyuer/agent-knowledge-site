---
title: 两遍法：先写设计计划，对照「AI 默认款」自查改掉，再写代码并截图自评
category: 设计
tags:
- 设计
- UI
- 视觉风格
- 设计审查
author: Anthropic 官方 frontend-design skill（anthropics/skills）
source_url: https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
date: '2026-11-18'
id: anthropic-frontend-design-plan-critique
variants:
- 花叔 huashu-design 的同类自觉：「你有自己的默认审美……暖奶油底、高反差衬线标题、陶土色点缀、全大写小标签、01/02/03 编号」，每次要从题材里重新长出设计（见
  huashu-polish-loop 条目来源）
status: active
---

## 解决什么问题
让 agent 从零做一个新界面、又不想要「AI 模板脸」时用。和 [anthropic-frontend-aesthetics-prompt](anthropic-frontend-aesthetics-prompt.md) 的区别：那条是「别用这些字体和颜色」的黑名单；这条是 Anthropic 官方 skill 里的**流程**：先写一份很短的设计计划（配色、字体、布局、原则），拿它和「同类需求下你默认会做的样子」比，雷同的部分改掉并说明原因，然后才写代码，写的过程中截图自评。

skill 大白话：一份 agent 按需加载的操作手册。这个 skill 全文较长，下面只摘出可以直接复制的关键段，[全文在这里](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)。

## Prompt
原文节选 1（两遍法，英文）：
```text
Work in two passes. First, brainstorm a short design plan based on the client's design brief: create a compact token system with color, type, layout, and principles.
- Color: describe the core base palette as 4–6 named hex values.
- Type: the typefaces and their roles.
- Layout: a layout concept, using one-sentence prose descriptions and ASCII wireframes to ideate and compare. Include alignment guidance; should the content be left aligned, center aligned, justified?
- Principles: the high-level guidance for what makes this page unique.

Then review that plan against the brief before building: if any part of it reads like the generic default you would produce for any similar page (work through a similar prompt to see if you arrive somewhere similar) rather than a choice made for this specific brief — revise that part, say what you changed and why. Only after you've confirmed the relative uniqueness of your design plan should you start to write the code, following the revised plan.
```
中文大意：分两遍。第一遍按需求写一份精简的设计计划：配色（4–6 个带名字的色值）、字体及用途、布局（一句话描述 + ASCII 线框图，说明左对齐/居中）、这页独特在哪的原则。然后拿计划对照需求审一遍：哪部分读起来像「任何类似页面你都会给的默认答案」（可以拿一个类似需求在脑子里走一遍，看会不会走到同一个地方），就改掉，并说明改了什么、为什么。确认计划有足够辨识度之后才写代码。

原文节选 2（官方列出的 AI 生成设计扎堆的样子，用来「校准」）：
```text
For calibration, AI-generated design right now clusters around some traits:
1. a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta or warm-clay accent (often near #D97757 — Anthropic's own Claude-interaction accent, so on a user's brief it reads as a tell);
2. a near-black background with a single bright acid-green or vermilion accent;
3. a broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns;
4. the SaaS-card kit: content chopped into identical rounded cards, one border-radius on everything regardless of hierarchy, the same soft grey shadow (rgba(0,0,0,.1)) under each, and gradient washes as decoration;
5. template chrome that appears whatever the subject: a tracked-out ALL-CAPS eyebrow label above every heading; meta strings joined with middle dots ('A · B · C'); labels built as 'WORD — fragment' with a spaced em dash; tinted near-black (#0B0B0B, #111) standing in for black; a monospace face for small data labels; a '→' appended to link and button text.
```
中文大意：现在 AI 生成的设计扎堆在这几类：①暖奶油底 + 高反差衬线标题 + 陶土色点缀（这正是 Claude 自己的配色，用在用户项目上就是破绽）；②近黑底 + 一个亮酸性绿或朱红点缀；③报纸式细线、零圆角、密集分栏；④SaaS 卡片套件：内容切成一样的圆角卡片、统一圆角、统一灰阴影、渐变装饰；⑤和题材无关的模板装饰：每个标题上一行全大写小标签、「A · B · C」中点连接、「WORD — 片段」式标签、用 #111 代替黑色、小数据标签用等宽字体、按钮文字后面加「→」。

原文节选 3（收尾自评）：
```text
Spend your boldness in one place. Let one element be the memorable thing, keep everything around it quiet and disciplined, and cut any decoration that does not serve the brief. Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected, visually accessible, harmonious color palettes. Critique your own work as you build, taking screenshots to review if your environment supports it — a picture is worth 1000 tokens. Consider Chanel's advice: before leaving the house, take a look in the mirror and remove one accessory.
```
中文大意：大胆只花在一个地方，让一个元素成为记忆点，其余保持安静克制，删掉不服务需求的装饰。默默守住质量底线：适配到手机、键盘焦点可见、尊重「减少动效」设置、可读、配色和谐。边做边截图自评（一张图顶 1000 个 token）。学香奈儿：出门前照镜子，摘掉一件配饰。

## 已知坑 & 评论区改进
- **需求里写明的风格永远优先。** skill 原话："Where the brief pins down a visual direction, follow it exactly — the brief's own words always win, including when it asks for one of these looks." 你自己点名要暗色 + 绿点缀，它就该照做，上面的清单只管你没指定的部分。
- **动效也有「AI 味」。** 同一 skill："fade-and-slide-up entrances on each section and hover transitions on every card are the generic default and read as AI-generated." 每个区块都淡入上滑、每张卡片都有 hover，就是 AI 默认款。动效细节见 [emil-taste-as-rules](emil-taste-as-rules.md)。
- **文案也要去模板味。** skill 写作部分："Errors don't apologize, and they are never vague about what happened. An empty screen is an invitation to act."（报错不道歉、不含糊；空页面是邀请用户行动的地方。）按钮写清会发生什么："Save changes," not "Submit."
- **本库提醒**：这是官方 2026 年版 skill 的写法，和 2025 年博客里的「黑名单」版本（[anthropic-frontend-aesthetics-prompt](anthropic-frontend-aesthetics-prompt.md)）不冲突，可以叠加：黑名单管细节，两遍法管流程。

## 来源
- [anthropics/skills：frontend-design/SKILL.md](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)（2026-11-18 读取）

## 标签
设计、UI、视觉风格、设计审查
