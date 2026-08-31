**RESEARCH BRIEF**

# 轨迹数据与思维链 SFT 数据增强调研

> 可行方法、公开产业实践、质量风险与落地建议

Harness Docs · 研究日期：2026-08-31 · 公开资料综述

## 结论先行

> **核心判断**　轨迹数据和思维链 SFT 都可以做数据增强。真正有效的不是“同义改写 × 10”，而是多样化生成、真实执行或过程验证、拒绝采样、去重配平与迭代训练。验证器质量通常比生成量更重要。

本文把“轨迹数据”理解为 Agent rollout：任务、状态、观察、计划、工具调用、环境反馈和最终结果构成的序列。若讨论的是自动驾驶或机器人坐标轨迹，具体扰动方式不同，但“保持物理约束并重新验证”的原则相同。

## 两类数据，两个关键差异

| 对象 | 可增广什么 | 不可省略的验证 |
| --- | --- | --- |
| Agent 轨迹 | 任务变体、多次 rollout、工具顺序、故障恢复、前缀分叉 | 在真实环境执行；校验动作合法性、状态一致性与最终结果 |
| CoT SFT | 多解法、多长度、工具辅助、批评与修复链、题目联合生成 | 答案验证之外，还要检查中间步骤，防止猜中和事后合理化 |

## 一、Agent 轨迹数据怎么增广

### 同一任务多次 rollout（Multi-Rollout）

提高采样多样性，改变计划粒度、工具调用顺序与探索策略；在环境中实际执行后，保留成功轨迹，或按成功率、成本、步数排序。相比对旧轨迹做文字变换，这种方式更能保证状态和动作相符。

### 任务级变体（Task Variation）

替换实体、数值、文件、数据库 schema、语言和约束，或构造不同难度。任务变化后必须重新执行整条轨迹，不能改了 prompt 却沿用旧工具返回。

### 从结果反推指令与任务（Backtranslation & Hindsight Relabeling）

这类方法从已有的高质量输出或轨迹出发，反向生成与结果匹配的新指令或任务标签，进而复用和扩展训练数据。其底层思路已有较充分的研究与实践基础，但将它用于 LLM Agent 的完整轨迹增广仍在快速发展，尚未形成完全固定的工业流水线。

- **Instruction Backtranslation**：从优质输出反推可能的指令，已成为合成指令数据的经典方法。例如给定一个高质量前端页面，生成多个能够合理导向该页面的用户 Query。
- **Self-Instruct**：自动生成并筛选不同的 instruction、input 和 output 数据，以较少的人工种子扩展指令覆盖。
- **Hindsight Relabeling**：根据轨迹真正实现的结果，反过来重新标注其任务目标；该思路在强化学习中已经较成熟。
- **Agent 轨迹事后重标注**：将上述思想用于 LLM Agent，分析已有轨迹实际完成了哪些自然语言目标，再把轨迹与这些目标重新配对。目前这是一个快速发展的方向，但相较于通用指令合成仍偏前沿。

实际使用时应区分“表达泛化”和“能力泛化”：同一需求的不同措辞通常可以共享轨迹；如果新 Query 改变了功能、约束或验收标准，则必须重新执行或至少重新验证，不能只替换轨迹开头的 Query。推荐流水线为：输出或轨迹 → 提取已验证能力 → 生成候选 Query → 语义蕴含与轨迹相关性检查 → 执行或自动验收 → 去重配平。

### 故障注入与恢复（Failure & Recovery）

人为加入错误工具参数、超时、空结果、页面结构变化或代码执行失败，让模型生成诊断、回退与修复路径。这类数据训练的是现实环境中的鲁棒性。

### 前缀分叉（Prefix Branching）

从一段共享历史的中间状态重新采样后续动作，得到失败、绕路成功和低成本成功分支。成功路径可用于 SFT，同题优劣路径可用于偏好优化，步骤级信号可用于过程奖励。

### 轨迹压缩（Trajectory Compression）

把冗长成功轨迹压缩为更短路径，删除无效搜索和重复观察；但应保留一部分真实探索轨迹，否则模型只会模仿漂亮答案，不会探索和纠错。

## 二、思维链 SFT 怎么增广

### 多路径采样与拒绝采样（Sample & Reject）

为同一道题生成多条推理链，只保留答案正确、格式合格、中间过程通过检查且长度合适的数据。对于数学、代码和工具任务，优先使用可执行验证器。

### 教师蒸馏与自举（Distillation & Bootstrapping）

用更强模型生成问题、推理和答案；由程序或答案校验筛选，再继续训练学生模型。STaR 展示了“生成 rationale - 验证答案 - 再训练”的经典循环。

### 题目与推理联合生成（Joint Synthesis）

从技能点、目标难度和推理结构出发，同时生成新题、解法、答案和验证器，扩大任务覆盖。若只让教师自由出题，容易得到大量结构相似的简单样本。

### 错误链与纠错链（Corrective Reasoning）

保存局部错误、错误位置、批评和修复路径，可训练 critic、自我纠错、DPO 或过程奖励模型。注入错误应接近真实模型分布，避免机械改数字形成浅层捷径。

