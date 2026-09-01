'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const POINTS = [
  {
    zh: '动态组合缺乏形式化基础',
    en: 'Dynamic Composition',
    desc: '插件系统与自进化 Agent Harness 都要在运行时装卸组件，但现有实践只有粗粒度权宜之计——重启进程、重编排容器，运行时状态被整体丢弃。',
    image: '/outline/cordis-dynamic-composition.png',
    alt: '粗粒度重启导致运行状态散失，与不中断任务的组件热插拔形成对比',
    caption: '左侧是粗粒度方案：为了更换一个组件重启整台系统，正在运行的状态随之丢失；右侧是动态组合的目标：只替换目标模块，主进程与任务状态继续运行。',
    detail: {
      intro:
        '要理解这篇论文，先得搞清楚它要解决什么问题。一句话：软件越来越需要在「运行中」装卸组件，但这件事一直没有一套严格的理论支撑。我们一步步来看。',
      source: '内容依据论文第 1 章（引言、可组合性的维度与动机示例）',
      qa: [
        {
          q: '先搞清楚：什么叫「动态组合」？',
          a: [
            '传统的组合是静态的——函数调用、模块导入、类继承，都在编译期就定死了，程序跑起来以后不再变。',
            '而动态组合说的是：组件在运行时被加载、卸载、重新配置。插件系统是最典型的例子；自进化 Agent Harness 则把这件事推到了极限——它要在持续服务请求的同时，改写自己的组件。每一次自我修改，都是一次动态组合。',
          ],
        },
        {
          q: '运行时卸载一个组件，能有多难？',
          a: [
            '拿 VSCode 举例。它的所有扩展跑在同一个「扩展宿主」进程里：扩展可以动态安装，但一旦 activate 执行过，想卸载它就只能重启整个宿主——连累所有已加载的扩展。安装量前 100 的扩展里，有 87 个包含可执行代码，全都逃不掉这个命运。',
            'VSCode 其实提供了 deactivate 钩子，但它只在宿主进程关闭时被调用，帮不上「运行中卸载」；而且清理逻辑和创建逻辑分写在两个函数里，到底清没清干净，谁也没法验证。',
            '空间维度同样尴尬：VSCode 虽然允许声明扩展间依赖，但前 100 的扩展里只有 7 个声明了；扩展之间互相调用拿到的是无类型的 any，没有任何可检查的契约。',
          ],
        },
        {
          q: '那重启一下，不就行了？',
          a: [
            '代价不小。每次重启都会丢掉进程里积累的所有状态——缓存、连接、算到一半的任务，重建它们要数秒到数分钟；想在这期间不断服务，还得额外养冗余副本。',
            '对普通插件系统，这只是体验问题；但对自进化 Harness 就是致命伤：自我修改是高频发生的，每改一次就重启一次，任务被反复打断，累积的不可用时间相当可观。更糟的是，如果一次有缺陷的修改把进程本身改瘫痪了，连「重启恢复」这条退路都可能走不通。',
          ],
        },
        {
          q: '为什么至今没有更好的办法？',
          a: [
            '因为操作系统和容器编排器提供了一种「粗粒度的替代品」：行为失常的模块就重启进程，服务依赖就交给编排器管。大家一直凑合着用，针对细粒度的形式化研究就少了。',
            '但粒度是错配的：容器编排无法表达同一个地址空间内组件之间的依赖，还把本可以是本地函数调用的交互逼成了网络调用。现代系统正越来越在比进程更细的粒度上组合，这套老办法跟不上了。',
          ],
        },
        {
          q: '所以到底缺的是什么？',
          a: [
            '缺一套形式化基础。静态组合早就有丰富的理论框架，动态组合却几乎空白。',
            '这篇论文把问题拆成两个正交维度：时间可组合性——组件被移除时，它对共享环境的副作用能否被完全、有序地回滚；空间可组合性——组件之间的依赖能否被显式声明，并在依赖变化时自动协调生命周期。',
            '后面几张卡片讲的可逆效应、响应式共效应、上下文范式与动态组合演算，就是把这两个维度落成可验证的运行时机制。',
          ],
        },
      ],
    },
  },
  {
    zh: '两个正交维度：时间 × 空间',
    en: 'Temporal × Spatial',
    desc: '时间可组合性：组件被移除时，它对共享环境的副作用能被完全、有序地回滚。空间可组合性：组件间的依赖被显式声明，并以响应式方式解析与协调。',
    image: '/outline/cordis-temporal-spatial.png',
    alt: '中心组件沿时间轴回滚自身副作用，同时沿空间轴响应周围依赖的出现与消失',
    caption: '两条正交轴描述同一组件：时间轴保证卸载时只撤回它留下的副作用；空间轴持续观察依赖变化，让相关组件自动激活或失活。',
    detail: {
      intro:
        '上一页说动态组合缺一套形式化基础。那这套基础该长什么样？论文的第一步不是直接给答案，而是先把问题拆清楚——拆成两个互不纠缠的维度。',
      source: '内容依据论文第 1.1 节（可组合性的维度）与第 2.3 节',
      qa: [
        {
          q: '为什么偏偏是「时间」和「空间」这两个维度？',
          a: [
            '因为组件和环境之间只有两种关系：要么它去修改环境，要么它依赖环境。',
            '时间维度对应「修改」：组件被移除时，它对共享环境做的每一处修改——资源分配、事件注册、状态变更——都必须被完全、有序地逆转。',
            '空间维度对应「依赖」：组件之间的依赖必须能以结构化、可验证的方式声明、发现和解析；依赖发生变化时，还要协调各方组件的生命周期。',
          ],
          image: '/outline/cordis-temporal-spatial-metaphor.png',
          alt: '左侧沿雪地脚印按相反顺序撤销组件副作用，右侧供给组件下线后依赖链上的组件同步失活而独立支路保持运行',
          caption:
            '时间可组合性像沿雪地脚印原路退回：后发生的修改先撤销，直到环境恢复为出发前的状态。空间可组合性像一张声明清楚的供电网络：上游供给下线时，所有直接和间接依赖它的组件一起失活；没有依赖关系的支路不受影响。',
        },
        {
          q: '静态组合不也有这两个问题吗？',
          a: [
            '有，但在静态场景里它们都「退化」成了简单问题：时间上，词法作用域天然包住一切——RAII、bracket 模式，出了作用域自动清理；空间上，模块导入在编译期就解析完了。',
            '难就难在动态场景：组件在运行时到来与离去，它的效应可能长期存活、不受词法边界约束；它依赖的东西可能在执行过程中突然出现、消失，甚至换了一个实现。两个维度都显著变难。',
          ],
        },
        {
          q: '拆成两个维度，换来了什么？',
          a: [
            '换来了各个击破的可能：时间维度交给「可逆效应」，空间维度交给「响应式共效应」——这正是下一张卡片的内容。',
            '两个维度正交，意味着两套机制可以独立建立、独立验证，最后再拼回一个统一的理论，而不是缠在一起的一团。',
          ],
        },
      ],
    },
  },
  {
    zh: '把效应与共效应提升为运行时机制',
    en: 'Revertible Effect & Reactive Coeffect',
    desc: '可逆效应：每次上下文变换都携带一个由运行时持有的逆变换，卸载时按 LIFO 自动回滚。响应式共效应：依赖规约把每次上下文变化分类为激活 / 失活 / 中性，驱动组件生命周期。',
    image: '/outline/cordis-effect-coeffect.png',
    alt: '运行时左侧堆叠每次变更的逆操作，右侧根据依赖是否满足控制组件灯的亮灭',
    caption: '每次修改都会留下配对的逆操作，卸载时按后进先出顺序恢复；依赖传感器则把环境变化分类，驱动消费者激活、失活或保持不变。',
    detail: {
      intro:
        '效应（effect）和共效应（coeffect）都是程序语言理论里的老概念，但一直是编译期的静态分析工具。这篇论文的关键一步，是把它们变成运行时可以亲自操作的机制。',
      source: '内容依据论文第 2 章（预备知识）与第 3.1、3.2 节',
      qa: [
        {
          q: '效应和共效应，本来是干嘛的？',
          a: [
            '一句话：效应建模「程序对世界的影响」——它会改什么；共效应建模「世界对程序的约束」——它要访问什么资源、持有什么权限、依赖什么服务。',
            '传统上它们活在类型系统里，在编译期做检查，帮程序员推理有状态的计算。',
          ],
        },
        {
          q: '静态的工具，为什么管不了动态组合？',
          a: [
            '因为静态系统假设边界在编译期就固定了：效应在词法作用域里被跟踪，共效应在执行前就已确定的上下文上验证。',
            '可动态组合里，组件是运行时才来的——没有任何固定的词法作用域能框住一个部署后才加载的插件，也没有任何编译期上下文能预见运行时才产生的依赖。',
            '论文的思路干脆反过来：与其往类型系统里加更多标注，不如把这些概念「具体化」成运行时的数据结构，让运行时自己建立同样的保证。',
          ],
        },
        {
          q: '可逆效应具体怎么工作？',
          a: [
            '每一次对上下文的修改，都必须同时交出一个「逆变换」——一个能把这次修改撤掉的函数，由运行时保管。',
            '运行时用累积器把一次次逆变换按顺序复合起来；卸载组件时，按后进先出（LIFO）的顺序依次应用这些逆，环境就回到组合之前的状态。',
            '于是修改可被跟踪、可被恢复——时间可组合性成了结构性保证，而不是靠每个作者自觉写清理代码。',
          ],
        },
        {
          q: '响应式共效应又怎么工作？',
          a: [
            '组件先把自己的依赖声明成一份「规约」：我需要哪些键。此后上下文的每一次变化，都会对照这份规约被分成三类——激活（依赖从没满足变成满足）、失活（从满足变成不满足）、中性（没影响）。',
            '组件只在依赖全部就位后才被激活，依赖被收回时立刻失活——而不是乐观地去访问、缺失时才报错。',
            '两套机制还会打配合：注册一个依赖本身就是一次可逆效应，自动获得跟踪与恢复。',
          ],
        },
      ],
    },
  },
  {
    zh: '上下文范式与动态组合演算',
    en: 'Context Paradigm',
    desc: '效应上下文与共效应上下文统一为单一的上下文类型，一切操作经其中介；这种中介诱导出观察等价，不同组件的效应可交错执行而互不干扰，元理论把保证从单组件推广到整个系统。',
    image: '/outline/cordis-context-paradigm.png',
    alt: '多个组件的彩色操作流经过统一上下文交错执行，移除一条流后其他输出保持不变',
    caption: '所有效应与依赖都经过统一上下文中介。不同组件的操作可以交错，但仍保持独立；抽走其中一条，观察者看到的其他组件行为不变。',
    detail: {
      intro:
        '上一页的两套机制，各自只保证「单个组件」的安全。可真实系统里一堆组件交错执行，怎么保证它们互不干扰？这一步需要两条纪律：统一上下文，和一套给出操作语义的演算。',
      source: '内容依据论文第 3.3 节（上下文范式）与第 4 章（动态组合演算）',
      qa: [
        {
          q: '为什么要把两种上下文统一成一个？',
          a: [
            '效应上下文和共效应上下文如果各走各的，组件总有办法「绕开」机制去摸环境。上下文范式立了一条纪律：一切效应与共效应都必须经由同一个统一上下文中介——没有别的通道。',
            '「都经由一个实体」只有在「没有别的东西可经由」时才算纪律，所以连组件能对绑定值做什么操作，也要在键上显式声明。组件与环境的每一次交互，都走这唯一的实体。',
          ],
        },
        {
          q: '什么叫「观察等价」，为什么需要它？',
          a: [
            '因为「完全恢复原样」是个理想：free 把内存归还给分配器，并不会恢复 malloc 之前堆的布局；一个生成的名字被丢弃后，下一次创建会取出一个全新的名字。物理状态不可能字面复原。',
            '所以论文改问一个更实际的问题：恢复之后，有没有任何观察者能分辨出差别？如果没有任何操作序列能区分两个状态，它们就是观察等价的——恢复到「看不出区别」就够了。',
            '正是这个等价，让不同组件的效应可以交错执行又达成独立性：抽走一个组件，其他组件的行为不变。',
          ],
        },
        {
          q: '演算又解决了什么？',
          a: [
            '第 3 节的保证都是「局部」的——只对单个组件成立。第 4 章把运行中的系统分解为组件：每个组件声明自己需要什么依赖、提供什么供给，以及一段带见证的效应函数；组件的每次实例化叫一个 Fiber，有自己的生命周期状态机——Inactive、Reloading、Active、Unloading。',
            '演算给出九条规则：编排规则（插入、退役 Fiber，是系统仅有的外部输入）和生命周期规则（系统自发地激活与停用）。',
            '元理论再把时间和空间可组合性从单个 Fiber 推广到任意交错执行的整个系统——单点安全变成了全局安全。',
          ],
        },
      ],
    },
  },
  {
    zh: 'Cordis 实现与 Koishi 验证',
    en: 'Cordis & Koishi',
    desc: 'Cordis 元框架 = 效应跟踪核心库 + 声明式组件加载器（配置协调、热模块替换），是 DeepSeek Harness 的底层插件框架；Koishi 4000+ 社区插件的生产实践验证：插件作者无需手写卸载路径即可获得有序清理。',
    image: '/outline/cordis-koishi.png',
    alt: '三层平台从效应跟踪核心、声明式加载器延伸到大量可独立装卸的社区插件',
    caption: '底层核心负责效应跟踪与依赖解析，中层加载器负责配置协调和热替换，上层承载开放插件生态；模块卸载时，其资源会沿原路径自动收回。',
    detail: {
      intro:
        '理论再漂亮，也得能跑。Cordis 把这套形式模型实现成了真实可用的元框架，而且已经有一个 4000+ 插件的生产生态在上面跑了四年多。',
      source: '内容依据论文第 5 章（实现与 Koishi 案例研究）',
      qa: [
        {
          q: 'Cordis 是个什么样的框架？',
          a: [
            '它是一个「元框架」：不像 Web 路由、ORM 那种面向特定场景的框架，它不规定任何具体应用，唯一的职责是提供通用的动态组合语义。',
            '实现分三层：核心库直接实现效应跟踪与共效应解析；组件加载器在上面扩展出配置协调和热模块替换（HMR）；应用框架再在最上层提供各自领域的词汇。',
          ],
        },
        {
          q: '插件作者实际得到什么好处？',
          a: [
            '最直观的一条：不用手写卸载路径。效应都经由上下文执行、自动被跟踪，逆操作也自动组合——即使是没经验的作者，也能免费获得有序清理。',
            'VSCode 那种「清理逻辑和创建逻辑分家、对不对全靠作者自觉」的问题，被抽象一次性承担了。开发时保存代码，HMR 引擎原地重新应用被编辑的插件，系统其他部分的缓存和活动连接都不动。',
          ],
        },
        {
          q: 'Koishi 验证了什么？',
          a: [
            'Koishi 是建立在 Cordis 上的开源聊天机器人框架，四年多积累了 4000+ 社区插件，从 IM 适配器、数据库驱动到管理控制台都有。',
            '它验证了两件事：一是表达力与通用性——服务器机器人和它的 Web 控制台是两个完全不同的 Cordis 应用，同一套模型都撑得起来；二是开放生态里的空间可组合性——插件由互不相识的作者编写，只靠声明的共效应连接，切换存储后端或重连适配器时，只有受影响的依赖方被重新激活，依赖没就位的插件安静等待，不报错。',
            '论文也坦白了局限：证据来自单一语言、单一生态的观察性实践，是「存在且被采用」的验证，而不是与替代架构的定量对比。',
          ],
        },
      ],
    },
  },
]

