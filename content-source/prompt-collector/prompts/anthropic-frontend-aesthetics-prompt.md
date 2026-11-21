---
title: 反「AI 味」审美块：按字体、配色、动效、背景四个维度点名默认款，贴进 CLAUDE.md
category: 设计
tags:
- 设计
- UI
- 视觉风格
author: 'Anthropic Claude Cookbooks（Frontend Aesthetics: A Prompting Guide）; Anthropic
  Applied AI 团队（Prithvi Rajasekaran、Justin Wei、Alexander Bricken）; OpenAI Developers
  博客（GPT-5.4 前端指南，变体来源）'
source_url: https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb
date: '2026-11-18'
id: anthropic-frontend-aesthetics-prompt
additional_sources:
- https://claude.com/resources/articles/improving-frontend-design-through-skills
- https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4
variants:
- OpenAI GPT-5.4 前端指南的「Frontend tasks」硬规则块（给 Codex / AGENTS.md 用）：No cards by default、Hero
  budget、avoid purple-on-white defaults 等，见正文「变体」
status: active
---

## 解决什么问题
agent 做出来的界面「一眼 AI」时用：白底紫渐变、Inter 字体、千篇一律的卡片布局。Anthropic 官方的判断是：模型不是不懂设计，而是不加引导时会落到最常见、最保险的选择（官方原话叫 "on distribution" outputs，大白话：训练数据里出现最多的那种样子）。这段约 400 token（token 大白话：模型计字的单位，400 token 大约几百个英文单词）的审美块可以直接贴进 CLAUDE.md（Claude Code 每次都会读的项目说明文件）或系统提示里。

官方总结的三个有效手法：分维度点名（字体、颜色、动效、背景分开说）；给灵感来源但不过度规定（比如 IDE 配色主题、某种文化美学）；明确点出它的默认倾向，让它主动避开。

## Prompt
原文（Anthropic Cookbook《Frontend Aesthetics: A Prompting Guide》，官方说明"you can append this prompt section to your system prompt or CLAUDE.md file"）：
```text
<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight. Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.

Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.

Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.

Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!
</frontend_aesthetics>
```
中文大意：你容易收敛到最常见的输出，在前端里就是大家说的「AI slop」（AI 糊弄味）。要做有辨识度、让人惊喜的界面。字体：选好看、独特的字体，别用 Arial、Inter。配色：定一个统一的美学方向，用 CSS 变量；主色加锐利的点缀色，比平均分配的胆怯配色好；可以从 IDE 主题、文化美学找灵感。动效：一次精心编排的页面加载（错落出场）比到处撒小动效更好。背景：营造氛围和层次，别默认纯色。避开：烂大街字体、白底紫渐变、可预测的布局、没有语境特色的模板感。每次换着来：深浅主题、字体、风格都要变；你还是会反复用 Space Grotesk 这类字体，避开它。

官方同文还给了「只管一个维度」的版本，例如只管字体：
```text
<use_interesting_fonts>
Typography instantly signals quality. Avoid using boring, generic fonts.

**Never use:** Inter, Roboto, Open Sans, Lato, default system fonts
...
**Use extremes:** 100/200 weight vs 800/900, not 400 vs 600. Size jumps of 3x+, not 1.5x.

Pick one distinctive font, use it decisively. Load from Google Fonts. State your choice before coding.
</use_interesting_fonts>
```
（中间的推荐字体清单省略，全文见 [Cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb)。）

### 变体：OpenAI 给 GPT-5.4 / Codex 的「Frontend tasks」硬规则（节选原文）
OpenAI 官方博客给的起手 prompt，思路相同（点名默认款并禁止），但规则更硬，偏落地页：
```text
## Frontend tasks

When doing frontend design tasks, avoid generic, overbuilt layouts.

**Use these hard rules:**
- One composition: The first viewport must read as one composition, not a dashboard (unless it's a dashboard).
- Typography: Use expressive, purposeful fonts and avoid default stacks (Inter, Roboto, Arial, system).
- Cards: Default: no cards. Never use cards in the hero. Cards are allowed only when they are the container for a user interaction. If removing a border, shadow, background, or radius does not hurt interaction or understanding, it should not be a card.
- One job per section: Each section should have one purpose, one headline, and usually one short supporting sentence.
- Use motion to create presence and hierarchy, not noise. Ship at least 2-3 intentional motions for visually led work.
- Color & Look: Choose a clear visual direction; define CSS variables; avoid purple-on-white defaults. No purple bias or dark mode bias.
- Ensure the page loads properly on both desktop and mobile.

Exception: If working within an existing website or design system, preserve the established patterns, structure, and visual language.
```
（只节选了与 App 相关的条目；完整版还有 Brand first、Hero budget、Full-bleed hero 等落地页规则，见 [OpenAI 原文](https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4)。）
中文大意（节选）：首屏是一个整体构图；字体别用默认字体栈；默认不用卡片，去掉边框/阴影/背景/圆角不影响理解的，就不该是卡片；每个区块只做一件事；动效用来建立层次而不是制造噪音；定一个清晰的视觉方向，别默认白底紫色，也别默认暗色；桌面和手机都要正常。例外：在已有网站或设计系统里工作时，保留现有模式和视觉语言。

## 已知坑 & 评论区改进
- **这是「从零做新页面」用的，不适合已有设计系统的 App。** OpenAI 那段自己就写了例外条款；做 LobeHub 这类已有设计规范的产品时，先保住现有设计系统，再考虑这段。本库提醒：在已有产品里加它，模型可能为了「独特」去换字体、换配色，违背品牌。
- **官方后来的 skill 版本把「黑名单」换成了「流程」。** 2026 年 anthropics/skills 里的 frontend-design skill 不再只列禁用字体，而是要求先写设计计划、对照「AI 默认款」自查再写代码，并把「暖奶油底+陶土色点缀」（Claude 自己的配色）也列为 AI 味。见 [anthropic-frontend-design-plan-critique](anthropic-frontend-design-plan-critique.md)。本库提醒：黑名单会催生新的默认款（官方原文自己就承认会反复收敛到 Space Grotesk）。
- **Anthropic 博客的写法建议**：要在「合适的高度」写 prompt，避开两个极端：太低（写死具体色值）和太高（含糊地假设对方懂你）。原话："avoiding the two extremes of low-altitude hardcoded logic like specifying exact hex codes and vague high-altitude guidance that assumes shared context."（[来源](https://claude.com/resources/articles/improving-frontend-design-through-skills)）
- **反对意见（X，高收藏）**：巴西开发者 Gui Vilela 说别用通用的设计 skill，改用参考图、截图和项目自己的设计系统（"Usem referências, mandem prints"，[原帖](https://x.com/guivilelaa_/status/2120298976419238016)，约 2200 收藏）。这条思路见 [openai-design-system-references-first](openai-design-system-references-first.md)。

## 来源
- [Anthropic Cookbook：Frontend Aesthetics: A Prompting Guide](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb)
- [Anthropic：Improving frontend design through Skills（2025-11-12）](https://claude.com/resources/articles/improving-frontend-design-through-skills)
- [OpenAI：Designing delightful frontends with GPT-5.4](https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4)

## 标签
设计、UI、视觉风格
