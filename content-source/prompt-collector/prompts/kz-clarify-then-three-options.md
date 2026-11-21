---
title: 先问清不明确的地方，对齐偏好，再出 3 版方案
category: 需求对齐
tags:
- 需求对齐
- 方案评审
author: 数字生命卡兹克 (@Khazix0918); Anthropic Claude Code 官方文档; 陈成 (@chenchengpro)
source_url: https://x.com/Khazix0918/status/2122268349707219333
date: '2026-11-17'
id: kz-clarify-then-three-options
additional_sources:
- https://code.claude.com/docs/en/best-practices
- https://x.com/chenchengpro/status/2122321666898538758
variants:
- Anthropic 官方：Interview me until you could write the spec, then write it to SPEC.md.（问到能写出规格书为止，写进
  SPEC.md）
- 陈成 第 4 条：grill me on ...（就某件事“拷问”我）
- 评论区：先给我三个不同思路的草稿，别直接写最终版（@XaoNiu8618）
status: active
---

## 解决什么问题
需求还模糊、你自己也没想清楚时用：让 agent 先反问你、对齐偏好，再给几版方案让你挑，少返工。评论区公认最实用的一条。
设计稿已经出来、要把看中的几版揉在一起再迭代，用另一条：[anthropic-remix-liked-options](anthropic-remix-liked-options.md)。

## Prompt
原文（卡兹克第 2 条）：
```text
先问一些不清晰的问题，对齐我的喜好，然后再出3版方案。
```

增强版（本库按评论区改进整理，不是原帖原话）：
```text
先别动手。先复述一遍你理解的目标和约束条件，然后问我最多 3 个你最不确定的问题。
等我回答后，出 3 版方案，要求：
- 3 版在关键取舍上真的不同（不是同一思路换说法），每版写清代价和适用场景；
- 每版先说“它最可能死在哪”；
- 验收标准单独列出来，和需求分开。
我选定之前不要写代码。
```

变体 A（Anthropic 官方文档，原文英文）：
```text
I want to add rate limiting to the public API but haven't thought it through yet. Interview me until you could write the spec, then write it to SPEC.md.
```
通用化用法：把第一句换成你的需求。官方说明：它会用选择题问你没想清楚的部分，直到能写出规格书（spec）；之后开一个新会话照 SPEC.md 去做，SPEC.md 也就是后面审查时的“完成标准”。

变体 B（陈成第 4 条，原文）：
```text
grill me on ...
```
大白话：“grill me” = 让它像面试官一样追问我某个方案/想法。

## 已知坑 & 评论区改进
- 要限死问题数：“得限死最多问三个问题，不然它能把我审问到不想干了。”—— [@gggggg57427840](https://x.com/gggggg57427840/status/2122299070752379319)；另一位也说“之前没限次数被它问麻了”。[@gggggg57427840](https://x.com/gggggg57427840/status/2122324742048780467)
- 三版常常雷同：“三版常常只是同一套思路换了个说法；后来我加一句「先说每版最可能死在哪」，它们才拉开差距。另外，开工前我会让它复述一遍我的约束条件，复述错了当场打断重来。”—— [@hppzyy](https://x.com/hppzyy/status/2122369077729763545)
- 同样疑问：“怎么避免三版只是措辞不同、取舍其实一样？是先让它列出每版的代价和适用场景再选吗？”—— [@anyueyi1](https://x.com/anyueyi1/status/2122312247699513558)（是提问，作者未回复）
- “先把验收标准写出来，再让它动手；标准跟需求分开列，不然三版方案出来还是要一条条对。”—— [@Dejavufs](https://x.com/Dejavufs/status/2122299369789800579)
- 先复述：“会先让它把理解的风格复述一遍再动笔”。—— [@BeiYu6i](https://x.com/BeiYu6i/status/2122330199580913906)
- “我一般让它把不确定的地方列出来 再动手 返工少一半”。—— [@AcekeikabileAce](https://x.com/AcekeikabileAce/status/2122277444434751663)
- 3 版挑起来也费时间。—— [@yanggao97566](https://x.com/yanggao97566/status/2122302010020221076)

## 来源
- [数字生命卡兹克 @Khazix0918，第 2 条](https://x.com/Khazix0918/status/2122268349707219333)
- [Anthropic：Best practices for Claude Code — Brainstorm with Claude first](https://code.claude.com/docs/en/best-practices)
- [陈成 @chenchengpro 的转发，第 4 条](https://x.com/chenchengpro/status/2122321666898538758)

## 标签
需求对齐、方案评审
