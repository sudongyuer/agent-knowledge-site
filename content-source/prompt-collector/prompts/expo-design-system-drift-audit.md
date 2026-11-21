---
title: 设计系统「漂移」体检：先找现有体系，再按每 100 行逃逸数打分，最后一屏一提交地收敛
category: 设计
tags:
- 设计
- 移动端
- 设计审查
- 视觉风格
author: Expo 官方 skills（expo-design-system/references/audit.md）; Expo 官方 skills（expo-design-system/SKILL.md）;
  Bolt 官方文档（Use a design system）
source_url: https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/references/audit.md
date: '2026-11-21'
id: expo-design-system-drift-audit
additional_sources:
- https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/SKILL.md
- https://support.bolt.new/design-system/use-design-system
variants:
- Bolt：Audit the entire project against the active design system……Do not skip any
  files. Be thorough.（全项目对照设计系统扫硬编码值和原生标签并替换）
status: active
---

## 解决什么问题
App 写了一阵子，颜色、字号、间距、圆角到处是写死的数，agent 每次新写一个页面又多一套「差不多」的值时用。先量化「漂移」（drift，大白话：代码慢慢偏离设计系统）有多严重，再按固定顺序一点点收回来，而不是一次性大改。

token（设计变量）：颜色、字号、间距等有名字的取值，比如 `colors.textPrimary`、`spacing.md`。SLOC：源码行数。

## Prompt
原文 1（expo-design-system SKILL.md，「Adopt Before You Build」，英文节选）：
```text
In an app that already has screens, the first move is detection, not construction. Before writing any token file:
...
2. **If one exists, it is the source of truth.** Extend it in its own idiom - its names, its scale, its storage format. Audit drift against that system, not against the examples below.
...
4. **Never introduce a second system beside an existing one.** A fresh `src/theme/` next to a Tamagui config is design-system drift, not adoption.
```
中文大意：已有页面的 App，第一步是「发现」而不是「新建」。如果已经有体系（NativeWind、Tamagui、Restyle、Unistyles 或 theme 文件），它就是唯一标准，按它的命名和格式扩展；绝不在旁边再造第二套。

原文 2（audit.md，开头与打分规则，英文）：
```text
Run the audit **before** proposing changes. Report findings first; apply fixes only when asked.
...
For each category: **score = escapes per 100 source lines** (hits ÷ SLOC × 100, one decimal).

| Score per category | Reading |
|---|---|
| < 0.5 | Healthy - fix opportunistically |
| 0.5 - 2.0 | Drifting - schedule cleanup for the worst files |
| > 2.0 | Systemic - the token or component for this category is missing or unused; fix the system first (see §5) |
```
中文大意：提改动之前先体检，先报告，要求修才修。每一类（颜色、间距、字号、圆角/阴影）算「每 100 行源码里有几处逃逸」：<0.5 健康，顺手修；0.5–2 在漂移，排期清理最差的文件；>2 是系统性问题，说明这类 token 或组件缺失或没人用，先修体系。

原文 3（audit.md §1 的 grep，节选，原样）：
```bash
SRC="app components constants"   # this project's source directories
THEME="constants"                # this project's theme directory (excluded from hits)
# Hardcoded hex colors outside the theme
grep -rEn '#[0-9a-fA-F]{3,8}\b' $SRC --include='*.tsx' --include='*.ts' | grep -v "^$THEME/"
# Raw fontSize (should come from the type ramp / ThemedText)
grep -rn 'fontSize:' $SRC --include='*.tsx' | grep -v "^$THEME/"
# Raw borderRadius (should use radius tokens)
grep -rn 'borderRadius:' $SRC --include='*.tsx' | grep -v "^$THEME/"
# Candidate files with custom tappables but no explicit accessibility role/label
grep -rln '<Pressable' $SRC --include='*.tsx' | xargs grep -LE 'accessibility(Role|Label)'
```

