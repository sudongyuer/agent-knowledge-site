---
title: 动效审查：默认挑错，按「删掉→减弱→缓动→原点→可打断→GPU」的顺序给修法，最后明确 Block 或 Approve
category: 设计
tags:
- 设计
- 动效
- 设计审查
- 代码审查
author: Emil Kowalski（emilkowalski/skills：review-animations）; Emil Kowalski（@emilkowalski）;
  Julien Thibeaut（ibelick/ui-skills：fixing-motion-performance）
source_url: https://github.com/emilkowalski/skills/blob/main/skills/review-animations/SKILL.md
date: '2026-11-21'
id: emil-review-animations
additional_sources:
- https://x.com/emilkowalski/status/2123029498694410401
- https://github.com/ibelick/ui-skills/blob/main/skills/fixing-motion-performance/SKILL.md
variants:
- Emil X 帖一句话版：Make all trigger-based UI elements in this app animate from their trigger,
  not their center.
- ibelick fixing-motion-performance：按渲染步骤（composite / paint / layout）查动画性能；blur 动画
  ≤8px；不迁移动画库
status: active
---

## 解决什么问题
agent 加了一堆动画，跑是能跑，但「感觉不对」——太慢、从奇怪的地方冒出来、频繁操作也在动、掉帧——时用。Emil Kowalski 的 review-animations 是一个只审动效的 skill：十条硬标准，看到就重拳标记的模式清单，修法有优先顺序，输出固定为「改前 | 改后 | 原因」表格加明确结论。

transform-origin：缩放/旋转的基准点。interruptible（可打断）：动画进行中再次触发时从当前状态接着走，而不是跳回起点重放。

## Prompt
原文 1（Operating Posture，英文）：
```text
You are a senior design engineer with a brutal eye for craft. Your bias is toward **motion that feels right**, not motion that merely runs. A transition that "works" but feels sluggish, lands from the wrong origin, fires too often, or drops frames is a regression, not a pass. Default to flagging. Approval is earned, not assumed.
```
中文大意：你是对工艺极其挑剔的资深设计工程师，追求「感觉对」而不是「能跑」。能用但迟钝、从错误原点出现、触发太频繁、掉帧的动画都算退步。默认挑错，通过要靠挣。

原文 2（十条标准，节选前五条，英文）：
```text
1. **Justified motion.** Every animation must answer "why does this animate?" — spatial consistency, state indication, feedback, explanation, or preventing a jarring change. "It looks cool" on a frequently-seen element is a block.
2. **Frequency-appropriate.** Match motion to how often it's seen. Keyboard-initiated and 100+/day actions get **no** animation. Tens/day gets reduced motion. Occasional gets standard. Rare/first-time can have delight.
3. **Responsive easing.** Entering/exiting elements use `ease-out` or a strong custom curve. `ease-in` on UI is a block — it delays the moment the user watches most. ...
4. **Sub-300ms UI.** UI animations stay under 300ms. Modals, drawers, sheets, and toasts are the documented exceptions ...
5. **Origin & physical correctness.** Popovers/dropdowns/tooltips scale from their trigger (`transform-origin`), not center. Never animate from `scale(0)` — start from `scale(0.9–0.97)` + opacity (Modals are exempt — they stay centered.)
```
中文大意：①每个动画要回答「为什么动」，常见元素上「好看」不算理由；②按频率：键盘触发和每天 100+ 次的操作不动画，每天几十次的弱化，偶尔的正常，罕见/首次的可以有惊喜；③进出用 ease-out 或强自定义曲线，UI 上用 ease-in 直接拦；④UI 动画 <300ms，弹窗、抽屉、底部弹层、toast 例外；⑤弹出层从触发点缩放，不从中心；永远不从 scale(0) 开始，从 0.9–0.97 加透明度。后五条是：可打断、只动 GPU 属性（transform/opacity）、无障碍（减弱动效不是归零）、进出不对称（刻意的动作慢、系统响应快）、与产品性格一致。

原文 3（修法优先顺序，英文节选）：
```text
1. **Delete the animation** (high-frequency / no purpose / keyboard-triggered).
2. **Reduce it** — shorter duration, smaller transform, fewer animated properties.
3. **Fix the easing** ...
4. **Fix the origin/physicality** ...
5. **Make it interruptible** ...
6. **Move it to the GPU** ...
```

