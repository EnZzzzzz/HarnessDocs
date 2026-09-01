'use client'

/**
 * SeSection 左侧的编号要点卡片列表。
 * 要点带 detail 字段时，卡片渲染为可点击按钮，点击打开 Q&A 详解弹层
 * （弹层交互复用 cordis-section 的模式：Esc 关闭、点击遮罩关闭、锁定页面滚动）；
 * 不带 detail 的要点保持原来的静态卡片样式。
 */
import { useState } from 'react'

import { DetailDialogFrame } from '../detail-dialog-frame'
import type { Point } from './self-evolution-sections'

export type PointDetailImage = {
  src: string
  alt: string
}

export function PointCards({
  points,
  detailEyebrow,
  detailImage,
}: {
  points: Point[]
  /** 详解弹层左上角的小标题，如「WikiSkill · 概念详解」 */
  detailEyebrow: string
  /** 有值时作为所有要点详情弹层的置顶封面。 */
  detailImage?: PointDetailImage
}) {
  // 当前打开详解弹层的卡片下标；null 表示未打开
  const [detailIndex, setDetailIndex] = useState<number | null>(null)
  return (
    <>
      <ol className="space-y-3 md:col-start-1 md:self-center">
        {points.map((point, i) => {
          const number = (
            <span className="pt-0.5 font-mono text-[11px] font-semibold text-indigo-500">
              {String(i + 1).padStart(2, '0')}
            </span>
          )
          const body = (
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
          )
          return (
            <li key={point.en}>
              {point.detail ? (
                <button
                  type="button"
                  onClick={() => setDetailIndex(i)}
                  className="grid w-full cursor-pointer grid-cols-[2rem_1fr] gap-3 rounded-2xl border border-slate-200/80 bg-white/55 p-4 text-left backdrop-blur-sm transition-[border-color,background-color] duration-200 hover:border-indigo-200 hover:bg-white/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  {number}
                  {body}
                </button>
              ) : (
                <div className="grid grid-cols-[2rem_1fr] gap-3 rounded-2xl border border-slate-200/80 bg-white/55 p-4 backdrop-blur-sm">
                  <span className="pt-0.5 font-mono text-[11px] font-semibold text-indigo-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-slate-900">
                      {point.zh}
                      <span className="ml-2 text-[11px] font-medium tracking-wide text-slate-400">
                        {point.en}
                      </span>
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{point.desc}</p>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ol>

      <PointDetailDialog
        point={detailIndex == null ? null : points[detailIndex]}
        pointIndex={detailIndex}
        detailEyebrow={detailEyebrow}
        image={detailImage}
        onClose={() => setDetailIndex(null)}
      />
    </>
  )
}

/** 普通要点卡与配图画廊共用的详情弹层。 */
export function PointDetailDialog({
  point,
  pointIndex,
  detailEyebrow,
  image,
  onClose,
}: {
  point: Point | null
  pointIndex: number | null
  detailEyebrow: string
  image?: PointDetailImage
  onClose: () => void
}) {
  if (!point?.detail) return null

  return (
    <DetailDialogFrame
      titleId="point-detail-title"
      eyebrow={`${detailEyebrow} ${String((pointIndex ?? 0) + 1).padStart(2, '0')}`}
      title={
        <>
          {point.zh}
          <span className="ml-2.5 text-sm font-medium tracking-wide text-slate-400">
            {point.en}
          </span>
        </>
      }
      cover={image}
      onClose={onClose}
    >
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {point.detail.intro}
            </p>

            <div className="mt-8 space-y-7">
              {point.detail.qa.map((item, i) => (
                <section key={item.q}>
                  <h4 className="flex items-baseline gap-3 text-sm font-bold tracking-tight text-slate-900 sm:text-base">
                    <span className="font-mono text-[11px] font-semibold text-indigo-500">
                      Q{i + 1}
                    </span>
                    {item.q}
                  </h4>
                  <div className="mt-2.5 space-y-2.5 border-l-2 border-indigo-100 pl-4">
                    {item.a.map((para) => (
                      <p key={para} className="text-sm leading-relaxed text-slate-600">
                        {para}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <p className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-xs leading-5 text-indigo-700">
              {point.detail.source}
            </p>
    </DetailDialogFrame>
  )
}
