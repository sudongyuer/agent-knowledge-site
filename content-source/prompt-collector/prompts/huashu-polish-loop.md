---
title: 打磨环：逐屏截原图看，每轮只改「最伤的三处」，再截再看，直到找不出三处
category: 设计
tags:
- 设计
- 设计审查
- 验证/自审
- 移动端
author: 花叔（alchaincyf，huashu-design 作者）; 花叔（alchaincyf）
source_url: https://github.com/alchaincyf/huashu-design/blob/master/references/polish-loop.md
date: '2026-11-18'
id: huashu-polish-loop
additional_sources:
- https://github.com/alchaincyf/huashu-design/blob/master/SKILL.md
variants:
- Anthropic frontend-design skill：Critique your own work as you build, taking screenshots
  to review if your environment supports it — a picture is worth 1000 tokens.（见 anthropic-frontend-design-plan-critique）
status: active
---

## 解决什么问题
agent 写完页面就交、自己从没看过渲染效果时用。花叔的 huashu-design（中文社区热门设计 skill，2026-11-18 约 3 万 star）把「看自己的截图再改」做成硬流程：把页面按屏切成原尺寸截图，逐张看，带着 8 个问题挑出**最伤的三处**写下来，只改这三处，再截再看。花叔原话：「同一个模型，看过自己的截图再改三轮，和写完就交，产出差一个档次。」中文原文，可以直接用。

## Prompt
原文 1（SKILL.md「打磨环」一节）：
```text
第一版只是草稿。每个要给用户看的设计都要坐回去看：`polish.py shot` 把页面切成一屏一屏的原尺寸截图，
逐张打开，写下最伤的三处，改，再截。三方向的每个初稿 1 轮；选定方向后的正式版至少 2 轮，
到认真看完找不出值得改的三处为止。
```

原文 2（polish-loop.md「看什么」的八个问题）：
```text
1. **首屏三秒**：没看过这个项目的人，三秒内看得出这是什么、给谁的吗？这个题材世界里独有的东西出现在第一眼里了吗？
2. **主角素材**：方向卡里写的主角素材到位了吗？内容必需的图在不在——介绍 App 的页面看得见 App 的界面吗，讲数据的页面数据成了画面吗？
3. **每一屏的事件**：往下滚，每一屏有没有一个让人停一下的东西，还是「小标题＋三张卡片」重复到底？
4. **层级**：眯起眼看每一屏，最先跳出来的是不是最重要的那个？
5. **手艺**：对齐、间距的节奏、行尾的孤字、难看的断行、溢出、裂图、和周围不是一套的元素。
6. **手机**：窄屏下同样的问题再问一遍——不是「没坏」就行，是在手机上也像被设计过。
7. **对照方向卡**：把截图和方向卡、参考板（或样张）并排看，「借的是什么」里写的那几条规则落实了吗？走样在哪？
8. **摘一件**：去掉哪一样东西，这一屏反而更好？
```

原文 3（改什么）：
```text
一轮只改最伤的三处，改完重新截图再看。不要一轮里顺手改十几处——改多了看不出哪个改动起了作用，也容易把好的地方改坏。
先改结构性的（首屏不成立、主角素材缺席、整屏平庸），再改手艺上的。
```

不装 skill 时的通用版（本库整理，非原文）：
```text
写完先别交。用 Playwright（或模拟器截图）把页面按屏切成原尺寸截图，手机宽度也截一套，逐张打开看，不要看缩小的整页长图。
每屏问：三秒内看得懂吗？最先跳出来的是不是最重要的？对齐、间距、断行、溢出有没有问题？去掉哪样东西会更好？
写下最伤的三处（哪一屏、哪个元素、怎么不对），只改这三处，再截图再看。至少两轮，直到找不出值得改的三处。
最后把第一轮和最后一轮的首屏截图并排给我。
```

## 已知坑 & 评论区改进
- **一定要看原尺寸逐屏图。** 原文：「整页长截图缩成一张看，字和间距都糊了，问题看不出来——一定要一屏一屏看原图。」
- **改到第 5 轮还在大改，就别打磨了。** 原文：「到第 5 轮还在大改，说明问题在方向或结构上，不在打磨上：停下来，把看到的问题和两个可选的改法告诉用户。」
- **没有看图能力就如实说。** 原文：交付时如实说明「这一版没有经过看图打磨」，并把截图路径给用户。和库里「报告像收据」的要求一致（见 [cc-prove-it-works-html](cc-prove-it-works-html.md)）。
- **同一 skill 的「三方向门」**：任何新设计先出三个方向的真实初稿给用户选，选定后才做；这条已作为变体挂在 [anthropic-remix-liked-options](anthropic-remix-liked-options.md)。
- **本库提醒**：花叔这个 skill 定位是 HTML 原型、幻灯片、动画，原文写明「生产级 Web App、SEO 网站、需要后端的系统不走本 skill」。用在 App 开发时只借打磨环这个方法，截图换成模拟器截图。修复阶段要更稳的提交和回滚规则，见 [gstack-design-review-fix-loop](gstack-design-review-fix-loop.md)。

## 来源
- [huashu-design：references/polish-loop.md](https://github.com/alchaincyf/huashu-design/blob/master/references/polish-loop.md)
- [huashu-design：SKILL.md](https://github.com/alchaincyf/huashu-design/blob/master/SKILL.md)（v3.3.0，2026-11-18 读取）

## 标签
设计、设计审查、验证/自审、移动端
