import { useCallback, useRef, useState } from 'react'
import { queryKnowledgeBase } from '../lib/nlpEngine.js'

// Hook de consulta basado en ML y similitud de texto (TF-IDF + Cosine + N-grams)
// Respuestas instantáneas y prefabricadas sobre la información real de Jesús Jódar.
export function useChatAI({ enabled = true } = {}) {
  const [isGenerating, setIsGenerating] = useState(false)
  const timerRef = useRef(null)

  const sendQuery = useCallback(
    (query, { onDone, onError } = {}) => {
      if (!enabled) return

      setIsGenerating(true)

      // Inferencia por similitud vectorial NLP
      const result = queryKnowledgeBase(query)

      // Simula un breve tiempo de respuesta natural (350-500ms) para que se aprecie
      // la animación de los 3 puntos antes de sustituirse por la respuesta completa
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        setIsGenerating(false)
        if (result && result.answer) {
          onDone?.(result.answer)
        } else {
          onError?.('No se pudo procesar la respuesta.')
        }
      }, 420)
    },
    [enabled]
  )

  return {
    modelStatus: 'ready',
    loadingPercent: 100,
    loadingMessage: '',
    isGenerating,
    sendQuery,
  }
}
