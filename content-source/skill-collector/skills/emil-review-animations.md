---
name: review-animations
title: 动效审查：默认挑错，按十条硬标准逐条检查
author: Emil Kowalski
source_url: https://github.com/emilkowalski/skills/tree/main/skills/review-animations
install: npx skills@latest add emilkowalski/skills
category: 验证/自审
tags:
- 动效
- 设计审查
date: '2026-11-21'
license: MIT
---

只审查动画和动效代码的 skill，标准来自 Emil Kowalski 的动效理念。立场是默认挑错：能跑但感觉拖沓、起点不对、触发太频繁或掉帧的动画都算问题，通过要靠证据争取。

## 什么时候用

- 一个改动里新增或修改了动画，合并前想严格过一遍。
- 只看动效，不审查一般代码。

## 核心规则

- 每个动画要有目的；高频操作不加动画。
- 进出场不用 ease-in，界面动画在 300ms 以内（弹窗、抽屉、toast 等例外）。
- 弹出层从触发点缩放，不从 scale(0) 开始。
- 快速反复触发或手势驱动的动画必须可以中途打断。
