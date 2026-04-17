---
slug: informer
title: Informer：先把长序列压缩，再谈高效注意力
description: Informer 的重点不是把 Transformer 变成另一个怪物，而是先用 ProbSparse 和 distilling 把长序列变短，再让模型把算力用在更值得看的位置。
tags: [Informer, ProbSparse, distilling, long-sequence]
category: 论文笔记
status: published
featured: true
cover: /paper-assets/informer/cover.png
publishedAt: 2025-07-09
---

我读 Informer 时最先记住的，不是它是不是“最强”，而是它说话很诚实：长序列真的太贵了，那就先想办法把它压缩，再来谈注意力。

## 它到底解决了什么
长序列预测里，标准全量注意力的麻烦很直接。长度一上来，计算和显存都会被迅速拉爆。Informer 没有假装问题不存在，而是直接承认：如果把所有 token 都平等地看一遍，很多算力其实是浪费的。

所以它的主线很清楚：

1. 用 `ProbSparse Attention` 先把注意力集中到更重要的 query 上。
2. 用 `distilling` 在层与层之间压缩序列长度。
3. 用生成式解码器一次性输出未来，而不是一步一步拖着走。

![Informer 核心结构](/paper-assets/informer/detail.png)

## 两个词最关键
`ProbSparse` 的意思不是“随机省事”，而是从信息量角度筛掉不值得大算的部分。它试图回答的不是“每个 token 都该看谁”，而是“哪些 query 值得更认真地算一遍”。

`distilling` 更像一个工程上的诚实做法。既然高层表示里已经有了足够多的结构信息，那就没必要一直保留原始长度。把序列压短，后面的层才有机会把复杂度控制住。

## 我对它的理解
Informer 给我的最大启发，不是某个公式，而是一个判断顺序：

- 先判断问题是不是“太长”。
- 再判断有没有办法把注意力集中起来。
- 最后才考虑模型还要不要继续加深。

它像一篇很典型的过渡型论文：没有假装解决所有问题，但把“长序列怎么活下来”这件事说得很清楚。

## 一句话总结
Informer 不是在证明注意力无所不能，而是在告诉我们：长序列建模首先要学会省算力。
