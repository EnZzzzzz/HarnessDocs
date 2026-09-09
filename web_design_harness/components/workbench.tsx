"use client";

import { useState } from "react";
import { Check, Eye, EyeOff, ArrowRight, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DesignDraft } from "@/components/design-draft";

const stages = [
  { id: "initial", label: "初稿", subtitle: "只有风格要求", number: "01", title: "页面有了风格，却还没有重点。", description: "这份初稿遵循了暖白底色和简洁排版，但标题、介绍与内容入口权重接近。读者知道这是什么网站，却不容易判断第一步该看哪里。", note: "观察对象：阅读顺序", annotation: "每一块都很安静，\n第一眼该看哪里？" },
  { id: "review", label: "评审批注", subtitle: "把问题说具体", number: "02", title: "把“没有重点”变成可以执行的反馈。", description: "保留底色与内容，放大主标题，压缩次要说明，把“阅读本期观察”放到介绍之后。反馈指向具体元素，也说明希望改变的阅读行为。", note: "本轮约束：只调整信息层级", annotation: "① 放大标题，建立入口\n② 缩短介绍，减少竞争\n③ 强调阅读动作" },
  { id: "revision", label: "修订稿", subtitle: "让判断进入下一轮", number: "03", title: "修订的重点，是让阅读顺序变得清楚。", description: "先看标题，再理解内容，最后进入本期观察。这里展示的是一种修订假设；是否真的更容易阅读，仍需要真实读者验证。", note: "待验证：读者能否找到入口", annotation: "标题 → 说明 → 行动\n这一次，阅读有了顺序。" },
] as const;

export function Workbench() {
  const [active, setActive] = useState(1);
  const [showNotes, setShowNotes] = useState(true);
  const stage = stages[active];
  return <section className="workbench-section" aria-label="设计版本工作台"><div className="workbench-toolbar"><div className="toolbar-label"><span className="blue-dot" /> 案例 001 <span className="muted">/ 设计观察网站</span></div><Button variant="ghost" className="notes-toggle" onClick={() => setShowNotes(!showNotes)} aria-pressed={showNotes}>{showNotes ? <Eye size={15} /> : <EyeOff size={15} />}{showNotes ? "隐藏批注" : "显示批注"}</Button></div><div className="version-bar" role="group" aria-label="选择设计阶段">{stages.map((item, index) => <Button key={item.id} variant="ghost" className="version-button" aria-pressed={index === active} onClick={() => setActive(index)}><span className="version-number">{item.number}</span><span><strong>{item.label}</strong><small>{item.subtitle}</small></span>{index < 2 ? <ArrowRight size={15} className="version-arrow" aria-hidden="true" /> : <Check size={15} className="version-arrow" aria-hidden="true" />}</Button>)}</div><div className="workbench-canvas"><div className="board-label"><span>FORM / LANDING PAGE</span><span>v0{active + 1} · {stage.label}</span></div><div className="workbench-composition"><aside className="constraint-slip"><span className="eyebrow">DESIGN BRIEF</span><h3>这次设计的起点</h3><p>一个面向设计爱好者的<br />日常观察网站。</p><div className="slip-rule" /><span><Check size={12} /> 温和、克制的表达</span><span><Check size={12} /> 清晰的阅读层级</span><span><Check size={12} /> 一个主要行动入口</span><small>在三个版本中保持不变</small></aside><div className={`workbench-artboard ${active === 1 && showNotes ? "under-review" : ""}`}><DesignDraft revised={active === 2} />{active === 1 && showNotes ? <div className="review-outline" aria-hidden="true"><span>01</span></div> : null}</div>{showNotes ? <aside className="review-note"><MessageSquareText size={18} aria-hidden="true" /><span className="eyebrow">{active === 2 ? "修订说明" : "编辑批注"}</span><p>{stage.annotation}</p><div className="note-line" /><small>{stage.note}</small></aside> : null}</div><div className="board-footer"><span>同一份内容，同一组约束。</span><span>变化的是设计判断。</span></div></div><div className="stage-takeaway" aria-live="polite" aria-atomic="true"><span className="takeaway-number">{stage.number}</span><div><span className="eyebrow">这一轮，我们看到了什么</span><h3>{stage.title}</h3><p>{stage.description}</p></div></div></section>;
}
