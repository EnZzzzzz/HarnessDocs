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
      detail: [
        '问题：设计交付前横着一个结构性矛盾——「好看」没有客观裁判，不像代码有编译器和测试可以一锤定音。如果跳过打磨直接把生成结果交给业务方，交出去的只是未经审美把关的半成品，每次生成的调性都会漂移。所以设计过程必须先于交付存在，而且要有人守着门禁。',
        '做法：开发态让两个 Harness 同时在线、各司其职。生成 Harness 走视觉闭环——生成设计、秒级渲染出图、模型「看」自己的产出、再调参数，多方案并行发散；判别 Harness 则是半人工的主观门禁，由设计师加评审 Agent 共同把关，多轮「生成 → 看 → 调」一直逼近到定稿。组件库、术语库、设计风格库在这一态不是素材堆，而是审美标准被逐轮固化下来的现场。',
        '效果：这一态的产出不是一张图，而是标准本身——设计师的审美在多轮打磨中被「冻进」场景包，交付态的单步生成才有稳定复现的前提；同时生成侧得以保持极简、只留必要工具，顺带产出纯净的训练轨迹。开发态不求快，求的是把主观判断变成可交付的资产。',
      ],
      images: [
        {
          src: '/outline/design-harness-dual-loop.png',
          caption:
            '左右两个闭环对照着读：左侧 Coding Harness「修改代码 → 执行命令 → 文本反馈 → 修复重试」，中央绿色菱形是客观裁判（编译器、测试），底部收敛到唯一正确 patch；右侧 Design Harness「生成设计 → 渲染出图 → 视觉回看 → 调整参数」，中央红色菱形换成「主观审美（设计师 + 评审 Agent，半人工）」，底部发散为多方案并行、用户做选择。开发态要的就是右图这两个角色同时在线：生成侧跑圈，判别侧守门。',
          source: 'design-harness/design-harness.html §01 双 loop 对比图',
        },
        {
          src: '/outline/design-harness-core-ui.png',
          caption:
            'Design Harness 工作台布局：中央核心对话区里设计师与 Design Agent 多轮对话，左侧组件库、术语库，右侧设计风格库、智能总结与相关组件推荐环绕排布。注意右上「对话总结」面板——每轮对话自动提炼新增组件、使用风格与相关术语，审美标准就是在开发态的这些面板里被逐轮沉淀下来的。',
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
      detail: [
        '问题：开发态把审美标准沉淀成场景包之后，下一个问题是——怎么把它交到业务方手上？不同业务方的接入深度差别很大：有的只想让自己的 agent 稳定复现这套调性，有的愿意接手整套生成系统，有的连模型都要自己训。一刀切的交付对前者太重、对后者又不够。',
        '做法：按接入深度把交付分成三档。最轻一档只交付 Skill 和设计组件——也就是场景包，业务侧自己的 agent 消费它做单步生成，一次调用、拿来即用；第二档交付生成 Harness 本体，并针对业务场景做增强和定制；最重一档直接交付轨迹训练数据，让业务方回填自己的模型，把审美能力训进底座。',
        '状态边界：开发态同时运行生成与判别两套 Harness——前者负责把作品做出来，后者用完全不同的上下文、工具和 Skills 独立评审；两侧的迭代共同沉淀出 Skill 组件、场景知识、设计指南、设计资产、评审证据和轨迹数据。进入业务交互态后，最轻交付只需让生成 Harness 消费这层场景包即可，判别 Harness 不必常驻；只有业务需要在线复验、持续改进或重新沉淀标准时，才把判别侧重新接入。',
        '效果：三档共用同一条供应链——上游多步打磨沉淀出的场景包（泛化 Skill、风格化组件、设计资产、轨迹训练数据），交付力度越深，业务方对 Harness 和模型的掌控越强；而即便只取最轻一档，业务侧也能做到单步生成稳定复现设计师定稿的调性，一套产物、多场景复用。',
      ],
      images: [
        {
          src: '/outline/delivery-dual-harness-architecture.svg',
          caption:
            '系统架构图 · 蓝色虚线框是开发态：生成 Harness 与判别 Harness 同时在线，作品向右送审，截图、操作证据、评分和批评向左反馈；两个 Harness 内部使用不同的上下文、工具集和 Skills。绿色虚线框是交互态：业务侧只需让生成 Harness 消费下方的共享场景包，判别 Harness 留在框外、按需接入。下方底座是开发过程真正可交付的沉淀——Skill 组件、场景知识、设计指南、设计组件与资产，以及评审证据和轨迹训练数据。',
          afterParagraph: 2,
        },
        {
          src: '/outline/design-harness-delivery-flow.png',
          caption:
            '三段式交付流程，从左往右读：左段「交付前 · 设计过程」——设计师与 Design Harness 多轮迭代，红框标出「门禁 = 主观审美（多步的根源）」；中段「交付产物」——迭代沉淀为场景包，列着泛化 Skill、风格化组件、设计资产 · 风格沉淀、轨迹训练数据四项；右段「交付时 · 业务交付」——业务方 / Agent 消费场景包，绿框「深度定制 → 无需再迭代」，底部红字「单步 · 一步生成」。三档交付力度里最轻的一档，交付的就是中间这个场景包。',
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
