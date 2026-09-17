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

  const { modelStatus, loadingMessage, loadingPercent, isGenerating, sendQuery } = useChatAI({
    enabled: chatOpen,
  })

  // Al añadir una respuesta o recibir tokens, baja al final de la lista.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [history])

  const handleSend = (text) => {
    const q = (text || query).trim()
    if (!q || isGenerating) return

    const messageId = nextIdRef.current++
    setHistory((h) => [...h.slice(-7), { id: messageId, q, a: '', isStreaming: true }])
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
              <ul aria-live="polite" className="space-y-3">
                {history.map((m) => (
                  <Fragment key={m.id || m.q}>
                    <li className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-white px-4 py-2.5 text-sm font-medium text-[#0e0a38]">
                      {m.q}
                    </li>
                    <li className="w-fit max-w-[95%] rounded-2xl rounded-bl-md bg-white/10 px-4 py-2.5 text-sm leading-relaxed text-white">
                      {m.a ? (
                        <>
                          <span>{m.a}</span>
                          {m.isStreaming ? (
                            <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-[#2aff75] align-middle" />
                          ) : null}
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 py-0.5 text-white/50">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></span>
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></span>
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white"></span>
                        </span>
                      )}
                    </li>
                  </Fragment>
                ))}
              </ul>
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
                    disabled={isGenerating}
                    className="cursor-pointer rounded-[10px] border-2 border-white px-4 py-1.5 text-left text-sm text-white transition-all select-none hover:bg-white/10 active:scale-95 disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {modelStatus === 'loading' ? (
            <div className="mb-2 flex items-center justify-between px-2 text-xs text-white/75">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2aff75] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2aff75]"></span>
                </span>
                {loadingMessage || 'Descargando IA local (Qwen 0.5B)...'}
              </span>
              {loadingPercent > 0 ? (
                <span className="font-mono text-white/60">{loadingPercent}%</span>
              ) : null}
            </div>
          ) : null}

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
              disabled={isGenerating}
              className="min-w-0 flex-1 bg-transparent py-1 text-sm text-white placeholder:text-white/40 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              aria-label="Enviar"
              disabled={isGenerating || !query.trim()}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-[12px] bg-white text-black transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
            >
              {isGenerating ? (
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

          <div className="mt-4 mr-2 mb-4 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  modelStatus === 'ready'
                    ? 'bg-[#2aff75]'
                    : modelStatus === 'loading'
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-white/30'
                }`}
              />
              {modelStatus === 'ready'
                ? 'IA local activa (Qwen 0.5B WebGPU)'
                : modelStatus === 'loading'
                  ? 'Cargando IA local...'
                  : 'IA local en dispositivo (privada)'}
            </span>
            <span>La IA es experimental y puede producir errores.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
