import { useCallback, useEffect, useRef, useState } from 'react'

let sharedWorker = null
let sharedCallbacks = new Set()
let sharedState = {
  status: 'idle',
  loadingMessage: '',
  loadingPercent: 0,
  isGenerating: false,
}

function getSharedWorker() {
  if (!sharedWorker && typeof window !== 'undefined') {
    sharedWorker = new Worker(new URL('../workers/chat.worker.js', import.meta.url), {
      type: 'module',
    })

    sharedWorker.onmessage = (e) => {
      const { type, status, message, data, token, content, error } = e.data || {}

      if (type === 'status') {
        sharedState.status = status
        if (message) sharedState.loadingMessage = message
        notifyState()
      } else if (type === 'progress') {
        if (data && typeof data.progress === 'number') {
          sharedState.loadingPercent = Math.round(data.progress)
          notifyState()
        }
      } else if (type === 'token') {
        sharedCallbacks.forEach((cb) => cb.onToken?.(token))
      } else if (type === 'done') {
        sharedState.isGenerating = false
        notifyState()
        sharedCallbacks.forEach((cb) => cb.onDone?.(content))
      } else if (type === 'error') {
        console.error('Chat Worker Error:', error)
        sharedState.isGenerating = false
        sharedState.status = 'error'
        notifyState()
        sharedCallbacks.forEach((cb) => cb.onError?.(error))
      }
    }
  }
  return sharedWorker
}

function notifyState() {
  sharedCallbacks.forEach((cb) => cb.onStateUpdate?.({ ...sharedState }))
}

export function useChatAI({ enabled = true } = {}) {
  const [modelStatus, setModelStatus] = useState(sharedState.status)
  const [loadingMessage, setLoadingMessage] = useState(sharedState.loadingMessage)
  const [loadingPercent, setLoadingPercent] = useState(sharedState.loadingPercent)
  const [isGenerating, setIsGenerating] = useState(sharedState.isGenerating)
  const queryCallbackRef = useRef(null)

  useEffect(() => {
    if (!enabled) return

    const worker = getSharedWorker()

    const listener = {
      onStateUpdate: (state) => {
        setModelStatus(state.status)
        setLoadingMessage(state.loadingMessage)
        setLoadingPercent(state.loadingPercent)
        setIsGenerating(state.isGenerating)
      },
      onToken: (token) => {
        queryCallbackRef.current?.onToken?.(token)
      },
      onDone: (content) => {
        queryCallbackRef.current?.onDone?.(content)
        queryCallbackRef.current = null
      },
      onError: (err) => {
        queryCallbackRef.current?.onError?.(err)
        queryCallbackRef.current = null
      },
    }

    sharedCallbacks.add(listener)

    // Si aún no está listo ni cargando, pedir inicio
    if (sharedState.status === 'idle') {
      worker.postMessage({ type: 'init' })
    }

    return () => {
      sharedCallbacks.delete(listener)
    }
  }, [enabled])

  const sendQuery = useCallback((query, { onToken, onDone, onError }) => {
    const worker = getSharedWorker()
    if (!worker) {
      onError?.('No se pudo inicializar el entorno de IA.')
      return
    }

    sharedState.isGenerating = true
    setIsGenerating(true)
    queryCallbackRef.current = { onToken, onDone, onError }

    worker.postMessage({
      type: 'generate',
      id: Date.now(),
      query,
    })
  }, [])

  return {
    modelStatus,
    loadingMessage,
    loadingPercent,
    isGenerating,
    sendQuery,
  }
}
