---
title: 让子 agent 对照规格书审 diff，只报影响正确性的缺口
category: 验证/自审
tags:
- 验证/自审
- 代码审查
author: Anthropic Claude Code 官方文档
source_url: https://code.claude.com/docs/en/best-practices
date: '2026-11-17'
id: anthropic-review-against-spec
status: active
---

## 解决什么问题
回答评论区“有没有好的指令让AI审核自己写的代码”（[@thirdview95](https://x.com/thirdview95/status/2122602096252055808)）：写完后，让一个没看过你们对话的子 agent（subagent，大白话：另开的一个干净助手）拿着规格书逐条核对改动，只报真正影响正确性的问题。

## Prompt
原文（官方文档，英文）：
```text
use a subagent to review the rate limiter diff against SPEC.md, check every requirement is implemented and the listed edge cases have tests, report gaps that affect correctness and skip style
```
通用版（把功能名换掉即可）：
```text
use a subagent to review the [功能名] diff against SPEC.md, check every requirement is implemented and the listed edge cases have tests, report gaps that affect correctness and skip style
```
中文大意：用一个子 agent 对照 SPEC.md 审查这次改动（diff），检查每条需求都实现了、列出的边界情况都有测试，只报告影响正确性的缺口，跳过代码风格问题。

## 已知坑
- 官方原话：“Don't drop the `skip style` part of that prompt. A reviewer that's asked to find problems will always find something. If you fix every finding, you end up with extra abstraction layers and tests for cases that can't happen.”
- 需要先有 SPEC.md：可以用 [kz-clarify-then-three-options](kz-clarify-then-three-options.md) 里的 “Interview me … write it to SPEC.md” 变体生成。
- 官方说明：一个新的审查者有用，是因为它没看过你的推理过程；单纯把同一个任务交给子 agent 并不会让答案更好。

## 来源
- [Anthropic：Best practices for Claude Code — Review against your spec](https://code.claude.com/docs/en/best-practices)

## 标签
验证/自审、代码审查
