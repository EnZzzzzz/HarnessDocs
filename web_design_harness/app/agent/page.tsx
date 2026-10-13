import type { Metadata } from "next";
import Image from "next/image";
import { ChapterHeader, StorySection, EditorialNote, ChapterFooter } from "@/components/chapter-layout";

export const metadata: Metadata = { title: "Agent 的本质", description: "Agent 本质是用于拟合一组分布：理解这一点，才能回答 Skill 迭代要留下什么、比较什么、由谁判断。" };

export default function AgentPage() {
  return <article className="page narrative-page">
    <ChapterHeader index={0} title={<>Agent 的本质，<br />是拟合<em>一组分布。</em></>} lead={<><p>【待补充】开篇场景：从一个具体的生成任务切入，引出“Agent 在做什么”这个问题。</p><p>【待补充】点出本章命题：Agent 本质是用于拟合一组分布，以及这件事为什么决定了后面六章的做法。</p></>} />
    <StorySection id="what-distribution" number="01" title="两组分布之间，差了什么？">
      <p>每个点代表一个设计产物在审美特征空间中的位置。模型与 Harness 生成的产物形成一组分布；蓝色的目标分布则要从设计师的标注中逐渐浮现。两组点云之间的距离，就是我们要持续缩小的差距。</p>
      <figure className="proposal-image">
        <a className="proposal-image-link" href="/rsi/aesthetic-distribution-gap-v1.png" target="_blank" rel="noreferrer" aria-label="查看两组审美分布散点图原图（新标签页）">
          <Image src="/rsi/aesthetic-distribution-gap-v1.png" alt="红色散点表示模型加 Harness 的生成分布，蓝色散点表示目标美学分布；两组中心之间标有 GAP。" width={1536} height={1024} sizes="(max-width: 700px) 100vw, (max-width: 1023px) 90vw, 1100px" />
        </a>
        <figcaption><strong>生成分布与美学分布</strong><span>概念示意：点云的位置与间距用于解释迭代目标，不代表已测得的美学数据或量化评分。</span></figcaption>
      </figure>
      <p>模型拥有广泛的开放域知识，但未必了解特定行业的规范、企业内部标准，以及设计师对当前任务的审美要求。Skill 将这些专家知识整理成一套可复现的质量标准，注入生成过程。下图用橙色点云示意：加入 Skill 后，产物分布有望更接近目标审美。</p>
      <figure className="proposal-image">
        <a className="proposal-image-link" href="/rsi/aesthetic-distribution-skill-v1.png" target="_blank" rel="noreferrer" aria-label="查看加入 Skill 前后三组审美分布散点图原图（新标签页）">
          <Image src="/rsi/aesthetic-distribution-skill-v1.png" alt="三组散点分布：未加 Skill 的红色点云距离目标美学分布较远；加了 Skill 的橙色点云向右上方移动，更接近蓝色的美学分布，仍留有差距。" width={1536} height={1024} sizes="(max-width: 700px) 100vw, (max-width: 1023px) 90vw, 1100px" />
        </a>
        <figcaption><strong>加入 Skill 后，生成分布向目标靠近</strong><span>概念示意：三组点云及距离用于说明 Skill 的预期作用，不代表实测数据或已验证的改进幅度。</span></figcaption>
      </figure>
      <EditorialNote><p>【待补充】这一步留下什么。</p></EditorialNote>
    </StorySection>
    <StorySection id="why-it-matters" number="02" title="RSI 如何转起来？先有人判断，才有目标可追。">
      <p>起步时，没有一份现成的美学分布可供比较。设计师先看生成结果，标注哪些符合期待、哪些不符合，并留下判断的理由。标注逐渐积累，目标审美的轮廓才开始浮现。</p>
      <p>接下来反复调试 Skill：修改、运行、评估。结果更接近目标，就保留这次改动；没有接近，就根据反馈再改一轮。当标注足够丰富，评测 Agent 还可以学习设计师的判断，协助完成重复评估，让迭代逐步转起来。设计师继续校准标准，决定什么值得保留。</p>
      <figure className="proposal-image">
        <a className="proposal-image-link" href="/rsi/rsi-skill-iteration-v1.png" target="_blank" rel="noreferrer" aria-label="查看 RSI 从设计师标注到 Skill 循环迭代的流程图原图（新标签页）">
          <Image src="/rsi/rsi-skill-iteration-v1.png" alt="从左到右：起初由设计师人工标注生成结果，目标美学分布随着标注积累而浮现；随后循环调试 Skill、运行、评估并决定保留或继续迭代；评测 Agent 学习积累的设计师标注，协助后续评估。" width={1586} height={992} sizes="(max-width: 700px) 100vw, (max-width: 1023px) 90vw, 1100px" />
        </a>
        <figcaption><strong>从人工标注到 RSI 迭代飞轮</strong><span>流程示意：目标分布来自逐步积累的设计师判断；模型辅助评估是后续阶段，不代表当前已实现自动闭环。</span></figcaption>
      </figure>
      <p>这个飞轮不依赖某一种 Harness。Codex、Claude、DSH、OpenCode、ZCode、Kimi、UCD Studio 和 OctoAgent，都可以通过统一接口接入同一套 RSI 平台。Harness 负责执行任务；RSI 负责留下过程数据、吸收专家判断，并把验证后的 Skill 与经验送回下一轮。</p>
      <figure className="proposal-image">
        <a className="proposal-image-link" href="/rsi/multi-harness-rsi-flywheel-v2.png" target="_blank" rel="noreferrer" aria-label="查看多个 Harness 接入同一 RSI 自进化飞轮的概念配图原图（新标签页）">
          <Image src="/rsi/multi-harness-rsi-flywheel-v2.png" alt="云形 RSI 迭代飞轮位于中央，Codex、Claude、DSH、OpenCode、ZCode、Kimi、UCD Studio 和 OctoAgent 八个 Harness 等距环绕，并通过双向连线接入飞轮。" width={1536} height={1024} sizes="(max-width: 700px) 100vw, (max-width: 1023px) 90vw, 1100px" />
        </a>
        <figcaption><strong>不同 Harness，共享同一个 RSI 自进化飞轮</strong><span>AI 生成的概念配图：Harness 可以替换，持续采集、判断、提炼与回流的迭代机制保持稳定。</span></figcaption>
      </figure>
      <p>Skill 调好之后，下一步交付什么？如果直接交付这批 Skill，让设计师在具体任务中使用，就是现在 DDB 的场景。</p>
      <p>如果把这批 Skill 接进生产管线，持续生成更多设计产物，就是管线的场景。两条业务都要靠同一套 RSI 留下结果、收集设计师判断、验证并改进 Skill。因此，RSI 将是下一阶段 DDB 与管线共同的重要基础设施。</p>
    </StorySection>
    <ChapterFooter index={0} bridge="RSI 本质上是一项数据采集任务：留下每一轮的 Skill 版本、生成结果与设计师判断，才能知道下一次改动是否让结果更接近目标。" sources={[]} />
  </article>;
}
