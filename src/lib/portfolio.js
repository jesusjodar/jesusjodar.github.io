// Fuente única de medidas, contenido estático y helpers puros.
// Extraído de App.jsx para que los componentes (CV, Chat, FolderFrame)
// compartan las mismas constantes sin duplicarlas en JS y CSS.

export const SM_MIN = 640
export const TAB_H_MOBILE = 32
export const TAB_H_DESKTOP = 38
export const BOTTOM_RESERVE = 85
export const CHAT_OPEN_PX = 140
export const FRAME_STROKE = 2
// Debe coincidir con .intro-content (1.8s). Si cambias el CSS, cambia aquí.
export const INTRO_MS = 1900

export const WAVE_STAR_D =
  'M0 -11 L2.7 -3.72 L10.46 -3.4 L4.38 1.42 L6.47 8.9 L0 4.6 L-6.47 8.9 L-4.38 1.42 L-10.46 -3.4 L-2.7 -3.72 Z'

// Determinista (antes Math.random en render → mismatch en SSR/hidratación)
export const DIVIDER_ROTS = [24, 132, 248, 78]

// Banco amplio y variado de preguntas sugeridas
export const CHAT_SUGGESTIONS = [
  '¿Quién eres y cuál es tu perfil?',
  '¿Qué sabes hacer con Windows, Linux y macOS?',
  '¿Qué haces en diseño 3D con Blender?',
  '¿Qué estudiaste de desarrollo de videojuegos?',
  '¿Tienes GitHub con proyectos?',
  '¿Cómo usas la IA local y Ollama?',
  '¿Qué lenguajes y herramientas de desarrollo usas?',
  '¿Sabes montar o reparar ordenadores?',
  '¿Sabes de redes y SSH?',
  '¿Cuál es tu formación?',
  '¿Cómo trabajas y aprendes?',
  '¿Qué te interesa profesionalmente?',
  '¿Qué es tu portfolio 3D?',
  '¿Dónde vives?',
  '¿Cómo puedo contactar contigo?',
]

export const SKILLS = [
  'Windows',
  'Linux',
  'macOS',
  'JavaScript',
  'TypeScript',
  'React',
  'Blender',
  'IA',
  'Ollama',
  'RAG',
  'Git',
  'Hardware',
]

export const getTabH = () =>
  window.innerWidth >= SM_MIN ? TAB_H_DESKTOP : TAB_H_MOBILE

export const getMaxInset = (frameH) =>
  Math.max(0, frameH - getTabH() - BOTTOM_RESERVE)

// Un solo constructor de chevron (antes 3: chevFlatD/chevUpD/framePaths.chevron)
export function chevronD(cx, cy, w, h) {
  const f = (n) => n.toFixed(1)
  return (
    `M ${f(cx - w / 2)} ${f(cy - h / 2)} ` +
    `L ${f(cx)} ${f(cy + h / 2)} ` +
    `L ${f(cx + w / 2)} ${f(cy - h / 2)}`
  )
}

export function chevronUpD(cx, cy, w, h) {
  const f = (n) => n.toFixed(1)
  return (
    `M ${f(cx - w / 2)} ${f(cy + h / 2)} ` +
    `L ${f(cx)} ${f(cy - h / 2)} ` +
    `L ${f(cx + w / 2)} ${f(cy + h / 2)}`
  )
}

// Respuesta local honesta (no hay backend de IA)
export function localAnswer(q) {
  const s = q.toLowerCase()
  if (/sistema|windows|linux|macos|incidencia|hardware|repar/.test(s))
    return 'Trabajo con Windows, Linux y macOS: configuro equipos, instalo software y diagnostico fallos de hardware y software. En Grupo Security (Lorca, 2026) revisé alarmas, CCTV y control de accesos.'
  if (/forma|estudi|aprend|btec|creativ|ifct|videojuego/.test(s))
    return 'Creative Media (Pearson BTEC L3 con Distinction) + IFCT0108 de microinformática + estudios de desarrollo de videojuegos. Lo demás, de forma autodidacta.'
  if (/ia\b|agente|ollama|automat|software|moder/.test(s))
    return 'Oriento mi trabajo a IA, automatización y desarrollo: LLMs locales, agentes y herramientas propias.'
  if (/trabaj|oportun|busc|quier/.test(s))
    return 'Busco oportunidades donde crecer con sistemas, IA, desarrollo y 3D. Escríbeme a jesusjodarpiernas@gmail.com.'
  if (/contact|email|tel|linkedin|github|murcia|donde/.test(s))
    return 'jesusjodarpiernas@gmail.com · 623 175 760 · linkedin.com/in/jesujopi · github.com/jesusjodar · Murcia, España.'
  if (/experiencia|security|lorca|pract/.test(s))
    return 'Prácticas en Grupo Security (Lorca, 2026): inspección y reparación de sistemas de seguridad, mantenimiento y verificación de instalaciones.'
  if (/hola|quien|quién|sobre ti|jesus|jesús/.test(s))
    return 'Soy Jesús Jódar, de Murcia. Perfil técnico-creativo: sistemas, IA, desarrollo y diseño 3D. Abajo tienes el resumen completo.'
  return 'Demo local: busca por “experiencia”, “formación”, “Windows”, “IA” o “contacto”. Debajo tienes el resumen completo.'
}
