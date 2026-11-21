---
title: 说清你要的范围：“be ambitious”+ 列出要覆盖的状态
category: 需求对齐
tags:
- 需求对齐
- UI
author: Anthropic Claude Code 官方文档
source_url: https://code.claude.com/docs/en/best-practices
date: '2026-11-17'
id: anthropic-be-ambitious-scope
status: active
---

## 解决什么问题
agent 总是只做“最小能交差的版本”时用（比如只画了界面，没做空状态、报错、键盘操作）。官方说明：模型倾向于保守理解请求、做满足要求的最小版本，因为它看不到你期望多少。对做 mobile/UI 的场景尤其有用。

## Prompt
原文（官方文档，英文）：
```text
build the settings page from the mockup. be ambitious: empty and error states, the save flow wired up, keyboard navigation, not just the layout
```
通用版：
```text
build [页面/功能] from [设计稿]. be ambitious: [你期望覆盖的东西，例如 empty and error states, loading state, the save flow wired up, accessibility], not just the layout
```
中文大意：按设计稿做设置页。要有野心：空状态和错误状态、保存流程接通、键盘导航，不只是布局。

## 已知坑
- 官方原话：这是在告诉 Claude 范围（只有你知道），而不是让它“想得更用力”。同一页文档也说 “think hard / be thorough” 这类词只是普通文本，在 effort（推理力度）设置范围内轻推一下，不是提高力度的关键词。
- 和陈成第 9 条（“professional and beautiful”）对比：列出具体要覆盖的状态，比形容词更可执行。

## 来源
- [Anthropic：Best practices for Claude Code — be ambitious](https://code.claude.com/docs/en/best-practices)

## 标签
需求对齐、UI
