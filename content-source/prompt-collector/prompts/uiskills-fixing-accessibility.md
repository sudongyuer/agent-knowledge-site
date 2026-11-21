---
title: 无障碍修复：逐条引用出问题的代码、一句话说为什么、给最小修复，不重写界面
category: 设计
tags:
- 设计
- 交互细节
- 设计审查
- 范围控制
author: Julien Thibeaut（ibelick/ui-skills：fixing-accessibility）; Expo 官方 skills（audit.md：Pressable
  缺 accessibilityRole/Label 的检查）
source_url: https://github.com/ibelick/ui-skills/blob/main/skills/fixing-accessibility/SKILL.md
date: '2026-11-21'
id: uiskills-fixing-accessibility
additional_sources:
- https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/references/audit.md
status: active
---

## 解决什么问题
加了按钮、表单、弹窗之后，想让 agent 查一遍无障碍（accessibility，简称 a11y，大白话：读屏软件、键盘、低视力用户也能用）问题，但又怕它借机大改界面时用。ibelick 的 ui-skills 把规则按优先级排好，并规定了报告格式和「最小修复」边界。原文针对网页 HTML，下方给了本库整理的 React Native 版。

读屏：iOS 的 VoiceOver、Android 的 TalkBack，会把界面元素念出来。accessible name：读屏念出的控件名字。

## Prompt
原文（fixing-accessibility SKILL.md 的用法，英文）：
```text
- `/fixing-accessibility <file>`
  Review the file against all rules below and report:
  - violations (quote the exact line or snippet)
  - why it matters (one short sentence)
  - a concrete fix (code-level suggestion)

Do not rewrite large parts of the UI. Prefer minimal, targeted fixes.
```
中文大意：对文件逐条检查，报告：违规（引用确切的代码行）、为什么重要（一句话）、具体修复（代码级建议）。不要重写大段界面，优先最小、定点的修复。

原文的优先级表（原样）：
```text
| 1 | accessible names | critical |
| 2 | keyboard access | critical |
| 3 | focus and dialogs | critical |
| 4 | semantics | high |
| 5 | forms and errors | high |
| 6 | announcements | medium-high |
| 7 | contrast and states | medium |
| 8 | media and motion | low-medium |
| 9 | tool boundaries | critical |
```
「tool boundaries」一节原文：
```text
- prefer minimal changes, do not refactor unrelated code
- do not add aria when native semantics already solve the problem
- do not migrate UI libraries unless requested
```

React Native 通用版（本库整理，非原文；把原文网页规则换成 RN 对应属性）：
```text
审查 [文件/屏幕] 的无障碍问题，只做最小修复，不重构无关代码、不换 UI 库。
按优先级检查：
1. 名字：每个可点控件都有读屏能念出的名字；纯图标按钮加 accessibilityLabel（写动作，如「删除项目」，不是「垃圾桶图标」）；装饰性图片/图标对读屏隐藏。
2. 角色和状态：自定义 Pressable 设 accessibilityRole（button/link/switch/tab…），选中、禁用、展开、忙碌用 accessibilityState 表达；能用平台原生控件就不自己拼。
3. 焦点：弹层/Sheet 打开时焦点进入，关闭后回到触发它的控件；顺序与视觉顺序一致。
4. 表单：输入框有可见标签；错误信息紧挨字段，并让读屏能读到；禁用的提交按钮说明原因。
5. 播报：加载、成功、失败等状态变化让读屏知道（不要只靠一闪而过的 toast）。
6. 对比度和状态：文字和图标对比度够；禁用态不只靠颜色。
7. 动效：尊重系统「减弱动态效果」。
报告格式：每条引用确切代码行 → 一句话为什么 → 具体修复代码。先报告，我确认后再改。
最后用 VoiceOver / TalkBack 实际走一遍主流程，说明听到了什么。
```

## 已知坑 & 评论区改进
- **能用原生语义就别加额外属性。** 原文 "do not add aria when native semantics already solve the problem"；RN 里同理，平台控件已经带角色时不要重复声明。
- **Expo 的体检里有现成的候选搜索。** audit.md 用 `grep -rln '<Pressable' $SRC --include='*.tsx' | xargs grep -LE 'accessibility(Role|Label)'` 找「有 Pressable 但没写角色/标签」的文件，并提醒这只是候选，文字子元素或透传的 props 也可能提供了标签。
- **本库提醒**：RN 版是本库按原文规则映射的，没有出处原文；具体属性名以你所用 RN 版本文档为准。网页项目直接用原文版即可。

## 来源
- [ibelick/ui-skills：fixing-accessibility/SKILL.md](https://github.com/ibelick/ui-skills/blob/main/skills/fixing-accessibility/SKILL.md) — Julien Thibeaut（@Ibelick）
- [expo/skills：expo-design-system/references/audit.md](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/references/audit.md) — Expo 官方

## 标签
设计、交互细节、设计审查、范围控制
