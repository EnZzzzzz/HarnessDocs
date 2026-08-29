/**
 * 大纲章节（大纲.md）的数据结构。
 * 每个一级标题对应一页（一个 OutlineSectionData），页内是统一样式的卡片。
 * 各章节数据在 sections/ 目录下，每章一个文件，由 sections.ts 汇总排序。
 */

export interface OutlineCardPoint {
  /** 要点描述 */
  text: string
  /** 出处：URL / 文档路径 / 论文名 */
  source?: string
}

export interface OutlineCardImage {
  /** 图片地址（public 下的相对路径） */
  src: string
  /** 图注 */
  caption?: string
  /** 出处链接 */
  source?: string
}

export interface OutlineCard {
  /** 小徽章，如「01」 */
  badge: string
  title: string
  /** 英文副标题，可选 */
  en?: string
  /** 卡片正面的一句话概括 */
  tagline: string
  /** 卡片正面的封面图（可选） */
  cover?: {
    src: string
    alt: string
  }
  /** 详情弹层：正文段落（有 detail 或 points 时卡片可点击展开） */
  detail?: string
  /** 详情弹层：配图 */
  images?: OutlineCardImage[]
  /** 详情弹层：要点列表 */
  points?: OutlineCardPoint[]
}

export interface OutlineSectionData {
  /** 锚点 id */
  id: string
  /** 顶部小胶囊标签 */
  kicker: string
  /** 页大标题 */
  title: string
  /** 标题下的引言，可选 */
  intro?: string
  cards: OutlineCard[]
}
