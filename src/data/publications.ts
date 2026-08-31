export interface AcademicWork {
  id: string;
  type: string;
  title: string;
  area: string;
  verifiedUrl?: string;
}

export const academicThesesData: AcademicWork[] = [
  {
    id: "thesis-phd",
    type: "Tesis doctoral",
    title: "Harmonicidade de aplicações de Gauss e subvariedades com vetor curvatura media paralelo",
    area: "Geometría diferencial",
    verifiedUrl: "https://lume.ufrgs.br/handle/10183/189374",
  },
  {
    id: "thesis-master",
    type: "Trabajo de maestría",
    title: "Módulos injetivos e a dualidade de Matlis",
    area: "Álgebra",
    verifiedUrl: "http://www.bibliotecadigital.ufrgs.br/da.php?nrb=000974071&loc=2015&l=c175878718b62df5",
  },
  {
    id: "thesis-undergrad",
    type: "Trabajo de grado",
    title: "Temas de lógica en Topos de Grothendieck",
    area: "Lógica, teoría de conjuntos, topología",
  },
];

export interface AcademicPublication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number | string;
  details?: string;
  doi: string;
  url: string;
}

export const academicPublicationsData: AcademicPublication[] = [
  {
    id: "pub-1",
    title: "Competencias del tutor para la enseñanza virtual de las ecuaciones diferenciales para ingenieros en formación",
    authors: "Lugo López, N. D., Barrera Buitrago, D. A., Baez Acevedo, J. S., & Bustos Ríos, D. F.",
    journal: "Educatio Siglo XXI",
    year: 2024,
    details: "41(3), 195–216",
    doi: "10.6018/educatio.578191",
    url: "https://doi.org/10.6018/educatio.578191",
  },
  {
    id: "pub-2",
    title: "Harmonic Gauss maps of submanifolds of arbitrary codimension of the Euclidean space and sphere and some applications",
    authors: "Bustos, D., & Ripoll, J.",
    journal: "Mathematische Nachrichten",
    year: 2023,
    details: "295(6), 1073–1085",
    doi: "10.1002/mana.202000074",
    url: "https://doi.org/10.1002/mana.202000074",
  },
  {
    id: "pub-3",
    title: "On the existence of foliations of solutions to the exterior Dirichlet problem for the minimal surface equation",
    authors: "Aiolfi, A., Bustos, D., & Ripoll, J.",
    journal: "Proceedings of the American Mathematical Society",
    year: 2022,
    details: "150(7), 3089–3099",
    doi: "10.1090/proc/15845",
    url: "https://doi.org/10.1090/proc/15845",
  },
  {
    id: "pub-4",
    title: "Minimal isoparametric submanifolds of S⁷ and octonionic eigenmaps",
    authors: "Bittencourt, F., Bustos, D. F., Figueiredo, E. S., Fusieger, P., & Ripoll, J. B.",
    journal: "Differential Geometry and its Applications",
    year: 2019,
    details: "64, 248–262",
    doi: "10.1016/j.difgeo.2019.03.007",
    url: "https://doi.org/10.1016/j.difgeo.2019.03.007",
  },
];
