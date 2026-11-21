---
title: 把「品味」写成 agent 能照做的规则：缓动决策树、时长表、动效小技巧表
category: 设计
tags:
- 设计
- 动效
- 交互细节
author: Emil Kowalski（Agents with Taste）; Emil Kowalski（emilkowalski/skills）; Emil
  Kowalski (@emilkowalski)
source_url: https://emilkowal.ski/ui/agents-with-taste
date: '2026-11-18'
id: emil-taste-as-rules
additional_sources:
- https://github.com/emilkowalski/skills
- https://x.com/emilkowalski/status/2116583281332503038
variants:
- Emil 的周末动效清理流程：/remove-animations → /improve-animations → /animation-performance（X
  约 2500 收藏）
status: active
---

## 解决什么问题
agent 做的动画「差点意思」时用：入场用了 ease-in、从 scale(0) 冒出来、动画太长。Emil 的观点：几乎每个「品味」判断背后都有逻辑原因，把原因说清、写成严格规则交给 agent，它就能按你的品味做。这条既是可以直接贴给 agent 的动效规则，也是**写设计 skill 的示范**：用表格和决策树代替形容词，agent 不需要猜。

缓动（easing，大白话：动画速度随时间变化的曲线）：ease-out 先快后慢，ease-in 先慢后快。

## Prompt
原文 1（Emil 文章里展示的 skill 片段：缓动决策树）：
```text
## Easing Decision Flowchart
 
Is the element entering or exiting the viewport?
├── Yes → ease-out
└── No
 ├── Is it moving/morphing on screen?
 │ └── Yes → ease-in-out
 └── Is it a hover change?
 ├── Yes → ease
 └── Is it constant motion?
 ├── Yes → linear
 └── Default → ease-out
```
中文大意：元素进出视口？是→ease-out。否则：在屏幕上移动/变形→ease-in-out；hover 变化→ease；持续运动→linear；默认 ease-out。

原文 2（时长表）：
```text
## Duration Guidelines
 
| Element Type | Duration |
| --------------------------------- | --------- |
| Micro-interactions | 100-150ms |
| Standard UI (tooltips, dropdowns) | 150-250ms |
| Modals, drawers | 200-300ms |
 
**Rules:**
- UI animations should stay under 300ms
- Larger elements animate slower than smaller ones
- Exit animations can be ~20% faster than entrance
- Match duration to distance - longer travel = longer duration
```
中文大意：微交互 100–150ms；常规 UI（提示、下拉）150–250ms；弹窗、抽屉 200–300ms。UI 动画不超过 300ms；大元素比小元素慢；退出可以比进入快约 20%；移动距离越长时长越长。

原文 3（实用技巧表）：
```text
## Practical Tips
 
| Scenario | Solution |
| ------------------------------- | ----------------------------------------------- |
| Make buttons feel responsive | Add `transform: scale(0.97)` on `:active` |
| Element appears from nowhere | Start from `scale(0.95)`, not `scale(0)` |
| Shaky/jittery animations | Add `will-change: transform` |
| Hover causes flicker | Animate child element, not parent |
| Popover scales from wrong point | Set `transform-origin` to trigger location |
| Sequential tooltips feel slow | Skip delay/animation after first tooltip |
| Small buttons hard to tap | Use 44px minimum hit area (pseudo-element) |
| Something still feels off | Add subtle blur (under 20px) to mask it |
```
中文大意：按钮按下时缩到 0.97 显得灵敏；元素出现从 0.95 开始而不是 0；动画抖用 will-change；hover 闪烁就动子元素；弹层缩放原点设在触发位置；连续的提示框第一个之后去掉延迟；小按钮用伪元素扩到 44px 点击区；还是觉得不对，加一点小于 20px 的模糊来掩盖。

变体（Emil 在 X 上推荐的周末流程，约 2500 收藏）：
```text
/remove-animations → /improve-animations → /animation-performance
```
原帖说明："It removes unnecessary, annoying animations, improves existing ones, and makes sure they are performant, free wins."（先删掉多余烦人的动画，再改进现有的，最后确保性能。）[原帖](https://x.com/emilkowalski/status/2116583281332503038)

## 已知坑 & 评论区改进
- **为什么 scale(0) 不对**（Emil 原文解释）：从 0 开始看起来像凭空冒出来；真实世界里的东西就算瘪了的气球也有形状，"it never disappears completely"。这就是「品味背后的理由」，写 skill 时要把理由一起写进去。
- **Emil 写 skill 的方法**：先问自己为什么这样选，把原因说清，定规则，要严格。原话："So take a step back, ask yourself why you made a certain decision, articulate clearly why something has to be done this way, set the rules, be strict." 他用 Anthropic 的 skill-creator skill 来辅助写。对正在研究写移动端设计 skill 的人，这段就是方法论。
- **他的 skill 刻意不规定风格。** Emil 在 X 上说："my skills don’t enforce a specific style, or try to do everything for you, but rather are small and focus on specific rules."（只管小而具体的规则，像 Radix UI 一样给骨架。）[来源](https://x.com/emilkowalski/status/2120462021141434397)
- **不知道用哪个就让 agent 自己选。** Emil："just ask the agent to use Emil’s skills where it makes sense."（[来源](https://x.com/emilkowalski/status/2121685610725584948)）
- 这些规则是 Web/CSS 写法。React Native / Expo 版见 [emil-animate-expo-gate](emil-animate-expo-gate.md)。

## 来源
- [Emil Kowalski：Agents with Taste](https://emilkowal.ski/ui/agents-with-taste)
- [emilkowalski/skills](https://github.com/emilkowalski/skills)（2026-11-18 约 5.8 万 star）
- [Emil 的周末流程帖](https://x.com/emilkowalski/status/2116583281332503038)

## 标签
设计、动效、交互细节
