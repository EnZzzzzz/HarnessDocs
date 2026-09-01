import Image from 'next/image'

import { ChartEvolutionGallery } from './chart-evolution-gallery'
import { PointCards } from './point-cards'

export type Point = {
  zh: string
  en: string
  desc: string
  /** 提供时卡片可点击，打开 Q&A 详解弹层（见 point-cards.tsx） */
  detail?: {
    intro: string
    source: string
    qa: { q: string; a: string[] }[]
  }
}

export type Section = {
  id: string
  eyebrow: string
  title: string
  intro: string
  points: Point[]
  /** 要点详解弹层左上角的小标题，如「WikiSkill · 概念详解」 */
  detailEyebrow?: string
  /** 省略时右侧渲染虚线占位框，待后续补图 */
  image?: {
    src: string
    alt: string
    caption: string
  }
  images?: {
    src: string
    alt: string
    caption: string
  }[]
}

const SECTIONS: Section[] = [
  {
    id: 'se-what',
    eyebrow: 'Self-Evolution · 01',
    title: 'Agent 的自进化，解决的是 T+1 的问题',
    intro:
      '今天绝大多数 Agent 干了一万次活以后，和第一次干活的时候能力几乎没有区别——昨天踩过的坑今天继续踩，昨天走过的弯路今天继续走。',
    points: [
      {
        zh: '传统 Agent：任务结束就结束了',
        en: 'Plan → Tool → Action',
        desc: '拿到任务以后做 planning、调工具、执行 action，拿到结果，这个任务就结束了。',
      },
      {
        zh: '自进化多出的一圈闭环',
        en: 'Feedback → Reflection → Update',
        desc: '拿到结果以后还有 feedback 和反思，再获取经验，最后做 update——更新的就是 Agent 本身，然后再去做下一次执行。',
      },
      {
        zh: '最关键的是最后的 Update',
        en: 'The Key Step',
        desc: '如果只有反思，其实还不能叫自进化——经验必须真正沉淀回 Agent。',
      },
    ],
    image: {
      src: '/harness/self-evolution-loop.png',
      alt: '传统 Agent 的任务闭环外增加反馈、反思和永久更新，经验被重新安装回 Agent',
      caption:
        '内圈完成规划、工具调用与执行，只能得到这一次的结果；外圈继续检查反馈、追溯原因并提炼经验。真正决定是否发生自进化的，是最后把经验模块永久写回 Agent，让下一次执行从更新后的状态出发。',
    },
  },
  {
    id: 'se-vs-reflection',
    eyebrow: 'Self-Evolution · 02',
    title: '自进化 vs 人工进化',
    intro:
      '自进化和人工进化的区别非常重要——这两个东西，根本就不是一个层级。',
    points: [
      {
        zh: '异步沉淀',
        en: 'Async Distillation',
        desc: '经验的沉淀不发生在任务执行期间，而是在任务结束后由后台流程异步完成——复盘、蒸馏、写回，不阻塞下一次执行。',
      },
      {
        zh: 'Harness 自驱',
        en: 'Harness-Driven',
        desc: '驱动进化的不是工程师手动改 prompt、调参数，而是 Harness 自己收集反馈、提炼经验并写回——人是把关者，不是流水线上的工人。',
      },
      {
        zh: '作用于「T+1」任务',
        en: 'Effective at T+1',
        desc: '进化的收益不体现在当前任务，而是下一次同类任务——同样的坑，T+1 时刻的 Agent 不会再踩第二次。',
      },
    ],
    image: {
      src: '/harness/reflection-vs-self-evolution.png',
      alt: '人工进化与自进化两条时间线对比：异步沉淀、Harness 自驱，并作用于 T+1 任务',
      caption:
        '上方时间线依赖工程师人工排查日志、修改配置并安装补丁；下方时间线由 Harness 在任务结束后异步收集反馈、蒸馏经验并写回可复用资产，让更新后的能力在 T+1 任务中生效。',
    },
  },
  {
    id: 'se-reward-driven',
    eyebrow: 'Self-Evolution · 03',
    title: '奖励信号驱动',
    intro:
      '人写的 Skill 不一定是最适合 AI 的——更可行的思路是目标导向加专家评审：AI 负责写，人负责评，奖励信号驱动 Skill 一轮轮迭代到达标。',
    points: [
      {
        zh: '专家角色：从 Skill 编写者到评审者',
        en: 'Expert as Reviewer',
        desc: '过去专家知识靠人拆解场景、总结成 Skill 的知识体系，里面藏着大量人工。现在构建好目标测试集，由 AI 去编写 Skill，人只给出评审意见，AI 根据意见反复调整 Skill，直到指标满足要求——人不再需要关心 Skill 怎么写。',
      },
      {
        zh: 'Harness 角色：识别奖励信号并自我迭代',
        en: 'Detect & Self-Iterate',
        desc: 'Harness 要从历史轨迹里识别正反馈与负反馈：踩坑的过程——报错、参数问题、框架选型失误——都是负反馈；还有来自人工评审的意见，比如风格要改成什么样、按钮要放在什么位置，同样是驱动迭代的奖励信号。',
      },
    ],
    image: {
      src: '/harness/reward-driven-ai-expert-loop.png',
      alt: 'AI 编写 Skill，经测试集评估和专家评审后吸收反馈并持续迭代至达标',
      caption:
        'AI 负责把目标转成 Skill，并在测试集上反复验证；专家不再亲自编写，而是评审结果、给出反馈。Harness 将这些正负奖励信号送回下一轮编写，直到 Skill 达到目标指标。',
    },
  },
  {
    id: 'se-expert-driven',
    eyebrow: 'Self-Evolution · 04',
    title: 'Harness 和专家知识层是两个正交维度，需要共同进化',
    intro:
      '我们常有的一个误区，是只盯着 Harness 的进化：这个不够好用就换一个，明天出现更好的就再换。Harness 确实要进化，但它还有一个正交的维度——专家知识层同样需要进化：企业的内部规范一升级、行业的专家标准一演进，它也要跟着不停地迭代。',
    points: [
      {
        zh: 'Skill 会老化，需要不停维护',
        en: 'Continuous Maintenance',
        desc: '企业规范一更新，存量 Skill 就过时了。被动模式下只能靠人主动发现结果不对、再手动去改规范、改 Skill——滞后、易漏，改完也只覆盖被注意到的那几处。',
      },
      {
        zh: 'Harness 主动沉淀和管理 Skill',
        en: 'Proactive Curation',
        desc: '有些专家非常懂领域知识，却不一定清楚怎么写好一个 Skill。交给 Harness 主动沉淀和管理：头一次使用时专家发现结果不符合新规范、把问题指出来——模型自己把这次反馈总结成规则，主动触发 Skill 的更新。沉淀只需发生一次，之后的每一次执行都直接生效。',
      },
    ],
    image: {
      src: '/harness/harness-proactive-knowledge-distillation.png',
      alt: 'Harness 主动收集专家反馈和任务轨迹，自动蒸馏并写回 Skill v2，供后续多个 Agent 复用',
      caption:
        '专家只需指出一次问题，Harness 就会主动捕获反馈与任务轨迹，在后台蒸馏成规则并写回新版 Skill；更新后的知识资产随即被后续任务和更多 Agent 共同复用。',
    },
  },
  {
    id: 'se-layers',
    eyebrow: 'Self-Evolution · 05',
    title: 'Agent 到底在进化什么？',
    intro:
      '不是让 AI 自己去训练自己——模型参数的更新只是其中最重的一种。更现实的 Agent 自进化，至少可以分成五层。',
    points: [
      {
        zh: 'Memory：经验的积累',
        en: 'Experience Accumulation',
        desc: '记住经验：A 数据源总是拿不到数据、B 数据源稳定很多，下一次优先调的就是 B。',
      },
      {
        zh: 'Policy：规划的策略',
        en: 'Planning Strategy',
        desc: '不只是记住事情，还要知道怎么修改自己的方法：10 步的任务复盘后发现几步完全没必要，下次直接缩减到 7 步。',
      },
      {
        zh: 'Skill：被固化的成功经验',
        en: 'Skill',
        desc: '把一整套成功路径封装成 Skill：财报分析沉淀为 Financial Analyze Skill，下次遇到类似任务直接调用，不用重新探索。',
      },
      {
        zh: 'Tool：自己去写工具',
        en: 'Tool Creation',
        desc: '现有工具不够用了，就自己写一段代码、测试、debug，能稳定解决一类问题后，注册成一个新的 tool 放进工具箱。',
      },
      {
        zh: 'Model：更新模型参数',
        en: 'SFT / RL',
        desc: '几十万条轨迹沉淀成 dataset，再通过 SFT/RL 更新模型参数——底层模型本身都发生变化，这是最重的一层。',
      },
    ],
    image: {
      src: '/harness/self-evolution-layers.png',
      alt: 'Agent 自进化的五层结构，从经验记忆、策略优化、Skill 固化、工具创造到模型更新',
      caption:
        '五层由上至下逐渐深入：记忆层保留有效经验，策略层缩短行动路径，Skill 层封装成功工作流，Tool 层创造并注册新工具，最底层则把大量成败轨迹转成训练数据，进一步更新模型参数。',
    },
  },
  {
    id: 'se-wikiskill',
    eyebrow: 'Self-Evolution · 06',
    title: 'Google WikiSkill：给经验建一座「维基百科」',
    intro:
      '现有技能进化方法改完技能就把分析过程丢了——上次为什么失败、哪个改法被拒，全都散落在历史记录里。WikiSkill（Google Research / Virginia Tech，2026-08-27 发布，arXiv:2608.27454）把 Agent 经验编译成持续生长的知识库，让技能进化站在知识之上，而不是每轮从零开始。',
    points: [
      {
        zh: '三层架构：原始记录 → 知识 → 技能',
        en: 'Raw → Wiki → Skills',
        desc: 'Raw 层保存完整执行轨迹，只进不出、永不修改；Wiki 层把零散轨迹编译成结构化知识（patterns/、logs.md、skill-impact.md 账本）；Skills 层是当前生效的技能，每个技能附 PURPOSE.md 记录设计意图。',
        detail: {
          intro:
            'WikiSkill 的回答不是一个新算法，而是一套架构设计：把「经验」和「知识」和「技能」分成三层，各管各的。',
          source: '内容摘录自 docs/wikiskill/WikiSkill论文解读.md「二、怎么解决的？」',
          qa: [
            {
              q: '第一层：原始记录层（Raw Layer）',
              a: [
                '保存每次执行的完整轨迹——Agent 的推理过程、调了哪些工具、返回了什么、最后答案是什么。',
                '这一层只进不出、永不修改，因为后面所有分析都要回溯「当时到底发生了什么」。原始数据要是丢了，进化就成了无源之水。',
              ],
            },
            {
              q: '第二层：知识层（Wiki Layer）',
              a: [
                '这是整篇论文的核心。它把零散的执行轨迹「编译」成结构化的知识，并且跨轮次持续累积。里面有三样东西：',
                'patterns/：每个模式一个文件，记录一个具体的失败原因或成功策略，附可操作的修复方案；',
                'logs.md：进化日志，按轮次记录发现了什么、改了什么；',
                'skill-impact.md：技能改动的「账本」——哪些改动被接受、哪些被拒绝，附完整 diff。',
              ],
            },
            {
              q: '第三层：技能层（Skills Layer）',
              a: [
                '当前生效的技能集合，Agent 干活时直接读。每个技能除了正文 SKILL.md，还有一份 PURPOSE.md，记录「这个技能是为了解决 Wiki 里的哪个问题而建的」。',
                '这样将来要改技能时，能回溯到当初的设计意图，而不是盲目打补丁。',
              ],
            },
          ],
        },
      },
      {
        zh: '知识永不回滚，与技能分离',
        en: 'Wiki Never Rolls Back',
        desc: '技能改坏了可以回滚技能，但 Wiki 里的积累一条不删——被否决过的改法记在账本上，下一轮不会再被重复提出。知识回答「我们知道什么」，技能回答「该怎么做」。',
        detail: {
          intro:
            'Wiki 层有两个关键设计，决定了它和普通「备忘录」不一样：Wiki 永不回滚，知识和技能分离。',
          source: '内容摘录自 docs/wikiskill/WikiSkill论文解读.md「一、问题是什么？」与「二、怎么解决的？」',
          qa: [
            {
              q: '它要解决的老毛病是什么？',
              a: [
                '现有的技能进化方法（比如 EvoSkill、Trace2Skill、SkillOpt）都是同一个套路：分析执行记录 → 直接改技能 → 验证一下 → 不行就回滚。',
                '问题来了：改技能时的那些分析过程——「上次为什么失败」、「这个改法为什么被拒」、「哪个错误反复出现」——全都散落在历史记录里，用完就丢了。',
                '打个比方：这就像一个工程师每次修 bug 都从头排查，从不写复盘文档。修完这个 bug，他对系统的理解就清零了。下一次改代码，他可能又把上次被否决的方案重新提一遍——因为他根本不记得上次否决过。',
              ],
            },
            {
              q: '关键设计一：Wiki 永不回滚',
              a: [
                '技能改坏了可以回滚技能，但知识库里的积累一条不删。',
                '这样下一轮就不会再提「上次已经被拒过的改法」——skill-impact.md 这本账记着哪些改动被接受、哪些被拒绝，附完整 diff。',
              ],
            },
            {
              q: '关键设计二：知识和技能分离',
              a: [
                '知识回答「我们知道什么」，技能回答「我们该怎么做」。',
                '以前的方法把两者混在一起，改技能时把背后的推理上下文也改没了。',
              ],
            },
          ],
        },
      },
      {
        zh: '四步循环，角色分工',
        en: 'Run → Distill → Propose → Gate',
        desc: 'Inference Agent 带技能跑任务，但不许看 Wiki——否则直接查答案，轨迹失去分析价值；Wiki Maintainer 对成败轨迹做根因分析、更新知识；Skill Proposer 基于 Wiki 提案；候选技能在验证集跑分，提分接受、掉分回滚。',
        detail: {
          intro:
            '三层之间怎么转起来？每一轮迭代走四步：干活、沉淀、提案、把关。',
          source: '内容摘录自 docs/wikiskill/WikiSkill论文解读.md「二、怎么解决的？」',
          qa: [
            {
              q: '第一步：干活',
              a: [
                'Inference Agent 带着当前技能在训练任务上跑，轨迹存进原始记录层。',
                '注意，这时它不许看 Wiki——否则它直接查答案，轨迹就失去了参考价值。',
              ],
            },
            {
              q: '第二步：沉淀',
              a: [
                'Wiki Maintainer 分析采样的成功和失败轨迹，做根因分析，更新 Wiki 里的模式目录和日志。',
              ],
            },
            {
              q: '第三步：提案',
              a: [
                'Skill Proposer 读 Wiki 索引、查改动账本、按需翻具体轨迹，提出一次技能创建或修改。',
              ],
            },
            {
              q: '第四步：把关',
              a: [
                '候选技能在验证集上跑分，提分就接受，掉分就回滚技能——但 Wiki 不受影响。',
              ],
            },
            {
              q: '这套循环的本质是什么？',
              a: [
                '说白了，整个机制就是让经验第一次有了清晰的「编译过程」：从具体轨迹中提炼模式，再从模式中生成操作规则。',
                '没有 Wiki 这一层，提案者每轮都在从零分析原始轨迹；有了这一层，它站在越积越厚的知识之上做决策。',
              ],
            },
          ],
        },
      },
      {
        zh: '越强的模型涨得越多，Wiki 层是关键',
        en: 'Evidence',
        desc: '五个基准平均分：Qwen-3.6-27B 从 39.4 涨到 63.3；9B 模型加技能（47.4）反超无技能的 27B（39.4）。消融拿掉 Wiki 层，平均分从 63.7% 跌回 48.7%——知识积累才是涨分来源。',
        detail: {
          intro:
            '论文在 5 个基准（数学推理 LiveMath、网页搜索问答 SealQA、表格操作 SpreadsheetBench、长文档问答 OfficeQA、具身交互 ALFWorld）、5 个模型上评测：技能在训练集上进化、验证集上取舍、最终只在没见过的测试集上报分；所有方法从空技能集开始，完整流程独立跑 3 次取平均，显著性用 paired bootstrap 检验（p<0.05）。主要结论有三个。',
          source: '内容摘录自 docs/wikiskill/WikiSkill论文解读.md「三、指标提升了多少？」',
          qa: [
            {
              q: '结论一：全面涨分，越强的模型涨得越多',
              a: [
                '对比无技能基线，五个基准的平均分：Qwen-3.5-4B 从 26.2 涨到 38.5（+12.3），Qwen-3.5-9B 从 29.9 涨到 47.4（+17.5），Qwen-3.6-27B 从 39.4 涨到 63.3（+23.9），Gemma-4-31B 从 41.3 涨到 54.9，Gemini-3.5-Flash 从 49.5 涨到 68.1。对比最强的已有技能进化方法，也分别高出 3.3 到 12.0 分。',
                '这里有个值得停一下想一想的发现：技能进化和模型规模是互补关系，而不是替代关系——越大的模型，越能从技能中榨出价值。但同时，技能也能弥补规模差距：9B 模型加上 WikiSkill 后平均 47.4%，反超了不用技能的 27B 模型（39.4%）。',
              ],
            },
            {
              q: '结论二：技能可以跨模型迁移',
              a: [
                '甚至「别人进化的技能比自己进化的更好用」：Qwen-3.5-9B 用 27B 进化出来的技能，在 ALFWorld 上达到 70.2%，比用它自己进化的技能（63.4%）还高；连 4B 小模型进化的技能都能帮到 Gemma-4-31B。',
                '这说明「从经验中发现好策略」和「把策略执行好」是两种能力，可以跨模型分工。当然也有反面教材：4B 的技能里有大量「低配绕行方案」，塞给 Gemini-3.5-Flash 后反而把它的表格操作从 50.5% 拖到了 18.1%——技能里写的是通用流程还是模型专属补丁，决定了迁移的成败。',
              ],
            },
            {
              q: '结论三：消融证明 Wiki 层是涨分的关键',
              a: [
                '拿掉 Wiki、让提案者回到「每次从零分析」的老路，平均分从 63.7% 掉到 48.7%，回落 15 分，基本跌回传统方法的水平。',
                '反过来，训练时如果让干活的 Agent 也能看 Wiki，成绩反而从 63.7% 降到 60.9%——因为它直接从 Wiki 查答案，轨迹变得没有分析价值了。这两个方向的消融，把「知识该给谁看、不该给谁看」的边界也讲清楚了。',
              ],
            },
          ],
        },
      },
    ],
    images: [
      {
        src: '/outline/wikiskill-three-layer-architecture.png',
        alt: '执行轨迹经过知识层整理，最终被蒸馏成可直接调用的技能模块',
        caption:
          '三层不是三个副本，而是一条逐步压缩信息的编译链：底层保留不可变的完整轨迹，中层把分散证据组织为模式、日志与改动账本，顶层只留下能在任务中直接执行的技能。越往上越精炼，越往下越便于追溯。',
      },
      {
        src: '/outline/wikiskill-persistent-wiki.png',
        alt: '稳定的知识档案持续保留，上方技能模块可以替换或回滚',
        caption:
          '知识库像只追加的档案室，既保存有效规律，也记住被验证集否决的方案；技能则是可拆换的执行模块。候选技能表现变差时，只回滚上层模块，底层知识与失败原因仍然保留，避免下一轮重走旧路。',
      },
      {
        src: '/outline/wikiskill-four-stage-loop.png',
        alt: '任务执行、知识蒸馏、技能提案与验证把关组成四阶段闭环',
        caption:
          '四个角色彼此隔离：执行者只带当前技能跑任务，维护者从轨迹中提炼知识，提案者据此只生成一次技能改动，验证门再决定接受或回滚。隔离 Wiki 与执行者，是为了让采集到的轨迹仍能反映真实能力。',
      },
      {
        src: '/outline/wikiskill-evidence.png',
        alt: '不同规模模型借助共享知识层获得提升，移除知识层后表现明显下降',
        caption:
          '持续知识对不同规模模型都有放大作用，并且强模型能把技能中的策略执行得更充分；但拿掉 Wiki 层后，平均分会从 63.7% 降到 48.7%。这说明提升并非只来自多写几条提示，而来自跨轮累积、可追溯的知识。',
      },
    ],
    detailEyebrow: 'WikiSkill · 概念详解',
  },
  {
    id: 'se-hermes',
    eyebrow: 'Self-Evolution · 07',
    title: 'Hermes：经验是怎么沉淀的？',
    intro:
      '自进化不是纸面概念——Nous Research 的开源 Agent 系统 Hermes 已经把经验沉淀做成了 Learning Loop，每次会话的经验都在后台被自动蒸馏成可复用资产。Continual-Harness 论文（arXiv:2605.09998）把这类闭环形式化，并把 Hermes 列为 assistant 任务的典型参照。',
    points: [
      {
        zh: '四步学习闭环，持续转动',
        en: 'Observe → Distill → Reuse → Refine',
        desc: '记录每轮交互的轨迹作为原料，回复结束后后台复盘蒸馏经验，沉淀物注入后续会话直接复用，发现更优路径时回头 patch 旧条目——而不是只增不改。',
        detail: {
          intro: '真正的问题不是上下文够不够长，而是：一次任务里获得的经验，怎样变成下一次任务可以直接复用的资产？Hermes 给出的答案，是一条持续运转的经验闭环。',
          source: '内容摘录自 docs/continual-harness/Hermes记忆沉淀机制调研.md「一、问题不是记不住对话，而是不会积累经验」与「二、四步闭环是怎样转起来的？」',
          qa: [
            { q: '第一步：观察（Observe）', a: ['Hermes 保存本轮交互和执行轨迹，把它们当作复盘原料。这里还没有急着下结论，就像先保留会议记录和操作日志。'] },
            { q: '第二步：提炼（Distill）', a: ['每轮回复结束后，后台会启动一个异步复盘 Agent（Async Review Agent）。它从三个方向检查刚才发生了什么：有没有值得记住的信息、有没有能固化成技能的流程、执行过程中有没有反复出现的错误。'] },
            { q: '第三步：复用（Reuse）', a: ['提炼出的内容会进入后续会话。不过 Hermes 不会把所有材料一次性塞进上下文，而是按需加载。这样既保留经验，又不会让上下文被历史包袱撑满。'] },
            { q: '第四步：修订（Refine）', a: ['当后续任务发现更好的做法时，Hermes 会修改已有条目。这里的关键动作是 patch：旧经验不是只能追加、不能回头改的档案，而是一份持续维护的工作手册。'] },
            { q: '这套闭环真正改变了什么？', a: ['打个比方，一次会话就像一天的工作。Hermes 不只是保存当天的聊天记录，还会在“下班后”做复盘：哪些是应该长期记住的事实，哪些是以后可以照着执行的流程？', '这套机制最值得关注的地方，不是“它有 memory”，而是它让经验形成了一个有容量约束、能复用、也能持续修订的生命周期。'] },
          ],
        },
      },
      {
        zh: '双资产制：Skill + Memory',
        en: 'Skill & Memory',
        desc: '程序性经验（怎么做）沉淀为 Skill，agent 通过 skill_manage 工具自建、自改、自删；陈述性经验（是什么）沉淀为有硬性容量上限的 MEMORY.md / USER.md（2200 / 1375 字符），会话开始以冻结快照注入系统提示。',
        detail: {
          intro: '问题来了：提炼出的内容都放在一起，不就又会变成一个越来越乱的大文件吗？Hermes 的做法是把“知道什么”和“怎么做”分开保存。',
          source: '内容摘录自 docs/continual-harness/Hermes记忆沉淀机制调研.md「三、为什么要分成 Memory 和 Skill？」',
          qa: [
            { q: 'Memory 保存什么？', a: ['Memory 是陈述性记忆（declarative memory），负责保存“是什么”。比如用户的长期偏好、项目约束、已经确认的事实。', '它更像一本随身通讯录或备忘录：内容短、调用频繁，适合直接放进新会话。'] },
            { q: 'Skill 保存什么？', a: ['Skill 是程序性记忆（procedural memory），负责保存“怎么做”。它更像一份操作手册：遇到什么情况该启用、具体步骤是什么、容易踩哪些坑、最后如何验证。', 'Hermes 的标准 SKILL.md 通常包含 When to Use、Procedure、Pitfalls 和 Verification 等部分。'] },
            { q: 'Agent 能自己维护 Skill 吗？', a: ['Agent 可以通过 skill_manage 自己创建、修改和删除技能，对应 create、patch、edit、delete、write_file、remove_file 等操作。', '官方优先推荐 patch，因为它只改必要片段，比整份重写更节省 token。'] },
            { q: '为什么这项分工很重要？', a: ['如果把“用户喜欢简短回复”和“怎样分析财报”都塞进同一块记忆里，文件很快就会既冗长又难检索。', '拆开以后，Memory 保留短事实，Skill 承载长流程，各自按自己的方式生长。'] },
          ],
        },
      },
      {
        zh: '写满报错，倒逼精简',
        en: 'Hard Capacity Limit',
        desc: '记忆不自动压缩——写入超限就报错，并把现有条目清单还给 agent，由它当场合并精简再重试。上限倒逼资产保持信息密度，冻结快照还保住了 LLM 的前缀缓存。',
        detail: {
          intro: '无限记忆听起来很美，但对 Agent 来说，越多不一定越好。每次会话都加载一大堆旧信息，不仅花 token，还会让真正重要的内容淹没在噪声里。',
          source: '内容摘录自 docs/continual-harness/Hermes记忆沉淀机制调研.md「四、记忆写满了怎么办？」',
          qa: [
            { q: 'Hermes 给记忆留了多少空间？', a: ['MEMORY.md 最多 2,200 个字符，约 800 tokens，通常容纳 8–15 条；USER.md 最多 1,375 个字符，约 500 tokens，通常容纳 5–10 条。'] },
            { q: '写满以后，系统会自动压缩吗？', a: ['不会。写入超限时，memory 工具会直接报错，并返回当前条目清单 current_entries。', 'Agent 必须在同一轮里决定：哪些重叠内容可以用 replace 合并，哪些过期内容应该用 remove 删除，然后重新写入。官方建议占用超过 80% 时就主动整理。'] },
            { q: '硬上限为什么反而是质量机制？', a: ['这像一个空间有限的登机箱：装不下时，不能再塞一个新袋子了事，只能重新判断什么值得带走。', '容量上限由此变成了一种质量机制，倒逼 Agent 提高每条记忆的信息密度。'] },
            { q: '冻结快照解决了什么问题？', a: ['会话开始时，记忆以冻结快照（frozen snapshot）的方式进入系统提示。会话过程中落盘文件可以更新，但当前系统提示不变；新内容到下一次会话才会出现。', '这样能保住大模型的前缀缓存，避免每次写记忆都让整段系统提示失效。'] },
          ],
        },
      },
      {
        zh: '后台异步复盘，前台无感',
        en: 'Async Review Agent',
        desc: 'Distill 的具体形态：每轮回复结束后 fork 一个 review agent，从记忆、技能、执行过程三个维度复盘。换便宜模型复盘成本降 3–5×，而 memory 捕获完全一致——用户只看到一行「💾 Memory updated」。',
        detail: {
          intro: '后台复盘不是免费的。Hermes 默认 fork 一个 self-improvement review 分支，利用主模型已有的提示缓存回看本轮内容。用户不必等待这项工作完成，界面通常只会出现一行“💾 Memory updated”。',
          source: '内容摘录自 docs/continual-harness/Hermes记忆沉淀机制调研.md「五、“下班后复盘”会不会太贵？」',
          qa: [
            { q: '为什么复盘不会阻塞用户？', a: ['复盘发生在每轮回复结束以后，由后台分支检查记忆、技能和执行过程。用户侧不必等待完整复盘，只会看到简短的记忆更新提示。'] },
            { q: '主模型太贵怎么办？', a: ['可以通过 auxiliary.background_review 指定更便宜的模型。此时后台分支读取一份压缩摘要：近期轮次保留原文，更早的轮次保留摘要。'] },
            { q: '换便宜模型会损失多少效果？', a: ['官方测试中，换用便宜模型后，复盘成本降低约 3–5 倍；Memory 的捕获结果完全一致，Skill 的捕获结果近乎一致。', '这个结果说明，经验提炼未必需要每次都调用最贵的主模型。'] },
            { q: '自动写入会不会把错误长期保存？', a: ['会有这个风险。Hermes 因此提供 write_approval，可以先把写入内容放进待审批区，再通过 /memory pending 或 /skills pending 查看。', '对高风险场景来说，“先暂存、后确认”比完全自动落盘更稳妥。'] },
          ],
        },
      },
    ],
    image: {
      src: '/outline/hermes-memory-files.png',
      alt: 'Hermes 从本轮周报纠正中提取“结论先写、数据带环比”的经验，经后台复盘写入 USER.md 与 MEMORY.md，并在下一次会话复用',
      caption:
        '一个直观例子：用户在本轮周报中纠正“结论先写、数据带环比”；回复结束后，后台 Review Agent 从对话轨迹中提炼稳定偏好，写入 USER.md / MEMORY.md。下一次会话开始时，这些记忆以冻结快照注入系统提示，Agent 无需再次提醒就会直接按新规则输出；后续发现更优做法，还能继续回写精炼。',
    },
    detailEyebrow: 'Hermes · 机制详解',
  },
]

