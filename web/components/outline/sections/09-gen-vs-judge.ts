import type { OutlineSectionData } from '../outline-data'

/**
 * 第 9 章：生成 Harness VS 判别 Harness
 * 业界尚无通用叫法，但已有实践：Anthropic 的 planner–generator–evaluator
 * 三智能体架构，以及 MirroS 等的 HarnessEval 评测工作流。
 */
export const S09_GEN_VS_JUDGE: OutlineSectionData = {
  id: 'gen-vs-judge',
  kicker: '第九章 · 两种 Harness',
  title: '生成与判别分离',
  intro:
    '业界还没有「生成 Harness / 判别 Harness」的通用叫法，但相关实践已经出现：Anthropic 借鉴 GAN 用独立 evaluator 反哺 generator，HarnessEval 则把评测本身做成了带工具与证据链的工作流。',
  cards: [
    {
      badge: '01',
      title: '生成 Harness',
      en: 'Generation Harness',
      tagline: '专注生成与工程可用性，极简工具，产出纯净训练数据',
      detail:
        '生成侧不太需要懂美学，它的职责是把东西做出来、做得工程上可用。保持极简模式——只挂必要的 tool——干扰更少，产出的轨迹也更干净，适合直接作为训练数据。',
      images: [
        {
          src: '/outline/anthropic-generator-sprint.png',
          caption:
            'Anthropic 博客原文对 generator 的定义：按 sprint 一次只实现一个特性、固定 React/Vite/FastAPI 技术栈、用 git 做版本管理——职责单一、工具极简正是生成 Harness 的形态',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
        {
          src: '/outline/anthropic-agent-file-handoff.png',
          caption:
            '智能体之间通过文件交接：一个写文件、另一个读后回复，generator 按约定好的契约动工——低耦合的协作方式让生成轨迹干净、可复用',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
      ],
      points: [
        {
          text: '职责单一：专注生成，关注工程可用性，不要求美学判断力（本章大纲观点）',
        },
        {
          text: '极简模式：只包含必要工具，减少干扰，让行为轨迹更纯粹、可复用为训练数据（本章大纲观点）',
        },
        {
          text: 'Anthropic 的 generator 按 sprint 逐个实现特性，用 git 管理版本，通过文件与其他智能体交接',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
        {
          text: 'harness 中的每个组件都编码了一个「模型自己做不到」的假设，应随模型进步不断删繁就简',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
      ],
    },
    {
      badge: '02',
      title: '判别 Harness',
      en: 'Judgement Harness',
      tagline: '需要大量视觉工具，还要注入美学知识，比生成贵得多',
      detail:
        '判别侧要回答「做得好不好」，这在视觉场景里没有现成答案：需要截图、渲染、对比等一整套视觉工具来搜集证据，还需要把美学知识显式注入成可打分的标准。实践中评测器往往要单独校准、单独计费。',
      images: [
        {
          src: '/outline/anthropic-grading-criteria.png',
          caption:
            'Anthropic 把「好看」显式写成四条可打分标准——设计质量、原创性、工艺、功能，同时给 generator 和 evaluator：美学知识要被注入成可判项，判别侧才能工作',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
        {
          src: '/outline/anthropic-evaluator-findings.png',
          caption:
            'evaluator 用 Playwright 实测后打回的具体 FAIL 证据：精确到文件行号与路由定义——判别 Harness 搜集证据的成本远高于生成',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
        {
          src: '/outline/harnesseval-agentic-eval.png',
          caption:
            'HarnessEval 的 Agentic Evaluation 工作流：从技能库路由评测技能、调用工具产出分技能证据，再汇聚成最终结果——评测本身被做成了带证据链的 Harness',
          source: 'https://mp.weixin.qq.com/s/T_fBh7p82OHaKw75oq-5cQ',
        },
      ],
      points: [
        {
          text: '需要大量视觉工具、需要注入大量美学知识（本章大纲观点）',
        },
        {
          text: 'Anthropic 的 evaluator 通过 Playwright MCP 实际操作页面、截图研究后才打分，单次完整运行长达 4 小时',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
        {
          text: '四条评分标准把「好看」拆成可判项：设计质量、原创性、工艺、功能，并用 few-shot 示例校准 evaluator 的口味',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
        {
          text: 'HarnessEval 用 Plan–Route–Decompose–Verify 工作流组织评测：从技能库选工具、把抽象判断拆成可验证子问题，最终产出可追溯的证据树',
          source: 'https://mp.weixin.qq.com/s/T_fBh7p82OHaKw75oq-5cQ',
        },
        {
          text: '设计/图表场景没有客观裁判：丑不会抛异常，裁判基建只能自造——可客观化子集抽成 checker，其余靠模型自评或人',
          source: '/Users/en/Documents/docs/wiki/裁判与评测基建.md',
        },
      ],
    },
    {
      badge: '03',
      title: '设计师必须介入',
      en: 'Designer in the Loop',
      tagline: '判别的美学能力还无法完全自动化，人来定标准、做校准',
      detail:
        '判别 Harness 最难的部分不是工程，而是「什么算好」。现有实践里，评分标准由人撰写、用人的偏好校准、发现评分漂移后由人调 prompt——美学判断的源头仍然是设计师。',
      images: [
        {
          src: '/outline/anthropic-evaluator-calibration.png',
          caption:
            '作者用带详细分数拆解的 few-shot 示例校准 evaluator，让它的判断对齐「我的偏好」、减少评分漂移——评分的源头是人的口味',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
        {
          src: '/outline/anthropic-evaluator-tuning.png',
          caption:
            '「开箱的 Claude 是个糟糕的 QA」：调优方法是读 evaluator 日志、找出与自己判断分歧的案例、改 QA prompt，反复数轮才达标——设计师必须在环',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
      ],
      points: [
        {
          text: '判别 Harness 的美学能力还无法做到完全自动化，设计师必须介入（本章大纲观点）',
        },
        {
          text: '「好看」无法完全还原成分数，但「是否符合我们的设计原则」可以打分——而原则由人写出来',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
        {
          text: 'Anthropic 调 evaluator 的方法：读评测日志、找出与自己判断分歧的地方、改 QA prompt，反复数轮才达标',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
        {
          text: 'judge 自评有循环论证风险，需用更强的模型当 judge 或定期人评校准；校准频率与人评抽样比例目前无定论',
          source: '/Users/en/Documents/docs/wiki/裁判与评测基建.md',
        },
      ],
    },
    {
      badge: '04',
      title: '实例：planner–generator–evaluator',
      en: 'GAN-inspired Trio',
      tagline: 'Anthropic 借鉴 GAN：生成与判别分离，让 Claude 连续数小时构建完整应用',
      detail:
        'Anthropic 2026-03 的工程博客给出了一套完整实例：planner 把一句话需求扩成产品 spec，generator 按 sprint 实现，evaluator 用 Playwright 实测并逐条打分，不达标就打回。单智能体跑 20 分钟、产出应用核心功能直接坏掉；三智能体跑 6 小时、成本贵 20 倍，但应用真的能玩。',
      images: [
        {
          src: '/outline/anthropic-harness-cost-table.png',
          caption:
            '原文对照实验的成本表：solo 20 分钟 $9，三智能体完整 harness 6 小时 $200——生成与判别分离贵 20 倍，但换来质的差距',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
        {
          src: '/outline/anthropic-solo-game-broken.png',
          caption:
            'solo harness 产出的游戏：实体出现在屏幕上但对输入毫无响应，核心玩法直接坏掉——没有独立 evaluator 时，智能体会把坏成果当成品交付',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
        {
          src: '/outline/anthropic-full-game-playable.png',
          caption:
            '三智能体 harness 产出的游戏：关卡、物理、调试信息齐全，作者真的能操控角色玩起来——evaluator 逐 sprint 打回修复的结果',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
      ],
      points: [
        {
          text: '动机：智能体评价自己的作品时总是溢美，把「做事的」和「评判的」分开是强力杠杆',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
        {
          text: '生成与判别先约定 sprint 契约——写代码前先协商「做完长什么样、如何验证」，再动工',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
        {
          text: '对照实验：solo $9/20 分钟 vs 三智能体 $200/6 小时，后者产出 16 特性、核心玩法真正可运行',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
        {
          text: 'evaluator 不是永久组件：当任务落在模型可靠能力范围内时可裁掉，超出边界时才值得这笔开销',
          source:
            'https://www.anthropic.com/engineering/harness-design-long-running-apps',
        },
        {
          text: '同一思路在评测侧的呼应：HarnessEval 把评测也做成按需路由技能、验证证据的可执行系统，「从 Metric 到 Harness」',
          source: 'https://mp.weixin.qq.com/s/T_fBh7p82OHaKw75oq-5cQ',
        },
      ],
    },
  ],
}
