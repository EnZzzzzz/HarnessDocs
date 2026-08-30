'use client'

import Image from 'next/image'
import { useState } from 'react'

const POINTS = [
  {
    zh: '动态组合缺乏形式化基础',
    en: 'Dynamic Composition',
    desc: '插件系统与自进化 Agent Harness 都要在运行时装卸组件，但现有实践只有粗粒度权宜之计——重启进程、重编排容器，运行时状态被整体丢弃。',
    image: '/outline/cordis-dynamic-composition.png',
    alt: '粗粒度重启导致运行状态散失，与不中断任务的组件热插拔形成对比',
    caption: '左侧是粗粒度方案：为了更换一个组件重启整台系统，正在运行的状态随之丢失；右侧是动态组合的目标：只替换目标模块，主进程与任务状态继续运行。',
  },
  {
    zh: '两个正交维度：时间 × 空间',
    en: 'Temporal × Spatial',
    desc: '时间可组合性：组件被移除时，它对共享环境的副作用能被完全、有序地回滚。空间可组合性：组件间的依赖被显式声明，并以响应式方式解析与协调。',
    image: '/outline/cordis-temporal-spatial.png',
    alt: '中心组件沿时间轴回滚自身副作用，同时沿空间轴响应周围依赖的出现与消失',
    caption: '两条正交轴描述同一组件：时间轴保证卸载时只撤回它留下的副作用；空间轴持续观察依赖变化，让相关组件自动激活或失活。',
  },
  {
    zh: '把效应与共效应提升为运行时机制',
    en: 'Revertible Effect & Reactive Coeffect',
    desc: '可逆效应：每次上下文变换都携带一个由运行时持有的逆变换，卸载时按 LIFO 自动回滚。响应式共效应：依赖规约把每次上下文变化分类为激活 / 失活 / 中性，驱动组件生命周期。',
    image: '/outline/cordis-effect-coeffect.png',
    alt: '运行时左侧堆叠每次变更的逆操作，右侧根据依赖是否满足控制组件灯的亮灭',
    caption: '每次修改都会留下配对的逆操作，卸载时按后进先出顺序恢复；依赖传感器则把环境变化分类，驱动消费者激活、失活或保持不变。',
  },
  {
    zh: '上下文范式与动态组合演算',
    en: 'Context Paradigm',
    desc: '效应上下文与共效应上下文统一为单一的上下文类型，一切操作经其中介；这种中介诱导出观察等价，不同组件的效应可交错执行而互不干扰，元理论把保证从单组件推广到整个系统。',
    image: '/outline/cordis-context-paradigm.png',
    alt: '多个组件的彩色操作流经过统一上下文交错执行，移除一条流后其他输出保持不变',
    caption: '所有效应与依赖都经过统一上下文中介。不同组件的操作可以交错，但仍保持独立；抽走其中一条，观察者看到的其他组件行为不变。',
  },
  {
    zh: 'Cordis 实现与 Koishi 验证',
    en: 'Cordis & Koishi',
    desc: 'Cordis 元框架 = 效应跟踪核心库 + 声明式组件加载器（配置协调、热模块替换），是 DeepSeek Harness 的底层插件框架；Koishi 4000+ 社区插件的生产实践验证：插件作者无需手写卸载路径即可获得有序清理。',
    image: '/outline/cordis-koishi.png',
    alt: '三层平台从效应跟踪核心、声明式加载器延伸到大量可独立装卸的社区插件',
    caption: '底层核心负责效应跟踪与依赖解析，中层加载器负责配置协调和热替换，上层承载开放插件生态；模块卸载时，其资源会沿原路径自动收回。',
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
 * 左侧五个要点，右侧论文信息卡片；内容依据
 * docs/deepseek-harness/ 下的论文原文与全文翻译。
 */
export function CordisSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activePoint = POINTS[activeIndex]

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
                onClick={() => setActiveIndex(i)}
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
    </section>
  )
}
