import { KNOWLEDGE_BASE, FALLBACK_ANSWER } from './knowledgeBase.js'

// Diccionario de sinónimos y lematización básica en español
const SYNONYMS = {
  pc: 'ordenador hardware equipo',
  computadora: 'ordenador equipo',
  computadoras: 'ordenador equipo',
  ordenadores: 'ordenador equipo',
  cv: 'curriculum perfil experiencia',
  curriculum: 'perfil experiencia sobre mi',
  celular: 'telefono movil',
  whatsapp: 'telefono contacto movil',
  mail: 'email correo contacto',
  correo: 'email contacto',
  camaras: 'cctv videovigilancia seguridad',
  camara: 'cctv videovigilancia seguridad',
  video: 'edicion after effects',
  games: 'videojuegos unity unreal',
  juegos: 'videojuegos unity unreal',
  diplomas: 'certificados cursos sef formacion',
  cursos: 'certificados sef formacion',
  titulo: 'estudios btec formacion',
  titulos: 'estudios btec formacion',
  estudiado: 'estudios formacion btec',
  estudiaste: 'estudios formacion btec',
  universidad: 'estudios escuela esi formacion',
  ingles: 'idiomas ingles language',
  super: 'supermercado tienda comercio reposicion',
  reponer: 'reposicion reponedor supermercado comercio',
  reponedor: 'reposicion supermercado comercio tienda',
  seguridad: 'security alarmas cctv accesos',
  cctv: 'camaras videovigilancia security seguridad',
  alarma: 'alarmas security seguridad',
  prezi: 'presentaciones prezi diapositivas',
  contable: 'contabilidad balances asientos',
  decisiones: 'problemas toma decisiones resolutivo',
  ergonomia: 'prl riesgos oficinas pvd postura',
  postura: 'prl riesgos ergonomia pvd',
}

const STOPWORDS = new Set([
  'a', 'al', 'algo', 'algun', 'alguna', 'algunas', 'algunos', 'ante', 'antes', 'asi',
  'aun', 'bien', 'cada', 'como', 'con', 'cual', 'cuales', 'cuando', 'de', 'del',
  'desde', 'donde', 'dos', 'el', 'ella', 'ellas', 'ellos', 'en', 'entre', 'era',
  'erais', 'eran', 'eras', 'eres', 'es', 'esa', 'esas', 'ese', 'eso', 'esos',
  'esta', 'estaba', 'estado', 'estais', 'estan', 'estar', 'estas', 'este', 'estos',
  'estoy', 'fue', 'fueron', 'fui', 'fuimos', 'ha', 'habeis', 'habia', 'habian',
  'habido', 'habreis', 'habria', 'habrian', 'han', 'has', 'hasta', 'hay', 'la',
  'las', 'le', 'les', 'lo', 'los', 'mas', 'me', 'mi', 'mis', 'mucho', 'muchos',
  'muy', 'nada', 'ni', 'no', 'nos', 'nosotras', 'nosotros', 'o', 'os', 'otra',
  'otras', 'otro', 'otros', 'para', 'pero', 'poco', 'por', 'porque', 'que',
  'quien', 'quienes', 'se', 'sea', 'seais', 'sean', 'seas', 'ser', 'sera',
  'seran', 'seras', 'sere', 'sereis', 'seria', 'seriais', 'serian', 'serias',
  'si', 'sido', 'siendo', 'sin', 'sois', 'somos', 'son', 'soy', 'su', 'sus',
  'suya', 'suyas', 'suyo', 'suyos', 'tambien', 'tanto', 'te', 'teneis', 'tenemos',
  'tener', 'tenga', 'tengais', 'tengan', 'tengo', 'tenia', 'teniais', 'tenian',
  'ti', 'tiene', 'tienen', 'tienes', 'todo', 'todos', 'tu', 'tus', 'tuve',
  'tuviera', 'tuvieron', 'tuvimos', 'tuviste', 'un', 'una', 'unas', 'uno', 'unos',
  'vosotras', 'vosotros', 'vuestra', 'vuestras', 'vuestro', 'vuestros', 'y', 'ya'
])

