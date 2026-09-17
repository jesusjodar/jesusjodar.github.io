import { pipeline, TextStreamer, env } from '@huggingface/transformers'

// Configuración para ejecución en navegador
env.allowLocalModels = false

let generator = null
let isInitializing = false

const SYSTEM_PROMPT = `Eres el asistente oficial del portfolio de Jesús Jódar. Responde en español de forma breve, clara y profesional (1 o 2 frases máximo) usando solo estos datos:
- Jesús tiene 24 años y vive en la Región de Murcia.
- Experiencia: Prácticas en Grupo Security (Lorca) en 2026 en mantenimiento de alarmas, CCTV, control de accesos y seguridad electrónica. Años de experiencia autodidacta configurando sistemas, hardware y automatizaciones.
- Conocimientos: Sistemas Windows y Linux a fondo, montaje de hardware, automatización e Inteligencia Artificial.
- Formación: BTEC Level 3 en Creative Media (Distinction) en ESI Murcia y ESO. Todo lo técnico aprendido de forma autodidacta.
- Contacto: jesusjodarpiernas@gmail.com | 623 175 760 | linkedin.com/in/jesujopi.
Si preguntan algo fuera de este tema, responde educadamente que solo respondes sobre el perfil y experiencia de Jesús.`

async function getGenerator() {
  if (generator) return generator
  if (isInitializing) {
    while (isInitializing) {
      await new Promise((r) => setTimeout(r, 100))
    }
    return generator
  }

  isInitializing = true
  self.postMessage({ type: 'status', status: 'loading', message: 'Iniciando modelo...' })

  try {
    // Intentar WebGPU con q4 (estable, evita errores de precisión f16)
    generator = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', {
      device: 'webgpu',
      dtype: 'q4',
      progress_callback: (p) => {
        self.postMessage({ type: 'progress', data: p })
      },
    })
  } catch (gpuErr) {
    console.warn('WebGPU no disponible o fallo con q4, reintentando con WASM:', gpuErr)
    self.postMessage({
      type: 'status',
      status: 'loading',
      message: 'Cargando con WASM...',
    })
    try {
      generator = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', {
        device: 'wasm',
        dtype: 'q4',
        progress_callback: (p) => {
          self.postMessage({ type: 'progress', data: p })
        },
      })
    } catch (fallbackErr) {
      isInitializing = false
      throw fallbackErr
    }
  }

  isInitializing = false
  self.postMessage({ type: 'status', status: 'ready', message: 'Modelo listo' })
  return generator
}

self.addEventListener('message', async (e) => {
  const { type, id, query } = e.data || {}

  if (type === 'init') {
    try {
      await getGenerator()
    } catch (err) {
      self.postMessage({ type: 'error', error: err.message || String(err) })
    }
    return
  }

  if (type === 'generate') {
    try {
      const gen = await getGenerator()

      // Prompt stateless: contexto CV compacto + consulta actual limpia (sin historial acumulado)
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query },
      ]

      let accumulated = ''
      const streamer = new TextStreamer(gen.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: (token) => {
          accumulated += token
          self.postMessage({ type: 'token', id, token })
        },
      })

      const output = await gen(messages, {
        max_new_tokens: 100,
        temperature: 0.1,
        top_p: 0.9,
        do_sample: false,
        streamer,
      })

      const finalContent =
        output[0]?.generated_text?.at(-1)?.content || accumulated || ''
      self.postMessage({ type: 'done', id, content: finalContent })
    } catch (err) {
      console.error('Error durante la generación:', err)
      self.postMessage({ type: 'error', id, error: err.message || String(err) })
    }
  }
})
