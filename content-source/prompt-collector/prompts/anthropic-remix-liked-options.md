---
title: 挑中喜欢的几版，再要几份把它们揉在一起的 remix
category: 设计
tags:
- 设计
- 视觉风格
author: Nate Parrott（Anthropic 产品设计师）
source_url: https://claude.com/resources/articles/how-the-product-designer-who-built-claude-design-uses-it-to-explore-ideas-before-building-them
date: '2026-11-17'
id: anthropic-remix-liked-options
variants:
- Emil Kowalski /prototype skill：做几个在「命名的维度」上真正不同、都能跑的版本，放进可切换的选择器里挑（X 约 2600 收藏）
- 花叔 huashu-design「三方向门」：任何新设计先出三个方向的真实初稿给用户选，选定后才执行
- Jakub Krehel /variant skill：为正在做的组件生成多个变体，帮你迭代并挑一个
status: active
---

## 解决什么问题
已经让模型出了一批设计稿、你看中其中几版、想把优点合在一起再迭代时用。和 [kz-clarify-then-three-options](kz-clarify-then-three-options.md) 都涉及「出多版再挑」，但那条是开工前先问清偏好、再出 3 版方案；本条是选项已经在眼前之后，指定喜欢的几版并要求 remix（把它们揉在一起再出几份）。按去重规则第 3 条，用法明显不同，所以单独成条。

## Prompt
原文（Nate Parrott 文中 “Ask for ten options, then remix” 一条的示例，英文）：
```text
I like option B and a little of option D. Give me five riffs that smoosh those together.
```
中文大意：我喜欢 B 方案，也有一点喜欢 D。给我五份把这两者揉在一起的变奏。

作者在同一条里写的用法是：先要十个选项，大多数不会好，一两个会好；然后再说上面这句。B、D 换成你实际看中的编号即可。

## 已知坑 & 评论区改进
- 作者原话（英文）：“Ask for ten options, then remix. Most of them won't be good, and that's fine; one or two will be. Then say, …” 后面接的就是上面那句 prompt。[来源](https://claude.com/resources/articles/how-the-product-designer-who-built-claude-design-uses-it-to-explore-ideas-before-building-them)
- 同文还写：先想清楚再 prompt；要告诉 Claude 你希望它看起来像什么（字体、颜色、情绪板），否则它会落到自己常用的那几套审美；后期微调更适合手动改，而不是再 prompt 一次。这些是同一篇文章里的其它建议，不是这条 remix 原文的一部分。
- 和「先问再出 3 版方案」的区分见 [kz-clarify-then-three-options](kz-clarify-then-three-options.md)。

## 变体
- **Emil Kowalski 的 /prototype（代码里的多版本 + 切换器）**。Emil 在 X 上说（约 2600 收藏）："Agents rarely one-shot a great UI, so having multiple options to choose from is a great way to get to your desired result faster."（agent 很少一次做出好 UI，有多个选项可挑能更快到达想要的结果。）[原帖](https://x.com/emilkowalski/status/2120236535228326252)。skill 里最关键的一条硬规则（原文）：
  ```text
  **Variants diverge on a named axis** — layout, density, personality, motion, interaction model. Before building, you must be able to state each variant's axis in a phrase. Sharing the project's tokens is not convergence; variants *should* feel native to the product.
  ```
  中文大意：变体要在一个**说得出名字的维度**上分开：布局、密度、性格、动效、交互模型；动手前每个变体的维度都要能用一个短语说清。共用项目的 token 不算雷同，变体本来就该像这个产品的一部分。同一 skill 还要求：探索期间不碰生产代码；每个变体都要真的能用（真实交互、真实文案，不用 lorem ipsum）；选定后删掉原型。原文强调三个同一思路的微调版本只会浪费选择器："three tints of the same idea waste the picker"。[skill 全文](https://github.com/emilkowalski/skills/blob/main/skills/prototype/SKILL.md)
- **花叔 huashu-design 的「三方向门」**（中文原文）：「任何会产出新视觉设计的任务，先出三个方向的**真实初稿**给用户选，用户选定后才执行。」并要求「**摆出来就停**，结束回合等用户选，包括无人值守会话」。[来源](https://github.com/alchaincyf/huashu-design/blob/master/SKILL.md)
- **Jakub Krehel 的 /variant**：为正在做的组件生成多个变体并帮你挑。[来源](https://github.com/jakubkrehel/skills)
- 本库提醒：这几个变体解决的是「先发散」，本条原文解决的是「看中几版后再融合」，可以串起来用：先 /prototype 或三方向出版本，再用本条的 remix 句子融合。

## 来源
- [Nate Parrott：How the product designer who built Claude Design uses it to explore ideas before building them](https://claude.com/resources/articles/how-the-product-designer-who-built-claude-design-uses-it-to-explore-ideas-before-building-them)
- 变体来源：[Emil Kowalski /prototype 帖](https://x.com/emilkowalski/status/2120236535228326252)、[emilkowalski/skills prototype](https://github.com/emilkowalski/skills/blob/main/skills/prototype/SKILL.md)、[huashu-design SKILL.md](https://github.com/alchaincyf/huashu-design/blob/master/SKILL.md)、[jakubkrehel/skills](https://github.com/jakubkrehel/skills)

## 标签
设计、视觉风格
