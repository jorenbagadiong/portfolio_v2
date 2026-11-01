export const vertexShader = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform vec3 uPointer;
  uniform float uBurst;
  uniform float uSize;
  uniform float uPixelRatio;

  void main() {
    vec3 pos = position;

    // Drift
    float a = uTime * 0.2 + aSeed * 6.28;
    pos += vec3(sin(a), cos(a * 1.3), sin(a * 0.7)) * 0.15;

    // Cursor attraction
    vec3 toPointer = uPointer - pos;
    float d = length(toPointer);
    float falloff = 1.0 - smoothstep(0.0, 2.0, d);
    pos += normalize(toPointer + vec3(0.0001)) * falloff * 0.4;

    // Burst
    pos += normalize(pos + vec3(0.0001)) * uBurst * 2.5;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (10.0 / -mv.z);
  }
`

export const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d) * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`
