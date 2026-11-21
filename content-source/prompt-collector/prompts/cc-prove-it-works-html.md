---
title: 实现 + 测试 + 用一份 HTML 报告证明它真的能用
category: 验证/自审
tags:
- 验证/自审
- 执行/交付
author: 陈成 (@chenchengpro); Anthropic Claude Code 官方文档（Ask Claude for evidence）
source_url: https://x.com/chenchengpro/status/2122321666898538758
date: '2026-11-17'
id: cc-prove-it-works-html
additional_sources:
- https://code.claude.com/docs/en/best-practices
variants:
- 'Anthropic 官方原则：Ask Claude for evidence: the command it ran and its output, or the
  screenshot.'
status: active
---

## 解决什么问题
agent 说“做完了、测试都过了”你不放心时用：要求它拿出证据，并整理成一份你能直接打开看的 HTML 报告。

## Prompt
原文（陈成第 6 条，英文）：
```text
implement and test and proven me it works with a html under ~/Downloads/
```
中文大意：实现并测试，然后在 ~/Downloads/ 下用一份 HTML 向我证明它能用。

增强版（本库按评论区 + 官方文档整理，非原文）：
```text
实现并测试，然后在 [文件夹] 下生成一份 HTML 报告，证明它能用。报告要像收据，不要像庆功海报：
- 写清验证的是哪个版本（commit hash）；
- 贴出你实际运行的命令和原始输出，UI 改动附截图；
- 没跑过、没覆盖到的场景单独列出来；
- 报告生成后如果代码又改了，重新验证并更新报告。
```

## 已知坑 & 评论区改进
- “第 6 条我会再补半句：「写清验证的是哪个版本，没跑过的场景单列。」不然 HTML 报告很好看，代码后来又改了两轮，证据和结果可能已经不是一对了。报告最好像收据，不要像庆功海报。”—— [@sahuaja3669](https://x.com/sahuaja3669/status/2122545383859454207)
- Anthropic 官方文档：“ask Claude for evidence: the command it ran and its output, or the screenshot. ‘All tests pass’ on its own tells you very little”。大白话：只说“测试都过了”没用，要它贴命令和输出。[来源](https://code.claude.com/docs/en/best-practices)
- 卡兹克评论区的相关教训：“我这边AI汇报三个任务都在跑，实际一个被服务端拒了，一个已经卡死3小时。后来定了条规矩，派完活要看到进度真在动才许汇报。”—— [@Tommyshelby2608](https://x.com/Tommyshelby2608/status/2122276769076298092)
- 英文原则版：“Don't assume success. Completing an action doesn't mean achieving the goal. Verify against reality.”—— [@junjiechou1122](https://x.com/junjiechou1122/status/2122575297837219866)

## 来源
- [陈成 @chenchengpro，第 6 条](https://x.com/chenchengpro/status/2122321666898538758)
- [Anthropic：Best practices for Claude Code — Give Claude a check to run](https://code.claude.com/docs/en/best-practices)

## 标签
验证/自审、执行/交付
