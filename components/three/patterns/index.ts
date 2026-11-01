import { cloud } from "./cloud"
import { column } from "./column"
import { grid } from "./grid"
import { sphere } from "./sphere"
import type { PatternFn, PatternName } from "./types"

export type { PatternFn, PatternName }
export { patternForPath } from "./config"

export const patterns: Record<PatternName, PatternFn> = {
  cloud,
  column,
  grid,
  sphere,
}
