---
title: 原生 App 的「AI 味」测试：熟练的 iPhone 用户会不会觉得这是网页搬过来的？
category: 设计
tags:
- 设计
- 移动端
- 设计审查
- 交互细节
author: Paul Bakaus（Impeccable 作者）; Expo 官方 skills（expo-native-ui）; Expo 官方 skills（expo-web-to-native/references/native-patterns.md）
source_url: https://github.com/pbakaus/impeccable/blob/main/skill/reference/ios.md
date: '2026-11-18'
id: impeccable-ios-slop-test
additional_sources:
- https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-native-ui/SKILL.md
- https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-web-to-native/references/native-patterns.md
variants:
- Expo 官方：Never dress one platform in the other's uniform - no FAB or ripple in iOS
  layouts; no hand-built iOS chrome (back-chevrons, large-title text, iOS-styled switches)
  on Android.
- Expo expo-web-to-native：如果原生屏幕的截图能冒充网页版，那就是换皮；重设计到它像系统自带的屏幕为止，并用录屏验证「手感」
status: active
---

## 解决什么问题
用 agent 写 iOS / React Native / Expo 界面，做出来「能用但不像原生 App」时用。Impeccable（X 和 GitHub 上很火的设计 skill，2026-11-18 约 11 万 star）专门有一份 iOS 平台规则，开头一句话就是检查标准：一个熟练的 iPhone 用户会信任这个 App，还是会在不合规范的控件前愣一下？破绽通常是「从网页搬过来的」：自己造的导航栏、自定义返回手势、网页样式的按钮、依赖 hover 的交互。

HIG（Human Interface Guidelines）：苹果官方的人机界面设计规范。safe area 安全区：刘海、灵动岛、底部横条以外可以放内容的区域。Dynamic Type：iOS 让用户调系统字号、App 跟着变的机制。

## Prompt
原文 1（Impeccable ios.md 的检查标准，英文）：
```text
## The iOS slop test

Would a fluent iPhone user trust this app, or pause at off-spec controls? The tell is "ported from a website": reinvented navigation bars, custom back gestures, web-shaped buttons, hover-dependent affordances. Default to the platform's components; depart only for a reason the user would thank you for.
```
中文大意：熟练的 iPhone 用户会信任这个 App，还是会在不合规范的控件前停顿？破绽是「从网页移植来的」：重造的导航栏、自定义返回手势、网页形状的按钮、依赖 hover 的交互。默认用平台组件，只有用户会因此感谢你的理由才偏离。

原文 2（同文件规则节选，英文）：
```text
- **Safe area.** Lay out inside the safe-area insets. No controls under the notch, Dynamic Island, home indicator, or rounded corners.
- **Edge-swipe back stays alive.** The left-edge back gesture is muscle memory; never disable or overlay it.
- **44×44 pt minimum** for every tappable control, with breathing room between adjacent targets.
- **Dynamic Type.** Use the system text styles (Large Title through Caption) so text follows the user's reading size. No hard-coded point sizes.
- **Semantic system colors** (label, secondaryLabel, systemBackground, separator, tint). They adapt to Dark Mode and increased contrast automatically; raw hex breaks there.
- **Platform controls.** Switch, segmented control, stepper, system pickers, action sheets, alerts, context menus, swipe actions. Reinventing these for flavor is the most common native slop.
- **System transitions.** Push slides, sheets rise, dismiss reverses the entrance. Custom transitions that fight the navigation model disorient.
```
中文大意：布局在安全区内；左边缘右滑返回是肌肉记忆，永远别禁用或盖住；所有可点控件至少 44×44pt；用系统字号样式跟随用户字号，别写死；用语义系统色，自动适配深色模式和高对比度，写死的色值会坏；用平台控件（开关、分段控件、系统选择器、操作表、右滑操作等），为了「有特色」重造这些是最常见的原生 AI 味；用系统转场。

