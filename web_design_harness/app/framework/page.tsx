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
      <p>上层沉淀设计工程、代码工程与 Harness 工程的专业知识；中层让不同 Harness 通过统一 Runtime 接入；RSI 层则由数据采集与治理、经验提取和评测三个模块组成。运行数据先被整理成可追溯的快照，再从 Raw 原始经验逐层形成 Wiki 知识与可执行 Skill，最后经过质量门禁和评测体系验证，回到 Harness 驱动下一轮运行。</p>
      <figure className="proposal-image">
        <a className="proposal-image-link" href="/rsi/rsi-three-layer-architecture-runtime-v3.png" target="_blank" rel="noreferrer" aria-label="查看 RSI 三层能力架构图原图（新标签页）">
          <Image src="/rsi/rsi-three-layer-architecture-runtime-v3.png" alt="RSI 三层能力架构图：专家知识层沉淀设计工程、代码工程和 Harness 工程知识；Harness 层通过统一 Runtime 接入不同 Agent；RSI 层分为数据采集与治理、经验提取和评测三个模块，其中经验按照 Raw、Wiki、Skill 三层架构逐步形成可执行规则。" width={2000} height={1789} sizes="(max-width: 700px) 100vw, (max-width: 1023px) 90vw, 1100px" />
        </a>
        <figcaption><strong>RSI 三层能力架构</strong><span>概念架构讨论稿；模块边界与技术栈是候选方案，不代表已经实现或完成选型。</span></figcaption>
      </figure>
    </StorySection>
  </article>;
}
