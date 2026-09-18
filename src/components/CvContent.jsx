import { lazy, memo, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  faLinkedinIn,
  faWhatsapp,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { getProjectMeta } from '../lib/galleryData.js'
import { SKILLS } from '../lib/portfolio.js'

// El blog (con marked + DOMPurify) carga en diferido para no engordar el
// bundle inicial; se precarga en tiempo libre más abajo. La galería vive
// en App (capa fija a sangre completa) y se precarga allí.
const BlogPlaceholder = lazy(() => import('./BlogPlaceholder.jsx'))

// Código de barras Code 39 "*26*" dibujado a mano como SVG (solo layout
// de escritorio): 9 elementos por carácter (1 = fino, 3 = grueso) con
// proporción 1:3, a la altura de las mayúsculas y alineado a la base.
const CODE39_PATTERNS = {
  '*': '131131311',
  2: '113311113',
  6: '113331111',
}
const CODE39_TEXT = '*26*'
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
      className="barcode26 block h-[1em] w-auto text-5xl select-none md:text-6xl"
      style={{ color: 'var(--color-neon)' }}
      fill="currentColor"
    >
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x} y={0} width={bar.w} height={100} />
      ))}
    </svg>
  )
}

// Botón cuadrado blanco con el icono troquelado (se ve el fondo a través).
// Las marcas salen de Font Awesome (viewBox propio) y se encajan centradas
// en la cuadrícula de 24; el sobre es geometría dibujada a mano con la
// solapa en blanco para que se lea como carta.
const ICON_H = 13

function brandIcon(iconDef) {
  const [w, h, , , d] = iconDef.icon
  const s = ICON_H / h
  return { vw: w, vh: h, d, x: (24 - w * s) / 2, y: (24 - ICON_H) / 2, w: w * s, h: ICON_H }
}

const ENVELOPE_BODY = 'M4 6H20V18H4Z'
const ENVELOPE_FLAP = 'M4 7.2L12 13L20 7.2'

function CutoutIcon({ maskId, label, href, icon, envelope }) {
  return (
    <a
      href={href}
      {...(href.startsWith('http')
        ? { target: '_blank', rel: 'noreferrer' }
        : {})}
      aria-label={label}
      className="block cursor-pointer transition-transform duration-150 outline-none hover:scale-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95"
    >
      <svg viewBox="0 0 24 24" className="block h-10 w-10" aria-hidden="true">
        <defs>
          <mask id={maskId}>
            <rect width="24" height="24" fill="#fff" />
            {envelope ? (
              <>
                <path d={ENVELOPE_BODY} fill="#000" />
                <path
                  d={ENVELOPE_FLAP}
                  fill="none"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinejoin="miter"
                />
              </>
            ) : (
              <svg
                x={icon.x}
                y={icon.y}
                width={icon.w}
                height={icon.h}
                viewBox={`0 0 ${icon.vw} ${icon.vh}`}
              >
                <path d={icon.d} fill="#000" />
              </svg>
            )}
          </mask>
        </defs>
        <rect width="24" height="24" fill="#fff" mask={`url(#${maskId})`} />
      </svg>
    </a>
  )
}

const SOCIALS = [
  {
    maskId: 'cutout-li',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/jesujopi/',
    icon: brandIcon(faLinkedinIn),
  },
  {
    maskId: 'cutout-x',
    label: 'X',
    href: 'https://x.com/jesujopi3D',
    icon: brandIcon(faXTwitter),
  },
  {
    maskId: 'cutout-mail',
    label: 'Correo electrónico',
    href: 'mailto:jesusjodarpiernas@gmail.com',
    envelope: true,
  },
  {
    maskId: 'cutout-wa',
    label: 'WhatsApp',
    href: 'https://wa.me/34623175760',
    icon: brandIcon(faWhatsapp),
  },
]