### 风格和长度配比（Reasoning Mixture）

同一推理可生成完整探索版、简洁严谨版和工具辅助版。合理配比能避免模型把“长”“固定开场”或某种话术误当成推理质量。

## 三、大厂公开出来的共同流水线

> **共同范式**　少量高质量种子 → 强模型或当前策略多次采样 → 规则、执行器、reward model、独立 judge 与人工抽检 → 去重配平 → SFT / 蒸馏 / 偏好优化 / RL → 新 checkpoint 再采样。

### DeepSeek（Rejection Sampling + RL）

DeepSeek-R1 公开说明：以冷启动推理数据开始，经过推理 RL，再从 checkpoint 为问题采样多条推理轨迹；用规则奖励、模型判断和质量过滤构造推理 SFT 数据，并混入非推理数据保持通用能力。

### Microsoft（Synthetic Data Curriculum）

Phi-4 把合成数据贯穿训练过程，强调推理任务的数据构造、质量、课程学习和数据配比；公开结论不是简单堆量，而是以高质量数据推动小模型能力。

### Google（STaR and Self-Bootstrapping）

STaR 用少量 rationale 示例引导模型生成推理，对正确答案进行筛选并继续训练，代表了推理数据自举的基础范式。Google 的其他公开工作也持续研究合成数据机制和推理结构。

### Anthropic（Constitutional AI）

Constitutional AI 让模型依据一组原则批评、修订和比较回答，再把 AI 反馈用于监督或偏好训练；公开的 Constitutional Classifiers 还会生成不同风格和语言的合成数据。

### OpenAI（Process Supervision & Deliberative Alignment）

公开数学推理研究比较了过程监督与结果监督；deliberative alignment 则合成模型根据规范推理的数据，经 policy-aware reward model 过滤后用于 SFT。公开安全研究同时警告：对 CoT 施加强监督可能削弱其监控价值。

## 四、主要风险

### 只验证最终答案（Outcome-Only）

答案可能是猜中，也可能由多个抵消错误得到。应依次验证任务、真实执行、动作、过程和结果。

### 同一个模型既生成又审核（Correlated Blind Spots）

生成者和 judge 会共享偏差。优先使用规则和执行器；模型审核尽量换模型、换提示、多 judge，并保留人工抽检。

### 合成数据模式坍缩（Mode Collapse）

常见症状是固定开场、固定长度、单一解法和明显“模型味”。应混入真实、人工、失败和多教师数据，并按任务与难度配平。

### 把可读解释等同于真实推理（Rationale Faithfulness）

SFT 中的 CoT 是监督序列，不保证忠实反映模型内部计算。面向用户的解释、训练用推理和安全监控信号不一定应完全相同。

## 五、推荐的第一版落地方案

1. 隔离 10%-20% 的真实任务，只用于最终评测，并另建分布外测试集。
2. 每个训练任务采样 4-16 条轨迹；所有工具行为在真实环境或可复现沙箱中执行。
3. 先用规则、测试、数据库状态和执行结果做硬验证，再用独立 judge 检查过程质量。
4. 同时保存成功、失败与修复轨迹：成功数据做 SFT，同题优劣对做 DPO，步骤标签做过程奖励。
5. 按任务、难度、长度、工具、结果和语义相似度去重配平，控制合成数据占比。
6. 做消融实验：原始数据、原始+合成、仅结果验证、全过程验证；只有真实隔离集和分布外测试都提高时才扩量。

## 来源与延伸阅读

- [DeepSeek-R1 官方仓库与技术报告](https://github.com/deepseek-ai/DeepSeek-R1)
- [DeepSeek-R1 Nature 论文](https://doi.org/10.1038/s41586-025-09422-z)
- [Microsoft Phi-4 Technical Report](https://www.microsoft.com/en-us/research/publication/phi-4-technical-report/)
- [Google Research: STaR](https://research.google/pubs/star-self-taught-reasoner-bootstrapping-reasoning-with-reasoning/)
- [Anthropic: Claude's Constitution / Constitutional AI](https://www.anthropic.com/research/claudes-constitution)
- [Anthropic: Constitutional Classifiers](https://www.anthropic.com/news/constitutional-classifiers)
- [OpenAI: Deliberative alignment](https://openai.com/index/deliberative-alignment/)
- [OpenAI: Improving mathematical reasoning with process supervision](https://openai.com/index/improving-mathematical-reasoning-with-process-supervision/)
- [OpenAI: Detecting misbehavior in frontier reasoning models](https://openai.com/index/chain-of-thought-monitoring/)
- [ICLR 2024: Self-Alignment with Instruction Backtranslation](https://proceedings.iclr.cc/paper_files/paper/2024/hash/0f8e3534eb8dee7478d4dc0e9d9a0b1a-Abstract-Conference.html)
- [ACL 2023: Self-Instruct](https://aclanthology.org/2023.acl-long.754/)
- [NeurIPS 2021: Hindsight Task Relabelling](https://papers.nips.cc/paper_files/paper/2021/hash/1454ca2270599546dfcd2a3700e4d2f1-Abstract.html)
