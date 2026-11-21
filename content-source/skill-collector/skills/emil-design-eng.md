---
name: emil-design-eng
title: 界面打磨与动效判断：该不该动、怎么动、细节怎么做才对
author: Emil Kowalski
source_url: https://github.com/emilkowalski/skills/tree/main/skills/emil-design-eng
install: npx skills@latest add emilkowalski/skills
category: 设计
tags:
- 动效
- 交互细节
date: '2026-11-21'
license: MIT
---

Emil Kowalski 的设计工程方法：在搭建或打磨界面时，判断一个元素该不该动画、为什么动、用什么曲线和时长，以及按压、悬停、弹出层起点、提示延迟、拖拽这些决定"手感"的细节。

## 什么时候用

- 在做或改一个组件的交互和打磨，想让它"感觉更对"。
- 不确定某个过渡要不要加、加多长。

## 核心规则

- 每个动画都要说得出目的；一天用上百次的操作不加动画。
- 进出场用 ease-out 或更强的自定义曲线，界面动画控制在 300ms 以内。
- 弹出层从触发点展开，不从 scale(0) 开始。
- 只动 transform 和 opacity，并处理"减少动态效果"设置。