// Pestaña con texto troquelado: rectángulo relleno cuya máscara recorta
// las letras, dejando ver el fondo a través del texto. La pestaña activa
// va en neón con el texto en negro sólido; las demás en blanco troquelado.
function CutoutTab({ maskId, label, width, textLength, active, onClick }) {
  const textProps = {
    x: '50%',
    y: '50%',
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontFamily: "'Bebas Neue', 'Space Grotesk Variable', sans-serif",
    fontSize: 36,
    letterSpacing: 6,
    textLength,
    lengthAdjust: 'spacing',
    fill: '#000',
    stroke: '#000',
    strokeWidth: 2,
    paintOrder: 'stroke',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={
        label === 'CV'
          ? 'Ver currículum'
          : label === 'BLOG'
            ? 'Ver blog'
            : 'Ver img'
      }
      className="cursor-pointer transition-transform duration-150 hover:scale-[1.04] active:scale-95"
    >
      <svg
        viewBox={`0 0 ${width} 56`}
        className="block h-10 w-auto"
        aria-hidden="true"
      >
        {active ? (
          <>
            <rect
              x={0}
              y={0}
              width={width}
              height={56}
              fill="var(--color-neon)"
            />
            <text {...textProps}>{label}</text>
          </>
        ) : (
          <>
            <defs>
              <mask id={maskId}>
                <rect x={0} y={0} width={width} height={56} fill="#fff" />
                <text {...textProps}>{label}</text>
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
          </>
        )}
      </svg>
    </button>
  )
}

// Contenido del CV (presentacional). La foto llega ya acabada: dithering,
// tinte neón y derretido pixelado del borde inferior se aplicaron offline
// desde la foto original con scripts/prerender-pfp.py, así que en runtime
// es un simple <img> sin procesado ni capas de fusión.
function CvContent({ tab, onTabChange, activeGalleryId = 1 }) {
  const switchTab = (next) => {
    if (next === tab) return
    onTabChange(next)
    document.getElementById('portfolio-scroll')?.scrollTo({ top: 0 })
  }

  // Precarga del chunk del blog en tiempo libre: invisible al usuario,
  // listo para el primer clic en BLOG.
  useEffect(() => {
    const prefetch = () => import('./BlogPlaceholder.jsx')
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 3000 })
      return () => window.cancelIdleCallback?.(id)
    }
    const id = window.setTimeout(prefetch, 1500)
    return () => window.clearTimeout(id)
  }, [])

  const galleryMeta = getProjectMeta(activeGalleryId)

  return (
    <div className="mx-auto max-w-5xl text-left">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        {/* textLength = avance medido + interletraje interno, sin el
            espaciado final que descentraría el anclaje medio. */}
        <div className="flex flex-wrap items-start gap-3 self-start">
          <CutoutTab
            maskId="cutout-cv"
            label="CV"
            width={110}
            textLength={34}
            active={tab === 'cv'}
            onClick={() => switchTab('cv')}
          />
          <CutoutTab
            maskId="cutout-blog"
            label="BLOG"
            width={110}
            textLength={72}
            active={tab === 'blog'}
            onClick={() => switchTab('blog')}
          />
          <CutoutTab
            maskId="cutout-img"
            label="IMG"
            width={110}
            textLength={54}
            active={tab === 'img'}
            onClick={() => switchTab('img')}
          />
        </div>

        {/* En la pestaña IMG: título y descripción alineados a la derecha en línea con los botones */}
        {tab === 'img' && galleryMeta && (
          <div className="flex min-h-10 max-w-xs flex-col items-end justify-start self-start text-right select-none sm:max-w-sm md:max-w-md">
            <h3 className="font-['Anton',sans-serif] text-base leading-tight uppercase tracking-wider text-white transition-opacity duration-200 sm:text-lg">
              {galleryMeta.title}
            </h3>
            {galleryMeta.description && (
              <p className="mt-0.5 max-w-xs text-[11px] font-semibold leading-snug text-white transition-opacity duration-200 sm:max-w-sm sm:text-xs md:max-w-md">
                {galleryMeta.description}
              </p>
            )}
          </div>
        )}
      </div>
      {tab === 'cv' ? (
        <CvMain />
      ) : tab === 'blog' ? (
        <Suspense fallback={null}>
          <BlogPlaceholder />
        </Suspense>
      ) : null}
    </div>
  )
}

// Cuerpo del currículum (foto, titular y secciones).
// El subtítulo vive junto al nombre salvo que nombre + subtítulo superen
// el alto de la foto: entonces la fila queda en bloque foto + nombre y el
// subtítulo baja a todo el ancho debajo. Se decide midiendo de verdad
// (ResizeObserver): la copia oculta mide el subtítulo SIEMPRE al ancho de
// la columna (aunque esté abajo), así la decisión no depende del estado
// actual y no puede oscilar.
const SUBTITLE = (
  <>
    Tecnología · Inteligencia Artificial · Sistemas · Desarrollo · Diseño 3D
  </>
)

