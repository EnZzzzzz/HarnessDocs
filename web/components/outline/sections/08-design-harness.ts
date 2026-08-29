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
      detail: [
        '问题：设计场景没有 design.test() 可跑——代码有编译器和测试做二值、可自动执行的 oracle，而「好看」是主观、多维度的判断，不存在现成裁判。更麻烦的是不能让干活的 agent 自评：Anthropic 在实验中发现，让 agent 评价自己的产出时，它会自信地称赞明显平庸的作品，设计这类没有二值校验的主观任务上，这种偏袒最严重。',
        '做法：裁判必须自造，设计场景因此拆成两个 Harness。判别侧把「这个设计好看吗」改写成可打分的命题：Anthropic 借鉴 GAN 设立独立 evaluator，先写设计质量、原创性、工艺、功能四条评分准则（刻意加重设计与原创的权重，明确惩罚模板化的「AI slop」），evaluator 通过 Playwright 实际操作活页面、逐项打分并写出具体批评；HarnessEval 则给出更通用的形态——评测本身拆成 Plan→Route→Decompose→Verify 的工作流，从技能库按案例路由评估技能，把高层判断拆成可验证的子问题逐一取证。生成侧在这个主观门禁的反馈里多轮逼近：每次生成跑 5–15 轮，每轮结束 generator 自行决定继续打磨当前方向，还是整体换一种美学。',
        '关键边界：这不是同一个 Harness 增加一段“请反思”的 prompt，而是两套隔离的运行时。生成 Harness 的上下文是需求、代码库、历史修改和构建结果，工具是 Bash、Write、Git、编译与测试，Skills 围绕实现和工程交付；判别 Harness 的上下文则是设计目标、品牌规范、参考案例与评分准则，工具换成 Playwright、浏览器交互、截图、无障碍检查和多模态视觉模型，Skills 围绕审美、原创性、工艺与功能评估。两侧只交换可运行作品与带截图、操作记录和评分依据的反馈，判别侧不参与写代码，生成侧也不能替自己的作品打分。',
        '效果：两侧都有可核查的结果。Anthropic 的闭环里评分跨迭代持续抬升，且仅凭评分准则的第一轮输出就明显优于无干预基线；在荷兰美术馆网站一案中，模型第 10 轮推倒既有方案，把页面重写为 CSS 透视渲染的 3D 展厅——作者称这是单次生成从未出现过的创意跃迁。HarnessEval 一侧，评测交付的不只是一个分数，还有一棵记录「测了什么、用什么工具取证、证据如何支撑结论」的完整证据树，每个分数可追溯、可复现。',
      ],
      images: [
        {
          src: '/outline/dual-harness-generator-judge.jpg',
          caption:
            '概念图 · 双 Harness、双工具箱。左侧蓝色生成 Harness 持有代码上下文、终端、文件写入、Git、构建测试与工程 Skills，向中间交付可运行页面；右侧紫色判别 Harness 持有设计准则、参考案例、Playwright、截图、交互与多模态视觉评估 Skills，独立操作和观察作品。正向只传作品，反向传回截图、操作记录、分项评分与批注组成的证据包——两侧上下文、工具、Skills 和身份都不共用。',
          afterParagraph: 2,
        },
        {
          src: '/outline/harnesseval-agentic-eval.png',
          caption:
            'HarnessEval 的 Agentic Evaluation 流程图，自左向右读：Model Output 先进入 Skill Library，图中高亮的 Eval Skill 1 与 N 是本案例实际路由到的评估技能；每个技能再调用 2–3 个 Eval Tool 取证，产出 Skill Evidence 1..N，最终汇聚为 Final Result。它说明设计场景的裁判不是现成 oracle，而是一套按案例组织证据的评测 Harness',
          source: 'https://mp.weixin.qq.com/s/T_fBh7p82OHaKw75oq-5cQ',
        },
        {
          src: '/outline/anthropic-game-ai-assist.png',
          caption:
            'Anthropic 三 agent 实验产出的游戏编辑器，内置「AI Level Assistant」：输入关卡描述（图中为 “create a castle with sprites guarding it”）后生成布局，底部 Try Another / Discard / Accept & Apply 三个按钮把最终取舍交给人——主观门禁的具体交互形态：机器发散方案，人做审美裁决',
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
      detail: [
        '问题：不是所有设计需求都值得配一套 Design Harness。多步打磨意味着每次生成都要多轮往返，搭建场景包、评分准则和评审门禁本身也是一笔投入；如果需求只出现一次，或者成败只看功能对错，这套重装备收不回成本。所以第一个要回答的问题不是「怎么做」，而是「哪些场景值得做」。',
        '做法：判据有三条——需求高频复现、有明确的品牌/风格约束、成败依赖主观审美而非功能正确性。这类场景里多步打磨不是缺陷，而是主观门禁的必然形态；多步迭代的意义在于沉淀——把设计师的审美一次性「冻进」场景包，让业务侧此后的单步生成稳定复现。决定自研之前还要先看市场：v0 用模板库把高频前端场景产品化，Lovart 围绕「运动品牌商品详情页」这类具体业务场景组织素材收集与生成，Claude Design 则在 onboarding 时读取团队代码库与设计文件、自动构建可复用的设计系统，三者已各据一环。',
        '效果：这类场景的价值已有量化验证。Brilliant 反馈其最复杂的页面在其他工具里要 20 多个 prompt 才能还原，在 Claude Design 里只需 2 个；另有团队把原本一周的 brief—mockup—评审往返压缩成一次对话产出可用原型。换言之，「高频 + 风格约束 + 主观裁判」的场景已经有成熟参照物，自研的必要性必须按具体场景与它们对标论证，而不是默认成立。',
      ],
      images: [
        {
          src: '/outline/claude-design-editor.jpg',
          caption:
            'Claude Design（Anthropic Labs）工作台：左侧是生成中的暗色数据可视化页面，右侧 Tweaks 面板是 Claude 为当前作品现场生成的精调控件——THEME 深浅色切换、BREAKPOINT 三档断点、NETWORK 下一组参数滑杆，顶部还有 Comment / Edit 入口。它说明「生成后再精调」在高频设计场景里已经产品化',
          source: 'https://www.anthropic.com/news/claude-design-anthropic-labs',
        },
        {
          src: '/outline/v0-home.png',
          caption:
            'v0 首页：顶部一句话输入框（「您想创建什么？」）驱动 UI 生成，下方是 Contact Form、Image Editor 等快捷场景入口和按 Apps and Games / Landing Pages / Components / Dashboards 分类的模板墙——高频前端场景已被模板化覆盖，是「需求高频复现」判据的现成参照',
          source: 'https://v0.dev',
        },
        {
          src: '/outline/lovart-home.png',
          caption:
            'Lovart 首页的演示案例「为新生代运动品牌设计商品详情页」：左侧画布铺出主图、特写、上脚照一整套素材，右侧对话流显示 agent 的工作痕迹——「已分析用户意图 / 已探索视觉趋势 / 已收集参考资料」。它代表场景化设计 agent 的形态，自研必要性需按场景与它对标论证',
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
