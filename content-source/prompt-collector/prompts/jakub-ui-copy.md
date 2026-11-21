---
title: 界面文案：先盘点现有用词，按钮动词开头，错误写怎么修，可撤销就别弹确认，空状态指向下一步
category: 设计
tags:
- 设计
- 界面文案
- 交互细节
author: Jakub Krehel（jakubkrehel/skills：better-writing）; Leonxlnx（taste-skill：references/copy-tells.md）;
  Nutlope/hallmark（Hallmark contributors）
source_url: https://github.com/jakubkrehel/skills/blob/main/skills/better-writing/SKILL.md
date: '2026-11-21'
id: jakub-ui-copy
additional_sources:
- https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/references/copy-tells.md
- https://github.com/Nutlope/hallmark/blob/main/skills/hallmark/references/interaction-and-states.md
variants:
- taste-skill copy-tells：网站文案的「AI 味」词表（delve、seamless、unlock、robust……），并要求每条禁令旁边配一个正面做法
- Hallmark：Undo over confirm——可逆操作立即执行并提供 5–10 秒撤销；不可逆的保留确认并让用户输入对象名
status: active
---

## 解决什么问题
agent 写的按钮、报错、空状态、确认弹窗文案常常是「OK」「Oops! Something went wrong」「Are you sure?」「暂无数据」，或者同一个东西一处叫「归档」一处叫「移到存储」时用。Jakub Krehel 的 better-writing 规定先盘点项目已有的用词和语气，再按规则写或审文案，并附了可 grep 的检测清单。

i18n：国际化/多语言。Intl：JavaScript 内置的按语言格式化数字、日期、复数的 API。

## Prompt
原文 1（先盘点，英文）：
```text
Before writing or reviewing, find where the copy lives and read the copy around the change:

1. Search for the translation call (`t(`, `i18n.`, `<FormattedMessage`, `$t(`) and the locale files it reads ...
2. List the noun used for each object and the verb used for each action, as in "project" or "workspace" and "Delete" or "Remove".
3. Note the case used per element type and any voice or content style guide.

New copy uses the terms on that list. A synonym is a finding only where the same thing is named two ways.
```
中文大意：动笔前先找文案在哪（翻译调用、语言文件），列出每个对象用的名词、每个动作用的动词，记下大小写和语气规范；新文案只用清单里的词，同一个东西两种叫法才算问题。

原文 2（错误与确认，英文）：
```text
| Bad | Good |
| --- | --- |
| That password is too short | Choose a password with at least 8 characters |
| Invalid date | Enter a date as DD/MM/YYYY |
| Oops! Something went wrong. | Unable to save. Check your connection and try again. |
...
- The title names the action and the object, "Delete 'Q3 report'?", never "Are you sure?".
- The body says what is lost and what cannot be recovered, with counts where they apply.
- The buttons are verb plus object, `Delete project` and `Cancel`, never `Yes` and `No`.
```
中文大意：错误要说怎么修，放在出错的字段旁边，不责怪、不 oops、不加感叹号。可逆且常用的操作（归档、移动、删到回收站）直接执行并给撤销；只有不可逆、影响别人、批量销毁时才确认：标题写动作和对象（「删除『Q3 报告』？」），正文写会丢什么，按钮写「动词 + 对象」，不是「是/否」。

原文 3（其他规则，英文节选）：
```text
A button label starts with a verb naming the action: "Send", "Save draft", "Delete project". Never "OK!" or "Let's go!".
...
Label a toggle for what happens when it is on. "Send read receipts" lets users infer the off state; "Don't send read receipts" turns the toggle into a double negative.
...
An empty state says what this place is and how to fill it, and offers one clear next action
...
Match the input device: "tap" on touch, "click" with a pointer, "select" when both are possible.
```
中文大意：按钮以动词开头；开关文案描述「打开时会发生什么」，别写成双重否定；空状态说明这里是什么、怎么填满，并给一个明确的下一步；触屏上写「轻点」而不是「点击」。

原文 4（检测清单节选，原样）：
```text
| `Oops`, `Something went wrong` or `!` in an error string | Say what failed and the next step |
| `" + n + "`, a template literal holding a sentence fragment, or `=== 1 ? "" : "s"` | One message with a plural argument |
| `>OK<`, `>Yes<` or `>No<` on a dialog button | Verb plus object |
| `Are you sure` | Name the action and the object |
| `successfully` | Cut it: "Changes saved" |
| A toggle label starting `Don't`, `Disable` or `Hide` | Describe the ON state |
```

通用版（本库整理，非原文；中英文 App 都适用）：
```text
审查 [屏幕/模块] 的界面文案，按 Jakub Krehel better-writing 的规则：
1. 先找出文案所在（i18n 调用和语言文件），列一张术语表：每个对象叫什么、每个动作用什么动词；同一个东西有两种叫法的标出来。
2. 按钮：动词开头（「保存草稿」「删除项目」），不要「确定」「好的」。
3. 错误：说清失败了什么、怎么修，放在出错位置旁边；不要「出错了」「Oops」、不要感叹号。
4. 确认弹窗：能撤销的改成直接执行 + 撤销提示；必须确认的，标题写「删除『xxx』？」，正文写后果，按钮写「删除项目 / 取消」。
5. 空状态：说明这里放什么 + 一个下一步操作；筛选无结果要写出关键词并给「清除筛选」。
6. 开关文案描述打开时的效果；触屏用「轻点」；拼接句子、手写复数一律改成带占位符的整句。
7. 删掉「成功」「请」等无用词，营销腔改平实。
输出表格：位置 | 现在 | 建议 | 规则，先给我确认再改；改动同步到所有语言文件。
```

## 已知坑 & 评论区改进
- **品牌语气不算错。** 原文："A deliberate brand voice is not a defect."只有造成不一致、歧义、翻译风险或语气与场景不符时才提。
- **营销页文案另有一套「AI 味」词表。** taste-skill 的 copy-tells.md 列了 delve、seamless、unlock、robust 等禁用词和 "In today's fast-paced world" 这类套话，并强调 "every rule that bans a habit needs a positive move beside it, or the model reaches for the nearest substitute."（每条禁令都要配一个正面做法，否则模型会换一个近义词。）该文件针对网站文案，App 里的营销文案（引导页、付费墙）可参考。
- **撤销时长。** Hallmark 的 interaction-and-states.md："Reversible actions run at once and offer Undo for 5 to 10 seconds. Irreversible ones (delete an account, drop a table) keep the confirm, and the user types the name of the thing being destroyed."
- **本库提醒**：Expo 的 native slop 清单里 #10「alert() Confirmation」讲的是同一件事（例行可撤销操作别弹 Alert），见 [expo-native-slop-tells](expo-native-slop-tells.md)。

## 来源
- [jakubkrehel/skills：better-writing/SKILL.md](https://github.com/jakubkrehel/skills/blob/main/skills/better-writing/SKILL.md) — Jakub Krehel
- [taste-skill：references/copy-tells.md](https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/references/copy-tells.md) — Leonxlnx
- [Nutlope/hallmark：references/interaction-and-states.md](https://github.com/Nutlope/hallmark/blob/main/skills/hallmark/references/interaction-and-states.md) — Hallmark contributors

## 标签
设计、界面文案、交互细节
