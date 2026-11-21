---
title: 产品方案 / PRD 挑刺：缺什么、是不是过于乐观
category: 产品
tags:
- 产品
- 方案评审
author: Vybhav Ramachandran (@vybhavram)，由 Lenny Rachitsky 收录; Rishi Kar (@rishi_kar)，由
  Lenny Rachitsky 收录
source_url: https://www.lennysnewsletter.com/p/how-to-use-chatgpt-in-your-pm-work
date: '2026-11-17'
id: lenny-prd-critique
additional_sources:
- https://www.lennysnewsletter.com/p/how-to-use-chatgpt-in-your-pm-work
variants:
- Rishi Kar：思考 GTM 或功能时最常用的三问——What am I missing here? / What am I being overly optimistic
  about? / What is a macro event that can totally reverse the outcomes of this test
- Vybhav Ramachandran 会前：I'm meeting the VP of data science for a 30 minute call to
  discuss X. What should I ask her?
- Vybhav Ramachandran 会后：Summarize my notes into minutes, action items
status: active
---

## 解决什么问题
看产品方案、PRD（产品需求文档）或 GTM（上市/推广计划）时用：让 AI 站在更苛刻的读者角度挑盲点、过度乐观和可能翻盘的外部风险，而不是帮你把方案写得更顺。和 [kz-red-team-own-plan](kz-red-team-own-plan.md) 同属「让 AI 挑刺」，但那条是假设当前技术方案已经错了、去找可证伪的反例和边界；本条的对象是产品方案/PRD/GTM，问的是「我漏了什么、是不是过于乐观」。按去重规则第 3 条，用法明显不同，所以单独成条。

## Prompt
主条目原文（Vybhav Ramachandran 在 Lenny 文中被引用的 PRD Review，英文；文中右括号是这样写的，照抄不改）：
```text
Assume you are the CTO, review this PRD and give me critical, but fair feedback)
```
中文大意：假设你是 CTO，审查这份 PRD，给我严厉但公平的反馈。

使用时把 PRD 正文一并贴上。

变体 A（Rishi Kar，同一篇文章；作者说这是思考 GTM 或一个功能时最喜欢用的 prompt，原文英文）：
```text
What am I missing here?
What am I being overly optimistic about?
What is a macro event that can totally reverse the outcomes of this test
```
中文大意：我这里漏了什么？我对什么过于乐观了？有没有一个宏观事件，会彻底扭转这次测试的结果？

变体 B、C（同一作者 Vybhav Ramachandran 在同一条推文里写的会前/会后用法，不是挑刺本身，一并收录以免拆散出处）：
```text
I'm meeting the VP of data science for a 30 minute call to discuss X. What should I ask her?
```
```text
Summarize my notes into minutes, action items
```
中文大意：我要和数据科学副总裁开 30 分钟会讨论 X，我该问她什么？／把我的笔记整理成会议纪要和待办。

## 已知坑 & 评论区改进
- 本库提醒：这三条都来自 Lenny Rachitsky 2023-04-11 的文章《How to use ChatGPT in your PM work》。2026-11-17 打开时该文为付费篇，这里只收录当时页面上能读到的推文引文，没有补全文里可能被墙住的其它示例。
- 本库提醒：主条目原文在 Lenny 文中的引号/括号可能不配对（feedback 后有一个 `)`），上面按所见原文照抄，没有擅自改。
- 和技术方案红队的区分见 [kz-red-team-own-plan](kz-red-team-own-plan.md)。

## 来源
- [Lenny Rachitsky：《How to use ChatGPT in your PM work》，其中引用 Vybhav Ramachandran @vybhavram](https://www.lennysnewsletter.com/p/how-to-use-chatgpt-in-your-pm-work)
- [同上，其中引用 Rishi Kar @rishi_kar](https://www.lennysnewsletter.com/p/how-to-use-chatgpt-in-your-pm-work)

## 标签
产品、方案评审
