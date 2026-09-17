"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { chapters } from "@/lib/chapters";

export function SiteNav() {
  const pathname = usePathname();
  return <nav className="top-nav" aria-label="主导航">{chapters.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.short}</Link>)}</nav>;
}

export function ChapterNav() {
  const pathname = usePathname();
  return (
    <aside className="chapter-sidebar">
      <div className="issue-label"><span className="red-dot" /> RSI HARNESS / PROPOSAL</div>
      <p className="issue-title">留下改动，<br />也留下判断。</p>
      <div className="sidebar-rule" />
      <p className="eyebrow muted">三个问题 / 三个章节</p>
      <nav className="chapter-nav" aria-label="章节导航">{chapters.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}><span className="chapter-number">{item.number}</span><span><strong>{item.title}</strong><small>{item.question}</small></span></Link>)}</nav>
      <div className="sidebar-note"><span className="eyebrow">HUMAN IN THE LOOP</span><p>先让人看得清、比得了，<br />再逐步引入自动评测。</p><Link href="/review#human-review">谁来做最后的判断 <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
      <div className="sidebar-bottom"><span>VOL. 01</span><span>方案讨论稿</span></div>
    </aside>
  );
}
