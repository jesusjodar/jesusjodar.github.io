import { Fragment, useEffect, useRef, useState } from 'react'
import CustomScrollbar from './CustomScrollbar.jsx'
import { CHAT_SUGGESTIONS } from '../lib/portfolio.js'
import { useChatAI } from '../hooks/useChatAI.js'

// Panel superior de preguntas asistido por IA local (Qwen 0.5B en navegador con WebGPU).
// Cada consulta entra con contexto limpio y sin arrastrar historial previo (stateless),
// asegurando respuestas directas, rápidas y privadas sobre Jesús Jódar.
export default function ChatPanel({ chatOpen, introDone, panelRef }) {
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState([])
  const scrollRef = useRef(null)
  const nextIdRef = useRef(1)

  const { modelStatus, loadingPercent, isGenerating, sendQuery } = useChatAI({
    enabled: chatOpen,
  })

  const isModelReady = modelStatus === 'ready'

  // Al añadir una respuesta o cambiar estado, baja al final de la lista.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [history])

  const handleSend = (text) => {
    const q = (text || query).trim()
    if (!q || !isModelReady || isGenerating) return

    const messageId = nextIdRef.current++
    // Reemplaza cualquier mensaje anterior: cada consulta entra limpia en pantalla
    setHistory([{ id: messageId, q, a: '', isStreaming: true }])
    setQuery('')

    sendQuery(q, {
      onToken: (token) => {
        setHistory((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, a: m.a + token } : m))
        )
      },
      onDone: (content) => {
        setHistory((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, a: content || m.a, isStreaming: false } : m
          )
        )
      },
      onError: () => {
        setHistory((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  a: 'No se pudo completar la respuesta en este momento. Puedes contactar directamente con Jesús por email o LinkedIn.',
                  isStreaming: false,
                }
              : m
          )
        )
      },
    })
  }

  const handleChatSubmit = (e) => {
    e.preventDefault()
    handleSend(query)
  }

  return (
    <div
      ref={panelRef}
      className="fixed inset-x-[calc(var(--frame-margin)+1rem)] top-0 z-40 flex min-h-0 flex-col transition-opacity duration-300"
      style={{ opacity: chatOpen ? 1 : 0, pointerEvents: chatOpen ? 'auto' : 'none' }}
      aria-hidden={chatOpen ? undefined : true}
      inert={!chatOpen || !introDone}
    >
      {/* Bloque único de chat anclado al borde del marco */}
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
              <div className="flex min-h-full flex-col">
                <ul aria-live="polite" className="mt-auto space-y-3 pb-1">
                  {history.map((m) => (
                    <Fragment key={m.id || m.q}>
                      {/* Pregunta del usuario (fondo blanco sólido) */}
                      <li className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-white px-4 py-2.5 text-sm font-medium text-[#0e0a38]">
                        {m.q}
                      </li>

                      {/* Mientras se genera, muestra ÚNICAMENTE el bubble de tres puntos con outline como el shell */}
                      {m.isStreaming ? (
                        <li
                          aria-label="Generando respuesta"
                          className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md border-2 border-white px-4 py-3 text-white"
                        >
                          <span className="chat-dot-1 inline-block h-1.5 w-1.5 rounded-full bg-white" />
                          <span className="chat-dot-2 inline-block h-1.5 w-1.5 rounded-full bg-white" />
                          <span className="chat-dot-3 inline-block h-1.5 w-1.5 rounded-full bg-white" />
                        </li>
                      ) : m.a ? (
                        /* Una vez completa, sustituye al bubble de puntos con outline de 2px como el shell */
                        <li className="w-fit max-w-[95%] rounded-2xl rounded-bl-md border-2 border-white px-4 py-2.5 text-sm leading-relaxed text-white">
                          {m.a}
                        </li>
                      ) : null}
                    </Fragment>
                  ))}
                </ul>
              </div>
            </CustomScrollbar>
          </div>
        ) : null}

        <div className="mt-auto shrink-0">
          {history.length === 0 ? (
            <div>
              <div className="mb-8 pr-6">
                <h2 className="font-display text-4xl leading-[0.92] tracking-tight text-white sm:text-6xl md:text-7xl">
                  Pregunta lo que quieras<br />
                  saber sobre mi
                </h2>
              </div>
              <div className="mb-6 flex shrink-0 flex-row flex-wrap items-center gap-2.5 pr-6">
                {CHAT_SUGGESTIONS.slice(0, 4).map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => handleSend(suggestion)}
                    disabled={!isModelReady || isGenerating}
                    className="cursor-pointer rounded-[10px] border-2 border-white px-4 py-1.5 text-left text-sm text-white transition-all select-none hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <form
            className={`flex shrink-0 items-center gap-2 rounded-[20px] border-2 border-white py-2 pr-2 pl-5 transition-opacity duration-300 ${
              isModelReady ? 'opacity-100 focus-within:border-white' : 'opacity-40'
            }`}
            onSubmit={handleChatSubmit}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribe tu pregunta..."
              aria-label="Escribe tu pregunta"
              disabled={!isModelReady || isGenerating}
              className="min-w-0 flex-1 bg-transparent py-1 text-sm text-white placeholder:text-white/40 focus:outline-none disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              aria-label={!isModelReady ? 'Cargando modelo de IA' : 'Enviar'}
              disabled={!isModelReady || isGenerating || !query.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px] bg-white text-black transition-transform select-none enabled:cursor-pointer enabled:hover:scale-105 enabled:active:scale-95 disabled:opacity-90"
            >
              {!isModelReady ? (
                loadingPercent > 0 ? (
                  <svg
                    className="h-[18px] w-[18px] -rotate-90 transform text-black"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="7.5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      fill="none"
                      className="text-black/20"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="7.5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={47.12}
                      strokeDashoffset={47.12 * (1 - Math.min(Math.max(loadingPercent, 0), 100) / 100)}
                      className="text-black transition-all duration-200 ease-out"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-[18px] w-[18px] animate-spin text-black"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="7.5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      fill="none"
                      className="text-black/20"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="7.5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="22 47.12"
                      className="text-black"
                    />
                  </svg>
                )
              ) : isGenerating ? (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
              ) : (
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
              )}
            </button>
          </form>

          <p className="mt-4 mr-2 mb-4 shrink-0 text-right text-xs text-white/60">
            La IA es experimental y puede producir errores.
          </p>
        </div>
      </div>
    </div>
  )
}
