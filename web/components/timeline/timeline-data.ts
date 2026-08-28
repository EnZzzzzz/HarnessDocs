/**
 * AI 发展脉络时间线数据。
 * 三条主线（提示词工程 / 上下文工程 / Harness 工程）是持续演进、相互交织的，
 * 没有明确的时间边界——THEME_META 只标注大致范围。
 * EVENTS 为全量事件，严格按时间顺序排列；主题通过 theme 字段标记。
 * 修正时直接改这里。
 */

export type ThemeId = 'prompt' | 'context' | 'harness'

export type EventType = 'paper' | 'product' | 'open-source' | 'concept' | 'event'

export interface TimelineEvent {
  /** 年月，YYYY-MM */
  date: string
  title: string
  description: string
  /** 所属脉络 */
  theme: ThemeId
  type: EventType
  /** 关键节点：视觉上加重呈现 */
  milestone?: boolean
  /** 里程碑配图（public/timeline/ 下的路径），仅关键节点需要 */
  image?: string
  /** 来源链接（官方博客 / arXiv / 权威报道） */
  source: string
}

export interface ThemeMeta {
  id: ThemeId
  keyword: string
  en: string
  /** 该阶段的时间范围，YYYY-MM（吸顶主题条据此切换） */
  range: [string, string]
  rangeLabel: string
  description: string
}

export const THEME_META: Record<ThemeId, ThemeMeta> = {
  prompt: {
    id: 'prompt',
    keyword: '提示词工程',
    en: 'Prompt Engineering',
    range: ['2022-11', '2023-12'],
    rangeLabel: '2022 — 2023',
    description: '怎么跟 AI 说话？角色扮演、CoT、Few-Shot。学术萌芽可追溯到 2018–2020 的 BERT 与 GPT-3 模板提示。',
  },
  context: {
    id: 'context',
    keyword: '上下文工程',
    en: 'Context Engineering',
    range: ['2024-07', '2025-12'],
    rangeLabel: '2024 — 2025',
    description: '给 AI 什么信息？RAG、向量库、记忆管理、AGENTS.md。思想根源是 90 年代的情境感知计算。',
  },
  harness: {
    id: 'harness',
    keyword: 'Harness 工程',
    en: 'Harness Engineering',
    range: ['2026-02', '2026-12'],
    rangeLabel: '2026 — 至今',
    description: '在什么环境里让 AI 跑？约束系统、反馈闭环、CI 管线、沙箱。',
  },
}

export const THEME_ORDER: ThemeId[] = ['prompt', 'context', 'harness']

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  paper: '论文',
  product: '产品',
  'open-source': '开源',
  concept: '概念',
  event: '动态',
}

