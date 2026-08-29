import type { OutlineSectionData } from '../outline-data'

export const S01_FOUNDATION: OutlineSectionData = {
  id: 'foundation-vendors',
  kicker: '为什么 Harness 热度这么高 · 基模厂商',
  title: '基模厂商：环境成为核心资产',
  intro:
    '后训练时代，模型能力的差距越来越多地由训练环境而非底座本身决定。基模厂商的竞争，正在从「谁的底座强」转向「谁的环境多、真、可验证」。',
  cards: [
    {
      badge: '01',
      title: '训练环境决定 bench 表现',
      en: 'Environments Decide the Score',
      tagline: '同一个模型，换一套训练环境，bench 分数可以差出一个量级',
      detail:
        '多家基模厂商的实践表明，训练环境的质量与覆盖面对评测成绩有决定性作用：可执行、可验证、贴近真实任务的环境，能把同一底座的能力上限大幅抬高。环境搭建不再是工程杂活，而是后训练的核心变量。',
      images: [
        {
          src: '/outline/openswe-teaser.png',
          caption:
            'daVinci-Env 论文：OpenSWE-32B 用自家合成环境训练后达 62.4%，越级超过一批数倍于它的模型；右图对比各环境数据集的 Docker 镜像规模',
          source: 'https://arxiv.org/pdf/2603.13023',
        },
        {
          src: '/outline/openswe-framework.png',
          caption:
            'OpenSWE 环境合成流水线：从 GitHub PR 批量构建仓库环境，Master-Node 集群自动完成 Dockerfile 构建、评测脚本生成、环境验证与测试分析',
          source: 'https://arxiv.org/pdf/2603.13023',
        },
        {
          src: '/outline/openai-codex-devtools.png',
          caption:
            'OpenAI 的 harness engineering 实践：Codex 通过 Chrome DevTools MCP 自动验证自己的工作——快照对比、触发 UI、收集运行时事件、循环修复直到干净',
          source: 'https://openai.com/index/harness-engineering/',
        },
      ],
      points: [
        {
          text: 'OpenSWE 研究用同一模型在不同来源的环境上训练并统一评测：32B SWE-Agent 设定下，OpenSWE 环境比 SWE-Rebench 绝对提升 12.2 个百分点——环境选择直接改变 bench 结果',
          source: 'https://arxiv.org/pdf/2603.13023',
        },
        {
          text: '智谱 GLM-5.3 与 GLM-5.2 使用同一底座模型，全部提升来自后训练的环境扩展：Terminal Bench 3.0 从 4.6 升至 28.3，DeepSWE 从 46.2 升至 66.9',
          source: 'https://z.ai/blog/glm-5.3',
        },
        {
          text: 'OpenAI 的 harness engineering 实践从侧面印证：工程师的主要工作已变成「设计环境、明确意图、构建反馈回路」，环境的可读性与可验证性决定 agent 的实际产出',
          source: 'https://openai.com/index/harness-engineering/',
        },
      ],
    },
    {
      badge: '02',
      title: '通用底座 + 插件式接入环境',
      en: 'One Base, Many Environments',
      tagline: 'GLM-5.3：不换底座，只靠扩展训练环境换来能力大涨',
      detail:
        '2026-08-14 智谱发布 GLM-5.3，复用 GLM-5.2 底座，只做一件事：把后训练环境铺得更多、更真。训练阶段通过流水线批量合成可执行、可验证的长周期任务环境，像插件一样接入训练，覆盖编程、ML 基础设施、网络安全等真实专业工作流——环境本身成为核心资产。',
      images: [
        {
          src: '/outline/glm53-benchmarks.png',
          caption:
            '六项长周期基准对比：同一底座下 GLM-5.3 全面抬升，Terminal Bench 3.0 从 4.6 到 28.3，DeepSWE 从 46.2 到 66.9',
          source: 'https://z.ai/blog/glm-5.3',
        },
        {
          src: '/outline/glm53-codebench.png',
          caption:
            'Z.ai Code Bench：每个 effort 档位上 GLM-5.3 都以更少输出 token 达到更高完成率（Max 档 34.5% @ 75K tokens，GLM-5.2 为 23.4% @ 96K）',
          source: 'https://z.ai/blog/glm-5.3',
        },
        {
          src: '/outline/glm53-cyber.png',
          caption:
            '安全能力随环境扩展涌现：加入漏洞挖掘环境后，CyberGym 达 SOTA，ExploitBench 较 GLM-5.2 翻倍以上',
          source: 'https://z.ai/blog/glm-5.3',
        },
      ],
      points: [
        {
          text: '官方明确「Scaling post-training is all we did」：沿用 GLM-5.2 的 IndexShare、SAO、slime 技术栈，只增加环境数量、任务多样性与训练算力',
          source: 'https://z.ai/blog/glm-5.3',
        },
        {
          text: '环境向「真实专家工作单元」靠拢：如 ML 基础设施任务中，模型拿到与工程师相同的算力集群、存储、内部文档与代码库，需端到端交付可测量的加速效果',
          source: 'https://z.ai/blog/glm-5.3',
        },
        {
          text: '环境可规模化生产：研究 agent 从真实工作中采集任务模式并合成长周期环境，judge agent 验证可解性；验证器不看参考解生成，须通过 oracle、no-op、未解态三重检查才产出可靠奖励信号',
          source: 'https://z.ai/blog/glm-5.3',
        },
        {
          text: '安全能力随环境扩展「涌现」：在训练混合中加入漏洞挖掘环境后，GLM-5.3 在 CyberGym 漏洞发现达 SOTA，利用链评测上较 GLM-5.2 翻倍以上',
          source: 'https://z.ai/blog/glm-5.3',
        },
      ],
    },
    {
      badge: '03',
      title: '闭源 Harness 常有防蒸馏手段',
      en: 'Closed Harness, Hidden Recipe',
      tagline: '基模厂商需要可控的全栈训练环境',
      detail:
        '头部闭源 Harness 把系统提示、工具编排、推理轨迹当作核心资产，普遍设置防蒸馏手段：隐藏原始思维链、条款禁止用输出训练竞品模型、随时切断可疑访问。但隐藏并不等于无法提取：2026 年的实证研究已经从 Claude 等闭源 API 中恢复出原始推理轨迹。基模厂商若依赖外部 Harness 产出的轨迹做后训练，既拿不到稳定、合法的数据，又面临隐私与合规风险——因此必须自建从环境、工具到验证器全栈可控的训练环境。',
      images: [
        {
          src: '/outline/openai-tos-no-compete.png',
          caption:
            'OpenAI 服务条款「What you cannot do」原文：禁止以编程方式批量提取输出、禁止绕过保护措施、禁止用输出开发竞品模型',
          source: 'https://openai.com/policies/terms-of-use/',
        },
        {
          src: '/outline/wired-anthropic-revoke.jpg',
          caption:
            'Wired 报道配图：2025 年 8 月 Anthropic 以违反服务条款为由，撤销 OpenAI 内部对 Claude 模型的 API 访问权限',
          source: 'https://www.wired.com/story/anthropic-revokes-openais-access-to-claude/',
        },
      ],
      points: [
        {
          text: '2026 年 8 月，ELLIS 图宾根等团队证明加密的 reasoning block 可在同一厂商的不同会话、用户与模型间重放：他们将 Claude Opus 4.8 的加密轨迹交给防护较弱的 Haiku 4.5，恢复出明文推理，直接绕过强模型的防蒸馏保护',
          source: 'https://stolen-thoughts.com/',
        },
        {
          text: 'OpenAI 从 o1 起刻意隐藏原始思维链，只向用户展示摘要：既防止模型吐出未过滤内容，也让推理轨迹无法被直接蒸馏',
          source: 'https://openai.com/index/learning-to-reason-with-llms/',
        },
        {
          text: 'OpenAI、Anthropic 的服务条款均明确禁止用模型输出开发与之竞争的模型，蒸馏痕迹可作为违约证据',
          source: 'https://openai.com/policies/terms-of-use/',
        },
        {
          text: '2025 年 8 月 Anthropic 以违反服务条款为由撤销 OpenAI 对 Claude 的 API 访问——闭源 Harness 厂商会主动切断竞争对手的数据通道',
          source: 'https://www.wired.com/story/anthropic-revokes-openais-access-to-claude/',
        },
        {
          text: '推论：训练环境、工具链与验证器必须自有可控，否则数据来源、奖励信号与迭代节奏都受制于人',
        },
      ],
    },
  ],
}
