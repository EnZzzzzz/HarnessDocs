import type { OutlineSectionData } from '../outline-data'

/**
 * 大纲第 5 章：Harness 关键词 · 自进化
 * 来源：2026 年 8 月 Matthew Berman 专访 OpenAI Codex 负责人 Tibo Sottiaux
 * （视频 https://www.youtube.com/watch?v=4qjEgPojjzM），
 * 内容以量子位与网易两篇中文纪要为准。
 */
export const S05_SELF_EVOLUTION: OutlineSectionData = {
  id: 'self-evolution',
  kicker: '关键词 · 自进化',
  title: 'Codex 产品负责人 Tibo：Harness 将走向哪里',
  intro:
    '在 2026 年 8 月的访谈中，Codex 负责人 Tibo Sottiaux 描述了一个会随用户自我进化的 Harness：底座通用、机制隐形，并且模型已经开始反过来优化运行自己的系统。',
  cards: [
    {
      badge: '01',
      title: '通用 Harness 底座',
      en: 'One Harness, Self-Evolving',
      tagline: '同一个 Harness 作底座，随使用自我进化、贴合每个用户',
      cover: {
        src: '/outline/universal-harness-editorial.png',
        alt: '通用 Harness 底座、插件模块与自进化闭环的编辑部手绘插画',
      },
      detail: [
        '问题：Codex 并入 ChatGPT 时，最初收到的用户反馈并不友好——「为什么要合并它们？真的必须这么做吗？」大家已经习惯了「程序员用 Codex、普通人用 ChatGPT」的划分。Tibo 的回答是：未来的模型本身就要求统一——它天然会编程、搜索、研究、调用工具、理解语音和图像，这些能力最终都建立在同一套 Agent Harness 之上，再人为区分两个产品，意义会越来越小。',
        '做法：把底座合一，把差异留给适配层。「它们的底层会是同一套技术：同一个 harness、同一种思路。」用户不该先决定「我是程序员，所以我要一个程序员界面」——软件工程师、设计师之类的标签，只是人类为应对过于复杂的现实发明的概念，每个人都处在连续光谱的不同位置。所以不同角色底层用的是同一个 AI，区别只在它连接的工具、权限与呈现出的界面；它会随每个人的任务、能力和习惯持续调整自己，尽可能地让你受益。',
        '效果：合并成了 Codex 最近增长的重要推动力——编程能力进入 ChatGPT 后，产品经理、设计师、销售都能直接调用，Codex 活跃用户在访谈当周达到约 2000 万，增长曲线「突然就垂直上升了」。而 Tibo 强调这只是第一步：终点是让两个产品概念继续淡化，最后只剩一个长期理解你的个人通用智能（Personal AGI）。',
      ],
      images: [
        {
          src: '/outline/qbitai-one-harness-quote.png',
          caption:
            '量子位纪要「ChatGPT 与 Codex 的融合」一节原文截图：注意 Tibo 的直接表述「它们的底层会是同一套技术：同一个 harness、同一种思路」，以及「界面应当根据你的需求来调整」——这正是做法段「底座合一、差异留给适配层」的原始出处',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          src: '/outline/qbitai-codex-20m-growth.png',
          caption:
            'Tibo 在访谈当周的 X 原帖截图（中英对照）：宣布 Codex 活跃用户本周达到 2000 万，并向所有 Codex 与 ChatGPT Work 用户发放一次重置奖励。主持人形容这条增长曲线「一开始是这样，然后突然就垂直上升了」——它是效果段「合并推动增长」的直接证据',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          src: '/outline/netease-personal-agi-conclusion.png',
          caption:
            '网易纪要的开篇结论第 1 条：Codex 并入 ChatGPT 只是第一步，终点是让两个产品概念继续淡化，只剩一个长期理解用户的「个人通用智能（Personal AGI）」——对应效果段的终局判断',
          source: 'https://www.163.com/dy/article/L561C9NN0556703U.html',
        },
        {
          src: '/outline/tibo-berman-interview.png',
          caption:
            '访谈现场：Matthew Berman（左）专访 OpenAI Codex 负责人 Tibo Sottiaux（右），本章内容均出自这场 2026 年 8 月的对谈',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
      ],
      points: [
        {
          text: '「它们的底层会是同一套技术：同一个 harness、同一种思路」——这是 Tibo 对 ChatGPT 与 Codex 融合的直接表述。',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          text: 'Tibo 称理想的智能体应深刻理解用户的目标、日常与团队上下文，并「持续调整自己，尽可能地让你受益」——即随使用自进化。',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          text: '网易纪要（作者解读）：不同角色的用户底层用的是同一个 AI，区别只在连接的工具、权限与界面，「一个 AI 根据你是谁，自动变成适合你的样子」。',
          source: 'https://www.163.com/dy/article/L561C9NN0556703U.html',
        },
        {
          text: '量子位纪要（作者概括）：未来不再有「编程 Agent」与「聊天助手」两个产品，而是同一个高度个人化的 AGI，按人自动调整界面。',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
      ],
    },
    {
      badge: '02',
      title: 'Skill 会被内化',
      en: 'Skills Are a Transient Form',
      tagline: '手动维护的 Skills / Memory / Sub-agent 只是中间形态',
      cover: {
        src: '/outline/skills-invisible-editorial.png',
        alt: '外部 Skills、记忆与子 Agent 被吸收进 Harness 并转化为内部能力，用户无需管理的编辑部手绘插画',
      },
      detail: [
        '问题：资深 Codex 用户已经习惯了一套手工维护的玩法——管理 skill 文件来教模型东西、靠记忆功能存住上下文、再搭一个子智能体网络来分工。Tibo 逐一数落它们的痛点：skill 文件「长期维护起来挺难的」；记忆并不总能记住一切；有了子智能体，还得操心它们之间怎么组网协作。在与 Agent 互动的每个环节，「它是一个完整伙伴」的幻觉都会被打破。',
        '判断：这些机制「都还是很早期的东西」。下一代 Agent 的核心不是再加更多 Skill、Memory 或子 Agent，而是让这些机制「消失」——理想的 Agent 长期理解你的目标、日常与团队上下文，自己决定需要调用什么技能、记住什么信息、是否启动其他 Agent，而不是让人去管理 Agent 的底层结构。模型越强，人越不应该管理 Agent 本身。',
        '方向：底层可以非常复杂，但用户看到的应该越来越简单。今天看到的 Skills、Memory、Sub-agent 可能都只是中间形态，复杂结构最终会被藏到后面——最后留下一个非常简单的 AI，它认识你、理解你，然后直接帮你把事情做掉。',
      ],
      images: [
        {
          src: '/outline/qbitai-skill-memory-subagent.png',
          caption:
            '量子位纪要原文截图：Tibo 逐一数落手动维护的痛点——「你得管理 skill 文件」「记忆也是个问题」「有子智能体就得操心子智能体」，并点明这些环节都会打破「完整伙伴」的幻觉。这就是问题段的直接出处',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          src: '/outline/netease-skills-early-stage.png',
          caption:
            '网易纪要对 Tibo 判断的转述：Skills、Memory、Sub-agent「都还是很早期的东西」，理想 Agent 应自己决定调用什么技能、记住什么、是否启动其他 Agent——对应判断段「让机制消失」的主张',
          source: 'https://www.163.com/dy/article/L561C9NN0556703U.html',
        },
      ],
      points: [
        {
          text: 'Tibo 原话（纪要译文）：「你得管理 skill 文件……长期维护起来挺难的。记忆也是个问题……如果有子智能体，就得操心子智能体。」',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          text: '量子位纪要（作者概括）：下一代 Agent 的核心不是再加更多 Skill、Memory 或子 Agent，而是让这些机制「消失」。',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          text: '网易纪要转述 Tibo 的判断：理想的 Agent 应「自己决定需要调用什么技能、记住什么信息、是否启动其他 Agent」；模型越强，人越不应该管理 Agent 本身。',
          source: 'https://www.163.com/dy/article/L561C9NN0556703U.html',
        },
        {
          text: '网易纪要（作者解读）：今天看到的 Skills、Memory、Sub-agent「可能都只是中间形态」，复杂结构最终会被藏到后面。',
          source: 'https://www.163.com/dy/article/L561C9NN0556703U.html',
        },
      ],
    },
    {
      badge: '03',
      title: 'Harness 自进化',
      en: 'The Harness Evolves Itself',
      tagline: '自进化的主角是 Harness：它随使用持续调整，不再依赖人工维护',
      cover: {
        src: '/outline/harness-self-evolution-editorial.png',
        alt: 'Harness 经历执行、观察、改写自身与验证后再次执行的闭环自进化编辑部手绘插画',
      },
      detail:
        '把 Tibo 的分散表述串起来，「Harness 自进化」的核心观点是：自改进不会以戏剧化的方式到来，而是发生在 Harness 层的三条已启动的趋势上——模型开始接手 Harness 的内部机制，技能、记忆、子 agent 不再靠人维护；模型开始反过来优化运行自己的系统，推理栈与服务架构是最先被改写的部分；同一个 Harness 随每个用户的使用持续调整形态。自我改进没有明确的时间点，它已经在一点点发生。',
      images: [
        {
          src: '/outline/qbitai-model-optimizes-infra.png',
          caption:
            '量子位纪要「AI 效率与算力」一节原文：模型优化自家服务架构后价格下调 80%、推理提速约 60%——Harness 自改进已发生在基础设施层',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          src: '/outline/netease-rsi-conclusion.png',
          caption:
            '网易纪要结论第 4、5 条：「模型已经开始反过来优化自己的推理基础设施」，Tibo 认为这已算递归自我改进的早期形态',
          source: 'https://www.163.com/dy/article/L561C9NN0556703U.html',
        },
      ],
      points: [
        {
          text: '自进化的主体是运行模型的系统本身：Tibo 确认模型已在优化自己的推理基础设施与服务架构——递归式自我改进最早发生在 Harness 层，而不是模型直接研究下一代模型。',
          source: 'https://www.163.com/dy/article/L561C9NN0556703U.html',
        },
        {
          text: '机制隐形是自进化的方向：模型自己决定调用什么技能、记住什么信息、是否启动子 agent，人工维护 Harness 结构的环节被逐一淘汰。',
          source: 'https://www.163.com/dy/article/L561C9NN0556703U.html',
        },
        {
          text: '效率飞轮已经在转动：「更强模型→更高效率→更多算力→更强模型」——推理速度三个月提升约 60%、服务价格下调约 80% 是飞轮的直接证据。',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          text: '网易纪要（作者解读）：大家等待的「AI 开始自我改进」可能不会有明确时间点——它已经在一点点发生。',
          source: 'https://www.163.com/dy/article/L561C9NN0556703U.html',
        },
      ],
    },
    {
      badge: '04',
      title: 'Agent 要云化',
      en: 'Beyond the Laptop',
      tagline: '模型没有人的限制，下一代 Harness 天然走向云端',
      cover: {
        src: '/outline/agent-cloud-editorial.png',
        alt: '笔记本作为入口连接到大规模云端 Agent 并行工作区的编辑部手绘插画',
      },
      detail: [
        '问题：Tibo 此前发帖称「Codex 在两到三个月后会显得很原始……下一代模型需要的，不只是你的笔记本电脑」。他的理由是：笔记本电脑是为人类设计的——它要容纳的是你能产出的工作量、你的打字和思考速度、你需要同时打开多少应用，这些都是人类的限制。而模型没有同样的限制：它将来也许能同时处理 100 个打开的应用程序，并且完全没问题。从资源访问的角度看，未来模型需要的资源会超过一台笔记本电脑所能提供的。',
        '做法：让 Agent 走向云端，并用并发补偿速度。模型可以一边探索、一边写测试、同时编译并验证一个新假设，不断转移瓶颈的位置。今天重度用户同时启动 10 到 15 个 Agent，本质上就是在用并发弥补模型还不够快——代价是人要不断切换上下文，自己反而成了「AI 项目经理」。',
        '终局：未来你在电脑上看到的可能只是一个入口，真正工作的是背后一整套随时为你服务的云端计算系统。而当 Ultra Fast 把响应速度压到接近人类思考速度，工作流会重新回到实时交互与「心流」——同时开十几个 Agent 来回切换的工作方式，Tibo 说「我其实并不想再回去了」。',
      ],
      images: [
        {
          src: '/outline/qbitai-beyond-laptop-post.png',
          caption:
            '量子位纪要引述 Tibo 的原帖截图：「Codex 在两到三个月后会显得很原始……下一代模型需要的，不只是你的笔记本电脑」——问题段的判断由这条帖子展开',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          src: '/outline/qbitai-laptop-limits.png',
          caption:
            '量子位纪要原文截图：笔记本是按人类的工作量、打字与思考速度设计的，而模型没有这些限制、未来可同时处理 100 个应用，所需资源「会超过一台笔记本电脑所能提供的资源」——它支撑问题段的归因：瓶颈在端侧设备而非模型',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
      ],
      points: [
        {
          text: 'Tibo 的判断：「从资源访问的角度看，未来的模型需要的资源会超过一台笔记本电脑所能提供的资源。」',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          text: '他以并发补偿速度：模型可以一边探索、一边写测试、同时编译并验证新假设，不断转移瓶颈位置。',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          text: '网易纪要（作者解读）：电脑上看到的未来可能只是一个入口，真正工作的是背后一整套云端计算系统。',
          source: 'https://www.163.com/dy/article/L561C9NN0556703U.html',
        },
      ],
    },
  ],
}
