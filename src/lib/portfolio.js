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
  '¿Qué sabes hacer con Windows y Linux?',
  '¿Sabes montar o reparar ordenadores?',
  '¿Qué hiciste en Grupo Security?',
  '¿Qué herramientas de 3D dominas?',
  '¿Usas Unity o Unreal Engine?',
  '¿Qué programas de Adobe utilizas?',
  '¿Qué experiencia tienes en tiendas o reposición?',
  '¿Cómo aplicas la IA en tu día a día?',
  '¿Cuál es tu titulación oficial y dónde estudiaste?',
  '¿Qué cursos oficiales del SEF has completado?',
  '¿Qué sabes de prevención de riesgos en oficinas?',
  '¿Cómo gestionas la comunicación profesional?',
  '¿Cómo resuelves problemas y tomas decisiones?',
  '¿Tienes conocimientos de contabilidad básica?',
  '¿Qué nivel de inglés tienes?',
  '¿Cuáles son tus puntos fuertes personales?',
  '¿Cuándo te puedes incorporar y qué disponibilidad tienes?',
  '¿Cómo puedo contactar contigo?',
]

export const SKILLS = [
  'Windows',
  'Linux',
  'Hardware',
  'Diseño 3D',
  'IA',
  'Automatización',
  'Resolución de incidencias',
  'Aprendizaje autodidacta',
  'Trabajo en equipo',
  'Atención al cliente',
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
  if (/sistema|windows|linux|incidencia|hardware|repar/.test(s))
    return 'Trabajo con Windows y Linux: configuro equipos, instalo software y diagnostico fallos de hardware y software. En Grupo Security (Lorca, 2026) revisé alarmas, CCTV y control de accesos.'
  if (/forma|estudi|aprend|btec|eso|creativ/.test(s))
    return 'Estudié Creative Media (Pearson BTEC L3 con Distinction, ESID Murcia) + ESO. Sistemas, herramientas e IA, de forma autodidacta.'
  if (/ia\b|automat|software|moder/.test(s))
    return 'Oriento mi trabajo a IA y automatización: automatizar lo automatizable y usar software moderno para resolver incidencias más rápido.'
  if (/trabaj|oportun|busc|quier/.test(s))
    return 'Busco oportunidades donde crecer con sistemas, IA y automatización. Escríbeme a jesusjodarpiernas@gmail.com.'
  if (/contact|email|tel|linkedin|murcia|donde/.test(s))
    return 'jesusjodarpiernas@gmail.com · 623 175 760 · linkedin.com/in/jesujopi · Murcia, España.'
  if (/experiencia|security|lorca|pract/.test(s))
    return 'Prácticas en Grupo Security (Lorca, principios 2026): inspección y reparación de sistemas de seguridad, mantenimiento y verificación de instalaciones.'
  if (/hola|quien|quién|sobre ti|jesus|jesús/.test(s))
    return 'Soy Jesús Jódar, 24 años, de Murcia. Apasionado de sistemas, IA y automatización. Abajo tienes el resumen completo.'
  return 'Demo local: busca por “experiencia”, “formación”, “Windows”, “IA” o “contacto”. Debajo tienes el resumen completo.'
}
