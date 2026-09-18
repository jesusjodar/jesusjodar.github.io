import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { CHAT_SUGGESTIONS } from '../lib/portfolio.js'
import { useChatAI } from '../hooks/useChatAI.js'

// Configuración del renderizador Markdown para enlaces externos seguros
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

function MarkdownMessage({ content }) {
  const html = useMemo(() => {
    if (!content) return ''
    const rawHtml = marked.parse(content)
    if (typeof window !== 'undefined' && DOMPurify?.sanitize) {
      return DOMPurify.sanitize(rawHtml, { ADD_ATTR: ['target', 'rel'] })
    }
    return rawHtml
  }, [content])

  return (
    <div
      className="chat-markdown"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// Panel superior de preguntas asistido por similitud semántica y ML en cliente.
// Cada consulta entra con contexto limpio y sin arrastrar historial previo (stateless),
// asegurando respuestas directas, instantáneas y precisas sobre Jesús Jódar.
export default function ChatPanel({ chatOpen, introDone, panelRef }) {
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState([])
  const [suggestionOffset, setSuggestionOffset] = useState(0)
  const nextIdRef = useRef(1)

  // Rotación suave de las sugerencias cada 7 segundos cuando la pantalla de inicio está activa
  useEffect(() => {
    if (!chatOpen || history.length > 0) return
    const interval = setInterval(() => {
      setSuggestionOffset((prev) => (prev + 4) % CHAT_SUGGESTIONS.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [chatOpen, history.length])

  // Obtiene 4 sugerencias consecutivas ciclando sobre el banco total
  const visibleSuggestions = useMemo(() => {
    const total = CHAT_SUGGESTIONS.length
    const result = []
    for (let i = 0; i < 4; i++) {
      result.push(CHAT_SUGGESTIONS[(suggestionOffset + i) % total])
    }
    return result
  }, [suggestionOffset])

  const { isGenerating, sendQuery } = useChatAI({
    enabled: chatOpen,
  })

  const handleSend = (text) => {
    const q = (text || query).trim()
    if (!q || isGenerating) return

    const messageId = nextIdRef.current++
    // Reemplaza cualquier mensaje anterior: cada consulta entra limpia en pantalla
    setHistory([{ id: messageId, q, a: '', isStreaming: true }])
    setQuery('')

    sendQuery(q, {
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
                  a: 'No se pudo completar la respuesta en este momento. Puedes contactar directamente conmigo por email o LinkedIn.',
                  isStreaming: false,
                }
              : m
          )
        )
      },
    })
  }

  const handleResetChat = () => {
    setHistory([])
    setQuery('')
    // Al volver al inicio, rota también a un nuevo set de preguntas sugeridas
    setSuggestionOffset((prev) => (prev + 4) % CHAT_SUGGESTIONS.length)
  }

  const handleChatSubmit = (e) => {
    e.preventDefault()
    handleSend(query)
  }

  return (
    <div
      ref={panelRef}
      className="fixed inset-x-[calc(var(--frame-margin)+1rem)] top-0 z-40 flex flex-col overflow-y-auto overscroll-contain no-scrollbar transition-opacity duration-300"
      style={{ opacity: chatOpen ? 1 : 0, pointerEvents: chatOpen ? 'auto' : 'none' }}
      aria-hidden={chatOpen ? undefined : true}
      inert={!chatOpen || !introDone}
    >
      {/* Bloque único de chat anclado al borde del marco, desbordando hacia arriba sin cortarse */}
      <div className="flex min-h-full shrink-0 flex-col justify-end pt-4 pb-0">
        {history.length > 0 ? (
          <div className="mb-4 flex flex-col justify-end">
            <ul aria-live="polite" className="space-y-3 pb-1">
              {history.map((m) => (
                <Fragment key={m.id || m.q}>
                  {/* Fila de la pregunta del usuario: el botón de volver al inicio se sitúa a la izquierda (arriba de la futura respuesta) sin desplazar el mensaje del usuario hacia arriba */}
                  <li className="flex w-full items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleResetChat}
                      className="group flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-white text-white transition-all hover:bg-white/15 active:scale-95"
                      aria-label="Volver al inicio del chat"
                      title="Volver al inicio"
                    >
                      <svg
                        className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <div className="w-fit max-w-[85%] rounded-2xl rounded-br-md bg-white px-4 py-2.5 text-sm font-medium text-[#0e0a38]">
                      {m.q}
                    </div>
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
                    /* Una vez completa, sustituye al bubble de puntos con renderizado Markdown y outline como el shell */
                    <li className="w-fit max-w-[95%] rounded-2xl rounded-bl-md border-2 border-white px-4 py-2.5 text-sm leading-relaxed text-white">
                      <MarkdownMessage content={m.a} />
                    </li>
                  ) : null}
                </Fragment>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="shrink-0">
          {history.length === 0 ? (
            <div className="pt-[calc(var(--frame-margin)+4rem)]">
              <div className="mb-8 pr-6">
                <h2 className="font-display text-4xl leading-[0.92] tracking-tight text-white sm:text-6xl md:text-7xl">
                  Pregunta lo que quieras<br />
                  saber sobre mi
                </h2>
              </div>
              <div className="mb-6 flex shrink-0 flex-row flex-wrap items-center gap-2.5 pr-6">
                {visibleSuggestions.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => handleSend(suggestion)}
                    disabled={isGenerating}
                    className="cursor-pointer rounded-[10px] border-2 border-white px-4 py-1.5 text-left text-sm text-white transition-all select-none hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <form
            className="flex shrink-0 items-center gap-2 rounded-[20px] border-2 border-white py-2 pr-2 pl-5 transition-opacity duration-300 opacity-100 focus-within:border-white"
            onSubmit={handleChatSubmit}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribe tu pregunta..."
              aria-label="Escribe tu pregunta"
              disabled={isGenerating}
              className="min-w-0 flex-1 bg-transparent py-1 text-sm text-white placeholder:text-white/40 focus:outline-none disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              aria-label="Enviar"
              disabled={isGenerating || !query.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px] bg-white text-black transition-transform select-none enabled:cursor-pointer enabled:hover:scale-105 enabled:active:scale-95 disabled:opacity-50"
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

          <p className="mt-4 mr-2 mb-4 shrink-0 text-right text-xs text-white/60">
            La función de chat sobre mí es experimental y puede producir resultados inesperados.
          </p>
        </div>
      </div>
    </div>
  )
}
