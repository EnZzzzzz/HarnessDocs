'use client'

import { useEffect, useState } from 'react'
import { THEME_META, type ThemeId } from './timeline-data'

/**
 * 吸顶主题条：随滚动自动切换当前阶段。
 * 事件流严格按时间排列，主题条读取各行的 data-stage，
 * 焦点线（视口上方 35%）扫过哪个阶段的事件，就常驻显示哪个主题。
 */
export function StageHeader() {
  const [stage, setStage] = useState<ThemeId>('prompt')

  useEffect(() => {
    let raf = 0
    const update = () => {
      const focus = window.innerHeight * 0.35
      const rows = document.querySelectorAll('[data-stage]')
      let current: ThemeId = 'prompt'
      rows.forEach((row) => {
        if (row.getBoundingClientRect().top < focus) {
          current = row.getAttribute('data-stage') as ThemeId
        }
      })
      setStage((prev) => (prev === current ? prev : current))
    }
    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  const meta = THEME_META[stage]

  return (
    <div className="sticky top-5 z-30 mb-12 rounded-2xl border border-white/70 bg-[#f2f5fd]/80 px-6 py-5 shadow-[0_8px_30px_-12px_rgba(80,100,180,0.3)] backdrop-blur-xl">
      <div key={stage} className="stage-switch">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="bg-gradient-to-br from-slate-900 to-indigo-800 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            {meta.keyword}
          </h3>
          <span className="text-sm font-medium text-indigo-500">{meta.en}</span>
          <span className="ml-auto font-mono text-xs tracking-wider text-slate-400">
            {meta.rangeLabel}
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          {meta.description}
        </p>
      </div>
    </div>
  )
}
