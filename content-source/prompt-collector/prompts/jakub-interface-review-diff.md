---
title: 只审「这次改动」带来的界面问题：算清范围、扩到受影响的页面、读被删的行、给每条标 引入/退化/原有
category: 设计
tags:
- 设计
- 设计审查
- 代码审查
author: Jakub Krehel（jakubkrehel/skills：interface-review）
source_url: https://github.com/jakubkrehel/skills/blob/main/skills/interface-review/SKILL.md
date: '2026-11-21'
id: jakub-interface-review-diff
status: active
---

## 解决什么问题
提 PR 前想让 agent 查「我这次改动有没有把界面弄坏」，而不是把整个页面的老问题全翻出来时用。Jakub Krehel 的 interface-review 审的是改动（branch / PR / 未提交），并把改动的文件扩展到真正受影响的页面（比如改了一个 token，所有用它的组件都受影响），还专门读 diff 里被删掉的行找「退化」。

merge-base：当前分支和主分支的分叉点。blast radius（波及范围）：一处改动会影响到的页面集合。

## Prompt
原文 1（核心态度，英文）：
```text
The author is asking "did I make this worse?". Report what the change caused and stay mostly quiet about what it merely touched. Three pre-existing findings is a courtesy; thirty is a different review and one nobody asked for.
```
中文大意：作者问的是「我把它弄得更糟了吗」。报告改动造成的问题，对只是碰到的老问题基本保持沉默。顺带提三条原有问题是礼貌，提三十条就是另一份没人要的审查。

原文 2（没改动时，英文）：
```text
A clean tree with nothing ahead of the merge base means there is no change to review. Never fall back to `HEAD~1..HEAD` on your own. The last commit is whatever happened to land, often a merge or someone else's work.
```
中文大意：工作区干净、也没有领先主分支的提交，就是没有改动可审。不要自作主张去审最后一个提交，那可能是合并提交或别人的工作；应该说明情况，给出选项（当前分支的 PR、最后一个提交、你指定的范围、全仓审查）等用户选。

原文 3（扩展范围与分类，英文节选）：
```text
Expand one hop by default, to the direct importers and callers. Expand a second hop only for design tokens, theme values and shared primitives, where one line reaches the whole product.

Review at most five consumers in total across both hops ... State how many you did not expand, since an unstated cutoff reads as completeness.
...
- `Introduced`: the change created it.
- `Regression`: the change weakened something previously correct.
- `Pre-existing`: present before the change and not made worse by it.
```
中文大意：默认扩一层到直接引用方；只有 token、主题值、共享基础组件才扩第二层。总共最多看五个使用方，并说明还有几个没看——不说截断，读者会以为看全了。每条问题标：引入（改动造成）/ 退化（改动削弱了原本正确的东西）/ 原有（改动前就有、没变糟）。

原文 4（判断一行是不是本次改动，原样）：
```bash
git blame -L <line>,<line> "$BASE"..<head-ref> -- path/to/file
```

原文 5（输出，英文节选）：
```text
| Severity | Domain | Status | Location | Before | After | Why |
...
With no `Introduced` or `Regression` findings, omit the table and state "No actionable interface findings in this change."
```

通用版（本库整理，非原文）：
```text
审查我这次改动带来的界面问题（无障碍、布局、文案、字体、颜色、组件、动效），不审正确性和性能。
1. 范围：若 HEAD 领先 origin/main 的 merge-base，审该范围 + 未提交改动（分别说提交数和未提交文件数）；否则审未提交改动；都没有就停下问我，不要自己去审 HEAD~1。排除 lockfile、快照、生成文件。
2. 扩展：每个改动文件扩到直接使用它的页面/组件；改了 token、theme 或基础组件就再扩一层。最多看 5 个，说明没看的数量。
3. 读每个 hunk 的删除行：被删的 accessibilityLabel、hitSlop、减弱动效处理、深色模式颜色等，如果没有替代就是退化。
4. 对照 PR 描述/提交信息：新增的 variant 或组件是否缺了按下、禁用、加载、空、错误状态，新文案是否进了翻译文件。
5. 每条标 引入/退化/原有（用 git blame 判断），原有的最多列 3 条。
输出：范围表（基准、头、提交数、文件数、排除项、扩展了哪些页面）→ 问题表「严重度 | 领域 | 状态 | 位置 | 改前 | 改后 | 原因」。没有引入或退化的问题就写「这次改动没有需要处理的界面问题」。全程只读，不 checkout、不 stash。
```

## 已知坑 & 评论区改进
- **全程只读，连 checkout 都不行。** 原文："`gh pr checkout`, `git checkout`, `git switch` and `git stash` rewrite the files the author has open, so they are never permitted." 审别的 PR 用 `git fetch` 后 `git show` 读，或另开 worktree。
- **原文依赖同仓的 `better-interface` skill 给严重度和结论格式。** 只抄这一个文件时，严重度用自己的定义即可；原文说缺了 better-interface 时要说明并停下，不要自己发明。
- **视觉结论默认标「未验证」。** 原文：除非项目有便宜的预览或用户要求，视觉和运行时结论标 Not verified。RN 项目可以要求它在模拟器截图后再下结论。
- **本库提醒**：整页走查用 [vercel-web-design-guidelines-review](vercel-web-design-guidelines-review.md) 或 [gstack-design-review-fix-loop](gstack-design-review-fix-loop.md)；这条专门用在提 PR 前。

## 来源
- [jakubkrehel/skills：interface-review/SKILL.md](https://github.com/jakubkrehel/skills/blob/main/skills/interface-review/SKILL.md) — Jakub Krehel

## 标签
设计、设计审查、代码审查
