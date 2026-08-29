/**
 * Harness 六大运行时职责。
 * 依据 arXiv 2606.20683《From QA to Task Completion: A Survey on Agent System and
 * Harness Design》的形式化定义 A_LLM = ⟨M, I_obs, C, L, I_act, S, V⟩，
 * 并结合 OpenAI / Anthropic / Stripe 等一线工程实践补充案例。
 */

export interface HarnessPart {
  /** 形式化符号，如 I_obs */
  symbol: string
  /** 中文名 */
  name: string
  /** 英文名 */
  en: string
  /** 卡片正面的一句话概括 */
  tagline: string
  /** 详情：这个职责解决什么问题 */
  detail: string
  /** 详情：代表性实践 */
  examples: string[]
}

export const HARNESS_PARTS: HarnessPart[] = [
  {
    symbol: 'I_obs',
    name: '观察接口',
    en: 'Observation Interface',
    tagline: '把环境信号翻译成模型能读懂的观察',
    detail:
      '模型看不见世界，它只能读上下文。观察接口负责把原始环境信号——终端输出、文件 diff、截图、DOM 状态、性能指标——裁剪、格式化成模型可消费的观察。观察给得是否干净、是否聚焦于当前决策，直接决定推理质量。',
    examples: [
      'OpenAI 把 Chrome DevTools Protocol 接进 Agent 运行时，Agent 可以自己抓 DOM 快照和截图，「把启动时间降到 800ms 以下」变成可自测的目标',
      'Carlini 的编译器项目里，日志写入文件而非控制台，采用 grep 友好的单行格式（如 ERROR: [reason]），需要时再检索，避免无关日志挤占上下文',
    ],
  },
  {
    symbol: 'C',
    name: '上下文管理',
    en: 'Context Manager',
    tagline: '决定什么信息、何时、以什么形式进入窗口',
    detail:
      'Harness 的性能天花板。上下文越长，推理越慢、越贵、越容易出错——有观察表明窗口用到约 40% 后输出质量就开始下滑（Smart Zone / Dumb Zone）。上下文管理要在有限窗口里塞进最有效的信息：压缩、分层披露、按加载、以及在上下文焦虑时直接 reset 并用结构化文档交接。Skill 本质上也是这一层的标准化：元数据常驻，命中场景后才加载详细规则。',
    examples: [
      'OpenAI 的 AGENTS.md 只有约 100 行，作为目录指向 docs/ 里的分层文档，按需加载',
      'Anthropic 发现 Sonnet 4.5 上下文快满时会「提前收工」，于是采用 context resets：清空窗口，靠结构化交接文档保留关键状态',
    ],
  },
  {
    symbol: 'L',
    name: '控制循环',
    en: 'Control Loop',
    tagline: '编排「观察—推理—行动—反馈」的循环',
    detail:
      '模型只输出下一个动作，循环本身由 Harness 提供：步骤调度、停止条件、重试、反思、子代理委派。好的编排是该确定的地方确定、该灵活的地方灵活——确定性步骤走流水线，需要判断的步骤交给模型。',
    examples: [
      'Stripe Minions 的混合状态机：lint、push 走确定性节点；实现功能、修 CI 走 Agent 节点',
      'Anthropic 的三智能体架构（Planner → Generator ⇄ Evaluator）把生成与评估拆给不同 Agent，纠正自我评价偏差',
    ],
  },
  {
    symbol: 'I_act',
    name: '动作接口',
    en: 'Action Interface',
    tagline: '把模型输出映射成可执行的操作',
    detail:
      '函数调用、MCP 工具、shell、代码执行、文件系统抽象——模型的一切意图都要经过动作接口落地。接口提供了什么操作、怎样返回结果、错误能否被下一步利用，直接改变任务完成率。',
    examples: [
      'Can.ac 的编码评测中，同一模型仅替换文件编辑接口，得分从 6.7% 升到 68.3%',
      'Stripe 的 Toolshed MCP 集中管理近 500 个工具，每个 Agent 只拿到筛选后的子集',
    ],
  },
  {
    symbol: 'S',
    name: '状态与产物存储',
    en: 'State & Artifact Store',
    tagline: '持久化执行状态与中间产物',
    detail:
      '模型没有跨会话记忆。对话历史、计划、进度文件、检查点、日志、轨迹、diff，都要由这一层独立持久化，长任务才能在中断、压缩、交接之后继续推进。结构化数据（如 JSON 进度文件）比自由文本更不容易被 Agent 改乱。',
    examples: [
      'Anthropic 用「初始化 Agent + 编码 Agent」两阶段，以 JSON 功能清单追踪每个功能的完成状态',
      'Carlini 把约 2,000 个 Claude Code 会话保持为相对独立的单元，每个会话的状态可独立检查',
    ],
  },
  {
    symbol: 'V',
    name: '验证与治理',
    en: 'Verification & Governance',
    tagline: '检查、约束并修复执行',
    detail:
      '让 Agent 知道自己做没做对，并在出错时拦住它：测试、断言、linter、验证器模型、沙箱、权限门。约束必须可机械执行——只写在文档里的规矩，Agent 迟早偏离。软件工程场景的主要瓶颈就压在这一层。',
    examples: [
      'OpenAI 的自定义 linter 报错自带修复指令：If it cannot be enforced mechanically, agents will deviate',
      'Anthropic 给 Agent 端到端验证能力：用 Playwright / Puppeteer MCP 像用户一样点击运行中的应用来验收',
    ],
  },
]
