import type { Metadata } from "next";
import Image from "next/image";
import { ChapterHeader, StorySection } from "@/components/chapter-layout";

export const metadata: Metadata = { title: "整体框架", description: "RSI Harness 整体框架。" };

export default function FrameworkPage() {
  return <article className="page narrative-page">
    <ChapterHeader index={1} title={<>整体<em>框架。</em></>} lead={null} />
    <StorySection id="why-rsi" number="01" title="让不同 Harness 都能进入 RSI 循环。">
      <p>Harness 正在成熟，架构日趋标准化，产品也逐渐同质化，已有不少成熟选择。现阶段更关键的是建立一套可复用的 RSI 流程：让 Codex、OpenCode、部门的 Octo Agent，乃至 UCD Studio 都能接入，在反复运行、评估与反馈中获得自我提升的能力。</p>
    </StorySection>
    <StorySection id="capability-architecture" number="02" title="把 RSI 拆成可组合的能力模块。">
      <p>设计师提供审美判断，工程师提供工程标准；不同 Harness 通过统一入口接入。中间的能力模块把每次运行、产物、标注与 Skill 版本串起来，支持经验提炼和反复评测。标注积累后，评测 Agent 再逐步学习人的判断。</p>
      <figure className="proposal-image">
        <a className="proposal-image-link" href="/rsi/rsi-capability-architecture-v1.png" target="_blank" rel="noreferrer" aria-label="查看 RSI 模块化能力架构图原图（新标签页）">
          <Image src="/rsi/rsi-capability-architecture-v1.png" alt="RSI 能力框架示意图：设计师与工程师从左侧输入判断标准，中央六个模块分别是标注评审、运行采集、快照治理、经验提炼、Skill 版本和对照评测；下方统一接入不同 Harness，右侧的评测 Agent 在后期辅助评测，外侧箭头表示循环迭代。" width={1536} height={1024} sizes="(max-width: 700px) 100vw, (max-width: 1023px) 90vw, 1100px" />
        </a>
        <figcaption><strong>模块化 RSI 能力框架</strong><span>基于手绘草图整理的能力关系示意；模块边界与连接方向供讨论，不代表已确定的系统接口或实现状态。</span></figcaption>
      </figure>
    </StorySection>
  </article>;
}
