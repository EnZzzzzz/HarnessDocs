# Harness × 模型训练 · 阅读清单（2026-08-06 检索）

> 检索日期：2026-08-06
> 定位：作为 `papers-harness-and-model-training.md`（2026-08-05 深度调研）的**补充清单**，重点补充它缺失的
> 「harness 原生」方向论文（Polar / OpenForge RL / MemoHarness / SIA / HASE 等）以及 trajectory-SFT 反调研究。
> 用途：harness 项目（EZAgent / HiAgent）的 related work 与前沿方向参考。

---

## 一句话趋势判断

**训练正在从「先训好模型、再套 harness」转向「在 harness 里训练模型、甚至 harness 与模型一起进化」。**
同一个模型在不同 harness 下性能可差两位数，agent 能力来自 model–harness 配对，而非模型单方面能力。

---

## 一、工具调用训练与合成数据（ToolACE 所在线）

### ToolACE: Winning the Points of LLM Function Calling
- arXiv:2409.00920 · ICLR 2025 · [HF 论文页](https://huggingface.co/papers/2409.00920)
- 三个核心模块：
  1. **TSS（Tool Self-Evolution Synthesis）**：从预训练语料「进化」出 **26,507 个 API / 390 个领域**（speciation–adaptation–evolution），支持嵌套参数、并行调用、依赖调用
  2. **MAI（Multi-Agent Interactive Dialogue Generation）**：user/assistant/tool 多 Agent 角色扮演生成对话；被训练模型自身当**复杂度评估器**，动态调节数据难度（略高于模型当前能力）
  3. **DLV（Dual-Layer Validation）**：规则 + 模型双重校验保证数据可执行、一致
- 结果：**8B 参数**在 **BFCL-v1/v2** 追平当时 GPT-4 系列；显著优于 Gorilla / ToolAlpaca / ToolLLM / xLAM
- 开源：数据与模型在 [Team-ACE HuggingFace](https://huggingface.co/Team-ACE)
- 短板：通用推理仍落后 GPT-4；多轮工具调用准确率 9.25% 的数据实出自**后续论文 ToolACE-MT**（ICLR 2026，训练后提至 40.25%），并非本文报告

### ToolLLM: Facilitating LLMs to Master 16000+ Real-world APIs
- arXiv:2307.16789 · ICLR 2024 · [ar5iv](https://ar5iv.labs.arxiv.org/html/2307.16789)
- ToolBench 数据集：**16,464 个真实 REST API**、126,486 条指令-解决方案对、469,585 次真实 API 调用
- **DFSDT**（深度优先搜索决策树）推理策略 + BERT 神经 API 检索器
- 训出 ToolLLaMA-7B，零样本泛化到未见 API，性能接近 ChatGPT

---

## 二、Agent 轨迹训练（交互轨迹 → 训练数据）

### AgentTuning: Enabling Generalized Agent Abilities for LLMs
- arXiv:2310.12823 · [Semantic Scholar](https://www.semanticscholar.org/paper/AgentTuning%3A-Enabling-Generalized-Agent-Abilities-Zeng-Liu/46fe9ce789408b8a50fb4259e6bf0cc5855f4ed5)
- AgentInstruct 高质量交互轨迹数据集 + 通用指令混合训练 → AgentLM 系列；AgentLM-70B 在未见任务上接近 GPT-3.5

### AgentGym: Evolving Large Language Model-based Agents across Diverse Environments
- arXiv:2406.04151（⚠️ 注意：网上流传的 2408.07172 是错的，那其实是篇宇宙线物理论文）· [arXiv 摘要页](https://arxiv.org/abs/2406.04151) · [ar5iv](https://ar5iv.labs.arxiv.org/html/2406.04151) · [项目站](https://agentgym.github.io/)
- 复旦 NLP Lab：AgentGym 交互平台（14 环境 / 89 任务类型，统一 HTTP 服务接口）；AgentEval 基准（1,160 条）；AgentTraj（6,130 条高质量轨迹）+ AgentTraj-L（14,485 条）；**AgentEvol** 自进化算法（基于 AgentTraj 行为克隆训练基座 → 探索/学习两步交替，RL-as-Inference 视角，始终优化基座模型防止过拟合）

### What Do Agents Learn from Trajectory-SFT: Semantics or Interfaces?
- arXiv:2602.01611 · [ar5iv](https://ar5iv.labs.arxiv.org/html/2602.01611)
- ⚠️ **重要反调**：用 PIPE 协议最小改写环境接口、保持语义不变，发现轨迹 SFT 训练的 agent 在接口一变就大幅退化 → 学到的是「接口捷径」而非工具语义。
- **对做 harness 的人尤其重要**：benchmark 分数不能区分「真学会工具语义」和「背下接口模式」。

---

## 三、Harness 本身（agent 运行框架）— 最贴 harness 项目的一条线

### From Question Answering to Task Completion: A Survey on Agent System and Harness Design
- arXiv:2606.20683 · [HF 论文页](https://huggingface.co/papers/2606.20683)
- **首选综述**。统一「model–harness」视角：agent = 基础模型 + 执行 harness，拆成 6 个运行时职责
  （observation / context / control / action / state / verification–governance）。
- 四个范式演进：prompt engineering → workflows/context engineering → harness engineering → **agent-native training 与协同进化**。
- 核心论据：SWE-bench / Terminal-Bench / WebArena 证据表明**同一模型跨 harness 性能可差两位数**。

### Polar: Agentic RL on Any Harness at Scale
- arXiv:2605.24220 · [HF 论文页](https://huggingface.co/papers/2605.24220)
- 把 harness 当黑盒：代理 LLM API 调用 → 记录 token 级交互 → 重建 token-faithful 轨迹做 RL。
- 简单 GRPO 即提升 Qwen3.5-4B 在 **Codex / Claude Code / Qwen Code / Pi** 四种 harness 上的 SWE-Bench Verified。

### OpenForge RL: Train Harness-native Agents in Any Environment
- arXiv:2607.21557 · [ar5iv](https://arxiv-org.ezproxy.obspm.fr/html/2607.21557v1)
- 开源框架：轻量代理代理 harness 的模型调用并录制为标准训练样本（对接 veRL）+ Kubernetes 容器化 rollout。
- 在真实 harness（Claude Code / Codex / OpenClaw）与多模态 GUI 上验证；关键发现：**不同 harness 学习难度差异很大**，
  RL 能改善自我验证与工具覆盖，但错误恢复依然弱。

### MemoHarness: Agent Harnesses That Learn from Experience
- arXiv:2607.14159 · [ar5iv](https://arxiv-org.ezproxy.obspm.fr/html/2607.14159v1)
- harness 拆成 6 个可编辑控制面（context / tool / generation / orchestration / memory / output）。
- 双层经验库（逐用例条目 + 蒸馏全局模式），Terminal-Bench 上 0.722 → 0.806，跨基础模型可迁移。

### SIA: Self Improving AI with Harness & Weight Updates
- arXiv:2605.27276 · [alphaXiv 综述](https://www.alphaxiv.org/overview/2605.27276)
- 三 Agent 循环：Meta-Agent 建脚手架 → Task Agent 干活（gpt-oss-120b + LoRA）→ Feedback-Agent 决定改 harness 还是触发权重更新；
  自适应选 RL 算法（PPO/GRPO/EAW）。
- **同时改 harness + 权重（W+H）优于只改脚手架**：LawBench +56.6%、GPU kernel 运行时间 -91.9%。

### HASE: Harness-Aware Self-Evolving
- arXiv:2607.03935 · [alphaXiv](https://www.alphaxiv.org/abs/2607.03935)
- 单个模型协同进化策略、任务解法与 harness 组件；Qwen3-8B 打平「GPT-OSS-120B + Claude Code 作 harness proposer」基线。

### Recursive Harness Self-Improvement (RHI)
- arXiv:2607.15524 · [库内记录](https://libcat.scu.edu/EdsRecord/edsarx,edsarx.2607.15524?sid=19104393)
- 把 harness 表示为 agent 循环的 prompt 级规格，用自身修订历史的成对反馈迭代精炼。
- 几次迭代让低推理算力 agent 超过最高算力设置，推理成本降最多 60%。

### LLM-as-Code Agentic Programming for Agent Harness
- arXiv:2606.15874 · [库内记录](https://libcat.scu.edu/EdsRecord/edsarx,edsarx.2606.15874?sid=17278524)
- 论点：token 爆炸 / 控制流幻觉 / 不可靠完成，是「把确定性循环/分支/排序交给概率模型」的架构性后果。
- 方案：程序主导全部控制流，LLM 只在推理/生成时作为可适应组件被调用；改善计算机使用 agent 的长视觉操作稳定性。

---

## 四、Agent 能力强化：RL 后训练

### SWE-RL: Advancing LLM Reasoning via RL on Open Software Evolution
- arXiv:2502.18449 · [ar5iv](https://ar5iv.labs.arxiv.org/html/2502.18449v1)（Meta FAIR / UIUC / CMU）
- 首个用规则化奖励 + 开源软件数据的 RL：GRPO + patch 相似度（difflib）奖励。
- Llama-3.3-70B 在 SWE-bench Verified 达 **41.0%**；RL 训练软件问题还产生了**涌现的通用推理能力**（自反思、多步推理）。

### Self-Play SWE-RL (SSR)
- arXiv:2512.18552 · [HF 论文页](https://huggingface.co/papers/2512.18552) · ICML 2026
- 完全去人工标注：同一策略分饰「bug 注入者」与「bug 求解者」自我对弈，只需沙箱 Docker 镜像。
- 一致性命中测试保证注入 bug 有效；失败的修复尝试回收为更高阶 bug（自适应课程）。
- SWE-bench Verified +10.4 / SWE-Bench Pro +7.8，持续优于人工数据基线。

### s1: Simple Test-Time Scaling
- arXiv:2501.19393 · [ar5iv](https://ar5iv.labs.arxiv.org/html/2501.19393v2)
- 仅 1,000 条蒸馏样本（Gemini Thinking）SFT 即超 o1-preview 27%；**budget forcing** 测试时干预（截断 / 追加 "Wait"）。
- 对照与后续：DeepSeek-R1 用大规模 RL；[arXiv:2507.14419](https://arxiv.org/pdf/2507.14419) 指出 s1 的缩放主要来自长度上限；
  [arXiv:2502.12118](https://arxiv.org/pdf/2502.12118) 证明带验证器的 RL/搜索方法更优。

### gpt-oss-120b 技术报告（Model Card）
- arXiv:2508.10925（⚠️ 注意：网上流传的 2504.11405 是错的，那其实是篇天体物理论文）
- OpenAI 开源权重模型卡：MoE 架构 + 大规模蒸馏与强化学习（与 o3 类似的 CoT RL）+ Harmony 格式 + 工具（浏览/Python/自定义函数）训练 + deliberative alignment 安全对齐。
- 注意：报告为模型卡层面，未披露 GRPO/cooldown/SFT 等细节配方。
- 上面多条线（SIA / HASE）都以其为基线，建议配套阅读。

---

## 建议阅读顺序

1. **harness survey**（arXiv:2606.20683）—— 建立 model–harness 整体框架
2. **ToolACE + ToolLLM** —— 工具调用训练数据的经典做法
3. **Polar + OpenForge RL** —— 如何在真实 harness 上做训练
4. **SWE-RL / Self-Play SWE-RL** —— agent 训练里 RL 怎么落地

---

## 值得警惕的点

- 部分 2026 年 arXiv 编号（26xx.xxxxx）非常新，引用前建议在 arXiv 上确认最终版本号与发表状态。
- 排行榜名次是时间快照：ToolACE「媲美 GPT-4」是 2024 年的结论，不代表当前地位。
- Trajectory-SFT 的「接口捷径」问题（arXiv:2602.01611）提示：评测协议与训练数据接口的耦合度，直接影响结论可信度。
