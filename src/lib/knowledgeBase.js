// Base de conocimiento exhaustiva con preguntas y respuestas en primera persona ("yo")
// redactadas directamente desde la voz de Jesús Jódar, sin incluir dirección postal,
// cubriendo Informática, Sistemas, Hardware, Seguridad, Diseño 3D, Comercio y Certificados SEF.

export const KNOWLEDGE_BASE = [
  {
    id: 'sobre_mi',
    category: 'perfil',
    keywords: ['jesus', 'jodar', 'quien', 'eres', 'perfil', 'resumen', 'presentate', 'cuentame', 'sobre', 'ti', 'conocer'],
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
    answer: `¡Hola! Soy **Jesús Jódar Piernas** (24 años, Murcia). Me considero una persona curiosa, responsable y con una marcada vocación técnica y creativa. Mi perfil se apoya en cuatro pilares:

- **Informática y Sistemas**: Llevo años configurando y optimizando entornos **Windows** y **Linux**, montando y diagnosticando hardware de PC, y experimentando con herramientas de **inteligencia artificial** y automatización de tareas.
- **Seguridad Electrónica**: Hice mis prácticas en **Grupo Security** (Lorca), trabajando con alarmas, circuitos cerrados de televisión (**CCTV**) y control de accesos en instalaciones reales.
- **Diseño 3D y Creatividad**: Como artista 3D freelance domino **Blender**, **Substance 3D**, **Photoshop** y **After Effects**, con proyectos de portadas musicales y entornos en motores como **Unreal Engine** y **Unity**.
- **Comercio y Atención al Cliente**: Sé tratar con el público de forma cercana, resolver peticiones bajo presión, organizar productos y cuidar el orden y la reposición.

Cuento con titulación oficial británica **Pearson BTEC Level 3 con Distinction** en ESI Murcia y **5 certificados oficiales** del SEF en prevención de riesgos, comunicación, toma de decisiones y contabilidad.`,
  },

  {
    id: 'edad_y_personal',
    category: 'personal',
    keywords: ['edad', 'anos', 'cumpleanos', 'donde', 'vives', 'residencia', 'murcia', 'lorca', 'ciudad', 'nacimiento', 'personal'],
    patterns: [
      '¿Cuántos años tienes?',
      '¿Qué edad tienes?',
      '¿Dónde vives?',
      '¿De dónde eres?',
      '¿En qué ciudad resides?',
      '¿Vives en Murcia?',
      '¿Cuál es tu lugar de residencia?',
      'Datos personales',
      '¿Dónde naciste?',
      '¿Dónde estás ubicado?',
      '¿Cuál es tu dirección?',
    ],
    answer: `Tengo **24 años** y vivo en la **Región de Murcia**, España.

Tengo total movilidad y disponibilidad para trabajar de forma presencial en **Murcia capital, Lorca y alrededores**, así como en modalidades **híbridas o en remoto**. Cuento con disponibilidad completa e inmediata para incorporarme.`,
  },

  {
    id: 'sistemas_windows_linux',
    category: 'informatica',
    keywords: ['sistemas', 'windows', 'linux', 'so', 'distros', 'ubuntu', 'debian', 'servicios', 'terminal', 'bash', 'drivers', 'instalacion', 'configuracion', 'utilidades'],
    patterns: [
      '¿Qué sabes hacer con Windows y Linux?',
      'Cuéntame sobre tu experiencia con sistemas',
      '¿Qué experiencia tienes en sistemas operativos?',
      '¿Sabes usar Linux?',
      '¿Qué nivel tienes en Windows?',
      '¿Manejas la terminal de Linux?',
      '¿Qué distribuciones de Linux has usado?',
      '¿Cómo trabajas con Windows y Linux?',
      'Instalación y configuración de sistemas',
      'Gestión de drivers y utilidades avanzadas',
      '¿Qué utilidades de sistema sueles utilizar?',
      '¿Has administrado entornos Windows o Linux?',
      '¿Tienes experiencia con servidores o sistemas?',
    ],
    answer: `Tengo una trayectoria continuada y autodidacta administrando y optimizando ambos entornos:

- **Windows**:
  - Realizo instalaciones limpias, particionados avanzados, clonación de discos y optimización fina de rendimiento y servicios.
  - Resuelvo fallos de dependencias, registros, conflictos de controladores (drivers) e incompatibilidades de software.
  - Configuro directivas locales, políticas de seguridad básica y copias de seguridad automatizadas.
- **Linux**:
  - Utilizo la **terminal (Bash)** con total naturalidad para administración de archivos, gestión de paquetes (APT, Pacman, etc.), permisos chmod/chown y análisis de registros (logs).
  - Experiencia en distribuciones como **Ubuntu, Debian, Fedora y Arch Linux**, configurando servicios locales y entornos de pruebas.
  - Automatizo tareas habituales mediante scripts para ganar agilidad y reproducibilidad.`,
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
    answer: `Realicé mis prácticas de empresa en **Grupo Security** (Lorca) entre enero y febrero de 2026, interviniendo en sistemas de seguridad reales:

- **Videovigilancia y CCTV**: Revisión y conexionado de cámaras de seguridad (tanto IP sobre cable de red como analógicas coaxiales), direccionamiento en red y comprobación de grabadores (DVR / NVR).
- **Sistemas de Alarma**: Comprobación de centrales, sustitución y prueba de sensores volumétricos de movimiento, detectores magnéticos de apertura y sirenas.
- **Control de Accesos**: Mantenimiento preventivo de lectores y módulos de control en instalaciones de clientes particulares y comerciales.
- **Resolución técnica en campo**: Diagnóstico de averías eléctricas simples, comprobación de continuidades con polímetro y asistencia directa a los técnicos titulares en obra.`,
  },

  {
    id: 'diseno_3d_blender',
    category: 'creativo',
    keywords: ['3d', 'blender', 'substance', 'modelado', 'render', 'texturizado', 'portadas', 'musica', 'albums', 'singles', 'freelance', 'animacion', 'cycles', 'eevee'],
    patterns: [
      '¿Qué haces en diseño 3D?',
      '¿Manejas Blender?',
      '¿Qué experiencia tienes en 3D?',
      'Cuéntame sobre tu trabajo como artista 3D',
      '¿Haces modelado y renderizado?',
      '¿Qué programas de 3D utilizas?',
      '¿Has hecho portadas musicales en 3D?',
      '¿Usas Substance Painter?',
      '¿Haces texturizado y animación?',
      'Experiencia como 3D Freelance',
      '¿Desde cuándo haces 3D?',
      '¿Qué estilo de 3D trabajas?',
    ],
    answer: `Trabajo como **Artista 3D Freelance** desde julio de 2022, desarrollando encargos visuales para proyectos comerciales y musicales:

- **Blender**: Modelado poligonal, iluminación cinemática, composición de escenas, sombreadores de nodos y renders de alta calidad en motores **Cycles** y **Eevee**.
- **Adobe Substance 3D**: Pintado y texturizado procedural de materiales PBR realistas (albedo, roughness, metallic, normal maps).
- **Portadas Musicales y Singles**: He colaborado con artistas y productores diseñando portadas con identidad visual única, cuidando tipografía, color y atmósfera.
- **Postproducción**: Retoque final, grading y acabado estético en Photoshop y After Effects.`,
  },

  {
    id: 'videojuegos_unity_unreal',
    category: 'creativo',
    keywords: ['videojuegos', 'unity', 'unreal', 'engine', 'motor', 'gaming', 'juegos', 'shaders', 'assets', 'entornos', 'level', 'design'],
    patterns: [
      '¿Sabes de videojuegos?',
      '¿Usas Unity o Unreal Engine?',
      '¿Qué experiencia tienes con motores de videojuegos?',
      '¿Has desarrollado videojuegos?',
      '¿Sabes integrar assets 3D en Unreal o Unity?',
      'Desarrollo de videojuegos',
      '¿Qué sabes hacer en Unreal Engine?',
      '¿Qué sabes hacer en Unity?',
      'Creación de entornos interactivos 3D',
    ],
    answer: `Tengo formación práctica en motores de tiempo real para videojuegos y entornos interactivos:

- **Unreal Engine**: Importación y optimización de mallas y texturas, configuración de iluminación global dinámica con **Lumen**, materiales y montaje de entornos cinemáticos.
- **Unity**: Integración de assets con texturas PBR, organización jerárquica de prefabs, colisiones y configuración de cámaras y pipelines de renderizado (URP).
- **Optimización de Assets**: Aplico topología limpia con bajo conteo poligonal cuando el rendimiento lo exige, horneado de mapas de normales (baking) y preparación de modelos para tiempo real.`,
  },

  {
    id: 'edicion_video_photoshop_aftereffects',
    category: 'creativo',
    keywords: ['photoshop', 'after', 'effects', 'video', 'edicion', 'postproduccion', 'diseno', 'grafico', 'adobe', 'motion', 'composicion'],
    patterns: [
      '¿Sabes editar vídeo?',
      '¿Qué programas de Adobe utilizas?',
      '¿Manejas Photoshop y After Effects?',
      '¿Haces diseño gráfico o edición visual?',
      'Composición y postproducción de imagen y vídeo',
      '¿Sabes hacer animaciones 2D o motion graphics?',
      '¿Qué herramientas de diseño gráfico dominas?',
    ],
    answer: `Utilizo las herramientas de Adobe como parte esencial de mi flujo visual:

- **Adobe Photoshop**: Retoque avanzado de imagen, fotocomposición por capas, tratamiento de color, máscaras complejas y diseño tipográfico para portadas o material promocional.
- **Adobe After Effects**: Animación de grafismos (*motion design*), efectos visuales, montaje multipista y generación de bucles animados o visualizers para audio.
- Integración ágil entre renderizados 3D y postproducción digital para conseguir acabados profesionales.`,
  },

  {
    id: 'comercio_supermercado_reposicion',
    category: 'comercio',
    keywords: ['comercio', 'supermercado', 'tienda', 'reposicion', 'reponedor', 'caja', 'cajero', 'publico', 'atencion', 'cliente', 'almacen', 'orden', 'limpieza', 'puntualidad'],
    patterns: [
      '¿Tienes experiencia en comercio o tiendas?',
      '¿Te interesa trabajar en un supermercado o tienda?',
      '¿Puedes trabajar como reponedor o en atención al cliente?',
      '¿Qué experiencia tienes de cara al público?',
      'Trabajo en comercio y supermercados',
      '¿Sabes tratar con clientes?',
      'Reposición de productos y orden en tienda',
      '¿Estás dispuesto a trabajar en comercio?',
      'Habilidades para atención al cliente y ventas',
      '¿Por qué te gustaría trabajar en comercio o supermercados?',
    ],
    answer: `Tengo total disposición, energía y excelentes aptitudes para trabajar en puestos de comercio, tiendas y supermercados:

- **Atención al público y amabilidad**: Mi experiencia tratando directamente con clientes freelance me ha enseñado a escuchar con atención, resolver dudas con simpatía y mantener la calma ante cualquier imprevisto.
- **Reposición y orden**: Me desenvuelvo con soltura en labores físicas de descarga, control visual de stock, colocación ordenada de productos en estantes y rotación de fechas de caducidad (criterio FIFO).
- **Cuidado del espacio**: Doy máxima prioridad a mantener pasillos y lineales despejados, limpios y presentables para facilitar la compra del cliente.
- **Compromiso**: Puntualidad rigurosa, rapidez para aprender la operativa interna de caja o tienda y ganas de sumar en el equipo.`,
  },

  {
    id: 'ia_automatizacion',
    category: 'informatica',
    keywords: ['ia', 'inteligencia', 'artificial', 'automatizacion', 'scripts', 'productividad', 'modelos', 'llm', 'prompts', 'tecnologia', 'moderna'],
    patterns: [
      '¿Qué te gusta de la IA y la automatización?',
      '¿Cómo utilizas la inteligencia artificial?',
      '¿Qué sabes hacer con IA?',
      '¿Tienes experiencia en automatización de procesos?',
      '¿Qué herramientas de IA utilizas en tu día a día?',
      'Automatización y productividad',
      '¿Por qué te interesa tanto la inteligencia artificial?',
      '¿Qué proyectos o flujos de IA has probado?',
    ],
    answer: `Me apasiona cómo la **inteligencia artificial** y la automatización pueden multiplicar la productividad del día a día:

- **Aceleración técnica**: Utilizo modelos avanzados como asistentes para depurar código, estructurar documentación, redactar scripts y resolver incidencias de configuración de forma ágil.
- **Automatización**: Desarrollo scripts para tareas repetitivas de archivos (renombrado masivo, conversiones de formato, procesado de datos en lote y sincronización).
- **Entornos locales**: Me mantengo al día con modelos abiertos, ejecución local y herramientas de asistencia que optimizan el trabajo técnico sin fricción.`,
  },

  {
    id: 'estudios_btec_esi',
    category: 'formacion',
    keywords: ['estudios', 'formacion', 'btec', 'esi', 'titulacion', 'diploma', 'distinction', 'creative', 'media', 'madre', 'dios', 'eso', 'colegio', 'instituto', 'academica'],
    patterns: [
      '¿Cuál es tu formación y cómo aprendes?',
      '¿Qué has estudiado?',
      '¿Qué títulos tienes?',
      '¿Dónde estudiaste?',
      'Háblame de tu título BTEC',
      '¿Qué es el BTEC que tienes?',
      '¿Estudiaste en ESI Murcia?',
      '¿Tienes la ESO?',
      '¿Qué nivel de estudios tienes?',
      '¿Cómo has aprendido informática y 3D?',
      '¿Eres autodidacta?',
    ],
    answer: `Mi formación combina titulación oficial reglada con un aprendizaje autodidacta permanente:

- **Pearson BTEC International Level 3 Subsidiary Diploma in Creative Media** en la **Escuela Superior Internacional de Diseño de Murcia (ESI)** (2022 - 2023), donde me gradué con **Grade with Distinction** (la calificación británica más alta posible).
- **Educación Secundaria Obligatoria (ESO)** en el Colegio **Madre de Dios**.
- **Perfil autodidacta**: Todo lo referente a administración de sistemas (Windows/Linux), montaje de ordenadores, diagnóstico hardware, redes y programación lo he aprendido por iniciativa propia, montando mis propios equipos y resolviendo problemas técnicos reales día a día.`,
  },

  {
    id: 'cursos_certificados_sef',
    category: 'certificados',
    keywords: ['certificados', 'cursos', 'diplomas', 'sef', 'carm', 'integra', 'formacarm', 'titulos', 'oficiales', 'formacion', 'complementaria'],
    patterns: [
      '¿Qué certificados o cursos tienes?',
      '¿Qué cursos has hecho en el SEF?',
      '¿Tienes diplomas oficiales?',
      'Háblame de tus cursos de Formacarm y Fundación Integra',
      '¿Qué formación complementaria tienes?',
      'Cursos certificados del Servicio Regional de Empleo',
      '¿Cuáles son tus diplomas?',
      '¿Tienes formación acreditada?',
    ],
    answer: `He completado **5 cursos oficiales certificados** por el **Servicio Regional de Empleo y Formación (SEF)** y la **Fundación Integra** (a través de Form@carm, finalizados en octubre de 2025):

1. **Prevención de Riesgos Laborales en Oficinas y PVD** (10 h) - Ref: *128_290742_1759822390*
2. **Técnicas de Comunicación** (15 h) - Ref: *226_290742_1759314018*
3. **Análisis de Problemas y Toma de Decisiones** (20 h) - Ref: *221_290742_1759391227*
4. **Contabilidad Básica** (15 h) - Ref: *206_290742_1759826269*
5. **Presentaciones con Prezi** (15 h) - Ref: *182_290742_1759480500*

Todos cuentan con código oficial de verificación telemática de la Comunidad Autónoma de la Región de Murcia.`,
  },

  {
    id: 'curso_prl_oficinas',
    category: 'certificados',
    keywords: ['prl', 'riesgos', 'laborales', 'oficinas', 'pvd', 'pantallas', 'ergonomia', 'postura', 'primeros', 'auxilios', 'incendios', 'seguridad'],
    patterns: [
      '¿Tienes formación en Prevención de Riesgos Laborales?',
      '¿Qué sabes de PRL en oficinas y PVD?',
      'Háblame del curso de Prevención de Riesgos',
      '¿Qué aprendiste sobre pantallas y ergonomía?',
      'Prevención de riesgos y seguridad laboral',
      '¿Sabes de primeros auxilios y emergencias en oficina?',
      'Higiene postural en puestos informáticos',
    ],
    answer: `Completé el curso oficial de **Prevención de Riesgos Laborales en Oficinas y PVD** (10 h, SEF y Fundación Integra):

- **Seguridad en oficinas**: Normas de orden y limpieza, pautas de evacuación ante conatos de incendio y nociones de primeros auxilios.
- **Pantallas de Visualización de Datos (PVD)**: Ajuste ergonómico del puesto (distancia y altura del monitor, posición del teclado, iluminación adecuada y pausas activas para la vista).
- **Higiene postural**: Prevención de molestias cervicales, lumbares y síndrome del túnel carpiano mediante posturas correctas frente al ordenador.`,
  },

  {
    id: 'curso_comunicacion',
    category: 'certificados',
    keywords: ['comunicacion', 'tecnicas', 'verbal', 'no verbal', 'escucha', 'activa', 'feedback', 'telefono', 'llamadas', 'reuniones', 'empresarial'],
    patterns: [
      '¿Qué sabes de técnicas de comunicación?',
      'Háblame de tu formación en comunicación',
      '¿Cómo te comunicas en el trabajo?',
      '¿Sabes atender el teléfono profesionalmente?',
      'Comunicación en la empresa y trabajo en equipo',
      'Escucha activa y feedback',
      '¿Qué aprendiste en el curso de Técnicas de Comunicación?',
    ],
    answer: `Tengo diploma oficial en **Técnicas de Comunicación** (15 h, SEF y Fundación Integra):

- **Habilidades comunicativas**: Práctica de la escucha activa, interpretación del lenguaje no verbal, claridad en la exposición y retroalimentación (*feedback*) constructiva.
- **Comunicación corporativa**: Dinámica de reuniones productivas, trabajo en equipo y coordinación entre departamentos.
- **Protocolos profesionales**: Atención telefónica correcta (saludo formal, toma de notas precisas y despedida profesional), redacción clara de correos y comunicación telemática.`,
  },

  {
    id: 'curso_toma_decisiones',
    category: 'certificados',
    keywords: ['problemas', 'decisiones', 'toma', 'analisis', 'soluciones', 'resolutivo', 'creatividad', 'grupo'],
    patterns: [
      '¿Cómo tomas decisiones o resuelves problemas?',
      'Háblame del curso de Análisis de Problemas y Toma de Decisiones',
      '¿Cómo actúas ante un problema inesperado?',
      'Metodología para solucionar problemas',
      'Creatividad y toma de decisiones en equipo',
      '¿Qué aprendiste en el curso de toma de decisiones?',
    ],
    answer: `Completé el curso oficial de **Análisis de Problemas y Toma de Decisiones** (20 h, SEF y Fundación Integra):

- **Detección de la causa raíz**: Metodologías para separar las causas de fondo de los síntomas superficiales antes de precipitarse.
- **Valoración de opciones**: Generación de alternativas creativas, análisis objetivo de riesgos y consecuencias de cada decisión.
- **Planes de acción**: Puesta en marcha estructurada, seguimiento y capacidad de adaptación cuando las circunstancias cambian.
- **Decisiones en grupo**: Técnicas para consensuar soluciones en equipo aportando valor sin generar conflictos.`,
  },

  {
    id: 'curso_contabilidad',
    category: 'certificados',
    keywords: ['contabilidad', 'balance', 'asientos', 'partida', 'doble', 'pgc', 'patrimonio', 'cuentas', 'facturas', 'finanzas'],
    patterns: [
      '¿Sabes algo de contabilidad?',
      'Háblame de tu curso de Contabilidad Básica',
      '¿Qué conocimientos tienes de cuentas o finanzas?',
      '¿Conoces la partida doble o el Plan General Contable?',
      '¿Sabes hacer asientos contables?',
      '¿Qué viste en el curso de Contabilidad Básica?',
    ],
    answer: `Cuento con formación acreditada en **Contabilidad Básica** (15 h, SEF y Fundación Integra):

- **Estructura patrimonial**: Comprensión del activo, pasivo y patrimonio neto de una empresa.
- **Mecánica contable**: Principio de partida doble, funcionamiento de cuentas, libro diario y registro de operaciones habituales de compras, ventas y cobros.
- **Plan General Contable**: Estructura de balances de situación y cuentas de pérdidas y ganancias.`,
  },

  {
    id: 'curso_prezi',
    category: 'certificados',
    keywords: ['prezi', 'presentaciones', 'diapositivas', 'visual', 'interactivo', 'animaciones', 'exposicion'],
    patterns: [
      '¿Sabes usar Prezi?',
      'Háblame de tu curso de Presentaciones con Prezi',
      '¿Cómo preparas una presentación profesional?',
      '¿Qué herramientas de presentaciones dominas?',
      'Presentaciones interactivas en Prezi',
    ],
    answer: `Tengo certificación oficial en **Presentaciones con Prezi** (15 h, SEF y Fundación Integra):

- **Narrativa visual**: Estructuración del mensaje mediante mapas conceptuales navegables en lugar de diapositivas estáticas.
- **Elementos dinámicos**: Inserción de gráficos interactivos, vídeos, iconos vectoriales y animaciones de zoom bien dosificadas para mantener la atención.
- **Uso profesional**: Creación de presentaciones corporativas compartidas en la nube y optimizadas para exposiciones en público.`,
  },

  {
    id: 'idiomas',
    category: 'habilidades',
    keywords: ['idiomas', 'ingles', 'espanol', 'lenguas', 'english', 'spanish', 'hablas', 'nivel'],
    patterns: [
      '¿Qué idiomas hablas?',
      '¿Qué nivel de inglés tienes?',
      '¿Hablas inglés?',
      '¿Cuál es tu nivel de idiomas?',
      '¿Puedes comunicarte en inglés?',
      'Nivel de inglés y español',
    ],
    answer: `Mis competencias lingüísticas son:

- **Español**: Lengua materna.
- **Inglés**: Nivel **avanzado**. Leo con total fluidez manuales técnicos, librerías y documentación en inglés, utilizo software y sistemas íntegramente en inglés, y mi titulación BTEC fue evaluada bajo estándares académicos británicos.`,
  },

  {
    id: 'habilidades_blandas_personales',
    category: 'habilidades',
    keywords: ['habilidades', 'blandas', 'soft', 'skills', 'puntualidad', 'actitud', 'responsabilidad', 'orden', 'autonomia', 'equipo', 'trabajo'],
    patterns: [
      '¿Cuáles son tus principales habilidades blandas?',
      '¿Cuáles son tus puntos fuertes?',
      '¿Cómo trabajas en equipo?',
      '¿Eres puntual y responsable?',
      '¿Cómo te adaptas al cambio?',
      'Habilidades personales de Jesús',
      '¿Por qué deberíamos contratarte?',
      '¿Qué virtudes te definen como trabajador?',
    ],
    answer: `Mis principales fortalezas en el ámbito profesional son:

- **Curiosidad y aprendizaje rápido**: Asimilo herramientas nuevas, normativas internas y flujos de trabajo con gran rapidez y sin necesitar supervisión continua.
- **Pragmatismo**: Me concentro en resolver incidencias de raíz buscando la solución más limpia y eficaz.
- **Puntualidad y formalidad**: Máximo respeto por los compromisos, los horarios de llegada y los plazos de entrega pactados.
- **Orden**: Cuido meticulosamente el orden de mi espacio de trabajo, los componentes y los archivos digitales.
- **Cercanía y compañerismo**: Mantengo un trato cordial y constructivo con mis compañeros, con predisposición siempre a ayudar y aprender del equipo.`,
  },

  {
    id: 'disponibilidad_e_incorporacion',
    category: 'disponibilidad',
    keywords: ['disponibilidad', 'incorporacion', 'inmediata', 'horario', 'turnos', 'jornada', 'completa', 'manana', 'tarde', 'finde', 'trabajar'],
    patterns: [
      '¿Cuándo podrías incorporarte?',
      '¿Tienes disponibilidad inmediata?',
      '¿Qué disponibilidad horaria tienes?',
      '¿Puedes trabajar a jornada completa?',
      '¿Trabajarías por turnos o fines de semana?',
      '¿Estás disponible para empezar ya?',
      'Disponibilidad para trabajar',
      '¿Qué tipo de jornada buscas?',
    ],
    answer: `Tengo **disponibilidad completa e incorporación inmediata**:

- **Horarios**: Totalmente flexible para adaptarme a jornada completa, media jornada, turnos rotativos, mañanas, tardes o fines de semana.
- **Fecha de inicio**: Puedo incorporarme desde el momento en que se acuerde, sin compromisos previos pendientes.
- **Modalidad**: Disponible para trabajo presencial en **Murcia y cercanías**, o bien en formato híbrido y en remoto.`,
  },

  {
    id: 'contacto_contratacion',
    category: 'contacto',
    keywords: ['contacto', 'contactar', 'email', 'correo', 'telefono', 'movil', 'linkedin', 'hablar', 'entrevista', 'contratar', 'cv', 'curriculum'],
    patterns: [
      '¿Cómo puedo contactar con Jesús?',
      '¿Cuál es tu teléfono?',
      '¿Cuál es tu correo electrónico?',
      '¿Tienes perfil de LinkedIn?',
      'Quiero hacerte una entrevista',
      '¿Cómo me pongo en contacto contigo?',
      'Contacto y datos de Jesús Jódar',
      '¿Dónde puedo enviarte una oferta de trabajo?',
      'Datos de contacto',
    ],
    answer: `Puedes ponerte en contacto conmigo a través de cualquiera de estos canales directos:

- **Teléfono / WhatsApp**: [623 175 760](tel:+34623175760)
- **Email**: [jesusjodarpiernas@gmail.com](mailto:jesusjodarpiernas@gmail.com)
- **LinkedIn**: [linkedin.com/in/jesujopi](https://linkedin.com/in/jesujopi/)
- **Ubicación**: Región de Murcia, España

Estaré encantado de responderte, comentar cualquier detalle de mi perfil o concertar una entrevista.`,
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
- **Informática y Sistemas**: Windows, Linux, montaje y reparación de hardware de PC.
- **Seguridad Electrónica**: Prácticas en Grupo Security (alarmas, cámaras CCTV y accesos).
- **Diseño 3D y Videojuegos**: Blender, Substance 3D, Unreal Engine y portadas musicales.
- **Comercio y Tiendas**: Atención al cliente, reposición y orden en tienda.
- **Formación**: Diploma BTEC con Distinction y mis 5 certificados del SEF.
- **Disponibilidad y Contacto**: Incorporación inmediata y canales para hablar.

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

Si quieres que hablemos sobre cualquier puesto o propuesta laboral, estoy totalmente disponible:
- **Email**: [jesusjodarpiernas@gmail.com](mailto:jesusjodarpiernas@gmail.com)
- **Teléfono**: [623 175 760](tel:+34623175760)
- **LinkedIn**: [linkedin.com/in/jesujopi](https://linkedin.com/in/jesujopi/)`,
  },
]

export const FALLBACK_ANSWER = `No he podido entender con total precisión tu pregunta, pero puedo contarte cualquier detalle sobre:

- **Sistemas y Hardware**: Mi experiencia con Windows, Linux y montaje de ordenadores.
- **Seguridad**: Mis prácticas en Grupo Security con alarmas y CCTV.
- **Diseño 3D**: Modelado en Blender, texturizado en Substance y motores como Unreal.
- **Comercio**: Reposición, almacén y atención directa a clientes.
- **Certificados**: Mis 5 diplomas oficiales del SEF y mi titulación BTEC Distinction.
- **Contacto**: Mi teléfono (**623 175 760**) o correo ([jesusjodarpiernas@gmail.com](mailto:jesusjodarpiernas@gmail.com)).

¿Te gustaría que te cuente algo de esto en detalle?`
