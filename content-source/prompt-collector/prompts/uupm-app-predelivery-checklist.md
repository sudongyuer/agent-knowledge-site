---
title: 原生 App 界面交付前检查单：图标、点按反馈、深浅色对比度、安全区、小屏横屏、大字号
category: 设计
tags:
- 设计
- 移动端
- 验证/自审
- 交互细节
author: nextlevelbuilder（ui-ux-pro-max-skill：references/pro-rules.md）
source_url: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/references/pro-rules.md
date: '2026-11-21'
id: uupm-app-predelivery-checklist
status: active
---

## 解决什么问题
agent 说「界面做完了」之前，让它对照一张专门针对 iOS/Android/React Native/Flutter 的检查单自查。来自 GitHub 上很火的 ui-ux-pro-max 设计 skill，这份 pro-rules.md 开头就声明只针对原生/移动端，覆盖了最容易被忽略、让界面显得「不专业」的细节。

Dynamic Type：iOS 让用户调系统字号、App 跟着变。scrim：弹层后面那层半透明遮罩。

## Prompt
原文 1（pro-rules.md 开头与范围声明，英文）：
```text
Load this file before final delivery of native/mobile app UI (iOS/Android/React Native/Flutter), or when the user reports the UI "doesn't look professional" and the cause isn't obvious from the priority table in SKILL.md.

**Scope notice:** everything below targets native/mobile app UI. For web/desktop interaction patterns, use `references/quick-reference.md` (stack-agnostic) instead — these tables assume touch targets, safe areas, and platform gesture conventions that don't apply 1:1 to desktop web.
```
中文大意：原生/移动端 App 界面最终交付前加载这份文件，或者用户说「看起来不专业」但原因不明显时用。只针对移动端，桌面网页另用别的文件。

原文 2（Pre-Delivery Checklist 的 Process 与 Light/Dark 段，原样）：
```text
### Process
- [ ] Tested on 375px (small phone) and in landscape orientation
- [ ] Verified behavior with **reduced-motion** enabled and **Dynamic Type**/largest system text size
- [ ] Checked dark mode contrast independently (never assume light-mode values carry over)
- [ ] Confirmed all touch targets ≥44pt and no content hidden behind safe areas

### Light/Dark Mode
- [ ] Normal primary and secondary text contrast >=4.5:1 in both light and dark mode
- [ ] Dividers/borders and interaction states are distinguishable in both modes
- [ ] Modal/drawer scrim is measured against the real background and preserves foreground legibility
- [ ] Both themes are tested before delivery (not inferred from a single theme)
```
中文大意：在 375 宽小屏和横屏上测；打开「减弱动态效果」和最大系统字号测；深色模式对比度单独检查，别假设浅色的值能沿用；触控区 ≥44pt、没有内容被安全区挡住。正文和次要文字在深浅两种模式下对比度都 ≥4.5:1；分割线、边框和交互状态在两种模式都看得出来；遮罩要对着真实背景测；两种主题都要实际测，不能从一种推断。

原文 3（图标与交互规则节选，原样）：
```text
| **No Emoji as Structural Icons** | Use vector-based icons (e.g., Lucide, react-native-vector-icons, @expo/vector-icons). | Using emojis (🎨 🚀 ⚙️) for navigation, settings, or system controls. | Emojis are font-dependent, inconsistent across platforms, and cannot be controlled via design tokens. |
| **Filled vs Outline Discipline** | Use one icon style per hierarchy level. | Mixing filled and outline icons at the same hierarchy level. | Maintains semantic clarity and stylistic coherence. |
| **Icon Contrast** | Meaningful icons and control boundaries need at least 3:1 against adjacent colors; decorative icons must not carry information. | Low-contrast icons that carry meaning or state. | Applies the non-text contrast role instead of a text-size rule. |
| **Tap feedback** | Provide clear pressed feedback (ripple/opacity/elevation) within 80-150ms | No visual response on tap |
| **Gesture conflict prevention** | Keep one primary gesture per region and avoid nested tap/drag conflicts | Overlapping gestures causing accidental actions |
```
中文大意：不用 emoji 当结构性图标；同一层级只用一种图标风格（线性或填充）；有含义的图标和控件边界对相邻颜色至少 3:1；点按 80–150ms 内要有反馈；一个区域只有一个主手势，避免点击和拖拽嵌套冲突。

通用版（本库整理，非原文）：
```text
交付前，按 ui-ux-pro-max 的 pro-rules.md「Pre-Delivery Checklist」逐项自查 [屏幕列表]，每项给证据，不要只打勾：
- 截图：iPhone SE 级小屏（375pt）竖屏和横屏、大屏手机、平板；浅色和深色各一套。
- 打开「减弱动态效果」和最大字号各截一张，确认没有截断、重叠、布局破裂。
- 列出所有文字/图标颜色对及其对比度（正文 ≥4.5:1，有含义的图标和控件边界 ≥3:1），深浅色分别算。
- 检查图标：无 emoji 图标、同一图标库、同层级线性/填充统一、尺寸来自 token。
- 检查触控：≥44pt/48dp、80–150ms 内有按下反馈、禁用态不可点、手势不冲突、拖拽/滑动操作有按钮替代。
- 检查安全区和固定栏：顶部/底部固定元素不压内容，滚动内容不被遮住。
最后输出：通过项、未通过项（位置 + 截图 + 修改建议），未通过项修完再重跑。
```

## 已知坑 & 评论区改进
- **不要只看浅色模式。** 原文两次强调深色模式要独立测试，"never assume light-mode values carry over"。
- **检查单里有两条是网页/特定场景的。** 例如「Authentication allows password managers and paste」「Auto-rotating content has pause/stop controls」，用不到的跳过即可。
- **本库提醒**：这份检查单和 [expo-screen-done-walkthrough](expo-screen-done-walkthrough.md)（走一遍主任务、失败恢复、键盘、返回）互补：一个查视觉与可访问性底线，一个查流程。ui-ux-pro-max 主体还有一个搜索脚本和 CSV 风格库，本库没收，只收了这份规则。

## 来源
- [ui-ux-pro-max-skill：references/pro-rules.md](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/references/pro-rules.md) — nextlevelbuilder

## 标签
设计、移动端、验证/自审、交互细节
