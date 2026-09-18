import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

// 1. Vertex Shader: calculamos vUv en hardware en vez de dividir gl_FragCoord en cada fragmento
const vertex = `#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// 2. Fragment Shader: vectorizado SIMD y libre de operaciones redundantes
const fragment = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform float iTime;
uniform float uRatio;
uniform float uInvRatio;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform float uOutputBrightness;
uniform float uOutputContrast;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uLightMode;

#define S(a,b,t) smoothstep(a,b,t)

mat2 Rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

// SIMD Perlin Noise con interpolación quíntica C2 de Perlin (evita discontinuidades y aristas en la rejilla)
float noiseVectorized(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  // Curva de interpolación C2 de Ken Perlin (6t^5 - 15t^4 + 10t^3) elimina dientes de sierra y bandas
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

  // Evaluamos el dot base de 'i' una sola vez
  float dot0 = dot(i, vec2(2127.1, 81.17));
  float dot1 = dot(i, vec2(1269.5, 283.37));

  // Las 4 esquinas son sumas de constantes directas
  vec4 pX = vec4(dot0, dot0 + 2127.1, dot0 + 81.17, dot0 + 2208.27);
  vec4 pY = vec4(dot1, dot1 + 1269.5, dot1 + 283.37, dot1 + 1552.87);

  vec4 hX = -1.0 + 2.0 * fract(sin(pX) * 43758.5453);
  vec4 hY = -1.0 + 2.0 * fract(sin(pY) * 43758.5453);

  vec4 dx = vec4(f.x, f.x - 1.0, f.x, f.x - 1.0);
  vec4 dy = vec4(f.y, f.y, f.y - 1.0, f.y - 1.0);
  vec4 dots = hX * dx + hY * dy;

  vec2 nX = mix(dots.xz, dots.yw, u.x);
  float n = mix(nX.x, nX.y, u.y);
  return 0.5 + 0.5 * n;
}

void main() {
  float t = iTime * uTimeSpeed;
  vec2 tuv = (vUv - 0.5 + uCenterOffset) / max(uZoom, 0.001);

  // Mapeo suave curvado: evita singularidades rectilíneas a lo largo de los ejes ortogonales
  float degree = noiseVectorized(vec2(t * 0.1, tuv.x * tuv.y + dot(tuv, tuv) * 0.2) * uNoiseScale);
  tuv.y *= uInvRatio;
  tuv *= Rot(radians((degree - 0.5) * uRotationAmount + 180.0));
  tuv.y *= uRatio;

  float frequency = uWarpFrequency;
  float ws = max(uWarpStrength, 0.001);
  float invAmp = ws / max(uWarpAmplitude, 0.001);
  float warpTime = t * uWarpSpeed;

  tuv.x += sin(tuv.y * frequency + warpTime) * invAmp;
  tuv.y += sin(tuv.x * (frequency * 1.5) + warpTime) * (invAmp * 2.0);

  float b = uColorBalance;
  float s = max(uBlendSoftness, 0.0);
  
  float rad = radians(uBlendAngle);
  float blendX = dot(tuv, vec2(cos(rad), -sin(rad)));

  float edge0 = -0.3 - b - s;
  float edge1 =  0.2 - b + s;
  float v0    =  0.5 - b + s;
  float v1    = -0.3 - b - s;

  float blendFactor = S(edge0, edge1, blendX);
  vec3 layer1 = mix(uColor3, uColor2, blendFactor);
  vec3 layer2 = mix(uColor2, uColor1, blendFactor);
  vec3 col = mix(layer1, layer2, S(v0, v1, tuv.y));

  // Si el grano es 0 (como en App.jsx), omitimos sin coste GPU
  if (uGrainAmount > 0.0001) {
    vec2 grainUv = vUv * max(uGrainScale, 0.001);
    if (uGrainAnimated > 0.5) grainUv += vec2(iTime * 0.05);
    float grain = fract(sin(dot(grainUv, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * uGrainAmount;
  }

  col = (col - 0.5) * uContrast + 0.5;
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(luma), col, uSaturation);

  // Omitimos pow() cuando gamma es 1.0 (evita exp2 y log2 trascendentes)
  if (abs(uGamma - 1.0) > 0.001) {
    col = pow(max(col, 0.0), vec3(1.0 / max(uGamma, 0.001)));
  }
  col = clamp(col, 0.0, 1.0);

  if (uLightMode > 0.5) {
    float energy = max(max(col.r, col.g), col.b);
    vec3 hue = col / max(energy, 0.001);
    float chroma = length(col - vec3(dot(col, vec3(0.333333))));
    float coverage = clamp(0.12 + chroma * 1.15 + energy * 0.18, 0.0, 0.88);
    col = mix(vec3(1.0), clamp(hue * 0.58 + col * 0.18, 0.0, 1.0), coverage);
  }

  // Grado de salida (sustituye al filter CSS brightness+contrast que
  // llevaba el wrapper: evita refiltrar el canvas animado en cada frame).
  // Orden idéntico al anterior: saturación, clamp, brillo, contraste.
  col *= uOutputBrightness;
  col = (col - 0.5) * uOutputContrast + 0.5;

  fragColor = vec4(col, 1.0);
}
`;