/**
 * 「经验飞轮」单独一页，放在多种落地方式之后、数据飞轮之前。
 */
const FLYWHEEL_SECTION: Section = {
  id: 'se-flywheel',
  eyebrow: 'Self-Evolution · 08',
  title: '经验飞轮：越工作越聪明的 Agent',
  intro:
    '真正的 Agent 应该形成它的经验飞轮——这也是未来判断一个 Agent 聪不聪明的新标准。',
  points: [
    {
      zh: '一个内容 Agent 的进化',
      en: 'Example',
      desc: '第一周发现技术科普类平均点赞 500、AI 职场类 1500，于是调整选题；又发现带具体数字的标题点击率高 30%，就把这条规律写进自己的 Skill。一个月后，它和第一天拿到的那个 Agent 已经完全不一样了。',
    },
    {
      zh: '经验飞轮',
      en: 'Experience Flywheel',
      desc: '执行 → feedback → reflection → 经验 → 更新 → 更好的下一次执行，这样不断循环。',
    },
    {
      zh: '新的评价指标',
      en: 'A New Metric',
      desc: '不再只看一次任务完成得多好，而是看它做完 1000 次任务以后有没有比第一次更强——真正厉害的 Agent 不一定出厂时最聪明，而是在真实世界里工作越久越聪明。',
    },
  ],
  image: {
    src: '/harness/experience-flywheel.png',
    alt: '内容 Agent 在执行、反馈、反思、经验沉淀和更新构成的飞轮中持续增强',
    caption:
      '内容 Agent 每轮工作都会收集选题、标题与受众反馈，经过复盘后把有效规律固化成可复用经验，再写回下一轮执行。评价它是否聪明，不只看第一次交付，而要看大量真实任务之后是否形成了更稳定的策略与更强的结果。',
  },
}

