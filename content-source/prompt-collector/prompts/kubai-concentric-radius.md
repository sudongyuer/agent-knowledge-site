---
title: 嵌套圆角统一：内圆角 = 外圆角 − 内边距，从外往里改，再换成连续曲率圆角，最后列出每处改动
category: 设计
tags:
- 设计
- 视觉风格
- 移动端
author: 枯白 Kubai（@Kubai087）
source_url: https://x.com/Kubai087/status/2115469767650021796
date: '2026-11-21'
id: kubai-concentric-radius
status: active
---

## 解决什么问题
卡片里套面板、面板里套按钮，圆角各写各的，看起来「不规整」时用。枯白 Kubai《999 个小技巧》第 004 期讲递进式圆角（concentric radius，大白话：内外两层圆角共用一个圆心）和连续曲率圆角（超椭圆 superellipse，iOS 图标那种直边和圆弧之间没有折痕的圆角），帖子里直接附了 prompt。

## Prompt
作者正文要点（中文原文节选）：
```text
👉要点一：等距内缩。当你想让表单、嵌套卡片的各种元素看起来更规整的时候，使用递进式圆角。保证每一层都遵守：

内圆角 = 外圆角 − 间距，内外共用一个圆心

👉要点二：连续圆角/超椭圆。普通圆角接直边的地方有一道折痕，连续圆角过渡更顺（类比 iOS）
```

Prompt 原文（英文，帖内原样）：
```text
Make the corner radii in this UI consistent, then switch them to continuous corners. Work on the screen or components I name; ask me if I have not named them. If the project has radius tokens, change those instead of hard-coding values.

Inner radius = outer radius - padding (r = R - p)
Go from the outside in: dialog or card -> panels, inputs, buttons -> chips and tags. A box p inside a container with radius R gets R - p, so both corners share one center. Example: dialog 32, padding 16 -> panels and buttons 16; a chip 8 inside a 16 panel -> 8.
Boxes on the same level share one radius. Never go below 4.

Pills and circles stay fully round.
Keep every padding, gap and radius on a 4px grid.
Continuous corners
Keep border-radius and add the curve as progressive enhancement: @ supports (corner-shape: superellipse(1.25)) { :where(*) { corner-shape: superellipse(1.25); } } Set corner-shape: round on pills and circles.

Chrome and Edge 139+ render it; Safari and Firefox skip the block and show the plain border-radius.
When done, list every radius you changed as "element: old -> new".
```
中文大意：把这个界面的圆角统一，再换成连续圆角。只改我点名的屏幕或组件，没点名就先问；项目有圆角 token 就改 token，不要写死。内圆角 = 外圆角 − 内边距；从外往里改：弹窗/卡片 → 面板、输入框、按钮 → 标签。例：弹窗 32、内边距 16 → 面板和按钮 16；16 的面板里内边距 8 的标签 → 8。同一层级共用一个圆角，最小不低于 4。胶囊和圆形保持全圆。所有内边距、间距、圆角都在 4px 网格上。连续圆角作为渐进增强加上（CSS corner-shape，目前 Chrome/Edge 139+ 支持，其他浏览器回退普通圆角）。改完逐条列出「元素：旧值 -> 新值」。

React Native 改写版（本库整理，非原文）：
```text
统一 [屏幕/组件] 的圆角，再换成连续圆角。没点名就先问我。项目有 radius token 就改 token。
规则：内圆角 = 外圆角 − 内边距（r = R − p），从外往里：Sheet/卡片 → 面板、输入框、按钮 → 标签；同层共用一个值；最小 4；胶囊和圆形保持全圆；内边距、间距、圆角都取 4 的倍数。
连续圆角：在 iOS 上给有圆角的视图加 borderCurve: 'continuous'（胶囊和圆形不加）；Android 不支持时保持普通圆角。
改完列出每处「元素：旧值 -> 新值」，并给 iOS 截图对比。
```

## 已知坑 & 评论区改进
- **CSS 写法有排版问题。** 原帖 prompt 里写的是「@ supports」（@ 和 supports 之间有空格，疑为避免被 X 识别成 @用户），实际 CSS 应为 `@supports`，复制时去掉空格。
- **浏览器支持有限。** 作者正文："Chrome / Edge 139+ 支持；Safari、Firefox 暂不支持，会自动退回普通圆角。"
- **本库提醒**：RN 版用的 `borderCurve` 是 React Native 的样式属性，仅 iOS 生效，需较新的 RN 版本（以所用版本文档为准）。作者在另一帖 5 条去 AI 味指令里也写了「使用全局变量统一管理圆角，使用等距内缩体系。如条件可行且性能无忧，使用连续圆角」，见 [emil-design-system-for-agents](emil-design-system-for-agents.md) 的变体。
- **本次只读了帖子本身，没有读评论区。**

## 来源
- [枯白 Kubai：使用递进式圆角数值 + 连续曲率圆角（超椭圆）（004）](https://x.com/Kubai087/status/2115469767650021796)

## 标签
设计、视觉风格、移动端
