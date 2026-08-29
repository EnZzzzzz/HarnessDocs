import type { OutlineSectionData } from '../outline-data'

/**
 * 第 4 章「为什么类 VS Code 这种插件形式不行」
 * 依据：《一种面向时空可组合性的编程范式》§1.2.1（论文直接以 VSCode 为代表性案例）
 * 全文翻译：Cordis论文全文翻译-时空可组合性编程范式.md
 */
export const S04_VSCODE_LIMITS: OutlineSectionData = {
  id: 'vscode-limits',
  kicker: '反例剖析',
  title: 'Harness 走向插件化，为什么不能照搬 VS Code？',
  intro:
    '论文以应用最广泛的可扩展 IDE——Visual Studio Code——为插件系统的代表性案例，从时间与空间两个维度剖析其局限；并指出这两个局限并非 VSCode 独有，而是在各类插件系统中普遍存在。',
  cards: [
    {
      badge: '01',
      title: '共享宿主：无法运行时卸载',
      en: 'Extension Host',
      tagline: '禁用或卸载一个含代码的扩展，需要重启整个扩展宿主',
      detail: [
        '问题：运行时移除功能是动态组合的基本需求，而 VSCode 的架构恰好站在它的反面——所有扩展运行在同一个共享进程（扩展宿主）里，宿主不提供任何在运行时卸载单个扩展代码的机制。一旦扩展的 activate 被执行，禁用或卸载它的唯一办法就是重启整个宿主，宿主内所有已加载的扩展一起遭殃。',
        '论文用数据说明这不是边缘情况：主题、快捷键绑定、代码片段这类纯声明式扩展不含代码，可以自由移除；但安装量前 100 名的扩展中有 87 个包含可执行代码（2026-06-09 检索自 VS Code Marketplace），全部逃不开这次重启。论文同时指出，这个局限并非 VSCode 独有，而是在各类插件系统中普遍存在，只是程度不同。',
        '对照之下论文的范式给出了另一条路：可逆效应把「卸载」定义为按逆序运行累积器，组件原地撤销自己的全部效应——下方论文图 1 里 Fiber 经 L-Unload 回到 Inactive 的那条边，正是 VS Code 缺的那条。Koishi 的案例研究证明这条路可行：编排器从控制台禁用一个插件，其效应原地被撤销，系统其他部分的缓存状态与活动连接原样保留。',
      ],
      images: [
        {
          src: '/outline/vscode-extension-host-architecture.png',
          caption:
            'VS Code 官方文档的架构图：所有扩展（图中橙色块）都堆叠在同一个 Extension Host 进程内——卸载其中一个意味着重启整个宿主，波及其他扩展',
          source: 'https://code.visualstudio.com/api/advanced-topics/remote-extensions',
        },
        {
          src: '/outline/cordis-lifecycle.png',
          caption:
            '论文图 1（组件生命周期）：Cordis 中 Fiber 经 L-Unload 应用累积器原地回到 Inactive——单个组件的运行时卸载无需重启任何宿主，正是 VS Code 缺的那条边',
          source: 'https://arxiv.org/abs/2608.25512',
        },
      ],
      points: [
        {
          text: '纯声明式扩展（主题、快捷键、代码片段）不含代码，可以自由移除；含代码的不行',
          source: '§1.2.1 插件系统',
        },
        {
          text: '前 100 名扩展中 87 个包含可执行代码，移除时都需要重启宿主（2026-06 数据）',
          source: '§1.2.1 插件系统（脚注 1）',
        },
        {
          text: '对照范式：可逆效应让「卸载 = 运行累积器」，原地撤销而不惊扰其他组件',
          source: '§3.1 可逆效应',
        },
      ],
    },
    {
      badge: '02',
      title: 'deactivate 钩子：清理难以验证',
      en: 'Locality of Concern',
      tagline: '清理逻辑与创建逻辑分离，违背关注点的局部性',
      detail: [
        '问题：既然卸载免不了重启，VSCode 提供的 deactivate 钩子算不算一条退路？论文的回答是否定的——它只是宿主进程终止期间的优雅关闭回调，并不构成任何在运行中移除扩展的机制。',
        '更根本的问题在结构上：deactivate 把效应的处置与效应的创建（写在 activate 里）拆进了两个分离的钩子，违背了关注点的局部性。想验证「清理是否完整」，只能把两个相距甚远的函数对照着人工审查；完整清理因此难以验证，正确性最终依赖每位作者自身的勤勉，而不是任何可以局部检查的结构。',
        '对照范式把这段距离消掉了：可逆效应要求逆操作在效应被应用之处一并返回、由运行时持有，创建与撤销天然同处。Koishi 的实证补上效果一环——经由上下文执行的效应会被跟踪、逆操作自动组合，即使是没有经验的作者，一行卸载路径不写也能获得有序清理；原本押在个人勤勉上的正确性，由抽象一次性承担了。',
      ],
      images: [
        {
          src: '/outline/vscode-activate-deactivate.png',
          caption:
            'VS Code 官方文档「Extension Entry File」：扩展入口导出 activate 与 deactivate 两个分离的函数——清理逻辑写在另一个钩子里、远离创建之处，完整清理只能靠作者自觉',
          source: 'https://code.visualstudio.com/api/get-started/extension-anatomy',
        },
      ],
      points: [
        {
          text: 'deactivate 只在宿主终止时触发，不构成运行时卸载机制',
          source: '§1.2.1 插件系统',
        },
        {
          text: '效应的创建与处置分离在两个钩子里，完整清理无法局部地验证',
          source: '§1.2.1 插件系统',
        },
        {
          text: '对照范式：逆操作在效应被应用之处一并返回、由运行时持有，创建与撤销天然同处',
          source: '§3.1 可逆效应',
        },
        {
          text: 'Koishi 实证：抽象一次性承担清理正确性，作者无需编写卸载路径',
          source: '§5.3 案例研究：Koishi',
        },
      ],
    },
    {
      badge: '03',
      title: '固定扩展点：依赖几乎不存在',
      en: 'Fixed Extension Points',
      tagline: '扩展只向宿主贡献功能，却没有安全、结构化的相互依赖方式',
      detail: [
        '问题：空间维度要问的是——扩展之间能否互相依赖？先看一个耐人寻味的观察：VSCode 其实提供了 extensionDependencies 用于声明扩展间依赖，但安装量前 100 名的扩展中只有 7 个对非内置扩展声明了它。扩展间依赖几乎不存在，是需求不存在，还是机制把需求压住了？',
        '论文的剖析指向后者：扩展 API 只暴露固定的、表层的扩展点（命令、视图、语言特性），扩展被引导着向宿主贡献功能，而不是彼此依赖。仅剩的扩展间交互通道 getExtension(...).exports 不提供任何结构化契约——返回的值是无类型的（默认为 any），依赖方得不到一个经过检查的接口。简言之，宿主给了一组固定扩展点，却没有给出安全、结构化的相互依赖方式。',
        '效果的对照来自 Koishi 的开放生态：4000 多个社区插件呈现出真实的依赖拓扑——IM 适配器提供消息平台访问、数据库驱动提供持久化，功能插件把它们声明为共效应。运行时重配某个提供者（切换存储后端、重连适配器）时，只有依赖真正变化的依赖方会被重新激活；依赖暂不可用的插件保持非活跃、静默等待，不报错。关键在于这些插件出自互不协调的独立作者之手——响应式共效应在开放生态里维持了装配的一致性。',
      ],
      images: [
        {
          src: '/outline/vscode-contribution-points-views.png',
          caption:
            'VS Code 官方文档的扩展点示例：扩展通过 contributes.views 向宿主贡献一个侧边栏视图——扩展点由宿主固定提供，扩展是「向宿主贡献」而非彼此依赖',
          source: 'https://code.visualstudio.com/api/references/contribution-points',
        },
        {
          src: '/outline/vscode-getextension-exports.png',
          caption:
            'VS Code 官方 API 参考「extensions」一节（按官方文档原文重排）：上方示例演示了唯一的扩展间交互方式——提供方在 activate 里 return 自己的 API 表面，依赖方经 getExtension(\'genius.math\').exports 取回；注意下方系统维护的扩展列表类型是 readonly Extension<any>[]，跨扩展拿到的接口默认是 any，没有任何结构化契约',
          source: 'https://code.visualstudio.com/api/references/vscode-api',
        },
      ],
      points: [
        {
          text: '扩展点由宿主固定提供，扩展被引导向宿主贡献，而非相互依赖',
          source: '§1.2.1 插件系统',
        },
        {
          text: '前 100 名扩展中仅 7 个对非内置扩展声明 extensionDependencies',
          source: '§1.2.1 插件系统（脚注 1）',
        },
        {
          text: 'exports 机制无类型、无结构化契约，依赖方无法依赖一个经过检查的接口',
          source: '§1.2.1 插件系统',
        },
        {
          text: '对照范式：响应式共效应把依赖声明为类型化规约，由系统在运行时解析与收回',
          source: '§3.2 响应式共效应',
        },
        {
          text: 'Koishi 反例：真实依赖拓扑在开放生态中成立——适配器、数据库驱动被功能插件声明为共效应',
          source: '§5.3 案例研究：Koishi',
        },
      ],
    },
    {
      badge: '04',
      title: '粒度错配：权宜之计的代价',
      en: 'Coarse-Grained Workarounds',
      tagline: '靠重启进程和容器编排兜底，丢弃状态且表达不了细粒度依赖',
      detail: [
        '问题：插件系统做不到细粒度的动态组合，业界实际上怎么办？论文指出，大多数软件靠两类现成的粗粒度机制兜底：操作系统以进程为粒度提供时间可组合性，容器编排器以服务为粒度提供空间可组合性——行为失常的模块重启进程了事，服务依赖交给编排器管理。这也正是动态可组合性长期缺乏形式化关注的原因之一：粗粒度的替代品一直在那里。',
        '但权宜之计的代价是实打实的。时间维度上，每次重启丢弃进程内累积的全部状态——缓存、连接、部分完成的计算——重建需要数秒到数分钟；要在这段时间里维持可用性，还得部署冗余副本，为「无法只恢复单个组件」这个缺陷持续付出资源开销。空间维度上，容器级编排无法表达共享同一地址空间的组件之间的依赖，还为本可以是本地函数调用的交互引入网络开销。',
        '论文把症结收束为粒度错配：这些机制都作用于进程与容器的边界，而现代系统正日益在更细的层面上组合。由此引出全文的主张——需要一种组合式抽象，在与组件本身相同的层面上管理效应与依赖；后续章节的可逆效应与响应式共效应，正是对这个主张的回答。',
      ],
      images: [
        {
          src: '/outline/kubernetes-cluster-architecture.png',
          caption:
            'Kubernetes 官方架构图：编排器（控制平面 + kubelet）的管理粒度止步于节点与 Pod 边界——Pod 内部同一地址空间里组件之间的依赖，它既看不见也表达不了',
          source: 'https://kubernetes.io/docs/concepts/architecture/',
        },
      ],
      points: [
        {
          text: '时间维度：每次重启丢弃进程内状态，重建需数秒到数分钟',
          source: '§1.2.3 粗粒度的权宜之计',
        },
        {
          text: '空间维度：容器编排无法表达共享同一地址空间的组件之间的依赖',
          source: '§1.2.3 粗粒度的权宜之计',
        },
        {
          text: '症结是粒度错配：机制作用于进程与容器边界，而现代系统在更细的层面组合',
          source: '§1.2.3 粗粒度的权宜之计',
        },
        {
          text: '论文主张：需要一种组合式抽象，在与组件本身相同的层面管理效应与依赖',
          source: '§1.2.3 粗粒度的权宜之计',
        },
      ],
    },
  ],
}
