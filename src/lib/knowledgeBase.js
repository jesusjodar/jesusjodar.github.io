// Base de conocimiento exhaustiva con preguntas y respuestas en primera persona ("yo")
// redactadas directamente desde la voz de Jesús Jódar: perfil técnico-creativo
// (sistemas, IA, desarrollo, diseño 3D), formación y contacto.

export const KNOWLEDGE_BASE = [
  {
    id: 'sobre_mi',
    category: 'perfil',
    keywords: ['jesus', 'jodar', 'quien', 'eres', 'perfil', 'resumen', 'presentate', 'cuentame', 'sobre', 'ti', 'conocer', 'tecnico', 'creativo'],
    patterns: [
      '¿Quién eres?',
      '¿Quién es Jesús?',
      '¿Quién es Jesús Jódar?',
      'Háblame sobre ti',
      'Cuéntame sobre ti',
      'Preséntate',
      '¿Cuál es tu perfil?',
      'Resumen de tu perfil',
      '¿A qué te dedicas?',
      '¿Qué haces?',
      '¿Qué sabes hacer en general?',
      'Dime un resumen sobre tu experiencia y habilidades',
      '¿Qué perfil profesional tienes?',
      '¿Cómo te describes?',
      '¿Qué tipo de profesional eres?',
    ],
    answer: `¡Hola! Soy **Jesús Jódar**, de Murcia. Tengo un perfil técnico-creativo: me apasionan la informática, la inteligencia artificial y el diseño digital.

- **Sistemas e informática**: Años configurando equipos y moviéndome entre **Windows**, **Linux** y **macOS**, además de hardware, redes y resolución de incidencias.
- **Inteligencia artificial**: Investigo LLMs locales, **Ollama**, **RAG**, agentes y automatización.
- **Desarrollo de software**: JavaScript, TypeScript, React, Vite y Tailwind CSS, con Git y GitHub. Me importan las interfaces con identidad visual.
- **Diseño 3D y videojuegos**: **Blender** (modelado, materiales, iluminación, render), estudios de desarrollo de videojuegos e interés en Unity y Unreal Engine.`,
  },

  {
    id: 'residencia',
    category: 'personal',
    keywords: ['donde', 'vives', 'residencia', 'murcia', 'lorca', 'ciudad', 'nacimiento', 'personal', 'ubicado', 'espana'],
    patterns: [
      '¿Dónde vives?',
      '¿De dónde eres?',
      '¿En qué ciudad resides?',
      '¿Vives en Murcia?',
      '¿Cuál es tu lugar de residencia?',
      '¿Dónde estás ubicado?',
    ],
    answer: `Soy de **Murcia, España**.

Estoy abierto a oportunidades dentro de informática, sistemas, inteligencia artificial, automatización, desarrollo de software y diseño 3D, en un entorno donde pueda aportar y seguir creciendo.`,
  },

  {
    id: 'sistemas_windows_linux_macos',
    category: 'informatica',
    keywords: ['sistemas', 'windows', 'linux', 'macos', 'mac', 'apple', 'so', 'distros', 'ubuntu', 'debian', 'servicios', 'terminal', 'bash', 'drivers', 'instalacion', 'configuracion', 'utilidades', 'redes', 'ssh', 'bios', 'uefi', 'gpu'],
    patterns: [
      '¿Qué sabes hacer con Windows, Linux y macOS?',
      'Cuéntame sobre tu experiencia con sistemas',
      '¿Qué experiencia tienes en sistemas operativos?',
      '¿Sabes usar Linux?',
      '¿Qué nivel tienes en Windows?',
      '¿Manejas la terminal de Linux?',
      '¿Qué distribuciones de Linux has usado?',
      '¿Cómo trabajas con Windows y Linux?',
      '¿Usas macOS?',
      '¿Sabes de redes y SSH?',
      'Instalación y configuración de sistemas',
      '¿Has administrado entornos Windows o Linux?',
      '¿Tienes experiencia con servidores o sistemas?',
    ],
    answer: `Llevo años moviéndome entre sistemas, casi todo aprendido de forma autodidacta:

- **Windows**: Configuración, mantenimiento, instalación de software, diagnóstico de problemas y administración cotidiana del sistema.
- **Linux**: Terminal y herramientas CLI con naturalidad, configuración de entornos, servidores y experimentación con distintas distribuciones y escritorios.
- **macOS**: Uso y configuración del ecosistema, con herramientas de desarrollo y terminal.
- **Hardware y redes**: Montaje y mantenimiento de PCs, GPUs, BIOS/UEFI, redes básicas, conectividad y SSH.`,
  },

  {
    id: 'hardware_montaje_reparacion',
    category: 'informatica',
    keywords: ['hardware', 'montaje', 'pc', 'ordenador', 'equipos', 'componentes', 'reparacion', 'placa', 'grafica', 'cpu', 'ram', 'fuente', 'mantenimiento', 'diagnostico', 'fallos', 'incidencias'],
    patterns: [
      '¿Sabes montar ordenadores?',
      '¿Qué experiencia tienes en hardware?',
      '¿Puedes reparar un ordenador averiado?',
      'Montaje y mantenimiento de equipos',
      '¿Sabes diagnosticar fallos de hardware?',
      '¿Qué componentes de PC conoces?',
      '¿Sabes cambiar una placa base, gráfica o fuente de alimentación?',
      '¿Haces mantenimiento a ordenadores?',
      'Diagnóstico de incidencias hardware y software',
      '¿Qué herramientas de hardware utilizas?',
      '¿Puedes armar un equipo desde cero?',
    ],
    answer: `El hardware es una de mis grandes pasiones y tengo amplia experiencia práctica:

- **Montaje desde cero**: Selecciono componentes compatibles según presupuesto y necesidades, monto la placa base, procesador, refrigeración/disipador, memoria RAM, almacenamiento M.2 NVMe/SSD, tarjeta gráfica y fuente de alimentación, cuidando al detalle el flujo de aire y la gestión de cableado.
- **Diagnóstico y resolución de incidencias**: Localizo fallos por códigos acústicos o LEDs de la BIOS/POST, cuellos de botella térmicos, módulos de memoria con errores (MemTest), fallos de alimentación y fuentes inestables.
- **Mantenimiento**: Limpieza integral de chasis y ventiladores, sustitución de pasta térmica en CPU/GPU y actualización/recuperación segura de BIOS/UEFI.`,
  },

  {
    id: 'practicas_grupo_security',
    category: 'seguridad',
    keywords: ['security', 'grupo', 'lorca', 'alarmas', 'cctv', 'camaras', 'seguridad', 'practicas', 'accesos', 'control', 'electronica', 'instalaciones', 'mantenimiento'],
    patterns: [
      '¿Qué hiciste en Grupo Security?',
      'Háblame de tus prácticas en Grupo Security',
      '¿Tienes experiencia con alarmas y CCTV?',
      '¿Cómo fue tu experiencia en seguridad electrónica en Lorca?',
      '¿Has trabajado instalando cámaras o alarmas?',
      '¿Qué aprendiste en Grupo Security?',
      'Control de accesos y seguridad física',
      'Prácticas de seguridad en Lorca',
      '¿Cuándo hiciste las prácticas en Grupo Security?',
      'Inspección y reparación de sistemas de seguridad',
      '¿Has hecho prácticas en empresa?',
    ],
    answer: `Realicé mis **prácticas profesionales en Grupo Security** (Lorca, 2026), dentro de los sistemas electrónicos de seguridad:

- Inspección y reparación de sistemas electrónicos.
- Mantenimiento y verificación de instalaciones.
- Revisión de sistemas de **alarma**, **CCTV** y **control de accesos**.
- Diagnóstico de incidencias y comprobación del funcionamiento.
- Trabajo técnico dentro de un entorno profesional.

Me permitió trasladar lo que sé de informática y hardware a sistemas reales.`,
  },

  {
    id: 'diseno_3d_blender',
    category: 'creativo',
    keywords: ['3d', 'blender', 'modelado', 'render', 'materiales', 'iluminacion', 'assets', 'freelance', 'hard', 'surface', 'escenas', 'composicion'],
    patterns: [
      '¿Qué haces en diseño 3D?',
      '¿Manejas Blender?',
      '¿Qué experiencia tienes en 3D?',
      '¿Haces modelado y renderizado?',
      '¿Qué programas de 3D utilizas?',
      'Experiencia como 3D Freelance',
      '¿Qué es tu portfolio 3D?',
      '¿Dónde puedo ver tus trabajos 3D?',
      '¿Qué sabes de hard-surface?',
    ],
    answer: `Llevo años haciendo trabajos y proyectos personales de **diseño 3D** como freelance, con **Blender** como herramienta principal:

- Modelado 3D y hard-surface, escenas, materiales, iluminación, composición y renderizado.
- Diseño de assets y recursos para proyectos digitales.
- Trabajo autónomo completo: interpretar una idea, investigar el resultado, desarrollar el proyecto y entregarlo.

Mi portfolio 3D está en **@jesujopi**. Mi interés por el 3D va muy ligado a los videojuegos y las experiencias digitales.`,
  },

  {
    id: 'videojuegos_unity_unreal',
    category: 'creativo',
    keywords: ['videojuegos', 'unity', 'unreal', 'engine', 'motor', 'gaming', 'juegos', 'universidad', 'universitarios', 'estudios', 'interactive', 'interactivos'],
    patterns: [
      '¿Sabes de videojuegos?',
      '¿Usas Unity o Unreal Engine?',
      '¿Qué experiencia tienes con motores de videojuegos?',
      '¿Has desarrollado videojuegos?',
      '¿Qué estudiaste de desarrollo de videojuegos?',
      'Desarrollo de videojuegos',
      '¿Te interesan Unity y Unreal?',
    ],
    answer: `Cursé estudios universitarios de **desarrollo de videojuegos** hasta segundo curso, con contacto con el desarrollo y los proyectos interactivos, la programación y la mezcla entre diseño y tecnología.

Me interesan tecnologías como **Unity y Unreal Engine**, y a largo plazo áreas como 3D Art, Environment Art, Technical Art, procedural, IA aplicada a videojuegos y experiencias inmersivas. Es la combinación que más me tira: **3D + programación + tecnología + IA**.`,
  },

  {
    id: 'ia_local_ollama',
    category: 'informatica',
    keywords: ['ia', 'inteligencia', 'artificial', 'automatizacion', 'ollama', 'local', 'llm', 'modelos', 'rag', 'cuantizacion', 'gpu', 'inferencia', 'multimodal', 'stt', 'tts', 'voz'],
    patterns: [
      '¿Cómo usas la IA local y Ollama?',
      '¿Qué sabes de inteligencia artificial?',
      '¿Trabajas con LLMs locales?',
      '¿Qué es RAG?',
      '¿Haces inferencia en GPU?',
      '¿Qué modelos de IA utilizas?',
      '¿Por qué te interesa tanto la inteligencia artificial?',
      'Automatización e IA',
    ],
    answer: `La IA es mi principal área de investigación. No solo uso modelos: investigo cómo integrarlos en sistemas completos:

- **LLMs locales** con Ollama, modelos de distintos tamaños, cuantización e inferencia en GPU.
- **RAG**, memoria persistente y bases de datos vectoriales y gráficas.
- **Voz**: STT, TTS, VAD y conversación en tiempo real.
- Modelos multimodales y arquitecturas híbridas local/cloud, corriendo en hardware de consumo.`,
  },

  {
    id: 'desarrollo_software',
    category: 'informatica',
    keywords: ['desarrollo', 'software', 'programacion', 'javascript', 'typescript', 'react', 'vite', 'tailwind', 'html', 'css', 'git', 'github', 'actions', 'terminal', 'cli', 'vscode', 'apis', 'frontend', 'backend', 'interfaces'],
    patterns: [
      '¿Qué lenguajes y herramientas de desarrollo usas?',
      '¿Programas en JavaScript?',
      '¿Sabes React?',
      '¿Qué stack de desarrollo manejas?',
      '¿Usas Git y GitHub?',
      '¿Haces desarrollo web?',
      '¿Qué es tu GitHub?',
      '¿Tienes proyectos de programación?',
    ],
    answer: `Aprendo programando proyectos propios. Mi stack habitual:

- **Frontend**: HTML, CSS, JavaScript, TypeScript, React, Vite y Tailwind CSS.
- **Herramientas**: Git, GitHub, GitHub Actions, Terminal, CLI y VS Code.
- **Backend / IA**: APIs, Ollama, LLMs, RAG, bases de datos y sistemas de agentes.

Mis experimentos están en **github.com/jesusjodar**. Me importan las interfaces con identidad visual, no solo funcionales.`,
  },

  {
    id: 'github_portfolio',
    category: 'contacto',
    keywords: ['github', 'jesusjodar', 'repositorios', 'codigo', 'portfolio3d', 'jesujopi', 'portfolio'],
    patterns: [
      '¿Tienes GitHub con proyectos?',
      '¿Dónde está tu GitHub?',
      '¿Qué hay en tu GitHub?',
      '¿Qué es tu portfolio 3D?',
      '¿Dónde veo tus trabajos 3D?',
    ],
    answer: `Mi GitHub es **github.com/jesusjodar**: proyectos y experimentos de programación, interfaces, automatización e IA. Es mi cuaderno de aprendizaje en público.

Mi portfolio de trabajos 3D está en **@jesujopi**.`,
  },

  {
    id: 'estudios_formacion',
    category: 'formacion',
    keywords: ['estudios', 'formacion', 'btec', 'esi', 'titulacion', 'diploma', 'distinction', 'creative', 'media', 'ifct0108', 'microinformaticos', 'montaje', 'universidad', 'videojuegos', 'autodidacta', 'aprender'],
    patterns: [
      '¿Cuál es tu formación?',
      '¿Qué has estudiado?',
      '¿Qué títulos tienes?',
      '¿Dónde estudiaste?',
      'Háblame de tu título BTEC',
      '¿Qué fue el IFCT0108?',
      '¿Qué estudiaste de desarrollo de videojuegos?',
      '¿Eres autodidacta?',
      '¿Cómo aprendes?',
    ],
    answer: `Mi formación mezcla titulación oficial con aprendizaje autodidacta permanente:

- **Creative Media** (Pearson BTEC International Level 3, con **Distinction**) en la Escuela Superior Internacional de Diseño de Murcia: medios creativos y producción digital.
- **IFCT0108** (octubre 2025 - enero 2026): montaje y mantenimiento de sistemas microinformáticos, con prácticas profesionales.
- **Desarrollo de videojuegos**: estudios universitarios hasta segundo curso.
- **Autodidacta**: sistemas, redes, programación e IA los aprendo investigando documentación, experimentando y construyendo proyectos propios.`,
  },

  {
    id: 'habilidades_blandas_personales',
    category: 'habilidades',
    keywords: ['habilidades', 'blandas', 'soft', 'skills', 'puntualidad', 'actitud', 'responsabilidad', 'orden', 'autonomia', 'equipo', 'trabajo', 'aprender', 'haciendo'],
    patterns: [
      '¿Cuáles son tus principales habilidades blandas?',
      '¿Cuáles son tus puntos fuertes?',
      '¿Cómo trabajas en equipo?',
      '¿Cómo trabajas y aprendes?',
      '¿Cómo te adaptas al cambio?',
      'Habilidades personales de Jesús',
      '¿Por qué deberíamos contratarte?',
      '¿Qué virtudes te definen como trabajador?',
    ],
    answer: `Mis principales fortalezas en el ámbito profesional son:

- **Aprender haciendo**: cuando aparece una tecnología nueva, investigo cómo funciona y construyo algo con ella.
- **Autonomía**: me desenvuelvo solo buscando información técnica, sin necesitar conocer la herramienta de antemano.
- **Perfil transversal**: paso de Blender a Linux, de un modelo de IA a una interfaz o a un problema de hardware.
- **Orden y compromiso**: cuido mi espacio, mis archivos y mis plazos, con trato cordial hacia el equipo.`,
  },

  {
    id: 'disponibilidad_e_incorporacion',
    category: 'disponibilidad',
    keywords: ['disponibilidad', 'incorporacion', 'inmediata', 'horario', 'trabajar', 'oportunidades', 'buscas', 'empleo'],
    patterns: [
      '¿Tienes disponibilidad?',
      '¿Estás disponible para trabajar?',
      '¿Qué buscas profesionalmente?',
      '¿Qué te interesa profesionalmente?',
      '¿Estás abierto a oportunidades?',
      'Disponibilidad para trabajar',
    ],
    answer: `Estoy abierto a oportunidades dentro de informática, sistemas, inteligencia artificial, automatización, desarrollo de software y diseño 3D, en un entorno donde pueda aportar y seguir creciendo.

Soy de **Murcia, España**. Escríbeme y hablamos: [jesusjodarpiernas@gmail.com](mailto:jesusjodarpiernas@gmail.com).`,
  },

  {
    id: 'contacto_contratacion',
    category: 'contacto',
    keywords: ['contacto', 'contactar', 'email', 'correo', 'telefono', 'movil', 'linkedin', 'github', 'hablar', 'entrevista', 'contratar', 'cv', 'curriculum'],
    patterns: [
      '¿Cómo puedo contactar con Jesús?',
      '¿Cuál es tu teléfono?',
      '¿Cuál es tu correo electrónico?',
      '¿Tienes perfil de LinkedIn?',
      '¿Tienes GitHub?',
      'Quiero hacerte una entrevista',
      '¿Cómo me pongo en contacto contigo?',
      'Contacto y datos de Jesús Jódar',
      '¿Dónde puedo enviarte una oferta de trabajo?',
      'Datos de contacto',
      '¿Cómo puedo contactar contigo?',
    ],
    answer: `Puedes ponerte en contacto conmigo por aquí:

- **Email**: [jesusjodarpiernas@gmail.com](mailto:jesusjodarpiernas@gmail.com)
- **Teléfono**: [623 175 760](tel:+34623175760)
- **LinkedIn**: [linkedin.com/in/jesujopi](https://linkedin.com/in/jesujopi/)
- **GitHub**: [github.com/jesusjodar](https://github.com/jesusjodar)
- **Ubicación**: Murcia, España

Estaré encantado de responderte y concertar una entrevista.`,
  },

  {
    id: 'saludo',
    category: 'social',
    keywords: ['hola', 'buenas', 'buenos', 'dias', 'tardes', 'noches', 'hey', 'que', 'tal', 'saludos'],
    patterns: [
      'Hola',
      'Buenas',
      'Buenos días',
      'Buenas tardes',
      'Buenas noches',
      'Hey',
      '¿Qué tal?',
      'Hola, ¿cómo estás?',
      'Hola Jesús',
      'Saludos',
    ],
    answer: `¡Hola! Me alegra saludarte. Soy **Jesús Jódar** y este es mi portfolio personal.

Puedes preguntarme sobre cualquiera de mis áreas:
- **Sistemas**: Windows, Linux, macOS, hardware y redes.
- **IA**: LLMs locales, Ollama, RAG, agentes y automatización.
- **Desarrollo**: JavaScript, React, GitHub y herramientas.
- **3D y videojuegos**: Blender, estudios de desarrollo y Unity/Unreal.
- **Experiencia**: Grupo Security y freelance 3D.
- **Formación**: BTEC con Distinction, IFCT0108 y desarrollo de videojuegos.
- **Contacto**: Email, teléfono, LinkedIn y GitHub.

¿Sobre qué te apetece que hablemos?`,
  },

  {
    id: 'despedida_agradecimiento',
    category: 'social',
    keywords: ['gracias', 'muchas', 'adios', 'chao', 'hasta', 'luego', 'perfecto', 'genial', 'excelente'],
    patterns: [
      'Muchas gracias',
      'Gracias por la información',
      'Adiós',
      'Hasta luego',
      'Chao',
      'Perfecto, gracias',
      'Genial, muchas gracias',
      'Muy amable',
    ],
    answer: `¡Muchas gracias a ti por tu interés y por dedicar un rato a conocerme!

Si quieres que hablemos sobre cualquier propuesta, estoy totalmente disponible:
- **Email**: [jesusjodarpiernas@gmail.com](mailto:jesusjodarpiernas@gmail.com)
- **Teléfono**: [623 175 760](tel:+34623175760)
- **LinkedIn**: [linkedin.com/in/jesujopi](https://linkedin.com/in/jesujopi/)
- **GitHub**: [github.com/jesusjodar](https://github.com/jesusjodar)`,
  },
]

export const FALLBACK_ANSWER = `No he podido entender con total precisión tu pregunta, pero puedo contarte cualquier detalle sobre:

- **Perfil**: Quién soy y a qué me dedico.
- **Sistemas**: Windows, Linux, macOS, hardware y redes.
- **IA**: LLMs locales, Ollama, RAG y agentes.
- **Desarrollo**: JavaScript, React, GitHub y herramientas.
- **3D y videojuegos**: Blender y desarrollo de videojuegos.
- **Experiencia**: Grupo Security y freelance 3D.
- **Formación**: BTEC con Distinction, IFCT0108 y videojuegos.
- **Contacto**: Mi correo ([jesusjodarpiernas@gmail.com](mailto:jesusjodarpiernas@gmail.com)) o [GitHub](https://github.com/jesusjodar).

¿Te gustaría que te cuente algo de esto en detalle?`
