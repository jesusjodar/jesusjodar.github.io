import { useEffect, useRef } from 'react'
import { SKILLS } from '../lib/portfolio.js'

// Contenido del CV (presentacional) + efecto de pixelado/dither del avatar.
// No conoce el marco ni el chat: solo renderiza el resumen.
export default function CvContent() {
  const pfpRef = useRef(null)

  useEffect(() => {
    const img = pfpRef.current
    if (!img) return
    let cancelled = false
    const run = () => {
      const source = new Image()
      source.decoding = 'async'
      source.src = '/pfp.jpg'
      source.onload = () => {
        if (cancelled) return
        try {
          const S = 280
          const canvas = document.createElement('canvas')
          canvas.width = S
          canvas.height = S
          const ctx = canvas.getContext('2d', { willReadFrequently: true })
          if (!ctx) return
          const { naturalWidth: nw, naturalHeight: nh } = source
          if (!nw || !nh) return
          const scale = Math.max(S / nw, S / nh) * 1.17
          const dw = nw * scale
          const dh = nh * scale
          const ox = (S - dw) * 0.1
          const oy = (S - dh) * 0.1
          ctx.drawImage(source, ox, oy, dw, dh)
          const frame = ctx.getImageData(0, 0, S, S)
          const px = frame.data
          const bayer = [
            [0, 8, 2, 10],
            [12, 4, 14, 6],
            [3, 11, 1, 9],
            [15, 7, 13, 5],
          ]
          const levels = 7
          const spread = 40
          const contrast = 1.18
          const exposure = 14
          const gamma = 0.9
          for (let y = 0; y < S; y += 1) {
            for (let x = 0; x < S; x += 1) {
              const i = (y * S + x) * 4
              const gray =
                px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114
              const graded = (gray - 128) * contrast + 128 + exposure
              const clamped = Math.min(255, Math.max(0, graded))
              const lifted = Math.pow(clamped / 255, gamma) * 255
              const t = (bayer[y % 4][x % 4] / 16 - 0.5) * spread
              const q =
                Math.round(((lifted + t) / 255) * (levels - 1)) / (levels - 1)
              const v = Math.min(255, Math.max(0, Math.round(q * 255)))
              px[i] = v
              px[i + 1] = v
              px[i + 2] = v
            }
          }
          ctx.putImageData(frame, 0, 0)
          if (!cancelled && pfpRef.current) {
            pfpRef.current.src = canvas.toDataURL('image/png')
          }
        } catch {
          /* deja la foto original */
        }
      }
      source.onerror = () => {
        /* deja la foto original / alt */
      }
    }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 2000 })
      return () => {
        cancelled = true
        window.cancelIdleCallback?.(id)
      }
    }
    const id = window.setTimeout(run, 0)
    return () => {
      cancelled = true
      window.clearTimeout(id)
    }
  }, [])

  return (
    <div className="max-w-5xl text-left">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div className="relative h-24 w-24 shrink-0 self-start aspect-square overflow-hidden bg-white sm:h-56 sm:w-auto lg:h-64">
          <img
            ref={pfpRef}
            src="/pfp.jpg"
            alt="Foto de perfil de Jesús Jódar"
            width={128}
            height={128}
            decoding="async"
            className="h-full w-full object-cover grayscale"
          />
          {/* Tinte al mismo tono de los textos coloreados vía variable del tema:
              la fusión `color` tiñe la foto en escala de grises con el tono exacto de --color-neon. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-color"
            style={{ backgroundColor: 'var(--color-neon)' }}
          />
        </div>
        <div className="min-w-0 sm:flex sm:flex-1 sm:flex-col sm:justify-end sm:self-stretch">
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
            Jesús Jódar
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-white sm:text-xl">
            Apasionado de la informática y la tecnología: sistemas Windows y
            Linux, inteligencia artificial, automatización y software moderno.
          </p>
        </div>
      </div>
      <article className="mt-12 space-y-6 text-base leading-relaxed text-white">
        <p>
          Soy Jesús, tengo 24 años y llevo años moviéndome entre sistemas
          Windows y Linux: configuro equipos, resuelvo incidencias y aprendo
          de forma autodidacta. Me adapto rápido a nuevas herramientas y
          disfruto metiéndome en entornos técnicos hasta entenderlos a fondo.
        </p>
        <p>
          También toco hardware —montaje y mantenimiento básico—, diseño 3D,
          y últimamente oriento casi todo lo que hago hacia la inteligencia
          artificial y la automatización.
        </p>
      </article>
      <section className="mt-16">
        <h2 className="font-display text-3xl">Experiencia</h2>
        <p className="mt-4 text-base leading-relaxed text-white">
          A principios de 2026 hice prácticas en Grupo Security, en Lorca:
          inspección y reparación de sistemas electrónicos de seguridad, apoyo
          en mantenimiento y verificación de instalaciones, y revisión de
          alarmas, CCTV y control de accesos en entorno real.
        </p>
        <p className="mt-4 text-base leading-relaxed text-white">
          Fuera de eso, mi experiencia es la de campo: años configurando
          sistemas, instalando software, diagnosticando fallos de hardware y
          software, y automatizando lo automatizable.
        </p>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-3xl">Formación</h2>
        <p className="mt-4 text-base leading-relaxed text-white">
          Estudié Creative Media —Pearson BTEC International Level 3, con
          Distinction— en la Escuela Superior Internacional de Diseño de
          Murcia, y me gradué en ESO. Todo lo demás —sistemas, herramientas,
          IA— lo he aprendido por mi cuenta, a base de romper cosas y
          arreglarlas.
        </p>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-3xl">Habilidades</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-white px-4 py-1.5 text-sm text-white"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-3xl">Contacto</h2>
        <p className="mt-4 text-base leading-relaxed text-white">
          ¿Hablamos? Estoy abierto a oportunidades donde pueda seguir
          creciendo con sistemas, IA y automatización.
        </p>
        <ul className="mt-4 space-y-2 text-base">
          <li>
            <a
              href="mailto:jesusjodarpiernas@gmail.com"
              className="break-all text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
            >
              jesusjodarpiernas@gmail.com
            </a>
          </li>
          <li>
            <a href="tel:+34623175760" className="text-white">
              623 175 760
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com/in/jesujopi/"
              target="_blank"
              rel="noreferrer"
              className="text-white"
            >
              linkedin.com/in/jesujopi
            </a>
          </li>
          <li className="text-white">Murcia, España</li>
        </ul>
      </section>
    </div>
  )
}
