---
title: 等待状态诊断：每一处等待该用「什么都不显示 / 转圈 / 骨架 / 进度 / 乐观更新 / 流式输出」，先出表再改
category: 设计
tags:
- 设计
- 交互细节
- 移动端
- 设计审查
author: 枯白 Kubai（@Kubai087）; 枯白 Kubai（@Kubai087，同串 Prompt 回复）
source_url: https://x.com/Kubai087/status/2121449185014845794
date: '2026-11-21'
id: kubai-loading-states-audit
additional_sources:
- https://x.com/Kubai087/status/2121449497171841362
status: active
---

## 解决什么问题
App 里每次加载都是一个居中转圈、刷新时内容先清空再出现、保存时整页变灰时用。App Icon 设计师枯白 Kubai 的系列教程《999 个小技巧，让你 Vibe 的产品更有质感》第 017 期讲等待状态，附了一条很长的诊断 prompt：先找出产品里所有需要等待的地方，逐个判断该用哪种方式，列表给你选，确认后再改。

skeleton（骨架屏）：内容到达前先画出灰色占位形状。optimistic update（乐观更新）：先把结果显示出来，后台再保存，失败就退回。

## Prompt
作者正文要点（中文原文节选）：
```text
Spinner：按钮搭配 Toast，适合几秒内就能完成的操作，如刷新、同步。点击后按钮图标原地旋转，结束后用 Toast 告知结果，轻量，也不打断操作。

Skeleton：页面结构已知时，先显示骨架，再换成真实内容。用户能提前知道内容会出现在哪里，内容到达后原位替换，页面不跳动。常见于信息流、图表等内容面积较大的场景。

Progress：明确告知用户进度和最终结果，常见于上传、导入、诊断等耗时任务。可以用 Toast 或通知卡片呈现，也可以嵌在页面或表单中。

Optimistic：严格来说，这是一种策略而非模式。对于大概率成功、也容易退回的操作，先显示结果，再在后台保存；保存失败时，把改动退回原处，说明原因，并提供重试。

另外，300ms 以内的等待通常不显示单独的加载状态，否则它刚出现就消失，看起来像闪了一下。
```

Prompt 原文（作者在同串回复里给出，英文，节选开头、通用规则和报告要求）：
```text
Review how my product handles waiting, and decide for each wait which loading state fits: nothing, a spinner, a skeleton, progress, an optimistic change, or an AI answer written as it arrives. Then, if I want it, change them along the lines below. This is about judgment first: diagnose and recommend, and change only what I approve.

This is a change to my product, not a demo. Work inside my code, on my stack, with my components, tokens, motion values and copy style. Do not add a dependency, a data library or a new visual pattern without asking. Every value below is a default to start from.
...
2. Rules for every kind
- Thresholds: under 300ms nothing but a button's own icon turning; 300ms to 1s a spinner or skeleton; 1 to 10s a skeleton, or progress that says what it is doing; over 10s progress, the time left and a way out. Measure on a slow mobile network, not on localhost.
- Delay and minimum: what appears after 300ms stays at least 500ms. Write one helper for this and use it everywhere.
- The layout never moves when content arrives: reserve the space (skeletons at real size, minimum heights, fixed image ratios).
- One indicator per wait: never a spinner on the button, an overlay on the page and a bar at the top all at once.
- Keep what is known: when refreshing, keep showing the old data with a quiet refresh state, rather than a skeleton.
- Failures stay where they happened, say what failed and what to do, and offer Retry. A toast that disappears is not enough for something the person has to fix.
- Reduced motion: keep every state; drop the moving band and the spin, and use a soft opacity pulse or nothing.
- Accessibility: aria-busy on the region that is loading, a polite live region for done and failed, focus left where it was, and a busy button still reachable by keyboard.

3. Report before changing anything
Give me a table first, and do not change code yet. One row per wait:
- Where: the screen or component, and what starts the wait.
- Now: how long it takes, and what is shown.
- Should be: nothing, spinner, skeleton, progress, optimistic, AI answer, or background; and why, in a phrase that points to the rule above.
- Change: what you would do, in a phrase.
Group the rows by kind. Then list the shared pieces you would add or change (the delay helper, skeleton shapes, the progress notification). Wait for me to choose what to change.
```
中文大意：审查产品如何处理等待，为每一处决定合适的加载状态（不显示、转圈、骨架、进度、乐观更新、边生成边显示的 AI 回答），先诊断和建议，只改我批准的。这是改我的产品不是做 demo：用我的技术栈、组件、token、动效值和文案风格，不擅自加依赖或新视觉模式。通用规则：<300ms 不显示单独加载（按钮自带图标旋转除外）；300ms–1s 转圈或骨架；1–10s 骨架或说明正在做什么的进度；>10s 进度、剩余时间和退出方式；在慢速移动网络上测，不要在 localhost 测。300ms 后才出现的指示至少停留 500ms，写成一个公共 helper 到处用。内容到达时布局不动（骨架按真实尺寸、最小高度、固定图片比例）。一次等待只用一个指示。刷新时保留旧数据。失败留在原处、说明原因、给重试，会消失的 toast 不够。减弱动效时保留状态、去掉移动的光带和旋转。报告：先给表格不改代码，每行写位置、现状、应该是哪种及理由、改法，按类别分组，再列要新增的公共部件，等我选。

原文第 5 节还按平台给了实现建议（Web/React、iOS、Android、Flutter、桌面），第 6 节的验证包括：网络限速到 Slow 4G 计时每处等待、乐观更新时断网看能否回退和重试、取消长任务、读屏能听到加载和完成。

## 已知坑 & 评论区改进
- **原文平台建议里没有单列 React Native。** 第 5 节 Web 条目提到 React Query / SWR 在重新请求时保留旧数据、`useOptimistic` 或 mutation 的 `onMutate` 回滚，这些在 RN 里同样适用；aria-busy、live region 在 RN 里要换成对应的无障碍属性（本库提醒）。
- **刷新别回到骨架。** 和 Expo 官方 expo-data-fetching 的 "Refetches keep stale content" 一致，见 [expo-screen-done-walkthrough](expo-screen-done-walkthrough.md) 的四种状态变体。
- **本次只读了作者本人在串内的回复（多为致谢），没有读到其他人的实质改进评论。** 视频演示本库看不到。
- **本库提醒**：原文第 4 节有一大段具体视觉数值（toast 40px 高、骨架颜色、进度通知 344px 宽等），是作者自己产品的默认值，原文也说 "fit them to my design"；用之前替换成你的 token。

## 来源
- [枯白 Kubai：巧用等待状态，让产品响应更丝滑（017）](https://x.com/Kubai087/status/2121449185014845794)
- [同串 Prompt 回复](https://x.com/Kubai087/status/2121449497171841362)

## 标签
设计、交互细节、移动端、设计审查
