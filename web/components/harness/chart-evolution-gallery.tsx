'use client'

import Image from 'next/image'
import { useState } from 'react'

type GalleryPoint = {
  zh: string
  en: string
  desc: string
}

type GalleryImage = {
  src: string
  alt: string
  caption: string
}

export function ChartEvolutionGallery({
  points,
  images,
}: {
  points: GalleryPoint[]
  images: GalleryImage[]
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex]

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
                aria-controls="chart-evolution-figure"
                onClick={() => setActiveIndex(index)}
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
        id="chart-evolution-figure"
        aria-live="polite"
        className="md:col-start-2 md:self-center"
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
        <figcaption className="mt-3 px-1 text-left text-[11px] leading-5 text-slate-400">
          {activeImage.caption}
        </figcaption>
      </figure>
    </div>
  )
}