原文 4（Emil X 帖，一句话 prompt，英文）：
```text
Make all trigger-based UI elements in this app animate from their trigger, not their center.
```
中文大意：让这个 App 里所有由触发器弹出的界面元素，从触发器的位置展开，而不是从中心。Emil 在同串的回复里说："Alternatively, run /review-animations in your app"（或者直接在你的 App 里跑 /review-animations）。

通用版（本库整理，非原文；RN/Reanimated 项目可用）：
```text
只审查 [目录/改动] 里的动画和转场，不改功能代码。默认挑错。
对每个动画检查：为什么要动？每天会触发几次（高频的直接建议删掉）？时长是否 <300ms（弹层/抽屉/toast 除外）？进出是否用 ease-out 或弹簧、有没有 ease-in？弹出层是否从触发它的按钮位置展开（菜单靠屏幕边缘翻转时原点也要跟着翻）？有没有从 scale 0 出现？能否在进行中被打断并从当前值继续？是否只动 transform/opacity？是否尊重系统「减弱动态效果」？
修法按顺序优先：删掉 → 减弱 → 换缓动 → 修原点 → 改成可打断 → 移到 GPU 属性。
输出：一张表「改前 | 改后 | 原因」，每行带 文件:行号；然后按影响分组的结论；最后一行写 Block 或 Approve。
```

## 已知坑 & 评论区改进
（Emil「animate from their trigger」帖评论区，中文转述，除特别标注外不是原话）
- **菜单翻转时原点也要翻。** 弹层靠近屏幕边缘会翻到另一侧，这时 transform-origin 也要跟着变，否则又从错的地方长出来（@screenest_ai [原帖](https://x.com/screenest_ai/status/2123066033602699737)、@Vibefold [原帖](https://x.com/Vibefold/status/2123051097656885450)、@ShivamGuptaim [原帖](https://x.com/ShivamGuptaim/status/2123455588298637489)）。
- **把原点写进弹层组件本身。** 只在页面里修一次，下一个 agent 写新弹层时又会回到中心；要在 popover 组件里固定（@groundedui [原帖](https://x.com/groundedui/status/2123059907930824846)）。也有人建议把规则放在每次运行都会读到的地方，再加一道审查检查（@SydlaAI [原帖](https://x.com/SydlaAI/status/2123070470194933924)）。
- **Base UI 提供现成变量。** @gyankarn 提到 Base UI 的 `--transform-origin` 变量（[原帖](https://x.com/gyankarn/status/2123074070065352856)）；skill 的示例表里也写了 `var(--transform-origin)` (Base UI)。
- **放慢 10 倍检查。** @sariyevnurgali 建议把动画放慢 10 倍看原点和轨迹（[原帖](https://x.com/sariyevnurgali/status/2123329078594068943)）。
- **性能问题单独查。** ibelick 的 fixing-motion-performance 按渲染步骤排查（"composite: transform, opacity"），要求 "keep blur animation small (<=8px)"，并且 "Do not migrate animation libraries unless explicitly requested."
- Emil 帖子里演示原点效果的视频本库看不到，没有收录。
- **本库提醒**：skill 原文偏网页（CSS、Motion）；RN 项目用的时候把 CSS 术语换成 Reanimated 对应概念。动画该不该做的门槛见 [emil-animate-expo-gate](emil-animate-expo-gate.md)，原点规则已在 [emil-taste-as-rules](emil-taste-as-rules.md) 的表格里出现过。

## 来源
- [emilkowalski/skills：review-animations/SKILL.md](https://github.com/emilkowalski/skills/blob/main/skills/review-animations/SKILL.md) — Emil Kowalski
- [Emil Kowalski：Make all trigger-based UI elements…](https://x.com/emilkowalski/status/2123029498694410401)（回复 [2123032309502718353](https://x.com/emilkowalski/status/2123032309502718353)）
- [ibelick/ui-skills：fixing-motion-performance/SKILL.md](https://github.com/ibelick/ui-skills/blob/main/skills/fixing-motion-performance/SKILL.md) — Julien Thibeaut

## 标签
设计、动效、设计审查、代码审查