function SeSection({ section }: { section: Section }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32"
    >
      <div className="grid items-start gap-y-8 md:grid-cols-2 md:gap-x-10 lg:gap-x-16">
        <header className="md:col-span-2">
          <p className="text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
            {section.eyebrow}
          </p>
          <h2
            id={`${section.id}-title`}
            className="mt-4 bg-gradient-to-br from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tighter text-transparent lg:text-5xl"
          >
            {section.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            {section.intro}
          </p>
        </header>

        {section.images ? (
          <ChartEvolutionGallery
            id={`${section.id}-figure`}
            points={section.points}
            images={section.images}
            detailEyebrow={section.detailEyebrow ?? `${section.title} · 概念详解`}
          />
        ) : (
          <>
            <PointCards
              points={section.points}
              detailEyebrow={section.detailEyebrow ?? `${section.title} · 概念详解`}
              detailImage={section.image}
            />

            <figure className="md:col-start-2 md:self-center">
              {section.image ? (
                <>
                  <div className="overflow-hidden rounded-3xl">
                    <Image
                      src={section.image.src}
                      alt={section.image.alt}
                      width={1536}
                      height={1024}
                      className="h-auto w-full"
                    />
                  </div>
                  <figcaption className="mt-3 px-1 text-left text-[11px] leading-5 text-slate-400">
                    {section.image.caption}
                  </figcaption>
                </>
              ) : (
                <div className="flex aspect-[3/2] items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white/40">
                  <span className="text-xs font-medium tracking-wide text-slate-400">
                    配图占位
                  </span>
                </div>
              )}
            </figure>
          </>
        )}
      </div>
    </section>
  )
}

