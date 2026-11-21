---
title: 从现有代码反推一份 DESIGN.md：只记有依据的设计决定，不把偶然的写法升格成规范
category: 设计
tags:
- 设计
- 视觉风格
- 复盘沉淀
- 文档输出
author: Julien Thibeaut（ibelick/ui-skills：create-design-md）; Google Labs（stitch-skills：design-md）;
  Alvaro Cintas（@dr_cintas）
source_url: https://github.com/ibelick/ui-skills/blob/main/skills/create-design-md/SKILL.md
date: '2026-11-21'
id: uiskills-create-design-md
additional_sources:
- https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-utilities/skills/design-md/SKILL.md
- https://x.com/dr_cintas/status/2106482844025376965
variants:
- Stitch design-md：五段结构 Visual Theme & Atmosphere / Color Palette & Roles（描述名 + Hex
  + 功能角色）/ Typography / Component Stylings / Layout Principles
- '@dr_cintas：在 AGENTS.md 加一行「Read DESIGN .md before any UI work.」，并用 npx @google/design.md
  lint DESIGN.md 校验'
status: active
---

## 解决什么问题
想让 agent 每次写界面都遵守同一套视觉规范，但项目里还没有 DESIGN.md（放在仓库根目录、专门给 agent 读的设计规范文件）时用。ibelick 的 create-design-md 从现有代码（或公开网站）反推，只把「有依据、会影响实现选择」的内容写进去，避免把某个页面随手写的颜色当成全局规范。

## Prompt
原文 1（边界，英文）：
```text
- Modify only `DESIGN.md`. Do not change product source, dependencies, configuration, or generated files.
- Use the DESIGN.md format contract below. Do not invent a competing schema.
- Do not copy every discovered token or component into the document.
- Do not convert repetition, local styling, or visual preference into product intent.
```
中文大意：只改 DESIGN.md，不动源码、依赖和配置；用规定的格式，不自创；不要把发现的每个 token、组件都抄进去；不要把「重复出现」「局部样式」「视觉偏好」当成产品意图。

原文 2（证据流水线，原样）：
```text
role → value → source → scope → recurrence → confidence
```
中文大意：每个候选都记：角色 → 取值 → 出处 → 作用范围 → 出现次数 → 置信度；不确定的、没有约束的局部值、不影响实现的都省略。

原文 3（仓库模式下的读取顺序，英文）：
```text
1. Existing `DESIGN.md` and explicit repository guidance
2. Tokens, themes, variables, and global styles
3. Shared primitives and their variants
4. Representative routes and rendered consumers
5. Surface-local implementations
```
中文大意：先读已有 DESIGN.md 和仓库规范，再读 token/theme/全局样式，再读共享组件及其变体，再看代表性页面，最后才看局部实现。

原文 4（Stitch design-md 的输出结构，英文）：
```text
# Design System: [Project Title]
## 1. Visual Theme & Atmosphere
## 2. Color Palette & Roles
(List colors by Descriptive Name + Hex Code + Functional Role.)
## 3. Typography Rules
## 4. Component Stylings
## 5. Layout Principles
```

通用版（本库整理，非原文；适合 Expo/RN 项目）：
```text
为这个项目写一份根目录 DESIGN.md，只改这一个文件。
读取顺序：已有的设计文档/规范 → theme 和 token 文件 → components/ 里的共享组件和 variant → 3 个代表性屏幕 → 局部样式。
每条规则都要有依据：明确的文档、命名的共享 token/variant，或在 ≥2 个屏幕使用的共享组件；只出现在一个地方的值不写成规范。
结构：概述（产品气质，只写有依据的）/ 颜色（名字 + 值 + 用途，深浅色成对）/ 字体字号 / 间距刻度 / 圆角与阴影 / 组件用法（什么时候用哪个 variant）/ Do & Don't。
写完列出：每条规则的出处文件；你看到但故意没写进去的值（以及原因）。
然后在 AGENTS.md / CLAUDE.md 加一行：做任何界面工作前先读 DESIGN.md。
```

## 已知坑 & 评论区改进
- **没有渲染证据就别从网址反推。** 原文 URL 模式要求能用浏览器看计算样式；"Do not create a DESIGN.md from copy, metadata, or HTML structure alone."
- **Google 有一个 DESIGN.md 格式和 lint 工具。** 原文要求先用 `npx @google/design.md spec` 看规范是否支持主题，再决定深浅色怎么写；@dr_cintas 的帖子（[原帖](https://x.com/dr_cintas/status/2106482844025376965)）列出 Google 格式的章节为 Overview、Colors、Typography、Layout、Elevation & Depth、Shapes、Components、Do's and Don'ts，并用 `npx @google/design.md lint DESIGN.md` 校验。他贴的 DESIGN.md 模板在图片里，本库读不到，没有收录。
- **写了 DESIGN.md 还要让 agent 读。** @dr_cintas 建议在 AGENTS.md 加一行 "Read DESIGN .md before any UI work."。
- **本库提醒**：DESIGN.md 只是文档，约束力有限；想让 agent 真的不乱写，见 [emil-design-system-for-agents](emil-design-system-for-agents.md)（lint、CI、类型约束）。已有的 [openai-design-system-references-first](openai-design-system-references-first.md) 讲「动手前先给设计系统」，这条讲「没有就先反推一份」。

## 来源
- [ibelick/ui-skills：create-design-md/SKILL.md](https://github.com/ibelick/ui-skills/blob/main/skills/create-design-md/SKILL.md) — Julien Thibeaut（@Ibelick）
- [stitch-skills：design-md/SKILL.md](https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-utilities/skills/design-md/SKILL.md) — Google Labs
- [@dr_cintas 的 DESIGN.md 帖](https://x.com/dr_cintas/status/2106482844025376965) — Alvaro Cintas

## 标签
设计、视觉风格、复盘沉淀、文档输出
