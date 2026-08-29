import type { OutlineSectionData } from '../outline-data'

export const S06_HERMES: OutlineSectionData = {
  id: 'hermes-loop',
  kicker: '经验沉淀 · Hermes Learning Loop',
  title: '经验式的自进化',
  intro:
    'Hermes 是 Nous Research 的开源 agent 系统（"The agent that grows with you"），它的 Learning Loop 把每次会话的经验自动总结、沉淀为可复用资产，是"Harness 自进化"的典型参照。',
  cards: [
    {
      badge: '01',
      title: '四步循环，持续转动',
      en: 'Observe → Distill → Reuse → Refine',
      tagline: '观察记录轨迹，蒸馏提炼经验，复用注入上下文，精炼自我修补',
      detail:
        'Hermes Learning Loop 由四步构成闭环：Observe 记录每轮交互与轨迹；Distill 在后台复盘、提炼经验；Reuse 把沉淀物注入后续任务的上下文；Refine 在发现更优解时自我 patch 已有条目，循环持续转动。',
      images: [
        {
          src: '/outline/continual-harness-methodology.png',
          caption:
            'Continual-Harness 论文方法图（图 2a）：harness 状态 H 由 prompt、sub-agents、skills、memory 四类组件构成，Refiner 每隔 F 步读取最近轨迹窗口并产出对各组件的编辑 Δ——与 Hermes 的 Observe→Distill→Refine 闭环同构',
          source: 'https://arxiv.org/abs/2605.09998',
        },
      ],
      points: [
        { text: 'Observe：记录每轮交互与轨迹，作为经验原料', source: 'design-harness.html §03' },
        { text: 'Distill：后台复盘会话，把轨迹提炼为经验', source: 'design-harness.html §03' },
        { text: 'Reuse：沉淀物注入后续任务上下文，同场景直接复用', source: 'design-harness.html §03' },
        { text: 'Refine：发现更优路径时自我 patch 已有条目', source: 'design-harness.html §03' },
        {
          text: '论文将 Hermes 列为 assistant 任务的 agentic harness 参照，并指出此类 harness 的经验优化发生在 episode 之间',
          source: 'Continual-Harness 2605.09998 §5.1（引用 [13]）',
        },
      ],
    },
    {
      badge: '02',
      title: '双资产制：Skill + Memory',
      en: 'Skill & Memory',
      tagline: '程序性经验沉淀为 Skill，陈述性经验沉淀为 Memory',
      detail:
        'Hermes 把沉淀物分成两类：程序性的 Skill（SOP 步骤 + 触发场景声明）和陈述性的 Memory（有容量上限、写满自动压缩）。映射到设计场景：Skill ≈ 风格规则与组件用法，Memory ≈ 设计资产与风格偏好。',
      images: [
        {
          src: '/outline/hermes-agent-managed-skills.png',
          caption:
            '官方文档：agent 通过 skill_manage 工具自增/自改 Skill，官方明确称其为"程序性记忆"；Skill 存按需加载的长流程，Memory 存常驻上下文的小事实，两者在自我改进循环中分工',
          source: 'https://hermes-agent.nousresearch.com/docs/user-guide/features/skills',
        },
        {
          src: '/outline/hermes-memory-files.png',
          caption:
            '官方文档：陈述性 Memory 由 MEMORY.md（2200 字符 ≈800 tokens）与 USER.md（1375 字符 ≈500 tokens）两个有硬性容量上限的文件构成，会话开始时以冻结快照注入系统提示',
          source: 'https://hermes-agent.nousresearch.com/docs/user-guide/features/memory',
        },
      ],
      points: [
        { text: 'Skill：SOP 步骤 + 触发场景声明，回答"怎么做"', source: 'design-harness.html §03' },
        { text: 'Memory：陈述性记忆，有容量上限、写满自动压缩', source: 'design-harness.html §03' },
        { text: '设计场景映射：Skill ≈ 风格规则与组件用法', source: 'design-harness.html §03' },
        { text: '设计场景映射：Memory ≈ 设计资产与风格偏好', source: 'design-harness.html §03' },
      ],
    },
    {
      badge: '03',
      title: '后台异步复盘，前台无感',
      en: 'Async Review Agent',
      tagline: '会话结束后异步 fork 审查 agent，经验在后台慢慢整理',
      detail:
        '回复结束后，Hermes 异步 fork 一个轻量审查 agent，从记忆、技能、执行过程三个维度复盘刚结束的会话。用户看到秒回，经验在后台慢慢整理——设计师只管调设计，沉淀自动发生。',
      images: [
        {
          src: '/outline/hermes-background-review.png',
          caption:
            '官方文档：每轮回复结束后，后台 self-improvement review 会静默保存记忆或更新技能，默认只在聊天里浮现一行"💾 Memory updated"——沉淀在后台发生，前台无感',
          source: 'https://hermes-agent.nousresearch.com/docs/user-guide/features/memory',
        },
        {
          src: '/outline/hermes-background-review-model.png',
          caption:
            '官方文档：复盘 fork 默认复用主模型的 prompt 缓存做廉价回放，也可配置 auxiliary.background_review 换更便宜的模型，以"近期原文 + 早期摘要"的压缩 digest 复盘会话',
          source: 'https://hermes-agent.nousresearch.com/docs/user-guide/features/memory',
        },
      ],
      points: [
        { text: '复盘时机：回复结束后异步执行，不阻塞前台响应', source: 'design-harness.html §03' },
        { text: '复盘主体：fork 一个轻量审查 agent 专职整理经验', source: 'design-harness.html §03' },
        { text: '复盘维度：记忆、技能、执行过程三个维度', source: 'design-harness.html §03' },
        { text: '人的位置：设计师只做审美门禁，沉淀全程无感', source: 'design-harness.html §03' },
      ],
    },
    {
      badge: '04',
      title: '渐进式披露注入',
      en: 'Progressive Disclosure',
      tagline: '平时只放轻量描述，场景匹配时才加载完整条目',
      detail:
        '平时只把全部沉淀物的轻量描述放进上下文（约 3k tokens），场景匹配时才加载完整条目为高优先级 prompt；发现更优路径时 agent 还能自我 patch 已有条目。资产越攒越多，上下文不爆。',
      images: [
        {
          src: '/outline/hermes-progressive-disclosure.png',
          caption:
            '官方文档的 Progressive Disclosure 三级加载：Level 0 只注入全部技能的 name/description/category（约 3k tokens），Level 1/2 才按需加载完整条目与引用文件——资产可持续累积而不撑爆上下文',
          source: 'https://hermes-agent.nousresearch.com/docs/user-guide/features/skills',
        },
      ],
      points: [
        { text: '默认注入：全部沉淀物的轻量描述，约 3k tokens', source: 'design-harness.html §03' },
        { text: '按需加载：场景匹配时完整条目升级为高优先级 prompt', source: 'design-harness.html §03' },
        { text: '自我维护：发现更优路径时 agent 自我 patch 已有条目', source: 'design-harness.html §03' },
        { text: '设计意图：资产可持续累积而不撑爆上下文', source: 'design-harness.html §03' },
      ],
    },
  ],
}
