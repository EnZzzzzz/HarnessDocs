'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { HARNESS_PARTS, type HarnessPart } from './harness-data'

/** 卡片在设计坐标系里的尺寸（px） */
const CARD_W = 272
const CARD_H = 176
const GAP = 28

/** 堆叠状态：确定性的伪随机散落（手写，避免每次渲染变化） */
const PILE = [
  { x: -14, y: -10, r: -8 },
  { x: 10, y: 6, r: 5 },
  { x: -6, y: 12, r: -3 },
  { x: 16, y: -4, r: 7 },
  { x: -18, y: 2, r: -6 },
  { x: 4, y: -14, r: 3 },
]

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v))
}

/**
 * 「Harness 是什么」板块：六张职责卡片初始随机堆叠在画面中心，
 * 随滚动逐张展开平铺成网格（快进慢出）；展开后点击卡片查看详情。
 */
export function HarnessSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [active, setActive] = useState<HarnessPart | null>(null)

  const update = useCallback(() => {
    const track = trackRef.current
    const stage = stageRef.current
    if (!track || !stage) return
    const vh = window.innerHeight
    const rect = track.getBoundingClientRect()
    // 整个轨道上的滚动进度 0 → 1
    const p = clamp01(-rect.top / Math.max(1, rect.height - vh))

    const W = stage.clientWidth
    const H = stage.clientHeight
    // 窄屏退化为 2 列 × 3 行
    const cols = W >= 640 ? 3 : 2
    const rows = Math.ceil(HARNESS_PARTS.length / cols)
    // 整体缩放，保证网格完整放进舞台
    const gridW = cols * CARD_W + (cols - 1) * GAP
    const gridH = rows * CARD_H + (rows - 1) * GAP
    const s = Math.min(1.1, W / (gridW + 24), H / (gridH + 24))

    cardRefs.current.forEach((el, i) => {
      if (!el) return
      // 每张卡错开一点起步，逐张展开
      const pi = easeInOutCubic(clamp01((p - 0.1 - i * 0.05) / 0.55))
      const col = i % cols
      const row = Math.floor(i / cols)
      const fx = (col - (cols - 1) / 2) * (CARD_W + GAP) * s
      const fy = (row - (rows - 1) / 2) * (CARD_H + GAP) * s
      const pile = PILE[i % PILE.length]
      const x = pile.x + (fx - pile.x) * pi
      const y = pile.y + (fy - pile.y) * pi
      const r = pile.r * (1 - pi)
      const scale = (0.92 + 0.08 * pi) * s
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${r.toFixed(2)}deg) scale(${scale.toFixed(3)})`
      el.style.pointerEvents = pi > 0.85 ? 'auto' : 'none'
      el.style.zIndex = String(10 + i)
    })
  }, [])

  useEffect(() => {
    let raf = 0
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
  }, [update])

  // 详情弹层：Esc 关闭 + 锁定背景滚动
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [active])

  return (
    <div id="harness" className="mx-auto w-full max-w-6xl scroll-mt-4 px-6">
      {/* 段落引子 */}
      <div className="flex flex-col items-start gap-6 pt-10 pb-20">
        <p className="rounded-full border border-indigo-200/70 bg-white/60 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-600 backdrop-blur">
          Anatomy · Agent = Model + Harness
        </p>
        <h2 className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-5xl font-bold tracking-tighter text-transparent sm:text-6xl">
          Harness 是什么？
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600">
          模型只负责推理和生成，剩下的全归 Harness：它把观察、上下文、控制循环、动作、
          状态与验证接成一个闭环，让模型输出变成可验证、可恢复的动作。
          按综述 arXiv:2606.20683 的形式化定义，Harness 有六个相互耦合的运行时职责。
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ChevronDown className="size-4 animate-bounce" />
          继续滚动 · 展开六张卡片
        </div>
      </div>

      {/* 堆叠 → 展开的滚动轨道 */}
      <div ref={trackRef} className="relative h-[260vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center">
          <div ref={stageRef} className="relative h-[62vh] max-h-[560px] w-full">
            {HARNESS_PARTS.map((part, i) => {
              const pile = PILE[i % PILE.length]
              return (
                <button
                  key={part.symbol}
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  type="button"
                  onClick={() => setActive(part)}
                  className="group absolute top-1/2 left-1/2 flex cursor-pointer flex-col items-start rounded-2xl border border-white bg-white/90 p-5 text-left shadow-[0_18px_40px_-18px_rgba(60,80,160,0.35)] backdrop-blur transition-colors hover:border-indigo-200 hover:bg-white"
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    marginLeft: -CARD_W / 2,
                    marginTop: -CARD_H / 2,
                    transform: `translate3d(${pile.x}px, ${pile.y}px, 0) rotate(${pile.r}deg) scale(0.92)`,
                  }}
                >
                  <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-indigo-500">
                    {part.symbol}
                  </span>
                  <span className="mt-2.5 text-lg font-bold tracking-tight text-slate-800">
                    {part.name}
                  </span>
                  <span className="text-[11px] font-medium tracking-wide text-slate-400">
                    {part.en}
                  </span>
                  <span className="mt-auto pt-3 text-xs leading-relaxed text-slate-500">
                    {part.tagline}
                  </span>
                  <span className="absolute right-4 bottom-4 text-[11px] font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
                    查看详情 →
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 职责详情弹层 */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setActive(null)}
        >
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />
          <article
            className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white bg-white p-8 shadow-2xl shadow-indigo-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute top-5 right-5 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="关闭"
            >
              <X className="size-4" />
            </button>
            <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-indigo-500">
              {active.symbol}
            </span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              {active.name}
              <span className="ml-2.5 text-sm font-medium text-slate-400">{active.en}</span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{active.detail}</p>
            <p className="mt-6 text-xs font-semibold tracking-wider text-slate-400">
              代表性实践
            </p>
            <ul className="mt-2.5 space-y-2.5">
              {active.examples.map((ex) => (
                <li key={ex} className="flex gap-2.5 text-sm leading-relaxed text-slate-500">
                  <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-indigo-300" />
                  {ex}
                </li>
              ))}
            </ul>
          </article>
        </div>
      )}
    </div>
  )
}
