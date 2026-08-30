'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

const AGENT_LAYERS = [
  {
    number: '04',
    name: 'Runtime',
    description: '组织规划、记忆、调度与反馈，让 Agent 持续运行。',
  },
  {
    number: '03',
    name: 'Tools',
    description: '连接浏览器、终端、数据库与外部服务。',
  },
  {
    number: '02',
    name: 'Skill',
    description: '沉淀领域知识、规则与可复用的方法。',
  },
  {
    number: '01',
    name: 'LLM',
    description: '负责理解、推理并决定下一步行动。',
  },
] as const

export function HarnessSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  // 区块进入视口时触发一次入场动画（卡片自左、配图自右）
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="harness"
      aria-labelledby="harness-title"
      className={`mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32 ${inView ? 'harness-inview' : ''}`}
    >
      <div className="grid items-start gap-y-8 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:gap-x-10 lg:gap-x-16">
        <header className="md:col-start-1 md:row-start-1">
          <p className="text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
            Agent = Model + Harness
          </p>
          <h2
            id="harness-title"
            className="mt-4 bg-gradient-to-br from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tighter text-transparent lg:text-5xl"
          >
            Agent 的四层架构
          </h2>
          <p className="mt-3 text-base font-medium text-slate-500 sm:text-lg">
            Agent = Model + Harness
          </p>
        </header>

        <ol className="space-y-3 md:col-start-1 md:row-start-2">
          {AGENT_LAYERS.map((layer, i) => (
            <li
              key={layer.number}
              style={{ '--d': `${i * 0.12}s` } as CSSProperties}
              className="harness-card grid grid-cols-[2rem_1fr] gap-3 rounded-2xl border border-slate-200/80 bg-white/55 p-4 backdrop-blur-sm"
            >
              <span className="pt-0.5 font-mono text-[11px] font-semibold text-indigo-500">
                {layer.number}
              </span>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-slate-900">
                  {layer.name}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {layer.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <figure
          style={{ '--d': '0.35s' } as CSSProperties}
          className="harness-figure md:col-start-2 md:row-start-2"
        >
          <div className="overflow-hidden rounded-3xl">
            <Image
              src="/harness/agent-four-layer-architecture.png"
              alt="Agent 四层架构：从下到上依次为 LLM、Skill、Tools 与 Runtime"
              width={1536}
              height={1024}
              sizes="(min-width: 1152px) 630px, (min-width: 768px) 55vw, calc(100vw - 48px)"
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mt-3 px-2 text-center text-[11px] leading-5 text-slate-400">
            四层能力由下至上逐级组合：模型提供智能，Harness 将知识、工具与运行机制组织成完整的 Agent。
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
