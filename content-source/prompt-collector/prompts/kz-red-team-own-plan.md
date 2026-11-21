---
title: 假设当前最佳方案是错的，站最强反对者找反例
category: 方案评审
tags:
- 方案评审
- 验证/自审
author: 数字生命卡兹克 (@Khazix0918); Anthropic Claude Code 官方文档（关于审查者“总能找到问题”的提醒）
source_url: https://x.com/Khazix0918/status/2122268349707219333
date: '2026-11-17'
id: kz-red-team-own-plan
additional_sources:
- https://code.claude.com/docs/en/best-practices
variants:
- 评论区：对抗式审查下这个方案；或者你再去复核下这个，确认无误后就按这个推进（@EStar28518）
- 评论区：请你从正反两面来讨论这个问题（@grow_fishing）
status: active
---

## 解决什么问题
方案基本定了、要拍板前用：让 agent 当“红队”（大白话：专门来挑刺、攻击你方案的一方），找能推翻方案的证据、反例和边界情况，然后重新评估。
产品方案/PRD/GTM 的盲点和过度乐观检查是另一条：[lenny-prd-critique](lenny-prd-critique.md)。

## Prompt
原文（卡兹克第 6 条）：
```text
先假设你当前认为最合理的方案是错误的。站在最强反对者的角度，寻找能够推翻它的证据、反例和边界情况。然后重新评估方案，看看有没有更好的解法。
```

增强版（本库按评论区 + 官方文档整理，非原文）：
```text
先假设你当前认为最合理的方案是错误的。站在最强反对者的角度，寻找能够推翻它的证据、反例和边界情况。
要求：每条反对意见必须附上可以被证伪的东西——一个能跑的测试、一段真实日志、一条线上数据或具体代码位置；拿不出的标成“推测”。只报告会影响正确性的问题，忽略代码风格。
然后重新评估方案：如果反对意见站不住，直接说原方案成立，不要为了显得深刻硬改。
```

## 已知坑 & 评论区改进
- 与第 3 条一起用会“表演深刻”，要给它能被证伪的素材（测试、日志、线上数据）。—— [@Shawnbysolgrid](https://x.com/Shawnbysolgrid/status/2122638521047425342)（原话见 kz-challenge-problem-definition）
- Anthropic 官方文档对审查类 prompt 的提醒（原文英文）：“A reviewer that's asked to find problems will always find something. If you fix every finding, you end up with extra abstraction layers and tests for cases that can't happen.” 大白话：让它找问题，它一定会找出点东西；全都照改，会多出没用的抽象层和不可能发生的测试。所以增强版加了“只报影响正确性的问题”。[来源](https://code.claude.com/docs/en/best-practices)
- “让它先当最强反对者推翻自己的方案，比直接问有没有更好的解法有效得多”。—— [@lzuren2001](https://x.com/lzuren2001/status/2122279317258559597)
- “找最强反例这条，比让AI自评靠谱多了”。—— [@huishu96225748](https://x.com/huishu96225748/status/2122275208568717778)

## 来源
- [数字生命卡兹克 @Khazix0918，第 6 条](https://x.com/Khazix0918/status/2122268349707219333)
- [Anthropic：Best practices for Claude Code — Review against your spec](https://code.claude.com/docs/en/best-practices)

## 标签
方案评审、验证/自审
