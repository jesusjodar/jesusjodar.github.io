// Base de conocimiento exhaustiva con preguntas y respuestas prefabricadas en formato Markdown
// extraídas de los currículums (Informática, Diseño 3D, Comercio) y los 5 certificados oficiales SEF.

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
    answer: `**Jesús Jódar Piernas** (24 años, Murcia) es una persona versátil, responsable y con gran capacidad de aprendizaje autodidacta. Su perfil combina tres vertientes principales:

- **Informática y Sistemas**: Años configurando entornos **Windows** y **Linux**, montaje/reparación de hardware, diagnóstico de fallos e integración de **inteligencia artificial** y automatización.
- **Seguridad Electrónica**: Prácticas en **Grupo Security** (Lorca) trabajando con alarmas, videovigilancia **CCTV** y control de accesos en entornos reales.
- **Diseño 3D y Creatividad**: Artista 3D freelance con **Blender**, **Substance 3D**, **Photoshop** y **After Effects**, con proyectos de portadas musicales y motores como **Unity** y **Unreal Engine**.
- **Comercio y Atención al Cliente**: Trato directo con clientes, gestión de encargos, capacidad de reposición y disponibilidad completa e inmediata.

Además, cuenta con titulación **BTEC Level 3 con Distinction** en ESI Murcia y **5 certificados oficiales** del SEF en prevención de riesgos, comunicación, toma de decisiones y contabilidad.`,
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
    answer: `**Datos personales de Jesús:**
- **Edad**: 24 años.
- **Ubicación**: Región de Murcia, España (Calle La Mar 107).
- **Disponibilidad geográfica**: Murcia capital, Lorca, comarca y alrededores (abierto también a trabajo remoto o híbrido).
- **Vehículo / Movilidad**: Disponibilidad total de horarios e incorporación inmediata.`,
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
    answer: `Jesús cuenta con **años de experiencia práctica y autodidacta** configurando y administrando sistemas operativos:

- **Windows**:
  - Instalación limpia, particionado y optimización profunda del sistema.
  - Resolución de incidencias de registro, servicios, dependencias y conflictos de drivers.
  - Configuración de políticas locales, copias de seguridad y herramientas avanzadas de productividad.
- **Linux**:
  - Uso fluido de la **terminal** (Bash, gestión de paquetes, permisos, logs del sistema y automatización con scripts).
  - Experiencia en distribuciones populares (Ubuntu, Debian, Fedora, Arch) y entornos para desarrollo e investigación técnica.
  - Montaje de servidores locales, contenedores y entornos de software.`,
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
    answer: `En el área de **hardware y mantenimiento de equipos**, Jesús tiene conocimientos sólidos y experiencia práctica:

- **Montaje desde cero**: Ensamblaje completo de ordenadores de sobremesa (selección de componentes compatibles, montaje de placa base, CPU, disipador/refrigeración, memoria RAM, almacenamiento M.2 NVMe/SSD, tarjeta gráfica y gestión de cableado).
- **Diagnóstico y resolución de fallos**: Identificación de problemas de alimentación, sobrecalentamiento, módulos de memoria defectuosos, cuello de botella o errores POST/BIOS.
- **Mantenimiento preventivo y correctivo**: Limpieza física de componentes, renovación de pasta térmica, comprobación de ventilación y sustitución de piezas averiadas.`,
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
    answer: `Entre **enero y febrero de 2026**, Jesús realizó sus prácticas formativas en la empresa **Grupo Security** (Lorca, Murcia):

- **Sistemas Electrónicos de Seguridad**: Inspección, diagnóstico y apoyo en la reparación de equipos en instalaciones reales.
- **CCTV y Videovigilancia**: Verificación y revisión de cámaras de seguridad, cableado de red/coaxial y grabadores (DVR/NVR).
- **Alarmas y Sensores**: Comprobación de centrales de alarma, sensores volumétricos, detectores y avisadores.
- **Control de Accesos**: Apoyo en mantenimiento preventivo, comprobación de lectores y validación de sistemas en clientes residenciales y comerciales.`,
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
    answer: `Como **Artista 3D Freelance** desde julio de 2022 hasta la actualidad, Jesús desarrolla proyectos conceptuales y comerciales:

- **Modelado y Animación en Blender**: Creación de geometrías poligonales, iluminación cinemática, renderizado fotorrealista y estilizado (Cycles y Eevee), y animación de cámaras y objetos.
- **Texturizado con Adobe Substance 3D**: Generación de mapas PBR (albedo, roughness, metallic, normal) y materiales personalizados de alta calidad.
- **Portadas Musicales y Singles**: Especializado en arte visual y portadas 3D para artistas y productores musicales, encargándose de la dirección de arte y el acabado final.
- **Postproducción**: Retoque y composición final en **Photoshop** y **After Effects**.`,
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
    answer: `En el ámbito de los motores de tiempo real y desarrollo interactivo:

- **Unreal Engine**: Configuración de proyectos, iluminación con Lumen, materiales dinámicos, importación de assets FBX/GLTF optimizados y ensamblaje de escenas.
- **Unity**: Integración de modelos 3D con texturas PBR, configuración de cámaras, colisionadores y pipelines de renderizado (URP).
- **Optimización de Assets**: Conocimiento de topología limpia, LODs (niveles de detalle) y preparación de modelos desde Blender para videojuegos.`,
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
    answer: `En edición visual y postproducción:

- **Adobe Photoshop**: Retoque fotográfico, composición por capas, corrección de color, tipografía y diseño gráfico para portadas, cartelería y redes sociales.
- **Adobe After Effects**: Animación gráfica (*motion graphics*), efectos visuales, composición multipista, animación de tipografías y postproducción para piezas audiovisuales y bucles animados.
- **Pipeline creativo**: Integración fluida entre renders 3D de Blender y retoque final en la suite de Adobe.`,
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
    answer: `Jesús tiene **gran motivación, disponibilidad completa y excelente perfil** para puestos de comercio, tiendas y supermercados:

- **Atención al público y trato cercano**: Experiencia tratando directamente con clientes en su etapa freelance (gestión de expectativas, escucha activa, amabilidad, resolución de peticiones y cumplimiento de compromisos).
- **Reposición y almacén**: Capacidad de trabajo físico, organización ordenada de productos, control visual de stock y reposición eficiente en estantes.
- **Orden y limpieza**: Hábito de mantener el espacio de trabajo impecable, pulcro y estructurado.
- **Actitud**: Puntualidad rigurosa, seriedad, compañerismo y rapidez para aprender cualquier procedimiento interno de tienda o caja.
- **Disponibilidad**: Inmediata y completa para cualquier turno.`,
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
    answer: `A Jesús le entusiasma la **inteligencia artificial aplicada a la productividad y la automatización real**:

- **Aceleración de flujos de trabajo**: Integración de asistentes y modelos para resolver problemas técnicos, depurar configuraciones y generar contenido o código de apoyo.
- **Automatización de tareas repetitivas**: Creación de scripts y uso de herramientas para procesar archivos, renombrado por lotes, conversiones de formato y flujos optimizados.
- **Cultura tecnológica**: Seguimiento activo del ecosistema de modelos abiertos, herramientas locales y soluciones que marcan el estándar del software moderno.`,
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
    answer: `La formación oficial y trayectoria de aprendizaje de Jesús incluye:

- **Pearson BTEC International Level 3 Subsidiary Diploma in Creative Media** en la **Escuela Superior Internacional de Diseño de Murcia (ESI)** (2022 - 2023), graduado con **Grade with Distinction** (la máxima calificación de excelencia británica).
- **Graduado en Educación Secundaria Obligatoria (ESO)** en el Centro Privado de Enseñanza **Madre de Dios**.
- **Aprendizaje autodidacta continuo**: Todo su bagaje técnico en informática, sistemas operativos Windows/Linux, hardware, redes, IA y automatización lo ha forjado de forma autónoma investigando, montando laboratorios propios y resolviendo incidencias prácticas en entornos reales.`,
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
    answer: `Jesús ha completado **5 cursos oficiales acreditados** por el **Servicio Regional de Empleo y Formación (SEF)** y la **Fundación Integra** (a través de la plataforma form@carm, finalizados con aprovechamiento en octubre de 2025):

1. **Prevención de Riesgos Laborales en Oficinas y PVD** (10 h) - Código: *128_290742_1759822390*
2. **Técnicas de Comunicación** (15 h) - Código: *226_290742_1759314018*
3. **Análisis de Problemas y Toma de Decisiones** (20 h) - Código: *221_290742_1759391227*
4. **Contabilidad Básica** (15 h) - Código: *206_290742_1759826269*
5. **Presentaciones con Prezi** (15 h) - Código: *182_290742_1759480500*

Todos cuentan con código de verificación telemática de la Comunidad Autónoma de la Región de Murcia.`,
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
    answer: `Jesús completó el curso oficial de **Prevención de Riesgos Laborales en Oficinas y PVD** (10 horas, SEF y Fundación Integra, Octubre 2025):

- **Reglas de seguridad en oficinas**: Normas de higiene, prevención de accidentes, medidas ante incendios y pautas de primeros auxilios.
- **Puestos con Pantallas de Visualización de Datos (PVD)**: Ergonomía aplicada (altura e inclinación de pantalla, ajuste de silla y mesa, iluminación ambiental y descanso ocular).
- **Higiene postural**: Prevención de trastornos musculoesqueléticos, fatiga física y visual en jornadas ante el ordenador.`,
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
    answer: `Jesús cuenta con diploma oficial en **Técnicas de Comunicación** (15 horas, SEF y Fundación Integra, Octubre 2025):

- **Proceso de comunicación**: Comunicación verbal, no verbal, lenguaje corporal, escucha activa y gestión del *feedback*.
- **Comunicación empresarial**: Canales descendentes, ascendentes y horizontales, dinamización de reuniones y trabajo coordinado en grupo.
- **Comunicación telemática y telefónica**: Protocolos profesionales para llamadas telefónicas (fases de saludo, atención y despedida), redacción de correos electrónicos corporativos y videoconferencias.`,
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
    answer: `Jesús superó el curso oficial de **Análisis de Problemas y Toma de Decisiones** (20 horas, SEF y Fundación Integra, Octubre 2025):

- **Diagnóstico del problema**: Técnicas para definir el problema raíz distinguiéndolo de los síntomas superficiales.
- **Generación y selección de alternativas**: Desarrollo de opciones creativas, evaluación de impacto y riesgos, y elección razonada de la mejor estrategia.
- **Implantación y control**: Ejecución del plan de acción y superación de bloqueos o resistencias.
- **Toma de decisiones grupal**: Fomento de la creatividad compartida y el trabajo coordinado en equipo.`,
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
    answer: `Jesús tiene formación oficial en **Contabilidad Básica** (15 horas, SEF y Fundación Integra, Octubre 2025):

- **Patrimonio empresarial**: Comprensión del activo, pasivo y patrimonio neto.
- **Mecánica contable**: Principio de la partida doble, uso de cuentas, libro diario y registro de los asientos contables más frecuentes.
- **Ciclo contable y PGC**: Introducción al Plan General de Contabilidad y elaboración de balances de situación y cuentas de resultados.`,
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
    answer: `Jesús está diplomado en **Presentaciones con Prezi** (15 horas, SEF y Fundación Integra, Octubre 2025):

- **Diseño visual estructurado**: Jerarquía visual en mapas conceptuales dinámicos, creación de temas y subtemas navegables.
- **Multimedia y animación**: Inserción de vídeo, gráficos, elementos vectoriales e iconos con transiciones de zoom fluidas.
- **Presentaciones colaborativas**: Gestión en la nube, uso de Prezi Viewer y técnicas para captar la atención de la audiencia.`,
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
    answer: `**Competencia lingüística de Jesús:**
- **Español**: Idioma materno / nativo.
- **Inglés**: Nivel **avanzado** (lectura fluida de documentación técnica, manejo de software en inglés, titulación BTEC impartida con estándares internacionales y capacidad para interactuar en contextos profesionales).`,
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
    answer: `Entre los **puntos fuertes personales** de Jesús destacan:

- **Aprendizaje rápido y autonomía**: Habilidad natural para asimilar herramientas, sistemas o metodologías nuevas en poco tiempo.
- **Resolución práctica de problemas**: Enfoque pragmático orientado a buscar soluciones directas y eficaces.
- **Puntualidad y compromiso**: Respeto riguroso por los horarios, las fechas de entrega y los acuerdos establecidos.
- **Organización, orden y limpieza**: Esmero en mantener el puesto y los archivos ordenados y accesibles.
- **Buena actitud y compañerismo**: Trato cercano, facilidad para colaborar en equipo y apertura a recibir sugerencias y feedback constructivo.`,
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
    answer: `Jesús cuenta con **disponibilidad completa e incorporación inmediata**:

- **Horarios**: Abierto a jornada completa, media jornada, turnos rotativos o turnos de fin de semana.
- **Incorporación**: Inmediata, sin periodos de espera ni compromisos previos vigentes.
- **Modalidad**: Disponible tanto para trabajo **presencial** (Murcia, Lorca y cercanías) como para trabajo **híbrido o remoto**.`,
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
    answer: `Puedes comunicarte directamente con **Jesús Jódar** a través de cualquiera de estos canales:

- **Teléfono / WhatsApp**: [623 175 760](tel:+34623175760)
- **Email**: [jesusjodarpiernas@gmail.com](mailto:jesusjodarpiernas@gmail.com)
- **LinkedIn**: [linkedin.com/in/jesujopi](https://linkedin.com/in/jesujopi/)
- **Ubicación**: Murcia, España (Calle La Mar 107)

Estará encantado de concertar una entrevista o responder cualquier propuesta laboral.`,
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
    answer: `¡Hola! Soy el asistente interactivo del portfolio de **Jesús Jódar**.

Puedo responderte con todo detalle sobre su perfil. Pregúntame sobre:
- **Informática y Sistemas**: Experiencia con Windows, Linux, montaje y reparación de hardware.
- **Seguridad**: Sus prácticas en Grupo Security (alarmas, CCTV y control de accesos).
- **Diseño 3D y Videojuegos**: Blender, Substance 3D, Unreal Engine y portadas musicales.
- **Comercio y Tiendas**: Atención al cliente, reposición y disponibilidad.
- **Estudios y Certificados**: Su titulación BTEC con Distinction y sus 5 diplomas oficiales del SEF.
- **Contacto**: Teléfono, email y disponibilidad de contratación.

¿Qué te gustaría saber?`,
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
    answer: `¡De nada! Ha sido un placer ayudarte.

Si quieres conocer a Jesús en persona o hablar de una oportunidad profesional, puedes contactarle directamente en:
- **Email**: [jesusjodarpiernas@gmail.com](mailto:jesusjodarpiernas@gmail.com)
- **Teléfono**: [623 175 760](tel:+34623175760)
- **LinkedIn**: [linkedin.com/in/jesujopi](https://linkedin.com/in/jesujopi/)`,
  },
]

export const FALLBACK_ANSWER = `No he podido identificar con total certeza tu pregunta, pero puedo darte información completa sobre cualquiera de estas áreas de Jesús Jódar:

- **Sistemas y Hardware**: Windows, Linux, montaje y diagnóstico de PCs.
- **Seguridad Electrónica**: Prácticas en Grupo Security (CCTV, alarmas, control de accesos).
- **Diseño 3D y Creatividad**: Blender, Substance 3D, Unreal Engine y arte visual.
- **Comercio y Tiendas**: Reposición de mercancía, atención al cliente y orden.
- **Formación Oficial**: Pearson BTEC Distinction en ESI y 5 certificados oficiales SEF (PRL en oficinas, Comunicación, Toma de decisiones, Contabilidad y Prezi).
- **Contacto**: Teléfono (**623 175 760**), correo ([jesusjodarpiernas@gmail.com](mailto:jesusjodarpiernas@gmail.com)) y disponibilidad de incorporación inmediata.

¿Te gustaría preguntar sobre alguno de estos temas?`
