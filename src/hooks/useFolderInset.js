import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  CHAT_OPEN_PX,
  FRAME_STROKE,
  SM_MIN,
  TAB_H_DESKTOP,
  TAB_H_MOBILE,
  chevronD,
  chevronUpD,
  getMaxInset,
} from '../lib/portfolio.js'

// Geometría + animación del marco-carpeta (outline SVG, chevron, máscara
// del efecto pixel y desplazamiento del contenido). Escritura imperativa
// en refs para no re-renderizar a 60fps; el estado solo refleja umbrales
// (chat abierto / colapsado / animando / press del chevron).
export function useFolderInset({ introDone, scrollContainerRef }) {
  const frameRef = useRef(null)
  const frameLeftRef = useRef(null)
  const frameRightRef = useRef(null)
  const frameChevRef = useRef(null)
  const chevBtnRef = useRef(null)
  const topHintRef = useRef(null)
  const chatPanelRef = useRef(null)
  const contentWrapRef = useRef(null)
  const maskImgRef = useRef(null)
  const blurRef = useRef(null)
  const pixelFadeRef = useRef(null)
  const chevTimeoutRef = useRef(0)
  const insetRafRef = useRef(0)
  // Fuente de verdad del inset: ref (sin re-render a 60fps).
  // El estado solo refleja umbrales (chat abierto / colapsado).
  const topInsetRef = useRef(0)
  const maxInsetRef = useRef(0)
  // Aplanado del chevron sin cambiar grosor (morph del path, como el original).
  // Se guarda en ref para usarlo dentro de applyFrame sin re-renders.
  const pressRef = useRef({ anim: false, zoom: false })

  const [chatOpen, setChatOpen] = useState(false)
  const [atMinHeight, setAtMinHeight] = useState(false)
  const [insetAnimating, setInsetAnimating] = useState(false)
  const [chevZoom, setChevZoom] = useState(false)
  const chatOpenRef = useRef(false)
  const atMinRef = useRef(false)

  const triggerChevPress = useCallback(() => {
    setChevZoom(true)
    pressRef.current.zoom = true
    window.clearTimeout(chevTimeoutRef.current)
    chevTimeoutRef.current = window.setTimeout(() => {
      setChevZoom(false)
      pressRef.current.zoom = false
    }, 220)
  }, [])

  useEffect(
    () => () => {
      cancelAnimationFrame(insetRafRef.current)
      window.clearTimeout(chevTimeoutRef.current)
    },
    [],
  )

  // ---- Escritura imperativa del marco (sin setState por frame) ----
  const applyFrame = useCallback((topInset) => {
    const el = frameRef.current
    if (!el) return
    const w = el.clientWidth
    const h = el.clientHeight
    if (w <= 0 || h <= 0) return
    const s = FRAME_STROKE
    const t = s + topInset
    const r = Math.max(0, Math.min(28, w / 2 - s, h / 2 - s))
    const isWide = window.innerWidth >= SM_MIN
    const tabH = isWide ? TAB_H_DESKTOP : TAB_H_MOBILE
    const tTab = s + tabH + topInset
    const R = isWide ? 12 : 10
    const minTabW = isWide ? 90 : 60
    const maxTabW = Math.max(minTabW, w - s - r - R - 40)
    const tabW = Math.min(
      140,
      Math.min(maxTabW, Math.max(minTabW, Math.round(w * (isWide ? 0.125 : 0.19)))),
    )
    const f = (n) => n.toFixed(1)
    const maxInsetNow = getMaxInset(h)
    maxInsetRef.current = maxInsetNow
    const chevW = isWide ? 28 : 22
    const chevH = isWide ? 10 : 8
    const chevCx = (s + tabW) / 2
    const chevCy = t + tabH / 2 + (isWide ? 10 : 9)
    const collapsed = topInset >= maxInsetNow - 1
    // Aplanado original: línea horizontal (h=0, w*0.78) con el mismo
    // strokeWidth=4 → se aplana sin afinar el grosor (sin scaleY).
    const press = pressRef.current
    const flat = press.anim || press.zoom
    let chevD
    if (flat) {
      const fw = chevW * 0.78
      chevD =
        `M ${f(chevCx - fw / 2)} ${f(chevCy)} ` +
        `L ${f(chevCx)} ${f(chevCy)} ` +
        `L ${f(chevCx + fw / 2)} ${f(chevCy)}`
    } else {
      chevD = collapsed
        ? chevronUpD(chevCx, chevCy, chevW, chevH)
        : chevronD(chevCx, chevCy, chevW, chevH)
    }

    frameLeftRef.current?.setAttribute(
      'd',
      `M ${f(w / 2)} ${f(h - s)} ` +
        `L ${f(s + r)} ${f(h - s)} ` +
        `A ${f(r)} ${f(r)} 0 0 1 ${f(s)} ${f(h - s - r)} ` +
        `L ${f(s)} ${f(t + R)} ` +
        `A ${f(R)} ${f(R)} 0 0 1 ${f(s + R)} ${f(t)} ` +
        `L ${f(tabW - R)} ${f(t)}`,
    )
    frameRightRef.current?.setAttribute(
      'd',
      `M ${f(w / 2)} ${f(h - s)} ` +
        `L ${f(w - s - r)} ${f(h - s)} ` +
        `A ${f(r)} ${f(r)} 0 0 0 ${f(w - s)} ${f(h - s - r)} ` +
        `L ${f(w - s)} ${f(tTab + r)} ` +
        `A ${f(r)} ${f(r)} 0 0 0 ${f(w - s - r)} ${f(tTab)} ` +
        `L ${f(tabW + R)} ${f(tTab)} ` +
        `A ${f(R)} ${f(R)} 0 0 1 ${f(tabW)} ${f(tTab - R)} ` +
        `L ${f(tabW)} ${f(t + R)} ` +
        `A ${f(R)} ${f(R)} 0 0 0 ${f(tabW - R)} ${f(t)}`,
    )
    // Transición del morph vía propiedad CSS `d` (Chrome) + atributo `d`
    // (Firefox/Safari saltan al estado final). Sin scaleY para no afinar.
    const chevEl = frameChevRef.current
    if (chevEl) {
      chevEl.setAttribute('d', chevD)
      try {
        chevEl.style.d = `path("${chevD}")`
      } catch {
        /* navegadores sin CSS `d`: se quedan con el atributo */
      }
      chevEl.style.transition =
        press.anim
          ? 'none'
          : press.zoom
            ? 'd 140ms ease-out'
            : 'd 500ms cubic-bezier(0.34, 1.56, 0.64, 1)'
    }

    const btn = chevBtnRef.current
    if (btn) {
      btn.style.left = `${chevCx}px`
      btn.style.top = `${chevCy}px`
      btn.style.width = `${Math.max(44, chevW + 24)}px`
      btn.style.height = `${Math.max(44, chevH + 24)}px`
    }
    const hint = topHintRef.current
    if (hint) {
      hint.style.left = `${tabW + 14}px`
      hint.style.top = `${t + 4}px`
    }
    const wrap = contentWrapRef.current
    if (wrap) wrap.style.top = `${topInset}px`
    const panel = chatPanelRef.current
    if (panel) {
      panel.style.bottom = `calc(100dvh - var(--frame-margin) - ${topInset + 2}px)`
    }

    // Progreso de colapso [0..1]
    const progress = maxInsetNow > 0 ? Math.min(1, Math.max(0, topInset / maxInsetNow)) : 0
    // Desenfoque del interior del marco: de 0px (expandido) a 28px (colapsado)
    if (blurRef.current) {
      blurRef.current.setAttribute('stdDeviation', (progress * 28).toFixed(1))
    }
    // Opacidad del efecto pixel exterior: de 0.5 (expandido) a 0.0 (colapsado)
    if (pixelFadeRef.current) {
      pixelFadeRef.current.setAttribute('slope', (0.5 * (1 - progress)).toFixed(2))
    }

    // Máscara del efecto pixel: el mosaico del filtro solo se ve dentro del
    // marco (pestaña, laterales y esquinas inferiores redondeadas); fuera
    // pasa el contenido original nítido. El contenido NO se recorta: puede
    // desbordar con normalidad. La forma vive en userSpace (px relativos a
    // la caja del contenedor) y se inyecta como data-URI en el feImage del
    // filtro. El borde interior es el outline menos medio stroke (s).
    const rect = el.getBoundingClientRect()
    const mX = rect.left
    const mY = rect.top
    const maskEl = maskImgRef.current
    if (wrap && maskEl) {
      const box = wrap.getBoundingClientRect()
      const px = (x) => f(x - box.left)
      const py = (y) => f(y - box.top)
      const bi = 2 * s
      const rib = Math.max(0, r - s)
      const rit = Math.max(0, R - s)
      const Rc = R + s
      const yB = mY + h
      const d =
        `M ${px(mX + bi)} ${py(mY + t + R)} ` +
        `A ${f(rit)} ${f(rit)} 0 0 1 ${px(mX + s + R)} ${py(mY + t + s)} ` +
        `L ${px(mX + tabW - R)} ${py(mY + t + s)} ` +
        `A ${f(rit)} ${f(rit)} 0 0 1 ${px(mX + tabW - s)} ${py(mY + t + R)} ` +
        `L ${px(mX + tabW - s)} ${py(mY + tTab - R)} ` +
        `A ${f(Rc)} ${f(Rc)} 0 0 0 ${px(mX + tabW + R)} ${py(mY + tTab + s)} ` +
        `L ${px(mX + w - s - r)} ${py(mY + tTab + s)} ` +
        `A ${f(rib)} ${f(rib)} 0 0 1 ${px(mX + w - bi)} ${py(mY + tTab + r)} ` +
        `L ${px(mX + w - bi)} ${py(mY + h - s - r)} ` +
        `A ${f(rib)} ${f(rib)} 0 0 1 ${px(mX + w - s - r)} ${py(yB - bi)} ` +
        `L ${px(mX + s + r)} ${py(yB - bi)} ` +
        `A ${f(rib)} ${f(rib)} 0 0 1 ${px(mX + bi)} ${py(mY + h - s - r)} ` +
        `Z`
      const bw = Math.max(1, Math.round(box.width))
      const bh = Math.max(1, Math.round(box.height))
      maskEl.setAttribute('x', '0')
      maskEl.setAttribute('y', '0')
      maskEl.setAttribute('width', `${bw}`)
      maskEl.setAttribute('height', `${bh}`)
      const svg =
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${bw} ${bh}'>` +
        `<path d='${d}' fill='#fff'/></svg>`
      maskEl.setAttribute(
        'href',
        `data:image/svg+xml,${encodeURIComponent(svg)}`,
      )
    }
  }, [])

  const syncUI = useCallback(() => {
    const v = topInsetRef.current
    const max = maxInsetRef.current
    const atMin = max > 0 && v >= max - 1
    const open = introDone && v > CHAT_OPEN_PX
    if (atMin !== atMinRef.current) {
      atMinRef.current = atMin
      setAtMinHeight(atMin)
      if (atMin) scrollContainerRef?.current?.scrollTo({ top: 0 })
    }
    if (open !== chatOpenRef.current) {
      chatOpenRef.current = open
      setChatOpen(open)
    }
  }, [introDone, scrollContainerRef])

  // Pintado inicial síncrono (evita flash de paths vacíos) + resize
  useLayoutEffect(() => {
    applyFrame(topInsetRef.current)
    syncUI()
    const onResize = () => {
      const max = getMaxInset(frameRef.current?.clientHeight ?? window.innerHeight)
      topInsetRef.current = Math.min(Math.max(0, topInsetRef.current), max)
      applyFrame(topInsetRef.current)
      syncUI()
    }
    window.addEventListener('resize', onResize)
    const ro = new ResizeObserver(onResize)
    if (frameRef.current) ro.observe(frameRef.current)
    return () => {
      window.removeEventListener('resize', onResize)
      ro.disconnect()
    }
  }, [applyFrame, syncUI])

  useEffect(() => {
    applyFrame(topInsetRef.current)
    syncUI()
  }, [applyFrame, introDone, syncUI])

  // El press del click (chevZoom) no siempre coincide con frames de
  // animación (p.ej. reduced-motion): reaplica el morph al cambiar.
  useEffect(() => {
    applyFrame(topInsetRef.current)
  }, [chevZoom, applyFrame])

  const animateInsetTo = useCallback(
    (target) => {
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      cancelAnimationFrame(insetRafRef.current)
      const from = topInsetRef.current
      const delta = target - from
      if (reduce || Math.abs(delta) < 0.5) {
        topInsetRef.current = target
        pressRef.current.anim = false
        applyFrame(target)
        setInsetAnimating(false)
        syncUI()
        return
      }
      pressRef.current.anim = true
      setInsetAnimating(true)
      const dur = Math.min(500, 180 + Math.abs(delta) * 0.6)
      const t0 = performance.now()
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur)
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2
        topInsetRef.current = from + delta * e
        applyFrame(topInsetRef.current)
        // Solo sincroniza estado al cruzar umbrales, no cada frame
        const v = topInsetRef.current
        const max = maxInsetRef.current
        const atMin = max > 0 && v >= max - 1
        const open = v > CHAT_OPEN_PX
        if (atMin !== atMinRef.current || open !== chatOpenRef.current) syncUI()
        if (k < 1) insetRafRef.current = requestAnimationFrame(step)
        else {
          pressRef.current.anim = false
          setInsetAnimating(false)
          applyFrame(topInsetRef.current)
          syncUI()
        }
      }
      insetRafRef.current = requestAnimationFrame(step)
    },
    [applyFrame, syncUI],
  )

  const handleChevClick = () => {
    triggerChevPress()
    const max = getMaxInset(frameRef.current?.clientHeight ?? window.innerHeight)
    const collapsed = topInsetRef.current >= max - 1
    animateInsetTo(collapsed ? 0 : max)
  }

  return {
    frameRef,
    frameLeftRef,
    frameRightRef,
    frameChevRef,
    chevBtnRef,
    topHintRef,
    chatPanelRef,
    contentWrapRef,
    maskImgRef,
    blurRef,
    pixelFadeRef,
    atMinRef,
    chatOpen,
    atMinHeight,
    insetAnimating,
    handleChevClick,
  }
}
