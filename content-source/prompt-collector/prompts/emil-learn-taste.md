---
title: 收工前把这次会话里的设计纠正，变成带理由的规则写进 DESIGN.md
category: 设计
tags:
- 设计
- 复盘沉淀
- 设计审查
author: Emil Kowalski（设计工程师，曾在 Vercel、Linear；Sonner / Vaul 作者）; Emil Kowalski (@emilkowalski)
source_url: https://github.com/emilkowalski/skills/blob/main/skills/learn-taste/SKILL.md
date: '2026-11-18'
id: emil-learn-taste
additional_sources:
- https://x.com/emilkowalski/status/2120886540788486199
status: active
---

## 解决什么问题
你老在纠正 agent 的同一类设计问题（「阴影别用实线边框」「动画太慢了」），下个会话它又犯时用。Emil 的 /learn-taste skill 在会话结束时把你所有的设计纠正找出来（包括你自己手动改的代码），每条变成一条**带理由**的严格规则，写进 DESIGN.md（大白话：项目根目录一份写给 agent 看的设计规范文件），下一个 agent 就不会再犯。X 上约 3100 收藏。

和 [kz-retro-to-rules](kz-retro-to-rules.md) 是同一类「复盘沉淀」，但用法不同：那条复盘一段时间的 bug 和返工；这条只管**设计品味**，而且只记你本人表达过的偏好。按去重规则第 3 条分开，互相链接。

## Prompt
原文（skill 的硬规则，英文，节选）：
```text
1. **Only the user's taste.** Every rule traces back to something the user said, edited, or confirmed. Never add a rule because it seems like good practice. That's your taste, and your taste is what the user was correcting.
2. **Never invent a why.** If the user gave no reason, propose one marked *inferred* and get it confirmed before writing. A wrong why is worse than none: the next agent extends the reasoning to cases it doesn't fit.
3. **Propose, then stop.** Present every candidate and write only what the user approves. A wrong rule repeats in every future session, exactly like the mistake would have.
4. **A check beats a sentence.** If a violation can be found by matching code (a banned value, a raw hex instead of a token, a forbidden property), propose a lint rule, a token restriction, or a test. A check runs every time. A sentence in a long file gets skipped when the agent's context is full.
5. **Write for an agent that wasn't here.** No "like we discussed" or "the card from earlier". Name the class of component, the value, the token, the file.
```
中文大意：①只记用户的品味，每条规则都能追溯到用户说过、改过或确认过的东西，不因为「看起来是好做法」就加；②不编造理由，用户没说原因就标「推测」并请用户确认，错的理由比没有更糟；③先提议再停下，只写用户批准的；④能用代码匹配查出来的（禁用值、该用 token 却写了色值），就做成 lint 规则或测试，因为长文件里的一句话会在上下文满了时被跳过；⑤写给没参加这次对话的 agent 看，点名组件类别、具体数值、token、文件。

原文（规则落地格式示例，英文）：
```md
## Surfaces

- **Raised surfaces (cards, popovers, menus) use `shadow-raised`, never a solid border.**
  Why: a solid border makes a raised surface look flat and heavy; a semi-transparent shadow separates it from the background and adapts to both themes.
  <!-- 2026-11-12: "no, semi-transparent shadow, not a border" -->
```
中文大意：浮起的表面（卡片、弹层、菜单）用 `shadow-raised`，不用实线边框。理由：实线边框显得扁平沉重，半透明阴影能把它和背景分开且适配深浅两种主题。注释里记日期和用户原话。

没装 skill 时可以直接这样说（本库整理，非原文）：
```text
回顾这次会话里我对设计的所有纠正，包括我手动改过的你写的代码（比如我把 duration 从 400 改成 200）、我连续说「再小一点」最后停在哪、我拒绝或撤销的东西。
每条判断：换一个别的组件，新的 agent 会不会犯同样的错？会才保留。
保留的写成「组件类别 + 具体数值/token + always/never」的规则，附理由：我说过理由就用我的原话，没说就写你的推测并标 inferred，等我确认。
能用 grep/lint 查出来的，提议做成检查。先列给我看，我批准后再写进 DESIGN.md，并确认 CLAUDE.md/AGENTS.md 里有一句 "Before building or changing UI, read DESIGN.md."
```

## 已知坑 & 评论区改进
- **规则要有合适的粒度。** skill 用一个例子说明：只管「定价卡片用阴影」太窄；「永远不用边框」太宽（会弄坏输入框、分割线、表格）；正确的是中间那层「浮起的表面（卡片、弹层、菜单）用 shadow-raised」。
- **评论区最多人问：一次性的修改会不会被泛化成全局规则？**（[@whichaiwon](https://x.com/whichaiwon/status/2121228130941550593)、[@Ralph_Nj20](https://x.com/Ralph_Nj20/status/2121316711852888454)）skill 的过滤步骤就是答案：先问「换一个组件还会犯吗」，不会就跳过。[@Talljackcv](https://x.com/Talljackcv/status/2121038728215093696) 的总结："“I changed 400 to 200” is evidence; “because all animations should be faster” would be a guess."（改了数值是证据，「所有动画都该更快」是猜测。）
- **理由比严格更重要。** [@somyasjain](https://x.com/somyasjain/status/2121151105128337740)："“Less padding here because these rows need to scan as a group” transfers better than “always use 8px.”"（带理由的规则比单纯的数字更好迁移。）他和 [@heyhashirr](https://x.com/heyhashirr/status/2121011064217174523) 都建议每条规则附上修改前后的对比。
- **有人遇到 skill 试图改它自己的 SKILL.md。**（[@veksenn](https://x.com/veksenn/status/2121634426094547216)）本库提醒：运行后看一眼 diff，规则应该落在项目的 DESIGN.md，而不是 skill 文件。
- 这个 skill 设置了 `disable-model-invocation: true`，需要你手动输入 /learn-taste 调用，agent 不会自己触发。Emil 说它的灵感来自 Matt Pocock 的复盘 skill（[来源](https://x.com/emilkowalski/status/2120887191828115492)）。

## 来源
- [emilkowalski/skills：learn-taste/SKILL.md](https://github.com/emilkowalski/skills/blob/main/skills/learn-taste/SKILL.md)
- [Emil Kowalski 发布帖及评论区](https://x.com/emilkowalski/status/2120886540788486199)

## 标签
设计、复盘沉淀、设计审查
