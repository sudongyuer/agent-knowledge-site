---
title: 睡前派活：/goal 把 App 做专业好看、性能好，不许问我，自己跑多轮
category: 自主运行
tags:
- 自主运行
- UI
- 性能
author: 陈成 (@chenchengpro); Anthropic Claude Code 官方文档（/goal 与无人值守运行）
source_url: https://x.com/chenchengpro/status/2122321666898538758
date: '2026-11-17'
id: cc-overnight-goal
additional_sources:
- https://code.claude.com/docs/en/best-practices
status: active
---

## 解决什么问题
晚上睡觉前给 agent 派一个大目标，让它整晚自己干，早上验收。陈成帖子的评论区说“最狠还是第九条，交代完倒头就睡，早上起来直接验收😂”（[@gggggg57427840](https://x.com/gggggg57427840/status/2122480158808367329)）。
> 大白话：/goal 是 Claude Code 里的命令，设一个“完成条件”，每轮结束会有另一个模型检查条件是否达成，没达成就让它继续。

## Prompt
原文（陈成第 9 条，英文，保留原拼写）：
```text
/goal to make this app professional and beautiful and have good design and have good performance and small animation is better. dont ask me question since i will go to sleep and check your job later. dont stop util you archived it. use workflow if need and work multiple turns.  use worktree and commit and create pr for this.
```
中文大意：目标是让这个 App 显得专业、好看、设计好、性能好，最好有些小动画。别问我问题，我要去睡了，晚点检查。达成之前别停。需要的话用 workflow，多轮工作。用 worktree，提交并为此创建 PR。

更稳的版本（本库按官方文档整理，非原文）：
```text
/goal [写成可检查的完成条件，例如：所有页面通过现有测试和 lint；首屏渲染时间不比 main 差；每个改动过的页面附前后截图]
我要去睡了，不要问我问题，遇到需要我决定的事记下来，先选最保守的做法继续。
在新的 worktree 里做，按主题分多次提交，最后开 PR，不要合并到 main。
早上我要看：改了什么、每项的证据（命令输出、截图）、没完成和不确定的列表。
```

## 已知坑 & 评论区改进
- 原文的“professional and beautiful”没法自动检查。Anthropic 官方文档的 /goal 例子是可检查的条件：“/goal all tests in tests/auth pass and lint is clean”。[来源](https://code.claude.com/docs/en/best-practices)
- 官方文档把 “Tell Claude to keep going, loop until done, don't be lazy” 列为现在可以不说的话：这类话“more likely to cause over-work than fix a stall”（更容易导致过度工作）；无人值守时用 /goal 或 Stop hook 来强制。[来源](https://code.claude.com/docs/en/best-practices)
- 官方文档还提醒：让任务无人值守跑之前，用 GitHub 分支规则保护 main，并先盯着跑几次。[来源](https://code.claude.com/docs/en/best-practices)
- 卡兹克评论区 [@AAAce4518](https://x.com/AAAce4518/status/2122376873347068233) 也贴过一段“睡前指令”，但内容在图片里，本库读不到，未收录。

## 来源
- [陈成 @chenchengpro，第 9 条](https://x.com/chenchengpro/status/2122321666898538758)
- [Anthropic：Best practices for Claude Code — Give Claude a check to run / Let Claude run without you](https://code.claude.com/docs/en/best-practices)

## 标签
自主运行、UI、性能