// Mantiene renderer/program vivos entre re-renders sin reconstruir contexto WebGL
const ctxMap = new WeakMap();

const Grainient = ({
  timeSpeed = 0.25,
  colorBalance = 0.0,
  warpStrength = 1.0,
  warpFrequency = 5.0,
  warpSpeed = 2.0,
  warpAmplitude = 50.0,
  blendAngle = 0.0,
  blendSoftness = 0.05,
  rotationAmount = 500.0,
  noiseScale = 2.0,
  grainAmount = 0.1,
  grainScale = 2.0,
  grainAnimated = false,
  animated = false,
  contrast = 1.5,
  gamma = 1.0,
  saturation = 1.0,
  outputBrightness = 1.0,
  outputContrast = 1.0,
  centerX = 0.0,
  centerY = 0.0,
  zoom = 0.9,
  color1 = '#FF9FFC',
  color2 = '#5227FF',
  color3 = '#B497CF',
  lightMode = false,
  renderScale = 1,
  frameSkip = 1,
  className = ''
}) => {
  const containerRef = useRef(null);
  const renderScaleRef = useRef(renderScale);
  const frameSkipRef = useRef(frameSkip);
  const timeSpeedRef = useRef(timeSpeed);
  const grainAnimatedRef = useRef(grainAnimated);
  const animatedRef = useRef(animated);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Configuración óptima de WebGL:
    // - alpha: false -> El compositor del SO no necesita mezclar el canvas con capas inferiores.
    // - depth: false -> Ahorra un buffer de profundidad de 24-bit y su correspondiente clear.
    // - powerPreference: 'low-power' -> Evita activar GPUs dedicadas en portátiles.
    // - dpr: equilibrado hasta 1.5 para máxima nitidez sin sobrecargar la GPU.
    const renderer = new Renderer({
      webgl: 2,
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      powerPreference: 'low-power',
      dpr: Math.min(window.devicePixelRatio || 1, 1.5)
    });

    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime:           { value: 0 },
        uRatio:          { value: 1.0 },
        uInvRatio:       { value: 1.0 },
        uTimeSpeed:      { value: 0.25 },
        uColorBalance:   { value: 0.0 },
        uWarpStrength:   { value: 1.0 },
        uWarpFrequency:  { value: 5.0 },
        uWarpSpeed:      { value: 2.0 },
        uWarpAmplitude:  { value: 50.0 },
        uBlendAngle:     { value: 0.0 },
        uBlendSoftness:  { value: 0.05 },
        uRotationAmount: { value: 500.0 },
        uNoiseScale:     { value: 2.0 },
        uGrainAmount:    { value: 0.1 },
        uGrainScale:     { value: 2.0 },
        uGrainAnimated:  { value: 0.0 },
        uContrast:       { value: 1.5 },
        uGamma:          { value: 1.0 },
        uSaturation:     { value: 1.0 },
        uOutputBrightness: { value: 1.0 },
        uOutputContrast:   { value: 1.0 },
        uCenterOffset:   { value: new Float32Array([0, 0]) },
        uZoom:           { value: 0.9 },
        uColor1:         { value: new Float32Array([1, 1, 1]) },
        uColor2:         { value: new Float32Array([1, 1, 1]) },
        uColor3:         { value: new Float32Array([1, 1, 1]) },
        uLightMode:      { value: 0.0 }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctxMap.set(container, { renderer, program, mesh });

    const scale = Math.min(1, Math.max(0.1, renderScaleRef.current ?? 1));
    const skip = Math.max(1, Math.floor(frameSkipRef.current ?? 1));
    // Intervalo de throttling independiente del refresco de pantalla (60/120/144Hz)
    const minDelta = skip > 1 ? (1000 / (60 / skip)) - 4 : 0;
    const staticMode = !animatedRef.current || ((timeSpeedRef.current ?? 0) === 0 && !grainAnimatedRef.current);

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));

      renderer.setSize(
        Math.max(1, Math.round(w * scale)),
        Math.max(1, Math.round(h * scale))
      );

      canvas.style.width = '100%';
      canvas.style.height = '100%';

      const bw = gl.drawingBufferWidth || w;
      const bh = gl.drawingBufferHeight || h;
      const ratio = bw / bh;
      program.uniforms.uRatio.value = ratio;
      program.uniforms.uInvRatio.value = 1.0 / ratio;

      renderer.render({ scene: mesh, sort: false, frustumCull: false, update: false, clear: false });
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const t0 = performance.now();
    let lastRender = 0;

    const loop = t => {
      if (minDelta > 0 && t - lastRender < minDelta) {
        raf = requestAnimationFrame(loop);
        return;
      }
      lastRender = t;
      program.uniforms.iTime.value = (t - t0) * 0.001;
      renderer.render({ scene: mesh, sort: false, frustumCull: false, update: false, clear: false });
      raf = requestAnimationFrame(loop);
    };

    const tryStart = () => {
      if (staticMode) return;
      if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) tryStart();
      else stop();
    });
    io.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) tryStart();
      else stop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  // Actualización reactiva de uniforms sin re-montar
  useEffect(() => {
    const ctx = ctxMap.get(containerRef.current);
    if (!ctx) return;
    const { program, renderer, mesh } = ctx;
    const u = program.uniforms;

    timeSpeedRef.current = timeSpeed;
    animatedRef.current = animated;
    renderScaleRef.current = renderScale;
    frameSkipRef.current = frameSkip;
    grainAnimatedRef.current = grainAnimated;

    u.uTimeSpeed.value = timeSpeed;
    u.uColorBalance.value = colorBalance;
    u.uWarpStrength.value = warpStrength;
    u.uWarpFrequency.value = warpFrequency;
    u.uWarpSpeed.value = warpSpeed;
    u.uWarpAmplitude.value = warpAmplitude;
    u.uBlendAngle.value = blendAngle;
    u.uBlendSoftness.value = blendSoftness;
    u.uRotationAmount.value = rotationAmount;
    u.uNoiseScale.value = noiseScale;
    u.uGrainAmount.value = grainAmount;
    u.uGrainScale.value = grainScale;
    u.uGrainAnimated.value = grainAnimated ? 1.0 : 0.0;
    u.uContrast.value = contrast;
    u.uGamma.value = gamma;
    u.uSaturation.value = saturation;
    u.uOutputBrightness.value = outputBrightness;
    u.uOutputContrast.value = outputContrast;
    u.uCenterOffset.value[0] = centerX;
    u.uCenterOffset.value[1] = centerY;
    u.uZoom.value = zoom;
    u.uLightMode.value = lightMode ? 1.0 : 0.0;

    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    const c3 = hexToRgb(color3);
    u.uColor1.value.set(c1);
    u.uColor2.value.set(c2);
    u.uColor3.value.set(c3);

    // Re-render manual si está en pausa
    if (timeSpeed === 0 && !grainAnimated) {
      renderer.render({ scene: mesh, sort: false, frustumCull: false, update: false, clear: false });
    }
  }, [
    timeSpeed, colorBalance, warpStrength, warpFrequency, warpSpeed,
    warpAmplitude, blendAngle, blendSoftness, rotationAmount, noiseScale,
    grainAmount, grainScale, grainAnimated, contrast, gamma, saturation,
    centerX, centerY, zoom, color1, color2, color3, lightMode,
    renderScale, frameSkip, outputBrightness, outputContrast, animated
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ contain: 'strict' }}
    />
  );
};

export default Grainient;
