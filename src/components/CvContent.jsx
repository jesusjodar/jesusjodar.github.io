import { memo } from 'react'
import { SKILLS } from '../lib/portfolio.js'

// Código de barras Code 39 "*26*" dibujado a mano como SVG (ISO/IEC 16388,
// patrones de BWIPP): cada carácter son 9 elementos barra/espacio alternos
// (1 = fino, 3 = grueso) + 1 de separación entre caracteres, con zona de
// silencio de 10 a cada lado. Sin fuentes: sin métricas fantasma ni
// desplazamientos; la altura (1em) queda entre el cuerpo de las mayúsculas
// (0.86em) y la punta de los acentos (1.11em), y la base de las barras
// coincide con la línea base del nombre.
const CODE39_PATTERNS = {
  '*': '131131311',
  2: '113311113',
  6: '113331111',
}
const CODE39_TEXT = '*26*'
// Módulos estirados en horizontal ×2.5: barras gruesas y código aireado,
// manteniendo la proporción fino:grueso 1:3.
const CODE39_NARROW = 2.5
const CODE39_WIDE = 7.5
const CODE39_GAP = 2.5
const CODE39_QUIET = 25

function Barcode26() {
  let x = CODE39_QUIET
  const bars = []
  for (const ch of CODE39_TEXT) {
    const pattern = CODE39_PATTERNS[ch]
    for (let i = 0; i < pattern.length; i++) {
      const w = pattern[i] === '3' ? CODE39_WIDE : CODE39_NARROW
      if (i % 2 === 0) bars.push({ x, w })
      x += w
    }
    x += CODE39_GAP
  }
  const width = x - CODE39_GAP + CODE39_QUIET
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${width} 100`}
      className="block h-[1em] w-auto text-4xl select-none sm:text-5xl md:text-6xl"
      style={{ color: 'var(--color-neon)' }}
      fill="currentColor"
    >
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x} y={0} width={bar.w} height={100} />
      ))}
    </svg>
  )
}

// Pestaña decorativa con texto troquelado: rectángulo blanco relleno cuya
// máscara recorta las letras, dejando ver el fondo a través del texto.
function CutoutTab({ maskId, label, width, textLength }) {
  return (
    <svg
      viewBox={`0 0 ${width} 56`}
      className="block h-10 w-auto"
      focusable="false"
    >
      <defs>
        <mask id={maskId}>
          <rect x={0} y={0} width={width} height={56} fill="#fff" />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="'Bebas Neue', 'Space Grotesk Variable', sans-serif"
            fontSize={36}
            letterSpacing={6}
            textLength={textLength}
            lengthAdjust="spacing"
            fill="#000"
            stroke="#000"
            strokeWidth={2}
            paintOrder="stroke"
          >
            {label}
          </text>
        </mask>
      </defs>
      <rect
        x={0}
        y={0}
        width={width}
        height={56}
        fill="#fff"
        mask={`url(#${maskId})`}
      />
    </svg>
  )
}

// Contenido del CV (presentacional). La foto llega ya acabada: dithering,
// tinte neón y derretido pixelado del borde inferior se aplicaron offline
// desde la foto original con scripts/prerender-pfp.py, así que en runtime
// es un simple <img> sin procesado ni capas de fusión.
function CvContent() {
  return (
    <div className="max-w-5xl text-left">
      <div aria-hidden="true" className="mb-8 flex flex-wrap gap-3">
        {/* textLength = avance medido + interletraje interno, sin el
            espaciado final que descentraría el anclaje medio. */}
        <CutoutTab maskId="cutout-cv" label="CV" width={110} textLength={34} />
        <CutoutTab maskId="cutout-blog" label="BLOG" width={110} textLength={72} />
      </div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div className="relative h-24 w-24 shrink-0 self-start aspect-square sm:h-56 sm:w-auto lg:h-64">
          <img
            src="/pfp-dither.png"
            alt="Foto de perfil de Jesús Jódar"
            width={220}
            height={220}
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <div className="min-w-0 sm:flex sm:flex-1 sm:flex-col sm:justify-end sm:self-stretch">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <h1 className="font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
              Jesús Jódar
            </h1>
            <Barcode26 />
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
