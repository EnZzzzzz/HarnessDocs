'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { HARNESS_PARTS, type HarnessPart } from './harness-data'

/** 卡片在设计坐标系里的尺寸（px）：竖版卡片，展开后横向铺开 */
const CARD_W = 200
const CARD_H = 300
const GAP = 12
const AUTO_EXPAND_MS = 1050

const HARNESS_ILLUSTRATIONS: Record<
  string,
  {
    concept: { src: string; alt: string; caption: string }
    mechanism: { src: string; alt: string; caption: string }
    evolution: { src: string; alt: string; caption: string }
  }
> = {
  I_obs: {
    concept: {
      src: '/harness/observation-concept.png',
      alt: '观察接口把终端、代码、网页与性能信号过滤成模型可消费观察的手绘插画',
      caption: '观察接口像一座感官中枢：它接收终端、代码、网页与性能信号，再过滤成少量、清晰、与当前决策有关的观察。',
    },
    mechanism: {
      src: '/harness/observation-mechanism.png',
      alt: '长日志经过首尾保留与按需拉取机制提取有效信号的手绘插画',
      caption: '面对超长输出，Harness 保留信息密度最高的首尾，并让模型按需拉取后续结果，避免噪声挤占上下文。',
    },
    evolution: {
      src: '/harness/observation-evolution.png',
      alt: 'Agent 为自己接入浏览器视觉通道并开始检查页面的手绘插画',
      caption: '当终端不足以判断页面质量时，Agent 可以为自己接入截图与浏览器检查能力，让观察接口随任务生长。',
    },
  },
  C: {
    concept: {
      src: '/harness/context-concept.png',
      alt: 'Harness 从记忆、技能与文件档案中选择少量信息放入有限上下文的手绘插画',
      caption: '上下文窗口是一张有限的工作台；Harness 的职责是从庞大档案中挑出此刻真正需要的信息。',
    },
    mechanism: {
      src: '/harness/context-mechanism.png',
      alt: '对话历史经过分级压缩且技能按需展开的手绘插画',
      caption: '旧工具结果、对话历史和技能说明依次被裁剪、折叠或按需展开，以有限 token 维持长任务。',
    },
    evolution: {
      src: '/harness/context-evolution.png',
      alt: '模型在活动上下文与外置档案之间自主调度记忆的手绘插画',
      caption: '更进一步，模型可以自己决定记什么、移出什么、何时重新读取，让上下文管理从固定规则变成主动调度。',
    },
  },
  L: {
    concept: {
      src: '/harness/control-loop-concept.png',
      alt: '观察、推理、行动与反馈围绕模型持续循环的手绘插画',
      caption: '模型只决定下一步；Harness 让观察、推理、行动与反馈首尾相接，形成可以持续推进任务的闭环。',
    },
    mechanism: {
      src: '/harness/control-loop-mechanism.png',
      alt: '确定性流水线与模型决策分支共同编排任务的手绘插画',
      caption: '权限、执行和结果回灌走确定性轨道，真正需要判断的位置才交给模型或子 Agent。',
    },
    evolution: {
      src: '/harness/control-loop-evolution.png',
      alt: '新会话接力推进任务并由异步复盘支线改进循环的手绘插画',
      caption: '循环可以在每轮换用干净上下文，并在任务结束后分出异步复盘支线，把经验写回下一轮。',
    },
  },
  I_act: {
    concept: {
      src: '/harness/action-concept.png',
      alt: '模型意图经过 Harness 转换成终端、文件、浏览器与外部工具动作的手绘插画',
      caption: '模型并不直接操作世界；动作接口把抽象意图转换成终端、文件、浏览器和外部工具能够执行的调用。',
    },
    mechanism: {
      src: '/harness/action-mechanism.png',
      alt: '结构化动作依次经过校验、权限与沙箱后执行并反馈错误的手绘插画',
      caption: '每个动作先经过结构校验、权限判断和沙箱执行；失败结果再回到模型，成为下一步修正的依据。',
    },
    evolution: {
      src: '/harness/action-evolution.png',
      alt: 'Agent 现场制造、测试并安装新插件以扩展动作集的手绘插画',
      caption: '当现有工具不够用时，Agent 可以现场开发、测试并安装插件，让可执行动作从固定集合变成可生长能力。',
    },
  },
  S: {
    concept: {
      src: '/harness/state-concept.png',
      alt: '模型上下文清空后仍从外置状态仓库恢复任务的手绘插画',
      caption: '模型可以失忆、上下文可以清空，但计划、进度、日志、diff 与产物必须独立保存，任务才能恢复。',
    },
    mechanism: {
      src: '/harness/state-mechanism.png',
      alt: '不可变事件轨迹支持恢复、分叉与回退且保留原始历史的手绘插画',
      caption: 'Append-only 轨迹把消息、工具调用和检查点连续记录下来，从同一历史支持恢复、分叉与回退。',
    },
    evolution: {
      src: '/harness/state-evolution.png',
      alt: '失忆的新 Agent 通过结构化交接文件无缝继续任务的手绘插画',
      caption: '每个新会话都像一位失忆的新工程师；结构化交接文件和 Git 历史让它准确接过上一班的工作。',
    },
  },
  V: {
    concept: {
      src: '/harness/verification-concept.png',
      alt: 'Agent 动作通过多层安全闸门并接受独立验证的手绘插画',
      caption: '治理负责用规则、审批和沙箱拦住危险动作；验证则像独立裁判，判断最终结果是否真的正确。',
    },
    mechanism: {
      src: '/harness/verification-mechanism.png',
      alt: '独立 evaluator 使用测试、代码检查与浏览器证据审查生成结果的手绘插画',
      caption: '生成者与裁判彼此分离：Evaluator 用测试、代码检查和浏览器证据发现问题，再把精确反馈送回生成端。',
    },
    evolution: {
      src: '/harness/verification-evolution.png',
      alt: '设计师用样例校准 evaluator 并逐步形成可追溯证据树的手绘插画',
      caption: '在审美等没有标准答案的领域，人用准则和样例校准 Evaluator，Harness 再把判断沉淀成可追溯的证据树。',
    },
  },
}

