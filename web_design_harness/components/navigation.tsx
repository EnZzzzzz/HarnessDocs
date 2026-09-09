"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BookOpen, Layers2 } from "lucide-react";

const chapters = [
  { href: "/", title: "研究概览", english: "THE OVERVIEW", number: "01", icon: BookOpen },
  { href: "/workbench", title: "过程研讨", english: "THE WORKBENCH", number: "02", icon: Layers2 },
];

export function SiteNav() {
  const pathname = usePathname();
  return <nav className="top-nav" aria-label="主导航">{chapters.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.title}</Link>)}</nav>;
}

export function ChapterNav() {
  const pathname = usePathname();
  return <aside className="chapter-sidebar"><div className="issue-label"><span className="red-dot" /> RESEARCH JOURNAL</div><p className="issue-title">设计的背后，<br />还有一套方法。</p><div className="sidebar-rule" /><p className="eyebrow muted">本期目录 / CONTENTS</p><nav className="chapter-nav" aria-label="章节导航">{chapters.map(({ icon: Icon, ...item }) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}><span className="chapter-number">{item.number}</span><span><strong>{item.title}</strong><small>{item.english}</small></span><Icon size={15} aria-hidden="true" /></Link>)}</nav><div className="sidebar-note"><span className="eyebrow">OPEN QUESTION</span><p>一次好的设计判断，<br />如何留给下一次？</p><Link href="/workbench#discussion">带着问题往下读 <ArrowUpRight size={14} aria-hidden="true" /></Link></div><div className="sidebar-bottom"><span>VOL. 01</span><span>探索中的笔记</span></div></aside>;
}
