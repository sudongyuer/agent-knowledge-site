---
title: 用 worktree 逐个审 PR：关注包体积、边界情况、UI/UX，批准合并或带评论拒绝
category: 代码审查
tags:
- 代码审查
- 验证/自审
- UI
author: 陈成 (@chenchengpro)
source_url: https://x.com/chenchengpro/status/2122321666898538758
date: '2026-11-17'
id: cc-review-prs-one-by-one
status: active
---

## 解决什么问题
积压了一堆 PR（包括别的 agent 开的）要处理时用：让 agent 在 worktree 里一个个拉下来审，看包体积、边界情况、UI 和交互，能合就改进后合，不能合就留评论拒绝。
> 大白话：bundle size = 打包后的代码体积，App/网页越大加载越慢；edge case = 边界情况（空数据、超长文本、断网等）。

## Prompt
原文（陈成第 8 条，英文）：
```text
review prs one by one with worktree. and should care the bundle size increase and edge case and good ui design and ux and related.  approve & merge or reject with comment. if approve and have suggestion, should update the pr and do the improve first.
```
中文大意：用 worktree 逐个审查 PR，要关注包体积增长、边界情况、UI 设计和用户体验等。批准并合并，或带评论拒绝。如果批准但还有建议，先在这个 PR 上把改进做掉再合。

## 已知坑 & 评论区改进
- 评论区没有针对这一条的讨论。
- 本库提醒（非原话）：这条会真的合并/拒绝 PR（对外可见、动到 main），团队仓库里先改成“只给审查意见，不合并”跑几次，看质量再放权。审查范围可参考 [anthropic-review-against-spec](anthropic-review-against-spec.md) 的“只报影响正确性的问题”。

## 来源
- [陈成 @chenchengpro，第 8 条](https://x.com/chenchengpro/status/2122321666898538758)

## 标签
代码审查、验证/自审、UI
