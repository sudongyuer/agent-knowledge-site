---
title: 开工前把“怎样才算成功”写进文件，事后不许改
category: 需求对齐
tags:
- 需求对齐
- 验证/自审
author: '@hey404brain（卡兹克原帖评论区）; @tDS2SuXV5PvNNQt（卡兹克原帖评论区）; @world_0618（卡兹克原帖评论区）'
source_url: https://x.com/hey404brain/status/2122384515591024706
date: '2026-11-17'
id: cmt-freeze-acceptance-criteria
additional_sources:
- https://x.com/tDS2SuXV5PvNNQt/status/2122424800694206892
- https://x.com/world_0618/status/2122530359267237994
variants:
- '@world_0618：验收标准开工前确认，并用 sha256 冻住'
status: active
---

## 解决什么问题
防止 agent 做完后“调低标准让结果好看”：动手前把验收标准（大白话：做到什么程度才算完成）写进文件，做完对照检查，中途要改必须写明改了什么、为什么。

## Prompt
评论区原话不是一句现成 prompt，是做法描述。本库据此整理的通用版（非原话）：
```text
动手前，先把“怎样才算成功”写进 ACCEPTANCE.md：每条都要能检查（一个命令、一个测试、一张截图能证明）。我确认后再开始。
结果出来后不许改这个文件；中途非改不可的，在文件末尾追加一条记录：改了什么、为什么。
完成时逐条对照，贴出每条的证据。
```

## 已知坑 & 评论区改进
- 原做法：“动手前先让 Agent 把「怎样才算成功」写进文件，结果出来后不许改；中途非改不可的，要写清改了什么、为什么。我们让 AI 做研究就这么管，它中途换过一次数据源，也老老实实记了一笔，省得最后把标准调得好看。”—— [@hey404brain](https://x.com/hey404brain/status/2122384515591024706)
- “I'd add one: state what 'done' looks like up front. Without acceptance criteria, the agent optimizes for plausible output, not the goal.”—— [@tDS2SuXV5PvNNQt](https://x.com/tDS2SuXV5PvNNQt/status/2122424800694206892)
- “验收标准开工前确认，并用 sha256 冻住。”（大白话：sha256 是文件的“指纹”，文件被改过指纹就变，用来发现偷偷修改）—— [@world_0618](https://x.com/world_0618/status/2122530359267237994)
- “标准跟需求分开列”—— [@Dejavufs](https://x.com/Dejavufs/status/2122299369789800579)
- Anthropic 官方文档也建议在 SPEC.md 里写清“definition of done”（完成的定义），供后面审查对照。[来源](https://code.claude.com/docs/en/best-practices)

## 来源
- [@hey404brain 回复卡兹克](https://x.com/hey404brain/status/2122384515591024706)
- [@tDS2SuXV5PvNNQt 回复卡兹克](https://x.com/tDS2SuXV5PvNNQt/status/2122424800694206892)
- [@world_0618 回复卡兹克](https://x.com/world_0618/status/2122530359267237994)

## 标签
需求对齐、验证/自审
