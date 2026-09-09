import Link from "next/link";
import { ChapterNav, SiteNav } from "@/components/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <><a className="skip-link" href="#main-content">跳转到正文</a><header className="site-header"><div className="header-inner"><Link href="/" className="brand" aria-label="Design Harness 首页"><span className="brand-mark">dh<span>↗</span></span><span>Design Harness<small>关于设计，也关于设计的过程</small></span></Link><div className="header-right"><SiteNav /><span className="edition">独立设计研讨 <span> / </span> VOL. 01</span></div></div></header><div className="app-frame"><ChapterNav /><div className="content-column"><main id="main-content" tabIndex={-1}>{children}</main><footer className="site-footer"><span><strong>Design Harness</strong> · 一份持续推敲的研究笔记</span><span>从问题出发，让过程留下来。 <span className="footer-star">✳</span></span></footer></div></div></>;
}
