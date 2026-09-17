"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProposalImage } from "@/components/proposal-image";

export function ChapterFigures({ items, label }: { label: string; items: { file: string; title: string; caption: string }[] }) {
  const [active, setActive] = useState(0);
  const current = items[active];
  return <div className="chapter-figures"><div className="figure-tabs" role="group" aria-label={label}>{items.map((item, index) => <Button key={item.file} variant="ghost" aria-pressed={active === index} onClick={() => setActive(index)}>{item.title}</Button>)}</div><div aria-live="polite"><ProposalImage {...current} /></div></div>;
}
