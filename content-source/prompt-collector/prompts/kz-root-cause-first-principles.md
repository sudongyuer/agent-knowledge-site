---
title: 从第一性原理找根因再修
category: 找根因
tags:
- 找根因
author: 数字生命卡兹克 (@Khazix0918)
source_url: https://x.com/Khazix0918/status/2122268349707219333
date: '2026-11-17'
id: kz-root-cause-first-principles
variants:
- 评论区改进：先让它用一句话说本质原因，我点头了再动手（@gggggg57427840）
- 评论区改进：先让它列出假设再动手改（@BNB56667）
- 评论区改进：Question -> Break Down -> Rebuild -> Reduce 四步（@BufaXiwang177）
status: active
---

## 解决什么问题
Bug 修了又来、或者 agent 只在表面打补丁时用：逼它先找到“最根本的原因”再动手修。
> 大白话：“第一性原理”= 不套经验、不照抄别人的做法，从最基本的事实一步步推出来。

## Prompt
原文（卡兹克第 1 条）：
```text
从第一性原理出发，找到最本质原因，修复一下。
```

增强版（本库按评论区改进整理，不是原帖原话）：
```text
从第一性原理出发，找到这个问题最本质的原因，再修复。
要求：
1. 先列出你的假设，以及每条假设靠什么证据（日志、复现步骤、代码行）证实或排除。
2. 动手前，先用一句话告诉我你认为的本质原因，等我确认再改。
3. 修完后给出证据：复现步骤在修复前失败、修复后通过（命令和输出）。
4. 没有证据支持的推断，明确标成“推测”。
```

## 已知坑 & 评论区改进
- “它很会编”：@gggggg57427840 的做法是先让它用一句话说本质原因，点头了再动手。[原帖](https://x.com/gggggg57427840/status/2122299070752379319)
- “真容易跑偏，最好先让它列出假设再动手改”。—— [@BNB56667](https://x.com/BNB56667/status/2122280496067674556)
- “有时候越问越绕，后来我干脆先让它把问题拆成三层再动手”。—— [@Maddere7](https://x.com/Maddere7/status/2122281148479045991)
- 加一段 “Question -> Break Down -> Rebuild -> Reduce，让他按照这个流程逐步去梳理精简”。—— [@BufaXiwang177](https://x.com/BufaXiwang177/status/2122532532956913773)
- 有人把它和“奥卡姆剃刀”（大白话：能用简单解释就别用复杂解释）一起当关键词用。—— [@BarryFeng66](https://x.com/BarryFeng66/status/2122597562800861623)
- 反方意见：“感觉有的prompt 只要模型够强其实不用强调。。比如1”。—— [@kurobaRemu](https://x.com/kurobaRemu/status/2122284945020465612)
- 相关原则（英文转发）：“Don't confuse inference with evidence. Clearly distinguish what is observed, inferred, unknown, and still needs validation.”—— [@junjiechou1122](https://x.com/junjiechou1122/status/2122575297837219866)，增强版第 4 条即来自这个思路。

## 来源
- [数字生命卡兹克 @Khazix0918：最近两个月用 Agent 最爱说的几句 Prompt，第 1 条](https://x.com/Khazix0918/status/2122268349707219333)

## 标签
找根因
