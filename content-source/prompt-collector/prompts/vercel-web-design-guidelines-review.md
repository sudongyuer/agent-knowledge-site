---
title: 按 Vercel《Web Interface Guidelines》逐文件审 UI 代码，只输出「文件:行号 - 问题」
category: 设计
tags:
- 设计
- 设计审查
- 交互细节
author: Vercel（vercel-labs/web-interface-guidelines）; Vercel（agent-skills：web-design-guidelines）;
  Julien Thibeaut（ibelick/ui-skills：baseline-ui）
source_url: https://github.com/vercel-labs/web-interface-guidelines
date: '2026-11-18'
id: vercel-web-design-guidelines-review
additional_sources:
- https://github.com/vercel-labs/agent-skills
- https://github.com/ibelick/ui-skills/blob/main/skills/baseline-ui/SKILL.md
variants:
- ibelick baseline-ui：Tailwind 项目的 MUST/NEVER 底线规则（h-dvh 代替 h-screen、固定元素尊重 safe-area-inset、没要求就不加动画、交互反馈不超过
  200ms）
status: active
---

## 解决什么问题
界面写完了，想让 agent 按一套成熟的细节规范挑错时用：焦点状态、表单、动画、排版标点、长内容处理、触控等。Vercel 把自家设计团队的几百条界面细节规范公开成了《Web Interface Guidelines》，并做成一个审查命令：读文件 → 对照规则 → 只按「文件:行号」输出问题。和 [anthropic-review-against-spec](anthropic-review-against-spec.md) 一样是「对照标准审」，但那条对照需求规格查正确性，这条对照界面规范查体验细节。

## Prompt
原文（vercel-labs/web-interface-guidelines 的 command.md 开头，英文）：
```text
# Web Interface Guidelines

Review these files for compliance: $ARGUMENTS

Read files, check against rules below. Output concise but comprehensive—sacrifice grammar for brevity. High signal-to-noise.
```
中文大意：审查这些文件是否符合规范：[文件]。读文件，对照下面的规则检查。输出简洁但全面，为简短可以牺牲语法，信噪比要高。

输出格式（原文）：
```text
## src/Button.tsx

src/Button.tsx:42 - icon button missing aria-label
src/Button.tsx:18 - input lacks label
src/Button.tsx:55 - animation missing prefers-reduced-motion
src/Button.tsx:67 - transition: all → list properties

## src/Card.tsx

✓ pass
```
并要求："State issue + location. Skip explanation unless fix non-obvious. No preamble."（只写问题和位置，修法不明显才解释，不要开场白。）

规则节选（原文，「Content Handling」和「Animation」两组）：
```text
- Text containers handle long content: `truncate`, `line-clamp-*`, or `break-words`
- Flex children need `min-w-0` to allow text truncation
- Handle empty states—don't render broken UI for empty strings/arrays
- User-generated content: anticipate short, average, and very long inputs
- Honor `prefers-reduced-motion` (provide reduced variant or disable)
- Animate `transform`/`opacity` only (compositor-friendly)
- Never `transition: all`—list properties explicitly
- Animations interruptible—respond to user input mid-animation
```
中文大意：文字容器要能处理长内容（截断、限制行数或换行）；flex 子元素要加 min-w-0 才能截断；处理空状态，空字符串和空数组不能渲染出坏掉的界面；用户内容要预期短、中、超长三种；尊重「减少动效」；只动 transform/opacity；永远不要 transition: all；动画可被用户中途打断。

安装方式（README 原文）：
```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines
```
skill 每次审查前会从 command.md 拉最新规则。

## 已知坑 & 评论区改进
- **这是 Web 规范，移动端只部分适用。** 里面有移动端条目（"On mobile, the minimum size is 44px"、输入框字号 ≥16px 防止 iOS Safari 自动放大、`touch-action: manipulation`），但 React Native 原生界面请用 [impeccable-ios-slop-test](impeccable-ios-slop-test.md) 和 [expo-screen-done-walkthrough](expo-screen-done-walkthrough.md)。
- **规范里的文案原则也值得抄进自己的 DESIGN.md**（README 原文）："Error messages guide the exit. Don’t just state what went wrong—tell the user how to fix it."（报错要告诉用户怎么解决。）"Avoid ambiguity. … Instead of the button label “Continue” say “Save API Key”."（按钮写具体动作。）
- **还可以在生成阶段就用，不只是事后审。** README 提供了一份 AGENTS.md 下载，放进项目后 agent 写代码时就会参考；审查命令用于事后把关。
- 本库提醒：审查类 prompt 容易「为了找问题而找问题」，见 [anthropic-review-against-spec](anthropic-review-against-spec.md) 里官方关于 "skip style" 的提醒；拿到清单后挑真正影响体验的改。

- **变体（2026-11-21 补充）：ibelick 的 baseline-ui 是更「硬」的底线版。** 它用 MUST / NEVER 写成短规则，适合 Tailwind 网页项目放进规则文件，节选原文："NEVER use `h-screen`, use `h-dvh`"、"MUST respect `safe-area-inset` for fixed elements"、"NEVER add animation unless it is explicitly requested"、"NEVER exceed `200ms` for interaction feedback"。注意它很多条是「没要求就不做」（不加渐变、不改字距、不加自定义缓动），偏保守。

## 来源
- [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines)（README 即完整规范；审查命令在 command.md）
- [vercel-labs/agent-skills：web-design-guidelines](https://github.com/vercel-labs/agent-skills)
- [ibelick/ui-skills：baseline-ui/SKILL.md](https://github.com/ibelick/ui-skills/blob/main/skills/baseline-ui/SKILL.md) — Julien Thibeaut（@Ibelick）

## 标签
设计、设计审查、交互细节
