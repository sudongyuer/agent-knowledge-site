---
title: 照设计稿还原：数值只从设计文件取、映射到现有 token，逐元素对比后交一张差异表
category: 设计
tags:
- 设计
- 设计还原
- 验证/自审
author: Jakub Krehel（设计工程师，Interfaces 杂志 interfaces.dev 作者）
source_url: https://github.com/jakubkrehel/skills/blob/main/skills/build-design/SKILL.md
date: '2026-11-18'
id: jakub-build-design-match
status: active
---

## 解决什么问题
手上有 Figma 设计稿或设计截图，要 agent 做得和稿子一模一样时用。常见毛病：agent 按自己的审美「优化」、随手写 `w-[343px]` 这种魔法数字、顺便改了旁边的文案。Jakub 的 build-design skill 立了一条总原则：**设计说了算**，数值只从设计文件来，然后映射到项目现有的 token 和组件，做完逐元素对比，最后交一张「设计值 / 实际值 / 状态」表。

token（design token）大白话：设计系统里给颜色、间距、圆角等起的名字，比如 `space-4`、`color-primary`。

## Prompt
原文 1（总原则，英文）：
```text
The design decides. Values come from the design file, never from your taste or a pattern you liked elsewhere. A change the design does not show is a deviation, and a deviation is the user's call.
```
中文大意：设计说了算。数值来自设计文件，不来自你的品味或你在别处喜欢的模式。设计里没有的改动就是偏离，偏不偏离由用户决定。

原文 2（读截图时的诚实要求，英文）：
```text
A screenshot or exported image has no values to read. Sizes are ratios to the capture, so state the scale you assumed and treat every measurement as an estimate. Ask for the Figma link when one exists, since it replaces the whole estimate.
```
中文大意：截图里没有可读的数值，尺寸只是相对截图的比例，所以要说明你假设的缩放比例，所有测量都当估计值。有 Figma 链接就要链接，它能替代全部估算。

原文 3（取整规则和范围控制，英文）：
```text
Never add a token, a component variant or an arbitrary value to hit a number. Stop and ask which way to go when rounding would visibly change the design. That means more than 2px on spacing or size, or a color landing on a different step.

Leave everything around the piece as it was. No neighbouring copy edits, no icon swaps, no "while I was here" cleanups. A diff wider than the design is the most common way this goes wrong.
```
中文大意：不要为了凑数值新增 token、组件变体或任意值。取整会明显改变设计时（间距或尺寸差 2px 以上、颜色落到另一个色阶）停下来问。周围的东西保持原样：不改旁边文案、不换图标、不「顺手清理」。改动范围比设计稿大，是最常见的翻车方式。

原文 4（对比和交付，英文）：
```text
Render the build at each frame's width beside the design screenshot and walk it element by element. Compare the properties **Read the design at its source** collected. "Gap is 12px, design is 16px" is a finding. "Feels a bit tight" is not.
```
交付表格式（原文）：
```text
| Element | Design | Built | Status |
| --- | --- | --- | --- |
| Card padding | 20px | `p-5` | Matches |
| Title size | 15px | `text-sm`, 14px | Rounded to token |
| Badge | Filled pill | Text label | Deviates, asked: no badge component exists |
```
中文大意：在每个设计帧的宽度下渲染，和设计截图并排逐元素比。「间距 12px，设计是 16px」才算发现，「感觉有点挤」不算。最后交一张表：元素、设计值、实际实现、状态（一致 / 取整到 token / 偏离并已询问）。另列：未接数据的部分、设计没画的状态、和规范冲突的地方。

## 已知坑 & 评论区改进
- **设计没画的状态不要自己发明。** skill 原文："A state the file does not draw is not yours to design. Leave it to the existing component's default and list it as missing." 这和「be ambitious」（[anthropic-be-ambitious-scope](anthropic-be-ambitious-scope.md)）方向相反：还原设计稿时守规矩，从零做时才要它主动补状态。
- **没看过就不许说「一致」。** 原文 "Do not report a match you did not look at."；没浏览器时要交出本地地址和要检查的宽度，并说明对比未验证。
- **Figma 要通过 Figma MCP 读**（MCP 大白话：让 agent 连接外部工具的插件接口）。skill 要求先在工具列表里搜 figma，再说不可用。
- 本库提醒：移动端还原时，把「每个帧的宽度」换成具体机型（如 iPhone SE / 15 Pro Max）在模拟器里截图对比，截图方法见 [impeccable-ios-slop-test](impeccable-ios-slop-test.md)。

## 来源
- [jakubkrehel/skills：build-design/SKILL.md](https://github.com/jakubkrehel/skills/blob/main/skills/build-design/SKILL.md)（仓库 2026-11-18 约 1.2 万 star；同仓库还有 better-ui、better-typography、interface-review、variant、break 等）

## 标签
设计、设计还原、验证/自审
