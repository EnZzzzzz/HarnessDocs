import type { OutlineSectionData } from '../outline-data'

/**
 * 第 8 章：Design Harness 怎么做。
 * 内容依据大纲.md + design-harness/design-harness.html（Design vs Coding Harness
 * 双 loop 对比、「设计没有裁判」、场景包沉淀）。
 */
export const S08_DESIGN_HARNESS: OutlineSectionData = {
  id: 'design-harness',
  kicker: 'Design Harness · 实践',
  title: 'Design Harness 怎么做',
  intro:
    'Agent = Model + Harness。设计场景的独特性来自一个缺口：设计没有裁判——代码有编译器和测试做客观 oracle，而「好看」是主观的、多维度的判断。Design Harness 的一切设计都从这个缺口里长出来。',
  cards: [
    {
      badge: '01',
      title: '双 Harness 架构',
      en: 'Dual-Harness Architecture',
      tagline: '生成侧多步打磨、判别侧自造裁判，两个 Harness 各司其职',
      detail:
        '设计没有 design.test() 可跑，裁判必须自造：VLM 评委、视觉 lint、人工偏好。因此设计场景天然拆成两个 Harness——生成 Harness 走文本闭环、毫秒级、客观裁判；判别 Harness 以设计师 + 评审 Agent 做半人工的主观门禁，多轮逼近审美标准。',
      images: [
        {
          src: '/outline/harnesseval-agentic-eval.png',
          caption:
            '「自造裁判」的通用形态：HarnessEval 把评测本身做成一套 Harness——从技能库路由评估技能、调用工具产出分项证据，再聚合成可追溯的最终结论，而不是指望一个现成 oracle',
          source: 'https://mp.weixin.qq.com/s/T_fBh7p82OHaKw75oq-5cQ',
        },
        {
          src: '/outline/anthropic-game-ai-assist.png',
          caption:
            '主观门禁的具体交互形态：Anthropic 多智能体实验产出的应用内置 AI 助手一次生成多个布局方案，由人 Try Another / Discard / Accept & Apply——多方案并行发散、最终由用户做选择',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
      ],
      points: [
        {
          text: '最根本的区别只有一条：设计没有裁判——代码有编译器和测试，二值、可自动判定；审美判断不存在客观 oracle',
          source: 'design-harness/design-harness.html §01',
        },
        {
          text: 'Design Harness 与 Coding Harness 的差异，比任何两种 Coding Harness 之间的差异都大：模态、动作空间、反馈机制三重全换',
          source: 'design-harness/design-harness.html §01',
        },
        {
          text: '主观审美术语半人工门禁：设计师 + 评审 Agent 共同打分，多方案并行发散、由用户做选择',
          source: 'design-harness/design-harness.html §01 双 loop 对比图',
        },
      ],
    },
    {
      badge: '02',
      title: '识别场景',
      en: 'Scenario Scoping',
      tagline: '先判断哪些场景值得做：高频、有品牌调性、无客观裁判',
      detail:
        '不是所有设计需求都值得配一套 Design Harness。识别场景的判据：需求高频复现、有明确的品牌/风格约束、成败依赖主观审美而非功能正确性。这类场景里，多步打磨不是缺陷，而是主观门禁的必然形态。',
      images: [
        {
          src: '/outline/claude-design-editor.jpg',
          caption:
            'Claude Design（Anthropic Labs）官方工作台：生成结果挂接主题、断点与参数微调面板，设计 agent 已能从 prompt 直接产出可继续精调的视觉作品',
          source: 'https://www.anthropic.com/news/claude-design-anthropic-labs',
        },
        {
          src: '/outline/v0-home.png',
          caption:
            'v0 官网首页：一句话提示词驱动 UI 生成，配合模板库覆盖高频前端场景——「需求高频复现 + 风格约束」类场景已有成熟参照',
          source: 'https://v0.dev',
        },
        {
          src: '/outline/lovart-home.png',
          caption:
            'Lovart 的 AI 设计助手：围绕「运动品牌商品详情页」这类具体业务场景组织素材收集与生成流程，是场景化设计 agent 的代表——自研必要性需按场景与它对标论证',
          source: 'https://www.lovart.ai/',
        },
      ],
      points: [
        {
          text: 'Harness 是多步的，产物是单步的：审美无法一步判定，只能多轮逼近',
          source: 'design-harness/design-harness.html §02',
        },
        {
          text: '多步迭代的意义在于沉淀：把设计师的审美一次性「冻进」场景包，让业务侧的单步生成稳定复现',
          source: 'design-harness/design-harness.html §02',
        },
        {
          text: '市场格局已有参照：Claude Design / v0 / Stitch / Lovart 各据一环，自研必要性按场景论证',
          source: 'design-harness 调研与必要性分析（index.md 著录）',
        },
      ],
    },
  ],
}
