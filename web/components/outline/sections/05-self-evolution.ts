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
  title: 'Codex 的 AGI 方案',
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
      detail:
        'Tibo 认为，ChatGPT 与 Codex 的底层将是同一套技术：同一个 Harness、同一种思路。他描述的终局是一个高度个人化的智能体——它会根据每个人的任务、能力和习惯持续调整自己，用户不需要先去选择「程序员界面」或「非技术界面」。',
      images: [
        {
          src: '/outline/qbitai-one-harness-quote.png',
          caption:
            '量子位纪要「ChatGPT 与 Codex 的融合」一节原文：Tibo 直接表述「它们的底层会是同一套技术：同一个 harness、同一种思路」，界面应随用户需求自动调整',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          src: '/outline/netease-personal-agi-conclusion.png',
          caption:
            '网易纪要的开篇结论：Codex 并入 ChatGPT 只是第一步，终点是同一个长期理解用户的「个人通用智能（Personal AGI）」',
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
      title: 'Skill 会被淘汰',
      en: 'Skills Are a Transient Form',
      tagline: '手动维护的 Skills / Memory / Sub-agent 只是中间形态',
      cover: {
        src: '/outline/skills-invisible-editorial.png',
        alt: '外部 Skills、记忆与子 Agent 被吸收进 Harness 并转化为内部能力，用户无需管理的编辑部手绘插画',
      },
      detail:
        'Tibo 直言：管理 skill 文件长期维护困难，记忆不总可靠，子智能体还要费心组网——这些都在打破「它是完整伙伴」的体验。他认为模型应当自己决定调用什么技能、记住什么信息、是否启动其他 Agent，而不是让人去管理 Agent 的底层结构。',
      images: [
        {
          src: '/outline/qbitai-skill-memory-subagent.png',
          caption:
            '量子位纪要原文：Tibo 逐一数落手动维护的痛点——「你得管理 skill 文件」「记忆也是个问题」「有子智能体就得操心子智能体」，这些环节都会打破「完整伙伴」的幻觉',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          src: '/outline/netease-skills-early-stage.png',
          caption:
            '网易纪要对 Tibo 判断的转述：Skills、Memory、Sub-agent「都还是很早期的东西」，理想 Agent 应自己决定调用什么技能、记住什么、是否启动其他 Agent',
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
      en: 'Early Recursive Self-Improvement',
      tagline: '最强模型优化推理栈与 CUDA 内核，被视为 RSI 早期形态',
      cover: {
        src: '/outline/harness-self-evolution-editorial.png',
        alt: 'Harness 经历执行、观察、改写自身与验证后再次执行的闭环自进化编辑部手绘插画',
      },
      detail:
        '主持人追问「这算不算递归式自我改进」时，Tibo 的回答基本肯定。但他描述的现实并不戏剧化：不是模型直接研究下一代模型，而是最强模型先优化 CUDA 内核、推理栈与服务基础设施，让系统更快更便宜，从而支撑更多工作，形成效率飞轮。',
      images: [
        {
          src: '/outline/qbitai-model-optimizes-infra.png',
          caption:
            '量子位纪要「AI 效率与算力」一节原文：Sol 优化 Luna 效率后价格下调 80%，整体推理速度比三个月前快约 60%——模型正在反过来优化运行自己的技术栈',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          src: '/outline/netease-rsi-conclusion.png',
          caption:
            '网易纪要结论第 4、5 条：推理速度三个月提升约 60%，且「模型已经开始反过来优化自己的推理基础设施」，Tibo 认为这已算递归自我改进的早期形态',
          source: 'https://www.163.com/dy/article/L561C9NN0556703U.html',
        },
      ],
      points: [
        {
          text: 'Tibo 提到模型 Sol 曾参与优化 Luna 的服务架构，随后 Luna 价格下调约 80%；模型也在优化推理系统、CUDA 内核与云端 Agent 等环节。',
          source: 'https://www.163.com/dy/article/L561C9NN0556703U.html',
        },
        {
          text: '量子位纪要（作者概括）：OpenAI 已在实际使用「递归式自我改进」，形成「更强模型→更高效率→更多算力→更强模型」的飞轮。',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          text: 'Tibo 称整体推理速度约比三个月前快了 60%，团队正逐一攻克技术栈各部分，「最强大的模型是让一个很小的团队也能完成这些工作的关键」。',
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
      detail:
        'Tibo 此前发帖称「Codex 在两到三个月后会显得很原始……下一代模型需要的不只是你的笔记本电脑」。他的理由是：笔记本电脑是为人类的工作量、打字与思考速度设计的，而模型没有这些限制——未来可能同时处理 100 个应用，所需资源必然超出一台笔记本。',
      images: [
        {
          src: '/outline/qbitai-beyond-laptop-post.png',
          caption:
            '量子位纪要引述 Tibo 的原帖：「Codex 在两到三个月后会显得很原始……下一代模型需要的，不只是你的笔记本电脑」——笔记本成为瓶颈的判断由此展开',
          source: 'https://www.qbitai.com/2026/08/478996.html',
        },
        {
          src: '/outline/qbitai-laptop-limits.png',
          caption:
            '量子位纪要原文：笔记本是按人类的工作量、打字与思考速度设计的，模型没有这些限制，未来所需资源「会超过一台笔记本电脑所能提供的资源」',
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
