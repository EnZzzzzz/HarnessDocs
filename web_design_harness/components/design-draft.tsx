import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function DesignDraft({ revised = false, compact = false }: { revised?: boolean; compact?: boolean }) {
  return <div className={cn("design-draft", revised ? "draft-revised" : "draft-initial", compact && "draft-compact")} aria-label={revised ? "修订稿：强化标题层级，突出阅读入口" : "初稿：信息均匀分布，阅读入口不突出"}><div className="draft-header"><strong>FORM<span> / </span>设计观察</strong><span>观察 &nbsp; 关于</span></div><div className="draft-body"><span className="draft-kicker">A FIELD GUIDE TO EVERYDAY DESIGN</span><h3>好的设计，<br />藏在日常里。</h3><p>观察物件与生活的关系，<br />记录那些值得停下来的细节。</p><div className="draft-faux-link">阅读本期观察 <ArrowUpRight size={12} aria-hidden="true" /></div><div className="object-study" aria-hidden="true"><div className="object-shadow" /><div className="object-sheet sheet-one" /><div className="object-sheet sheet-two" /><div className="object-sheet sheet-three" /><span>FORM STUDY — 001</span></div><div className="draft-bottom"><span>01 / 材料与秩序</span><span>从一张纸开始 ↗</span></div></div></div>;
}
