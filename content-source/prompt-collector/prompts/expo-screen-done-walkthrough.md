---
title: 移动端一个屏幕算「做完」之前：走一遍主任务、一次失败恢复、键盘、返回和极端内容
category: 设计
tags:
- 设计
- 移动端
- 交互细节
- 验证/自审
author: Expo 官方 skills（expo-native-ui）; Anthropic（How Anthropic teams use Claude Code，产品设计团队部分）;
  Expo 官方 skills（expo-data-fetching）
source_url: https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-native-ui/SKILL.md
date: '2026-11-18'
id: expo-screen-done-walkthrough
additional_sources:
- https://claude.com/resources/articles/how-anthropic-teams-use-claude-code
- https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-data-fetching/SKILL.md
variants:
- Emil Kowalski /break-ui、Jakub Krehel /break：用最坏情况的数据（超长名字、计数为 1、空列表）去「弄坏」刚做的组件
- Expo expo-data-fetching「Every Screen Has Four States」：加载≠空、空状态要设计、刷新保留旧内容、按持久化状态做跳转前先等水合完成
status: active
---

## 解决什么问题
agent 说「这个页面做好了」，但空状态、加载失败、键盘挡住按钮、大字号下文字被截断这些情况都没处理时用。这是 Expo 官方 skill 里的一段收尾检查，原文就是一段可以直接复制的指令。和 [anthropic-be-ambitious-scope](anthropic-be-ambitious-scope.md) 的区别：那条是**开工时**说清要覆盖哪些状态；这条是**交付前**逐项走一遍并报告实际测了什么。

## Prompt
原文（Expo 官方 expo-native-ui skill，英文）：
```text
Before calling a screen complete, walk through its primary task, including one failure and recovery when it loads or saves data. Check keyboard access and back/dismiss behavior. Try long titles, missing images, no search results, and large system text; required actions must remain reachable. Report what you exercised and what you could not run.
```
中文大意：在宣布一个屏幕完成之前，走一遍它的主要任务；如果它要加载或保存数据，至少走一次失败和恢复。检查键盘操作和返回/关闭行为。试试超长标题、图片缺失、搜索无结果、系统大字号，必须要做的操作仍然要点得到。报告你实际测了什么、哪些没能跑。

同一 skill 里配套的几条规则（原文）：
```text
- Every screen that loads data has four states (loading, error, empty, content) - never show the empty state while the first load is still resolving
- A form's primary action must never sit under the keyboard.
- Every enabled control must perform its advertised action: search filters results, Save commits edits, and settings affect behavior. Empty handlers and success alerts are not implementations
- For async saves, preserve drafts and handle pending/failure states per `expo-data-fetching`; do not dismiss a form before its save succeeds
```
中文大意：每个加载数据的屏幕都有四种状态（加载中、出错、空、有内容），首次加载还没结束时不能显示空状态；表单的主按钮永远不能被键盘挡住；每个可用的控件都要真的做它声称的事，空的处理函数加一个「成功」弹窗不算实现；异步保存要保留草稿、处理进行中和失败，保存成功前不能关掉表单。

## 已知坑 & 评论区改进
- **「报告你没跑的」是关键。** 和库里 [cc-prove-it-works-html](cc-prove-it-works-html.md) 的「报告像收据」一致：模拟器里没测键盘、没测真机，就要写出来。
- **Anthropic 产品设计团队的用法**：他们用 Claude Code 在设计阶段就梳理错误状态、逻辑流和系统状态，提前找出边界情况，而不是等到开发时才发现（原文："mapping out error states, logic flows, and system statuses to identify edge cases during design rather than discovering them in development"，[来源](https://claude.com/resources/articles/how-anthropic-teams-use-claude-code)）。本库提醒：可以在开工前先让 agent 列出这个屏幕的所有状态，再用本条在交付前逐个验证。
- **用最坏数据压测**（变体）：Emil Kowalski 的 /break-ui 要求最坏数据要「合理或有依据」，原文 "Plausible or schema-backed, never random"，并且 "Change the data, not the component"（改数据，不改组件代码来制造问题）；还列出容易漏的情况：只有一个人时显示「1 members」、空列表、翻译后变长的标签。[来源](https://github.com/emilkowalski/skills/blob/main/skills/break-ui/SKILL.md)
- **和「只做设计稿画出来的」有冲突。** 照设计稿还原时（见 [jakub-build-design-match](jakub-build-design-match.md)），设计稿没画的空/错状态不该自己发明，而是列为「缺失」交给设计师。本库建议：先按本条把缺的状态列出来，再决定由谁来设计。

- **变体（2026-11-21 补充）：Expo 官方「每个屏幕都有四种状态」。** expo-data-fetching SKILL.md 原文："Design **loading**, **error**, **empty**, and **content** for screens that load data. These can overlap: a refresh error should coexist with cached content." 其后四条规则：**Loading ≠ empty**（空是「请求完成且 0 条」，不是「还没数据」）；**Empty is a designed state, not a blank list**（用 `ListEmptyComponent` 说明为什么空并给下一步；无搜索结果要提供修改或清除筛选）；**Refetches keep stale content**（刷新失败也继续显示缓存数据，配不阻塞的错误和重试；首次加载用 `isLoading`，后台刷新用 `isFetching`）；**Gate on hydration**（首屏或跳转依赖持久化状态时，先等状态读出来再渲染，否则冷启动会闪错屏、深链接会跳错）。同节还写了保存的规则："While a mutation is pending, disable repeat submission. On failure, retain the draft, show an inline error, and let the user retry"。每处等待具体用哪种加载方式，见 [kubai-loading-states-audit](kubai-loading-states-audit.md)。

## 来源
- [expo/skills：expo-native-ui/SKILL.md](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-native-ui/SKILL.md)（Expo 官方，2026-11-18 约 4200 star；同仓库还有 expo-design-system、expo-ui、expo-animation 等 skill）
- [Anthropic：How Anthropic teams use Claude Code](https://claude.com/resources/articles/how-anthropic-teams-use-claude-code)
- [expo/skills：expo-data-fetching/SKILL.md](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-data-fetching/SKILL.md) — Expo 官方

## 标签
设计、移动端、交互细节、验证/自审
