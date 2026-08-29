import type { OutlineSectionData } from '../outline-data'

export const S02_B_END: OutlineSectionData = {
  id: 'b-end-vendors',
  kicker: '为什么 Harness 热度这么高 · B 端 Harness 厂商',
  title: 'B 端厂商：办公入口争夺战',
  intro:
    'C 端免费换规模的路线撑不起算力成本，付费转化迟迟未被验证。大厂于是集体转向 B 端：谁把 Harness 嵌进企业办公流，谁就拿住下一个生态入口。',
  cards: [
    {
      badge: '01',
      title: 'C 端订阅路线遇阻',
      en: 'The Limits of C-End',
      tagline: '豆包 MAU 数亿却算不过账，C 端免费路线难以为继',
      detail: [
        '问题：豆包把 C 端免费路线推到了极限，也把它的结构性矛盾暴露得最彻底。截至 2026 年 3 月，豆包月活达 3.45 亿、日活峰值突破 1.5 亿，是国内用户规模最大的 AI 应用；但大模型的成本逻辑与移动互联网相反——用户越多、任务越重，算力成本越高，不存在规模效应摊薄。火山引擎披露豆包大模型日均 Token 调用量已突破 180 万亿、两年增长约 1500 倍，券商测算一天的免费服务成本在 1.3–2.4 亿元量级，而截至 2026 年上半年豆包应用每天收入不足百万元，2025 年字节净利润因此承压下滑超 70%。广告这条路又几乎走不通——办公、创作场景里没有适合植入广告的位置。',
        '做法：2026 年 5 月起，豆包开始测试三档付费订阅：标准版 68 元/月、加强版 200 元/月、专业版 500 元/月，付费功能聚焦 PPT 生成、数据分析、影视制作等生产力场景，免费版基础功能保持不变。定价本身也经过测算——68 元的起步价没有对标 20 美元的国际主流订阅价，而是接近 ChatGPT Go 的 8 美元平价档。同步推进的还有电商闭环：用户在对话里表达消费意图，豆包直接推荐商品并完成下单，让免费用户也能通过消费行为产生商业价值。',
        '效果：这场试水的初步答案并不乐观。花旗对 1800 名受访者的调查显示，45% 的人愿意为 AI 高级功能付费，但可接受的月均价格均值只有 48.3 元——比 68 元的起步价低约三成；83% 的受访者日均使用不足一小时，付费基本盘只是少数重度用户。用户结构更是「低端用不上、高端看不上」：学生和中老年用户占大头、用不到生产力功能，真正有高频需求的职场人又普遍认为豆包的专业能力不足。据虎嗅了解，豆包 2026 年不把付费渗透率作为核心考核——这场试水的真实目的，是打磨办公任务模式等 Agent 能力、反哺 B 端企业服务。C 端「免费获客、订阅变现」在国内尚未被证明成立，这正是大厂集体转向 B 端的直接背景。',
      ],
      images: [
        {
          src: '/outline/doubao-subscription-tiers.jpg',
          caption:
            '豆包 App 内的订阅服务声明截图：标准版 68 元/月、加强版 200 元/月、专业版 500 元/月，免费版基础功能不变——「做法」一段所述三档订阅的原始依据',
          source: 'https://finance.sina.com.cn/stock/t/2026-05-05/doc-inhwvumi4103265.shtml',
        },
        {
          src: '/outline/doubao-usage-ranking.jpg',
          caption:
            '花旗研究对中国 AI 产品使用率的调查：豆包以 79% 的用户渗透率遥遥领先——这是豆包敢启动付费试验的筹码，也是其成本压力的来源',
          source: 'https://finance.sina.com.cn/stock/t/2026-05-05/doc-inhwvumi4103265.shtml',
        },
        {
          src: '/outline/doubao-heavy-user-trust.jpg',
          caption:
            '花旗研究按日均使用时长分组的对比：左图是用户对 AI 聊天机器人的信任度（颜色越深越信任），右图是对「AI 推理与创造力已超越人类」的认同度。每天使用超 2 小时的重度用户中 59% 认为 AI「高度可信」，不足 30 分钟的轻度用户只有 16%——付费基本盘正是这批重度用户，而他们只占受访者的 5%，这决定了 C 端订阅的天花板',
          source: 'https://finance.sina.com.cn/stock/t/2026-05-05/doc-inhwvumi4103265.shtml',
        },
      ],
      points: [
        {
          text: '2026-05-04 豆包在 App Store 更新付费声明，测试三档订阅：标准版 68 元/月、加强版 200 元/月、专业版 500 元/月，付费聚焦生产力场景，免费版基础功能不变',
          source: 'https://www.huxiu.com/article/4870308.html',
        },
        {
          text: '成本端：豆包日均 Token 调用量突破 180 万亿、两年增长约 1500 倍；券商测算一天免费服务成本约 1.3–2.4 亿元，而豆包应用每天收入不足百万元；广告在 AI 办公、创作场景中几乎没有植入位置',
          source: 'https://www.huxiu.com/article/4870308.html',
        },
        {
          text: '付费意愿：花旗对 1800 名受访者的调查显示，45% 愿为 AI 高级功能付费，可接受的月均价格均值 48.3 元，低于豆包 68 元的起步价；83% 受访者日均使用不足一小时',
          source: 'https://finance.sina.com.cn/stock/t/2026-05-05/doc-inhwvumi4103265.shtml',
        },
        {
          text: '豆包月活达 3.45 亿（截至 2026 年 3 月，QuestMobile 数据），但报道指出国内 C 端订阅面临续费率低、算力成本倒挂等结构性难题',
          source: 'https://cj.sina.com.cn/articles/view/7857201856/1d45362c001906hd3u',
        },
        {
          text: '机构观点：豆包付费聚焦复杂任务与生产力场景，标志国产大模型应用从「免费获客、规模扩张」进入「付费转化、价值验证」阶段',
          source: 'https://m.cls.cn/detail/2407604',
        },
        {
          text: '媒体普遍将此次试水视为行业级实验：「C 端用户愿不愿意为 AI 付费」长期悬而未决，豆包的付费转化率将直接探明国内 AI 付费的规模天花板',
          source: 'https://finance.sina.com.cn/stock/t/2026-05-05/doc-inhwvumi4103265.shtml',
        },
      ],
    },
    {
      badge: '02',
      title: '大厂押注 B 端办公 Harness',
      en: 'The New Gateway',
      tagline: '腾讯、字节、阿里、微软齐下场，办公入口正在重排',
      detail: [
        '问题：C 端免费路线算不过账，云办公赛道又进入存量博弈——QuestMobile 数据显示，钉钉、企业微信、飞书三家合计市场覆盖率已达 92%，增量接近饱和。剩下的增长空间在 B 端，但企业部署 Agent 普遍卡在四个现实问题上：管理难闭环、能力配置难规模化、企业知识难传承、数字员工与 AI 资产难治理。谁能把 Agent 嵌进企业办公流、并把治理问题一并解决，谁就拿住下一个生态入口。',
        '做法：2026 年上半年，大厂密集把各自的办公平台改造成 Agent 平台。腾讯 6 月发布 WorkBuddy 企业版：数字员工 7×24 小时云端运行，连接企业知识库与业务系统；管理后台把 Agent 治理从「散装」变「统装」，统一管理权限、用量与成本；Skill 市场收录过万技能，员工可封装企业专属 Skill 共享给团队，让个体经验转化为团队资产；Connector 基于 One ID 统一身份体系，一键接入 OA、CRM、腾讯会议等现有工作流。企业微信则走开源路线，3 月底把 CLI 上架 GitHub，向 Claude Code、Codex 等主流 agent 开放消息、文档、日程、会议等 7 大核心能力。飞书 aily 主打「交付即用」，AI 产出直接沉淀为飞书文档、多维表格等协作对象；钉钉悟空主打「AI 员工」与业务流自动化——三大办公智能体形成对垒，微软则持续把 Copilot 织进 Office 全家桶。',
        '效果：迭代速度本身就是投入强度的证明——WorkBuddy 自 3 月发布以来不到 3 个月累计交付 43 个版本、平均每 2 天更新一次，腾讯 2026 年 Q1 财报称其为「中国最受欢迎的效率 AI 智能体服务」；同门的 CodeBuddy 已在腾讯内部覆盖超过 90% 工程师。办公入口的形态由此被改写：不再是一个 IM 或文档工具，而是一个可编排、可治理、可审计的 Agent 平台。',
      ],
      images: [
        {
          src: '/outline/workbuddy-enterprise-suite.png',
          caption:
            '腾讯 WorkBuddy 企业版及办公智能体套件全景图：企业 AI 工作台 + Skill 市场 + Connector 接入现有 OA/CRM/会议工作流，办公入口被整体重构为 agent 平台',
          source: 'https://www.sohu.com/a/1032778701_374240',
        },
        {
          src: '/outline/wecom-cli-github-readme.png',
          caption:
            '企业微信开源 CLI（WecomTeam/wecom-cli）的 README 功能范围表：消息、邮件、文档、日程、会议等核心办公能力全部向 AI agent 开放',
          source: 'https://github.com/WecomTeam/wecom-cli',
        },
        {
          src: '/outline/feishu-aily-agent-chat.png',
          caption:
            '飞书 aily 智能体对话界面：内置消息、会议、多维表格、日程、云文档、PPT、Excel 等飞书技能，AI 产出直接沉淀为协作对象',
          source: 'https://www.feishu.cn/content/article/7621764358124604369',
        },
      ],
      points: [
        {
          text: '腾讯 WorkBuddy：2026-03-09 上线全场景桌面智能体，兼容 OpenClaw 技能，1 分钟接入企业微信即可远程「遥控」干活；6 月发布企业版与 Skill 市场（收录过万技能），Connector 可一键接入 OA、CRM、腾讯会议等现有工作流',
          source: 'https://www.sohu.com/a/1032778701_374240',
        },
        {
          text: '企业微信开源 CLI：2026-03-30 上架 GitHub，向 Claude Code、Codex、WorkBuddy、QClaw 等主流 agent 开放消息、日程、文档、会议等 7 大核心能力',
          source: 'https://tech.ifeng.com/c/8ruZUiurEyV',
        },
        {
          text: '飞书 aily：飞书原生 Agent 办公平台，结合企业内部知识库与工作上下文完成调研分析、内容产出、跨项目跟进，AI 产出直接沉淀为文档、多维表格、任务卡片等协作对象',
          source: 'https://www.feishu.cn/content/article/7621764358124604369',
        },
        {
          text: '钉钉悟空：主打「AI 员工」逻辑，强调自主执行与业务流自动化，与飞书 aily、WorkBuddy 形成三大办公智能体对垒',
          source: 'http://www.iheima.com/article-395686.html',
        },
        {
          text: '存量背景：QuestMobile 数据显示钉钉、企业微信、飞书三者合计市场覆盖率已达 92%，增量市场接近饱和，竞争焦点从功能堆砌转向 AI 执行能力的深度整合',
          source: 'http://www.iheima.com/article-395686.html',
        },
        {
          text: '迭代强度：WorkBuddy 自 2026 年 3 月发布以来不到 3 个月累计交付 43 个版本、平均每 2 天一次更新；腾讯 2026 年 Q1 财报称其为「中国最受欢迎的效率 AI 智能体服务」，CodeBuddy 已覆盖腾讯超 90% 工程师',
          source: 'https://www.sohu.com/a/1032778701_374240',
        },
        {
          text: '微软 Microsoft 365 Copilot：官方发行说明保持高频迭代，持续把 agent 能力织入 Office 办公全家桶，是全球 B 端办公入口的标杆玩家',
          source: 'https://learn.microsoft.com/zh-cn/microsoft-365/copilot/release-notes',
        },
      ],
    },
    {
      badge: '03',
      title: 'B 端为什么愿意付费',
      en: 'Why Enterprises Pay',
      tagline: '数据私有、流程定制、可审计—— Harness 恰好都踩在点上',
      detail: [
        '问题：同样是为 AI 掏钱，C 端和 B 端是完全不同的两套逻辑。C 端用户为「更好聊」付钱的意愿有限——愿付费者能接受的月均价格均值只有 48.3 元；而企业采购时问的是另外三个问题：数据会不会出私域？流程能不能按我的业务定制？AI 干的每件事能不能查账、追责？这三个问题，把「裸模型 + 聊天框」形态的产品挡在了企业门外。',
        '做法：Harness 恰好把模型包进一个可管控的执行系统，三点全踩在 B 端采购逻辑上。数据私有——飞书 aily 需经权限配置后才允许 AI 基于企业内部知识库生成内容，官方承诺「所有内容都属于企业，权限清晰，可以追溯」「数据不出企业」。流程定制——WorkBuddy 企业版让员工封装企业专属 Skill 并共享给团队，「个体经验转化为团队资产」，Connector 基于统一身份体系对接企业已有工作流。可审计——HarnessEval 代表了更进一步的范式：评测不再是固定 rubric 打一个总分，而是「先理解案例、再决定测什么」的工作流，最终交付一棵完整的证据树，记录测了什么、调用了什么工具、证据如何支撑结论，全程可检查、可复现、可追责。',
        '效果：企业愿意为「可管控」付真金白银。供给侧，已有超 110 万企业和个人使用火山引擎的火山方舟大模型服务，年 Token 调用量超 1 万亿的企业达 200 家、半年内翻倍；海外的 Anthropic 从第一天起收费，每月活用户贡献 211 美元收入，Claude Code 推出六个月年化营收即达 10 亿美元。落地侧的回报同样直接：公牛集团部署飞书 aily 后，门店运营数据汇总、营销物料初稿生成等环节效率提升 60% 以上。',
      ],
      images: [
        {
          src: '/outline/feishu-aily-enterprise-security.png',
          caption:
            '飞书官方对 aily 企业级特性的表述：「所有内容都属于企业，权限清晰，可以追溯」「数据不出企业」「统一购买、用量分配和管控」——正是 B 端采购逻辑的三块基石',
          source: 'https://www.feishu.cn/content/article/7621764358124604369',
        },
        {
          src: '/outline/harnesseval-agentic-eval.png',
          caption:
            'HarnessEval 的 Agentic Evaluation 架构：模型输出经技能库调用评测工具，层层汇聚为 Skill Evidence 证据再得出最终分数——每个分数都可追溯、可审计',
          source: 'https://mp.weixin.qq.com/s/T_fBh7p82OHaKw75oq-5cQ',
        },
      ],
      points: [
        {
          text: '数据私有与权限可控：飞书 aily 支持对接企业自有知识库与业务系统，经权限配置后才允许 AI 基于内部数据生成内容',
          source: 'https://agent.csdn.net/6a5a0daf10ee7a33f28e806a.html',
        },
        {
          text: '流程定制：WorkBuddy 企业版让员工封装企业专属 Skill 并共享给团队，「个体经验转化为团队资产」；Connector 基于统一身份体系对接企业已有工作流',
          source: 'https://www.sohu.com/a/1032778701_374240',
        },
        {
          text: '可审计：HarnessEval 代表的评测范式把每个分数落成可追溯的证据树，「可检查、可复现、可追责」正是企业采购与合规的硬要求',
          source: 'https://mp.weixin.qq.com/s/T_fBh7p82OHaKw75oq-5cQ',
        },
        {
          text: 'C 端对照：花旗调研显示愿为 AI 高级功能付费的受访者，可接受的月均价格均值仅 48.3 元——C 端为「更好聊」付钱的意愿有限，与 B 端采购逻辑形成对照',
          source: 'https://finance.sina.com.cn/stock/t/2026-05-05/doc-inhwvumi4103265.shtml',
        },
        {
          text: '供给侧佐证：超 110 万企业和个人使用火山引擎火山方舟大模型服务，年 Token 调用量超 1 万亿的企业达 200 家、半年内翻倍；Anthropic 每月活用户贡献 211 美元收入，Claude Code 推出六个月年化营收达 10 亿美元',
          source: 'https://www.huxiu.com/article/4870308.html',
        },
        {
          text: '落地侧佐证：公牛集团部署飞书 aily 后，门店运营数据汇总、营销物料初稿生成等环节效率提升 60% 以上',
          source: 'https://agent.csdn.net/6a5a0daf10ee7a33f28e806a.html',
        },
      ],
    },
  ],
}
