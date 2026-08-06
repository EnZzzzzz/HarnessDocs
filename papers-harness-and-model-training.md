# Harness × 模型训练 论文调研报告

> 调研日期：2026-08-05
> 范围：2024–2026 为主（含 2023 奠基工作）；harness/脚手架设计 与 模型训练方法 两者兼顾。
> 方法：深度研究工作流（108 个并行代理 + 3 票对抗式交叉验证，25 条核心 claim 全部通过）；评测基准部分为补充定向检索。
> 用途：可直接用于 harness 项目（EZAgent / HiAgent）的 related work、阅读清单与前沿方向规划。

---

## 核心结论

领域呈现**两条主线并行并开始合流**：

- **主线一 · 数据工程驱动训练**：Toolformer → APIGen/xLAM/ToolACE。结论是「高质量合成数据 + 后训练」足以让小规模模型（7B/8B）达到前沿函数调用能力，甚至追平当时的 GPT-4。
- **主线二 · 编排层即 harness**：ReAct → AutoGen/MetaGPT → 2025 框架综述。harness 的核心是把「工具使用 + 推理规划 + 会话/流程编排」显式地做在**运行时**而非训练里。
- **最新合流趋势**：SWiRL、agentic RL 研究开始把「合成数据 + RL + 真实工具轨迹」组合进训练管线，harness 与训练之间的边界正在被重新定义。

一句话判断：**函数调用能力正从「纯训练/纯提示」转向「合成数据 + 后训练 + 检索/脚手架组件」的组合路线**，harness 设计则正从经验积累走向协议标准化。

---

## 一、工具使用 / 函数调用能力训练

| 论文 | 出处 | 一句话摘要 | 与 harness+训练的相关性 |
|---|---|---|---|
| **Toolformer** | Schick et al. (Meta AI), arXiv:2302.04761, NeurIPS 2023 oral | 模型自监督学习决定「调哪个 API / 何时调 / 传什么参 / 如何融合返回」 | **奠基**：确立「用训练而非手写 prompt 教模型用工具」范式，是后续数据合成路线的源头 |
| **Gorilla** | Patil et al. (UC Berkeley + MSR), arXiv:2305.15334, NeurIPS 2024 | 微调 LLaMA 写 API 调用超过 GPT-4；Retriever-Aware Training 让模型适配测试时 API 变化 | **奠基**：证明「检索/脚手架组件」与训练权重**互补**——正是 harness vs 纯训练这一核心问题 |
| **APIGen** | Salesforce, arXiv:2406.18518, NeurIPS 2024 D&B | 3,673 个可执行 API + 三级验证（格式→执行→语义）自动化合成数据，7B 模型 BFCL 达 SOTA | **近两年关键**：合成数据后训练主流路线的代表；「无需人工标注」为简化说法，种子 QA 仍有人工 curation |
| **xLAM** | Salesforce, arXiv:2409.03215, NAACL 2025 | 1B–8x22B 五个「行动模型」，unify/augment/synthesize 流水线，报告 BFCL 第 1 | **近两年关键**：把 agent 数据统一 + 多样化，扩展合成路线的规模 |
| **ToolACE** | Huawei Noah's Ark Lab + USTC, arXiv:2409.00920, ICLR 2025 | 自我演化合成流水线（TSS：speciation/adaptation/evolution）造 26,507 个 API 数据池，8B 模型 BFCL-v3 总体 59.22 媲美 GPT-4 系列 | **近两年关键**：证明无需人工标注的工具数据即可驱动前沿能力；**但多轮准确率仅 9.25%、通用推理落后 GPT-4**，暴露当前路线短板 |

---

## 二、Harness / 脚手架 / 编排层设计

| 论文 | 出处 | 一句话摘要 | 与 harness+训练的相关性 |
|---|---|---|---|
| **ReAct** | Yao et al. (Princeton/Google), arXiv:2210.03629, ICLR 2023 | 推理轨迹与行动交错，无额外训练，仅靠 in-context；ALFWorld 超 imitation/RL 34 个百分点 | **奠基**：agent 脚手架核心范式——推理诱导行动、行动与外部交互 |
| **AutoGen** | Microsoft, arXiv:2308.08155 | 多 agent 相互对话完成任务的统一编排层，可组合 LLM/人类/工具 | **近两年关键**：harness 显式把工具使用与会话编排耦合（而非训练）。注：2025 已转维护模式 |
| **MetaGPT** | arXiv:2308.00352, ICLR 2024 oral | 把标准操作流程（SOP）编码进 prompt，流水线式给 agent 分配专业角色、分解复杂任务 | **近两年关键**：编排层设计的另一具体形态 |
| **Agentic AI 框架综述** | Derouiche/Brahmi/Mazeni, arXiv:2508.10146, 2025 | 系统比较 CrewAI / LangGraph / AutoGen / Semantic Kernel / Agno / Google ADK / MetaGPT，并对比 CNP/A2A/ANP/Agora 通信协议 | **最新趋势**：2025 年 harness/编排层的权威现状图景 + 协议标准化动向 |

