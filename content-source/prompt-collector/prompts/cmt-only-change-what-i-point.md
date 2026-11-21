---
title: 只改我指出的地方，其他先别动
category: 范围控制
tags:
- 范围控制
author: '@Polaksky（卡兹克原帖评论区）; @XiTalking（卡兹克原帖评论区）'
source_url: https://x.com/Polaksky/status/2122575891947495586
date: '2026-11-17'
id: cmt-only-change-what-i-point
additional_sources:
- https://x.com/XiTalking/status/2122565372893348282
variants:
- 改坏后的补救：你先别动，把刚才改坏的那几个地方恢复回来（@XiTalking）
status: active
---

## 解决什么问题
让 agent 修一个小地方，结果它顺手把一大片都改了时用：把改动范围锁死在你指出的位置。

## Prompt
原文（评论区，@Polaksky；原语境是改文稿，对代码同样适用）：
```text
只改我指出的地方，其他先别动。
```

代码场景的通用版（本库整理，非原话）：
```text
只改我指出的地方，其他先别动。改完列出你动过的每个文件和行范围；如果你认为别处也该改，写在最后作为建议，不要直接改。
```

补救版（评论区，@XiTalking）：
```text
你先别动，把刚才改坏的那几个地方恢复回来！
```

## 已知坑 & 评论区改进
- 原话出处：“我改稿最常补的一句是：‘只改我指出的地方，其他先别动。’不然改完一句，整篇都换了😂”—— [@Polaksky](https://x.com/Polaksky/status/2122575891947495586)。注意是写稿场景，不是专门讲代码。
- “我现在最常说的是你先别动，把刚才改坏的那几个地方恢复回来！用Agent久了真能练出项目经理的脾气”—— [@XiTalking](https://x.com/XiTalking/status/2122565372893348282)
- 本库提醒：真要保证不越界，靠 prompt 不够，配合 git diff 自己看一眼，或者让它先只出改动清单（见 [cc-analyze-before-implement](cc-analyze-before-implement.md)）。

## 来源
- [@Polaksky 回复卡兹克](https://x.com/Polaksky/status/2122575891947495586)
- [@XiTalking 回复卡兹克](https://x.com/XiTalking/status/2122565372893348282)

## 标签
范围控制
