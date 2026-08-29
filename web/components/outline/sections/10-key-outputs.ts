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
      detail: [
        '先看问题：设计师在 Design Harness 里多轮打磨把调性定稿，但业务侧是单步生成——如果审美只存在打磨过程的对话里，每次生成都得重来一遍，调性必然漂移。这其实是个老问题的新形态：传统组件库装包即用很方便，可一旦要贴合自己的设计系统，就得包一层壳、写覆盖样式、或混用 API 互不兼容的多个库——shadcn/ui 官方文档自述的正是这个痛点。',
        '再看做法：定稿时把骨架、风格、组件打包成场景包，风格化组件与设计资产就是审美的固化形态。工程形态沿用 shadcn/ui 验证过的路径——Open Code：组件源码直接进仓库，不是看不见内部的黑盒依赖；统一的可组合接口让新增组件也能预测；再配上 schema + CLI 做分发，组件可以成套装进任何项目。',
        '效果是双重的：对业务侧，单步生成直接复用这套组件，稳定复现设计师定下的调性，审美从「人脑子里的感觉」变成可交付、可复用的资产；对模型侧，源码可见意味着 LLM 能读、能改、能按同一接口生成新组件——shadcn/ui 把这一点直接列为设计原则（AI-Ready），这也是「轨迹自包含完整代码」的选型依据。',
      ],
      images: [
        {
          src: '/outline/shadcnui-design-system.png',
          caption:
            'shadcn/ui 官网首页：大标题「The Foundation for your Design System」与副标题「Open Source. Open Code.」点明立场；下方陈列的按钮、表单、贡献图表、目标卡片都是成品组件实物——它们不是 npm 黑盒，而是「源码开放、可直接改」的组件，正是「组件源码进仓库、轨迹自包含」的选型依据。',
          source: 'https://ui.shadcn.com/',
        },
        {
          src: '/outline/shadcnui-blocks.png',
          caption:
            'shadcn/ui Blocks 页：中部工具条上的「npx shadcn add dashboard-01」是关键——一个带侧边栏、图表、数据表的成套仪表盘，一条命令装进项目；左侧 Preview/Code 切换表示拿到的是可读源码而非截图。风格化组件固化为资产后即可这样「打包交付、稳定复用」。',
          source: 'https://ui.shadcn.com/blocks',
        },
      ],
      points: [
        {
          text: '场景包成分之一：风格化组件 + 设计资产，随场景包一起交付',
          source: 'design-harness/design-harness.html §02',
        },
        {
          text: 'shadcn/ui 官方原则：Open Code（组件源码可改）、Composition（统一可组合接口）、Distribution（schema + CLI 分发）、AI-Ready（LLM 可读、可改、可生成新组件）',
          source: 'https://ui.shadcn.com/docs',
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
      detail: [
        '先看问题：场景包交付的是资产，但资产不会自己说话——模型不知道这套组件什么时候该用、怎么组合、边界在哪。Anthropic 在更普遍的层面上遇到同一个问题：agent 已经能操作完整计算环境，缺的是把领域专长「可组合、可扩展、可移植」地注入进去的方式，而不是为每个用例手工定制一个碎片化的 agent。',
        '再看做法：Anthropic 的答案是 Agent Skills——一个文件夹，核心是一份 SKILL.md。它的设计像一本编排良好的手册，靠渐进式披露（progressive disclosure）分三层加载：YAML frontmatter 里的 name + description 常驻系统提示（约 100 tokens），只负责告诉模型「什么时候触发」；判定相关后，正文 Markdown 才整体读入（约 5k tokens 以内）；更细的参考文档和脚本作为 bundle 文件按需导航加载，容量实际上不设上限。',
        '效果有两个层次：对 Anthropic，通用 agent 由此变成可插拔的专才——Claude 的 PDF 填表等文档能力就是这么来的，Skills 也在 2025 年 12 月发布为跨平台开放标准；对 Design Harness，Skill 就是场景包的使用说明书——组件用法写进正文、组合规则与边界放进按需加载的 bundle 文件，资产由此从「一次定稿」泛化到「一类场景」。',
      ],
      images: [
        {
          src: '/outline/agentskills-skillmd-anatomy.jpg',
          caption:
            'SKILL.md 解剖图：上方蓝色区是 YAML frontmatter——只有 name 和 description 两行，启动时常驻系统提示，决定「什么时候触发」；下方浅色区是 Markdown 正文（Overview + Quick Start 代码），判定相关后才整体读入。两层结构就是渐进式披露的前两级。',
          source:
            'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills',
        },
        {
          src: '/outline/agentskills-skillmd-bundle.jpg',
          caption:
            '按需加载的第三级：左侧 SKILL.md 正文里高亮的 ./reference.md 和 ./forms.md 两处引用，用箭头连到右侧两个独立文件——主文件保持精简，填表这类低频细节只在用到时才读。场景包的组件用法、组合规则与边界都可以这样随 Skill 一起交付。',
          source:
            'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills',
        },
        {
          src: '/outline/agentskills-progressive-disclosure.jpg',
          caption:
            'Anthropic 官方的三级披露对照表，每行是一级：Level 1 元数据常驻约 100 tokens，Level 2 正文触发时加载约 5k tokens 以内，Level 3+ 附带文件按需加载、token 无上限。它量化了 Skill 作为「使用说明书」的成本结构：说明可以写得很厚，但不触发就几乎不占上下文。',
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
          text: 'Skill 的核心设计原则是渐进式披露：元数据常驻（约 100 tokens）、正文触发时加载（约 5k tokens 内）、bundle 文件按需加载（容量不设上限）',
          source:
            'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills',
        },
        {
          text: 'Agent Skills 已于 2025 年 12 月发布为跨平台开放标准，Skill 形态可跨产品复用',
          source:
            'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills',
        },
        {
          text: '场景包四成分全部由 Learning Loop 自动产出，设计师全程无感',
          source: 'design-harness/design-harness.html §03',
        },
      ],
    },
    {
      badge: '03',
      title: '轨迹、偏好数据与思维链',
      en: 'Trajectories, Preferences & CoT',
      tagline: '每一次多轮交互都是一条轨迹，沉淀为可训练的数据资产',
      detail: [
        '先看问题：开源模型做 agent 曾全面落后于商用模型，而 prompting 技巧只是治标——要让模型在特定 Harness 上持续变强，最终得靠训练数据。Design Harness 恰好天然产出这种数据：每一次多轮打磨都留下完整轨迹，可投影为 SFT 样本、DPO 偏好对、RL 环境、风格签名与模糊指令映射。',
        '再看做法的实证范式：AgentTuning 让 GPT-4 在六类 agent 任务上真实交互产生轨迹，按 reward 过滤后得到 1,866 条带逐步 CoT 理由的 AgentInstruct 数据集；关键一步是把它与通用指令（ShareGPT）按比例混合微调——论文发现只用 agent 数据反而会损害泛化，通用能力是 agent 泛化的底座。',
        '效果：训出的 AgentLM 泛化到未见过的 held-out 任务，70B 版本在未见任务上追平 GPT-3.5，且 MMLU、GSM8K、HumanEval 等通用能力不降——轨迹确实是可训练资产。但 PIPE 研究的警示同等重要：轨迹 SFT 会同时放大「接口捷径」，把训练时环境里的动作名换成同义词后，AgentLM-14B 在 WebShop 上从 61.2 崩到 4.44/3.08，70B 在 DataBase 上从 42 掉到 2/13.3。这个反面证据恰好坐实了本章论点：模型最深地绑定的是它训练时见过的那套 Harness 接口——轨迹回填让模型在自己 Harness 上的亲和性随使用不断增强。',
      ],
      images: [
        {
          src: '/outline/agenttuning-pipeline.png',
          caption:
            'AgentTuning 流水线从左读到右：左侧六个 held-in 任务经指令生成、GPT-4 交互、按 reward 过滤（图中间示例轨迹 reward 0.0 打叉剔除、reward 1.0 打勾保留）汇成 AgentInstruct；中间与通用指令混合微调出 AgentLM；右侧卡牌、Wiki QA、科学实验等 held-out 任务表示它泛化到了训练中没见过的场景——轨迹即数据资产的完整证据链。',
          source: 'https://arxiv.org/abs/2310.12823',
        },
        {
          src: '/outline/trajectory-sft-interface-shortcut.png',
          caption:
            'PIPE 论文的核心示意：同一份轨迹 SFT 之后有两种可能。上排是语义学习——接口把 search 改名为 list 后 agent 仍调对函数，右侧柱状图 Δ 很小；下排是接口捷径——agent 死背了 search 这个字符串，改名后报「NO Search function ERROR」，Δ 很大。读法：看右上的扰动环境只改了动作名、没改任务，分数却塌方，说明相当一部分 benchmark 涨幅来自背接口而非懂工具。',
          source: 'https://arxiv.org/abs/2602.01611',
        },
      ],
      points: [
        {
          text: '轨迹数据是场景包四成分之一，与其余三成分一起由 Learning Loop 自动沉淀',
          source: 'design-harness/design-harness.html §02/§03',
        },
        {
          text: 'AgentTuning 实证：1,866 条 reward 过滤轨迹 + 通用指令混合微调，AgentLM-70B 在未见任务上追平 GPT-3.5 且通用能力不降；纯 agent 数据反而损害泛化',
          source: 'https://arxiv.org/abs/2310.12823',
        },
        {
          text: 'PIPE 警示：轨迹 SFT 放大接口捷径——动作名换成同义词后 AgentLM-14B 在 WebShop 从 61.2 崩到 4.44/3.08，未经轨迹训练的模型基本稳定',
          source: 'https://arxiv.org/abs/2602.01611',
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
