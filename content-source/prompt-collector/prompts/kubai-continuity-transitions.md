---
title: 界面连续性：点到的元素不消失再出现，而是直接变成下一个状态——先诊断排名，再一个个做
category: 设计
tags:
- 设计
- 动效
- 移动端
- 交互细节
author: 枯白 Kubai（@Kubai087）; 枯白 Kubai（@Kubai087，同串 Prompt 回复）
source_url: https://x.com/Kubai087/status/2120320609255043510
date: '2026-11-21'
id: kubai-continuity-transitions
additional_sources:
- https://x.com/Kubai087/status/2120321469817483516
status: active
---

## 解决什么问题
App 里点一行列表、一张卡片、迷你播放条，下一页是「硬切」或整屏淡入淡出，用户不知道自己从哪来时用。枯白 Kubai《999 个小技巧》第 015 期讲连续性（continuity）：界面状态变化时，用户点到的元素直接过渡成下一个状态。附带的 prompt 会先诊断产品里值得做连续性的地方、按价值和成本排名，再按你选的逐个实现。

shared element transition（共享元素转场）：同一个元素在两个页面之间平滑移动/变形。

## Prompt
作者正文（中文原文节选）：
```text
连续性指的是：界面状态变化时，用户点到的元素不会消失再重新出现，而是直接过渡成下一个状态，让人始终清楚自己从哪里来、现在在哪里。

Navigation：行标题延续为页面标题，原标题收为返回按钮；滚动时，标题收入顶栏

Card：卡片展开为正文，图片延展为头图；下拉时，沿原路收回

Player：迷你播放条展开为播放页，封面、标题与按钮各归其位

Search：搜索框移至顶部，匹配项随输入上移，其余淡出

Chart：数据卡片展开为图表，卡片中的小柱延续为图表的柱

Menu：菜单自按钮原位展开；新增项落入首位，其余依次后移

Tab Bar：选中胶囊先伸展，再落位
```

Prompt 原文（同串回复，英文，节选）：
```text
Find the places in my product where the interface jumps from one state to the next, and make the important ones continuous: the element I touched should carry into what comes next instead of disappearing and being replaced. First diagnose and suggest; build only what I pick.

This is a change to my product, not a demo. Work inside my code, on my stack, with my components, tokens and layout. Keep what every action does, what each screen shows and where things end up; change only how one state becomes the next. Do not copy a demo scene (no phone frame, backdrop, sample content or fonts). Do not add a dependency or a router change without asking.
...
2. How to make it continuous
- One element, not two. The thing that moves is the same element (or a shared element the framework matches by id), measured where it starts and where it ends. Animate between the two boxes with transforms; never animate width, height, top or margin on things that reflow.
- What only one state has fades: content that exists only at the end fades in after about 45-55% of the move, and content that exists only at the start fades out in the first 25-35%. Text that changes size scales; it is not cross-faded with a copy.
...
- Timing: open and close with a fast start and a long settle, cubic-bezier(.32, .72, 0, 1) or the product's own spring. Phones: 450-700ms for something that becomes a full screen, 350-500ms for menus and sheets, 400-450ms for an indicator. ...
- Gestures: while a finger or the pointer drags, follow it 1:1 (a dragged card shrinks to about 0.82 as it goes); on release, finish with the release velocity, toward whichever end is nearer.
- Interruptions: a new action takes over from wherever the animation is; nothing waits for an animation to finish, and input is never blocked.
- Reduced motion: keep the change of state and a short cross-fade (about 150ms), drop the movement and scaling.
...
4. Report before building
Go through the product and give me a ranked list, at most 10 entries, each with:
- Where: the screen or component, and the action that triggers it (on phone, desktop or both).
- Now: what happens today, in one line.
- Pattern: which of a-h it is, and which element should carry over.
- Change: what moves to where, the duration and curve, in two or three lines.
- Value: high, medium or low, from how often people do it and how lost they could get without it.
- Cost: what has to change in the code, and any risk (routing, virtualized lists, shared state).
Put the frequent, disorienting ones with low cost first. Then ask me which ones to build and wait.
```
中文大意：找出界面从一个状态「跳」到下一个状态的地方，把重要的做成连续的：我点到的元素延续到下一个状态，而不是消失后被替换。先诊断建议，只做我选的。只改「状态如何变成下一个」，不改功能、内容和最终位置；不照搬演示场景；不擅自加依赖或改路由。做法：动的是同一个元素（或框架按 id 匹配的共享元素），用 transform 在起止两个框之间动画，不动会引起重排的宽高和边距；只在终态存在的内容在移动约 45–55% 后淡入，只在起始存在的在前 25–35% 淡出；文字变大小用缩放，不叠两份交叉淡化；手机上变成全屏的 450–700ms、菜单和弹层 350–500ms；拖动时 1:1 跟手，松手继承速度；新操作随时接管，不阻塞输入；减弱动效时保留状态变化和约 150ms 的淡入淡出。报告：最多 10 条排名，每条写位置、现状、属于哪种模式、怎么动、价值高中低、代码成本和风险（路由、虚拟列表、共享状态），高频易迷路且成本低的排前面，然后问我做哪些。

原文还列了 a–h 八种常见场景（列表行→详情、卡片→全屏、迷你条→面板、搜索、摘要→详情图表、控件→菜单、标签栏指示器、布局变化），以及逐个构建时的检查项：首帧末帧与真实状态完全一致、用真实数据（长短文本、缺图、空列表、已滚动的列表）、快速连点、动画中返回、手势中途取消。

## 已知坑 & 评论区改进
- **原文平台清单没有 React Native。** 第 6 节列了 Web（View Transitions、FLIP、Motion layoutId）、iOS（SwiftUI matchedGeometryEffect、iOS 18 的 zoom 转场）、Android（Compose SharedTransitionLayout）、Flutter（Hero）和桌面。RN 里可以考虑 Reanimated 的布局动画（layout animations）和共享元素转场；共享元素转场在 Reanimated 中曾长期标为实验性功能，以所用版本文档为准；能用原生导航自带转场（如 iOS 原生 stack）时优先用原生（本库提醒）。
- **虚拟列表是常见坑。** 原文在「成本」里专门点名 virtualized lists；FlatList/FlashList 回收单元格后，返回时源元素可能已不在屏幕上，做之前先确认。
- **本次只读了作者本人在串内的回复，没有读到其他人的实质改进评论。** 演示视频本库看不到。
- **本库提醒**：手势手感的底层原则见 [emil-apple-fluid-interfaces](emil-apple-fluid-interfaces.md)；做完用 [emil-review-animations](emil-review-animations.md) 审一遍时长和频率。

## 来源
- [枯白 Kubai：用好连续性，让你的产品更丝滑（015）](https://x.com/Kubai087/status/2120320609255043510)
- [同串 Prompt 回复](https://x.com/Kubai087/status/2120321469817483516)

## 标签
设计、动效、移动端、交互细节
