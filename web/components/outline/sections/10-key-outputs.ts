import type { OutlineSectionData } from '../outline-data'

/**
 * 第 10 章：关键产物。
 * 内容依据大纲.md + design-harness/design-harness.html §02
 * （场景包四成分：泛化 Skill、风格化组件、设计资产、轨迹训练数据）。
 */
export const S10_KEY_OUTPUTS: OutlineSectionData = {
  id: 'key-outputs',
  kicker: 'Design Harness · 沉淀',
  title: '关键产物',
  intro:
    'Design Harness 多轮交互的终点不是一张图，而是一套可复用的资产——调效果的过程本身就是一次资产生产。这些产物不该靠设计师手工整理，而是 Harness 自动总结、自动沉淀的。',
  cards: [
    {
      badge: '01',
      title: '设计组件',
      en: 'Design Components',
      tagline: '风格化组件 + 设计资产，审美被「冻进」可复用的骨架',
      detail:
        '定稿后把骨架、风格、组件打包成场景包：风格化组件与设计资产是审美的固化形态，业务侧单步生成时直接复用，稳定复现设计师定下的调性。',
      images: [
        {
          src: '/outline/shadcnui-design-system.png',
          caption:
            'shadcn/ui 官网首页：「设计系统的地基」——一套可定制、可扩展的成品组件，源码开放（Open Code），正是「组件源码进仓库、轨迹自包含」的选型依据',
          source: 'https://ui.shadcn.com/',
        },
        {
          src: '/outline/shadcnui-blocks.png',
          caption:
            'shadcn/ui Blocks：成套的风格化区块（仪表盘、侧边栏、登录页）一条命令直接装进项目——风格化组件被固化成资产后即可稳定复用，正是场景包「打包交付」的现实形态',
          source: 'https://ui.shadcn.com/blocks',
        },
      ],
      points: [
        {
          text: '场景包成分之一：风格化组件 + 设计资产，随场景包一起交付',
          source: 'design-harness/design-harness.html §02',
        },
        {
          text: '前端选型 React + shadcn/ui：组件源码进仓库，轨迹自包含完整代码',
          source: 'design-harness 调研（index.md 著录）',
        },
      ],
    },
    {
      badge: '02',
      title: '场景 SKILL',
      en: 'Scenario Skills',
      tagline: '把场景包的使用方法教给模型，泛化推广到新场景',
      detail:
        '场景包配套泛化 Skill：告诉模型什么时候用这套组件、怎么组合、边界在哪。Skill 是场景包的使用说明书，让资产从「一次定稿」泛化到「一类场景」。',
      images: [
        {
          src: '/outline/agentskills-skillmd-anatomy.jpg',
          caption:
            'Anthropic 官方对 SKILL.md 的解剖：YAML 元信息（名字 + 描述）决定「什么时候触发」，正文 Markdown 写清「怎么用」——Skill 作为资产使用说明书的官方范式',
          source:
            'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills',
        },
        {
          src: '/outline/agentskills-skillmd-bundle.jpg',
          caption:
            'Skill 可按需挂载更多参考文件与脚本：主文件只放指引，细节按需加载——场景包的组件用法、组合规则与边界都可以这样随 Skill 一起交付',
          source:
            'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills',
        },
      ],
      points: [
        {
          text: '沉淀场景包后配上泛化 Skill，推广到不同场景',
          source: 'design-harness/design-harness.html §02',
        },
        {
          text: '场景包四成分全部由 Learning Loop 自动产出，设计师全程无感',
          source: 'design-harness/design-harness.html §03',
        },
      ],
    },
    {
      badge: '03',
      title: '大量的训练数据',
      en: 'Training Data',
      tagline: '每一次多轮交互都是一条轨迹，沉淀为可训练的数据资产',
      detail:
        '多轮打磨的过程会留下完整轨迹：SFT 样本、DPO 偏好对、RL 环境、风格签名、模糊指令映射——这些轨迹数据回填训练，让模型在自己 Harness 上的表现持续变强。',
      images: [
        {
          src: '/outline/agenttuning-pipeline.png',
          caption:
            'AgentTuning 论文的轨迹训练流水线：交互轨迹按奖励过滤后与通用指令混合微调（AgentInstruct），模型泛化到更多未见 agent 任务——轨迹即数据资产的实证范式',
          source: 'https://arxiv.org/abs/2310.12823',
        },
        {
          src: '/outline/trajectory-sft-interface-shortcut.png',
          caption:
            '轨迹 SFT 研究的警示：在固定接口的轨迹上训练后，agent 极易形成「接口捷径」——训练环境接口一变就崩溃，反证了模型只在自己训练过的 Harness 上表现最好',
          source: 'https://arxiv.org/abs/2602.01611',
        },
      ],
      points: [
        {
          text: '轨迹数据是场景包四成分之一，与其余三成分一起由 Learning Loop 自动沉淀',
          source: 'design-harness/design-harness.html §02/§03',
        },
        {
          text: '轨迹可投影为六类可训练数据：SFT / DPO / RL / 手动参数 / 风格签名 / 模糊指令映射',
          source: 'design-harness 调研（index.md 著录，04 轨迹数据采集）',
        },
        {
          text: '模型只在自己的 Harness 上表现最好——轨迹数据让亲和性随使用不断增强',
          source: 'design-harness/harness-model-affinity.md',
        },
      ],
    },
  ],
}
