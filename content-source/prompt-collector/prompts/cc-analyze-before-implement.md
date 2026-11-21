---
title: 先别改，读相关文件后告诉我要改什么、有疑问就问
category: 需求对齐
tags:
- 需求对齐
- 执行/交付
author: 陈成 (@chenchengpro)
source_url: https://x.com/chenchengpro/status/2122321666898538758
date: '2026-11-17'
id: cc-analyze-before-implement
status: active
---

## 解决什么问题
怕 agent 一上来就“闷头改一堆文件”时用：先只分析、列出需要的改动、提问，你确认后再让它实现。和 [kz-clarify-then-three-options](kz-clarify-then-three-options.md) 是一家，但这条更偏“读代码后出改动清单”，不要求出多版方案，日常改需求更轻量。

## Prompt
原文（陈成第 1 条，英文）：
```text
dont implement or fix directly, analyze related files first if needed, tell me what changes are needed and ask questions if unclear.
```
中文大意：不要直接实现或修复；需要的话先分析相关文件，告诉我需要做哪些改动，不清楚的地方就问我。

## 已知坑 & 评论区改进
- 陈成那条帖子的评论区没有针对第 1 条的修正。
- 卡兹克评论区有相近经验：“flash先列改动范围再改更稳”—— [@Rk1ngggg](https://x.com/Rk1ngggg/status/2122384639184802023)；“以前最怕Agent一言不合直接闷头改一堆文件，现在学乖了，先让它反问对齐需求再动手”—— [@LuJia8988](https://x.com/LuJia8988/status/2122305320840306752)

## 来源
- [陈成 @chenchengpro 转发卡兹克并分享的常用 Prompt，第 1 条](https://x.com/chenchengpro/status/2122321666898538758)

## 标签
需求对齐、执行/交付
