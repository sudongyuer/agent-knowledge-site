---
title: 「跟手」的手势动画：按下即响应、1:1 跟随、随时可打断、松手继承速度并按惯性投射落点
category: 设计
tags:
- 设计
- 动效
- 移动端
- 交互细节
author: Emil Kowalski（emilkowalski/skills：apple-design，整理自 WWDC 2018 Designing Fluid
  Interfaces）
source_url: https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md
date: '2026-11-21'
id: emil-apple-fluid-interfaces
status: active
---

## 解决什么问题
做底部弹层（sheet）、可拖拽卡片、滑动删除、轮播这类手势交互，agent 写出来「能拖但不跟手」——松手后突然换速度、动画中途抓不住、甩一下停在奇怪位置——时用。Emil 把苹果 WWDC 2018《Designing Fluid Interfaces》的原则和苹果样例代码里的具体参数整理成了 skill，可以直接当实现约束。

spring（弹簧动画）：没有固定时长、按物理模拟收敛的动画，天然可以中途改目标。damping ratio（阻尼比）：1.0 不回弹，小于 1 会过冲。presentation value（呈现值）：屏幕上此刻实际显示的位置，而不是逻辑上的目标值。

## Prompt
原文 1（核心一句，英文）：
```text
The through-line: **an interface feels alive when motion starts from the current on-screen value, inherits the user's velocity, projects momentum forward, and can be grabbed and reversed at any instant.** Springs are the tool that makes all of this natural, because they are inherently interruptible and velocity-aware.
```
中文大意：界面「活」起来的关键：动画从屏幕上当前的值开始、继承手指的速度、按惯性往前投射、任何时刻都能被抓住并反向。弹簧动画天然可打断、能感知速度，所以是实现这些的工具。

原文 2（可打断，英文）：
```text
- **Always animate from the *presentation* (current) value, never the target value.** On interrupt, read the element's live on-screen transform and start the new animation from there. Starting from the logical/target value causes a visible jump.
- **Avoid CSS transitions and `@keyframes` for anything gesture-driven** — they can't be smoothly grabbed and reversed mid-flight.
```

原文 3（苹果实际使用的弹簧参数，原样）：
```text
| Interaction | Damping | Response |
| --- | --- | --- |
| Move / reposition (e.g. PiP) | `1.0` | `0.4` |
| Rotation | `0.8` | `0.4` |
| Drawer / sheet | `0.8` | `0.3` |
```
原文说明：大多数 UI 从阻尼 1.0 开始；只有手势本身带了动量（甩、扔、拖拽松手）时才加回弹（约 0.8）。

原文 4（速度交接与惯性投射，原样）：
```text
relativeVelocity = gestureVelocity / (targetValue − currentValue)
```
```js
// decelerationRate ≈ 0.998 for normal scroll feel; 0.99 for snappier
function project(initialVelocity /* px/s */, decelerationRate = 0.998) {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}

const projectedEndpoint = currentPosition + project(releaseVelocity);
const target = nearestSnapPoint(projectedEndpoint);   // choose target from the projection
animateSpringTo(target, { velocity: releaseVelocity }); // then hand off velocity (§5)
```
中文大意：松手时把手指速度交给弹簧作为初速度（有的 API 要归一化成相对速度）；不要从松手位置找最近的吸附点，而是先用速度投射出「本来会滑到哪」，再找离投射点最近的吸附点。

原文 5（手势细节清单，英文节选）：
```text
- **Tap:** highlight on touch-*down* (instant), commit on touch-*up*. Add ~10px of hysteresis/hit padding around the target, and allow cancel-by-dragging-away and back.
- **Drag/swipe:** require a small movement threshold (hysteresis, ~10px) before committing to a direction, then track 1:1.
```

通用版（本库整理，非原文；RN + react-native-gesture-handler + Reanimated）：
```text
实现/改造 [底部弹层/可拖拽卡片/滑动操作]，手感按 Emil apple-design skill（WWDC Designing Fluid Interfaces）：
- 按下立即有反馈；拖动时 1:1 跟手，保留手指抓住的位置偏移，不要跳到元素中心；方向判定前留约 10px 阈值。
- 全程可打断：动画中再次抓住，从屏幕上的当前值继续（用 shared value 当前值），不要等动画结束。
- 松手：用 velocity 投射落点 project(v)=(v/1000)*0.998/(1-0.998)，选离投射点最近的档位；把松手速度作为弹簧初速度传入。
- 弹簧参数起点：sheet/抽屉 阻尼 0.8、response 0.3；普通移动 阻尼 1.0、response 0.4；只有带动量的手势才回弹。
- 超出边界用橡皮筋阻尼，不要硬停。
- 系统开启减弱动态效果时改为淡入淡出。
做完录一段模拟器视频（xcrun simctl io booted recordVideo），说明快甩、慢拖、中途反向三种情况的表现。
```

## 已知坑 & 评论区改进
- **原文是为网页翻译的。** skill 自述把 WWDC 内容 "translated into the web platform (CSS, Pointer Events, `requestAnimationFrame`, spring libraries like Motion/Framer Motion)"，示例代码是 Motion 的 API；RN 里要换成 Reanimated 的 withSpring / withDecay 和 gesture-handler，参数名不同：原文提醒 Motion 的 `damping` 是物理系数、不是苹果的阻尼比，Reanimated 的 `damping` 同理；Expo 官方 expo-animation 的示例用的是 `withSpring(0, { duration: 300, dampingRatio: 0.8, ... })`，即「时长 + 阻尼比」写法，更接近苹果参数（本库提醒，具体以所用 Reanimated 版本文档为准）。
- **别用教科书公式。** 原文："the physics-textbook `v²/(2·decel)` is *not* what Apple ships — use the exponential-decay form above."
- **放慢看。** 原文 Process 一节建议 "play it in slow motion / frame-by-frame to catch what's invisible at full speed."
- **本库提醒**：手势之外的动画门槛（该不该动、多久）见 [emil-animate-expo-gate](emil-animate-expo-gate.md)；按压与震动见 [expo-press-feedback-haptics](expo-press-feedback-haptics.md)。

## 来源
- [emilkowalski/skills：apple-design/SKILL.md](https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md) — Emil Kowalski（内容整理自 Apple WWDC 2018《Designing Fluid Interfaces》）

## 标签
设计、动效、移动端、交互细节