/** 全部事件，严格按时间顺序 */
export const EVENTS: TimelineEvent[] = [
  {
    date: '2020-05',
    title: 'GPT-3 论文发布',
    milestone: true,
    image: '/timeline/gpt3.png',
    description: '《Language Models are Few-Shot Learners》证明提示词即可激发模型能力，提示工程时代开启。',
    theme: 'prompt',
    type: 'paper',
    source: 'https://arxiv.org/abs/2005.14165',
  },
  {
    date: '2020-05',
    title: 'RAG 论文发表',
    milestone: true,
    image: '/timeline/rag.svg',
    description: 'Facebook AI 提出检索增强生成：先检索再回答。当时少有人在意，日后成为企业落地标配。',
    theme: 'context',
    type: 'paper',
    source: 'https://arxiv.org/abs/2005.11401',
  },
  {
    date: '2022-01',
    title: 'Chain-of-Thought 提出',
    milestone: true,
    image: '/timeline/cot.png',
    description: 'Google 发现让模型写出中间推理步骤可大幅提升复杂任务表现，思维链成为标配技巧。',
    theme: 'prompt',
    type: 'paper',
    source: 'https://arxiv.org/abs/2201.11903',
  },
  {
    date: '2022-03',
    title: 'InstructGPT：RLHF 指令对齐',
    description: 'OpenAI 用人类反馈强化学习让模型学会「听懂指令」，为 ChatGPT 铺路。',
    theme: 'prompt',
    type: 'paper',
    source: 'https://arxiv.org/abs/2203.02155',
  },
  {
    date: '2022-03',
    title: 'Self-Consistency',
    description: '多条思维链采样再多数投票，把 CoT 的稳定性又推高一层——提示开始有了「系统工程」的味道。',
    theme: 'prompt',
    type: 'paper',
    source: 'https://arxiv.org/abs/2203.11171',
  },
  {
    date: '2022-05',
    title: '「让我们一步步思考」',
    description: 'Zero-shot CoT：一句「Let\'s think step by step」即可激发推理，提示词的魔法时刻。',
    theme: 'prompt',
    type: 'paper',
    source: 'https://arxiv.org/abs/2205.11916',
  },
  {
    date: '2022-10',
    title: 'ReAct：推理与行动交织',
    milestone: true,
    image: '/timeline/react.svg',
    description: '普林斯顿大学与 Google Research 联合提出：让模型交替输出思考与工具调用，提示词从「问答技巧」走向「智能体范式」。',
    theme: 'prompt',
    type: 'paper',
    source: 'https://arxiv.org/abs/2210.03629',
  },
  {
    date: '2022-10',
    title: 'LangChain 开源',
    description: 'Harrison Chase 开源 LangChain，把提示模板、链式调用工程化，提示工程有了脚手架。',
    theme: 'prompt',
    type: 'open-source',
    source: 'https://github.com/langchain-ai/langchain',
  },
  {
    date: '2022-11',
    title: 'ChatGPT 发布',
    milestone: true,
    image: '/timeline/chatgpt.svg',
    description: '11 月 30 日发布，五天破百万用户。提示词从研究员的技巧变成全民的日常。',
    theme: 'prompt',
    type: 'product',
    source: 'https://openai.com/index/chatgpt/',
  },
  {
    date: '2022-11',
    title: 'LlamaIndex（GPT Index）开源',
    description: 'Jerry Liu 开源 GPT Index，让私有数据接入 LLM 的第一批框架之一，「给模型喂上下文」开始工程化。',
    theme: 'context',
    type: 'open-source',
    source: 'https://github.com/run-llama/llama_index',
  },
  {
    date: '2023-03',
    title: 'GPT-4 发布',
    milestone: true,
    image: '/timeline/gpt4.jpg',
    description: '3 月 14 日发布，多模态 + 更强指令遵循，提示技巧开始体系化、课程化。',
    theme: 'prompt',
    type: 'product',
    source: 'https://openai.com/index/gpt-4-research/',
  },
  {
    date: '2023-03',
    title: '「提示词工程师」成热门职位',
    description: 'Anthropic 开出 25–37.5 万美元年薪招聘 Prompt Engineer，引发全球报道热潮。',
    theme: 'prompt',
    type: 'event',
    source: 'https://www.anthropic.com/news',
  },
  {
    date: '2023-03',
    title: 'AutoGPT 爆火',
    description: '把 GPT-4 包进自主循环里自我提示，4 月初登顶 GitHub trending——Agent 浪潮的预演。',
    theme: 'prompt',
    type: 'open-source',
    source: 'https://github.com/Significant-Gravitas/AutoGPT',
  },
  {
    date: '2023-05',
    title: 'Aider 开源',
    description: 'Paul Gauthier 发布终端 AI 结对编程工具：git 原生、自动提交——CLI harness 的先驱。',
    theme: 'harness',
    type: 'open-source',
    source: 'https://github.com/Aider-AI/aider',
  },
  {
    date: '2023-05',
    title: 'Claude 支持 100k 上下文',
    description: '5 月 11 日，Anthropic 把上下文窗口扩到 10 万 token——一整本书可以塞进一次对话。',
    theme: 'context',
    type: 'product',
    source: 'https://www.anthropic.com/news/100k-context-windows',
  },
  {
    date: '2023-05',
    title: 'Tree of Thoughts',
    description: '提示词工程的集大成者：让模型在思维树中搜索。人们开始意识到，技巧终有极限。',
    theme: 'prompt',
    type: 'paper',
    source: 'https://arxiv.org/abs/2305.10601',
  },
  {
    date: '2023-06',
    title: 'OpenAI 推出 Function Calling',
    description: '6 月 13 日，模型可按结构化 schema 调用外部函数，工具结果回流上下文，Agent 的地基。',
    theme: 'context',
    type: 'product',
    source: 'https://openai.com/index/function-calling-and-other-api-updates/',
  },
  {
    date: '2023-07',
    title: '「Lost in the Middle」',
    description: '论文揭示模型对长上下文中间部分利用极差——窗口再大，也不是塞进去就有效。',
    theme: 'context',
    type: 'paper',
    source: 'https://arxiv.org/abs/2307.03172',
  },
  {
    date: '2023-10',
    title: 'SWE-bench 基准发布',
    description: '用真实 GitHub issue 评测修 bug 能力。后来它丈量的其实是 harness，而不只是模型。',
    theme: 'harness',
    type: 'paper',
    source: 'https://arxiv.org/abs/2310.06770',
  },
  {
    date: '2024-02',
    title: 'Gemini 1.5 Pro：百万级上下文',
    description: '2 月 15 日，Google 把上下文窗口推到 100 万 token，长上下文竞赛白热化。',
    theme: 'context',
    type: 'product',
    source: 'https://blog.google/innovation-and-ai/products/google-gemini-next-generation-model-february-2024/',
  },
  {
    date: '2024-03',
    title: 'Devin 发布',
    milestone: true,
    image: '/timeline/devin.jpg',
    description: '3 月 12 日，Cognition 推出「首位 AI 软件工程师」，完整 agent harness 第一次出圈。',
    theme: 'harness',
    type: 'product',
    source: 'https://cognition.com/blog/introducing-devin',
  },
  {
    date: '2024-04',
    title: '微软 GraphRAG',
    description: '用知识图谱组织检索内容，RAG 从「找相似段落」进化到「理解全局结构」；7 月正式开源。',
    theme: 'context',
    type: 'paper',
    source: 'https://arxiv.org/abs/2404.16130',
  },
  {
    date: '2024-08',
    title: 'SWE-bench Verified',
    description: '8 月 13 日，OpenAI 人工核验出 500 个可靠样本——harness 军备竞赛，评测本身也在进化。',
    theme: 'harness',
    type: 'event',
    source: 'https://openai.com/index/introducing-swe-bench-verified/',
  },
  {
    date: '2024-09',
    title: 'Anthropic Contextual Retrieval',
    description: '9 月 19 日发布：为每个检索片段生成情境描述，检索失败率大降——上下文需要「加工」而非堆砌。',
    theme: 'context',
    type: 'concept',
    source: 'https://www.anthropic.com/engineering/contextual-retrieval',
  },
  {
    date: '2024-10',
    title: 'Claude 3.5 Sonnet 与 Computer Use',
    description: '10 月 22 日，模型直接操作电脑界面：截图感知、键鼠行动。harness 的边界扩展到整个桌面。',
    theme: 'harness',
    type: 'product',
    source: 'https://www.anthropic.com/news/3-5-models-and-computer-use',
  },
  {
    date: '2024-11',
    title: 'Windsurf 与 Cursor Agent 模式',
    description: 'Codeium 发布「agentic IDE」Windsurf；Cursor 0.43 引入 Composer Agent——IDE 形态开始改写。',
    theme: 'harness',
    type: 'product',
    source: 'https://cursor.com/changelog/0-43-x',
  },
  {
    date: '2024-11',
    title: 'MCP 协议发布',
    milestone: true,
    image: '/timeline/mcp.png',
    description: '11 月 25 日，Anthropic 开源 Model Context Protocol，为「上下文从哪里来」定下通用接口标准。',
    theme: 'context',
    type: 'open-source',
    source: 'https://www.anthropic.com/news/model-context-protocol',
  },
  {
    date: '2025-01',
    title: 'DeepSeek-R1 发布',
    milestone: true,
    image: '/timeline/deepseek-r1.png',
    description: '1 月 20 日，深度求索开源 R1：纯 RL 后训练涌现出推理能力（著名的「aha moment」），性能比肩 o1——推理开始内化进模型，提示技巧退场。',
    theme: 'harness',
    type: 'open-source',
    source: 'https://arxiv.org/abs/2501.12948',
  },
  {
    date: '2025-02',
    title: 'Claude Code 发布',
    milestone: true,
    image: '/timeline/claude-code.png',
    description: '2 月 24 日 research preview：一个极简的终端 CLI，用扎实的工具循环证明 harness 本身即是产品。',
    theme: 'harness',
    type: 'product',
    source: 'https://www.anthropic.com/news/claude-3-7-sonnet',
  },
  {
    date: '2025-04',
    title: 'OpenAI Codex CLI 开源',
    description: '4 月 16 日随 o3/o4-mini 同日发布；一个月后云端 Codex agent 上线，CLI harness 成必争之地。',
    theme: 'harness',
    type: 'open-source',
    source: 'https://github.com/openai/codex',
  },
  {
    date: '2025-05',
    title: 'Claude Code 正式 GA',
    description: '5 月 22 日随 Claude 4 转正；同月 Codex 云端 agent、Jules 公测——三巨头同月对垒。',
    theme: 'harness',
    type: 'product',
    source: 'https://www.anthropic.com/news/claude-4',
  },
  {
    date: '2025-06',
    title: 'OpenCode 与 Gemini CLI 开源',
    milestone: true,
    image: '/timeline/opencode-gemini-cli.png',
    description: '6 月 19 日 OpenCode、6 月 25 日 Gemini CLI——开源终端 agent 生态彻底繁荣。',
    theme: 'harness',
    type: 'open-source',
    source: 'https://opencode.ai',
  },
  {
    date: '2025-06',
    title: '「Context Engineering」流行',
    milestone: true,
    image: '/timeline/context-engineering.jpeg',
    description: 'Tobi Lütke 发推、Karpathy 转发附和：上下文工程取代提示词工程，成为新的行业热词。',
    theme: 'context',
    type: 'concept',
    source: 'https://glasp.co/articles/context-engineering',
  },
  {
    date: '2025-07',
    title: 'Kimi K2 发布',
    description: '7 月 11 日，月之暗面开源万亿参数 agentic 模型：模型为 Agent 场景而训练，与 harness 协同进化。',
    theme: 'harness',
    type: 'open-source',
    source: 'https://github.com/MoonshotAI/Kimi-K2',
  },
  {
    date: '2025-07',
    title: 'ChatGPT agent 发布',
    description: '7 月 17 日，OpenAI 把 Operator 与 Deep Research 合入统一 agent——harness 能力收进产品主界面。',
    theme: 'harness',
    type: 'product',
    source: 'https://openai.com/index/introducing-chatgpt-agent/',
  },
  {
    date: '2025-07',
    title: 'Qwen3-Coder 开源',
    description: '7 月 22 日，阿里开源 480B-A35B agentic 编程模型，国产开源阵营加入 harness 竞赛。',
    theme: 'harness',
    type: 'open-source',
    source: 'https://www.alibabacloud.com/en/press-room/alibaba-unveils-cutting-edge-ai-coding-model-qwen3',
  },
  {
    date: '2025-08',
    title: 'GPT-5 发布',
    milestone: true,
    image: '/timeline/gpt5.png',
    description: '8 月 7 日，OpenAI 称 Codex 中的 GPT-5 是「最强 agentic 编程模型」——模型发布以 harness 表现为卖点。',
    theme: 'harness',
    type: 'product',
    source: 'https://openai.com/index/introducing-gpt-5/',
  },
  {
    date: '2026-02',
    title: 'Hashimoto 命名「Harness Engineering」',
    milestone: true,
    image: '/timeline/hashimoto.png',
    description: '2 月 5 日，HashiCorp 联合创始人在《My AI Adoption Journey》中首次命名：Agent = Model + Harness——每次 agent 犯错，就改造系统让它永不再犯。',
    theme: 'harness',
    type: 'concept',
    source: 'https://mitchellh.com/writing/my-ai-adoption-journey',
  },
  {
    date: '2026-02',
    title: 'OpenAI 发布 Harness 工程实验报告',
    milestone: true,
    image: '/timeline/openai-harness.png',
    description: '2 月 11 日《Harness engineering: leveraging Codex in an agent-first world》：3 名工程师 5 个月让 AI 生成近百万行生产代码，全程零手写。',
    theme: 'harness',
    type: 'event',
    source: 'https://openai.com/index/harness-engineering/',
  },
  {
    date: '2026-02',
    title: 'Martin Fowler 网站跟进',
    description: '2 月 17 日，martinfowler.com 刊文讨论 Harness Engineering——概念从 AI 圈进入主流软件工程视野。',
    theme: 'harness',
    type: 'event',
    source: 'https://martinfowler.com/articles/harness-engineering.html',
  },
]

/** 按事件日期推导所属阶段：≤2023 提示词、2024–2025 上下文、≥2026 Harness */
export function stageOf(date: string): ThemeId {
  const y = Number(date.split('-')[0])
  if (y <= 2023) return 'prompt'
  if (y <= 2025) return 'context'
  return 'harness'
}
