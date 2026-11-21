---
title: 在 worktree 里一步步做完，一次提交，合并或开 PR
category: 执行/交付
tags:
- 执行/交付
author: 陈成 (@chenchengpro)
source_url: https://x.com/chenchengpro/status/2122321666898538758
date: '2026-11-17'
id: cc-worktree-implement-commit-merge
status: active
---

## 解决什么问题
计划已经确认后用：让 agent 在独立的 worktree 里把所有步骤做完，最后一次提交，然后合到 main 推送，或开 PR。
> 大白话：worktree = 同一个仓库在另一个文件夹里再检出一份，agent 在里面改不会弄乱你手上正在用的那份。commit = 存一次档。PR = 合并申请，别人（或你）审过再合。

## Prompt
原文（陈成第 2 条，英文）：
```text
implement all steps one by one until all is completed, in worktree, then commit in one commit, merge to  main & push / create pr
```
中文大意：把所有步骤一个一个做完，在 worktree 里做，然后合成一次提交，合并到 main 并推送 / 或者创建 PR。（“merge to main & push / create pr”是二选一。）

更稳的版本（本库按评论区整理，非原文）：
```text
在新的 worktree 里把计划里的所有步骤一个一个做完。
做完后：1) 在分支里跑测试并贴出命令和结果；2) 合成一次提交；3) 开 PR，不要直接合并到 main；
4) 如果合并前 main 有新提交，先 rebase/合并最新 main，再跑一次关键回归测试并贴出结果。遇到冲突，说明你怎么解决的。
```

## 已知坑 & 评论区改进
- 要分两次验收：“worktree 隔离和最终 merge，最好拆成两个验收阶段：分支内测试通过，不等于合到最新 main 后仍通过。让 Agent 在合并后再跑一次关键回归，能避免每个分支都交满分答卷，拼起来却不是同一套题。”—— [@YXxquf](https://x.com/YXxquf/status/2122551013676568698)
- 冲突怎么办：[@vexor4i](https://x.com/vexor4i/status/2122322002329444520) 问 “how do you handle conflicts when the worktree merge hits main”，陈成回复 “code agent will handle this.”（[原回复](https://x.com/chenchengpro/status/2122322161872568653)）。@vexor4i 追问：“works until it doesnt. what happens when the agent picks the wrong parent or rewrites history you didnt want touched”（[原帖](https://x.com/vexor4i/status/2122346690309161202)），未见答复。
- 本库提醒（非评论原话）：对新手和多人协作的仓库，“直接 merge 到 main 并 push”风险大，建议默认走 “create pr”。Anthropic 官方文档也建议无人值守跑任务前给 main 加分支保护规则。[来源](https://code.claude.com/docs/en/best-practices)

## 来源
- [陈成 @chenchengpro，第 2 条](https://x.com/chenchengpro/status/2122321666898538758)

## 标签
执行/交付
