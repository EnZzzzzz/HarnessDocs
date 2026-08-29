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
      detail: [
        '问题：LLM 没有跨会话的记忆——这次踩过的坑、摸索出的做法，会话一结束就消散，下个任务从头再来。Hermes 的 Learning Loop 要回答的就是：怎么把每次会话的经验自动沉淀为可复用资产，而不是靠用户手动整理笔记。',
        '做法：把沉淀拆成一个四步闭环。Observe 记录每轮交互与轨迹作为原料；Distill 在回复结束后后台复盘，把反复出现的纠正和经得起复用的工作流提炼出来；Reuse 把沉淀物注入后续会话的上下文，同场景直接复用；Refine 在发现更优路径时回头 patch 已有条目，而不是只增不改。',
        '效果：Continual-Harness 论文把同构的闭环形式化并做了量化验证——Refiner 每隔 F 步读取最近轨迹窗口，对 prompt、sub-agents、skills、memory 四类组件做 CRUD 编辑，harness 状态随 episode 持续演化；在 Pokémon Red/Emerald 上，这套从零起步的自改进循环收回了与手工专家 harness 之间的大部分差距。论文同时把 Hermes 列为 assistant 任务的 agentic harness 参照，并指出这类 harness 的经验优化发生在 episode 之间——本章的四步循环正是这一类的代表。',
        '另一个证据是修改记录本身：GPP 的 Yellow Legacy 运行中，对 skill 与 sub-agent 定义的 CRUD 修改贯穿二十多万轮、始终不收敛到一个固定 scaffold，且集中在少数最常出问题的导航与战斗组件上——循环确实在"持续转动"，而且改的是该改的地方。',
      ],
      images: [
        {
          src: '/outline/continual-harness-methodology.png',
          caption:
            'Continual-Harness 论文方法图（图 2a）：harness 状态 H 由 prompt、sub-agents、skills、memory 四类组件构成，Refiner 每隔 F 步读取最近轨迹窗口并产出对各组件的编辑 Δ——与 Hermes 的 Observe→Distill→Refine 闭环同构',
          source: 'https://arxiv.org/abs/2605.09998',
        },
        {
          src: '/outline/continual-harness-crud-updates.png',
          caption:
            '论文 Figure 3：GPP Yellow Legacy 运行中对 skill（蓝）与 sub-agent（橙）定义的 CRUD 修改量，按每 2,000 轮分箱。左图总修改量贯穿二十多万轮始终不为零，说明 harness 不收敛到固定 scaffold；右图 Top-5 组件显示修改集中在 pathfinder、battle_strategist_agent 等少数导航与战斗组件——循环持续转动，且改的是最常出问题的地方',
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
      detail: [
        '问题：经验沉淀下来之后放哪？全部塞进系统提示会撑爆上下文、稀释注意力；全部扔进数据库又依赖检索，关键事实不一定在场。不同类型的经验访问模式不同——有的要常驻，有的按需出现，单一存储无法同时满足。',
        '做法：Hermes 把沉淀物分成两类资产。程序性经验（"怎么做"）沉淀为 Skill：agent 通过 skill_manage 工具自建、自改、自删，官方文档直接称它为"程序性记忆"，内容是带触发场景、步骤、坑与验证方法的标准 SKILL.md。陈述性经验（"是什么"）沉淀为 Memory：MEMORY.md（2200 字符 ≈800 tokens）加 USER.md（1375 字符 ≈500 tokens）两个有硬性容量上限的文件，会话开始时以冻结快照注入系统提示。',
        '关键设计在容量上限的执行方式：写满时 memory 工具不静默丢弃、也不自动压缩，而是报错并把现有条目清单还给 agent，由它当场合并精简再重试——上限倒逼资产保持信息密度。冻结快照则保证会话内系统提示不变，保住 LLM 的前缀缓存。',
        '效果：两类资产在自我改进循环中各就其位——Memory 存应常驻上下文的小事实，Skill 存按需加载的长流程；上下文开销有界，经验却可以持续累积。映射到设计场景：Skill ≈ 风格规则与组件用法，Memory ≈ 设计资产与风格偏好。',
      ],
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
        { text: 'Memory：陈述性记忆，有硬性容量上限，写满报错、由 agent 当场合并精简', source: 'https://hermes-agent.nousresearch.com/docs/user-guide/features/memory' },
        { text: '设计场景映射：Skill ≈ 风格规则与组件用法', source: 'design-harness.html §03' },
        { text: '设计场景映射：Memory ≈ 设计资产与风格偏好', source: 'design-harness.html §03' },
      ],
    },
    {
      badge: '03',
      title: '后台异步复盘，前台无感',
      en: 'Async Review Agent',
      tagline: '会话结束后异步 fork 审查 agent，经验在后台慢慢整理',
      detail: [
        '问题：复盘是沉淀的前提，但复盘本身是一次额外的模型调用——卡在回复链路上，用户每轮都要干等；全量回放 transcript，token 成本又随会话长度线性上涨。既要沉淀，又不能拖累前台体验。',
        '做法：Hermes 把复盘挪到后台异步执行。每轮回复结束后 fork 一个 self-improvement review，从记忆、技能、执行过程三个维度复盘刚结束的会话。默认它复用主模型的 prompt 缓存做廉价回放；也可以配置 auxiliary.background_review 换更便宜的模型，此时 fork 自动改用压缩 digest（近期轮次原文 + 早期轮次摘要）回放，尽量少写新缓存。',
        '效果：官方测试显示，换用便宜模型后复盘成本约降低 3–5×，而 memory 捕获完全一致、skill 捕获近乎一致。用户侧看到的就是秒回加一行「💾 Memory updated」；不放心自动化的话，write_approval 可以把每次写入 stage 成待审批。设计师只管调设计，沉淀在后台自动发生。',
      ],
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
      detail: [
        '问题：沉淀物只增不减，全量注入上下文迟早撑爆；完全不注入又等于没沉淀。需要把"知道有什么资产"与"用上某个资产"的成本解耦。',
        '做法：Hermes 用三级渐进式披露。Level 0 常驻上下文的只是全部技能的 name/description/category 索引，约 3k tokens；场景匹配时才走 Level 1 用 skill_view 加载完整 SKILL.md，Level 2 再按需加载 references/ 里的单个引用文件。/learn 面对整本书或大文档语料时也不会把来源塞进一个文件，而是产出"精简主文件 + 每章一个蒸馏文件"的 knowledge-base skill——查询成本与答案大小成正比，而非与来源大小成正比。',
        '效果：无论资产攒到多少，常驻开销恒定在约 3k tokens；配合 Refine 环节对已有条目的自我 patch，存量资产还会随使用被持续修正而不是腐烂。资产越攒越多，上下文不爆。',
      ],
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
