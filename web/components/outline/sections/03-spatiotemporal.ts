import type { OutlineSectionData } from '../outline-data'

/**
 * 第 3 章「Harness 关键词 · 插件化：时空可组合性」
 * 依据：《一种面向时空可组合性的编程范式》（Cordis 论文，北大 × DeepSeek，2026-08）
 * 全文翻译：Cordis论文全文翻译-时空可组合性编程范式.md
 */
export const S03_SPATIOTEMPORAL: OutlineSectionData = {
  id: 'spatiotemporal',
  kicker: '关键词 · 插件化',
  title: '时空可组合性',
  intro:
    '2026-08-13，DeepSeek Harness 随 V4 Pro 同日发布：一个「一切皆插件」的 Agent 运行时底座，模型、工具、沙箱、UI 均可替换，MIT 开源，一日破万星。其底层框架 Cordis 的理论根基，正是这篇《时空可组合性编程范式》。',
  cards: [
    {
      badge: '01',
      title: '时间可组合性',
      en: 'Temporal Composability',
      tagline: '组件被移除时，它对共享环境的全部副作用被完全、安全地回滚',
      detail:
        '论文把效应建模为一次上下文变换，并要求它同时返回一个由运行时持有的逆变换，称为「可逆效应」。运行时把每一步的逆按 LIFO 次序复合进累积器，组件卸载时运行累积器，即可把上下文恢复到组合前的状态——跟踪与恢复都保持组合性，因此局部时间可组合性成为一种结构性保证。',
      images: [
        {
          src: '/outline/cordis-effect-recover.png',
          caption:
            '论文 §3.1.1 的交换图：每个效应 f 经 track 进入效应上下文 ∂Γ 并把逆复合进累积器，最后 recover 一步沿底边把整个上下文带回初始状态',
          source: 'https://arxiv.org/pdf/2608.25512',
        },
        {
          src: '/outline/cordis-effect-witness.png',
          caption:
            '论文 §3.1.2 的见证条件图示：上三角要求逆 g 恰好在效应 e 被应用的那个状态撤销它，这正是「逐状态选择不同的逆」的形式化依据',
          source: 'https://arxiv.org/pdf/2608.25512',
        },
      ],
      points: [
        {
          text: '效应 = 上下文变换 Γ → Γ × (Γ → Γ)：产出新上下文的同时附带一个显式的逆',
          source: '§3.1 可逆效应',
        },
        {
          text: '累积器 φ 复合迄今所有效应之逆，recover 一步把上下文恢复到初始状态',
          source: '§3.1.1 效应上下文（定义 2、6）',
        },
        {
          text: '逆只需在效应被应用的那个状态处撤销它（见证条件），允许逐状态选择不同的逆',
          source: '§3.1.2 效应函数（定义 8）',
        },
        {
          text: '选择性撤销：输出侧同样返回逆，可撤销某一个效应而保留其余',
          source: '§3.1.2 效应函数',
        },
        {
          text: 'Cordis 实现：一切上下文修改都流经 ctx.effect，自动跟踪、卸载时自动回滚',
          source: '§5.1.1 效应跟踪',
        },
      ],
    },
    {
      badge: '02',
      title: '空间可组合性',
      en: 'Spatial Composability',
      tagline: '组件声明依赖规约，上下文每次变化驱动它的激活与失活',
      detail:
        '论文把组件的依赖建模为一份共效应规约，并依据规约把上下文的每次变化分类为「激活 / 失活 / 中性」，称为「响应式共效应」。组件只在其声明的全部依赖就位后才激活，依赖被收回时即刻失活——依赖的声明、发现与解析都由系统在运行时以响应式方式管理。',
      images: [
        {
          src: '/outline/dsh-service-inject.png',
          caption:
            'DeepSeek Harness 官方文档「服务与依赖」：插件用 inject 声明所需服务，框架保证 apply 执行时依赖已全部就绪——共效应规约在工程中的直接形态',
          source: 'https://deepseek-harness.github.io/deepseek-harness/develop/framework/service',
        },
      ],
      points: [
        {
          text: '共效应上下文是类型化的依赖表：每个依赖键关联特定值类型，访问有静态类型安全',
          source: '§3.2.1 共效应上下文（定义 19）',
        },
        {
          text: '满足谓词 σ ⊧ d 可判定，且效应系统保证每次共效应变化都被观察到',
          source: '§3.2.2 规约与通知',
        },
        {
          text: 'notify 把每次状态迁移分类为激活性、失活性或中性，驱动组件生命周期',
          source: '§3.2.2 规约与通知（定义 22）',
        },
        {
          text: '隔离与拦截：同一键可在不同上下文解析为不同值，依赖访问可附加横切行为',
          source: '§3.2.3 隔离与拦截',
        },
        {
          text: 'Koishi 实证：切换存储后端时，只有依赖发生变化的插件被重新激活',
          source: '§5.3 案例研究：Koishi',
        },
      ],
    },
    {
      badge: '03',
      title: '上下文范式',
      en: 'Context Paradigm',
      tagline: '效应与共效应统一于单一上下文，组件的一切交互都经其中介',
      detail:
        '论文把效应上下文与共效应上下文统一为单一的上下文类型 Γ∞，让每个效应与共效应都经由它中介——上下文由此成为一等公民。这种中介诱导出观察等价：当没有任何操作序列能区分两个状态时它们即等价；在此等价下，不同组件的效应可以交错执行而互不干扰。',
      images: [
        {
          src: '/outline/cordis-context-api.png',
          caption:
            'Cordis 官方 API 文档「上下文」页：ctx 是所有服务、事件与生命周期 API 的统一入口，extend()/isolate()/intercept() 创建有作用域的子上下文而不修改父上下文——上下文范式的落地接口',
          source: 'https://deepseek-harness.github.io/deepseek-harness/reference/cordis-api/context',
        },
      ],
      points: [
        {
          text: 'Γ∞ 递归地携带当前状态、恢复累积器与共效应表，涵盖所有跨组件共享的可变状态',
          source: '§3.3.1 统一上下文（定义 28）',
        },
        {
          text: '「插件」隐喻被字面化：加载组件 = 执行其效应（插入），卸载 = 逆转其效应（拔出）',
          source: '§3.3.1 统一上下文',
        },
        {
          text: '层次化组合：父上下文聚合子层效应，不同层级的组件各自独立加载与卸载',
          source: '§3.3.1 统一上下文',
        },
        {
          text: '观察等价比较行为而非表示，承认物理状态无法原样恢复（如 free 不恢复堆布局）',
          source: '§3.3.2 观察等价',
        },
        {
          text: '效应独立性与共效应交换性成立时，组件效应交错执行互不干扰',
          source: '§3.4 达成独立性',
        },
      ],
    },
    {
      badge: '04',
      title: '动态组合演算',
      en: 'A Calculus of Dynamic Composition',
      tagline: '组件三元组加 Fiber 生命周期，元理论把局部保证推广到整个系统',
      detail:
        '组件被定义为「共效应规约 + 供给 + 带见证的效应函数」三元组，其实例化称为 Fiber，在 Inactive / Reloading / Active / Unloading 四态间迁移。编排规则插入与退役 Fiber，生命周期规则自发激活与停用它们；元理论随后证明：单个组件的时空保证，在任意交错执行的整个系统中依然成立。',
      images: [
        {
          src: '/outline/cordis-fiber-lifecycle.png',
          caption:
            '论文 Figure 1：Fiber 生命周期状态机——编排器只能通过 O-Insert / O-Remove 请求其存在或退役，四态间的迁移全部由生命周期规则依依赖满足情况自发驱动',
          source: 'https://arxiv.org/pdf/2608.25512',
        },
      ],
      points: [
        {
          text: '组件 = (d, p, e)：声明从环境读取什么（d）、向环境提供什么（p）、激活时贡献的效应（e）',
          source: '§4.1 组件与 Fiber（定义 48）',
        },
        {
          text: '九条规则：编排器只请求 Fiber 存在或退役，生命周期由系统依依赖满足情况自发驱动',
          source: '§4.2 演算',
        },
        {
          text: '恢复精确性：运行一个 Fiber 的累积器恰好撤回它的贡献，不动其他任何东西',
          source: '§4.3.2 时间可组合性（定理 68）',
        },
        {
          text: '排序保证：提供者只有在所有依赖方失活之后才撤回绑定',
          source: '§4.3.3 空间可组合性（定理 70）',
        },
        {
          text: '合流性：系统静止之处，正是从零加载同一配置本会到达的状态',
          source: '§4.3.5 合流性',
        },
      ],
    },
    {
      badge: '05',
      title: 'Cordis 落地与 Koishi 验证',
      en: 'Implementation & Case Study',
      tagline: '理论实现为 Cordis 元框架，在 4000+ 社区插件的生产生态中验证',
      detail:
        'Cordis 是时空可组合性元框架：核心库实现效应跟踪与共效应解析，组件加载器在其上提供声明式配置协调与热模块替换。构建其上的 Koishi 聊天机器人框架历经四年多开发、积累超 4000 个社区插件，构成对该范式在生产环境中的一次代表性验证。',
      images: [
        {
          src: '/outline/koishi-plugin-market.png',
          caption:
            'Koishi 官方控制台的插件市场：数以千计的社区插件可按分类浏览、一键添加或修改——论文 §5.3 所谓「4000+ 社区插件的生产生态」就在这里运转',
          source: 'https://koishi.chat/zh-CN/',
        },
        {
          src: '/outline/koishi-console-home.png',
          caption:
            'Koishi Web 控制台首页（官方截图）：控制台本身是一个独立的 Cordis 应用，与机器人服务端复用同一套组合模型，印证「同一个模型跨运行时复用」',
          source: 'https://koishi.chat/zh-CN/',
        },
      ],
      points: [
        {
          text: '元框架定位：不规定任何具体场景，唯一职责是提供通用的动态组合语义',
          source: '§5 实现与案例研究',
        },
        {
          text: '声明式配置：整个系统是一棵配置树，加载器做增量协调而非整体重建',
          source: '§5.2.1 声明式配置',
        },
        {
          text: 'HMR 无需开发者标注的接受边界，且重载是事务式的，绝不进入「重载一半」的状态',
          source: '§5.2.2 热模块替换',
        },
        {
          text: '无认知开销：即使没经验的作者不写卸载路径，也能获得有序的自动清理',
          source: '§5.3 案例研究：Koishi',
        },
        {
          text: '同一个模型跨运行时复用：Koishi 服务端与 Web 控制台是两个独立的 Cordis 应用',
          source: '§5.3 案例研究：Koishi',
        },
      ],
    },
  ],
}
