import type { OutlineSectionData } from '../outline-data'

/**
 * 第 11 章：识别交付场景。
 * 内容依据大纲.md + design-harness/design-harness.html §02
 * （交付流程：多步打磨 → 场景包 → 单步生成）。
 */
export const S11_DELIVERY: OutlineSectionData = {
  id: 'delivery-scenarios',
  kicker: 'Design Harness · 交付',
  title: '识别交付场景',
  intro:
    'Design Harness 是设计师的生产工具，位于交付流程的上游。开发态与交付态对 Harness 的要求完全不同——先分清自己在哪一态，再决定交付什么。',
  cards: [
    {
      badge: '01',
      title: '开发态',
      en: 'Development Mode',
      tagline: '双 Harness 共同存在：生成侧打磨，判别侧把关',
      detail:
        '开发态是审美门禁的施工现场：生成 Harness 与判别 Harness 同时在线，设计师在多轮交互里把调性调到定稿。这一态的目标不是出图速度，而是把审美标准沉淀下来。',
      images: [
        {
          src: '/outline/design-harness-dual-loop.png',
          caption:
            '双 loop 对比：Coding Harness 收敛到唯一正确 patch，Design Harness 以「主观审美（设计师 + 评审 Agent）」为门禁、发散多方案并行——开发态里两个 Harness 必须同时在线',
          source: 'design-harness/design-harness.html §01 双 loop 对比图',
        },
        {
          src: '/outline/design-harness-core-ui.png',
          caption:
            'Design Harness 产品形态示意：设计师在核心对话区与 Design Agent 多轮打磨，组件库、术语库、设计风格库就是开发态沉淀审美标准的现场',
          source: 'design-harness/design-harness.html §03 核心功能示意',
        },
      ],
      points: [
        {
          text: '设计过程在交付前：多步打磨是主观门禁的必然形态',
          source: 'design-harness/design-harness.html §02',
        },
        {
          text: '发散、多方案并行，由用户/设计师做选择',
          source: 'design-harness/design-harness.html §01 双 loop 对比图',
        },
      ],
    },
    {
      badge: '02',
      title: '交付态',
      en: 'Delivery Mode',
      tagline: '三种交付力度：从场景包，到定制 Harness，到训练数据',
      detail:
        '交付态按业务方的接入深度分三档：最轻一档只交付 Skill 和设计组件，业务侧自己的 agent 消费场景包做单步生成；第二档交付生成 Harness，并针对场景做增强和定制；最重一档直接交付训练数据，让业务方回填自己的模型。',
      images: [
        {
          src: '/outline/design-harness-delivery-flow.png',
          caption:
            '交付流程三段图：设计师多轮打磨（多步）沉淀出场景包——泛化 Skill、风格化组件、设计资产、轨迹训练数据，业务方消费场景包一步生成（单步）；场景包正是第一档交付物',
          source: 'design-harness/design-harness.html §02 业务交付流程',
        },
      ],
      points: [
        {
          text: '第一档（最轻）：交付 Skill + 设计组件——业务方 / Agent 消费场景包，单步生成稳定复现审美',
          source: 'design-harness/design-harness.html §02',
        },
        {
          text: '第二档：交付生成 Harness，针对场景做增强与定制',
          source: '大纲.md §识别交付场景',
        },
        {
          text: '第三档（最重）：交付训练数据——轨迹数据直接回填业务方模型',
          source: '大纲.md §识别交付场景',
        },
      ],
    },
  ],
}
