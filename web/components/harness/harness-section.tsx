'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { HARNESS_PARTS, type HarnessPart } from './harness-data'

/** 卡片在设计坐标系里的尺寸（px）：竖版卡片，展开后横向铺开 */
const CARD_W = 200
const CARD_H = 300
const GAP = 12
const AUTO_EXPAND_MS = 1050

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
 * 「Harness 是什么」板块：上方常驻 Harness 介绍，六张职责卡片初始随机堆叠
 * 在介绍文字右侧，随滚动逐张平铺到下方整行横排（快进慢出）；
 * 展开后点击卡片查看详情。
 */
export function HarnessSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const expandProgress = useRef(0)
  const expandRaf = useRef(0)
  const hasExpanded = useRef(false)
  const [active, setActive] = useState<HarnessPart | null>(null)
  // 详情弹层滚动条自动隐藏：仅在滚动中/悬停时显现
  const [scrolling, setScrolling] = useState(false)
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleDetailScroll = useCallback(() => {
    setScrolling(true)
    if (scrollTimer.current) clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => setScrolling(false), 800)
  }, [])

  const renderCards = useCallback((progress: number) => {
    const track = trackRef.current
    const stage = stageRef.current
    if (!track || !stage) return

    const W = stage.clientWidth
    const H = stage.clientHeight
    // 整行横向铺开
    const cols = HARNESS_PARTS.length
    // 整体缩放，保证整行完整放进舞台
    const gridW = cols * CARD_W + (cols - 1) * GAP
    const s = Math.min(1, W / (gridW + 16), H / (CARD_H + 16))

    // 未展开时卡片堆的位置：水平方向取介绍文字右侧空白区域的中心，
    // 垂直方向与「标题 + 副标题」居中对齐（换算到舞台中心坐标系）
    let pileX = 0
    let pileY = 0
    const intro = introRef.current
    const title = titleRef.current
    if (intro) {
      const stageRect = stage.getBoundingClientRect()
      const introRect = intro.getBoundingClientRect()
      const half = (CARD_W * s) / 2
      const stageCX = stageRect.left + stageRect.width / 2
      const freeW = stageRect.right - introRect.right
      if (freeW > CARD_W * s + 32) {
        pileX = (introRect.right + stageRect.right) / 2 - stageCX
      }
      // 防止堆叠溢出舞台两侧
      pileX = Math.min(pileX, stageRect.width / 2 - half - 8)
      pileX = Math.max(pileX, -stageRect.width / 2 + half + 8)
      const anchor = title ?? intro
      const anchorRect = anchor.getBoundingClientRect()
      pileY =
        (anchorRect.top + anchorRect.bottom) / 2 -
        (stageRect.top + stageRect.height / 2)
    }

    cardRefs.current.forEach((el, i) => {
      if (!el) return
      // 每张卡错开一点起步，从左往右逐张铺开
      const pi = easeInOutCubic(clamp01((progress - i * 0.055) / 0.725))
      const fx = (i - (cols - 1) / 2) * (CARD_W + GAP) * s
      const fy = 0
      const pile = PILE[i % PILE.length]
      const sx = pileX + pile.x
      const sy = pileY + pile.y
      const x = sx + (fx - sx) * pi
      const y = sy + (fy - sy) * pi
      const r = pile.r * (1 - pi)
      const scale = (0.92 + 0.08 * pi) * s
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${r.toFixed(2)}deg) scale(${scale.toFixed(3)})`
      el.style.pointerEvents = pi > 0.85 ? 'auto' : 'none'
      el.style.zIndex = String(10 + i)
    })
  }, [])

  const startAutoExpand = useCallback(() => {
    if (hasExpanded.current) return
    hasExpanded.current = true

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      expandProgress.current = 1
      renderCards(1)
      return
    }

    const from = expandProgress.current
    const startedAt = performance.now()
    const animate = (now: number) => {
      const elapsed = clamp01((now - startedAt) / AUTO_EXPAND_MS)
      expandProgress.current = from + (1 - from) * elapsed
      renderCards(expandProgress.current)
      if (elapsed < 1) expandRaf.current = requestAnimationFrame(animate)
    }
    expandRaf.current = requestAnimationFrame(animate)
  }, [renderCards])

  useEffect(() => {
    let scrollRaf = 0
    const updateFromViewport = () => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const triggerDistance = Math.min(72, window.innerHeight * 0.06)

      // 离开板块上方后允许下次进入时重新播放；进入后轻滚一下即自动播完。
      if (rect.top > window.innerHeight * 0.2) {
        cancelAnimationFrame(expandRaf.current)
        hasExpanded.current = false
        expandProgress.current = 0
        renderCards(0)
      } else if (rect.top <= -triggerDistance) {
        startAutoExpand()
      } else {
        renderCards(expandProgress.current)
      }
    }
    const schedule = () => {
      cancelAnimationFrame(scrollRaf)
      scrollRaf = requestAnimationFrame(updateFromViewport)
    }
    updateFromViewport()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(scrollRaf)
      cancelAnimationFrame(expandRaf.current)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [renderCards, startAutoExpand])

  // 详情弹层：Esc 关闭 + 锁定背景滚动
  useEffect(() => {
    if (!active) {
      setScrolling(false)
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
      return
    }
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
      {/* 堆叠 → 横向平铺的滚动轨道 */}
      <div ref={trackRef} className="relative h-[175vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center gap-8">
          {/* 上：常驻的 Harness 介绍（卡片堆未展开时停在它右侧） */}
          <div
            ref={introRef}
            className="flex w-full max-w-sm shrink-0 flex-col items-start gap-6 pt-16 lg:pt-0"
          >
            <p className="rounded-full border border-indigo-200/70 bg-white/60 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-600 backdrop-blur">
              Anatomy · Agent = Model + Harness
            </p>
            <div ref={titleRef} className="flex flex-col gap-6">
              <h2 className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-5xl">
                Harness 是什么？
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                模型只负责推理和生成，剩下的全归 Harness：它把观察、上下文、控制循环、动作、
                状态与验证接成一个闭环，让模型输出变成可验证、可恢复的动作。
                按综述 arXiv:2606.20683 的形式化定义，Harness 有六个相互耦合的运行时职责。
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ChevronDown className="size-4 animate-bounce" />
              轻轻滚动 · 自动展开六张卡片
            </div>
          </div>

          {/* 下：卡片堆 → 横向平铺成一整行 */}
          <div ref={stageRef} className="relative min-h-[280px] w-full flex-1">
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
                  className="group absolute top-1/2 left-1/2 flex cursor-pointer flex-col items-start justify-center rounded-2xl border border-white bg-white/90 px-5 py-4 text-left shadow-[0_18px_40px_-18px_rgba(60,80,160,0.35)] backdrop-blur transition-colors hover:border-indigo-200 hover:bg-white"
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
                  <span className="mt-3 text-base font-bold tracking-tight text-slate-800">
                    {part.name}
                  </span>
                  <span className="mt-1 text-[11px] font-medium tracking-wide text-slate-400">
                    {part.en}
                  </span>
                  <span className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-500">
                    {part.tagline}
                  </span>
                  <span className="absolute right-4 bottom-3 text-[11px] font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
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
          {/* translateZ(0)：强制弹层独立合成层，避免被遮罩的 backdrop-blur 一并模糊 */}
          <article
            className="flex max-h-[85vh] w-full max-w-xl [transform:translateZ(0)] flex-col rounded-3xl border border-white bg-white p-8 shadow-2xl shadow-indigo-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 卡片头部：符号徽章 + 弱化关闭按钮（常规布局，不浮动） */}
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-indigo-500">
                {active.symbol}
              </span>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="-m-1 p-1 text-slate-300 transition-colors hover:text-slate-500"
                aria-label="关闭"
              >
                <X className="size-4" />
              </button>
            </div>
            {/* 滚动区域收进卡片内边距里：细滚动条、透明轨道、自动隐藏 */}
            <div
              data-scrolling={scrolling || undefined}
              onScroll={handleDetailScroll}
              className="mt-3 min-h-0 flex-1 overflow-y-auto pr-2 [--sb:transparent] hover:[--sb:#e2e8f0] data-[scrolling]:[--sb:#e2e8f0] [scrollbar-color:var(--sb)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-(--sb) [&::-webkit-scrollbar-track]:bg-transparent"
            >
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {active.name}
              <span className="ml-2.5 text-sm font-medium text-slate-400">{active.en}</span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{active.detail}</p>
            <p className="mt-6 text-xs font-semibold tracking-wider text-slate-400">
              真实实现 · 来自 Codex / Claude Code 源码调研
            </p>
            {active.implementations.map((impl) => (
              <div key={impl.product} className="mt-4">
                <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-500">
                  {impl.product}
                </span>
                <ul className="mt-2.5 space-y-2.5">
                  {impl.points.map((point) => (
                    <li
                      key={point.text}
                      className="flex gap-2.5 text-sm leading-relaxed text-slate-500"
                    >
                      <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-indigo-300" />
                      <span>
                        {point.text}
                        {point.source && (
                          <span className="mt-0.5 block font-mono text-[11px] text-slate-400">
                            {point.source}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            </div>
          </article>
        </div>
      )}
    </div>
  )
}
