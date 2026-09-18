import TopHint from './TopHint.jsx'

// Outline de la carpeta (paths SVG + chevron).
// Presentacional: recibe refs y estado desde useFolderInset, no pinta nada
// por sí mismo (el hook escribe los `d` imperativamente).
export default function FolderFrame({
  frameRef,
  frameLeftRef,
  frameRightRef,
  frameChevRef,
  chevBtnRef,
  topHintRef,
  atMinHeight,
  chatOpen,
  onChevClick,
}) {
  return (
    <>
      <div
        ref={frameRef}
        className="pointer-events-none fixed left-[var(--side)] right-[var(--side)] top-[var(--frame-margin)] bottom-[calc(var(--footer-h)+var(--frame-footer-gap))] z-50"
      >
        <svg className="block h-full w-full" fill="none" aria-hidden="true">
          <path
            ref={frameLeftRef}
            d=""
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="100"
            className="intro-frame-path"
          />
          <path
            ref={frameRightRef}
            d=""
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="100"
            className="intro-frame-path"
          />
          <path
            ref={frameChevRef}
            d=""
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="intro-chevron"
          />
        </svg>
        <button
          ref={chevBtnRef}
          type="button"
          aria-label={
            atMinHeight
              ? 'Expandir marco (volver al portfolio)'
              : 'Colapsar marco (abrir preguntas)'
          }
          aria-expanded={chatOpen}
          onClick={onChevClick}
          className="pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          style={{ left: 0, top: 0, width: 44, height: 44, touchAction: 'manipulation' }}
        />
        <TopHint hintRef={topHintRef} collapsed={chatOpen} />
      </div>
    </>
  )
}
