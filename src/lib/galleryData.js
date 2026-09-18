// Metadatos curatoriales de las piezas de la galería (título y descripción)
export const PROJECT_METADATA = {
  1: {
    title: 'Kinetic Motion & Render',
    description: 'Animación procedural 3D y renderizado de producto en Blender.',
  },
  2: {
    title: 'Hard Surface Concept',
    description: 'Modelado poligonal avanzado, texturizado PBR y variantes de iluminación.',
  },
  3: {
    title: 'Isometric Environment',
    description: 'Escena isométrica estilizada con props detallados y paleta ambiental.',
  },
  4: {
    title: 'Vertical Dynamic Simulation',
    description: 'Composición de movimiento vertical 9:16 y físicas simuladas.',
  },
  5: {
    title: 'Sci-Fi Artifact',
    description: 'Diseño conceptual futurista, materiales emisivos y sombreado procedural.',
  },
  6: {
    title: 'Mechanical Prop Design',
    description: 'Asset 3D de precisión mecánica optimizado para tiempo real.',
  },
  7: {
    title: 'Stylized Diorama',
    description: 'Composición espacial con iluminación dramática y estética cyberpunk.',
  },
  8: {
    title: 'Modular Architecture',
    description: 'Estructuras modulares con mapeo UV limpio y texturas desgastadas.',
  },
  9: {
    title: 'Vehicle & Hard Surface',
    description: 'Modelado vehicular con curvas complejas y paneles de carrocería.',
  },
  10: {
    title: 'Abstract Form Study',
    description: 'Exploración de geometrías fluidas, cáusticas y refracción de luz.',
  },
  11: {
    title: 'Looping Motion Reel',
    description: 'Bucle cinético continuo con ritmo sincronizado y shader animado.',
  },
  12: {
    title: 'Game Asset Showcase',
    description: 'Prop interactivo preparado para motores de videojuego (Unity / Unreal).',
  },
  13: {
    title: 'Industrial Device',
    description: 'Pieza de instrumentación técnica con micro-detalles y serigrafía PBR.',
  },
  14: {
    title: 'Portrait & Character Prop',
    description: 'Composición en formato 4:5 con enfoque en materiales orgánicos y sintéticos.',
  },
  15: {
    title: 'Cyberpunk Asset',
    description: 'Modelado hard-surface con iluminación volumétrica y estética retro-futurista.',
  },
  16: {
    title: 'Interior Mood Scene',
    description: 'Estudio de atmósfera lumínica interior con rebote indirecto de luz.',
  },
  17: {
    title: 'Futuristic Gadget',
    description: 'Diseño ergonómico conceptual con acabados mate y acentos metálicos.',
  },
  18: {
    title: 'Low Poly & Stylized Props',
    description: 'Assets estilizados con topología eficiente y gradientes pintados.',
  },
  19: {
    title: 'Complex Mechanism',
    description: 'Despiece mecánico detallado con ensamblaje de piezas articuladas.',
  },
  20: {
    title: 'Environment Set Piece',
    description: 'Escenario ambiental inmersivo con iluminación de contraste y profundidad.',
  },
  21: {
    title: 'Material & Shader Lab',
    description: 'Experimentación de nodos de sombreado, dispersión subsuperficial y brillo.',
  },
  22: {
    title: 'Hero Prop Finale',
    description: 'Asset principal de alta fidelidad con variantes de detalle y acabado final.',
  },
}


// Carga automática de los archivos de texto (.txt) de la carpeta galeria/ vía Vite.
// Estructura de cada archivo: primera línea es el título, las restantes son el subtítulo/descripción.
// Los hashtags (#...) se extraen automáticamente como chips y se limpian del texto.
const RAW_TXT_FILES = import.meta.glob('../../galeria/*.txt', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function extractTags(text) {
  const matches = text.match(/(?:^|\s)#(?!\d+\b)[a-zA-Z0-9_áéíóúÁÉÍÓÚñÑ]+/g) || []
  const tags = []
  for (const m of matches) {
    const cleanTag = m.trim().replace(/^#/, '')
    if (cleanTag && !tags.includes(cleanTag)) {
      tags.push(cleanTag)
    }
  }
  return tags
}

function cleanHashtags(text) {
  return text
    .replace(/(?:^|\s)#(?!\d+\b)[a-zA-Z0-9_áéíóúÁÉÍÓÚñÑ]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const PARSED_METADATA = {}
for (const [path, raw] of Object.entries(RAW_TXT_FILES)) {
  const match = path.match(/\/([^/]+)\.txt$/)
  if (!match) continue
  const key = match[1] // ej: "1-1", "1-2", "2-1"
  const lines = (raw || '').replace(/\r\n/g, '\n').trim().split('\n')
  const rawTitle = (lines[0] || '').trim()
  const rawDescription = lines.slice(1).join(' ').trim()

  const tagsFromTitle = extractTags(rawTitle)
  const tagsFromDesc = extractTags(rawDescription)
  const tags = Array.from(new Set([...tagsFromTitle, ...tagsFromDesc]))

  const title = cleanHashtags(rawTitle)
  const description = cleanHashtags(rawDescription)

  if (title || description || tags.length > 0) {
    PARSED_METADATA[key] = { title, description, tags }
  }
}

export function getProjectMeta(keyOrId) {
  const strKey = String(keyOrId || '')
  let meta = PARSED_METADATA[strKey]

  if (!meta) {
    const baseNumber = strKey.split('-')[0]
    if (baseNumber && PARSED_METADATA[baseNumber]) {
      meta = PARSED_METADATA[baseNumber]
    } else if (PROJECT_METADATA[strKey] || PROJECT_METADATA[Number(baseNumber)]) {
      const fallback = PROJECT_METADATA[strKey] || PROJECT_METADATA[Number(baseNumber)]
      meta = {
        title: fallback.title,
        description: fallback.description,
        tags: [],
      }
    }
  }

  if (meta) {
    return {
      title: meta.title || '',
      description: meta.description || '',
      tags: meta.tags || [],
    }
  }

  return {
    title: `Pieza 3D #${strKey}`,
    description: 'Modelado, materiales, iluminación y renderizado en Blender.',
    tags: [],
  }
}
