---
title: 客服回复只引用已有政策，超出范围就用兜底句
category: 运营
tags:
- 运营
author: Emily Shwake（Shopify 官方博客；文中标注 2026-11-14 由 Alexa Collins 更新）
source_url: https://www.shopify.com/blog/ai-prompts
date: '2026-11-17'
id: shopify-return-policy-fallback
status: active
---

## 解决什么问题
让 AI 代写客服回复、尤其是退换货政策相关问题时用：只允许它引用你附上的政策原文，没写到的情况用一句固定兜底，避免随口保证、编造政策。

## Prompt
原文（Shopify 官方博客《AI Prompts for Ecommerce: 14 Examples》第 7 条，英文；文中用弯引号包住整句，下面是引号内的原文）：
```text
Generate an AI-powered response to this customer inquiry about our return policy. Keep the style empathetic and professional. Only reference policies that are explicitly stated in the attached document. If the inquiry falls outside what’s covered, respond with: ‘Our return policy doesn’t address that scenario directly, but you can find the full details at this link.’ Do not make any guarantees or promises beyond the document.
```
中文大意：根据这封关于退货政策的客户咨询，生成回复。语气保持共情、专业。只引用附件政策里写明的条款。如果咨询超出政策覆盖范围，就回复：“我们的退货政策没有直接说明这种情况，完整说明见这个链接。” 不要做出超出该文件的任何保证或承诺。

使用时：把政策原文附在对话里，并把兜底句里的 “this link” 换成你自己的政策链接。

## 已知坑 & 评论区改进
- 同一篇文章把这种写法称为 risk-aware prompting（风险意识提示）：给模型一个「条件不满足时的退路」，降低幻觉或胡编。作者还写：高利害场景（政策、承诺）尤其要这样用。[来源](https://www.shopify.com/blog/ai-prompts)
- 同文提醒：所有涉及商店政策的 AI 客服回复都要人工复核后再发出；文中也提到 Shopify Inbox 会先给出建议回复，由团队审改再发送。[来源](https://www.shopify.com/blog/ai-prompts)
- 本库提醒：没有附上政策原文时，不要用这条；兜底句里的链接必须是真实地址。

## 来源
- [Emily Shwake，Shopify 官方博客：AI Prompts for Ecommerce: 14 Examples（第 7 条 Customer service prompts）](https://www.shopify.com/blog/ai-prompts)

## 标签
运营
