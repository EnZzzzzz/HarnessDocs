# Hermes 记忆沉淀机制调研

> 调研时间：2026-08-30。用途：为网站「Agent 自进化」章节的 `#se-hermes` 页面提供事实依据。
> 主要来源：git 历史中已删除的 `web/components/outline/sections/06-hermes-loop.ts`（commit `f07290e^`）、Hermes 官方文档、Continual-Harness 论文。

**一句话概括**：Hermes（Nous Research 开源 agent 系统）用「Observe → Distill → Reuse → Refine」四步闭环，把每次会话的经验在后台异步蒸馏成两类有界资产（Skill + Memory），复用时渐进式注入，发现更优路径时回头 patch 旧条目——一个可持续累积而不撑爆上下文的经验沉淀系统。

## 关键事实点

1. **四步闭环的具体分工**：Observe 记录每轮交互与轨迹作为原料；Distill 在回复结束后后台复盘，提炼反复出现的纠正和可复用工作流；Reuse 把沉淀物注入后续会话上下文；Refine 发现更优路径时 patch 已有条目而非只增不改。
   - 出处：git 历史 `06-hermes-loop.ts` 卡片 01；原始出处标注 `design-harness.html §03`

2. **双资产制（已获官方文档核实）**：
   - **Skill = 程序性记忆**（"怎么做"）：agent 通过 `skill_manage` 工具自建/自改/自删（create / patch / edit / delete / write_file / remove_file，`patch` 因省 token 为首选），官方明确称其为 "procedural memory"；SKILL.md 有标准结构（When to Use / Procedure / Pitfalls / Verification）。
   - **Memory = 陈述性记忆**（"是什么"）：`MEMORY.md` 上限 2,200 字符（~800 tokens，8–15 条）+ `USER.md` 上限 1,375 字符（~500 tokens，5–10 条）。
   - 出处：[Hermes Skills 文档](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)、[Hermes Memory 文档](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)

3. **容量上限的执行机制（写满倒逼合并）**：Memory **不自动压缩**——写入超限时 `memory` 工具报错，并把 `current_entries` 清单返回，要求 agent 在同一轮内用 `replace` 合并重叠条目或 `remove` 过期条目后重试；官方建议占用超 80% 时主动合并。上限倒逼资产保持信息密度。会话开始时记忆以**冻结快照**注入系统提示（显示 `67% — 1,474/2,200 chars` 的用量头），会话内系统提示不变以保住 LLM 前缀缓存，修改落盘但下个会话才出现在提示里。
   - 出处：Hermes Memory 文档 "What Happens When Memory is Full" / "Frozen snapshot pattern" 节

4. **Distill 的具体机制 = 后台异步复盘（Async Review Agent）**：每轮回复结束后 fork 一个 self-improvement review fork，从记忆、技能、执行过程三维度复盘。默认复用主模型的 prompt 缓存做廉价回放；可配置 `auxiliary.background_review` 换便宜模型，此时 fork 自动改用压缩 digest（近期轮次原文 + 早期轮次摘要）。官方测试：换便宜模型后复盘成本降低约 **3–5×**，memory 捕获完全一致、skill 捕获近乎一致。用户侧只看到一行「💾 Memory updated」；`write_approval` 可把写入 stage 成待审批（`/memory pending`、`/skills pending`）。
   - 出处：Hermes Memory 文档 "Running the review on a cheaper model" 节；git 历史卡片 03

5. **渐进式披露（Reuse 的成本控制）**：三级加载——Level 0 常驻的只是全部技能的 name/description/category 索引（约 3k tokens）；Level 1 用 `skill_view(name)` 加载完整 SKILL.md；Level 2 按需加载 `references/` 单个文件。`/learn` 面对整本书时产出"精简主文件 + 每章一个蒸馏文件"的 knowledge-base skill——**查询成本与答案大小成正比，而非与来源大小成正比**。
   - 出处：Hermes Skills 文档 "Progressive Disclosure" / "Large sources become knowledge-base skills" 节

6. **量化佐证**：Continual-Harness 论文（arXiv:2605.09998）把同构闭环形式化——Refiner 每隔 F 步读取最近轨迹窗口，对 prompt、sub-agents、skills、memory 四类组件做 CRUD 编辑；在 Pokémon Red/Emerald 上从零起步的自改进循环收回了与手工专家 harness 之间的大部分差距；GPP Yellow Legacy 运行中对 skill/sub-agent 的 CRUD 修改贯穿 20 多万轮始终不收敛且集中在最常出问题的导航与战斗组件。论文 §5.1 把 Hermes 列为 assistant 任务的 agentic harness 参照（引用 [13]），并指出此类 harness 的经验优化发生在 episode 之间。
   - 出处：https://arxiv.org/abs/2605.09998；git 历史卡片 01

> 注：Hermes Agent 本身是 Nous Research 的开源工程实现（GitHub: NousResearch/hermes-agent，Apache-2.0），**没有自己的论文**；Continual-Harness（arXiv:2605.09998）是把这类闭环形式化并把 Hermes 列为参照的学术工作，MOSS（arXiv:2605.22794）等自进化论文也引用了它。

## 相关资源

- 网页章节：`web/components/harness/self-evolution-sections.tsx` 的 `#se-hermes`
- 配图：`web/public/outline/hermes-memory-files.png`（同目录另有 hermes-background-review.png / hermes-agent-managed-skills.png / hermes-progressive-disclosure.png 可备用）
- Claude 侧的「睡眠机制」调研见 `docs/claude-dreaming调研.md`