/**
 * 「DesignHarness 的自增长要沉淀什么资产」：收尾页之后再加一页，
 * 复用 SeSection 版式，右侧先用占位框，待补配图。
 */
const DESIGN_HARNESS_ASSETS_SECTION: Section = {
  id: 'design-harness-assets',
  eyebrow: 'DesignHarness · Self-Growth',
  title: 'DesignHarness 的自增长要沉淀什么资产',
  intro:
    'DesignHarness 要在使用中越变越强，关键不在于模型本身，而在于两类资产被持续沉淀下来。',
  points: [
    {
      zh: '组件和配套的使用 Skill',
      en: 'Components + Usage Skills',
      desc: '沉淀可复用的设计组件，以及每个组件「怎么用、什么时候用」的配套 Skill，让下一次设计直接站在已有资产上。',
    },
    {
      zh: '自身设计师的真实使用轨迹',
      en: 'Real Usage Trajectories',
      desc: '记录设计师在真实工作中的挑选、调整与放弃过程，这些轨迹是后续复盘与自增长的原料。',
    },
  ],
  image: {
    src: '/harness/design-harness-assets.png',
    alt: '左侧成对沉淀设计组件与使用 Skill，右侧设计师在真实工作中选择、调整、采纳或放弃方案，使用轨迹持续回流到 DesignHarness',
    caption:
      'DesignHarness 的资产不是孤立的组件库：每个组件都要和「何时用、怎么用」的 Skill 成对沉淀；与此同时，设计师在真实任务里的选择、调整、比较与放弃被记录成轨迹，再回流到 Harness，持续修正下一版资产。',
  },
}

