import { ditheringFragmentShader, DitheringShapes, DitheringTypes } from '@paper-design/shaders'
import { fragment as noiseFragment } from './noiseShader.js'

// Default setup for page transitions.
export const transitionUniforms = {
  uRipple: 0, uSize: [1, 1], uProgress: 0, uDim: 0,
  uCoverage: 0, uTransition: 0, uDirection: [-1, 0], uBackgroundUV: [0, 0, 1, 1],
  u_originX: .5, u_originY: .5, u_worldWidth: 0, u_worldHeight: 0, u_fit: 1,
  u_scale: 1, u_rotation: 0, u_offsetX: 0, u_offsetY: 0,
  u_pxSize: 4, u_shape: DitheringShapes.wave, u_type: DitheringTypes['4x4'],
  u_colorBack: [0, 0, 0, 0], u_colorFront: [1, 1, 1, 1],
}

// Adapt Paper's original 4x4/wave shader into a scroll-driven coverage pass.
// Paper Shaders: Apache-2.0, https://github.com/paper-design/shaders
const background = noiseFragment
  .replace('#version 300 es', '')
  .replace('precision highp float;', '')
  .replace('uniform mediump vec2 u_resolution;', '')
  .replace('out vec4 fragColor;', '')
  .replace('#define vUv (gl_FragCoord.xy / u_resolution)', '')
  .replace('void main()', 'vec4 backgroundColor()')
  .replace('(vUv - .5)', '((uBackgroundUV.xy + vUv * uBackgroundUV.zw) - .5)')
  .replace('fragColor =', 'return')

export const fragment = ditheringFragmentShader
  .replace('uniform vec2 u_resolution;', '')
  .replace('precision mediump float;', `precision highp float;

uniform mediump vec2 u_resolution;
uniform float uRipple;
uniform float uCoverage;
uniform float uTransition;
uniform vec2 uDirection;
uniform vec4 uBackgroundUV;
#define vUv (gl_FragCoord.xy / u_resolution)
${background}`)
  .replaceAll('uniform float u_', 'uniform mediump float u_')
  .replace('void main()', 'void paperMain()')
  .replace('int type = int(floor(u_type));', `// A directional wave front covers the outgoing section, then reveals the next.
  float sweep = uTransition < .47 ? uCoverage : 1. - uCoverage;
  vec2 crossAxis = vec2(-uDirection.y, uDirection.x);
  float distance = dot(vUv, uDirection) - min(0., uDirection.x) - min(0., uDirection.y);
  float edge = distance + .045 * sin(dot(vUv, crossAxis) * 6.283185 + t * .2);
  if (uRipple > .5) {
    vec2 radial = (vUv - .5) * uSize / max(uSize.x, uSize.y);
    edge = length(radial) * 1.414214 + .035 * sin(length(radial) * 28. - t * .2);
  }
  float front = (sweep * 1.4 - edge) / .4;
  shape = uTransition < .47 ? front : 1. - front;
  int type = int(floor(u_type));`)
  + `
void main(){
  if(uCoverage<=0.){fragColor=vec4(0.);return;}
  float coverage=1.;
  if(uCoverage<1.){paperMain();coverage=fragColor.a;}
  vec3 color=backgroundColor().rgb;
  fragColor=vec4(color*coverage,coverage);
}`

