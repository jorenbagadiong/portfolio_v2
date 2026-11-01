"use client"

import { useEffect, useMemo, useRef } from "react"
import { usePathname } from "next/navigation"
import { useFrame, useThree } from "@react-three/fiber"
import { useTheme } from "next-themes"
import * as THREE from "three"

import { particles } from "@/lib/particle-store"
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion"

import { createMorphController, MORPH_DURATION_MS } from "./morph"
import { computePairs } from "./pairs"
import { patterns, patternForPath } from "./patterns"
import { fragmentShader, vertexShader } from "./shaders"
import { useParticleCount } from "./useParticleCount"

const SEED = 7
const LINE_POINTS = 150
const LINE_DIST = 1.6
const LINE_MAX_PER_POINT = 3
const LINE_INTERVAL_MS = 500
const BURST_MS = 900
const COLOR_TWEEN_MS = 400

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
  const pathname = usePathname()
  const count = useParticleCount()
  const reduced = usePrefersReducedMotion()
  const { resolvedTheme } = useTheme()
  const { invalidate, gl } = useThree()

  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)

  const pointsMaterialRef = useRef<THREE.ShaderMaterial>(null)
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null)

  const controller = useMemo(
    () =>
      createMorphController(patterns[patternForPath(pathname)](count, SEED)),
    // Created once per count; route changes go through controller.start.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count]
  )

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
      new THREE.BufferAttribute(
        new Float32Array(LINE_POINTS * LINE_MAX_PER_POINT * 6),
        3
      )
    )
    g.setDrawRange(0, 0)
    return g
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector3(999, 999, 0) },
      uBurst: { value: 0 },
      uSize: { value: 5 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color(0, 1, 0.6) },
      uOpacity: { value: 0.9 },
    }),
    []
  )

  const state = useRef({
    active: true,
    lastPathname: pathname,
    burstStart: -Infinity,
    colorTween: null as null | {
      from: THREE.Color
      to: THREE.Color
      start: number
    },
    hasColor: false,
    pairs: new Uint16Array(LINE_POINTS * LINE_MAX_PER_POINT * 2),
    pairCount: 0,
    pairCounts: new Uint8Array(LINE_POINTS),
    lastPairs: -Infinity,
    wasMorphing: true,
    pointerTarget: new THREE.Vector2(),
    pointerSeen: false,
    needsApply: true,
  })

  const reducedRef = useRef(reduced)
  reducedRef.current = reduced

  // Morph on route change.
  useEffect(() => {
    const s = state.current
    if (s.lastPathname === pathname && !s.needsApply) return
    s.lastPathname = pathname
    const target = patterns[patternForPath(pathname)](count, SEED)
    const now = performance.now()
    controller.start(target, reducedRef.current ? now - MORPH_DURATION_MS : now)
    s.wasMorphing = true
    invalidate()
  }, [pathname, count, controller, invalidate])

  // Burst pulses (ignored under reduced motion).
  useEffect(() => {
    return particles.subscribe((kind) => {
      if (kind !== "burst" || reducedRef.current) return
      state.current.burstStart = performance.now()
      invalidate()
    })
  }, [invalidate])

  // Pointer, projected onto z = 0 each frame.
  useEffect(() => {
    if (reduced) return
    const onMove = (e: PointerEvent) => {
      const s = state.current
      s.pointerTarget.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      )
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
      if (pointsMaterialRef.current) {
        pointsMaterialRef.current.blending = dark
          ? THREE.AdditiveBlending
          : THREE.NormalBlending
      }
      if (lineMaterialRef.current) {
        lineMaterialRef.current.opacity = dark ? 0.25 : 0.35
        lineMaterialRef.current.blending = dark
          ? THREE.AdditiveBlending
          : THREE.NormalBlending
      }
      if (!s.hasColor || reducedRef.current) {
        uniforms.uColor.value.copy(next)
        lineMaterialRef.current?.color.copy(next)
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
    const morphing = controller.isMorphing(now)

    const pos = controller.update(now)
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute
    ;(attr.array as Float32Array).set(pos)
    attr.needsUpdate = true

    uniforms.uPixelRatio.value = frame.gl.getPixelRatio()

    // Color tween
    let tweening = false
    if (s.colorTween) {
      const k = Math.min(1, (now - s.colorTween.start) / COLOR_TWEEN_MS)
      uniforms.uColor.value.lerpColors(s.colorTween.from, s.colorTween.to, k)
      lineMaterialRef.current?.color.copy(uniforms.uColor.value)
      if (k >= 1) s.colorTween = null
      else tweening = true
    }

    if (isReduced) {
      uniforms.uTime.value = 1
      uniforms.uBurst.value = 0
      uniforms.uPointer.value.set(999, 999, 0)
    } else {
      uniforms.uTime.value = now / 1000
      uniforms.uBurst.value = Math.max(0, 1 - (now - s.burstStart) / BURST_MS)
      if (s.pointerSeen) {
        const cam = frame.camera as THREE.PerspectiveCamera
        const halfH =
          Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z
        uniforms.uPointer.value.set(
          s.pointerTarget.x * halfH * cam.aspect,
          s.pointerTarget.y * halfH,
          0
        )
      }
    }

    // Lines
    const morphEnded = s.wasMorphing && !morphing
    if (morphEnded || (!morphing && now - s.lastPairs > LINE_INTERVAL_MS)) {
      s.pairCount = computePairs(
        pos,
        Math.min(LINE_POINTS, count),
        LINE_DIST,
        LINE_MAX_PER_POINT,
        s.pairs,
        s.pairCounts
      )
      s.lastPairs = now
    }
    s.wasMorphing = morphing
    const lp = lineGeometry.getAttribute("position") as THREE.BufferAttribute
    const larr = lp.array as Float32Array
    const pairs = s.pairs
    const len = s.pairCount * 2
    for (let k = 0; k < len; k += 2) {
      const a = pairs[k] * 3
      const b = pairs[k + 1] * 3
      const o = k * 3
      larr[o] = pos[a]
      larr[o + 1] = pos[a + 1]
      larr[o + 2] = pos[a + 2]
      larr[o + 3] = pos[b]
      larr[o + 4] = pos[b + 1]
      larr[o + 5] = pos[b + 2]
    }
    lp.needsUpdate = true
    lineGeometry.setDrawRange(0, len)

    const needMore =
      morphing || tweening || uniforms.uBurst.value > 0 || !s.hasColor
    if (s.active && (needMore || !isReduced)) invalidate()
  })

  useEffect(
    () => () => {
      geometry.dispose()
      lineGeometry.dispose()
    },
    [geometry, lineGeometry]
  )

  return (
    <>
      <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
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
      <lineSegments
        ref={linesRef}
        geometry={lineGeometry}
        frustumCulled={false}
      >
        <lineBasicMaterial
          ref={lineMaterialRef}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </lineSegments>
    </>
  )
}
