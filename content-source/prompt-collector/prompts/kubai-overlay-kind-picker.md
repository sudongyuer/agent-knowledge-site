---
title: 浮层选型诊断：提示、气泡、就地确认、抽屉、弹窗、整页，每一处该用哪种——只换类型不改样式
category: 设计
tags:
- 设计
- 交互细节
- 设计审查
- 范围控制
author: 枯白 Kubai（@Kubai087）; 枯白 Kubai（@Kubai087，同串 Prompt 回复）
source_url: https://x.com/Kubai087/status/2117314098165862612
date: '2026-11-21'
id: kubai-overlay-kind-picker
additional_sources:
- https://x.com/Kubai087/status/2117314198430757283
status: active
---

## 解决什么问题
agent 一律用弹窗（Dialog/Modal）处理确认、表单和提示，导致频繁打断用户时用。枯白 Kubai《999 个小技巧》第 009 期讲浮层怎么选，附了一条决策 prompt：盘点产品里所有浮层，逐个判断该用哪种，先出决策表再改，并且明确「只改类型，不改样式」。

Popover（气泡）：点击打开、可以放操作的小浮层。Popconfirm（就地确认）：锚定在按钮旁边的小确认框。Drawer（抽屉）：从屏幕边缘滑出的面板；移动端常对应底部弹层 sheet。

## Prompt
作者正文要点（中文原文节选）：
```text
能撤销的操作，直接执行，再留一个「撤销」入口。

不可逆的操作才需要二次确认：大多数情况用就地确认（Popconfirm），路径短，也不打扰；影响大、批量操作，或必须让用户停下来的，再用弹窗（Dialog）。

表单短、不需要参照界面上的其他信息，用弹窗；
表单长、需要对照界面内容，或想更好地利用横向空间，用抽屉；
本身就是主要任务的，做成独立页面。
```
作者还写道：提示框和跟随气泡「到了手机上，两者都改成点击显示」。

Prompt 原文（同串回复，英文，节选）：
```text
Review how my product uses floating UI (tooltips, tooltips that follow the pointer, popovers, popconfirms, drawers and dialogs) and decide which kind each case should be. Work inside my existing design system. This is about choosing the right kind, not about restyling: keep my components, colours, radii, shadows, fonts, motion and copy style.
...
2. Questions that settle a case
- Can the action be undone? Then don't confirm: do it at once and offer Undo (a toast, or a way back such as a trash).
- If it can't: is it one item of the user's own, with a button to anchor to? Popconfirm. Large impact, other people, a bulk selection, or a decision still to make? Dialog.
- Is it a form? Short, and nothing on the page is needed for reference: dialog. Long, needs the page in view, or wants the width: drawer. The main task, or needs its own URL: a page.
- Is the information about one element, or about wherever the pointer is inside an area? One element: tooltip. An area: tooltip that follows the pointer. Either way, does it need anything to click? Then it is a popover.
- On touch screens there is no hover: anything shown on hover must also be reachable by a tap.
...
4. Keep the design as it is
- Change only the kind where the current one is wrong, plus the missing behaviour from step 3.
- Don't change colours, radii, shadows, fonts, spacing or animations, and don't add new visual patterns.
- Keep copy as it is, except confirm buttons and the line that explains what cannot be undone.
- If a case needs a component the system doesn't have (an undo toast, a popover), stop and ask me before adding one.

5. Deliver the decisions first
- Before changing any code, give me a table: each use, where it is, its current kind, the kind you recommend, and why in one line.
- Mark the ones that are already right, and the ones that could fit two kinds, with what decides between them.
- Wait for my go-ahead, then make only the changes I approve and list every file you touched.
```
中文大意：审查产品如何使用浮层，决定每处该是哪种；在现有设计系统里做，只选类型不改样式。判定问题：能撤销吗？能就不确认，直接执行并给撤销。不能撤销：是用户自己的单个对象且有按钮可锚定→就地确认；影响大、涉及他人、批量、还需要另做决定→弹窗。是表单吗？短且不需参照页面→弹窗；长、需对照页面或要宽度→抽屉；是主任务或需要独立链接→整页。触屏没有 hover，hover 才显示的内容必须也能点出来。保持设计：只在类型选错的地方换类型，补上缺的行为；不改颜色、圆角、阴影、字体、间距、动效；文案只改确认按钮和「不可撤销」说明；需要系统里没有的组件（撤销 toast、popover）时先停下问我。先交决策表，标出已经正确的和两可的，等我同意再改，列出所有改动文件。

原文第 3 节还规定每种浮层的行为，例如弹窗："Buttons name the action (\"Remove member\", not \"OK\")"；抽屉："Never use a drawer to confirm something."（原文第 1 节）；带表单的抽屉、弹窗和页面在有未保存修改时关闭要先询问。

## 已知坑 & 评论区改进
- **原文偏桌面网页。** tooltip 跟随指针、Escape 关闭、showModal() 等是网页概念；移动端主要用到「可撤销就别确认」「短表单弹窗/长表单抽屉（底部弹层）/主任务整页」「hover 内容必须可点出」三条（本库提醒）。Expo 的 native slop 清单 #1「The Web Modal」也建议挑选和编辑类内容用原生 sheet，见 [expo-native-slop-tells](expo-native-slop-tells.md)。
- **本次只读了作者本人在串内的回复，没有读到其他人的实质改进评论。**
- **本库提醒**：确认弹窗的文案规则（标题写动作和对象、按钮写动词）见 [jakub-ui-copy](jakub-ui-copy.md)。

## 来源
- [枯白 Kubai：提示框、跟随气泡、就地确认、抽屉与弹窗，到底怎么选？（009）](https://x.com/Kubai087/status/2117314098165862612)
- [同串 Prompt 回复](https://x.com/Kubai087/status/2117314198430757283)

## 标签
设计、交互细节、设计审查、范围控制
