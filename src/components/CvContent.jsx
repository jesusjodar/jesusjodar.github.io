import { memo } from 'react'
import { SKILLS } from '../lib/portfolio.js'

// Contenido del CV (presentacional). La foto llega ya ditherizada: el
// efecto se aplicó offline desde la foto original con
// scripts/prerender-pfp.py (misma tubería que antes corría aquí en
// canvas), así que no hay procesado en runtime.
function CvContent() {
  return (
    <div className="max-w-5xl text-left">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div className="relative h-24 w-24 shrink-0 self-start aspect-square overflow-hidden bg-white sm:h-56 sm:w-auto lg:h-64">
          <img
            src="/pfp-dither.png"
            alt="Foto de perfil de Jesús Jódar"
            width={220}
            height={220}
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover grayscale"
            style={{ imageRendering: 'pixelated' }}
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
          <div className="flex flex-wrap items-end gap-x-4">
            <h1 className="font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
              Jesús Jódar
            </h1>
            <div
              aria-hidden="true"
              className="font-barcode text-4xl sm:text-5xl leading-none select-none -mb-3.5"
              style={{ color: 'var(--color-neon)' }}
            >
              *JJ26*
            </div>
          </div>
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

// memo: App re-renderiza al cambiar chatOpen/introDone/umbrales; el CV es
// estático y no necesita reconciliarse en esos cambios de estado.
export default memo(CvContent)
