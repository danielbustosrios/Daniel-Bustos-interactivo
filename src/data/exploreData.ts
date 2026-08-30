import { ExploreResource } from '../types';

export const exploreSimulationsData: ExploreResource[] = [
  // 1. Universo y planetas
  {
    id: 'nasa-eyes-solar-system',
    title: 'NASA — Eyes on the Solar System',
    subtitle: 'Simulación tridimensional del Sistema Solar en tiempo real',
    description: 'Explora planetas, lunas y misiones en una experiencia interactiva del sistema solar.',
    category: 'Universo y planetas',
    provider: 'NASA (Jet Propulsion Laboratory)',
    language: 'Inglés / Visual interactivo',
    url: 'https://eyes.nasa.gov/apps/solar-system/',
    featured: true,
    featuredOrder: 1,
    featuredTheme: 'universo',
    type: 'external',
    tags: ['Astronomía', 'Sistema Solar', '3D', 'NASA', 'Órbitas', 'Exploración Espacial'],
    suggestedQuestion: '¿Cómo varían las velocidades orbitales de los planetas interiores frente a los gigantes gaseosos más lejanos?'
  },

  // 2. Movimiento y funciones
  {
    id: 'phet-movimiento-proyectiles',
    title: 'Movimiento de proyectiles',
    subtitle: 'Cinemática parabólica y resistencia del aire',
    description: 'Cambia el ángulo y la velocidad de lanzamiento y descubre cómo se transforma la trayectoria.',
    category: 'Movimiento y funciones',
    provider: 'PhET Interactive Simulations (University of Colorado Boulder)',
    language: 'Español',
    url: 'https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_es.html',
    suggestedQuestion: '¿Cómo alcanzarías el mismo objetivo con dos lanzamientos diferentes?',
    featured: true,
    featuredOrder: 2,
    featuredTheme: 'movimiento',
    type: 'external',
    tags: ['Cinemática', 'Tiro Parabólico', 'Física', 'PhET', 'Vectores de Velocidad']
  },
  {
    id: 'phet-graficando-cuadraticas',
    title: 'Graficando cuadráticas',
    subtitle: 'Exploración interactiva de parábolas y coeficientes polinómicos',
    description: 'Modifica los coeficientes de una función cuadrática y observa cómo cambia su parábola.',
    category: 'Movimiento y funciones',
    provider: 'PhET Interactive Simulations (University of Colorado Boulder)',
    language: 'Español',
    url: 'https://phet.colorado.edu/sims/html/graphing-quadratics/latest/graphing-quadratics_es.html',
    suggestedQuestion: '¿Qué ocurre cuando cambias el signo del coeficiente de x²?',
    featured: false,
    type: 'external',
    tags: ['Álgebra', 'Funciones Cuadráticas', 'Parábolas', 'Vértice y Raíces', 'PhET']
  },
  {
    id: 'phet-tour-trigonometrico',
    title: 'Tour trigonométrico',
    subtitle: 'Círculo unitario, ángulos y ondas sinusoidales',
    description: 'Explora la relación entre el movimiento circular, los ángulos y las funciones trigonométricas.',
    category: 'Movimiento y funciones',
    provider: 'PhET Interactive Simulations (University of Colorado Boulder)',
    language: 'Español',
    url: 'https://phet.colorado.edu/sims/html/trig-tour/latest/trig-tour_es.html',
    suggestedQuestion: '¿Cómo se proyecta la coordenada vertical de un punto en la circunferencia para generar la curva del seno?',
    featured: false,
    type: 'external',
    tags: ['Trigonometría', 'Círculo Unitario', 'Seno y Coseno', 'Radianes', 'PhET']
  },
  {
    id: 'desmos-galeria-3d-calculadora',
    title: 'Galería 3D y Calculadora 3D — Desmos',
    subtitle: 'Visualización y modelado de curvas y superficies en el espacio',
    description: 'Descubre curvas y superficies en tres dimensiones y experimenta con sus ecuaciones.',
    category: 'Movimiento y funciones',
    provider: 'Desmos Studio',
    language: 'Español',
    url: 'https://www.desmos.com/art-3d',
    secondaryUrl: {
      label: 'Calculadora 3D en español',
      url: 'https://www.desmos.com/3d?lang=es'
    },
    suggestedQuestion: '¿Qué formas geométricas tridimensionales resultan de combinar funciones trigonométricas con planos?',
    featured: false,
    type: 'external',
    tags: ['Geometría 3D', 'Superficies', 'Cálculo Multivariable', 'Desmos', 'Ecuaciones Paramétricas']
  },

  // 3. Estadística y probabilidad
  {
    id: 'phet-probabilidad-plinko',
    title: 'Probabilidad Plinko',
    subtitle: 'Tablero de Galton y emergencia de la distribución normal',
    description: 'Observa cómo las bolitas que caen al azar van construyendo una distribución.',
    category: 'Estadística y probabilidad',
    provider: 'PhET Interactive Simulations (University of Colorado Boulder)',
    language: 'Español',
    url: 'https://phet.colorado.edu/sims/html/plinko-probability/latest/plinko-probability_es.html',
    suggestedQuestion: '¿Qué cambia al comparar 10 lanzamientos con 1.000?',
    featured: false,
    type: 'external',
    tags: ['Probabilidad', 'Distribución Normal', 'Campana de Gauss', 'Tablero de Galton', 'PhET']
  },
  {
    id: 'seeing-theory-brown',
    title: 'Viendo la Teoría (Seeing Theory)',
    subtitle: 'Introducción visual e intuitiva a la probabilidad y la inferencia estadística',
    description: 'Una introducción visual e interactiva a la probabilidad y la estadística.',
    category: 'Estadística y probabilidad',
    provider: 'Seeing Theory (Brown University)',
    language: 'Español / Multilingüe',
    url: 'https://seeing-theory.brown.edu/es.html',
    chapterInfo: {
      entryPoint: 'Capítulo 1: Probabilidad Básica (Punto de entrada recomendado)',
      chapters: [
        { name: '1. Probabilidad Básica', difficulty: 'Básico' },
        { name: '2. Probabilidad Condicional', difficulty: 'Intermedio' },
        { name: '3. Variables Aleatorias', difficulty: 'Intermedio' },
        { name: '4. Distribuciones de Probabilidad', difficulty: 'Avanzado' },
        { name: '5. Inferencia Frecuentista', difficulty: 'Avanzado' },
        { name: '6. Inferencia Bayesiana', difficulty: 'Avanzado' }
      ]
    },
    suggestedQuestion: '¿Por qué la frecuencia observada se aproxima a la probabilidad teórica a medida que aumenta el número de ensayos?',
    featured: false,
    type: 'external',
    tags: ['Probabilidad Visual', 'Inferencia Bayesiana', 'Variables Aleatorias', 'Brown University']
  },

  // 4. Datos y vida cotidiana
  {
    id: 'cuanto-cuesta-hoy-actividad',
    title: '¿Cuánto cuesta hoy?',
    subtitle: 'Actividad interactiva de cambio de divisas y variación porcentual',
    description: 'Relaciona la tasa de cambio del dólar frente al peso colombiano con una compra real y analiza el impacto en pesos y en porcentaje.',
    category: 'Datos y vida cotidiana',
    provider: 'Daniel Bustos (Plataforma Educativa)',
    language: 'Español',
    url: '#cuanto-cuesta-hoy',
    featured: true,
    featuredOrder: 3,
    featuredTheme: 'cotidiana',
    type: 'internal',
    tags: ['Matemáticas de la Vida Cotidiana', 'Finanzas', 'Porcentajes', 'Tasa de Cambio', 'Actividad Propia'],
    suggestedQuestion: 'Si el dólar sube un 5%, ¿por qué el aumento en pesos de un producto costoso se siente mucho mayor que el de uno económico aunque la tasa porcentual sea idéntica?'
  },
  {
    id: 'gapminder-tools-datos',
    title: 'Gapminder Tools',
    subtitle: 'Visualización multidimensional del desarrollo global y tendencias históricas',
    description: 'Explora datos de países y descubre cómo cambian la población, los ingresos y la esperanza de vida.',
    category: 'Datos y vida cotidiana',
    provider: 'Gapminder Foundation',
    language: 'Multilingüe (Datos globales en inglés)',
    url: 'https://www.gapminder.org/tools/',
    suggestedQuestion: '¿Qué diferencias y semejanzas encuentras entre Colombia y Brasil a lo largo del tiempo?',
    featured: false,
    type: 'external',
    tags: ['Visualización de Datos', 'Demografía', 'Economía Global', 'Hans Rosling', 'Series Temporales']
  },
  {
    id: 'banrep-dolar-colombia',
    title: 'El dólar en Colombia — Banco de la República',
    subtitle: 'Graficador interactivo oficial de la Tasa Representativa del Mercado (TRM)',
    description: 'Consulta la evolución del dólar frente al peso colombiano y explora cambios, porcentajes y tendencias.',
    category: 'Datos y vida cotidiana',
    provider: 'Banco de la República de Colombia',
    language: 'Español',
    url: 'https://suameca.banrep.gov.co/graficador-interactivo/grafica.com',
    secondaryUrl: {
      label: 'Guía oficial de consulta TRM',
      url: 'https://www.banrep.gov.co/es/como-consultar-datos-historicos-tasa-representativa-mercado-trm-nuevo-portal-estadisticas'
    },
    studentTip: 'Selecciona la serie "Tasa Representativa del Mercado (TRM)" en el portal interactivo del Banco de la República para visualizar la evolución histórica oficial.',
    suggestedQuestion: '¿En qué periodos históricos recientes el peso colombiano ha experimentado sus mayores apreciaciones o depreciaciones?',
    featured: false,
    type: 'external',
    tags: ['TRM', 'Economía Colombiana', 'Banco de la República', 'Moneda', 'Datos Oficiales']
  }
];
