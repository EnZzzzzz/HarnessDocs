import type { OutlineSectionData } from '../outline-data'

export const S01_FOUNDATION: OutlineSectionData = {
  id: 'foundation-vendors',
  kicker: '为什么 Harness 热度这么高 · 基模厂商',
  title: '基模厂商：环境成为核心资产',
  intro:
    '后训练时代，模型能力的差距越来越多地由训练环境而非底座本身决定。基模厂商的竞争，正在从「谁的底座强」转向「谁的环境多、真、可验证」。',
  cards: [
    {
      badge: '01',
      title: '闭源 Harness 常有防蒸馏手段',
      en: 'Closed Harness, Hidden Recipe',
      tagline: '基模厂商需要可控的全栈训练环境',
      detail: [
        '先看问题：既然环境成了核心资产，能不能直接拿别家闭源 API 的 agent 轨迹当训练数据？厂商显然防着这一手——主流推理 API 把模型的逐步推理（chain-of-thought）加密成不透明块交给客户端保存，客户端看不懂，只需在后续轮次原样带回。表面上，这条防蒸馏通道被堵死了；MATS Research、ELLIS Institute Tübingen、Snyk 等机构的 8 位研究者要验证的，正是这层加密到底防不防得住。',
        '再看做法：团队既不破解加密算法，也不需要模型权重或服务端权限。他们发现的关键漏洞是「密文可移植」——同一厂商会在别的会话、别的用户、甚至同厂兼容模型中继续接受并解开这个块。于是攻击只需两次 API 调用：先让 Claude Opus 4.8 级别的强模型正常解题并拿到加密推理块，再把这个块注入同厂最弱的兼容模型（Claude 用 Haiku 4.5、GPT 用 GPT-5.6 Luna、Gemini 用 Robotics 1.6），要求它逐字转录「附在本轮的推理」。强模型从头到尾没有被越狱，防蒸馏防线却被较弱模型绕到了背后。',
        '然后是效果验证：在 120 道 Codeforces 题上，Anthropic、OpenAI、Google 三家恢复出的明文推理 token 数与 API 计费记录的隐藏 thinking token 数都紧贴 y=x 对角线——论文也坦承这不是逐 token 的数学证明，而是可重复、跨厂商、有多种旁证的实证结论。规模化复核更能说明问题：团队从 GitHub 与 Hugging Face 收集 6,708 条公开 agent 轨迹，重建出 315,320 个推理块；真实用户会话里找到 704 个隐私项（含 62 个 API key、33 个密码、24 个访问令牌），其中 64 个只存在于隐藏推理、从不在可见对话中出现。',
        '最后是对训练的含义：外部闭源 Harness 的轨迹三重不可靠——技术上防不住提取，条款上禁止用于训练竞品，运营上提供方可随时切断访问（Anthropic 撤销 OpenAI 的 Claude API 权限就是先例），还夹带无法审计的隐私数据。要让数据来源、奖励信号和迭代节奏可控，基模厂商最终仍需自建环境、工具链与验证器。',
      ],
      images: [
        {
          src: '/outline/stolen-thoughts-two-calls.png',
          caption:
            '论文项目页对攻击机制的演示：左右是两次 API 调用的真实请求体。左边是源模型（Claude Opus 4.8）解一道因数分解题，高亮的 signature 字段就是加密后的隐藏推理块；右边把同一个 signature 原样放进 Haiku 4.5 的请求，user 消息要求逐字转录，下方 text 里模型便明文吐出了强模型的完整推理过程——两次普通调用即完成提取。',
          source: 'https://stolen-thoughts.com/',
        },
        {
          src: '/outline/stolen-thoughts-extraction-fidelity.svg',
          caption:
            '论文 Figure 1 的定量验证。横轴是源模型 API 计费记录的隐藏 thinking token 数，纵轴是恢复出的明文推理重新送回模型后得到的 token 数；Anthropic、OpenAI、Google 的 120 道 Codeforces 样本都紧贴 y=x 对角线。它不能逐字证明每个 token 完全一致，但说明恢复内容的长度与源模型实际生成的隐藏推理高度吻合。',
          source: 'https://arxiv.org/pdf/2608.09867',
        },
        {
          src: '/outline/openai-tos-no-compete.png',
          caption:
            'OpenAI 服务条款截图标出了三类约束：禁止自动化批量提取、禁止绕过保护措施、禁止用输出开发竞品模型。它说明“能提取”不等于“可合法用于训练”，也是基模厂商不能把外部闭源 Harness 当作稳定训练数据源的原因。',
          source: 'https://openai.com/policies/terms-of-use/',
        },
        {
          src: '/outline/wired-anthropic-revoke.jpg',
          caption:
            'Wired 对 Anthropic 撤销 OpenAI Claude API 权限事件的报道配图。它对应证据链中的运营风险：即便技术接口今天可用，闭源提供方仍能通过条款与访问控制随时切断竞争者的数据通道。',
          source: 'https://www.wired.com/story/anthropic-revokes-openais-access-to-claude/',
        },
      ],
      points: [
        {
          text: '步骤 1 · 取得密文：先向 Claude Opus 4.8 等强模型提交可核验的问题。API 返回正常答案，同时返回一段很长的 signed thinking / encrypted_content；客户端看不懂它，却必须在后续轮次原样带回。',
          source: 'https://stolen-thoughts.com/',
        },
        {
          text: '步骤 2 · 证明可移植：研究者把这个块放进另一会话、另一个 API 用户以及同厂的另一模型请求中。服务端仍通过签名校验并把明文推理注入模型上下文，说明密文没有绑定原始用户、会话与模型。',
          source: 'https://arxiv.org/pdf/2608.09867',
        },
        {
          text: '步骤 3 · 利用安全不对称：他们选择同厂最弱的兼容模型——Claude 用 Haiku 4.5、GPT 用 GPT-5.6 Luna、Gemini 用 Robotics 1.6——并要求它逐字转录“附在本轮的推理”。强模型没有被越狱，防蒸馏防线却被较弱模型绕到了背后。',
          source: 'https://arxiv.org/pdf/2608.09867',
        },
        {
          text: '步骤 4 · 验证不是“模型瞎编”：团队用 120 道 Codeforces 题比较 API 报告的隐藏 thinking token 与恢复文本 token，三家厂商的数据都接近 y=x；再检查恢复内容是否包含公开输出和摘要中没有的中间计算、凭据与个人信息。',
          source: 'https://arxiv.org/pdf/2608.09867',
        },
        {
          text: '规模化复核：团队从 GitHub 与 Hugging Face 收集 6,708 条公开 agent 轨迹，重建 315,320 个推理块；真实用户会话中发现 704 个隐私项，其中 64 个只存在于隐藏推理、不在可见对话里。这说明风险不止是单个演示。',
          source: 'https://stolen-thoughts.com/',
        },
        {
          text: '证明边界：token 数对齐是高可信度指标，但论文也明确承认，在没有源模型明文 ground truth 且生成具有随机性的情况下，无法对每条恢复结果给出严格的逐 token 数学证明。结论应理解为可重复、跨厂商、经多种旁证支持的实证攻击。',
          source: 'https://arxiv.org/pdf/2608.09867',
        },
        {
          text: '对训练的含义：外部闭源 Harness 的轨迹既可能被技术保护、条款限制和随时断供，也可能夹带无法审计的隐私数据。要让数据来源、奖励信号和迭代节奏可控，基模厂商最终仍需自建环境、工具链与验证器。',
        },
      ],
    },
    {
      badge: '02',
      title: '训练环境决定 bench 表现',
      en: 'Environments Decide the Score',
      tagline: '同一个模型，换一套训练环境，bench 分数可以差出一个量级',
      detail: [
        '先看问题：后训练成为主战场之后，一个核心疑问是——同一个底座模型，为什么不同团队训出来的 bench 成绩差这么多？模型规模、agent scaffold、评测口径都会干扰归因。要回答它，必须把「环境」这个变量单独剥离出来。',
        '再看论证设计：daVinci-Env（OpenSWE）论文做的就是这样一个对照实验——固定 Qwen 底座、固定 SWE-Agent / CodeAct 两种 scaffold、统一用 SWE-bench Verified 评测，唯一改动的是训练环境的来源（SWE-Rebench 数据集 vs 流水线合成的 OpenSWE 环境）。结果在 32B SWE-Agent 设定下相差 12.2 个百分点（62.4% vs 50.2%），而且两种 scaffold 下环境优劣的排序完全一致——差距来自环境本身，不是框架的偶然配合。',
        '然后是机制解释：RL 的训练信号完全由环境产出——任务决定模型练习什么行为，验证器决定奖励是否可信。可执行、可验证、贴近真实工作的环境给出干净而密集的奖励，模型学到的是「定位问题—修改—运行—诊断—再修改」的完整闭环；静态、不可验证的环境只会教会模型应试。论文的消融与规模实验补上最后一环：剔除不可解和过易任务后训练效率继续提升，性能随环境数量近似 log-linear 上升且尚未饱和。',
        '最后是旁证：GLM-5.3 与 GLM-5.2 用同一底座，只做环境扩展，Terminal Bench 3.0 从 4.6 涨到 28.3；OpenAI 的 harness engineering 实践则从工程侧印证同一件事——工程师的主要工作已经变成设计环境、明确意图、构建反馈回路。',
      ],
      images: [
        {
          src: '/outline/openswe-teaser.png',
          caption:
            '左侧散点图：横轴是模型参数规模，纵轴是 SWE-bench Verified 解决率；红色星标 OpenSWE-32B/72B 分别为 62.4%/66.0%，显示较小底座经高质量环境训练后可越过不少更大模型。右侧条形图：OpenSWE 有 45.3K 个 Docker 环境，约为 SWE-rebench-v2 的 6.3 倍；右上角同时给出 12.8K 仓库与约 174 万美元构建/采样成本，说明提升来自大规模基础设施投入。',
          source: 'https://arxiv.org/pdf/2603.13023',
        },
        {
          src: '/outline/openswe-framework.png',
          caption:
            '这张流程图从左到右展示“环境如何被造出来”：先筛掉非 Python、缺 issue 或无有效代码改动的 PR；Master 把候选任务分发到多个节点；每个节点依次探索仓库、生成 Dockerfile、生成评测脚本、真实执行环境，再由测试分析器判断是配置错误、验证器错误还是任务本身不可解，并把反馈送回上一环迭代。绿色勾只授予真正可执行且可判分的环境。',
          source: 'https://arxiv.org/pdf/2603.13023',
        },
        {
          src: '/outline/openai-codex-devtools.png',
          caption:
            '这张时序图说明训练/运行环境里的反馈闭环：Codex 先选目标并清空控制台，保存修改前快照，触发真实 UI 路径并收集运行时事件，再保存修改后快照、修复并重启；底部 “LOOP UNTIL CLEAN” 表示验证会反复执行。环境提供的不是一句“对/错”，而是快照、控制台和运行时事件等可定位错误的观察。',
          source: 'https://openai.com/index/harness-engineering/',
        },
      ],
      points: [
        {
          text: '论证 1 · 控制模型与评测，替换环境数据：OpenSWE 论文在相同 Qwen2.5 底座、相同 agent scaffold 和统一 SWE-bench Verified 评测下比较训练集。32B 设定中，OpenSWE 训练相对 SWE-rebench 绝对提升 12.2 个百分点，因此差异不能简单归因于模型大小。',
          source: 'https://arxiv.org/pdf/2603.13023',
        },
        {
          text: '论证 2 · 解释作用机制：真实 Docker 环境允许模型执行补丁并获得编译、测试和运行时反馈；评测脚本要求未修复版本 fail、正确补丁 pass，排除“测试恒通过”的伪奖励。于是训练轨迹包含可归因的错误信号，模型能学到迭代修复策略。',
          source: 'https://arxiv.org/pdf/2603.13023',
        },
        {
          text: '论证 3 · 不是环境越多越好：论文先剔除 issue 与 PR 不匹配的不可解任务，再剔除题面直接泄露答案的过易任务，并按轨迹难度筛选约 9,000 个高质量环境。消融结果显示，难度感知筛选在原始规模之外还能独立提升训练效率。',
          source: 'https://arxiv.org/pdf/2603.13023',
        },
        {
          text: '论证 4 · 检查规模效应：随着高质量环境和轨迹数量增加，性能呈近似 log-linear 上升且尚未饱和；这支持“新增环境持续带来新学习信号”，而不是少数样本或一次偶然调参造成的提升。',
          source: 'https://arxiv.org/pdf/2603.13023',
        },
        {
          text: '论证 5 · 检查是否只会刷单一 benchmark：SWE 环境训练还带来最高约 12 分的数学推理和约 5 分的科学评测提升，且事实记忆没有下降。论文据此推断，环境强化的是可迁移的长程推理、工具使用和反馈修正能力，而非只记住仓库补丁。',
          source: 'https://arxiv.org/pdf/2603.13023',
        },
        {
          text: '旁证 · OpenAI 的 harness engineering 把工程重点概括为设计环境、明确意图与构建反馈回路；其 Chrome DevTools 示例具体展示了快照—交互—运行时事件—修复—复验的循环，与 OpenSWE 的“可执行观察 + 可验证奖励”机制一致。',
          source: 'https://openai.com/index/harness-engineering/',
        },
      ],
    },
    {
      badge: '03',
      title: 'slime：训练循环不动，环境像插件一样扩展',
      en: 'One Training Loop, Many Environments',
      tagline: '从 GLM-5.2 到 GLM-5.3：用同一套异步后训练内核承载不断扩张的长周期任务',
      detail: [
        '问题：Agentic RL 的数据不是一问一答，而是一条会持续数小时的“模型行动—工具执行—环境反馈”轨迹。数学、搜索、编程、沙箱和多 Agent 的交互规则不同，轨迹时长也相差悬殊。传统做法常为每种任务 fork 一套训练框架，结果是同一处 bug 要在多个分支反复修，环境逻辑与训练调度纠缠，新场景一接入就可能改坏训练主循环；同步 rollout 还会让整批 GPU 等待最慢的那条轨迹。',
        'slime 的解法：把稳定的 RL 内核与多变的数据生产拆开。Megatron 负责参数训练，SGLang + router 负责大规模推理，Data Buffer 在中间传递 prompt、完整轨迹、loss mask、奖励和验证结果。训练循环只做“从 Buffer 取样—更新权重—同步给 rollout”；具体任务则通过自定义生成函数、奖励函数或外部 server-based rollout 接入。换一个环境，本质上是换一个数据生成插件，不需要 fork 或重写训练循环。',
        '插件如何工作：开发者在自定义 generate 中实现“模型生成动作 → 调工具/沙箱 → 把 observation 拼回上下文 → 继续生成”，并将模型生成 token 的 loss mask 标为 1、环境返回 token 标为 0；再由自定义 reward/verifier 对最终状态评分。因而搜索、代码测试、网络安全、ML 集群乃至 sub-agent workflow 虽然内部完全不同，对训练端都交付同一种 Sample。统一的是接口与数据契约，不是强迫所有环境采用同一种交互模板。',
        '为什么要异步：长周期轨迹存在严重长尾，如果按整批同步，短任务完成后只能空等最慢样本。slime 用 Ray 管理训练与 rollout 资源，可将两者同卡部署或拆到不同 GPU 集群，并通过异步远程调用让采样、训练和权重更新交错执行；fully-async rollout 还能维持固定数量的在途轨迹，让下一轮不必卡在上一批的最慢样本上。SGLang 的 FP8 rollout、KV-cache 空间与参数同步优化，则把省下的显存和时间换成更高并发、更长轨迹或更多实验。',
        'GLM-5.2 的落地：官方《Built for Long-Horizon Tasks》说明，slime 在同一系统里组织白盒 rollout、黑盒 rollout、compact trajectory 与 sub-agent workflow，并用并行 OPD 把十余个专家模型合并进最终模型，整个 OPD 过程约两天。超长轨迹经过 compaction 后会变成数量和长度都不一致的子轨迹，因此训练从依赖同组比较的方式转向 critic-based PPO：逐条 rollout 估计 token 级 advantage，把所有压缩后的子轨迹都纳入训练。',
        '长周期训练还会放大奖励作弊：模型可能读取隐藏测试、复制参考答案或从上游仓库直接下载目标文件，表面通过验证却没有学会解题。GLM-5.2 为此加入两阶段 anti-hack：规则过滤先高召回圈出可疑工具调用，LLM judge 再判断行为意图；在线守卫只拦截违规调用并返回占位结果，让轨迹继续，而不是整条丢弃导致训练震荡。这说明可插拔环境不仅要“能运行”，还必须守住奖励信号的真实性。',
        '关键转变——从“刷题”到“交付项目”：过去的 post-training 更像给模型一组编程练习题，题目边界、所需信息和验收方式都已准备好，模型容易学成擅长考试的答题者。GLM-5.3 把训练单元扩大到真实项目的体量，部分任务相当于资深工程师连续工作数天：没有用户在旁边拆步骤、提醒下一步，也没有一眼可见的标准答案；模型必须自己理解目标、调查现状、定位瓶颈、提出假设、执行修改、根据反馈迭代，最后通过验收。训练的对象由“写出一段正确代码”变成“独立完成一项专业工作”。',
        'ML 基础设施优化就是代表性案例：模型进入一个接近内部开发现场的环境，拿到真实算力集群、存储设施、内部文档、代码库与历史实验结果。目标不是回答“怎样优化性能”，而是在保证正确性的前提下真正跑实验、发现系统瓶颈、修改实现、比较基线与新方案，并交付可复现、可量化的加速结果。环境不给过程性提示，只通过系统状态、运行日志、测试和最终指标反馈结果；模型因此必须学会完整的工程闭环，而不是复述优化知识。',
        '为什么瓶颈转向环境：模型只有在任务可执行时才能让行动产生真实后果，只有在结果可验证时 RL 才能区分有效改进与投机取巧，只有贴近真实工作时训练轨迹才覆盖模糊需求、隐藏状态、失败恢复和多步协作。这样的环境比短题目更难生产：要提供完整依赖和基础设施，还要保证任务确实可解、奖励不会泄漏或被 hack。智谱据此判断，继续扩大后训练的主要约束已经不是再换一种训练算法，而是能否持续生产大量“可执行、可验证、贴近真实专业工作”的高质量环境。',
        '从 5.2 到 5.3：框架稳定后，瓶颈转移到环境供给。研究 agent 从真实工作采集任务模式，judge agent 验证可解性，验证器通过 oracle、no-op 和未解态检查后才产出奖励；编程、ML 基础设施、网络安全等环境沿同一接口持续加入。GLM-5.3 沿用 GLM-5.2 的底座和 slime 技术栈，只扩大环境、任务多样性与后训练算力，最终六项长周期基准整体上升，token 效率改善，并在漏洞利用链上出现更完整的安全能力。',
      ],
      images: [
        {
          src: '/outline/slime-exercise-vs-project.jpg',
          caption:
            '概念图 · 从“刷题”到“交付项目”：左侧只有单文件、短任务和一次通过；右侧则是计算集群、存储、代码库、内部资料、历史实验与多轮验证组成的真实工程现场。环境规模扩大后，模型训练的不再是孤立答案，而是调查—实验—修改—复验—交付的完整工作链。',
          afterParagraph: 0,
        },
        {
          src: '/outline/slime-plugin-environments.jpg',
          caption:
            '概念图 · 一个稳定训练循环，连接多种可替换环境：代码测试、搜索、网络安全沙箱、ML 集群和多 Agent 工作流都使用相同的数据接口接入。外围插件可以持续增加或更换，中心的 Buffer—rollout—训练循环不需要随任务重写。',
          afterParagraph: 2,
        },
        {
          src: '/outline/slime-async-trajectories.jpg',
          caption:
            '概念图 · 异步处理长尾轨迹：蓝色短轨迹完成后立即进入训练并回传新权重，绿色节点表示已验证样本；橙色长轨迹仍可在另一条通道继续探索。系统始终维持在途任务，不必让整批 GPU 等待最慢的一条轨迹。',
          afterParagraph: 3,
        },
        {
          src: '/outline/slime-architecture.png',
          caption:
            'slime 官方架构图展示了“固定内核、开放边界”：左侧 Megatron Actor 负责训练并同步权重，右侧 SGLang Engine Pool 负责并行 rollout，sgl-router 把多个推理实例收敛成一个 OpenAI-compatible endpoint；上方自定义数据生成逻辑或外部 Agent 环境只通过这个端点交互，再把轨迹送回 Data Buffer。换任务时变化的是图上方的生成/环境插件，底部训练—采样—同步主干保持不动。',
          source: 'https://www.lmsys.org/blog/2025-07-09-slime/',
        },
        {
          src: '/outline/glm52-long-horizon.png',
          caption:
            'GLM-5.2 官方长周期评测图。三组任务分别允许最多 20、10、10 小时运行，考察的不是一次回答，而是持续读代码、修改、测试和纠错后的最终完成度。GLM-5.2 在 FrontierSWE 为 74.4%、PostTrainBench 为 34.3%、SWE-Marathon 为 13.0%；这张图证明 slime 承载的长轨迹训练已经转化为可测量能力，但它是整套模型、算法、环境与系统共同作用的结果，不能单独归因于框架。',
          source: 'https://z.ai/blog/glm-5.2',
        },
        {
          src: '/outline/glm53-benchmarks.png',
          caption:
            '六组柱状图，每组对应一个长周期基准（Terminal Bench 3.0、DeepSWE、Agents\' Last Exam 等），组内每根柱子是一个模型：蓝=GLM-5.3、绿=GLM-5.2，灰色为 Kimi K3、Fable 5、GPT-5.6 Sol 等对照。读法很简单——看每组蓝柱比绿柱高多少：这就是同一底座、只扩环境六周换来的提升。',
          source: 'https://z.ai/blog/glm-5.3',
        },
        {
          src: '/outline/glm53-codebench.png',
          caption:
            '折线图：横轴是平均每任务输出 token 数（越靠左越省），纵轴是 Z.ai Code Bench 任务完成率（越高越好），每条线串起同一模型在 Low/High/Max 三个 effort 档位的表现。蓝线整体位于绿线左上方——GLM-5.3 每个档位都花更少的 token、拿更高的完成率（Max 档 34.5% @ 75K tokens，上代为 23.4% @ 96K）。',
          source: 'https://z.ai/blog/glm-5.3',
        },
        {
          src: '/outline/glm53-cyber.png',
          caption:
            '三组柱状图对应安全能力链条的上中下游：CyberGym（从白盒源码发现并触发漏洞）、ExploitBench（真实漏洞的利用推理）、ExploitGym（2h/6h 限时内完成的利用任务数）。注意蓝绿差距的规律：越往链条上游，GLM-5.3 超出 GLM-5.2 越多——涌现的恰好是最难的那段能力。',
          source: 'https://z.ai/blog/glm-5.3',
        },
      ],
      points: [
        {
          text: '官方设计动机：不同任务各 fork 一套 RL 框架会造成补丁分叉与训练故障；slime 把变化集中到数据生成接口，让复杂 Agent 环境通过统一推理端点接入',
          source: 'https://www.lmsys.org/blog/2025-07-09-slime/',
        },
        {
          text: '核心数据流：Megatron 训练从 Data Buffer 取轨迹，SGLang rollout 生成新轨迹与验证结果；custom generate、custom reward 和外部 rollout engine 都只替换数据生产环节，不分叉训练 kernel',
          source: 'https://github.com/THUDM/slime',
        },
        {
          text: 'GLM-5.2 实证：同一 slime 系统承载白盒/黑盒 rollout、compact trajectory、sub-agent workflow，并行 OPD 在约两天内合并十余个专家模型',
          source: 'https://z.ai/blog/glm-5.2',
        },
        {
          text: '长轨迹适配：compaction 会让同一 prompt 产生不等长、不等数量的子轨迹；GLM-5.2 改用 critic-based PPO 和 token 级 loss，使这些轨迹都能进入训练',
          source: 'https://z.ai/blog/glm-5.2',
        },
        {
          text: '可信奖励：规则过滤 + LLM judge 在线拦截读取隐藏测试、下载答案等 hack，只阻断违规动作而不终止整条 rollout，减少训练不稳定',
          source: 'https://z.ai/blog/glm-5.2',
        },
        {
          text: '官方明确「Scaling post-training is all we did」：沿用 GLM-5.2 的 IndexShare、SAO、slime 技术栈，只增加环境数量、任务多样性与训练算力',
          source: 'https://z.ai/blog/glm-5.3',
        },
        {
          text: 'ML 基础设施案例把训练单元从“编程题”升级为“专家项目”：模型使用真实集群、存储、内部文档、代码库和历史实验，自主定位瓶颈并反复验证，在正确性约束下交付可复现、可量化的加速效果',
          source: 'https://z.ai/blog/glm-5.3',
        },
        {
          text: '环境可规模化生产：研究 agent 从真实工作中采集任务模式并合成长周期环境，judge agent 验证可解性；验证器不看参考解生成，须通过 oracle、no-op、未解态三重检查才产出可靠奖励信号',
          source: 'https://z.ai/blog/glm-5.3',
        },
        {
          text: '安全能力随环境扩展「涌现」：在训练混合中加入漏洞挖掘环境后，GLM-5.3 在 CyberGym 漏洞发现达 SOTA，利用链评测上较 GLM-5.2 翻倍以上',
          source: 'https://z.ai/blog/glm-5.3',
        },
      ],
    },
  ],
}
