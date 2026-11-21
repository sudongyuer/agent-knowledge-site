---
title: 让 agent 真正用你的设计系统：靠 lint、类型和 CI 拦，而不是靠提示词劝
category: 设计
tags:
- 设计
- 视觉风格
- 复盘沉淀
- 验证/自审
author: Emil Kowalski（@emilkowalski）; Emil Kowalski（@emilkowalski）; Tony Dinh（@tdinh_me）;
  枯白 Kubai（@Kubai087）
source_url: https://x.com/emilkowalski/status/2123467231510057157
date: '2026-11-21'
id: emil-design-system-for-agents
additional_sources:
- https://x.com/emilkowalski/status/2123796391377948954
- https://x.com/tdinh_me/status/2116387419297849545
- https://x.com/Kubai087/status/2121615225816494303
variants:
- Tony Dinh：Agent 1 先做一套带示例的完整设计系统；Agent 2 立规矩「所有 UI 元素严格用设计系统，永不新造元素」
- 枯白 Kubai：5 条去 AI 味设计指令（组件化 + Design Token、参照成熟组件库建 Do/Don't、全局圆角与等距内缩、4 的倍数间距体系、删掉不必要的
  UX 文案）
status: active
---

## 解决什么问题
项目已经有组件和 token，但 agent 还是常常自己写一个新按钮、写死一个颜色时用。Emil Kowalski（前 Vercel / Linear 设计工程师，Sonner、Vaul 作者）的观点是：要靠规则强制——lint、严格类型的 props、CI 检查、按「角色」命名的 token，让 agent 一写错就被工具拦下，自己改到对为止。

lint：静态检查代码的工具，比如 ESLint。CI：每次提交自动跑检查的流水线。semantic token（语义 token）：按用途命名的变量，如 `textMuted`，而不是按取值命名的 `gray500`。

## Prompt
原文 1（Emil，X 帖，英文）：
```text
To get an agent to use your design system properly, you need to enforce rules.

- Use lint rules and strict type-safe props
- Implement CI checks that fail on misuse of a component
- Document when and how to use each component
- Use semantic tokens (the role of a token)
```
中文大意：要让 agent 正确使用设计系统，必须强制规则：lint 规则和严格类型的 props；组件被误用时让 CI 失败；写清每个组件何时、如何用；用语义 token（token 的角色）。

原文 2（Emil 在同帖下的回复，英文）：
```text
If you have the rules of your design system laid out, you can make your agent test your designs against those rules. You could for example make them rate a page out of 10 and come back with a report of what matches and what needs to get fixed.
```
中文大意：规则写清楚后，可以让 agent 拿这些规则测你的设计，比如给页面打 10 分制的分，并报告哪些符合、哪些要修。

原文 3（Emil，另一帖及回复，英文）：
```text
The biggest one is shortening the feedback loop. Your agent's output no longer requires 20 prompts to get it right, because it uses the right primitives.
```
```text
DESIGN.md is the obvious one, you also can have linters that look for hardcoded values for colors, font-sizes, but also a character limit on a component if it enforces one, etc. These linters can also be invoked by your agent as they work to verify their output.
```
中文大意：最大的好处是缩短反馈回路，agent 用对了基础组件，就不用 20 轮 prompt 才改对。除了 DESIGN.md，还可以写 linter 查写死的颜色、字号，甚至组件的字数上限；agent 干活时也可以自己调用这些 linter 验证产出。

原文 4（Tony Dinh，X 帖，英文）：
```text
Agent 1: Create a fully featured design system with HTML/CSS with examples and demos. Agent 2: Set a rule to strictly use the design system for all UI elements in this project. Never create create new elements.
```
中文大意：第一个 agent 先做一套带示例和演示的完整设计系统；第二个 agent 立规矩：项目里所有 UI 元素严格用设计系统，永不新造。（原文 "create create" 为原帖笔误。）

原文 5（枯白 Kubai，X 帖，中文，节选前 5 条）：
```text
1. 使用组件化管理的思路处理 UI 组件，建立样式与色彩的变量体系，形成 Design Token，保证风格连续。

2. 参考业界成熟的组件库构建组件库的语义体系，建立 Do /Don't 范例，根据正确的语义和场景选择组件，修正当前产品中不合适的组件。

3. 使用全局变量统一管理圆角，使用等距内缩体系。如条件可行且性能无忧，使用连续圆角。

4. 建立全局间距体系，使用 4 的倍数。根据语义的逻辑嵌套关系分配元素间的间距。元素嵌套时，保证必要场景下上下左右间距一致。

5. 移除不必要的 UX 文案。先明确当前页面定位，保留核心标题，关键键值对文案。说明文字符合书面表达规范，避免营销或口语化。根据用户可能的使用频率，在形式上采用 tooltip、alert 等方式作折叠，不必常驻显示。
```