function DetailIllustration({
  image,
}: {
  image: { src: string; alt: string; caption: string }
}) {
  return (
    <figure className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className="aspect-3/2 w-full object-cover"
      />
      <figcaption className="border-t border-slate-100 bg-white px-4 py-3 text-[11px] leading-relaxed text-slate-400 sm:px-5">
        {image.caption}
      </figcaption>
    </figure>
  )
}

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
  const animationTarget = useRef<0 | 1>(0)
  const lastScrollY = useRef(0)
  const [active, setActive] = useState<HarnessPart | null>(null)
  const activeIllustrations = active ? HARNESS_ILLUSTRATIONS[active.symbol] : null
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

  const animateTo = useCallback((target: 0 | 1) => {
    if (animationTarget.current === target) return
    animationTarget.current = target
    cancelAnimationFrame(expandRaf.current)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      expandProgress.current = target
      renderCards(target)
      return
    }

    const from = expandProgress.current
    const startedAt = performance.now()
    const duration = AUTO_EXPAND_MS * Math.abs(target - from)
    const animate = (now: number) => {
      const elapsed = clamp01((now - startedAt) / Math.max(1, duration))
      expandProgress.current = from + (target - from) * elapsed
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
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY.current
      const sectionVisible = rect.bottom > 0 && rect.top < window.innerHeight

      // 进入后向下轻滚自动展开；板块可见时向上轻滚则从当前帧自动收起。
      if (rect.top > window.innerHeight * 0.2) {
        cancelAnimationFrame(expandRaf.current)
        animationTarget.current = 0
        expandProgress.current = 0
        renderCards(0)
      } else if (sectionVisible && delta < -2) {
        animateTo(0)
      } else if (rect.top <= -triggerDistance && delta > 2) {
        animateTo(1)
      } else {
        renderCards(expandProgress.current)
      }
      lastScrollY.current = currentScrollY
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
  }, [animateTo, renderCards])

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
              上下轻滚 · 自动展开 / 收起
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
            className="flex max-h-[85vh] w-full max-w-3xl [transform:translateZ(0)] flex-col rounded-3xl border border-white bg-white p-8 shadow-2xl shadow-indigo-500/20"
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
            {activeIllustrations && <DetailIllustration image={activeIllustrations.concept} />}
            {active.detail.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="mt-4 text-sm leading-relaxed text-slate-600"
              >
                {paragraph}
              </p>
            ))}
            <p className="mt-6 text-xs font-semibold tracking-wider text-slate-400">
              真实实现 · 来自 Codex / Claude Code 源码调研
            </p>
            {activeIllustrations && <DetailIllustration image={activeIllustrations.mechanism} />}
            {active.implementations.map((impl) => (
              <div key={impl.product} className="mt-4">
                <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-500">
                  {impl.product}
                </span>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {impl.intro}
                </p>
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
            <p className="mt-6 text-xs font-semibold tracking-wider text-slate-400">
              自进化实践 · 真实场景中这一层如何被改写
            </p>
            {activeIllustrations && <DetailIllustration image={activeIllustrations.evolution} />}
            {active.evolution.map((evo) => (
              <div key={evo.name} className="mt-4">
                <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                  {evo.name}
                </span>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
                  {evo.text}
                  {evo.source && (
                    <span className="mt-0.5 block font-mono text-[11px] break-all text-slate-400">
                      {evo.source}
                    </span>
                  )}
                </p>
              </div>
            ))}
            </div>
          </article>
        </div>
      )}
    </div>
  )
}
