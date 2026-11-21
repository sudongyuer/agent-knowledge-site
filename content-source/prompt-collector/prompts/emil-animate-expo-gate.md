---
title: React Native / Expo 动效：先按使用频率判断该不该动，再选线程、工具和弹簧参数
category: 设计
tags:
- 设计
- 动效
- 移动端
- 交互细节
author: Emil Kowalski（emilkowalski/skills：animate-expo）
source_url: https://github.com/emilkowalski/skills/blob/main/skills/animate-expo/SKILL.md
date: '2026-11-18'
id: emil-animate-expo-gate
variants:
- 同作者 /mobile-native：让 Web App 在手机上像原生（hover 卡住、输入框放大页面、长按选中按钮文字等），X 约 4000 收藏
- 同作者 /gestures：拖拽、滑动、抽屉跟手 1:1、带惯性、可中途接住，X 约 1 万收藏
status: active
---

## 解决什么问题
在 Expo / React Native App 里加动画、手势、底部弹出层（sheet）、页面转场时用。Emil 的 animate-expo skill 把决策排成固定顺序：**该不该动 → 目的是什么 → 用最便宜的工具 → 动哪些属性 → 用时间曲线还是弹簧**。最有价值的是第一步「频率门」：一天用上百次的操作根本不该有动画。

几个词：worklet（大白话：跑在 UI 线程上的小函数，App 的 JS 忙的时候动画也不卡）；Reanimated（RN 最常用的动画库）；spring 弹簧动画（按物理弹簧算的动画，能接住手指松开时的速度）。

## Prompt
原文 1（频率门，英文）：
```text
### 1. Should this animate at all?

| Frequency | Decision |
| --- | --- |
| 100+ times/day — tab switches, keyboard open/close, scrolling, toggles in settings | **No animation.** Platform default or nothing. Stop here. |
| Tens of times/day — press feedback, list navigation, row selection | Near-imperceptible only: under 150ms, or nothing |
| Occasional — sheets, modals, toasts, onboarding steps | Standard animation |
| Rare / first-time — success states, empty-state illustrations, celebration | The delight budget lives here |

**Tab switches never slide.** Tabs are peers, not a hierarchy — sliding implies depth that isn't there, and the user pays for it dozens of times a session. `animation: 'none'`.

If the request fails this gate, say so and don't write it.
```
中文大意：一天 100 次以上（切 tab、开关键盘、滚动、设置里的开关）→不加动画，用平台默认或什么都不做；一天几十次（按下反馈、列表导航、选中行）→几乎察觉不到，低于 150ms 或不做；偶尔（sheet、弹窗、toast、引导步骤）→标准动画；很少/首次（成功状态、空状态插画、庆祝）→惊喜预算花在这里。**切 tab 永远不滑动**：tab 是平级的，滑动暗示了不存在的层级，用户一次会话要为它付出几十次。不过这道门就直说，不写代码。

原文 2（硬规则，英文）：
```text
1. **Run the sequence in order.** Steps 1 and 2 gate everything.
2. **Reanimated, not core `Animated`.** Core `Animated` can't run gesture logic (thresholds, release springs) on the UI thread, and `useNativeDriver` refuses anything but transform and opacity anyway. Reanimated worklets run on the UI thread and keep running while JS is busy.
3. **No approximated values.** Curves and spring configs come from the tables below.
4. **Reduced motion ships with the animation**, not as a follow-up.
5. **Feel is judged on a release build on the slowest device you support.** Nothing else counts as verified.
```
中文大意：按顺序走，前两步决定一切；用 Reanimated 不用 RN 自带的 Animated（后者不能在 UI 线程跑手势逻辑）；数值不许估，曲线和弹簧参数从表里取；「减少动效」适配和动画一起交付；手感只在**最慢的支持机型 + release 包**上验证才算数。

原文 3（弹簧参数表，节选）：
```text
| Interaction | Config |
| --- | --- |
| Default settle, no overshoot | `{ duration: 400, dampingRatio: 1 }` |
| Reposition / snap back after a drag | `{ duration: 400, dampingRatio: 0.8, velocity }` |
| Sheet, drawer | `{ duration: 300, dampingRatio: 0.8, velocity }` |
| Must not pass a hard edge | add `overshootClamping: true` |
```
中文大意：默认落定不回弹；拖拽后归位带 0.8 阻尼并传入速度；sheet/抽屉 300ms、0.8 阻尼；不能越过硬边界时加 overshootClamping。原则："If a finger is dragging, flinging, or releasing it, use a spring."（手指在拖、甩、松开的就用弹簧，按下反馈这种离散状态用时间曲线。）

没装 skill 时的简版（本库整理，非原文）：
```text
给 [交互] 加动效前，先告诉我它一天会被用多少次：上百次（切 tab、开关键盘、滚动）就不加；几十次只做 150ms 内的轻反馈；偶尔出现的（sheet、弹窗、toast）正常做；首次/成功状态才做惊喜动画。
如果做：用 Reanimated，只动 transform 和 opacity；手指拖动的用 spring 并传入松手速度；页面转场、sheet、tab 栏用 Expo Router 原生能力，不手写；同时做好「减少动效」适配。最后说明你在什么设备、debug 还是 release 包上看过手感。
```

## 已知坑 & 评论区改进
- **该用原生的地方别手搓。** skill 的工具表：页面切换用 Expo Router 原生栈，"Never hand-roll this"；自成一屏的 sheet 用 `presentation: 'formSheet'`；tab 栏用 `NativeTabs`；下拉刷新用 `RefreshControl`；跟随键盘的 UI 用 `react-native-keyboard-controller`。
- **属性选择**：只有 transform 和 opacity 是「免费」的，动 width/height/margin 会让每一帧重新算布局；Android 上别动画 elevation（阴影）和 BlurView 的强度，改成对预先做好的层做透明度渐变。（skill 原文 "Never animate `BlurView` intensity."）
- **永远不要 `ease-in`**：skill 原话 "Never `ease-in` on UI. It starts slow, delaying the exact moment the user is watching."
- **本库提醒**：skill 的部分 API（如 `NativeTabs` 来自 `expo-router/unstable-native-tabs`、`Link.Preview` 仅 iOS）依赖较新的 Expo SDK，先确认项目版本。Expo 官方也有自己的 expo-animation skill，见 [expo-screen-done-walkthrough](expo-screen-done-walkthrough.md) 的来源。
- Web 版的缓动和时长规则见 [emil-taste-as-rules](emil-taste-as-rules.md)。

## 来源
- [emilkowalski/skills：animate-expo/SKILL.md](https://github.com/emilkowalski/skills/blob/main/skills/animate-expo/SKILL.md)
- [Emil 的 /mobile-native 帖](https://x.com/emilkowalski/status/2116144374170235224)、[/gestures 帖](https://x.com/emilkowalski/status/2119406396160540738)

## 标签
设计、动效、移动端、交互细节
