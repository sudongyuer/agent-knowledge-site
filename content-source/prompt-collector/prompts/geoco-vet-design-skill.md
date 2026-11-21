---
title: 装设计 skill 之前，先让 agent 读一遍：它做什么、跑什么命令、和我的设计系统哪里冲突
category: 设计
tags:
- 设计
- 调研
- 设计审查
author: Tommy Geoco (@designertom)
source_url: https://x.com/designertom/status/2114786186250379759
date: '2026-11-18'
id: geoco-vet-design-skill
status: active
---

## 解决什么问题
现在 X 上每周都有新的「去 AI 味设计 skill」刷屏（Impeccable、taste-skill、Hallmark……），想装又不确定靠不靠谱时用。Tommy Geoco 的帖子（约 340 收藏）给了一份装之前的检查清单和一句可以直接粘贴的 prompt：先让 agent 读 SKILL.md，说清它做什么、会跑哪些命令、借用了谁、和你的设计系统哪里冲突，**先别装**。对正在研究怎么写移动端设计 skill 的人，这也是拆解别人 skill 的好方法。

## Prompt
原文（帖子里的 "Prompt to paste into your agent"，英文）：
```text
Read the SKILL.md at [repo URL]. Tell me what it does, every command it runs, what it credits, and which parts conflict with my design system. Don't install anything yet.
```
中文大意：读一下 [仓库地址] 里的 SKILL.md。告诉我它做什么、会运行的每一条命令、它致谢/借用了谁、哪些部分和我的设计系统冲突。先什么都别装。

同帖的检查清单（原文）：
```text
1. Read the SKILL.md yourself. A skill is just a file.
2. Check the credits. Does it name the skills it borrowed from?
3. Check what it runs. Writing files is low risk. Installing packages or running scripts needs a closer look.
4. Try it on a throwaway branch first.
5. Find the section where its taste lives (fonts, colors, spacing, motion) and swap in yours.
```
中文大意：①自己读 SKILL.md，skill 只是一个文件；②看致谢，有没有写明借鉴了哪些 skill；③看它会运行什么，写文件风险低，装包、跑脚本要仔细看；④先在一个用完即弃的分支上试；⑤找到它存放「品味」的那一段（字体、颜色、间距、动效），换成你自己的。

## 已知坑 & 评论区改进
- **作者自己的做法**：原话 "The first skills I installed this year, I rebuilt to my own taste right away."（今年装的头几个 skill，他马上按自己的品味重写了。）
- **为什么第 3 条重要（本库核实的例子）**：Impeccable 的 live 模式在某些情况下会以关闭审批和沙箱的方式调用 codex 或 claude CLI（README 原文写了 `--dangerously-bypass-approvals-and-sandbox` / `--permission-mode bypassPermissions`，并给了关掉它的环境变量）。这类信息只有读了文件才知道。[来源](https://github.com/pbakaus/impeccable)
- **「通用设计 skill 反而拉低效果」的争论**：见 [openai-design-system-references-first](openai-design-system-references-first.md) 里 Gui Vilela 和 Emil Kowalski 的讨论。Emil 的立场是 skill 应该小而专注于具体规则，不替你决定风格。
- 本库提醒：第 5 条「把品味段换成你的」，对 LobeHub 这类已有设计规范的项目最关键，也可以反过来用：让 agent 把 skill 里的规则和你的 DESIGN.md 逐条比对，只吸收不冲突的。

## 来源
- [Tommy Geoco @designertom 的帖子](https://x.com/designertom/status/2114786186250379759)

## 标签
设计、调研、设计审查
