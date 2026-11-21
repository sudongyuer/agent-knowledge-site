---
title: 复盘返工/回滚的共同根因，沉淀成规则、自动化或 Skill
category: 复盘沉淀
tags:
- 复盘沉淀
- 找根因
author: 数字生命卡兹克 (@Khazix0918); Anthropic Claude Code 官方文档（确定性 vs 非确定性指令）
source_url: https://x.com/Khazix0918/status/2122268349707219333
date: '2026-11-17'
id: kz-retro-to-rules
additional_sources:
- https://code.claude.com/docs/en/best-practices
status: active
---

## 解决什么问题
同类坑反复踩时用：定期让 agent 复盘一段时间的 Bug、返工、回滚（大白话：把上线的改动撤回去）、重复修改，找共同根因，把能预防的变成项目规则、自动检查或 Skill（大白话：agent 可以按需加载的一份操作手册），不再重复付同样的代价。评论区公认“最有复利”的一条。

## Prompt
原文（卡兹克第 10 条，XX 自己填）：
```text
全面复盘最近XX时间的 Bug、返工、回滚和重复修改。不要只统计发生了什么，要分析这些问题背后有没有共同的根因。把能够预防的共性问题沉淀成项目规则、自动化或者Skill，避免我们反复支付同样的成本。
```

增强版（本库按评论区 + 官方文档整理，非原文）：
```text
全面复盘最近 [时间段] 的 Bug、返工、回滚和重复修改。不要只统计发生了什么，要分析背后的共同根因。
1. 先按类型归类（例如：需求没说清、验收标准缺失、接口约束被忽略……），每类给出具体的 commit/PR/issue 作为证据。
2. 每个可预防的共性问题，优先做成能自动报错的检查（lint、测试、hook），做不到的才写进规则文件或 Skill。
3. 复盘至少产出一个规则文件改动或一个自动检查，否则不算完成。
4. 顺便检查现有规则：有没有过时的、互相矛盾的，列出建议删除的。
5. 新规则写好后，拿几个新的例子测试一下它能不能自己发现同类问题。
```

## 已知坑 & 评论区改进
- 分类：“把返工分成需求没说清、验收标准缺失、接口约束被忽略等类型，再把高频问题固化成检查项。否则 Agent 每次都能很快填坑，团队却一直在为同一个坑付费。”—— [@MikeyMengy3nq](https://x.com/MikeyMengy3nq/status/2122638817102635473)
- “复盘不算完成，除非至少产出一个规则文件或自动检查。”—— [@Shawnbysolgrid](https://x.com/Shawnbysolgrid/status/2122638521047425342)
- 能写成 lint/hook 的别只写进文档：“能写成 lint 或 hook 的，就别只写进规则文档……每纠正 AI 一次就加一条 lint，违反直接报错提交不上去，文档里的话 AI 不一定照做。”（该评论称这是 Lauren Tan 在 AI Engineer 大会上讲的做法，本库未核实原演讲）—— [@viest_w](https://x.com/viest_w/status/2122292161123336671)
  - 大白话：lint = 自动检查代码写法的工具；hook = 在特定时刻（比如提交代码前、agent 想结束时）自动运行的脚本。
- “在 Claude Code 里规矩反复强调还被漏，官方说就该挪进 hook 了”—— [@djxxxxnb](https://x.com/djxxxxnb/status/2122288154782691775)。本库核对了官方文档：确实把指令分成“非确定性”（prompt、CLAUDE.md、skill，模型可能不照做）和“确定性”（hook、deny 规则，harness 每次都强制执行），并写道 “A line like `Always typecheck before you finish` in this file works most of the time, not every time.” [来源](https://code.claude.com/docs/en/best-practices)
- 规则要定期删：“规则只加不减 过几个月就开始互相打架 Agent 读完一大堆反而不知道该听哪条”—— [@winston13111](https://x.com/winston13111/status/2122274139650273352)
- 用新例子测试规则：“I like testing the new rule on fresh examples... Give it three new drafts and see if it catches the same issue on its own.”—— [@justice_note](https://x.com/justice_note/status/2122273383920586908)
- 阈值：“同一类返工出现两次，我就写成规则，下次开活直接带上”。—— [@ztacts](https://x.com/ztacts/status/2122318210695651768)
- 有人做成每天定时任务（例如每晚 12 点）自动复盘。—— [@LiuweijiaVip](https://x.com/LiuweijiaVip/status/2122328419925217614)、[@world_0618](https://x.com/world_0618/status/2122530359267237994)

## 来源
- [数字生命卡兹克 @Khazix0918，第 10 条](https://x.com/Khazix0918/status/2122268349707219333)
- [Anthropic：Best practices for Claude Code — Deterministic and non-deterministic instructions](https://code.claude.com/docs/en/best-practices)

## 标签
复盘沉淀、找根因
