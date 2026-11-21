---
title: 换一双「没参与制作」的眼睛审成品：不告诉它为什么这样做，第一个词给结论，最多八条，只审不修
category: 设计
tags:
- 设计
- 设计审查
- 验证/自审
author: Nutlope/hallmark（Hallmark contributors）
source_url: https://github.com/Nutlope/hallmark/blob/main/skills/hallmark/references/review-finish.md
date: '2026-11-21'
id: hallmark-fresh-eyes-finish-review
status: active
---

## 解决什么问题
自己（或同一个 agent）做完界面后自查，总会替自己的设计找理由。Hallmark（Nutlope 发起的网页设计 skill）的收尾审查让审查者处在「没做过、也不会被告知原因」的位置，只看截图和源码，对照固定清单给出结论。适合开一个新的子 agent（subagent，大白话：另开一个没看过之前对话的干净助手）来做。

## Prompt
原文 1（开头设定，英文）：
```text
You are reviewing a built page against a fixed list. You did not build it and will not be told why anything is the way it is. Read the page, not the intent.
```
中文大意：你在对照固定清单审一个已经做好的页面。不是你做的，也不会有人告诉你为什么这样做。读页面，不读意图。

原文 2（结论与格式，英文）：
```text
First line: one of `recapture` (a screenshot is missing, blank or shows the wrong thing; list what to recapture and stop), `rebuild` (the first viewport fails the idea or the theme wholesale), `fix` (findings follow), `ship` (nothing owed).

Then the findings, ranked by cost to the page, at most eight, one line each: the gate or the plain defect, where it is, what you would do. Not findings: a direction you would not have chosen ...
```
中文大意：第一行只能是四个词之一：recapture（截图缺失/空白/截错，列出要重截的并停止）、rebuild（第一屏整体不符合设定）、fix（后面列问题）、ship（可以发布）。然后按对页面的伤害排序，最多八条，每条一行：哪条规则或什么缺陷、在哪、怎么改。「换我会选别的方向」不算问题。

原文 3（App 界面条款，英文）：
```text
On an app screen (the stamp says `shape: app screen`) there is no hero, fold or section rhythm to judge ... Read the full screens at 1440 and 375 and ask what someone fluent in the category would: is the hierarchy clear, is the density even, does every control and table work on a phone, are the states there.
```
中文大意：如果是 App 界面，就没有首屏大图、分屏节奏可评；看完整屏，用懂这一品类的人的眼光问：层级清不清楚，密度是否均匀，每个控件在手机上能不能用，各种状态有没有。

原文 4（结尾，英文）：
```text
Close with one line naming what must not be diluted while fixing. ... Do not fix anything.
```
中文大意：最后用一行写出修改时绝不能被冲淡的东西。什么都不要修。

通用版（本库整理，非原文；移动端截图版，交给新开的子 agent）：
```text
开一个新的子 agent，只给它：[屏幕截图路径：iPhone 小屏/大屏、浅色/深色、空/加载/错误状态]、对应的组件源码路径、DESIGN.md。不要告诉它设计意图和取舍理由。
给子 agent 的指令：
你在对照固定标准审一组已经做好的 App 屏幕。不是你做的，也不会有人解释为什么这样做。读屏幕，不读意图。
先看截图，只在需要引用文案或定位问题时打开源码。
第一行只写一个词：recapture（截图缺失或不对，列出要补的并停止）/ rebuild（整体方向不成立）/ fix / ship。
然后最多 8 条问题，按对用户的伤害排序，每条一行：问题、位置（截图名 + 组件）、你会怎么改。「我会选别的风格」不算问题。
重点问：层级是否清楚、密度是否均匀、每个控件在手机上能否点到用好、空/加载/错误状态是否都有、深浅色是否都成立、有没有一眼看出是 AI 模板的地方。
最后一行写：修改时绝不能被冲淡的是什么。不要修改任何文件。
```

## 已知坑 & 评论区改进
- **截图不全就先停。** 原文把「recapture」放在第一位：截图缺失或截错时只列要补的，不硬审。
- **改版时多问一句。** 原文：重新设计时还要回答 "what did the old page do better?"（旧版哪里更好），找出用户以前能做、现在更难做的事。
- **本库提醒**：Hallmark 主体针对网页落地页，本库只收了这份收尾审查。和 [anthropic-review-against-spec](anthropic-review-against-spec.md)（子 agent 对照规格查代码）思路相同，这条用于视觉；修改环节可接 [huashu-polish-loop](huashu-polish-loop.md)。

## 来源
- [Nutlope/hallmark：references/review-finish.md](https://github.com/Nutlope/hallmark/blob/main/skills/hallmark/references/review-finish.md) — Hallmark contributors

## 标签
设计、设计审查、验证/自审