// Normaliza texto: minúsculas, sin tildes, sin signos de puntuación
export function normalizeText(text) {
  if (!text || typeof text !== 'string') return ''
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/[^\w\s]/g, ' ') // Solo letras, números y espacios
    .replace(/\s+/g, ' ')
    .trim()
}

// Lematizador básico de sufijos para raíces en español
function stemWord(word) {
  if (word.length <= 3) return word
  return word
    .replace(/(mente|aciones|acion|iendo|ando|aron|eron|ieron|aban|ades|idad)$/, '')
    .replace(/(istas|istas|ismos|ismo|ores|oras|ador|adora)$/, '')
    .replace(/(idos|idas|ados|adas|ido|ida|ado|ada)$/, '')
    .replace(/(encias|encia|ancias|ancia|ientes|iente|antes|ante)$/, '')
    .replace(/(es|as|os|ar|er|ir|is|an|en|al)$/, '')
}

// Tokeniza y extrae unigramas, bigramas y trigramas de caracteres (tolerancia a erratas)
export function extractFeatures(rawText) {
  const norm = normalizeText(rawText)
  if (!norm) return { tokens: [], ngrams: [], charTrigrams: new Set() }

  const rawWords = norm.split(' ').filter(Boolean)
  const expandedWords = []

  rawWords.forEach((w) => {
    expandedWords.push(w)
    if (SYNONYMS[w]) {
      SYNONYMS[w].split(' ').forEach((syn) => expandedWords.push(syn))
    }
  })

  // Palabras filtradas y sus raíces (stems)
  const tokens = []
  expandedWords.forEach((w) => {
    if (!STOPWORDS.has(w) || expandedWords.length <= 2) {
      tokens.push(w)
      const stem = stemWord(w)
      if (stem !== w && stem.length >= 3) {
        tokens.push(stem)
      }
    }
  })

  // Bigramas de palabras para capturar conceptos compuestos (e.g. "seguridad electronica")
  const ngrams = [...tokens]
  for (let i = 0; i < rawWords.length - 1; i++) {
    const bigram = `${rawWords[i]}_${rawWords[i + 1]}`
    ngrams.push(bigram)
  }

  // Trigramas de caracteres para tolerancia a erratas (e.g., "blnder" -> "ble", "len", "nde", "der")
  const charTrigrams = new Set()
  rawWords.forEach((w) => {
    if (w.length >= 3) {
      const padded = `_${w}_`
      for (let i = 0; i < padded.length - 2; i++) {
        charTrigrams.add(padded.slice(i, i + 3))
      }
    }
  })

  return { tokens, ngrams, charTrigrams }
}

// ============================================================
// Modelo de Similitud Vectorial TF-IDF + Coseno + Jaccard
// ============================================================

class IntentSearchEngine {
  constructor(intents) {
    this.intents = intents
    this.intentProfiles = []
    this.df = new Map() // Document frequency por término
    this.totalDocuments = 0

    this.train()
  }

  train() {
    // Cada intent recopila todos sus patrones, keywords y categorías como documentos de entrenamiento
    this.intents.forEach((intent) => {
      const allText = [
        ...intent.patterns,
        intent.keywords.join(' '),
        intent.category,
      ].join(' ')

      const features = extractFeatures(allText)
      const termCounts = new Map()

      features.ngrams.forEach((term) => {
        termCounts.set(term, (termCounts.get(term) || 0) + 1)
      })

      // Actualizar frecuencia de documentos
      termCounts.forEach((_, term) => {
        this.df.set(term, (this.df.get(term) || 0) + 1)
      })

      // Pre-calcular trigramas para coincidencia difusa
      const allCharTrigrams = new Set()
      features.charTrigrams.forEach((tg) => allCharTrigrams.add(tg))

      this.intentProfiles.push({
        intent,
        termCounts,
        charTrigrams: allCharTrigrams,
        keywordsSet: new Set(intent.keywords.map((k) => normalizeText(k))),
        patternsFeatures: intent.patterns.map((p) => extractFeatures(p)),
      })
    })

    this.totalDocuments = this.intentProfiles.length

    // Calcular vector TF-IDF para cada perfil
    this.intentProfiles.forEach((profile) => {
      profile.tfidfVector = this.computeTfidf(profile.termCounts)
    })
  }

