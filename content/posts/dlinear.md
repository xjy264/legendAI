---
slug: dlinear
title: DLinear：线性模型也能很强，前提是把问题拆对
description: DLinear 让我重新看了一次“简单”这件事。它几乎没有花哨结构，却靠把趋势和季节性拆开，证明线性模型也能很有竞争力。
tags: [DLinear, baseline, decomposition, paper-notes]
category: 基线分析
status: published
featured: true
cover: /paper-assets/dlinear/cover.png
publishedAt: 2025-08-18
---

我一开始看 DLinear，第一反应是它太朴素了。后来才意识到，它最厉害的地方恰恰在于朴素：把问题拆对，比堆更多层数更重要。

## 它到底在证明什么
DLinear 不是在说深模型没用，而是在提醒我们：如果输入里最核心的结构没处理好，再复杂的网络也可能只是绕远路。

它的主线非常清楚：

1. 先做 decomposition，把趋势和季节性拆开。
2. 分别对两部分做线性映射。
3. 再把结果合起来输出预测。

![DLinear 核心结构](/paper-assets/dlinear/detail.png)

## 为什么它会强
`decomposition` 把原本纠缠在一起的模式拆松了。趋势负责慢变化，季节性负责重复波动，线性层只需要各自做好自己的事。

这也是 DLinear 最值得借鉴的地方：它没有和复杂结构硬碰硬，而是先承认时间序列里本来就有很强的可分解性。很多时候，简化输入结构，比增加模型结构更有意义。

## 我自己的结论
DLinear 对我最有冲击的一点，是它重新定义了 baseline 的角色。它不是“凑数的简单模型”，而是一个检查器：

- 如果复杂模型赢不了它，先怀疑自己有没有把分解和归一化做好。
- 如果线性模型已经很强，说明问题里可能本来就有很强的线性结构。
- 如果结构足够清楚，模型未必需要太花。

## 一句话总结
DLinear 证明的不是“线性永远最优”，而是“把结构拆清楚以后，线性就可能足够强”。
