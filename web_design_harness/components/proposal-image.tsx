import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function ProposalImage({ file, title, caption, priority = false }: { file: string; title: string; caption: string; priority?: boolean }) {
  return (
    <figure className="proposal-image">
      <a className="proposal-image-link" href={`/rsi/${file}`} target="_blank" rel="noreferrer" aria-label={`查看${title}原图（新标签页）`}>
        <Image src={`/rsi/${file}`} alt={`${title}产品设计效果图，图中数据为示例`} width={1586} height={992} sizes="(max-width: 700px) 100vw, (max-width: 1023px) 90vw, 1100px" priority={priority} />
        <span className="image-open">查看原图 <ArrowUpRight size={14} aria-hidden="true" /></span>
      </a>
      <figcaption><strong>{title}</strong><span>{caption}</span></figcaption>
    </figure>
  );
}