---

## 三、模型后训练与工具 RL（最新合流）

| 论文 | 出处 | 一句话摘要 | 与 harness+训练的相关性 |
|---|---|---|---|
| **SWiRL** (Step-Wise RL) | Stanford + Google DeepMind, arXiv:2504.04736, COLM 2025 | 两阶段：合成生成多步工具使用轨迹 → 拆成子轨迹 → 多步 RL；GSM8K +21.5%、HotPotQA +12.3% 等 | **近两年关键**：合成数据 + 多步 RL 做工具使用后训练的标杆方法 |
| **Agentic RL 数据与探索分析** | NUS/UIUC/Princeton, arXiv:2510.11701, 2025-10 | 真实端到端工具轨迹做 SFT 初始化显著优于拼接式合成轨迹（平均 @32 提升超 20%）；clip higher / overlong reward shaping / 保持策略熵 对训练效率至关重要 | **最新趋势**：为「harness 与训练如何配合」提供训练侧实证——**真实轨迹 > 拼接轨迹** |

---

## 四、评测基准（补充检索，未纳入对抗核验）

| 基准 | 出处 | 一句话摘要 |
|---|---|---|
| **ToolBench / ToolLLM** | arXiv:2307.16789 | 16,464 个真实 REST API + DFSDT 决策树推理 + ToolEval 自动评估，首个规模化多工具场景 |
| **τ-bench** / **τ²-bench** | arXiv:2406.12045 / arXiv:2506.07982 | 模拟客服会话，**按数据库终态而非对话评判**；τ² 引入双控 Dec-POMDP；pass^k 指标已成业界标准 |
| **BFCL** | ICML 2025 poster, arXiv:2503.14432 相关 | 函数调用事实标准（单轮/多轮/并行/agentic），AST 评估无需执行；工具选择与长程推理仍是开放挑战 |
| **GAIA** | arXiv:2311.12983, ICLR 2024 | 466 个人工标注真实问题，需多步推理+多模态+网页+工具；人类 92% vs GPT-4+plugins 15% |
| **SWE-bench** | 原始论文 arXiv:2310.06770（未独立核验），verified 子集 | 真实 GitHub issue 修复；顶级系统仍 <30%，且近期有研究质疑数据污染（arXiv:2512.10218） |

---

## 五点提醒

1. **排行榜名次是时间快照**：「BFCL SOTA / 第 1 名 / 超越 GPT-4」都是 2024 年的历史结论，随新模型发布已波动，不代表当前地位。
2. **SWiRL 引用坑**：网上常误传为 arXiv:2504.17746（那是篇无关天体物理论文），正确编号是 **2504.04736**。
3. **术语界定**：ReAct/MetaGPT/AutoGen 原文未必用 "harness/scaffold" 这些词，这个分类框架来自研究问题本身。
4. **「无需人工标注」要打折**：APIGen 的种子 QA 与 API 库整理、ToolACE 的 API 池构造仍含人工 curation。
5. **已知短板未解决**：ToolACE 多轮工具调用仅 9.25% 准确率 → 「训练 + harness」组合在多轮工具链场景上的短板是公认缺口。

---

## 待解决的关键问题

1. **「多少训练 vs 多少脚手架」的边界没有统一量化框架**。Gorilla 的检索增强和 agentic RL 的「真实轨迹 > 拼接轨迹」都暗示外部脚手架能补偿训练不足，但无人给出普适配比。
2. **合成数据验证的成本/可扩展性**：APIGen 依赖真实可执行 API，ToolACE 依赖自我演化 API 池——对私有领域/全新 API 是否可迁移，验证成本是否成规模化瓶颈，无答案。
3. **长任务与多智能体评估缺口**：BFCL 等主要覆盖单轮/单工具，对 SWE-bench 类长程任务和多智能体编排缺乏统一评估；通信协议（CNP/A2A/ANP/Agora）尚未成熟。
4. **多轮工具调用可靠性**：跨工具依赖、chain-of-tools 场景仍无系统性方案。

---

## 出处速查（arXiv 链接）

- Toolformer: https://arxiv.org/abs/2302.04761
- Gorilla: https://arxiv.org/abs/2305.15334
- APIGen: https://arxiv.org/abs/2406.18518
- xLAM: https://arxiv.org/abs/2409.03215
- ToolACE: https://arxiv.org/abs/2409.00920
- ReAct: https://arxiv.org/abs/2210.03629
- AutoGen: https://arxiv.org/abs/2308.08155
- MetaGPT: https://arxiv.org/abs/2308.00352
- Agentic AI 框架综述: https://arxiv.org/abs/2508.10146
- SWiRL: https://arxiv.org/abs/2504.04736
- Agentic RL 分析: https://arxiv.org/abs/2510.11701
- ToolBench: https://arxiv.org/abs/2307.16789
- τ-bench: https://arxiv.org/abs/2406.12045
- τ²-bench: https://arxiv.org/abs/2506.07982
- GAIA: https://arxiv.org/abs/2311.12983
- SWE-bench: https://arxiv.org/abs/2310.06770
