# Harness × 模型训练 论文翻译集

> 翻译日期：2026-08-06
> 原文清单：见 [papers-harness-model-training-reading-list-2026-08-06.md](../papers-harness-model-training-reading-list-2026-08-06.md)
> 说明：每篇由独立子 agent 抓取原文（arXiv 摘要页 + ar5iv 正文）后翻译，统一模板；
> 专业术语保留英文并首次出现时附中文注释。

## 翻译文件索引

### 一、数据合成与工具调用

| 文件 | 论文 | arXiv |
|---|---|---|
| [2409.00920-toolace.md](数据合成与工具调用/2409.00920-toolace.md) | ToolACE: Winning the Points of LLM Function Calling | [2409.00920](https://arxiv.org/abs/2409.00920) |
| [2307.16789-toolllm.md](数据合成与工具调用/2307.16789-toolllm.md) | ToolLLM: Facilitating LLMs to Master 16000+ Real-world APIs | [2307.16789](https://arxiv.org/abs/2307.16789) |

### 二、轨迹数据收集与训练

| 文件 | 论文 | arXiv |
|---|---|---|
| [2310.12823-agenttuning.md](轨迹数据收集与训练/2310.12823-agenttuning.md) | AgentTuning: Enabling Generalized Agent Abilities for LLMs | [2310.12823](https://arxiv.org/abs/2310.12823) |
| [2406.04151-agentgym.md](轨迹数据收集与训练/2406.04151-agentgym.md) | AgentGym: Evolving Large Language Model-based Agents across Diverse Environments | [2406.04151](https://arxiv.org/abs/2406.04151) |
| [2602.01611-trajectory-sft.md](轨迹数据收集与训练/2602.01611-trajectory-sft.md) | What Do Agents Learn from Trajectory-SFT: Semantics or Interfaces? | [2602.01611](https://arxiv.org/abs/2602.01611) |

### 三、Harness 设计与自我进化（agent 运行框架）

| 文件 | 论文 | arXiv |
|---|---|---|
| [2606.20683-agent-harness-survey.md](harness设计与自我进化/2606.20683-agent-harness-survey.md) | From QA to Task Completion: A Survey on Agent System and Harness Design | [2606.20683](https://arxiv.org/abs/2606.20683) |
| [2605.24220-polar.md](harness设计与自我进化/2605.24220-polar.md) | Polar: Agentic RL on Any Harness at Scale | [2605.24220](https://arxiv.org/abs/2605.24220) |
| [2607.21557-openforge-rl.md](harness设计与自我进化/2607.21557-openforge-rl.md) | OpenForge RL: Train Harness-native Agents in Any Environment | [2607.21557](https://arxiv.org/abs/2607.21557) |
| [2607.14159-memoharness.md](harness设计与自我进化/2607.14159-memoharness.md) | MemoHarness: Agent Harnesses That Learn from Experience | [2607.14159](https://arxiv.org/abs/2607.14159) |
| [2605.27276-sia.md](harness设计与自我进化/2605.27276-sia.md) | SIA: Self Improving AI with Harness & Weight Updates | [2605.27276](https://arxiv.org/abs/2605.27276) |
| [2607.03935-hase.md](harness设计与自我进化/2607.03935-hase.md) | HASE: Harness-Aware Self-Evolving | [2607.03935](https://arxiv.org/abs/2607.03935) |
| [2607.15524-rhi.md](harness设计与自我进化/2607.15524-rhi.md) | Recursive Harness Self-Improvement | [2607.15524](https://arxiv.org/abs/2607.15524) |
| [2606.15874-llm-as-code-agentic-programming.md](harness设计与自我进化/2606.15874-llm-as-code-agentic-programming.md) | LLM-as-Code Agentic Programming for Agent Harness | [2606.15874](https://arxiv.org/abs/2606.15874) |

### 四、RL 后训练与能力强化

| 文件 | 论文 | arXiv |
|---|---|---|
| [2502.18449-swe-rl.md](RL后训练与能力强化/2502.18449-swe-rl.md) | SWE-RL: Advancing LLM Reasoning via RL on Open Software Evolution | [2502.18449](https://arxiv.org/abs/2502.18449) |
| [2512.18552-self-play-swe-rl.md](RL后训练与能力强化/2512.18552-self-play-swe-rl.md) | Toward Training Superintelligent Software Agents through Self-Play SWE-RL | [2512.18552](https://arxiv.org/abs/2512.18552) |
| [2501.19393-s1.md](RL后训练与能力强化/2501.19393-s1.md) | s1: Simple Test-Time Scaling | [2501.19393](https://arxiv.org/abs/2501.19393) |
| [2508.10925-gpt-oss.md](RL后训练与能力强化/2508.10925-gpt-oss.md) | gpt-oss-120b & gpt-oss-20b Model Card | [2508.10925](https://arxiv.org/abs/2508.10925) |

## 翻译过程中发现的编号更正（重要）

| 论文 | 误用编号 | 正确编号 | 说明 |
|---|---|---|---|
| AgentGym | 2408.07172 | **2406.04151** | 2408.07172 实为宇宙线物理论文 |
| gpt-oss Model Card | 2504.11405 | **2508.10925** | 2504.11405 实为天体物理论文 |

## 事实性核查备注

- **ToolACE**：对话生成模块在论文中名为 **MAI**（Multi-Agent Interactive Dialogue Generation）；评测基准为 BFCL-v1/v2（未涉 APIBank）；「9.25% 多轮准确率」实出自后续论文 ToolACE-MT（ICLR 2026），非本文数据。详见 [2409.00920-toolace.md](数据合成与工具调用/2409.00920-toolace.md) 头部译者注。
- **gpt-oss**：官方模型卡未披露 GRPO/cooldown/SFT 细节配方，文中以已注明来源的第三方综述补充。详见 [2508.10925-gpt-oss.md](RL后训练与能力强化/2508.10925-gpt-oss.md) 头部译者注。
