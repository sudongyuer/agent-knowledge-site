---
name: break-ui
title: 用最坏的真实数据压测 UI，报告坏在哪再动手修
author: Emil Kowalski
source_url: https://github.com/emilkowalski/skills/tree/main/skills/break-ui
install: npx skills@latest add emilkowalski/skills
category: 设计
tags:
- UI
- 测试
- 边界数据
date: '2026-11-21'
license: MIT
---

给一个组件或页面喂"最坏但真实"的数据：超长姓名、没有断点的邮箱、一个字母的名字、缺失的可选字段、0 条和 1000 条、非拉丁文字、emoji。把演示数据和最坏数据放在一个开发用的切换开关后面，逐项列出坏在哪里、原因和修法，然后停下，等你说修哪几条。

## 什么时候用

- 组件用演示数据看起来没问题，准备上线前。
- 想知道某个页面在长文本、空状态、超大数量下会不会坏。

## 核心规则

- 数据要真实或来自后端的长度上限，不用 `aaaa…` 这种没人会输入的值。
- 只改数据入口，不改组件本身去制造问题。
- 切换开关只在开发环境出现，不上线。
- 先报告再修复；截断还是换行这类有多种答案的问题交给你决定。
