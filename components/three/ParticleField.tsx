"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useTheme } from "next-themes"
import * as THREE from "three"

import {
  INTRO_MORPH_MS,
  INTRO_READY_EVENT,
  INTRO_SKIP_EVENT,
  introClock,
} from "@/lib/intro"
import { particles } from "@/lib/particle-store"
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion"

import { nearestPoints } from "./cursor"
import { displace, RIPPLE_GAIN, type DisplaceState } from "./displace"
import { createMorphController } from "./morph"
import { computePairs } from "./pairs"
import { constellation } from "./patterns"
import {
  fragmentShader,
  lineFragmentShader,
  lineVertexShader,
  vertexShader,
} from "./shaders"
import { nextFrameDelay, isSmallDevice } from "./budget"
import { useParticleCount } from "./useParticleCount"

const SEED = 7
const LINE_DIST = 2.2
const LINE_MAX_PER_POINT = 3
const CURSOR_RADIUS = 2.5
const CURSOR_LINES = 4
const VIEW_FILL = 1.1
const Z_RANGE = 1.5
const COLOR_TWEEN_MS = 400
const SCROLL_FACTOR = 0.0015
const SCROLL_LIMIT = 1.5
const TILT = 0.05

function readParticleColor(): THREE.Color {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--particle")
    .trim()
  const [r, g, b] = raw.split(/\s+/).map(Number)
  if ([r, g, b].some((v) => Number.isNaN(v) || v === undefined)) {
    return new THREE.Color(0, 1, 0.6)
  }
  return new THREE.Color(r / 255, g / 255, b / 255)
}