原文 4（audit.md §5 渐进收敛，英文节选）：
```text
2. **Typography before spacing.** Convert raw `fontSize` to the `type` ramp + `ThemedText` first ... Then spacing, then colors, then radius/shadows.
3. **Convert one worst-offender file completely** and use it as the reference pattern for the rest of the migration.
4. **Then convert per-screen**, one screen per commit, using the audit greps scoped to that screen to verify it comes out clean.
5. **Re-run the audit after each phase** and record the scores from §2 - they should fall monotonically.
```
中文大意：先字号，再间距，再颜色，最后圆角/阴影；先把最差的一个文件彻底改好当样板；然后一屏一个提交，用限定到该屏的 grep 验证干净；每阶段重跑体检记分，分数应该单调下降。

通用版（本库整理，非原文）：
```text
对这个 Expo/RN 项目做一次设计系统漂移体检，只读，不改代码。
0. 先确认源码目录和 theme 位置（不要假设有 src/），并检查 package.json 里是否已有样式体系（NativeWind/Tamagui/Restyle/Unistyles 等）。有就以它为准，按它的 token 名和刻度来判断，不要套别的标准。
1. 按类别 grep：写死的 hex 颜色、裸 fontSize、不在间距刻度上的 padding/margin/gap、裸 borderRadius、旧式 shadow*/elevation、多个 theme 入口、没有 accessibilityRole/Label 的 Pressable。
2. 每类算「每 100 行源码逃逸数」，给出 健康/漂移/系统性 判断和最差的 3 个文件。
3. 检查 components/ 下每个组件：variant 是否是一个 prop（而不是 isPrimary/isGhost 一堆布尔）、按下/禁用/加载态、style 覆盖、无障碍、是否只用 token。
4. 列出在 ≥2 个页面重复出现、该抽成组件的视图。
5. 给出优先级动作和迁移顺序（字号→间距→颜色→圆角/阴影，一屏一提交）。
输出体检报告后停下，等我选要修哪部分。
```

## 已知坑 & 评论区改进
- **别默认有 `src/`。** 原文专门提醒：create-expo-app 默认模板把 `app/`、`components/`、`constants/` 放在根目录，对不存在的 `src/` 跑 grep 会得到 0 命中——"a false clean bill"（假的体检合格）。
- **命中不等于违规。** 原文："Each hit outside the theme directory is a candidate for tokenization - not automatically a violation"，有注释说明的一次性值可以豁免。
- **体检分要用渲染结果补充。** 原文说 token 检查无法证明深色模式可读、间距有层次、阴影克制，要截图看；SKILL.md 的 Self-Critique Pass 按层级、亲密性、重复/统一等原则逐屏检查。
- **新组件要先证明现有组件不够。** audit.md §7 给了「Proposed: [Name]」模板，要求列出最接近的现有组件、共享什么、缺什么；"If the 'what's missing' column is empty for any row, extend that component's variants instead of adding a new one."
- **Bolt 的全项目版本更激进。** Bolt 文档的审计 prompt 会直接 "Update all files to align with the design system"，适合小项目；大项目按 Expo 的一屏一提交更稳。Bolt 文档另一个局部写法："Update all uses of the PrimaryButton to use the design system component, but leave the layout the same."
- **本库提醒**：配合 [expo-native-slop-tells](expo-native-slop-tells.md) 一起跑；想让 agent 以后不再漂移，见 [emil-design-system-for-agents](emil-design-system-for-agents.md)（lint/CI 拦截）。

## 来源
- [expo/skills：expo-design-system/references/audit.md](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/references/audit.md) — Expo 官方
- [expo/skills：expo-design-system/SKILL.md](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/SKILL.md) — Expo 官方
- [Bolt：Use a design system](https://support.bolt.new/design-system/use-design-system) — Bolt 官方文档

## 标签
设计、移动端、设计审查、视觉风格
