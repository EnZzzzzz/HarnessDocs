'use client'

import Image from 'next/image'
import { X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export type DetailDialogCover = {
  src: string
  alt: string
}

/**
 * 全局详情弹层骨架。视觉与交互以 OutlineSection 详情卡为基准：
 * 顶部固定封面、固定头部、正文独立滚动、自动隐藏细滚动条。
 */
export function DetailDialogFrame({
  titleId,
  eyebrow,
  title,
  cover,
  children,
  onClose,
}: {
  titleId: string
  eyebrow: ReactNode
  title: ReactNode
  cover?: DetailDialogCover
  children: ReactNode
  onClose: () => void
}) {
  const [scrolling, setScrolling] = useState(false)
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleScroll = useCallback(() => {
    setScrolling(true)
    if (scrollTimer.current) clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => setScrolling(false), 800)
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />
      <article
        className={`flex max-h-[85vh] w-full [transform:translateZ(0)] flex-col overflow-hidden rounded-3xl border border-white bg-white shadow-2xl shadow-indigo-500/20 ${
          cover ? 'max-w-3xl' : 'max-w-xl'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {cover ? (
          <div className="h-52 w-full shrink-0 border-b border-indigo-100/70 bg-indigo-50/40 sm:h-64">
            <Image
              src={cover.src}
              alt={cover.alt}
              width={1536}
              height={1024}
              sizes="(min-width: 768px) 768px, calc(100vw - 48px)"
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col p-8">
          <div className="flex items-center justify-between gap-6">
            <div className="rounded-md bg-indigo-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-indigo-500">
              {eyebrow}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="-m-1 p-1 text-slate-300 transition-colors hover:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              aria-label="关闭"
            >
              <X className="size-4" />
            </button>
          </div>

          <div
            data-scrolling={scrolling || undefined}
            onScroll={handleScroll}
            className="mt-3 min-h-0 flex-1 overflow-y-auto pr-2 [--sb:transparent] hover:[--sb:#e2e8f0] data-[scrolling]:[--sb:#e2e8f0] [scrollbar-color:var(--sb)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-(--sb) [&::-webkit-scrollbar-track]:bg-transparent"
          >
            <h3 id={titleId} className="text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h3>
            {children}
          </div>
        </div>
      </article>
    </div>
  )
}