const META = [
  { k: '论文', v: 'A Programming Paradigm for Spatiotemporal Composability' },
  { k: '作者', v: 'Yifan Shi · Wei Zhang（北京大学）/ Tianyi Cui（DeepSeek-AI）' },
  { k: '发布', v: '2026-08-13，与 DeepSeek Harness 同期发布（预印本持续修订）' },
]

const LINKS = [
  { label: '论文仓库 cordiverse/paper', href: 'https://github.com/cordiverse/paper' },
  { label: 'DeepSeek Harness', href: 'https://github.com/deepseek-ai/deepseek-harness' },
]

/**
 * 「Cordis：时空可组合性编程范式」：DeepSeek Harness 底层插件框架的理论基础。
 * 左侧五个要点，点击卡片打开对应概念的 Q&A 详解弹层，右侧论文信息卡片；
 * 内容依据 docs/deepseek-harness/ 下的论文原文与全文翻译。
 */
export function CordisSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  // 当前打开详解弹层的卡片下标；null 表示未打开
  const [detailIndex, setDetailIndex] = useState<number | null>(null)
  const activePoint = POINTS[activeIndex]
  const detailPoint = detailIndex == null ? null : POINTS[detailIndex]

  // 详情弹层打开期间：Esc 关闭 + 锁定页面滚动
  useEffect(() => {
    if (detailIndex == null) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDetailIndex(null)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [detailIndex])

  return (
    <section
      id="cordis"
      aria-labelledby="cordis-title"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32"
    >
      <div className="grid items-start gap-y-8 md:grid-cols-2 md:gap-x-10 lg:gap-x-16">
        <header className="md:col-span-2">
          <p className="text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
            Spatiotemporal Composability
          </p>
          <h2
            id="cordis-title"
            className="mt-4 bg-gradient-to-br from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tighter text-transparent lg:text-5xl"
          >
            DeepSeek Harness：时空可组合性编程范式
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            如果 Harness 要在运行时持续改写自身组件，每一次自我修改都是一次动态组合——不能重启、不能丢状态、不能悄悄破坏依赖方。
            这篇论文为这件事提供了形式化基础：把「修改环境」与「依赖环境」分别建模为可逆效应与响应式共效应。
          </p>
        </header>

        <ol className="space-y-3 md:col-start-1 md:self-center">
          {POINTS.map((point, i) => (
            <li key={point.en}>
              <button
                type="button"
                aria-pressed={activeIndex === i}
                onClick={() => {
                  setActiveIndex(i)
                  setDetailIndex(i)
                }}
                className={`grid w-full cursor-pointer grid-cols-[2rem_1fr] gap-3 rounded-2xl border p-4 text-left backdrop-blur-sm transition-[border-color,background-color,box-shadow,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                  activeIndex === i
                    ? 'border-indigo-300 bg-white/85 shadow-[0_16px_36px_-24px_rgba(79,70,229,0.55)] md:translate-x-1'
                    : 'border-slate-200/80 bg-white/55 hover:border-indigo-200 hover:bg-white/75'
                }`}
              >
                <span className="pt-0.5 font-mono text-[11px] font-semibold text-indigo-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block text-sm font-bold tracking-tight text-slate-900">
                    {point.zh}
                    <span className="ml-2 text-[11px] font-medium tracking-wide text-slate-400">
                      {point.en}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{point.desc}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        <aside className="md:sticky md:top-24 md:col-start-2 md:self-start">
          <figure aria-live="polite">
            <div className="overflow-hidden rounded-3xl border border-white/90 bg-white/60 shadow-[0_22px_50px_-28px_rgba(60,80,160,0.4)]">
              <Image
                key={activePoint.image}
                src={activePoint.image}
                alt={activePoint.alt}
                width={1536}
                height={1024}
                className="h-auto w-full animate-[stage-in_300ms_ease-out]"
              />
            </div>
            <figcaption className="mt-3 px-2 text-left text-[11px] leading-5 text-slate-500">
              <span className="font-semibold text-indigo-600">{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="mx-2 text-slate-300">/</span>
              {activePoint.caption}
            </figcaption>
          </figure>

          <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white/45 p-4 backdrop-blur-sm">
            <h3 className="text-sm font-bold tracking-tight text-slate-900">论文信息</h3>
            <dl className="mt-3 space-y-2">
              {META.map((item) => (
                <div key={item.k}>
                  <dt className="font-mono text-[11px] font-semibold text-indigo-500">
                    {item.k}
                  </dt>
                  <dd className="mt-0.5 text-xs leading-5 text-slate-600">{item.v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 border-t border-slate-200/70 pt-3">
              <p className="font-mono text-[11px] font-semibold text-indigo-500">链接</p>
              <ul className="mt-2 space-y-1.5">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-600 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-indigo-600 hover:decoration-indigo-300"
                    >
                      {link.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* 概念详解弹层：点击任意卡片打开对应概念的 Q&A 详解 */}
      {detailPoint && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cordis-detail-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        >
          <button
            type="button"
            aria-label="关闭详情"
            onClick={() => setDetailIndex(null)}
            className="absolute inset-0 cursor-pointer bg-slate-950/40 backdrop-blur-sm"
          />
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_32px_80px_-32px_rgba(30,40,90,0.5)] sm:p-10">
            <div className="mb-7 aspect-[3/2] overflow-hidden rounded-2xl bg-slate-50">
              <Image
                src={detailPoint.image}
                alt={detailPoint.alt}
                width={1536}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
                  Cordis · 概念详解 {String((detailIndex ?? 0) + 1).padStart(2, '0')}
                </p>
                <h3
                  id="cordis-detail-title"
                  className="mt-3 bg-gradient-to-br from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl"
                >
                  {detailPoint.zh}
                  <span className="ml-3 align-middle text-sm font-medium tracking-wide text-slate-400">
                    {detailPoint.en}
                  </span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {detailPoint.detail.intro}
                </p>
              </div>
              <button
                type="button"
                aria-label="关闭"
                onClick={() => setDetailIndex(null)}
                className="shrink-0 cursor-pointer rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-indigo-200 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                关闭
              </button>
            </div>

            <div className="mt-8 space-y-7">
              {detailPoint.detail.qa.map((item, i) => (
                <section key={item.q}>
                  <h4 className="flex items-baseline gap-3 text-sm font-bold tracking-tight text-slate-900 sm:text-base">
                    <span className="font-mono text-[11px] font-semibold text-indigo-500">
                      Q{i + 1}
                    </span>
                    {item.q}
                  </h4>
                  <div className="mt-2.5 space-y-2.5 border-l-2 border-indigo-100 pl-4">
                    {item.a.map((para) => (
                      <p key={para} className="text-sm leading-relaxed text-slate-600">
                        {para}
                      </p>
                    ))}
                  </div>
                  {'image' in item ? (
                    <figure className="mt-5">
                      <div className="aspect-[3/2] overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50">
                        <Image
                          src={item.image!}
                          alt={item.alt ?? ''}
                          width={1536}
                          height={1024}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <figcaption className="mt-2.5 px-1 text-[11px] leading-5 text-slate-500">
                        {item.caption}
                      </figcaption>
                    </figure>
                  ) : null}
                </section>
              ))}
            </div>

            <p className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-xs leading-5 text-indigo-700">
              {detailPoint.detail.source}，完整译文见 docs/deepseek-harness/ 目录。
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
