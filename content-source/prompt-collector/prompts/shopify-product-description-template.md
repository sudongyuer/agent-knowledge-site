---
title: 用角色、任务、客户和格式写商品描述
category: 营销
tags:
- 营销
author: Emily Shwake（Shopify 官方博客；文中标注 2026-11-14 由 Alexa Collins 更新）
source_url: https://www.shopify.com/blog/ai-prompts
date: '2026-11-17'
id: shopify-product-description-template
status: active
---

## 解决什么问题
要写或批量改商品描述时用：把可复用的空填进模板（你是谁、卖什么、写给谁、关键细节、语气、输出格式），而不是每次从「写一篇商品文案」重新起头。

## Prompt
原文（Shopify 官方博客《AI Prompts for Ecommerce: 14 Examples》中 “Use a reusable prompt template” 一节的示例，英文）：
```text
You are a [role] for [store name], a [type of business] that sells [product category]. Write a product description for [product name]. The customer is [target customer], and the key details are [features, materials, dimensions]. Use a [brand voice] tone. Format it as [structure].
```
中文大意：你是 [店铺名] 的 [角色]，这是一家卖 [品类] 的 [生意类型]。请为 [商品名] 写一段商品描述。顾客是 [目标顾客]，关键信息是 [卖点、材质、尺寸]。语气用 [品牌语气]。按 [结构] 来排。

把方括号换成你的内容即可。文中说，不必每次四个要素都写全，用上其中几项往往就有帮助。

## 已知坑 & 评论区改进
- 同文把这条模板的结构归到 Google prompting guide 的四个要素：persona（角色）、task（任务）、context（上下文）、format（格式）。[来源](https://www.shopify.com/blog/ai-prompts)
- 同文在「Include examples」一节另外建议：上传已有商品描述，让模型按同样风格写，以保持全站一致（few-shot）。那是同一篇文章里的相邻建议，不是这条模板原文的一部分。[来源](https://www.shopify.com/blog/ai-prompts)
- 本库提醒：生成后仍要核对规格、材质和尺寸，不要把模型补的细节直接当事实发布。

## 来源
- [Emily Shwake，Shopify 官方博客：AI Prompts for Ecommerce: 14 Examples（Use a reusable prompt template）](https://www.shopify.com/blog/ai-prompts)

## 标签
营销
