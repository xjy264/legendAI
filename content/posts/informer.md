---
slug: informer
title: Informer：先把长序列算得动
description: 读 Informer 的时候，我更在意的是它怎么让长序列跑得起来，而不是它是不是最后的最强模型。
tags: [Informer, efficient-attention, long-sequence, paper-notes]
category: 论文笔记
status: published
featured: true
publishedAt: 2025-07-09
---

长序列预测里，Informer 的价值很工程，也很诚实。它不假装注意力可以无限算，而是直接承认：序列太长，先想办法降成本。

它的两个关键词我一直记得很清楚。一个是 ProbSparse attention，意思是别把力气平均撒在所有 token 上，而是优先盯住那些更值得看的 query。另一个是 distilling，把序列一层层压短，让模型在更可控的长度上继续往前走。再往后是生成式解码，尽量一次把未来拉出来，而不是一步步拖着走。

这篇论文对我最大的启发不是“Informer 很强”，而是“长序列问题首先是算力和表达方式的问题”。如果输入一长就炸，模型再漂亮也没法用。Informer 让我意识到，做研究不能只盯着指标，还得看方案能不能真的跑通。

我现在回头看它，会把它当成一篇典型的过渡论文：它未必是最后答案，但它把“怎么让长序列先活下来”这件事说清楚了。
