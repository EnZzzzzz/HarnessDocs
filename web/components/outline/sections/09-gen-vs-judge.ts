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
      detail: [
        '问题：Anthropic 在长时程编码实验里观察到两个持续存在的失败模式——上下文填满后模型失去连贯、甚至因「上下文焦虑」提前收尾；以及更棘手的自评失真：让 agent 评价自己的作品，它总是自信地溢美，哪怕在人看来质量平庸。生成侧要稳定产出，先得把它从「评判自己」这件事里解放出来。',
        '做法：generator 的职责被压到极窄——按 sprint 一次只从 spec 里领一个特性，固定 React/Vite/FastAPI 技术栈，用 git 管版本，与其他智能体全部通过文件交接；每个 sprint 结束只做一次自评就交给 QA，真正的判断外包给独立的 evaluator。生成侧不挂视觉工具、不背评分标准，只保留把东西做出来所必需的工具。',
        '效果与演进：这种极简不是教条，而是可裁剪的基线——Opus 4.6 变强之后，作者把整个 sprint 分解结构删掉，generator 在 DAW 任务上一次连续构建 2 小时 7 分钟仍保持连贯。正如原文的原则：harness 里每个组件都编码了一个「模型自己做不到」的假设，假设过期就该删。干扰越少，生成轨迹越干净，也越适合直接沉淀为训练数据。',
      ],
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
      detail: [
        '问题：判别 Harness 要回答「做得好不好」，而这恰恰没有现成答案——主观任务里不存在等价于软件测试的二元检验，「丑」不会抛异常。HarnessEval 在评测侧遇到的是同一个矛盾：一套统一 rubric 覆盖得足够全，就会混入大量与当前案例无关的检查；为自动化而简化，又会漏掉真正依赖上下文、时序与因果的关键判断。',
        '做法：两个实践给出同方向的答案——把「判断」变成「搜集证据的工作流」。Anthropic 的 evaluator 拿到 Playwright MCP，像真实用户一样点击运行中的应用、截图研究实现细节之后，才逐条对照标准打分；MirroS 的 HarnessEval 则把评测组织成 Plan–Route–Decompose–Verify 四个阶段：先理解案例再决定测什么，从技能库路由适用技能，把抽象判断拆成可验证的子问题交给 sub-agent 和诊断工具，主智能体审计证据充分性后才聚合评分。',
        '效果：判别侧交付的不只是一个分数，而是一棵可追溯的证据树——测了什么、为什么测、哪个工具提供了哪条证据、证据如何支撑结论，全部可检查、可复现。代价同样实在：evaluator 实际操作页面而非给静态截图打分，单次完整运行可长达 4 小时，还要单独撰写标准、单独校准、单独计费。判别比生成贵，贵就贵在证据上。',
      ],
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
      detail: [
        '问题：判别 Harness 最难的部分不是工程，而是「什么算好」。作者的原话是「开箱的 Claude 是个糟糕的 QA」：早期运行里，evaluator 明明发现了真问题，却会说服自己「这不是大事」然后照样放行；测试也流于表面，不碰边界情况，更隐蔽的 bug 就此漏网。模型自评的宽容倾向，不会因为换个角色就自动消失。',
        '做法：人分两步介入。第一步是定标准：作者亲手写下四条可打分的标准——设计质量、原创性、工艺、功能——并刻意给设计与原创性更高权重，明确惩罚「白色卡片配紫色渐变」这类 AI 套路；第二步是校准：用带详细分数拆解的 few-shot 示例让 evaluator 对齐「我的偏好」，此后进入调优循环——读 evaluator 日志、找出与自己判断分歧的案例、改 QA prompt，如此反复数轮。',
        '效果：校准后的 evaluator 评分漂移明显减少，判断与作者对齐，打回的 FAIL 能精确到文件行号与路由定义。但作者也诚实记录了天花板：小布局问题、不直觉的交互、深层嵌套功能里的 bug 仍会漏网，「还有更多可挖的验证空间」。换句话说，evaluator 可以被调教得可用，但美学判断的源头仍然是设计师——这也是判别 Harness 至今无法全自动化的原因。',
      ],
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
      detail: [
        '问题：此前 Anthropic 的长时程 coding harness 已经能跨会话保持连贯，但产出的应用有个共同毛病——看起来惊艳，真正去用却到处是 bug。根因是自评失真：做事的模型评判自己的作品，总会把坏成果当成品交付。作者要验证一个借鉴 GAN 的假设：把「做事的」和「评判的」分开，能不能让 Claude 在无人工干预下构建真正完整的应用。',
        '做法：搭一套 planner–generator–evaluator 三智能体架构。planner 把 1-4 句话的需求扩成完整产品 spec；generator 按 sprint 逐个特性实现；关键是每个 sprint 动工前，generator 与 evaluator 先协商一份 sprint 契约——「做完长什么样、如何验证」——evaluator 随后用 Playwright 实测运行中的应用，逐条对照契约判分，任一项低于硬阈值就打回并附上可操作的反馈。契约细到什么程度？仅 Sprint 3 的关卡编辑器就有 27 条验收标准。',
        '效果：对照实验是同一个「2D 复古游戏制作器」提示词。solo harness 跑 20 分钟、花 $9，产出的游戏实体出现在屏幕上却对输入毫无响应——核心玩法直接坏掉；三智能体 harness 跑 6 小时、花 $200，planner 把需求扩成 16 个特性、10 个 sprint，最终产物作者真的能操控角色玩起来。20 倍的成本，换来的是「能跑」与「不能跑」的质变。',
        '演进：Opus 4.6 发布后作者重审了这套 harness——删掉 sprint 分解，evaluator 从逐 sprint 评分改为末尾单轮终检；V2 构建一个浏览器 DAW 只花 3 小时 50 分、$124.70，其中三轮 QA 合计仅约 25 分钟、$10 出头，仍抓到了「音频录制只是桩实现」这类真实缺口。结论是：evaluator 不是永久组件，任务超出模型可靠能力边界时才值得这笔开销——生成与判别的分离是个可调旋钮，而不是固定架构。',
      ],
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
        {
          src: '/outline/anthropic-v2-cost-breakdown.png',
          caption:
            'V2 harness（Opus 4.6）构建浏览器 DAW 的分阶段成本表：纵向看 Build 与 QA 交替出现，QA 三轮各只花 6.8–9.6 分钟、$3–4，而构建轮次以小时计、$71 起步——判别侧按轮次计费、成本占比很小，却每轮都抓到真实缺口。这解释了为什么 evaluator 可以做成「按需启用」的可调组件',
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