function CvMain() {
  const photoRef = useRef(null)
  const rowRef = useRef(null)
  const measureRef = useRef(null)
  const [subBelow, setSubBelow] = useState(false)
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia?.('(min-width: 640px)').matches ?? false,
  )

  useLayoutEffect(() => {
    const mq = window.matchMedia?.('(min-width: 640px)')
    const onChange = () => setIsDesktop(!!mq?.matches)
    onChange()
    const decide = () => {
      const photo = photoRef.current
      const row = rowRef.current
      const measure = measureRef.current
      if (!photo || !row || !measure) return
      // mt-3 del subtítulo = 12px.
      const overflow =
        row.offsetHeight + 12 + measure.offsetHeight > photo.offsetHeight
      setSubBelow((prev) => (prev === overflow ? prev : overflow))
    }
    decide()
    const ro = new ResizeObserver(decide)
    if (photoRef.current) ro.observe(photoRef.current)
    if (rowRef.current) ro.observe(rowRef.current)
    if (measureRef.current) ro.observe(measureRef.current)
    mq?.addEventListener?.('change', onChange)
    return () => {
      ro.disconnect()
      mq?.removeEventListener?.('change', onChange)
    }
  }, [])

  return (
    <div className="cv-scope">
      <div className="flex flex-row flex-wrap items-start gap-5 sm:gap-6">
        <div
          ref={photoRef}
          className="relative h-24 w-24 shrink-0 self-start aspect-square sm:h-56 sm:w-auto lg:h-64"
        >
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
        <div className="nameblock relative min-w-0 flex-1 sm:flex sm:flex-col sm:justify-end sm:self-stretch">
          {isDesktop ? (
            <div ref={rowRef} className="flex flex-wrap items-baseline gap-x-2">
              <h1 className="font-display text-5xl tracking-tight md:text-6xl">
                Jesús Jódar
              </h1>
              <Barcode26 />
            </div>
          ) : (
            <h1
              ref={rowRef}
              className="font-display text-6xl leading-[1.15] tracking-tight"
            >
              <span className="block">Jesús</span>
              <span className="block">Jódar</span>
            </h1>
          )}
          <div className="mt-4 flex gap-2.5">
            {SOCIALS.map((s) => (
              <CutoutIcon key={s.maskId} {...s} />
            ))}
          </div>
          {!subBelow && (
            <p className="mt-3 text-lg leading-relaxed text-white sm:text-xl">
              {SUBTITLE}
            </p>
          )}
          {/* Medidor invisible al ancho de la columna (sin pintar ni
              ocupar sitio): permite decidir sin depender del estado. */}
          <p
            ref={measureRef}
            aria-hidden="true"
            className="pointer-events-none invisible absolute inset-x-0 top-0 text-lg leading-relaxed text-white sm:text-xl"
          >
            {SUBTITLE}
          </p>
        </div>
        {subBelow && (
          <p className="w-full text-lg leading-relaxed text-white sm:text-xl">
            {SUBTITLE}
          </p>
        )}
      </div>
      <article className="mt-12 space-y-6 text-base leading-relaxed text-white">
        <p>
          Soy Jesús, un perfil técnico-creativo apasionado por la informática,
          la inteligencia artificial y el diseño digital.
        </p>
        <p>
          Llevo años aprendiendo y desarrollando proyectos por mi cuenta,
          moviéndome entre sistemas Windows, Linux y macOS, hardware,
          programación, diseño 3D e inteligencia artificial. Me interesa
          entender cómo funcionan las cosas y llevar las tecnologías que me
          llaman la atención un paso más allá con proyectos propios.
        </p>
        <p>
          Actualmente oriento mi trabajo hacia la{' '}
          <strong>
            inteligencia artificial, los sistemas de agentes, la
            automatización y el desarrollo de herramientas
          </strong>
          , sin dejar de lado el diseño 3D y la parte visual.
        </p>
      </article>
      <section className="mt-16">
        <h2 className="font-display text-3xl">Sobre mí</h2>
        <p className="mt-4 text-base leading-relaxed text-white">
          Mi recorrido combina tecnología y diseño. Por un lado, configuración
          de equipos, sistemas, hardware y software, redes y programación,
          aprendidos de forma autodidacta investigando documentación,
          experimentando y construyendo proyectos. Por otro, formación creativa
          en medios digitales y años con <strong>Blender y el diseño 3D</strong>
          . Me interesan los puntos donde se cruzan: videojuegos, interfaces,
          herramientas digitales, IA y experiencias interactivas.
        </p>
        <p className="mt-4 text-base leading-relaxed text-white">
          No me limito a una tecnología concreta: cuando algo me interesa,
          aprendo cómo funciona, lo pruebo y busco integrarlo en algún proyecto.
        </p>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-3xl">Experiencia</h2>
        <h3 className="font-display mt-8 text-2xl">Grupo Security</h3>
        <p className="mt-2 text-base text-white/60">
          Prácticas profesionales · Lorca · 2026
        </p>
        <p className="mt-4 text-base leading-relaxed text-white">
          Prácticas en sistemas electrónicos de seguridad, con contacto directo
          con instalaciones reales: inspección y reparación de sistemas,
          mantenimiento y verificación, alarmas, CCTV, control de accesos,
          diagnóstico de incidencias y trabajo técnico en entorno profesional.
        </p>
        <h3 className="font-display mt-8 text-2xl">
          Diseño 3D y proyectos freelance
        </h3>
        <p className="mt-4 text-base leading-relaxed text-white">
          Años de trabajos y proyectos personales en <strong>Blender</strong>:
          modelado, composición, materiales, iluminación, renderizado y recursos
          visuales. Trabajo autónomo de principio a fin: idea, investigación,
          desarrollo y entrega. Mi portfolio 3D está en{' '}
          <strong>@jesujopi</strong>.
        </p>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-3xl">Formación</h2>
        <h3 className="font-display mt-8 text-2xl">Creative Media</h3>
        <p className="mt-2 text-base text-white/60">
          Pearson BTEC International Level 3 · Distinction · Escuela Superior
          Internacional de Diseño de Murcia
        </p>
        <p className="mt-4 text-base leading-relaxed text-white">
          Medios creativos y producción digital: diseño digital, multimedia,
          contenido, conceptualización y presentación de proyectos.
        </p>
        <h3 className="font-display mt-8 text-2xl">IFCT0108</h3>
        <p className="mt-2 text-base text-white/60">
          Operaciones auxiliares de montaje y mantenimiento de sistemas
          microinformáticos · Octubre 2025 – Enero 2026
        </p>
        <p className="mt-4 text-base leading-relaxed text-white">
          Montaje y mantenimiento de equipos, hardware, instalación de software,
          sistemas operativos e incidencias, con prácticas profesionales no
          laborales.
        </p>
        <h3 className="font-display mt-8 text-2xl">
          Desarrollo de videojuegos
        </h3>
        <p className="mt-4 text-base leading-relaxed text-white">
          Estudios universitarios hasta segundo curso: contacto con el desarrollo
          de videojuegos y proyectos interactivos, programación y la mezcla
          entre diseño y tecnología.
        </p>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-3xl">Inteligencia artificial</h2>
        <p className="mt-4 text-base leading-relaxed text-white">
          No solo uso modelos: investigo cómo integrarlos en sistemas
          completos. LLMs locales, Ollama, cuantización, inferencia en GPU,
          RAG, memoria persistente, agentes, tool calling, voz, multimodalidad
          y arquitecturas híbridas local/cloud, con hardware de consumo.
        </p>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-3xl">Desarrollo de software</h2>
        <p className="mt-4 text-base leading-relaxed text-white">
          <strong>Frontend:</strong> HTML · CSS · JavaScript · TypeScript ·
          React · Vite · Tailwind CSS
        </p>
        <p className="mt-4 text-base leading-relaxed text-white">
          <strong>Herramientas:</strong> Git · GitHub · GitHub Actions ·
          Terminal · CLI · VS Code
        </p>
        <p className="mt-4 text-base leading-relaxed text-white">
          <strong>Backend / IA:</strong> APIs · Ollama · LLMs · RAG · bases de
          datos · sistemas de agentes
        </p>
        <p className="mt-4 text-base leading-relaxed text-white">
          Interfaces con identidad visual y experiencia cuidada, no solo
          funcionales.
        </p>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-3xl">Sistemas e informática</h2>
        <p className="mt-4 text-base leading-relaxed text-white">
          <strong>Windows:</strong> configuración, mantenimiento, software,
          diagnóstico y administración. <strong>Linux:</strong> terminal, CLI,
          entornos, servidores y distros. <strong>macOS:</strong> ecosistema y
          desarrollo. <strong>Hardware:</strong> montaje, mantenimiento, GPUs,
          BIOS/UEFI e incidencias. <strong>Redes:</strong> configuración
          básica, conectividad, SSH y herramientas.
        </p>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-3xl">Diseño 3D</h2>
        <p className="mt-4 text-base leading-relaxed text-white">
          <strong>Blender:</strong> modelado, hard-surface, escenas,
          materiales, iluminación, composición, renderizado y assets para
          proyectos digitales, con el punto de mira en videojuegos.
        </p>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-3xl">Videojuegos</h2>
        <p className="mt-4 text-base leading-relaxed text-white">
          3D + programación + tecnología + IA. Interés en Unity y Unreal
          Engine, y a largo plazo en 3D Art, Environment Art, Technical Art,
          procedural, IA aplicada e inmersivas.
        </p>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-3xl">GitHub</h2>
        <p className="mt-4 text-base leading-relaxed text-white">
          Proyectos y experimentos de programación, interfaces, automatización
          e IA:{' '}
          <a
            href="https://github.com/jesusjodar"
            target="_blank"
            rel="noreferrer"
            className="break-all text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
          >
            github.com/jesusjodar
          </a>
        </p>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-3xl">Stack tecnológico</h2>
        <p className="mt-4 text-base leading-relaxed text-white">
          <strong>Sistemas:</strong> Windows · Linux · macOS
        </p>
        <p className="mt-4 text-base leading-relaxed text-white">
          <strong>Desarrollo:</strong> JavaScript · TypeScript · React · Vite ·
          HTML · CSS · Tailwind CSS
        </p>
        <p className="mt-4 text-base leading-relaxed text-white">
          <strong>Herramientas:</strong> Git · GitHub · GitHub Actions · VS
          Code · Terminal · SSH
        </p>
        <p className="mt-4 text-base leading-relaxed text-white">
          <strong>IA:</strong> LLMs · Ollama · RAG · Agents · TTS · STT · VAD ·
          modelos locales · GPU inference
        </p>
        <p className="mt-4 text-base leading-relaxed text-white">
          <strong>3D:</strong> Blender · Modelado · Hard Surface · Materials ·
          Lighting · Rendering
        </p>
        <p className="mt-4 text-base leading-relaxed text-white">
          <strong>Hardware:</strong> PC Building · mantenimiento · diagnóstico
          · GPUs · BIOS/UEFI
        </p>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-3xl">Cómo trabajo</h2>
        <p className="mt-4 text-base leading-relaxed text-white">
          Aprendo haciendo: investigo cómo funciona cada tecnología y construyo
          algo con ella. Autónomo, transversal —de Blender a Linux, de un
          modelo de IA a una interfaz— y cómodo sin conocer la herramienta de
          antemano. Creatividad + tecnología: lo que más me define.
        </p>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-3xl">Intereses profesionales</h2>
        <p className="mt-4 text-base leading-relaxed text-white">
          <strong>IA:</strong> agentes, IA local, automatización y asistentes.
          <strong> Sistemas:</strong> soporte, hardware, redes y administración.
          <strong> Desarrollo:</strong> apps, herramientas e interfaces.
          <strong> 3D:</strong> modelado, assets y videojuegos.
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
          ¿Hablamos? Estoy abierto a oportunidades dentro de informática,
          sistemas, inteligencia artificial, automatización, desarrollo de
          software y diseño 3D, en un entorno donde aportar y seguir creciendo.
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
          <li>
            <a
              href="https://github.com/jesusjodar"
              target="_blank"
              rel="noreferrer"
              className="text-white"
            >
              github.com/jesusjodar
            </a>
          </li>
          <li className="text-white">Portfolio 3D · @jesujopi</li>
          <li className="text-white">Murcia, España</li>
        </ul>
      </section>
    </div>
  )
}

// memo: App re-renderiza al cambiar chatOpen/introDone/umbrales; el CV es
// estático y no necesita reconciliarse en esos cambios de estado.
export default memo(CvContent)
