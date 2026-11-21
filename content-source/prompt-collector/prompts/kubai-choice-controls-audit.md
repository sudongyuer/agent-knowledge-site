---
title: 选择类控件诊断：开关还是复选框、下拉选择还是下拉菜单、分段控件还是单选——先出表，只改我批准的
category: 设计
tags:
- 设计
- 交互细节
- 设计审查
- 移动端
author: 枯白 Kubai（@Kubai087）; 枯白 Kubai（@Kubai087，同串 Prompt 回复）
source_url: https://x.com/Kubai087/status/2123217190052827633
date: '2026-11-21'
id: kubai-choice-controls-audit
additional_sources:
- https://x.com/Kubai087/status/2123219668165140511
status: active
---

## 解决什么问题
agent 常把控件用错：设置页用复选框还要点保存、开/关做成两个单选、把「导出/删除」这类动作塞进下拉选择框、选项会变长却用分段控件导致界面跳动。枯白 Kubai《999 个小技巧》第 020 期讲基础控件怎么选，并附一条诊断 prompt，帮你找出项目里的同类问题。

Switch（开关）、Checkbox（复选框）、Radio（单选）、Segmented control（分段控件）、Select（下拉选择，选中值显示在框里）、Dropdown menu（下拉菜单，里面是动作）。

## Prompt
作者正文要点（中文原文节选）：
```text
两者的核心区别在于何时生效：开关拨动后立即生效，因此适合设置页等非表单场景；复选框通常随表单一起提交，需要搭配保存按钮。

另外，一件事的开与关应当用一个开关表示，而不是两个单选（Radio）

两者外观相似，承载的内容却不同。下拉菜单里是动作，点击后立即执行，常用于收纳工具栏或页面顶部的按钮；下拉选择里是数值、状态或选项，选中后显示在输入框中，比如语言选择。

两者都用于单选。2–5 个简短的选项，适合用分段选择，所有选项一目了然；如果选项更多、文字较长，或者选项的值并不固定，就应改用下拉选择，以免内容变化导致界面跳动。
```

Prompt 原文（同串回复，英文，完整）：
```text
Review the choice controls in my product (switches, checkboxes, radio buttons, segmented controls, selects and dropdown menus) and decide for each one whether it is the right control. Diagnose first; change only what I approve, in my own code and components, without new dependencies.

1. Read the product
Find every place a person picks something, turns something on or off, or runs an action from a list. For each, note what it sets or does, how many options it has, how many can be picked, and whether it takes effect at once or on Save.

2. How to choose
a. Switch or checkbox: when it takes effect.
- Switch: takes effect the moment it is flipped (settings that save on their own, no Save button).
- Checkbox: one answer in a form, applied on Submit or Save.
- One thing on or off is one switch, never two radios (On / Off). If both sides have names of their own (Light / Dark), it is a choice of one: see (c).

b. Select or dropdown menu: a value or an action.
- Select: holds a value; after a pick the field shows it, and the picked option has a tick in the list.
- Dropdown menu: holds actions (Export, Duplicate, Delete). A pick runs it, the button keeps its name, and the result shows elsewhere. Menus go in page headers, toolbars and row ends, not among form fields. A split button pairs a main action with a menu of related ones (Send, with Send later and Save as draft beside it).
- Tabs switch to other content and set nothing; a segmented control sets a value or the view of the same content.

c. One of several: by the number of options.
- 2 to 5 short options: a segmented control.
- 2 to 5 that each need a line: radio buttons, stacked under the label.
- 6 or more, or labels that change or grow (names, dates, items people add): a select, so the layout never shifts.
- Hundreds (time zones, countries, people): a select with search, and a clear message when nothing matches.

d. Radio or checkbox: how many can be picked.
- Radio: exactly one, all options in view, as in a survey question. It can't be cleared once picked, so add a "none" option (Not sure yet) when that is a fair answer.
- Checkbox: any number, none included.
- Inside a select: a tick for one value, never radio circles; a checkbox before each option for several, with the picks shown as chips in the field.

3. Report before changing
Give me a table, one row per control: where, what it sets or does, the control now, the control it should be (or "right as it is"), why in one line, and anything else that changes (a Save button, a "none" option, an action moved out of a form). Flag every change in behaviour, ask about cases that could go either way, and wait for me to choose.

4. Change what I approve
Use my components, or the platform's own controls when I have none. Keep the values people already saved. Check that switches act at once and checkboxes on submit, selects show their value, menu buttons keep their name, and everything works by keyboard and screen reader.
```
中文大意：审查产品里的选择类控件，判断每个是否用对；先诊断，只用我的代码和组件改我批准的，不加依赖。①盘点：每处设置什么或执行什么、几个选项、能选几个、立即生效还是保存后生效。②怎么选：开关立即生效，复选框随表单提交；一件事的开关用一个开关，不用两个单选（两边各有名字的如浅色/深色，算单选）。下拉选择放值、选中后显示在框里并打勾；下拉菜单放动作，按钮名不变，放在页头、工具栏、行尾，不放在表单里。标签页切换内容不设置值，分段控件设置值或同一内容的视图。2–5 个短选项用分段控件，每项要一行字的用竖排单选，6 个以上或选项会变化的用下拉选择，成百上千的加搜索和无结果提示。单选恰好选一个且无法清空，必要时加「暂不确定」；多选用复选框。③先出表：位置、作用、现在的控件、应该的控件（或「正确」）、一句理由、连带变化（加保存按钮、加「无」选项、把动作移出表单）；标出行为变化，两可的问我。④改：用我的组件，没有就用平台原生控件；保留用户已保存的值；验证开关即时生效、复选框提交生效、读屏可用。

## 已知坑 & 评论区改进
- **改控件会改行为。** 原文要求 "Flag every change in behaviour"：开关改复选框意味着要加保存按钮，反之要去掉保存，这类变化必须先确认。
- **保留已保存的值。** 原文 "Keep the values people already saved."，迁移时别把用户设置清掉。
- **移动端对应关系（本库提醒）**：iOS 的分段控件、Switch、菜单按钮（UIMenu / 上下文菜单）都是原生控件，Expo 的 `@expo/ui` 也提供部分原生控件；优先用原生，别手搓 iOS 风格开关到 Android 上（见 [impeccable-ios-slop-test](impeccable-ios-slop-test.md) 的 Cross-Platform Costume）。
- **本次只读了作者本人在串内的回复，没有读到其他人的评论。**

## 来源
- [枯白 Kubai：开关、复选框、单选和下拉，怎么选？（020）](https://x.com/Kubai087/status/2123217190052827633)
- [同串 Prompt 回复](https://x.com/Kubai087/status/2123219668165140511)

## 标签
设计、交互细节、设计审查、移动端
