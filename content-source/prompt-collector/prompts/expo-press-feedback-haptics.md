---
title: 按压反馈和触感震动的硬规则：按下就反馈、松手才执行，震动与画面同帧、一次操作只震一下
category: 设计
tags:
- 设计
- 移动端
- 动效
- 交互细节
author: Expo 官方 skills（expo-animation，§7 Press, not hover / §8 Haptics）; Expo 官方 skills（expo-web-to-native/references/native-patterns.md）
source_url: https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-animation/SKILL.md
date: '2026-11-21'
id: expo-press-feedback-haptics
additional_sources:
- https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-web-to-native/references/native-patterns.md
status: active
---

## 解决什么问题
RN / Expo App 的按钮「点下去没感觉」或者到处乱震时用。Expo 官方把移动端按压反馈和 haptics（触感反馈，大白话：手机的轻微震动）写成了具体数值和三条绝对规则，可以直接当 prompt 约束或审查清单。

hitSlop：RN 里扩大可点区域、但不改变视觉大小的属性。worklet：Reanimated 里跑在 UI 线程的函数。

## Prompt
原文 1（expo-animation §7，英文节选）：
```text
- **Feedback on press-in, commit on press-out.** Waiting for the tap to complete before showing anything feels dead — this is the latency the user actually perceives.
- **`scale: 0.97` in 100–150ms** on any button-like pressable, `Pressable` + a CSS transition. `scale` takes the label and icons with it, which is what makes it read as physical. Full-width list rows are the exception: they highlight their background instead — a scaling row reads as the whole screen squishing.
- **44×44pt minimum touch target** (48dp Android). If the visual is smaller, add `hitSlop` — don't grow the visual.
- **`pressRetentionOffset`** so a finger drifting a few pixels doesn't cancel a press the user meant.
- **Android ripple only in a Material-styled app.** In a custom-designed app, the same scale on both platforms is more coherent than a ripple on one.
```
中文大意：按下就给反馈，松手才执行；按钮类 100–150ms 缩到 0.97，整行列表例外，改成背景高亮（整行缩放看起来像整个屏幕被挤）；触控区至少 44×44pt（Android 48dp），视觉小就加 hitSlop；用 pressRetentionOffset 防止手指稍微滑动就取消；只有 Material 风格的 App 才用 Android 水波纹。

原文 2（expo-animation §8 Haptics，英文）：
```text
| Moment | Call |
| --- | --- |
| A value ticks past a step — picker, slider detent, segmented control | `Haptics.selectionAsync()` |
| Something snaps home, a sheet detent catches, a drag commits | `Haptics.impactAsync(ImpactFeedbackStyle.Light)` |
| A heavy object lands, a destructive action fires | `Haptics.impactAsync(ImpactFeedbackStyle.Medium)` |
| Operation succeeded or failed | `Haptics.notificationAsync(NotificationFeedbackType.Success / Error)` |

Three rules, and they're absolute:

- **Same frame as the visual.** A haptic that lags its animation reads as a glitch, not as feedback. Fire it at the causal moment — the detent catching — not when the animation finishes.
- **One per user action.** Never on scroll, never per frame, never on an entrance animation the user didn't cause.
- **Never the only feedback.** Haptics are off system-wide for many users, and silent on most Android hardware. The visual has to stand alone.

From a worklet, haptics must be scheduled back to the RN runtime: `scheduleOnRN(Haptics.selectionAsync)`.
```
中文大意：数值跨过一个刻度（选择器、滑块档位、分段控件）用 selectionAsync；吸附到位、弹层档位卡住、拖拽确认用 Light；重物落下、破坏性操作用 Medium；成功/失败用 notificationAsync。三条绝对规则：与画面同一帧（在「卡住」那一刻触发，不是动画结束时）；一次用户操作只震一次（滚动、逐帧、用户没触发的入场动画都不震）；永远不能只靠震动（很多人关了，多数 Android 机没感觉）。在 worklet 里要用 scheduleOnRN 调回 RN 线程。

通用版（本库整理，非原文）：
```text
审查并修正 [屏幕/组件] 的按压反馈和触感震动，按 Expo expo-animation 的 §7–§8：
- 所有按钮类 Pressable：按下即反馈（100–150ms 缩到 0.97 或变暗），松手才执行；列表整行改为背景高亮，不缩放。不用 TouchableOpacity。
- 触控区 ≥44×44pt / 48dp，不够就加 hitSlop；加 pressRetentionOffset。
- 触感：只在「选择变化 / 吸附或确认 / 破坏性操作 / 成功失败」这四类时刻震，按上面的 API 对应；滚动、入场动画不震；每次操作只震一次；在动画的因果时刻触发；每处震动都必须有对应的视觉变化。worklet 里用 scheduleOnRN。
输出表格：位置 | 当前反馈 | 应改为 | 理由，然后再改。改完在真机（不是 Expo Go）上验证手感。
```

## 已知坑 & 评论区改进
- **在 Expo Go 里判断手感不准。** 同一文件 "Setup that silently breaks motion" 一节原话："Expo Go is not a performance environment. Judge feel in a release build"。
- **Expo 的 web 转原生指南也把触感当编排的一部分。** native-patterns.md："`expo-haptics` on commits, selection changes, and pull-to-refresh — choreography, not just a toast buzz."（确认、选择变化、下拉刷新时震，是编排，不只是弹个提示时嗡一下。）
- **本库提醒**：动画本身该不该做、做多久，见 [emil-animate-expo-gate](emil-animate-expo-gate.md)；「每个都缩放」正是 [expo-native-slop-tells](expo-native-slop-tells.md) 里的 #13 The Squish Reflex。

## 来源
- [expo/skills：expo-animation/SKILL.md](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-animation/SKILL.md) — Expo 官方
- [expo/skills：expo-web-to-native/references/native-patterns.md](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-web-to-native/references/native-patterns.md) — Expo 官方

## 标签
设计、移动端、动效、交互细节
