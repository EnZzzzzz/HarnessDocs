/**
 * 大纲章节汇总：按大纲.md 的一级标题顺序排列。
 * 每章一个文件，见 sections/ 目录。
 */
import type { OutlineSectionData } from './outline-data'
import { S01_FOUNDATION } from './sections/01-foundation-vendors'
import { S02_B_END } from './sections/02-b-end-vendors'
import { S03_SPATIOTEMPORAL } from './sections/03-spatiotemporal'
import { S04_VSCODE_LIMITS } from './sections/04-vscode-limits'
import { S05_SELF_EVOLUTION } from './sections/05-self-evolution'
import { S06_HERMES } from './sections/06-hermes-loop'
import { S07_PLUGIN_FUNCTIONS } from './sections/07-plugin-functions'
import { S08_DESIGN_HARNESS } from './sections/08-design-harness'
import { S09_GEN_VS_JUDGE } from './sections/09-gen-vs-judge'
import { S10_KEY_OUTPUTS } from './sections/10-key-outputs'
import { S11_DELIVERY } from './sections/11-delivery-scenarios'

export const OUTLINE_SECTIONS: OutlineSectionData[] = [
  S01_FOUNDATION,
  S02_B_END,
  S04_VSCODE_LIMITS,
  S03_SPATIOTEMPORAL,
  S06_HERMES,
  S07_PLUGIN_FUNCTIONS,
  S08_DESIGN_HARNESS,
  S09_GEN_VS_JUDGE,
  S10_KEY_OUTPUTS,
  S11_DELIVERY,
]

/** 时间线后优先展示的核心章节。 */
export const FEATURED_SECTION = S05_SELF_EVOLUTION