export function DesignHarnessAssetsSection() {
  return <SeSection section={DESIGN_HARNESS_ASSETS_SECTION} />
}

/**
 * 「以图表场景为例的 Harness 自进化」：四步闭环；点击左侧步骤卡，
 * 右侧切换对应的科技编辑部手绘插画。
 */
const CHART_EVOLUTION_SECTION: Section = {
  id: 'chart-evolution',
  eyebrow: 'DesignHarness · Chart Case',
  title: '以图表这个场景为例，可以怎么去做 Harness 的自进化',
  intro:
    '图表是最适合跑通自进化闭环的场景之一：组件有开源供给、好坏有设计师把关、反馈能直接变成资产。',
  points: [
    {
      zh: '批量爬取优秀 shadcn 组件',
      en: 'Crawl Components',
      desc: '批量爬取网上公开的、开源的、优秀的 shadcn 图表组件，作为组件库的初始供给。',
    },
    {
      zh: '做设计 Demo，高质量数据沉淀',
      en: 'Demo & Data',
      desc: '基于这些组件去做设计的 Demo，然后由设计师进行复合评审打分，沉淀出高质量数据。',
    },
    {
      zh: '自动总结经验，沉淀 Skill + 组件',
      en: 'Distill into Assets',
      desc: 'Harness 根据设计师的反馈自动总结经验，沉淀出对应的 Skill 和配套的 shadcn 组件。',
    },
    {
      zh: '打分轨迹做数据增广',
      en: 'Trajectory Augmentation',
      desc: '设计师打分的过程本身就是轨迹数据——把好的设计做数据增广，泛化到不同的 Query 上。',
    },
  ],
  images: [
    {
      src: '/harness/chart-evolution-01-crawl.png',
      alt: '采集装置从公开组件网络中筛选多种图表组件，并将优质组件整理进组件库',
      caption:
        '先从公开、开源的组件生态中广泛采集图表方案，经过初步检查后，把不同图表类型的优质组件整理成 Harness 的初始供给。',
    },
    {
      src: '/harness/chart-evolution-02-review.png',
      alt: '设计师对多个图表 Demo 按复合标准评分，采纳高质量方案并淘汰较弱方案',
      caption:
        '组件进入真实 Demo 后，由设计师从信息表达、视觉质量和场景适配等维度复合评审；被采纳与被淘汰的判断一起沉淀为高质量数据。',
    },
    {
      src: '/harness/chart-evolution-03-distill.png',
      alt: 'Harness 将设计师的批注与评分提炼成一一配对的图表组件和使用 Skill',
      caption:
        'Harness 消化设计师的评分与批注，把有效经验蒸馏成资产：每个经过验证的图表组件，都和说明其使用条件与方法的 Skill 成对输出。',
    },
    {
      src: '/harness/chart-evolution-04-augment.png',
      alt: '一条设计师评审轨迹分叉成多个不同查询下重新执行和验证的图表设计任务',
      caption:
        '把真实评分轨迹扩展到不同 Query，并重新执行、重新评审每条分支，得到更多可验证的成功路径，让 Harness 的能力泛化到新场景。',
    },
  ],
}