export default function ParticleField() {
  const count = useParticleCount()
  const [small] = useState(isSmallDevice)
  const reduced = usePrefersReducedMotion()
  const { resolvedTheme } = useTheme()
  const { invalidate, gl } = useThree()

  const groupRef = useRef<THREE.Group>(null)
  const pointsMaterialRef = useRef<THREE.ShaderMaterial>(null)
  const lineMaterialRef = useRef<THREE.ShaderMaterial>(null)

  const maxPairs = count * LINE_MAX_PER_POINT
  const maxSegments = maxPairs + CURSOR_LINES

  // Mounted during the intro: assemble from the center over 1.4s, on the
  // clock shared with IntroLoader. Otherwise start in the final state.
  const intro = useMemo(
    () => document.documentElement.classList.contains("intro"),
    []
  )

  const { controller, introStart, target } = useMemo(() => {
    const target = constellation(count, SEED)
    const now = performance.now()
    if (!intro) {
      return {
        controller: createMorphController(target),
        introStart: 0,
        target,
      }
    }
    const start = new Float32Array(target.length)
    for (let i = 0; i < start.length; i++) start[i] = target[i] * 0.02
    const c = createMorphController(start, INTRO_MORPH_MS)
    c.start(target, now)
    return { controller: c, introStart: now, target }
  }, [count, intro])

  // Tell IntroLoader the canvas is live so the intro timing follows it.
  useEffect(() => {
    if (!intro) return
    introClock.ready = introStart
    window.dispatchEvent(new Event(INTRO_READY_EVENT))
  }, [intro, introStart])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(count * 3), 3)
    )
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) seeds[i] = Math.random()
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1))
    return g
  }, [count])

  const lineGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(maxSegments * 6), 3)
    )
    g.setAttribute(
      "aAlpha",
      new THREE.BufferAttribute(new Float32Array(maxSegments * 2), 1)
    )
    g.setDrawRange(0, 0)
    return g
  }, [maxSegments])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTwinkle: { value: 0 },
      uSize: { value: 12 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color(0, 1, 0.6) },
      uOpacity: { value: 0.9 },
    }),
    []
  )
  const lineUniforms = useMemo(
    () => ({
      uColor: uniforms.uColor,
      uOpacity: { value: 0.3 },
    }),
    [uniforms]
  )

  const state = useRef({
    active: true,
    burstStart: -Infinity,
    burstGain: 1,
    colorTween: null as null | {
      from: THREE.Color
      to: THREE.Color
      start: number
    },
    hasColor: false,
    skipped: false,
    lineBase: 0.3,
    pairs: new Uint16Array(maxPairs * 2),
    pairDist: new Float32Array(maxPairs),
    pairCounts: new Uint8Array(count),
    cursorIdx: new Int16Array(CURSOR_LINES),
    positions: new Float32Array(count * 3),
    pointerNdc: { x: 0, y: 0 },
    pointer: { x: 0, y: 0 },
    pointerSeen: false,
    tiltX: 0,
    tiltY: 0,
    scale: { x: 1, y: 1, z: Z_RANGE },
    dstate: {
      time: 0,
      pointer: null,
      burstAge: null,
      scale: { x: 1, y: 1, z: Z_RANGE },
    } as DisplaceState,
  })

  const reducedRef = useRef(reduced)
  reducedRef.current = reduced

  // Burst pulses (ignored under reduced motion).
  useEffect(() => {
    return particles.subscribe((kind) => {
      if (reducedRef.current) return
      state.current.burstGain = kind === "ripple" ? RIPPLE_GAIN : 1
      state.current.burstStart = performance.now()
      invalidate()
    })
  }, [invalidate])

  // Skipping the intro jumps the points to their final positions.
  useEffect(() => {
    const onSkip = () => {
      state.current.skipped = true
      controller.start(target, performance.now() - INTRO_MORPH_MS)
      invalidate()
    }
    window.addEventListener(INTRO_SKIP_EVENT, onSkip)
    return () => window.removeEventListener(INTRO_SKIP_EVENT, onSkip)
  }, [controller, target, invalidate])

  // Pointer position as normalized device coordinates.
  useEffect(() => {
    if (reduced) return
    const onMove = (e: PointerEvent) => {
      const s = state.current
      s.pointerNdc.x = (e.clientX / window.innerWidth) * 2 - 1
      s.pointerNdc.y = -(e.clientY / window.innerHeight) * 2 + 1
      s.pointerSeen = true
      invalidate()
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [reduced, invalidate])

  // Pause when hidden or off-screen.
  useEffect(() => {
    const s = state.current
    const parent = gl.domElement.parentElement
    let visible = true
    const update = () => {
      s.active = !document.hidden && visible
      if (s.active) invalidate()
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    if (parent) io.observe(parent)
    document.addEventListener("visibilitychange", update)
    return () => {
      io.disconnect()
      document.removeEventListener("visibilitychange", update)
    }
  }, [gl, invalidate])

  // Theme colors, blending and line opacity.
  useEffect(() => {
    if (!resolvedTheme) return
    const s = state.current
    const dark = resolvedTheme === "dark"
    const id = requestAnimationFrame(() => {
      const next = readParticleColor()
      const blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending
      if (pointsMaterialRef.current) {
        pointsMaterialRef.current.blending = blending
      }
      if (lineMaterialRef.current) {
        lineMaterialRef.current.blending = blending
      }
      s.lineBase = dark ? 0.3 : 0.36
      uniforms.uOpacity.value = dark ? 0.9 : 0.85
      if (!s.hasColor || reducedRef.current) {
        uniforms.uColor.value.copy(next)
        s.hasColor = true
      } else {
        s.colorTween = {
          from: uniforms.uColor.value.clone(),
          to: next,
          start: performance.now(),
        }
      }
      invalidate()
    })
    return () => cancelAnimationFrame(id)
  }, [resolvedTheme, uniforms, invalidate])

  // Re-render once when reduced motion toggles.
  useEffect(() => {
    invalidate()
  }, [reduced, invalidate])

  useFrame((frame) => {
    const s = state.current
    const now = performance.now()
    const isReduced = reducedRef.current
    const group = groupRef.current

    // Color tween
    let tweening = false
    if (s.colorTween) {
      const k = Math.min(1, (now - s.colorTween.start) / COLOR_TWEEN_MS)
      uniforms.uColor.value.lerpColors(s.colorTween.from, s.colorTween.to, k)
      if (k >= 1) s.colorTween = null
      else tweening = true
    }

    const base = controller.update(now)
    const morphing = controller.isMorphing(now)

    // Field scale tracks the visible viewport so it fills any aspect ratio.
    const { width, height } = frame.viewport
    s.scale.x = (width / 2) * VIEW_FILL
    s.scale.y = (height / 2) * VIEW_FILL + SCROLL_LIMIT
    s.scale.z = Z_RANGE

    // Group transform: scroll parallax and pointer tilt.
    let burstAge: number | null = null
    s.dstate.pointer = null
    if (isReduced) {
      uniforms.uTime.value = 0
      uniforms.uTwinkle.value = 0
      if (group) {
        group.position.y = 0
        group.rotation.set(0, 0, 0)
      }
    } else {
      uniforms.uTime.value = now / 1000
      uniforms.uTwinkle.value = 0.35
      const age = (now - s.burstStart) / 1000
      if (age >= 0 && age < 1.2) burstAge = age
      if (group) {
        const targetY = s.pointerSeen ? s.pointerNdc.x * TILT : 0
        const targetX = s.pointerSeen ? -s.pointerNdc.y * TILT : 0
        s.tiltY += (targetY - s.tiltY) * 0.06
        s.tiltX += (targetX - s.tiltX) * 0.06
        group.rotation.set(s.tiltX, s.tiltY, 0)
        group.position.y = Math.max(
          -SCROLL_LIMIT,
          Math.min(SCROLL_LIMIT, -window.scrollY * SCROLL_FACTOR)
        )
      }
      if (s.pointerSeen) {
        s.pointer.x = s.pointerNdc.x * (width / 2)
        s.pointer.y = s.pointerNdc.y * (height / 2) - (group?.position.y ?? 0)
        s.dstate.pointer = s.pointer
      }
    }

    s.dstate.time = isReduced ? 0 : now / 1000
    s.dstate.burstAge = burstAge
    s.dstate.burstGain = s.burstGain
    s.dstate.scale = s.scale
    const pos = s.positions
    displace(base, pos, count, s.dstate)

    const attr = geometry.getAttribute("position") as THREE.BufferAttribute
    ;(attr.array as Float32Array).set(pos)
    attr.needsUpdate = true
    uniforms.uPixelRatio.value = frame.gl.getPixelRatio()

    // Line opacity ramps in over the last 30% of the intro morph.
    let ramp = 1
    if (intro && !s.skipped) {
      ramp = Math.min(
        1,
        Math.max(0, ((now - introStart) / INTRO_MORPH_MS - 0.7) / 0.3)
      )
    }
    lineUniforms.uOpacity.value = s.lineBase * ramp

    // Lines: pairs recomputed every frame, alpha fades linearly with distance.
    const n = computePairs(
      pos,
      count,
      LINE_DIST,
      LINE_MAX_PER_POINT,
      s.pairs,
      s.pairCounts,
      s.pairDist
    )
    const lp = lineGeometry.getAttribute("position") as THREE.BufferAttribute
    const la = lineGeometry.getAttribute("aAlpha") as THREE.BufferAttribute
    const larr = lp.array as Float32Array
    const aarr = la.array as Float32Array
    for (let k = 0; k < n; k++) {
      const a = s.pairs[k * 2] * 3
      const b = s.pairs[k * 2 + 1] * 3
      const o = k * 6
      larr[o] = pos[a]
      larr[o + 1] = pos[a + 1]
      larr[o + 2] = pos[a + 2]
      larr[o + 3] = pos[b]
      larr[o + 4] = pos[b + 1]
      larr[o + 5] = pos[b + 2]
      aarr[k * 2] = aarr[k * 2 + 1] = 1 - s.pairDist[k] / LINE_DIST
    }
    let segments = n

    // Cursor lines: faint links from the pointer to its nearest points.
    if (s.dstate.pointer && !morphing) {
      const m = nearestPoints(
        pos,
        count,
        s.pointer.x,
        s.pointer.y,
        CURSOR_RADIUS,
        CURSOR_LINES,
        s.cursorIdx
      )
      for (let c = 0; c < m; c++) {
        const idx = s.cursorIdx[c] * 3
        const o = segments * 6
        larr[o] = s.pointer.x
        larr[o + 1] = s.pointer.y
        larr[o + 2] = 0
        larr[o + 3] = pos[idx]
        larr[o + 4] = pos[idx + 1]
        larr[o + 5] = pos[idx + 2]
        const d = Math.hypot(pos[idx] - s.pointer.x, pos[idx + 1] - s.pointer.y)
        aarr[segments * 2] = aarr[segments * 2 + 1] =
          0.7 * (1 - d / CURSOR_RADIUS)
        segments++
      }
    }
    lp.needsUpdate = true
    la.needsUpdate = true
    lineGeometry.setDrawRange(0, segments * 2)

    const needMore = morphing || tweening || burstAge !== null || !s.hasColor
    if (s.active && (needMore || !isReduced)) {
      // Small devices render at ~30fps: wait out the rest of the frame budget.
      const wait = nextFrameDelay(small, performance.now() - now)
      if (wait > 0) window.setTimeout(invalidate, wait)
      else invalidate()
    }
  })

  useEffect(
    () => () => {
      geometry.dispose()
      lineGeometry.dispose()
    },
    [geometry, lineGeometry]
  )

  return (
    <group ref={groupRef}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={pointsMaterialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments geometry={lineGeometry} frustumCulled={false}>
        <shaderMaterial
          ref={lineMaterialRef}
          vertexShader={lineVertexShader}
          fragmentShader={lineFragmentShader}
          uniforms={lineUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}