通用版（本库整理，非原文；给 Expo/RN 项目建「拦截网」）：
```text
目标：让以后任何 agent 写界面时，一旦绕开设计系统就被工具拦下。
1. 盘点 theme/token 和 components/，把 token 改成按角色命名（textPrimary、surfaceRaised、spacing.section），不是按取值。
2. 写 lint 规则（ESLint 自定义规则或 no-restricted-syntax）：屏幕文件里禁止写死 hex 颜色、裸 fontSize、不在刻度上的 padding/margin、TouchableOpacity；禁止直接从 react-native 引 Text/Pressable（必须用我们的组件）。
3. 组件 props 用严格类型：variant 用联合类型，不接受任意 style 颜色。
4. 把 lint + tsc 加进 CI 和 pre-commit；加一个 Claude Code 的 Stop hook 跑 lint/tsc，失败就让 agent 继续改。
5. 每个组件写清何时用、何时不用（Do/Don't），放进 DESIGN.md。
6. 留一个「申请新组件」的流程：先证明现有组件不够，再加。
先给我方案和规则清单，确认后再实现；实现后故意写一段违规代码证明会被拦下。
```

## 已知坑 & 评论区改进
（以下为 Tony Dinh 和 Emil 帖子评论区里读到的，用中文转述，除特别标注外不是原话）
- **用 hook 物理拦截新建组件。** @HackrLife 给了 Claude Code PreToolUse hook 的做法：matcher 设为 Write，如果要写的是 `src/ui/` 下的新文件，就输出「Use an existing component from src/ui」并以退出码 2 拦下（[原帖](https://x.com/HackrLife/status/2116849411938799775)）。
- **lint 规则 + Stop hook。** @eugen_nikolajev 建议加 lint 规则，再用 Stop hook 在 agent 结束前跑 lint、类型检查和测试（[原帖](https://x.com/eugen_nikolajev/status/2116527402499076240)）。
- **要有「提新组件」的通道。** @ShivamGuptaim 原话："A design system needs a change process as well as a police force."（设计系统既要警察，也要变更流程。）（[原帖](https://x.com/ShivamGuptaim/status/2123678068804046887)）Expo 的 audit.md §7 正好有「Proposed: [Name]」模板，见 [expo-design-system-drift-audit](expo-design-system-drift-audit.md)。
- **别在没用户之前做全套设计系统。** @Bobbyfinu 提醒过早做完整设计系统会冒出十几种按钮变体（[原帖](https://x.com/Bobbyfinu/status/2117165078911058067)）。
- **token 按角色命名，别按取值。** @KrisAnfalova（[原帖](https://x.com/KrisAnfalova/status/2123634107099787467)）。
- **lint 看不到的，用可运行示例或行为测试补。** @turkelitopcusu（[原帖](https://x.com/turkelitopcusu/status/2123779527084060676)）。
- **最简单的一句：让它建 token，永不写死。** @DerekHoiem（[原帖](https://x.com/DerekHoiem/status/2123659525333143973)）。
- Tony Dinh 原帖附的图片本库读不到，没有收录。
- **本库提醒**：「反复要说的规则做成 hook/lint」与 [kz-retro-to-rules](kz-retro-to-rules.md) 是同一原则，这条是它在设计系统上的具体落地。

## 来源
- [Emil Kowalski：To get an agent to use your design system properly…](https://x.com/emilkowalski/status/2123467231510057157)（及其回复 [2123469547173023880](https://x.com/emilkowalski/status/2123469547173023880)）
- [Emil Kowalski：The biggest one is shortening the feedback loop…](https://x.com/emilkowalski/status/2123796391377948954)（及其回复 [2123800209167724939](https://x.com/emilkowalski/status/2123800209167724939)）
- [Tony Dinh：Agent 1 / Agent 2](https://x.com/tdinh_me/status/2116387419297849545)
- [枯白 Kubai：改善 AI Slop 感的几条产品设计指令](https://x.com/Kubai087/status/2121615225816494303)

## 标签
设计、视觉风格、复盘沉淀、验证/自审