export function ChartEvolutionSection() {
  return <SeSection section={CHART_EVOLUTION_SECTION} />
}

const DATA_AUGMENTATION_SECTIONS: Section[] = [
  {
    id: 'trajectory-augmentation',
    eyebrow: 'Data Augmentation · 01',
    title: '轨迹数据可以增广，但要重新执行，而不是只改写文本',
    intro:
      '对 Agent 来说，一条轨迹不仅是自然语言记录，还包含状态、观察、动作、工具返回与最终结果。最可靠的增广，是让同一个任务产生多条真实可执行的路径。',
    points: [
      {
        zh: '同一任务，多次 Rollout',
        en: 'Multi-Rollout',
        desc: '改变采样温度、计划粒度与工具顺序，为同一 Query 生成多条候选轨迹；用真实环境执行后，只保留成功或高价值路径。',
      },
      {
        zh: '任务变体，重新走完整轨迹',
        en: 'Task Variation',
        desc: '替换实体、数据、约束、语言与难度，再让 Agent 从头执行。不能只改 Prompt 却复用旧动作，否则状态与工具反馈会失真。',
      },
      {
        zh: '故障注入，训练恢复能力',
        en: 'Failure & Recovery',
        desc: '主动制造超时、空结果、错误参数或页面变化，让 Agent 学会诊断、回退和修复，而不只会模仿理想路径。',
      },
      {
        zh: '从中间状态分叉',
        en: 'Prefix Branching',
        desc: '从同一轨迹前缀重新采样后续动作，形成成功、绕路与失败分支，可同时用于 SFT、偏好学习和过程奖励。',
      },
    ],
    image: {
      src: '/outline/trajectory-data-augmentation.png',
      alt: '同一任务分叉为多条经过工具和环境执行的轨迹，失败路径被修复后与其他成功路径共同进入数据集',
      caption:
        '同一个任务从共享起点分叉：不同轨迹调用不同工具、接收真实环境反馈，其中一条在失败后完成恢复。只有通过执行与结果验证的路径，才被收入训练数据。',
    },
  },
  {
    id: 'cot-sft-augmentation',
    eyebrow: 'Data Augmentation · 02',
    title: '思维链 SFT 也能增广，核心是多路径采样 + 过程验证',
    intro:
      'CoT 不是普通文案：最终答案正确，并不保证中间推理正确。有效做法是生成多条不同推理链，再用可执行验证、步骤检查和拒绝采样控制质量。',
    points: [
      {
        zh: '一题多解，而不是同义改写',
        en: 'Multiple Rationales',
        desc: '为同一道题采样不同解法、不同长度和不同工具辅助路径，增加推理结构的覆盖，而不是只替换措辞。',
      },
      {
        zh: '答案验证只是第一道门',
        en: 'Beyond Final Answer',
        desc: '数学用计算器或证明器、代码用测试、工具任务用环境状态；还要检查中间步骤是否自洽，防止猜中答案或事后合理化。',
      },
      {
        zh: '保留正确链，也利用错误链',
        en: 'Correct & Corrective',
        desc: '正确推理用于 SFT；带错误位置、批评与修复过程的数据，可训练 critic、自我纠错、DPO 或过程奖励模型。',
      },
      {
        zh: '完整、简洁、工具版共同配比',
        en: 'Style Mixture',
        desc: '保留探索型长链，也生产简洁严谨版和工具辅助版，避免模型只学会一种固定长度与固定话术。',
      },
    ],
    image: {
      src: '/outline/cot-sft-augmentation.png',
      alt: '一个问题生长出多条推理分支，经逐步检查与剪枝后形成多种高质量推理样本',
      caption:
        '同一问题产生多条推理分支；检查镜逐步核验逻辑，错误枝条被剪除，正确的长链、短链与不同解法共同进入 SFT 数据集。',
    },
  },
  {
    id: 'industry-augmentation-pipeline',
    eyebrow: 'Data Augmentation · 03',
    title: '大厂公开方法的共同点：生成只是起点，验证器才是产线核心',
    intro:
      '公开材料没有披露完整内部配方，但 OpenAI、Google、Microsoft、Anthropic 与 DeepSeek 展现出相似范式：高质量种子启动，强模型扩量，多种验证器筛选，再通过 SFT / RL 迭代。',
    points: [
      {
        zh: '少量高质量种子启动',
        en: 'Curated Seeds',
        desc: '先定义目标能力、示范格式和质量边界；种子数据决定生成分布，通常比盲目追求总量更重要。',
      },
      {
        zh: '强模型大规模采样',
        en: 'Teacher Sampling',
        desc: '教师模型或当前策略为每个任务生成多条候选推理与行动轨迹，并覆盖不同难度、语言、工具和失败模式。',
      },
      {
        zh: '异构验证与拒绝采样',
        en: 'Verify & Reject',
        desc: '组合规则、执行器、单元测试、reward model、独立 LLM judge 与人工抽检，减少同一个模型既出题又判卷的相关偏差。',
      },
      {
        zh: '训练后再采样，持续迭代',
        en: 'Train → Resample',
        desc: '筛选数据用于 SFT、蒸馏、偏好优化或 RL；新 checkpoint 再生成更难数据，形成数据与模型互相推进的飞轮。',
      },
    ],
    image: {
      src: '/outline/industry-data-flywheel.png',
      alt: '高质量种子经生成、并行验证、筛选配平与训练后回到下一轮采样的数据飞轮',
      caption:
        '共同流水线不是“生成海量文本再喂回去”，而是种子、采样、硬验证与模型审核、去重配平、训练、再采样构成的闭环。公开案例包括 DeepSeek-R1 的拒绝采样、Phi-4 的合成数据课程、STaR 自举与 OpenAI deliberative alignment。',
    },
  },
  {
    id: 'augmentation-quality-gates',
    eyebrow: 'Data Augmentation · 04',
    title: '先建质量门禁，再扩大合成数据规模',
    intro:
      '增广能放大能力，也会放大错误。落地时应把“是否可验证”放在“能生成多少”之前，并用严格隔离的真实任务判断它是否真的提高了泛化。',
    points: [
      {
        zh: '五层门禁，逐层淘汰',
        en: 'Five Quality Gates',
        desc: '依次检查任务有效、环境真实执行、工具调用合法、中间步骤一致、最终结果正确；不能只看最后答案。',
      },
      {
        zh: '拆分生成者与审核者',
        en: 'Independent Review',
        desc: '优先使用确定性验证；模型审核尽量换模型、换提示或多 judge 投票，并保留人工抽检与专门的反作弊审计集。',
      },
      {
        zh: '去重、配平、保留真实数据',
        en: 'Curate the Mixture',
        desc: '按任务类型、难度、轨迹长度、工具与结果去重配平，混入真实、人工、失败和多教师数据，防止模式坍缩。',
      },
      {
        zh: '隔离评测决定是否扩量',
        en: 'Scale After Evidence',
        desc: '先做原始数据、原始+合成、不同验证策略的消融；只有真实隔离集与分布外测试同时改善，才扩大合成规模。',
      },
    ],
    image: {
      src: '/outline/augmentation-quality-gates.png',
      alt: '候选轨迹依次经过五道质量检查，错误样本被分流，合格样本经人工抽检和配平后进入数据仓',
      caption:
        '候选数据依次穿过任务、环境、动作、过程与结果五道门禁；不合格样本被分流，合格样本再经抽检、去重和难度配平，最终进入干净数据仓。',
    },
  },
]

