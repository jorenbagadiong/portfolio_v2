let cached: boolean | undefined

/**
 * Whether WebGL is available. Probed once and memoized; the probe context is
 * released right away so it does not count against the browser's context limit.
 */
export function hasWebGL(): boolean {
  if (cached !== undefined) return cached
  try {
    const c = document.createElement("canvas")
    const gl = (c.getContext("webgl2") ?? c.getContext("webgl")) as
      WebGLRenderingContext | WebGL2RenderingContext | null
    cached = !!gl
    gl?.getExtension("WEBGL_lose_context")?.loseContext()
  } catch {
    cached = false
  }
  return cached
}
