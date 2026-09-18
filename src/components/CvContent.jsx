import { memo, useMemo } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { SKILLS } from '../lib/portfolio.js'
import POSTS from '../lib/posts.json'

// Misma config de Markdown que el chat (el chunk del chat puede no haberse
// cargado al ver el blog, así que se configura aquí también).
marked.use({
  breaks: true,
  gfm: true,
  renderer: {
    link({ href, title, text }) {
      const titleAttr = title ? ` title="${title}"` : ''
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
    },
  },
})

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
      aria-label={label === 'CV' ? 'Ver currículum' : 'Ver blog'}
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
function CvContent({ tab, onTabChange }) {
  const switchTab = (next) => {
    if (next === tab) return
    onTabChange(next)
    document.getElementById('portfolio-scroll')?.scrollTo({ top: 0 })
  }
  return (
    <div className="max-w-5xl text-left">
      <div className="mb-8 flex flex-wrap gap-3">
        {/* textLength = avance medido + interletraje interno, sin el
            espaciado final que descentraría el anclaje medio. */}
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
      </div>
      {tab === 'cv' ? <CvMain /> : <BlogPlaceholder />}
    </div>
  )
}

// Cuerpo del currículum (foto, titular y secciones).
function CvMain() {
  return (
    <>
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
    </>
  )
}

// Contenido provisional del blog con la misma estética de textos del CV.
// Los posts salen de posts/*.md (scripts/collect-posts.js).
function formatPostDate(iso) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function BlogPost({ post }) {
  const html = useMemo(() => {
    if (!post.body) return ''
    const rawHtml = marked.parse(post.body)
    if (typeof window !== 'undefined' && DOMPurify?.sanitize) {
      return DOMPurify.sanitize(rawHtml, { ADD_ATTR: ['target', 'rel'] })
    }
    return rawHtml
  }, [post.body])

  const edited =
    Date.parse(post.updated) - Date.parse(post.created) > 60000
  return (
    <article>
      <h3 className="font-display text-2xl">{post.title}</h3>
      <p className="mt-2 text-sm text-white/60">
        {formatPostDate(post.created)}
        {edited ? ` · Actualizado el ${formatPostDate(post.updated)}` : ''}
      </p>
      {html ? (
        <div
          className="chat-markdown mt-4 text-base leading-relaxed text-white"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : null}
    </article>
  )
}

function BlogPlaceholder() {
  return (
    <div>
      <h2 className="font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">Blog</h2>
      <p className="mt-4 text-base leading-relaxed text-white">
        Aquí iré publicando ideas, proyectos y cualquier tema que me parezca
        interesante o me ronde por la cabeza: sistemas, inteligencia
        artificial, automatización y todo lo que vaya aprendiendo por el camino.
      </p>
      {POSTS.length > 0 ? (
        <div className="mt-12 space-y-12">
          {POSTS.map((post) => (
            <BlogPost key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-base text-white/60">
          Aún no hay entradas. Estoy escribiendo las primeras.
        </p>
      )}
      <div className="mt-16 flex items-center gap-4">
        <div aria-hidden="true" className="h-1 flex-1 bg-white/30" />
        <p
          className="font-display text-lg tracking-wider"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          Has llegado al final
        </p>
        <div aria-hidden="true" className="h-1 flex-1 bg-white/30" />
      </div>
    </div>
  )
}

// memo: App re-renderiza al cambiar chatOpen/introDone/umbrales; el CV es
// estático y no necesita reconciliarse en esos cambios de estado.
export default memo(CvContent)
