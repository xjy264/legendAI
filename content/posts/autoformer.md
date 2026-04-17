---
slug: autoformer
title: Autoformer：先拆趋势，再谈长序列
description: Autoformer 最值得记住的，不是它把 Transformer 做得更复杂，而是它先把趋势和季节性拆开，再让自相关去找重复结构。
tags: [Autoformer, decomposition, auto-correlation, long-sequence]
category: 论文笔记
status: published
featured: true
cover: /paper-assets/autoformer/cover.png
publishedAt: 2025-06-14
---

我读 Autoformer 时，最先抓住的不是它的名字，而是它的态度：长序列不是先把模型堆大，而是先把序列里最吵、最乱、最重复的东西分开处理。

## 它先回答了什么问题
在长时序预测里，麻烦通常不是“模型不够深”，而是输入本身混着三层东西：趋势、周期和噪声。标准注意力会把这些信息一起看，结果很容易把重点看散。

Autoformer 的思路很直接：

1. 先做序列分解，把趋势和残差拆开。
2. 再用 Auto-Correlation 去找重复的时间依赖，而不是盯着每个 token 做全量匹配。
3. 在编码器和解码器里反复使用这个分解-建模流程，让预测逐层收敛。

![Autoformer 核心结构](/paper-assets/autoformer/detail.png)

## 我最在意的两个模块
`Series Decomposition` 不是装饰，它是 Autoformer 的起点。移动平均把平滑趋势拿走之后，剩下的部分更像真正需要建模的波动。

`Auto-Correlation` 则是在改问题的问法。它不再问“这个 token 和所有 token 谁更像”，而是问“哪几个时间延迟最可能对应重复模式”。这一步把长序列里的周期性变成了可检索对象。

## 这篇论文真正厉害的地方
Autoformer 的价值不只在效果，更在于它提醒我：时间序列建模里，先把结构讲清楚，往往比直接上更复杂的 backbone 更重要。

如果把它放在我的阅读顺序里，它更像一个提醒器：

- 先看数据里有没有可分解结构。
- 再决定要不要用更重的注意力。
- 最后才是比较指标。

## 一句话总结
Autoformer 不是在“改造 Transformer”，而是在告诉我们：长序列预测首先是结构问题，其次才是模型问题。
