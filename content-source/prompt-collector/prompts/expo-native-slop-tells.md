---
title: React Native 界面的 20 个「AI 味」破绽：先 grep 找候选，再看截图逐条确认
category: 设计
tags:
- 设计
- 移动端
- 设计审查
- 视觉风格
author: Expo 官方 skills（expo-design-system/references/native-slop.md）
source_url: https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/references/native-slop.md
date: '2026-11-21'
id: expo-native-slop-tells
status: active
---

## 解决什么问题
agent 生成的 React Native / Expo 界面「一眼 AI 做的」但说不出哪里不对时用。Expo 官方把反复出现的 20 种破绽起了名字（比如 The Web Modal 网页式弹窗、The Floating Pill Tab Bar 悬浮胶囊标签栏、Dark-Mode Amnesia 深色模式失忆），每种都给了「能看到的症状」和「原生的替代做法」，还附了能直接跑的 grep 命令找候选位置。

grep：命令行里按文本搜索代码的工具。Pressable：RN 里推荐的可点击组件，替代旧的 TouchableOpacity。safe area 安全区：刘海、灵动岛、底部横条以外的可用区域。

## Prompt
原文 1（native-slop.md 的用法说明，英文）：
```text
Recurring mistakes in generated React Native apps, with names, observable tells, and preferred replacements. Use these as review prompts: explain what harms the task, readability, or platform behavior. A card, font, gradient, or onboarding flow is not a defect by itself; respect the user's brief and existing design system. Interaction failures such as obscured inputs or false-empty states still need fixing.
```
中文大意：这是生成式 RN App 里反复出现的错误，带名字、可观察的症状和推荐替代。把它们当审查提示用：说明它伤害了任务、可读性还是平台行为。卡片、字体、渐变、引导页本身不是缺陷，要尊重需求和现有设计系统；但输入框被挡住、「假空状态」这类交互故障必须修。

20 个破绽名（原文表格第一列）：The Web Modal、The X-Button Sheet、Emoji Iconography、The Purple-Gradient Hero、The Floating Pill Tab Bar、Inter Everywhere、Everything's a Card、Shadowboxing、Wireframe Borders、alert() Confirmation、The Hand-Rolled Header、16-Everything、The Squish Reflex、The Grand Entrance、The Onboarding Carousel、Cross-Platform Costume、Safe-Area Collision、Dark-Mode Amnesia、The Spinner Blink、Keyboard Blindness。

原文表格节选（英文）：
```text
| 11 | The Hand-Rolled Header | `headerShown: false` plus a `<Text>` title and custom back button - losing large-title collapse, back-swipe, and scroll-to-top | Stack header options. The navigation bar is configured, never rebuilt |
| 12 | 16-Everything | The same 16px padding on every axis at every level; section gaps equal row gaps, so proximity carries no meaning | The spacing scale with distinct steps: row gap < group gap < section gap |
| 13 | The Squish Reflex | `scale: 0.96` press feedback on *every* touchable - including full-width list rows - or `TouchableOpacity`'s washed-out flash | Rows highlight (background change); buttons scale slightly or dim; `Pressable` with per-role feedback. Never `TouchableOpacity` |
| 19 | The Spinner Blink | A full-screen centered `ActivityIndicator` between every state, or "No items yet" flashing while the first fetch resolves | Four-state screens (see `expo-data-fetching`): loading ≠ empty, keep stale content while revalidating, `RefreshControl`, skeletons for slow initial loads with a known layout |
| 20 | Keyboard Blindness | The focused input or the submit button disappears behind the keyboard; buttons above a keyboard need two taps | `react-native-keyboard-controller` tracks the real keyboard frame (`expo-animation` keyboard recipe); `keyboardShouldPersistTaps="handled"` for forms/search, `"always"` when unhandled taps must also keep the keyboard open |
```
中文大意：自己隐藏导航栏再手搓标题和返回键，会丢掉大标题折叠、右滑返回、点顶部回滚；所有地方都用 16 的间距，远近关系就失去意义，应该「行间距 < 组间距 < 区块间距」；每个可点元素都缩放（包括整行列表）是「挤压反射」，列表行应该改背景高亮；每次切状态都全屏转圈，或首次加载时闪一下「暂无内容」；键盘挡住输入框或提交按钮。