原文 3（验证方法，英文）：
```text
- **Screenshots come from the Simulator, never a browser.** Build and run, then capture with `xcrun simctl io booted screenshot <path>` ...
- **Dark Mode and Dynamic Type belong in the pass.** `xcrun simctl ui booted appearance dark` flips appearance ... a check at a large Dynamic Type size catches the truncation a fixed layout hides.
- **Simulators give breadth; posture, gestures, and performance need hardware.** Say which one produced the evidence.
```
中文大意：截图要从模拟器截，不能拿浏览器截图代替（命令 `xcrun simctl io booted screenshot <路径>`）；深色模式和大字号也要截（`xcrun simctl ui booted appearance dark` 切深色），大字号能暴露写死布局下被截断的文字；模拟器看覆盖面，手势和性能要真机，并说明证据来自哪个。

可直接用的审查 prompt（本库整理，非原文）：
```text
用「iOS slop test」审查 [页面/组件]：一个熟练的 iPhone 用户会不会觉得这是网页搬过来的？
逐条检查：安全区、左滑返回是否保留、点击区是否 ≥44pt、是否跟随 Dynamic Type、是否用语义系统色、是否用了平台原生控件和系统转场。Android 端反过来检查有没有套 iOS 的样子。
每个问题给出文件:行号和改法。然后在模拟器里截浅色、深色、最大字号三张图给我看，说明哪些结论只在模拟器上验证过。
```

## 已知坑 & 评论区改进
- **Android 也一样，别互相穿对方的制服。** Expo 官方 skill 原话："Follow each platform's own design language: Apple Human Interface Guidelines on iOS, Material Design 3 on Android. Never dress one platform in the other's uniform"——iOS 上不要 FAB（悬浮操作按钮）和水波纹，Android 上不要手搓 iOS 的返回箭头、大标题、iOS 风格开关。
- **跨平台适配是「重构」不是「拉伸」。** Impeccable 的 adapt.native.md："Restructure, don't stretch. A scaled-up phone UI on a tablet is the failure mode."（手机界面放大到平板就是失败，要用 size class 切换结构，比如列表+详情并排。）
- **品牌表达放在平台留出的空间里。** ios.md 开头："brand expresses through the layer the platform leaves open (tint, type, motion, content)."（品牌色调、字体、动效、内容。）只用一种 tint 色驱动可交互元素。
- **本库提醒**：Impeccable 的完整 skill 体量很大，会下载并运行它自带的程序；只想要规则的话，直接把 ios.md / android.md 的内容放进你自己的 skill 或 DESIGN.md。装任何设计 skill 前可以先用 [geoco-vet-design-skill](geoco-vet-design-skill.md) 审一遍。

- **变体（2026-11-21 补充）：Expo 的「截图测试」+ 录屏验证。** expo-web-to-native 的 native-patterns.md 原话："**The test:** if a screenshot of the native screen could pass for the web version, you reskinned it. Redesign until it could pass for a screen the OS shipped."（如果原生屏幕的截图能冒充网页版，那就是换皮；重设计到它像系统自带的屏幕为止。）同文件还提醒静态截图测不出手感："Feel can't be screenshotted. A janky transition or wrong easing passes a still-image parity check and still betrays the app — for screens with motion, verify with a short recording (iOS `xcrun simctl io booted recordVideo feel.mov`; Android `adb shell screenrecord`; or a device-agent flow), not just a screenshot." 该 skill 的 SKILL.md 总结为 "Nativize means redesign, not reskin."（原生化是重设计，不是换皮。）可逐条执行的 20 个破绽清单见 [expo-native-slop-tells](expo-native-slop-tells.md)。

## 来源
- [pbakaus/impeccable：skill/reference/ios.md](https://github.com/pbakaus/impeccable/blob/main/skill/reference/ios.md)（同目录还有 android.md、adapt.native.md、audit.native.md）
- [expo/skills：expo-native-ui/SKILL.md](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-native-ui/SKILL.md)
- [expo/skills：expo-web-to-native/references/native-patterns.md](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-web-to-native/references/native-patterns.md) — Expo 官方

## 标签
设计、移动端、设计审查、交互细节
