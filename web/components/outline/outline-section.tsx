'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { OutlineCard, OutlineSectionData } from './outline-data'

/**
 * 大纲章节通用组件：一页 = 顶部小胶囊 + 大标题 + 引言 + 卡片网格。
 * 卡片样式与 Harness 六职责板块一致；有 detail/points 的卡片可点开详情弹层
 * （弹层结构同样复用 Harness 板块：独立合成层 + 弱化关闭按钮 + 自动隐藏细滚动条）。
 */
export function OutlineSection({ data }: { data: OutlineSectionData }) {
  const [active, setActive] = useState<OutlineCard | null>(null)
  // 详情弹层滚动条自动隐藏：仅在滚动中/悬停时显现
  const [scrolling, setScrolling] = useState(false)
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleDetailScroll = useCallback(() => {
    setScrolling(true)
    if (scrollTimer.current) clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => setScrolling(false), 800)
  }, [])

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

  // 竖向卡片：收窄列宽（列数增多 / 限制网格总宽），拉高卡片最小高度
  const cols =
    data.cards.length <= 2
      ? 'sm:grid-cols-2 sm:max-w-2xl'
      : data.cards.length === 3
        ? 'sm:grid-cols-3 sm:max-w-4xl'
        : 'sm:grid-cols-3 lg:grid-cols-4'

  return (
    <section
      id={data.id}
      className="mx-auto flex min-h-screen w-full max-w-6xl scroll-mt-4 flex-col justify-center px-6 py-24"
    >
      <div className="flex max-w-2xl flex-col items-start gap-5">
        <p className="rounded-full border border-indigo-200/70 bg-white/60 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-600 backdrop-blur">
          {data.kicker}
        </p>
        <h2 className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-5xl">
          {data.title}
        </h2>
        {data.intro && (
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            {data.intro}
          </p>
        )}
      </div>

      <div className={`mt-12 grid gap-5 ${cols}`}>
        {data.cards.map((card) => {
          const hasDetail = Boolean(card.detail || card.points?.length)
          return (
            <button
              key={card.badge + card.title}
              type="button"
              onClick={hasDetail ? () => setActive(card) : undefined}
              className={`group relative flex min-h-[190px] flex-col items-start overflow-hidden rounded-2xl border border-white bg-white/90 text-left shadow-[0_18px_40px_-18px_rgba(60,80,160,0.35)] backdrop-blur transition-all hover:-translate-y-1 hover:border-indigo-200 hover:bg-white sm:min-h-[340px] ${
                hasDetail ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {card.cover && (
                <span className="block h-40 w-full shrink-0 overflow-hidden border-b border-indigo-100/70 bg-indigo-50/40">
                  {/* eslint-disable-next-line @next/next/no-img-element -- 本地静态封面图 */}
                  <img
                    src={card.cover.src}
                    alt={card.cover.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                </span>
              )}
              <span className="flex w-full flex-1 flex-col items-start p-6">
                <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-indigo-500">
                  {card.badge}
                </span>
                <span className="mt-3 text-lg font-bold tracking-tight text-slate-800">
                  {card.title}
                </span>
                {card.en && (
                  <span className="mt-1 text-[11px] font-medium tracking-wide text-slate-400">
                    {card.en}
                  </span>
                )}
                <span className="mt-3 text-sm leading-relaxed text-slate-500">
                  {card.tagline}
                </span>
              </span>
              {hasDetail && (
                <span className="absolute right-5 bottom-4 text-[11px] font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
                  查看详情 →
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 卡片详情弹层 */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setActive(null)}
        >
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />
          {/* translateZ(0)：强制弹层独立合成层，避免被遮罩的 backdrop-blur 一并模糊 */}
          <article
            className={`flex max-h-[85vh] w-full [transform:translateZ(0)] flex-col overflow-hidden rounded-3xl border border-white bg-white shadow-2xl shadow-indigo-500/20 ${
              active.images?.length || active.cover ? 'max-w-3xl' : 'max-w-xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {active.cover && (
              <div className="h-52 w-full shrink-0 border-b border-indigo-100/70 bg-indigo-50/40 sm:h-64">
                {/* eslint-disable-next-line @next/next/no-img-element -- 本地静态封面图 */}
                <img
                  src={active.cover.src}
                  alt={active.cover.alt}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex min-h-0 flex-1 flex-col p-8">
              {/* 头部：徽章 + 弱化关闭按钮（常规布局，不浮动） */}
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-indigo-500">
                  {active.badge}
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
                  {active.title}
                  {active.en && (
                    <span className="ml-2.5 text-sm font-medium text-slate-400">
                      {active.en}
                    </span>
                  )}
                </h3>
                {active.detail && (
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {active.detail}
                  </p>
                )}
              {active.images && active.images.length > 0 && (
                <div className="mt-5 space-y-4">
                  {active.images.map((image) => (
                    <figure key={image.src}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- 本地静态配图，无需优化管线 */}
                      <img
                        src={image.src}
                        alt={image.caption ?? active.title}
                        className="w-full rounded-xl border border-slate-100 bg-white"
                      />
                      {(image.caption || image.source) && (
                        <figcaption className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
                          {image.caption}
                          {image.source && (
                            <span className="block font-mono break-all">
                              {image.source}
                            </span>
                          )}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}
              {active.points && active.points.length > 0 && (
                <ul className="mt-5 space-y-2.5">
                  {active.points.map((point) => (
                    <li
                      key={point.text}
                      className="flex gap-2.5 text-sm leading-relaxed text-slate-500"
                    >
                      <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-indigo-300" />
                      <span>
                        {point.text}
                        {point.source && (
                          <span className="mt-0.5 block font-mono text-[11px] break-all text-slate-400">
                            {point.source}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  )
}
