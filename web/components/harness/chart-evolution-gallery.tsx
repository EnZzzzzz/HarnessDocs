'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import type { Point } from './self-evolution-sections'
import { PointDetailDialog } from './point-cards'

type GalleryImage = {
  src: string
  alt: string
  caption: string
}

export function ChartEvolutionGallery({
  id,
  points,
  images,
  detailEyebrow,
}: {
  id: string
  points: Point[]
  images: GalleryImage[]
  detailEyebrow: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [detailIndex, setDetailIndex] = useState<number | null>(null)
  // 图片点击放大：true 时以原比例全屏展示当前配图，点击遮罩或 Esc 关闭
  const [zoomed, setZoomed] = useState(false)
  const activeImage = images[activeIndex]

  useEffect(() => {
    if (!zoomed) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomed(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoomed])

  return (
    <div className="contents">
      <ol className="space-y-3 md:col-start-1 md:self-center">
        {points.map((point, index) => {
          const isActive = index === activeIndex

          return (
            <li key={point.en}>
              <button
                type="button"
                aria-pressed={isActive}
                aria-controls={id}
                aria-label={`查看配图和详情：${point.zh}`}
                onClick={() => {
                  setActiveIndex(index)
                  if (point.detail) setDetailIndex(index)
                }}
                className={`grid w-full grid-cols-[2rem_1fr] gap-3 rounded-2xl border p-4 text-left backdrop-blur-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                  isActive
                    ? 'border-indigo-300 bg-indigo-50/80 shadow-sm ring-1 ring-indigo-200'
                    : 'border-slate-200/80 bg-white/55 hover:border-indigo-200 hover:bg-white/80'
                }`}
              >
                <span
                  className={`pt-0.5 font-mono text-[11px] font-semibold transition-colors ${
                    isActive ? 'text-indigo-700' : 'text-indigo-500'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block text-sm font-bold tracking-tight text-slate-900">
                    {point.zh}
                    <span className="ml-2 text-[11px] font-medium tracking-wide text-slate-400">
                      {point.en}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {point.desc}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <figure
        id={id}
        aria-live="polite"
        className="md:col-start-2 md:self-center"
      >
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label={`放大查看配图：${activeImage.alt}`}
          className="block w-full cursor-zoom-in rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <div className="aspect-[3/2] overflow-hidden rounded-3xl bg-white/40">
            <Image
              key={activeImage.src}
              src={activeImage.src}
              alt={activeImage.alt}
              width={1536}
              height={1024}
              className="h-full w-full animate-in object-cover fade-in duration-300"
            />
          </div>
        </button>
        <figcaption className="mt-3 px-1 text-left text-[11px] leading-5 text-slate-400">
          {activeImage.caption}
        </figcaption>
      </figure>

      {/* 点击放大层：原比例展示当前配图，点击任意处或 Esc 关闭 */}
      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-slate-950/60 p-6 backdrop-blur-sm sm:p-10"
          onClick={() => setZoomed(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            className="max-h-full max-w-full animate-in rounded-2xl shadow-2xl fade-in zoom-in-95 duration-200"
          />
        </div>
      )}

      <PointDetailDialog
        point={detailIndex == null ? null : points[detailIndex]}
        pointIndex={detailIndex}
        detailEyebrow={detailEyebrow}
        image={detailIndex == null ? undefined : images[detailIndex]}
        onClose={() => setDetailIndex(null)}
      />
    </div>
  )
}