原文 2（grep 候选，节选，原样）：
```bash
# Touchable* anywhere → #13 The Squish Reflex (Pressable only)
grep -rn 'TouchableOpacity\|TouchableHighlight\|TouchableWithoutFeedback' $SRC --include='*.tsx'
# RN <Modal> for picking/composing → #1 The Web Modal
grep -rn '<Modal' $SRC --include='*.tsx'
# Alert.alert → #10 alert() Confirmation
grep -rn 'Alert\.alert' $SRC --include='*.tsx'
# Gradient blocks in screens → #4 The Purple-Gradient Hero
grep -rn 'LinearGradient\|experimental_backgroundImage' $SRC --include='*.tsx'
# Rebuilt navigation chrome → #11 The Hand-Rolled Header
grep -rn 'headerShown:\s*false' $SRC --include='*.tsx'
# Custom tab bar chrome → #5 The Floating Pill Tab Bar
grep -rn 'tabBarStyle' $SRC --include='*.tsx'
# Emoji as UI glyphs → #3 Emoji Iconography
rg -n '[\p{Emoji_Presentation}\x{FE0F}]' $SRC -g '*.tsx'
```

通用版（本库整理，非原文）：
```text
按 Expo 官方 expo-design-system 的 references/native-slop.md（20 个 native slop tells）审查 [屏幕/目录]。
1. 先确定源码目录（不要默认有 src/），把 $SRC 设成真实目录，跑文件里的 grep，列出命中的候选。grep 命中只是候选，不是结论，每条要对照该破绽的描述确认。
2. 只能靠截图判断的（X-Button Sheet、Everything's a Card、Wireframe Borders、Onboarding Carousel、Cross-Platform Costume、Safe-Area Collision）：在 iOS 和 Android 模拟器各截图后判断。
3. 必须跑起来才能看的（Grand Entrance：重新进入页面；Spinner Blink：看首次加载和刷新；Keyboard Blindness：打开键盘）：实际操作一遍再判断。
4. 输出表格：破绽编号和名字 | 位置（文件:行号或截图）| 证据 | 原生替代做法 | 是否属于需求/设计系统里有意为之（是则不改）。
5. 先报告，我确认后再改；每改一类单独提交，改完重新跑 grep 和截图。
```

## 已知坑 & 评论区改进
- **不是一刀切禁令。** 原文明确：卡片、字体、渐变、引导页本身不是缺陷，需求要的就保留；grep 结果分「review-each」（有合法用法，逐条看）和「advisory」（只是提示，要截图确认）。
- **token 合规 ≠ 看起来对。** 原文："Token compliance does not prove readable dark mode, useful spacing hierarchy, or restrained shadows; inspect the rendered screen too."（用了 token 也不代表深色模式可读、间距有层次、阴影克制，还得看渲染结果。）
- **清单故意保持在 20 条左右。** 原文说新破绽要在多次生成里反复出现才加，"recognition degrades with length"（太长就记不住）。自己扩充时同理。
- **本库提醒**：和 [impeccable-ios-slop-test](impeccable-ios-slop-test.md) 互补——那条是「熟练 iPhone 用户会不会愣一下」的总体判断，这条是可逐条执行的清单；配套的 token 漂移体检见 [expo-design-system-drift-audit](expo-design-system-drift-audit.md)。

## 来源
- [expo/skills：expo-design-system/references/native-slop.md](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/references/native-slop.md) — Expo 官方

## 标签
设计、移动端、设计审查、视觉风格