export function DataAugmentationSections() {
  return (
    <>
      {DATA_AUGMENTATION_SECTIONS.map((section) => (
        <SeSection key={section.id} section={section} />
      ))}
    </>
  )
}

/**
 * 「Design Harness 的多种落地方式」：按业务方需求自由组合交付形态，
 * 复用 SeSection 版式，右侧先用占位框，待补配图。
 */
const DELIVERY_MODELS_SECTION: Section = {
  id: 'delivery-models',
  eyebrow: 'DesignHarness · Delivery',
  title: 'Design Harness 的多种落地方式',
  intro:
    '可以根据业务部门的需求，给出不同程度的落地方式——从一份数据到整套自进化飞轮，自由组合。',
  points: [
    {
      zh: '对基模团队：只交付数据',
      en: 'Data Only',
      desc: '对于盘古这种基模团队，可以只交付沉淀下来的轨迹数据，作为他们训练的原料。',
    },
    {
      zh: '对业务团队：交付 Skill 或 Harness',
      en: 'Skill or Harness',
      desc: '对于菲尔茨这种业务团队，可以交付 Skill，也可以交付整套 Harness；如果他们要做自己的 Harness，那就交付我们的 Skill。',
    },
    {
      zh: '两种粒度：资产本身 × 飞轮能力',
      en: 'Assets × Flywheel',
      desc: '可以只交付资产本身，也可以交付自进化相关的整套飞轮能力——根据对方的需求，自由给出不同的落地方案。',
    },
  ],
  image: {
    src: '/outline/design-harness-delivery-models.png',
    alt: '一辆完整智能汽车与可独立交付的智驾传感器、智能座舱和底盘平台围绕排列',
    caption:
      '就像造车既可以交付整车，也可以只交付智驾、智能座舱或底盘设计：Design Harness 同样可以按业务需求选择交付粒度——只给轨迹数据或 Skill，也可以交付完整 Harness，乃至连同持续自进化的经验飞轮一起交付。',
  },
}

