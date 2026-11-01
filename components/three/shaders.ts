export const vertexShader = /* glsl */ `
  attribute float aSeed;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vSeed;

  void main() {
    vSeed = aSeed;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    // Per-point size varies +-30%.
    float size = uSize * (0.7 + 0.6 * aSeed);
    gl_PointSize = size * uPixelRatio * (10.0 / -mv.z);
  }
`

export const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uTwinkle;
  varying float vSeed;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    // Bright core with a soft glow falling off to the edge.
    float core = smoothstep(0.2, 0.0, d);
    float glow = smoothstep(0.5, 0.0, d) * 0.55;
    float twinkle = 1.0 - uTwinkle * (0.5 - 0.5 * sin(uTime * 1.4 + vSeed * 6.2831));
    float alpha = (core + glow) * uOpacity * twinkle;
    gl_FragColor = vec4(uColor, alpha);
  }
`

export const lineVertexShader = /* glsl */ `
  attribute float aAlpha;
  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const lineFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(uColor, vAlpha * uOpacity);
  }
`
