import { Fragment, useEffect, useRef, useState } from 'react'
import CustomScrollbar from './CustomScrollbar.jsx'
import { CHAT_SUGGESTIONS } from '../lib/portfolio.js'

// Panel superior de preguntas (demo local sin backend). Autocontenido:
// posee query/history y solo recibe visibilidad + ref de posicionamiento
// (el bottom lo escribe imperativamente useFolderInset para que viaje
// con la carpeta inferior al desplegar/colapsar).
// Layout fijo: cabecera y formulario anclados (nunca se mueven ni se
// recortan); solo la lista de mensajes crece, con scroll interno y
// auto-scroll al último. Así los mensajes nuevos no desplazan nada más.
export default function ChatPanel({ chatOpen, introDone, panelRef }) {
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState([])
  const scrollRef = useRef(null)

  // Al añadir una respuesta, baja al final de la lista.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [history.length])

  const handleChatSubmit = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    // Sin respuesta por ahora (para diseñar las burbujas): solo burbuja de usuario.
    setHistory((h) => [...h.slice(-5), { q, a: null }])
    setQuery('')
  }

  return (
    <div
      ref={panelRef}
      className="fixed inset-x-[calc(var(--frame-margin)+1rem)] top-0 z-40 flex min-h-0 flex-col transition-opacity duration-300"
      style={{ opacity: chatOpen ? 1 : 0, pointerEvents: chatOpen ? 'auto' : 'none' }}
      aria-hidden={chatOpen ? undefined : true}
      inert={!chatOpen || !introDone}
    >
      {/* Bloque único de chat anclado al borde del marco: viaja con la
          carpeta inferior al desplegar/colapsar. La cabecera queda fija
          arriba y el formulario fijo abajo; la lista intermedia (flex-1)
          absorbe todo el crecimiento sin mover al resto. */}
      <div className="flex h-full min-h-0 flex-col pt-[calc(var(--frame-margin)+4rem)]">
        {history.length > 0 ? (
          <div className="mb-4 flex min-h-0 flex-1 gap-3">
            <CustomScrollbar
              scrollContainerRef={scrollRef}
              atMinHeight={false}
              insetAnimating={false}
              id="chat-scroll"
              containerClassName="content-scroll min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain pr-1"
              trackClassName="group scroll-track relative z-40 w-[7px] shrink-0 cursor-pointer touch-none rounded-full bg-white/25 transition-opacity duration-200 select-none"
            >
              <ul aria-live="polite" className="space-y-3">
                {history.map((m, i) => (
                  <Fragment key={`${i}-${m.q}`}>
                    <li className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-white px-4 py-2.5 text-sm font-medium text-[#0e0a38]">
                      {m.q}
                    </li>
                    {m.a ? (
                      <li className="w-fit max-w-[95%] rounded-2xl rounded-bl-md bg-white/10 px-4 py-2.5 text-sm text-white">
                        {m.a}
                      </li>
                    ) : null}
                  </Fragment>
                ))}
              </ul>
            </CustomScrollbar>
          </div>
        ) : null}
        <div className="mt-auto shrink-0">
          {/* Al enviar el primer mensaje, título + chips se desvanecen
              y colapsan (max-height, determinista en todos los motores)
              dejando sitio a la conversación. */}
          <div
            aria-hidden={history.length > 0}
            className={`transition-all duration-500 ${history.length > 0 ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-[40rem] overflow-visible opacity-100'}`}
          >
            <div className="mb-8 pr-6">
              <h2 className="font-display text-4xl leading-[0.92] tracking-tight text-white sm:text-6xl md:text-7xl">
                Pregunta lo que quieras<br />
                saber sobre mi
              </h2>
            </div>
            <div className="mb-6 flex shrink-0 flex-row flex-wrap items-center gap-2.5 pr-6">
              {CHAT_SUGGESTIONS.slice(0, 4).map((suggestion) => (
                <span
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="cursor-pointer rounded-[10px] border-2 border-white px-4 py-1.5 text-left text-sm text-white transition-all select-none hover:bg-white/10 active:scale-95"
                >
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
          <form
            className="flex shrink-0 items-center gap-2 rounded-[20px] border-2 border-white py-2 pr-2 pl-5 transition-colors focus-within:border-white"
            onSubmit={handleChatSubmit}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribe tu pregunta..."
              aria-label="Escribe tu pregunta"
              className="min-w-0 flex-1 bg-transparent py-1 text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Enviar"
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-[12px] bg-white text-black transition-transform hover:scale-105 active:scale-95"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 19V5" />
                <path d="M5 12l7-7 7 7" />
              </svg>
            </button>
          </form>
          <p className="mt-6 mr-2 mb-4 shrink-0 text-right text-xs text-white">
            La función de chat con IA sobre mí es experimental y puede producir errores o datos incorrectos.
          </p>
        </div>
      </div>
    </div>
  )
}
