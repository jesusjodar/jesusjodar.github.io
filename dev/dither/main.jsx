/* oxlint-disable react/only-export-components */
import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ShaderMount } from '@paper-design/shaders'
import { Dithering, ImageDithering } from '@paper-design/shaders-react'
import glsl2 from 'glsl-dither/2x2.glsl?raw'
import glsl4 from 'glsl-dither/4x4.glsl?raw'
import glsl8 from 'glsl-dither/8x8.glsl?raw'
import lygia from './vendor/bayer.glsl?raw'
import ign from './vendor/interleavedGradientNoise.glsl?raw'
import './style.css'
const clean = s => s.replace(/^#pragma.*$/gm, '')
const prelude = `precision highp float; varying vec2 vUv; uniform vec2 uSize; uniform float uPixel,uProgress,uMode; float luma(vec3 c){return dot(c,vec3(.299,.587,.114));} float luma(vec4 c){return luma(c.rgb);}\n#define PLATFORM_WEBGL\n`
function Shader({ library, variant, pixel, progress, mode }) {
 const host = useRef(null), api = useRef(null)
 useEffect(() => {
  const source = library === 'glsl' ? clean({ '2x2':glsl2,'4x4':glsl4,'8x8':glsl8 }[variant]) : variant === 'Bayer 8×8' ? lygia : ign
  const threshold = library === 'glsl' ? `dither${variant}(cell, field)` : variant === 'Bayer 8×8' ? 'step(ditherBayer(cell), field)' : 'step(ditherInterleavedGradientNoise(cell)*.5+.5,field)'
  const fragment = prelude + source + `\nvoid main(){vec2 cell=floor(gl_FragCoord.xy/uPixel);vec2 uv=(cell+.5)*uPixel/uSize; float field; if(uMode<.5){field=clamp(.5+.28*sin(uv.x*9.+uProgress*5.)+.24*cos(uv.y*11.-uProgress*4.),0.,1.);}else{float curve=uv.x+.12*sin(uv.y*6.283)+.04*cos(uv.y*17.);field=clamp((curve-uProgress*1.5+.25)*2.,0.,1.);if(uProgress<=0.)field=1.;if(uProgress>=1.)field=0.;}float bit=${threshold};vec3 back=vec3(.025,.035,.045);vec3 front=vec3(.75,.95,.32);gl_FragColor=vec4(mix(back,front,bit),1.);}`
  const shader = '#version 300 es\n' + fragment.replace('varying vec2 vUv;', 'out vec4 fragColor;').replaceAll('gl_FragColor','fragColor')
  const mount = new ShaderMount(host.current, shader, {uSize:[1,1],uPixel:4,uProgress:.5,uMode:0}, {alpha:false,antialias:false},0,0,1,400000)
  api.current = mount
  const resize=()=>{const {width,height}=host.current.getBoundingClientRect();mount.setUniforms({uSize:[width,height]})}
  const observer=new ResizeObserver(resize);observer.observe(host.current);resize()
  return()=>{observer.disconnect();api.current=null;mount.dispose()}

 },[library,variant])
 useEffect(()=>{api.current?.setUniforms({uPixel:pixel,uProgress:progress,uMode:mode==='Transición'?1:0})},[pixel,progress,mode,library,variant])
 return <div className="surface" ref={host}/>
}
function App(){
 const [pixel,setPixel]=useState(4),[progress,setProgress]=useState(.5),[playing,setPlaying]=useState(false),[mode,setMode]=useState('Textura')
 const [g,setG]=useState('4x4'),[l,setL]=useState('Bayer 8×8'),[p,setP]=useState('4x4'),[shape,setShape]=useState('wave'),[paperMode,setPaperMode]=useState('Procedural')
 useEffect(()=>{if(!playing)return;let id;const start=performance.now();const tick=t=>{setProgress((1-Math.cos((t-start)/1800))/2);id=requestAnimationFrame(tick)};id=requestAnimationFrame(tick);return()=>cancelAnimationFrame(id)},[playing])
 const select=(value,set,items)=><select value={value} onChange={e=>set(e.target.value)}>{items.map(x=><option key={x}>{x}</option>)}</select>
 return <><header><div><small>LABORATORIO LOCAL · SIN CAMBIOS EN EL PORTFOLIO</small><h1>Tres formas de hacer dither.</h1><p>GLSL Dither y Lygia comparten escena y transición de prueba. Paper muestra sus componentes originales.</p></div><a href="/">Volver a la web ↗</a></header>
 <nav><label>Píxel <b>{pixel}px</b><input aria-label="Tamaño del píxel" type="range" min="1" max="12" value={pixel} onChange={e=>setPixel(+e.target.value)}/></label><label>Progreso / fase <b>{Math.round(progress*100)}%</b><input aria-label="Progreso" type="range" min="0" max="1" step=".001" value={progress} onChange={e=>{setPlaying(false);setProgress(+e.target.value)}}/></label><button onClick={()=>setPlaying(!playing)}>{playing?'Pausar':'Animar comparación'}</button>{select(mode,setMode,['Textura','Transición'])}</nav>
 <main><article><h2>01 / GLSL Dither</h2><p>Bayer ordenado, regular y muy retro.</p>{select(g,setG,['2x2','4x4','8x8'])}<Shader library="glsl" variant={g} pixel={pixel} progress={progress} mode={mode}/><a href="https://github.com/hughsk/glsl-dither">Código original · MIT ↗</a></article>
 <article><h2>02 / Lygia</h2><p>Bayer o ruido intercalado, menos cuadriculado.</p>{select(l,setL,['Bayer 8×8','Interleaved gradient noise'])}<Shader library="lygia" variant={l} pixel={pixel} progress={progress} mode={mode}/><a href="https://github.com/patriciogonzalezvivo/lygia/tree/main/color/dither">Código original · Prosperity / Patron ↗</a></article>
 <article><h2>03 / Paper Shaders</h2><p>Patrones procedurales y tratamiento de imágenes.</p><div className="options">{select(paperMode,setPaperMode,['Procedural','Imagen'])}{select(p,setP,['2x2','4x4','8x8','random'])}{select(shape,setShape,['simplex','warp','dots','wave','ripple','swirl','sphere'])}</div><div className="surface">{paperMode==='Procedural'?<Dithering width="100%" height="100%" colorBack="#06090b" colorFront="#bff252" type={p} shape={shape} size={pixel} speed={0} frame={progress*12000} minPixelRatio={1} maxPixelCount={400000}/>:<ImageDithering width="100%" height="100%" image="/neon-noise.svg" type={p} size={pixel} colorBack="#06090b" colorFront="#bff252" colorHighlight="#ffffff" colorSteps={2} minPixelRatio={1} maxPixelCount={400000}/>}</div><a href="https://shaders.paper.design/dithering">Componente original · Apache 2.0 ↗</a></article></main>
 <footer><p>En modo Transición se prueba una máscara de salida con frente curvo en GLSL y Lygia. Paper tiene su propia fase procedural: no representa el mismo progreso de salida.</p><p>Más opciones de Paper: <a href="https://shaders.paper.design/halftone-dots">Halftone dots</a> · <a href="https://shaders.paper.design/halftone-cmyk">Halftone CMYK</a> · <a href="https://shaders.paper.design/image-dithering">Image dithering</a>. Lygia también incluye triangle noise, blue noise y Vlachos. Lygia se evalúa aquí en desarrollo; su licencia debe revisarse antes de integrarlo en producción.</p></footer></>
}
createRoot(document.getElementById('root')).render(<App/> )