  computeTfidf(termCounts) {
    const vector = new Map()
    let normSq = 0

    termCounts.forEach((count, term) => {
      const tf = 1 + Math.log(count)
      const df = this.df.get(term) || 1
      const idf = Math.log(1 + this.totalDocuments / df) + 1
      const weight = tf * idf
      vector.set(term, weight)
      normSq += weight * weight
    })

    const magnitude = Math.sqrt(normSq) || 1
    return { vector, magnitude }
  }

  // Similitud de coseno entre vector consulta y vector documento
  cosineSimilarity(queryTfidf, docTfidf) {
    let dotProduct = 0
    queryTfidf.vector.forEach((qWeight, term) => {
      const dWeight = docTfidf.vector.get(term)
      if (dWeight) {
        dotProduct += qWeight * dWeight
      }
    })
    return dotProduct / (queryTfidf.magnitude * docTfidf.magnitude || 1)
  }

  // Similitud de Jaccard sobre trigramas de caracteres (tolerancia a errores ortográficos)
  jaccardTrigrams(setA, setB) {
    if (!setA.size || !setB.size) return 0
    let intersection = 0
    setA.forEach((item) => {
      if (setB.has(item)) intersection++
    })
    const union = setA.size + setB.size - intersection
    return union === 0 ? 0 : intersection / union
  }

  // Similitud directa contra la mejor pregunta prototipo del intent
  maxPatternSimilarity(queryFeatures, profile) {
    let maxSim = 0
    const qTokens = new Set(queryFeatures.tokens)

    profile.patternsFeatures.forEach((pFeat) => {
      let matchCount = 0
      pFeat.tokens.forEach((t) => {
        if (qTokens.has(t)) matchCount++
      })
      const denom = Math.max(qTokens.size, pFeat.tokens.length) || 1
      const sim = matchCount / denom
      if (sim > maxSim) maxSim = sim
    })

    return maxSim
  }

  // Inferencia: encuentra el intent más cercano a la consulta del usuario
  predict(query) {
    const queryFeatures = extractFeatures(query)
    if (!queryFeatures.tokens.length) {
      return { intent: null, score: 0, answer: FALLBACK_ANSWER }
    }

    const queryCounts = new Map()
    queryFeatures.ngrams.forEach((term) => {
      queryCounts.set(term, (queryCounts.get(term) || 0) + 1)
    })
    const queryTfidf = this.computeTfidf(queryCounts)

    let bestScore = -1
    let bestProfile = null

    this.intentProfiles.forEach((profile) => {
      // 1. Similitud de coseno sobre TF-IDF
      const cosSim = this.cosineSimilarity(queryTfidf, profile.tfidfVector)

      // 2. Similitud con el patrón de pregunta más parecido
      const patternSim = this.maxPatternSimilarity(queryFeatures, profile)

      // 3. Similitud de caracteres difusa (Jaccard sobre 3-gramas)
      const charSim = this.jaccardTrigrams(queryFeatures.charTrigrams, profile.charTrigrams)

      // 4. Boost de coincidencia exacta de palabras clave relevantes
      let keywordHits = 0
      queryFeatures.tokens.forEach((t) => {
        if (profile.keywordsSet.has(t)) keywordHits++
      })
      const keywordBoost = Math.min(keywordHits * 0.18, 0.45)

      // Ponderación de ensemble ML
      const totalScore =
        cosSim * 0.45 +
        patternSim * 0.35 +
        charSim * 0.10 +
        keywordBoost

      if (totalScore > bestScore) {
        bestScore = totalScore
        bestProfile = profile
      }
    })

    // Umbral de confianza mínimo
    const CONFIDENCE_THRESHOLD = 0.14
    if (bestProfile && bestScore >= CONFIDENCE_THRESHOLD) {
      return {
        intent: bestProfile.intent,
        score: bestScore,
        answer: bestProfile.intent.answer,
      }
    }

    return {
      intent: null,
      score: bestScore,
      answer: FALLBACK_ANSWER,
    }
  }
}

// Instancia única (singleton) entrenada en memoria
export const searchEngine = new IntentSearchEngine(KNOWLEDGE_BASE)

// Función principal de consulta para la UI
export function queryKnowledgeBase(query) {
  return searchEngine.predict(query)
}
