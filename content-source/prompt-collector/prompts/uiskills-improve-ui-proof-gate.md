---
title: 只读界面审查：每条问题要过「规则、运行时、唯一修法」三道证明，最多报三条，没有就说没有
category: 设计
tags:
- 设计
- 设计审查
- 验证/自审
- 范围控制
author: Julien Thibeaut（ibelick/ui-skills：improve-ui）
source_url: https://github.com/ibelick/ui-skills/blob/main/skills/improve-ui/SKILL.md
date: '2026-11-21'
id: uiskills-improve-ui-proof-gate
status: active
---

## 解决什么问题
让 agent「看看这个界面哪里能改进」时，它常常列一长串凭感觉的意见。ibelick 的 improve-ui 把审查变成只读、讲证据的流程：一条问题必须同时有「设计规则依据」「这个规则确实作用到这个界面的证据」「证据只指向一种修法」，再反过来尝试推翻它，活下来的最多报三条；修改计划写成另一个 agent 能独立执行的文件。

## Prompt
原文 1（边界，英文）：
```text
- Never modify product source. Create or edit files only under `design-plans/`.
- Do not install dependencies, run formatters, commit, push, or otherwise mutate the working tree.
...
- Make every plan self-contained; its executor has no context from the audit or conversation.
```
中文大意：绝不改产品源码，只在 `design-plans/` 下写文件；不装依赖、不格式化、不提交；每份计划要自成一体，执行者看不到审查过程和对话。

原文 2（三道证明，英文节选）：
```text
Search results, repetition, and implementation differences produce candidates, not findings. Keep a candidate only when all three proofs exist:

1. **Contract** — Cite a binding design decision for this property and scope, or a direct contradiction in user-facing presentation or content within the same task. "Prefer," "generally," names, omissions, repetition, and absence of an exception do not establish a contract.
2. **Runtime** — Prove that the cited owner, value, or behavior reaches the affected surface through the traced runtime path. Do not compare separate ownership layers or lifecycle states.
3. **Correction** — State one change required by the evidence. ... If the evidence cannot determine the correct choice, the intended condition is ambiguous, the proposal contains alternatives, or the correction requires inventing product intent, reject the candidate.
```
中文大意：搜索结果、重复出现、实现不一致都只是「候选」。三道证明都有才算问题：①规则——引用一条对这个属性和范围有约束力的设计决定，或同一任务里用户可见的直接矛盾（「建议」「通常」、命名相似、没写例外都不算）；②运行时——证明这条规则/取值确实沿渲染路径作用到这个界面；③修法——证据只支持一种改法；如果需要二选一、意图不明或要替产品发明意图，就丢掉。

原文 3（报告，英文节选）：
```text
Order surviving findings by confidence, user impact, reach, and correction cost. Stop at three.
...
| # | Problem | Evidence | Proposed change | Scope | Confidence |
...
If no candidate survives, write `No supported findings were found.` under `## Findings` and `No supported recommendation.` under `## Improve first`.
```
中文大意：按置信度、用户影响、波及范围、修改成本排序，最多三条；表格列：问题 | 证据 | 建议改动 | 范围 | 置信度；再写「Improve first」选一条最值得先做的。没有站得住的就直接写「没有有依据的发现」。

通用版（本库整理，非原文）：
```text
只读审查 [屏幕/流程]，不改任何源码，只允许在 design-plans/ 下写文件。
1. 先说明你审的是哪个界面，以及管它的设计依据：DESIGN.md / theme / 组件库里哪些是当前有效的。没有设计文档本身不算问题。
2. 每个候选问题必须给出三样证据：①对应的设计规则或同屏直接矛盾（引用原文）②这条规则确实作用到这里（渲染路径/导入/props）③唯一的修法（用哪个已有 token/组件）。缺任何一样就丢掉。
3. 报告前重新打开每个引用，试着推翻每一条；推翻得了就删。
4. 最多报 3 条，表格：问题 | 证据 | 建议改动 | 范围 | 置信度；再选一条「最先改」。没有站得住的就写「没有有依据的发现」，不要凑数。
5. 我选中后，每个改动写一份 design-plans/<名字>.md：证据链、设计决定、复用的组件、改哪些文件、范围、怎么验证、何时停止。写成另一个没看过对话的 agent 也能执行。
```

## 已知坑 & 评论区改进
- **「层级不清、太挤」这类判断要看渲染结果。** 原文："Hierarchy, prominence, density, clarity, discoverability, usability, and perceived coherence require rendered or user evidence."（只看源码不能下这类结论。）想审视觉观感，给它截图或让它跑起来看。
- **默认不报无障碍和功能问题。** 原文会丢掉 a11y、路由、数据、性能类发现，除非你明确要求；需要就配 [uiskills-fixing-accessibility](uiskills-fixing-accessibility.md)。
- **本库提醒**：这条强调「宁缺毋滥」，和 [huashu-polish-loop](huashu-polish-loop.md)「每轮只改最伤的三处」、[expo-design-system-drift-audit](expo-design-system-drift-audit.md)（量化漂移）可以搭配：先体检量化，再用这条挑出最该改的三处，再交给执行 agent。

## 来源
- [ibelick/ui-skills：improve-ui/SKILL.md](https://github.com/ibelick/ui-skills/blob/main/skills/improve-ui/SKILL.md) — Julien Thibeaut（@Ibelick）

## 标签
设计、设计审查、验证/自审、范围控制
