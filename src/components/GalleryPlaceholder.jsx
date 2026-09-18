// Medios de la carpeta `galeria/` (raíz del proyecto): se importan como
// URLs con import.meta.glob para que Vite los copie al bundle con hash,
// sin mover nada a `public/`. Orden numérico natural (00, 01, … 30).
// Misma altura para todas, respetando el aspect ratio de cada una
// (sin recortes). Sin interacción ni animaciones.
// Vive en una capa fija a sangre completa (ver App): puede desbordar
// horizontalmente más allá de la carpeta; el único límite es el viewport.
// La tira posee su propio scroll horizontal, traduce la rueda vertical
// a desplazamiento horizontal y se funde en los bordes con una máscara
// aplicada a ella misma (sin overlays). Los espaciadores laterales se
// miden en vivo para que la primera y la última puedan centrarse aunque
// tengan anchos distintos.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const MEDIA = Object.entries(
  import.meta.glob('../../galeria/*.{webp,mp4}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)
  .map(([path, url]) => {
    const file = path.split('/').pop()
    return {
      file,
      url,
      num: parseInt(file.match(/\d+/)[0], 10),
      video: file.endsWith('.mp4'),
    }
  })
  .sort((a, b) => a.num - b.num)

function MediaBox({ item, index, boxRef }) {
  return (
    <div
      ref={boxRef}
      aria-label={`${item.video ? 'Video' : 'Imagen'} ${index + 1}`}
      className="flex h-60 w-auto shrink-0 items-center justify-center overflow-hidden border-2 border-white/30 bg-white/5 sm:h-80"
    >
      {item.video ? (
        <video
          src={item.url}
          aria-hidden="true"
          tabIndex={-1}
          className="block h-full w-auto"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
        />
      ) : (
        <img
          src={item.url}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="block h-full w-auto"
        />
      )}
    </div>
  )
}

export default function GalleryPlaceholder() {
  const stripRef = useRef(null)
  const firstRef = useRef(null)
  const lastRef = useRef(null)
  const [edge, setEdge] = useState([0, 0])

  // Ancho real de la primera/última (los medios cargan asíncronos):
  // espaciador = (viewport - ancho) / 2 para poder centrarlas.
  useLayoutEffect(() => {
    const measure = () => {
      const vw = window.innerWidth
      const fw = firstRef.current?.offsetWidth ?? 0
      const lw = lastRef.current?.offsetWidth ?? 0
      setEdge([
        Math.max(0, (vw - fw) / 2),
        Math.max(0, (vw - lw) / 2),
      ])
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (firstRef.current) ro.observe(firstRef.current)
    if (lastRef.current) ro.observe(lastRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // La rueda vertical no desplaza un scroll horizontal por defecto:
  // se traduce a scrollLeft directamente, sin animación.
  useEffect(() => {
    const el = stripRef.current
    if (!el) return
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      if (el.scrollWidth <= el.clientWidth) return
      e.preventDefault()
      el.scrollLeft += e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <div
      ref={stripRef}
      role="region"
      aria-label="Galería de imágenes"
      className="no-scrollbar pointer-events-auto overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      <div className="gallery-scope mx-auto flex w-max max-w-none items-start gap-3 pb-4 sm:gap-5">
        <div aria-hidden="true" className="shrink-0" style={{ width: edge[0] }} />
        {MEDIA.map((item, index) => (
          <MediaBox
            key={item.file}
            item={item}
            index={index}
            boxRef={
              index === 0
                ? firstRef
                : index === MEDIA.length - 1
                  ? lastRef
                  : undefined
            }
          />
        ))}
        <div aria-hidden="true" className="shrink-0" style={{ width: edge[1] }} />
      </div>
    </div>
  )
}
