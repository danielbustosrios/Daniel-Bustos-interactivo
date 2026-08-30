import { TeacherProfile } from '../types';

export const teacherProfileData: TeacherProfile = {
  name: "Daniel Bustos",
  role: "Docente e investigador en matemáticas",
  introQuote: "Un espacio para explorar las matemáticas, compartir ideas y aprender experimentando.",
  institution: "Institución Educativa Carlos Vieco Ortiz",
  institutionNote: "Este sitio web es un espacio pedagógico, académico y de divulgación personal creado por Daniel Bustos. No constituye la página oficial ni el canal administrativo formal de la institución educativa.",
  bioParagraphs: [
    "Soy un apasionado por las matemáticas, el desarrollo de pensamiento lógico matemático abstracto, en todos los niveles educativos. Me encanta aprender cosas nuevas, así como el desarrollo y aplicación de herramientas educativas.",
    "He trabajado como docente investigador en la Universidad del Tolima, en la Universidad Nacional Abierta y a Distancia (UNAD), en la Universidade Federal do Ceará (Brasil) y en la Universidade Federal do Rio Grande do Sul (Brasil). Mi trayectoria abarca la docencia en colegios privados y actualmente trabajo en la Institución Educativa Carlos Vieco Ortiz.",
    "En este espacio comparto recursos, explicaciones y experiencias interactivas para acercarnos a las matemáticas desde la curiosidad y la experimentación."
  ],
  degrees: [
    {
      degree: "Matemático con énfasis en Estadística",
      institution: "Universidad del Tolima"
    },
    {
      degree: "Magíster en Matemáticas",
      institution: "Universidade Federal do Rio Grande do Sul"
    },
    {
      degree: "Doctor en Ciencias Matemáticas",
      institution: "Universidade Federal do Rio Grande do Sul"
    }
  ],
  postdoc: {
    description: "Estancia posdoctoral",
    institution: "Universidade Federal do Ceará"
  },
  pedagogicalPillars: [
    {
      title: "Comprensión Visual y Manipulable",
      description: "Aprender no es memorizar fórmulas, sino interactuar con los modelos hasta construir una intuición geométrica sólida.",
      icon: "Eye"
    },
    {
      title: "Curiosidad y Experimentación",
      description: "Espacios donde es posible formular conjeturas, alterar parámetros y observar dinámicamente las respuestas del sistema.",
      icon: "Sparkles"
    },
    {
      title: "Estructura Modular",
      description: "Contenidos organizados en espacios independientes: Biblioteca (recursos), Laboratorio (simulaciones) e Investigación.",
      icon: "BookOpen"
    },
    {
      title: "Código Abierto y Accesibilidad",
      description: "Materiales preparados para ser consultados, compartidos y adaptados libremente por la comunidad educativa.",
      icon: "Code"
    }
  ],
  contactChannelStatus: "Canal público en proceso de definición",
  githubRepoUrl: "https://github.com/tu-usuario/espacio-educativo"
};

