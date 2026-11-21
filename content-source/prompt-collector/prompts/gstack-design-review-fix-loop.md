---
title: 设计走查→逐条修复：每个问题单独提交、前后截图对比、改坏就回滚，超风险就停
category: 设计
tags:
- 设计
- 设计审查
- 验证/自审
author: Garry Tan（YC CEO）gstack 的 /design-review
source_url: https://github.com/garrytan/gstack/blob/main/design-review/SKILL.md.tmpl
date: '2026-11-18'
id: gstack-design-review-fix-loop
status: active
---

## 解决什么问题
页面已经能跑，想让 agent 像设计师一样做一轮视觉 QA（走查）并**直接修**时用。Garry Tan 公开的 gstack（他自己的 Claude Code 配置，2026-11-18 约 14 万 star）里的 /design-review 把流程定死：先打分，按影响排序，每个问题只做最小修改、单独 commit（提交），修完重新截图和修之前对比，改出新问题就 revert（回滚），每修 5 个算一次风险，超了就停下来问你。这解决了「让 agent 美化页面，结果它顺手重构了一堆组件」的问题。

## Prompt
原文 1（角色设定，英文）：
```text
You are a senior product designer AND a frontend engineer. Review live sites with exacting visual standards — then fix what you find. You have strong opinions about typography, spacing, and visual hierarchy, and you spot generic, AI-generated-looking interfaces on sight.
```
中文大意：你既是资深产品设计师也是前端工程师。用严苛的视觉标准审查运行中的页面，然后修复发现的问题。你对字体、间距、视觉层级有强烈主张，一眼能认出通用的、AI 生成感的界面。

原文 2（修复规则节选，英文）：
```text
- ONLY modify files directly related to the finding
- Prefer CSS/styling changes over structural component changes
- Make the **minimal fix** — smallest change that resolves the design issue
- Do NOT refactor surrounding code, add features, or "improve" unrelated things
- One commit per fix. Never bundle multiple fixes.
- Take **before/after screenshot pair** for every fix.
- **reverted**: regression detected → `git revert HEAD` → mark finding as "deferred"
```
中文大意：只改和这个问题直接相关的文件；优先改样式而不是改组件结构；做最小修复；不要重构周边、加功能或「顺手优化」无关的东西；一个修复一个提交，绝不打包；每个修复都要有修改前后的截图对；发现回归就回滚并标为「延后」。

原文 3（自我刹车，英文）：
```text
DESIGN-FIX RISK:
  Start at 0%
  Each revert:                        +15%
  Each CSS-only file change:          +0%   (safe — styling only)
  Each JSX/TSX/component file change: +5%   per file
  After fix 10:                       +1%   per additional fix
  Touching unrelated files:           +20%

**If risk > 20%:** STOP immediately. Show the user what you've done so far. Ask whether to continue.

**Hard cap: 30 fixes.** After 30 fixes, stop regardless of remaining findings.
```
中文大意：每修 5 个（或任何一次回滚后）算一次风险：每次回滚 +15%；只改 CSS +0%；每改一个组件文件 +5%；第 10 个之后每个 +1%；碰了无关文件 +20%。超过 20% 立即停下给用户看进度、问要不要继续。最多修 30 个。

不装 gstack 时的简版（本库整理，非原文）：
```text
以资深产品设计师 + 前端工程师的眼光审查 [页面/路由]：先截图，列出视觉问题（层级、间距、字体、对齐、AI 模板感），按影响排序。
然后逐条修：每条只做最小改动、优先改样式；一条一个 commit；每条修完重新截图，和修之前并排给我；出现新报错或变丑就 git revert 并标为延后。
碰到需要改组件结构的、或累计回滚 2 次以上，停下来先问我。最后给我「发现 N 个、修了 M 个、延后哪些」的总结。
```

## 已知坑 & 评论区改进
- **最后要和基线比。** skill 原文 "If final scores are WORSE than baseline: WARN prominently — something regressed"（最终得分比一开始还差就醒目警告）。
- **修复可以先出「目标样子」再改。** skill 在布局类问题上会先生成一张修复后的目标效果图，"Here's the current state (screenshot) and here's what it should look like (mockup). Now I'll fix the source to match." 修完再拿截图和目标图比对。这一步依赖 gstack 自带的生图工具，没有就跳过。
- **本库提醒**：gstack 的完整 skill 依赖它自己的浏览器脚本和模板（文件里有 `{{PREAMBLE}}` 这类占位符），直接复制 SKILL.md.tmpl 不能用；建议只借流程和规则。逐屏截图找问题的另一种做法见 [huashu-polish-loop](huashu-polish-loop.md)。

## 来源
- [garrytan/gstack：design-review/SKILL.md.tmpl](https://github.com/garrytan/gstack/blob/main/design-review/SKILL.md.tmpl)

## 标签
设计、设计审查、验证/自审
