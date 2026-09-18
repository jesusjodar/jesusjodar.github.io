// Etiqueta sobre el marco: texto plano en manuscrita gruesa
// (Permanent Marker) con el fade de la intro. Solo decorativa.
// Al estar desplegado indica "CHAT" con flecha arriba;
// al estar plegado cambia a "CV" con flecha abajo.
export default function TopHint({ hintRef, collapsed = false }) {
  return (
    <div
      ref={hintRef}
      aria-hidden="true"
      className="absolute top-0 left-0 z-20 hidden items-center justify-start bg-transparent select-none sm:flex intro-footer-text pointer-events-none"
    >
      {/* Estado expandido (portfolio abierto): CHAT + flecha arriba */}
      <div
        className={`flex items-center justify-start transition-opacity duration-300 ${
          collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <span className="font-hand truncate text-xl leading-none tracking-wide text-[#fff]">
          <span className="inline-block rotate-[-6deg]">C</span>
          <span className="inline-block rotate-[4deg] translate-y-[-1px]">H</span>
          <span className="inline-block rotate-[-3deg] translate-y-[1px]">A</span>
          <span className="inline-block rotate-[5deg]">T</span>
        </span>
        {/* Flecha garabateada hacia arriba */}
        <svg
          aria-hidden="true"
          className="block h-[1.4em] w-auto shrink-0 overflow-visible text-xl"
          viewBox="0 0 48 32"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 2 20 C 10 22 16 22 20 18 C 24 14 20 8 15 10 C 10 12 12 19 18 19 C 28 20 38 15 38 3" />
          <path d="M 31 11 L 38 3 L 45 11" />
        </svg>
      </div>

      {/* Estado plegado (chat abierto): CV, BLOG + flecha abajo */}
      <div
        className={`absolute left-0 top-0 flex items-center justify-start transition-opacity duration-300 ${
          collapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="font-hand truncate text-xl leading-none tracking-wide text-[#fff]">
          <span className="inline-block rotate-[-6deg]">C</span>
          <span className="inline-block rotate-[5deg] translate-y-[-1px]">V</span>
          <span className="inline-block rotate-[4deg] translate-y-[2px]">,</span>{' '}
          <span className="inline-block rotate-[-4deg] translate-y-[1px]">B</span>
          <span className="inline-block rotate-[6deg]">L</span>
          <span className="inline-block rotate-[-5deg] translate-y-[-1px]">O</span>
          <span className="inline-block rotate-[3deg]">G</span>
        </span>
        {/* Flecha garabateada hacia abajo: un poco más a la derecha y arriba */}
        <svg
          aria-hidden="true"
          className="block h-[1.4em] w-auto shrink-0 overflow-visible text-xl ml-2 -translate-y-1"
          viewBox="0 0 48 32"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 2 12 C 10 10 16 10 20 14 C 24 18 20 24 15 22 C 10 20 12 13 18 13 C 28 12 38 17 38 29" />
          <path d="M 31 21 L 38 29 L 45 21" />
        </svg>
      </div>
    </div>
  )
}