export function DeliveryModelsSection() {
  return <SeSection section={DELIVERY_MODELS_SECTION} />
}

/**
 * 「Agent 自进化」前四个章节：每章一页，布局统一——
 * 左侧标题 + 若干要点卡片，右侧展示对应的自进化机制插画。
 */
export function SelfEvolutionSections() {
  return (
    <>
      {SECTIONS.map((section) => (
        <SeSection key={section.id} section={section} />
      ))}
    </>
  )
}

/**
 * 「经验飞轮」页：单独一页，放在多种落地方式之后。
 */
export function SelfEvolutionFlywheelSection() {
  return <SeSection section={FLYWHEEL_SECTION} />
}

/**
 * 「数据飞轮」页：紧跟「经验飞轮」之后，从数据角度看要沉淀的两类资产，
 * 右侧用双层、双环插画表现 Harness 数据积累与 Model 数据积累的相互增强。
 */
const DATA_FLYWHEEL_SECTION: Section = {
  id: 'data-flywheel',
  eyebrow: 'Self-Evolution · 09',
  title: '数据飞轮：Harness 专家知识层和 Model 轨迹数据积累',
  intro:
    '从数据的角度来看，要沉淀两类数据：一类是 Harness 的专家知识层，另一类是专家真实使用沉淀下来的高质量种子轨迹数据。',
  points: [
    {
      zh: 'Harness 层：专家知识积累',
      en: 'Skill + Components',
      desc: '也就是 Skill 和配套的组件——把专家的做法固化成可复用的知识与物料，越用越厚。',
    },
    {
      zh: 'Model 层：高质量种子轨迹数据积累',
      en: 'Seed Trajectories',
      desc: '专家真实使用过程中产生的高质量轨迹数据，作为后续训练与数据增广的种子。',
    },
  ],
  image: {
    src: '/harness/data-flywheel-two-layer.png',
    alt: '上下两层数据飞轮：下层 Harness 环从专家真实工作中积累 Skill、组件与评审经验，上层 Model 环对种子轨迹进行增广、验证和训练，轨迹向上输送、模型能力向下回流',
    caption:
      '下层 Harness 环在一次次真实任务中，把专家反馈沉淀成 Skill、组件与高质量种子轨迹；轨迹向上进入 Model 环，经过增广、验证与训练形成更强能力，再回流到 Harness 改善下一轮执行。两层数据各自积累，两个循环彼此增强。',
  },
}

export function DataFlywheelSection() {
  return <SeSection section={DATA_FLYWHEEL_SECTION} />
}
