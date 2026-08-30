# Claude Dreaming（睡眠机制）调研

> 调研时间：2026-08-30。背景：调研「Claude 的睡眠机制」指的是什么、具体怎么做。
> Hermes 侧的记忆沉淀调研见 `docs/hermes记忆沉淀调研.md`。

**结论**：最贴近的说法是 Anthropic 于 **2026 年 5 月 6 日**为 Claude Managed Agents / Claude Code 发布的 **Dreaming**（Claude Code 侧称 **Auto Dream**，可 `/dream` 手动触发）——一个类比「睡眠期海马体记忆巩固」的异步记忆整理原语。学术前身是 Letta/UC Berkeley 的 sleep-time compute 论文（arXiv:2504.13171，2025-04）。

**一句话概括**：Dreaming 在会话之间的空闲时段离线运行，读取会话 transcript 和记忆文件系统，做模式提炼、去重合并、跨会话洞察三类"改写"，让记忆库本身保持连贯——在线会话只读取上次"做梦"留下的结果。

## 关键事实点

1. **机制名称与时间线**：Anthropic 2026-04-23 先给 Claude Managed Agents 上线持久记忆（容器内挂载 `/mnt/memory/` 文件系统，记忆以文件存储、可导出可编辑）；约两周后（2026-05-06）发布配套的 **Dreaming** 原语。命名直接来自生物学睡眠中记忆巩固（memory consolidation）的类比。
   - 出处：[Feather DB: Anthropic's 'Dreaming' Primitive Explained](https://www.getfeather.store/theory/anthropic-dreaming-primitive-explained)、[mindstudio: What Is Claude Dreaming](https://www.mindstudio.ai/blog/what-is-claude-dreaming-anthropic-managed-agents)

2. **具体做法（离线时把什么整理成什么）**：Dreaming 是会话间隙运行的定时离线 pass，读取会话 transcript + `/mnt/memory/` 当前内容，做三类工作：① **模式提炼**——从原始 transcript 历史中抽出反复出现的结构，变成可复用记忆条目；② **去重合并**——合并措辞不同但语义重复的记忆文件；③ **跨会话洞察**——发现单个会话上下文窗口内看不见的联系。本质是"对记忆库的批处理 ETL"，不是检索机制。
   - 出处：Feather DB 文 "What Dreaming actually does" 节

3. **与在线学习的分工**：Dreaming **不在**实时请求路径上运行；在线会话只读取上一次 Dreaming pass 留下的记忆状态，不自己触发整理。代价是存在"巩固延迟窗口"（consolidation-lag window）——新信息进入记忆到下一次离线整理之间，重复和矛盾会暂时共存。存储（放哪）、检索（取哪条）、巩固（存的还是否正确/冗余/值得保留）被明确区分为三个不同问题，Dreaming 解决的是第三个。
   - 出处：Feather DB 文 "Consolidation is a different problem" 节

4. **效果佐证**：Anthropic 援引早期采用者（Netflix、Rakuten、Wisedocs、Ando 等）报告文档校验类工作流中首次错误率降低 97%、速度提升 30%；法律 AI 公司 Harvey 接入后 agent 完成任务量据报道提升约 6 倍。注意这些数字限定于特定文档校验工作流，非通用基准。
   - 出处：Feather DB 文、[Sean Kim 博客（Harvey 案例）](https://blog.imseankim.com/claude-dreaming-anthropic-managed-agents-memory-consolidation-harvey-6x-may-2026/)

5. **学术前身：Letta sleep-time compute（arXiv:2504.13171）**：Letta（MemGPT 团队，UC Berkeley）2025-04 提出 "sleep-time compute"——模型在空闲时离线"思考"上下文、预判可能的查询并预计算/重组记忆，把测试时算力需求降低约 5×（同精度），加大睡眠时算力还能再提精度（GSM-Symbolic +13%、AIME +18%），多查询摊销可再降每查询成本 2.5×。这给出了"睡眠时离线整理 vs 在线推理"分工的学术形式化。
   - 出处：https://arxiv.org/abs/2504.13171

## 与 Hermes 的呼应（叙事线索）

Hermes 的「后台异步复盘」（每轮后 fork review agent）和 Claude 的 Dreaming（会话间离线 pass）是同一思想的两种粒度——都是把记忆整理移出在线请求路径；Hermes 侧重"即时、逐轮、低成本复盘"，Dreaming 侧重"定时、批量、深度重组"。Letta 论文为这条线提供学术锚点。
