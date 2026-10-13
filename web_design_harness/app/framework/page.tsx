import type { Metadata } from "next";
import Image from "next/image";
import { ChapterHeader, StorySection } from "@/components/chapter-layout";

export const metadata: Metadata = { title: "整体框架", description: "RSI Harness 整体框架。" };

export default function FrameworkPage() {
  return <article className="page narrative-page">
    <ChapterHeader index={3} title={<>整体<em>框架。</em></>} lead={null} />
    <StorySection id="why-rsi" number="01" title="让不同 Harness 都能进入 RSI 循环。">
      <p>Harness 正在成熟，架构日趋标准化，产品也逐渐同质化，已有不少成熟选择。现阶段更关键的是建立一套可复用的 RSI 流程：让 Codex、OpenCode、部门的 Octo Agent，乃至 UCD Studio 都能接入，在反复运行、评估与反馈中获得自我提升的能力。</p>
    </StorySection>
    <StorySection id="capability-architecture" number="02" title="把 RSI 拆成可组合的能力模块。">
      <p>上层由设计师和工程师提供审美、体验与工程判断；中层让不同 Harness 通过 CLI、Skill、Hook 或插件接入；下层把运行采集、快照治理、经验提取、Skill 改动和对照评测连成循环。专家标注与每轮产物关联，评测通过的 Skill 再回到 Harness，驱动下一轮运行。</p>
      <figure className="proposal-image">
        <a className="proposal-image-link" href="/rsi/rsi-three-layer-architecture-runtime-v1.png" target="_blank" rel="noreferrer" aria-label="查看 RSI 三层能力架构图原图（新标签页）">
          <Image src="/rsi/rsi-three-layer-architecture-runtime-v1.png" alt="RSI 三层能力架构图：上层由设计师和工程师提供知识与标注；中层分别接入 Codex、OpenCode、Octo Agent 和 UCD Studio，由统一 Harness Runtime 负责知识装配、运行编排、隔离与产物采集；下层治理数据、提取经验、生成 Skill 候选并进行对照评测。" width={2000} height={1665} sizes="(max-width: 700px) 100vw, (max-width: 1023px) 90vw, 1100px" />
        </a>
        <figcaption><strong>RSI 三层能力架构</strong><span>概念架构讨论稿；模块边界与技术栈是候选方案，不代表已经实现或完成选型。</span></figcaption>
      </figure>
    </StorySection>
  </article>;
}
