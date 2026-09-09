import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Workbench } from "@/components/workbench";

export const metadata: Metadata = { title: "过程研讨", description: "用一个示意案例，观察初稿、评审批注与修订稿之间的设计判断。" };

export default function WorkbenchPage() {
  return <div className="page workbench-page"><div className="page-meta"><Link href="/"><ArrowLeft size={13} aria-hidden="true" /> 研究概览</Link><span>02 / THE WORKBENCH</span></div><header className="article-header"><div className="section-kicker"><span>02</span> 从一次具体的设计开始</div><h1>给了设计规范，<br />为什么页面还是<em>不对</em>？</h1><div className="article-intro"><p>把“感觉不对”拆开，落到具体的页面与修改上。<br />我们关心的，是反馈如何成为下一轮设计的输入。</p><span className="example-label">示意案例 · 非实测结果</span></div></header><Workbench /><section className="discussion-section" id="discussion"><div><span className="eyebrow accent">留给下一轮的问题 / WHAT'S NEXT</span><h2>改好了这一次，<br />怎样帮助下一次？</h2></div><div className="discussion-copy"><p>如果只保存最后的页面，下一次还是要重新摸索。值得留下来的，还有当时的约束、被指出的问题，以及选择这个改法的理由。</p><div className="discussion-question"><span>继续讨论</span><p>“突出主要入口”可以沉淀为规则，<br />但“标题要多大”，是否仍取决于场景？</p></div></div></section><Link href="/" className="back-overview">回到研究概览 <ArrowUpRight size={16} aria-hidden="true" /></Link></div>;
}
