export type SpaceType = 
  | 'inicio' 
  | 'sobre-mi' 
  | 'recursos' 
  | 'explora-experimenta'
  | 'laboratorio' 
  | 'proyectos' 
  | 'contacto';

export type ExploreCategory = 
  | 'Universo y planetas'
  | 'Movimiento y funciones'
  | 'Estadística y probabilidad'
  | 'Datos y vida cotidiana';

export interface ExploreResource {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: ExploreCategory;
  provider: string;
  language: string;
  url: string;
  secondaryUrl?: {
    label: string;
    url: string;
  };
  suggestedQuestion?: string;
  studentTip?: string;
  chapterInfo?: {
    entryPoint: string;
    chapters: { name: string; difficulty: 'Básico' | 'Intermedio' | 'Avanzado' }[];
  };
  featured: boolean;
  featuredOrder?: number;
  featuredTheme?: 'universo' | 'movimiento' | 'cotidiana';
  type: 'internal' | 'external';
  tags: string[];
}

export type ResourceCategory = 
  | 'Matemáticas'
  | 'Física'
  | 'Ciencias de la Computación'
  | 'Pedagogía y Didáctica'
  | 'Pensamiento Visual'
  | 'Geometría';

export type ResourceFormat = 
  | 'Artículo'
  | 'Guía interactiva'
  | 'Simulación'
  | 'Micro-sitio'
  | 'Taller'
  | 'Video';

export interface ResourceItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  space: 'Biblioteca' | 'Aula';
  category: ResourceCategory;
  format: ResourceFormat;
  location: 'internal' | 'external';
  url: string;
  readingTimeMinutes?: number;
  tags: string[];
  date: string;
  featured?: boolean;
}

export interface AcademicPublication {
  id: string;
  title: string;
  journal: string;
  url: string;
}

export interface LabExperiment {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: 'Introductorio' | 'Intermedio' | 'Avanzado';
  estimatedMinutes: number;
  concepts: string[];
  interactiveDemoId: 'poincare-hyperbolic' | 'wave-interference' | 'harmonic-pendulum';
  date: string;
  featured?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'Activo' | 'En desarrollo' | 'Archivado';
  year: string;
  tags: string[];
  role: string;
  linkText?: string;
  linkUrl?: string;
  institutionMetaphor: 'Sala de proyectos' | 'Aula de experimentación' | 'Semillero';
}

export interface EducationDegree {
  degree: string;
  institution: string;
}

export interface TeacherProfile {
  name: string;
  role: string;
  introQuote: string;
  institution: string;
  institutionNote: string;
  bioParagraphs: string[];
  degrees: EducationDegree[];
  postdoc: {
    description: string;
    institution: string;
  };
  pedagogicalPillars: {
    title: string;
    description: string;
    icon: string;
  }[];
  contactChannelStatus: string;
  githubRepoUrl: string;
}

