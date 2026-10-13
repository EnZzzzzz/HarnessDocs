import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { chapters } from "@/lib/chapters";

export function ChapterHeader({ index, title, lead }: { index: number; title: React.ReactNode; lead: React.ReactNode }) {
  const chapter = chapters[index];
  return <header className="chapter-header"><div className="page-meta"><span>DESIGN HARNESS / RSI 方案研讨</span><span>方案草稿 · {chapter.number} / {String(chapters.length).padStart(2, "0")}</span></div><div className="section-kicker"><span>{chapter.number}</span>{chapter.title} / {chapter.english}</div><h1>{title}</h1><div className="chapter-lead">{lead}</div><div className="reading-thread">{chapters.map((item, i) => <Link key={item.href} href={item.href} aria-current={i === index ? "page" : undefined}><span>{item.number}</span>{item.question}</Link>)}</div></header>;
}

export function StorySection({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return <section className="story-section" id={id}><div className="story-heading"><span>{number}</span><h2>{title}</h2></div><div className="story-body">{children}</div></section>;
}

export function EditorialNote({ label = "这一步留下什么", children }: { label?: string; children: React.ReactNode }) {
  return <aside className="editorial-note"><span>{label}</span><div>{children}</div></aside>;
}

export function ChapterFooter({ index, bridge, sources }: { index: number; bridge: string; sources: { file: string; label: string }[] }) {
  const previous = chapters[index - 1];
  const next = chapters[index + 1];
  return <><div className="chapter-bridge"><span className="eyebrow accent">{next ? "带着这个问题，进入下一章" : "让判断回到下一次改动"}</span><p>{bridge}</p><Link href={next?.href ?? chapters[0].href} className="primary-link">{next ? `下一章 · ${next.title}` : `回到第一章 · ${chapters[0].title}`}<ArrowUpRight size={17} /></Link>{previous ? <Link href={previous.href} className="previous-chapter"><ArrowLeft size={14} />{previous.title}</Link> : null}</div><div className="chapter-sources"><strong>方案依据</strong><p>RSI Harness 规格草稿（2026-09-09）及用户提供的页面效果图。本次汇报按当前讨论方向，以人工判断为主，自动评测按需引入；配图中的分数、状态和控件为设计示例。</p><div>{sources.map(source => <a key={source.file} href={`/reference/spec/${source.file}`} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div></div></>;
}
