import type { OutlineSectionData } from '../outline-data'

export const S07_PLUGIN_FUNCTIONS: OutlineSectionData = {
  id: 'plugin-functions',
  kicker: '插件式 Function 拓展 · Self-Built Plugins',
  title: 'Function 拓展式的自进化',
  intro:
    '当模型遇到一个现成插件解决不了的问题，理想形态是：它现场把所需的 Function 开发出来、装进来、用完还能复用。以 DeepSeek Harness 为例看这个闭环如何成立。',
  cards: [
    {
      badge: '01',
      title: '底座：一切皆插件',
      en: 'Everything Is a Plugin',
      tagline: '模型、工具、会话、UI 全是插件，能力边界由插件决定',
      detail: [
        '先看问题：传统 agent 框架的能力是写死的——换一个工具注册表、改一段 agent loop 都要动框架源码；即便以扩展著称的 VS Code，插件一旦激活也无法热卸载，只能重启整个 extension host。对「模型自己修改自己运行其上的系统」这种需求，这样的结构根本不成立。',
        '再看做法：DeepSeek Harness 建立在 Cordis 元框架之上，模型、工具、技能、会话、沙箱、存储、循环、调度乃至 UI 全部是插件。Cordis 把「动态组合」拆成两个维度来解决：时间可组合性要求插件注册每个 Effect 时同时登记撤销方式——装工具时记录怎么注销、加 Prompt 时记录怎么移除，卸载即彻底撤回；空间可组合性让组件只声明依赖的 Service，依赖未出现就等待、被替换就先撤销自身再基于新实现重新激活。开发者只改配置，不改源码。',
        '效果是：一个默认部署挂载了 159 个插件，llm、session、timer 等核心能力都可独立启停（见下图）；The Register 称其设计「创新」，Pi agent 作者 Armin Ronacher 说这是他第一次在空间里的新项目上「想重新审视自己的选择」。评论者把它比作早期 Unix——默认体验粗糙，但底层结构彻底开放。这为「自己给自己装能力」提供了结构前提。',
      ],
      images: [
        {
          src: '/outline/dsh-plugins-panel.png',
          caption:
            '官方 Settings → Plugins 面板：一个部署挂载了 159 个插件，llm、session、timer、api-gateway 等核心能力都以插件形式列出并可独立启停——"一切皆插件"的直接写照',
          source: 'https://deepseek.com/harness/en/',
        },
      ],
      points: [
        {
          text: 'Cordis 内核负责插件的挂载、卸载与依赖管理，agent 能力全部住在插件里',
          source: 'https://deepseek.com/harness/en/',
        },
        {
          text: '插件覆盖模型、工具、技能、会话、沙箱、存储、循环、调度与 UI，可混合、替换、扩展',
          source: 'https://www.theregister.com/ai-and-ml/2026/08/14/deepseeks_innovative_harness_treats_everything_as_a_plug-in/5288095',
        },
        {
          text: '开发者不改 Harness 源码，仅在配置中选择、替换、扩展任意能力',
          source: 'https://deepseek.com/harness/en/',
        },
        {
          text: '编者按：大纲提到的"DeepSeek Honeycomb"未检索到对应产品，本卡依据 DeepSeek Harness 官方资料撰写',
          source: 'https://github.com/deepseek-ai/deepseek-harness',
        },
      ],
    },
    {
      badge: '02',
      title: '现场造插件',
      en: 'Creator Mode',
      tagline: '检查运行时、内存里试插件，模型自己攒出新能力',
      detail: [
        '问题来自一线实测：博主「程序员鱼皮」发现，让 AI 顺手查个数据库、调个第三方接口，「它只会阿巴阿巴」——AI 只是个大脑，没有对应工具就动不了手。现成的服务可以用 MCP 一行配置接进来，但想要一个全新的工具怎么办？如果每要一个工具都得从头写插件，这条路就走不通。',
        'DSH 的解法是 Creator 模式：模型可以检查当前运行时状态，在内存中用动态 Cordis 插件现写现跑一个临时工具——不建文件、不装依赖。鱼皮的实测完整走了一遍这个流程：让模型创建 word_count 工具后，模型先加载 cordis-plugin-development 技能，调用 cordis_inspect_list 检查运行时，再用 cordis_run 运行插件；随后 word_count 真实注册进当前进程的工具列表，喂一段文字进去，调用卡片上真的出现了 word_count 并成功返回字符数、行数和单词数。',
        '这套机制也有明确边界：动态插件只在当前进程生效，停止插件或重启即消失，验证通过后要整理成正式的仓库插件才能长期复用；它运行在沙箱里但不是安全边界，运行前仍需人工检查生成的代码。更大的想象空间在于：腾讯新闻的分析把 Creator 模式称为「交互式 Agent Foundry」——它虽还不是自进化系统，但造插件的过程会留下 Harness Patch、修改理由和人工反馈，是未来模型学习「如何设计插件」的训练数据入口。B 端场景里，企业也可以让 agent 针对内部系统现场长出专属 Function。',
      ],
      images: [
        {
          src: '/outline/dsh-creator-word-count-prompt.png',
          caption:
            '实测对话：用户要求"用动态 Cordis 插件临时创建 word_count 工具"，模型加载 cordis-plugin-development 技能后先调用 cordis_inspect_list 检查运行时——正是 Creator 模式的标准动作',
          source: 'https://www.codefather.cn/post/2092472825448239106',
        },
        {
          src: '/outline/dsh-creator-plugin-registered.png',
          caption:
            '插件热加载后的验证过程：cordis_run 运行成功，word_count 真实注册进当前进程的工具列表；完成情况表记录了从环境检查、定义、修 schema 错误到注册验证的全过程',
          source: 'https://www.codefather.cn/post/2092472825448239106',
        },
        {
          src: '/outline/dsh-four-modes-qqnews.png',
          caption:
            '腾讯新闻整理的 DSH 四模式对照表：从上到下依次是标准模式（日常 coding agent）、PTC/Code 模式（降低多步工具调用往返成本）、极简模式（模型能力基线测量环境）、创造模式（Agent Foundry / plugin 创作入口）。注意最下面一行的「关键组成」列——runtime inspect + 动态 Cordis package + preset 编写，正是本卡叙事的官方定位',
          source: 'https://news.qq.com/rain/a/20260820A0BZZE00',
        },
      ],
      points: [
        {
          text: 'Creator 模式可检查当前运行时、在内存中试验 Cordis 插件、组合出新模式',
          source: 'https://deepseek.com/harness/en/',
        },
        {
          text: '动态插件能力不需建文件、不需装依赖，可直接在对话中试验插件组合',
          source: 'https://www.codefather.cn/post/2092472825448239106',
        },
        {
          text: '造插件的过程被视为训练数据入口：模型可从中学习如何设计插件',
          source: 'https://news.qq.com/rain/a/20260820A0BZZE00',
        },
        {
          text: '社区已出现"插件开发技能"插件：任何 agent 加载后即可按统一规范开发 DSH 插件',
          source: 'https://github.com/zimodzh/dsh-plugin-dev-skills',
        },
      ],
    },
    {
      badge: '03',
      title: '插件市场闭环',
      en: 'Plugin Ecosystem',
      tagline: '搜索、审查、安装、卸载，插件像应用一样可分发',
      detail: [
        '插件能现场造出来只是第一步。造完存到哪、别人怎么找到、敢不敢装——这三个问题不解决，生态就转不起来，每个团队都只能重复造自己的轮子。',
        '官方先把分发做成约定：`dsh plugin --profile web add` 一条命令即可安装，包操作转发给 pnpm，因此 npm、GitHub、本地路径的规格都支持；插件仓库只需打上 GitHub `dsh-plugin` 话题标签就能被生态发现。社区则补上了「面向模型的市场」：dsh-plugin-market 插件把 plugin_search / plugin_vet / plugin_report / plugin_install 四个工具直接提供给 agent——搜索在官方渠道找候选并按相关度打分，vet 对每个候选做有界静态安全扫描（安装期远程代码、混淆、凭据读取、数据外发等分级扣分，安全分从 100 起扣，出现 critical 项直接判高风险），report 生成对比报告交给用户选择，install 最后执行安装。作者明确声明这是启发式评估而非安全保证，激活动作也刻意留给人手动完成。',
        '效果是生态真的转起来了：腾讯新闻统计，截至 8 月 19 日 GitHub `dsh-plugin` 话题已聚合约 7,700 个仓库（到 8 月底已超过 12,600 个）；经人工筛选的 awesome-dsh-plugin 清单收录约 1,500 个可直接安装的插件，获得约 9,200 stars、1,350 forks；dsh-market、dsh-find-plugin 等插件发现与管理基础设施也开始成型。从「现场造」到「搜得到、查得安全、装得上」，插件像应用一样可分发的闭环已经成立。',
      ],
      images: [
        {
          src: '/outline/dsh-plugin-topic-github.png',
          caption:
            'GitHub `dsh-plugin` 话题页：已有 12,601 个公开仓库挂靠该话题，deepseek-harness 官方仓库同样以 `dsh-plugin` 标签被索引——打标签即被生态发现的约定已经成立',
          source: 'https://github.com/topics/dsh-plugin',
        },
        {
          src: '/outline/dsh-plugin-install-chat.png',
          caption:
            '实测安装流程：用户直接把 GitHub 仓库地址丢进对话，模型理解意图后自行完成插件安装——插件像应用一样可分发的闭环体验',
          source: 'https://www.codefather.cn/post/2092472825448239106',
        },
        {
          src: '/outline/dsh-ecosystem-stats-qqnews.png',
          caption:
            'awesome-dsh-plugin 收录站首页：搜索框下标注共收录 1,500 个插件，下方分类标签给出分布——UI Enhancements 214、Tools & Capabilities 186、Memory 82、Security & Permissions 58、Plugin Markets & Managers 49 等；中间的 dsh-market 横幅（"browse and install everything on this list inside DeepSeek Harness"）正是「在 agent 里直接装市场插件」的入口',
          source: 'https://news.qq.com/rain/a/20260820A0BZZE00',
        },
      ],
      points: [
        {
          text: '`dsh plugin --profile web add github:owner/repo` 一条命令安装，包操作转发给 pnpm',
          source: 'https://github.com/0xsline/awesome-deepseek-harness',
        },
        {
          text: '官方约定：给插件仓库打上 `dsh-plugin` 话题标签即可被生态发现',
          source: 'https://github.com/deepseek-ai/deepseek-harness',
        },
        {
          text: '面向模型的插件市场插件提供 plugin_search / plugin_vet / plugin_report / plugin_install 流程',
          source: 'https://github.com/ACEMaravilla/dsh-plugin-market',
        },
        {
          text: '插件在 Settings → Plugins 面板中可视化管理，支持启用/禁用',
          source: 'https://github.com/0xsline/awesome-deepseek-harness',
        },
      ],
    },
    {
      badge: '04',
      title: '生活场景想象',
      en: 'Everyday Scenarios（示例）',
      tagline: '一句话订票、追球赛比分，缺什么插件现场造',
      detail: [
        '（假设性示例，机制基于卡片 02/03 的真实能力）把上面的机制搬到日常生活：用户对 agent 说「帮我抢下周五晚上的电影票」——可它手里并没有订票工具，这正是卡片 02 里「只会阿巴阿巴」的处境。',
        '按已验证的机制，agent 可以走两条路：先在插件市场里搜索、审查、安装一个现成的票务插件；找不到就在 Creator 模式下现场写一个调用票务接口的 Function 插件，热加载测试通过后完成下单。再说「盯一下今晚的比分」，照样先搜市场、没有再自己造。',
        '这个想象并非凭空：官方 Trajectory 视图里已有真实雏形——用户只说了一句「Build yourself a tool」，agent 就连续调用 bash 检查环境、解压会话数据、验证工具可行性。要补上的边界是：现场造的动态插件重启即消失，想「下次一句话直接调用」，需要先验证通过、再固化成正式的仓库插件。',
      ],
      images: [
        {
          src: '/outline/dsh-trajectory-self-build-tool.png',
          caption:
            '官方 Trajectory 视图里的真实轨迹：用户一句"Build yourself a tool"，agent 连续调用 bash 检查环境、解压会话数据、验证工具可行性——卡片设想的"缺什么现场造"机制在官方演示中已有雏形',
          source: 'https://deepseek.com/harness/en/',
        },
      ],
      points: [
        { text: '示例场景：用户一句话"买电影票"，agent 现场开发订票 Function 插件并完成任务' },
        { text: '示例场景：说"追球赛比分"，agent 优先搜索市场现成插件，没有再自己造' },
        {
          text: '机制支撑：内存中试验插件 + 固化为预设，来自 Creator 模式的真实能力',
          source: 'https://deepseek.com/harness/en/',
        },
        {
          text: '机制支撑："搜索→审查→安装"的自助闭环，来自社区模型向插件市场',
          source: 'https://github.com/ACEMaravilla/dsh-plugin-market',
        },
      ],
    },
  ],
}
