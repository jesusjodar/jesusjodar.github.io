export const fragment = `#version 300 es
precision highp float;
uniform mediump vec2 u_resolution;
out vec4 fragColor;
#define vUv (gl_FragCoord.xy / u_resolution)
uniform vec2 uSize;
uniform float uProgress;
uniform float uDim;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 s = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), s.x),
             mix(hash(i + vec2(0., 1.)), hash(i + vec2(1.)), s.x), s.y);
}
vec3 hue(vec3 color, float angle) {
  float c = cos(angle), s = sin(angle);
  return vec3(
    dot(color, vec3(.213 + .787*c - .213*s, .715 - .715*c - .715*s, .072 - .072*c + .928*s)),
    dot(color, vec3(.213 - .213*c + .143*s, .715 + .285*c + .140*s, .072 - .072*c - .283*s)),
    dot(color, vec3(.213 - .213*c - .787*s, .715 - .715*c + .715*s, .072 + .928*c + .072*s)));
}
void main() {
  // Densidad equivalente en vertical y horizontal, sin deformar los ejes.
  vec2 p = (vUv - .5) * uSize / sqrt(uSize.x * uSize.y) * 4.2;
  p = p * (1.0 + sin(uProgress * 1.5707963) * .3) + vec2(17., 9.);
  float n = noise(p) * .57 + noise(p * 2.) * .285 + noise(p * 4.) * .145;
  vec3 green = vec3(.11, .70, .003);
  vec3 yellow = vec3(.70, .67, .012);
  vec3 color = mix(green, yellow, smoothstep(.32, .72, n));
  color = clamp(hue(color, radians(uProgress * 100.)), 0., 1.);
  fragColor = vec4(color * (1.0 - uDim), 1.0);
}
`
