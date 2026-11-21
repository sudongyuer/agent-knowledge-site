---
title: 核对数字与叙事是否同一口径、是否自相矛盾
category: 财务
tags:
- 财务
- 验证/自审
author: Alice Fong（Anthropic corporate finance and strategy）
source_url: https://claude.com/resources/articles/how-anthropics-finance-team-uses-claude-to-shape-the-narrative-behind-the-numbers
date: '2026-11-17'
id: anthropic-narrative-reconcile
status: active
---

## 解决什么问题
做董事会材料、月度财务复盘这类「数字一直在刷新、多人同时改稿」的文档时用：让 AI 检查所有数字和表述是否对上同一个事实来源，并以董事会成员的读法找出自相矛盾、或把读者没有的背景当成已知的地方。作者 Alice Fong 是在文章里用自己的话描述工作方式，并没有单独列出一条可复制的 prompt。下面代码块是本库按她的原话整理的可粘贴版，不是原文。

## Prompt
作者原话（文章中的第一人称叙述，不是独立 prompt；英文）：

> I hand the file to Claude Cowork and ask it to validate that every number and claim reconciles to a single source of truth. I also ask it to read the narrative the way a board member would, flagging where it contradicts itself or assumes context the reader doesn't have.

中文大意：我把文件交给 Claude Cowork，让它核对每一个数字和论断都与单一事实来源对得上。我还让它用董事会成员的读法来读叙事，标出自相矛盾、或把读者没有的背景当成已知的地方。

可粘贴版（本库整理，非原文；只把上面两句请求改成祈使句，没有加新要求）：
```text
Validate that every number and claim reconciles to a single source of truth.

Read the narrative the way a board member would, flagging where it contradicts itself or assumes context the reader doesn't have.
```

同文里另一段相关原话（月度复盘的写法，不是董事会材料那条的一部分）：

> When I'm ready to write up a month, I drop the relevant financial table from our model into the doc, link the supporting context, and ask Claude Cowork to write the first pass in the voice we already use: revenue was A versus B, off by C%, driven by D.

中文大意：要写某一个月时，我把模型里相关财务表放进文档、链上配套背景，让 Claude Cowork 按我们已有的口径写第一稿：收入是 A、对比 B，差 C%，原因是 D。

对应可粘贴版（本库整理，非原文；使用前先放入报表和上月文档）：
```text
Write the first pass in the voice we already use: revenue was A versus B, off by C%, driven by D.
```

这和 [anthropic-review-against-spec](anthropic-review-against-spec.md) 都是「对照标准做检查」，但那条是对照 SPEC.md 审代码 diff；本条是财务叙事与数字口径。

## 已知坑 & 评论区改进
- 作者写，数字会一直刷新到材料发出当天早上，而且多人同时改各自的页；每次更新后整篇叙事都要重新对齐（某一页的评论是否还对得上另一页的数字、有没有未定义就出现的指标）。Claude 要在「每次数字变动时」都做这件事，而不是只做一次。[来源](https://claude.com/resources/articles/how-anthropics-finance-team-uses-claude-to-shape-the-narrative-behind-the-numbers)
- 本库提醒：文章描述的是她如何使用 Claude Cowork / Claude for Excel，不是一条官方系统提示。上面的代码块是本库整理，使用时仍应附上源数据，并由人做最终判断。

## 来源
- [Alice Fong：How Anthropic's finance team uses Claude to shape the narrative behind the numbers](https://claude.com/resources/articles/how-anthropics-finance-team-uses-claude-to-shape-the-narrative-behind-the-numbers)

## 标签
财务、验证/自审
