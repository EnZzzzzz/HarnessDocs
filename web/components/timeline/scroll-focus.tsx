'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

/**
 * 滚动焦点容器：监听滚动，对内部所有 [data-fade-row] 元素
 * 按其与视口中心的距离做渐变——上方淡出、下方淡入，焦点始终保持在画面中间。
 */
export function ScrollFocus({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    let raf = 0

    const update = () => {
      const vh = window.innerHeight
      const focus = vh * 0.5
      const rows = root.querySelectorAll<HTMLElement>('[data-fade-row]')
      rows.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        // 距焦点带的距离，0 = 正中心，1 = 视口边缘
        const dist = Math.abs(center - focus) / (vh * 0.5)
        // 中心 ±18% 内完全清晰，向外渐隐
        let opacity = 1 - Math.max(0, dist - 0.18) / 0.82
        // 已滚过顶部的事件加速淡出
        if (center < vh * 0.22) {
          opacity *= Math.max(0, center / (vh * 0.22)) * 0.9
        }
        opacity = Math.min(1, Math.max(0.04, opacity))
        const blur = (1 - opacity) * 2.2
        const shift = (center - focus) * 0.045
        el.style.opacity = opacity.toFixed(3)
        el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none'
        el.style.transform = `translateY(${shift.toFixed(1)}px)`
      })
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

  return (
    <div ref={ref} style={{ '--focus': '1' } as CSSProperties}>
      {children}
    </div>
  )
}
