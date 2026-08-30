import { LabExperiment } from '../types';

export const labExperimentsData: LabExperiment[] = [
  {
    id: "poincare-hyperbolic-lab",
    title: "Explorador del Disco de Poincaré",
    subtitle: "Aproximación artística y geométrica a la curvatura negativa",
    description: "Manipula la densidad de geodésicas, ajusta el paso de interpolación y observa cómo las trayectorias convergen suavemente hacia el borde circular asintótico.",
    difficulty: "Introductorio",
    estimatedMinutes: 5,
    concepts: ["Geometría No Euclidiana", "Geodésicas", "Ortogonalidad", "Redes de Caminos"],
    interactiveDemoId: "poincare-hyperbolic",
    date: "2026-02-10",
    featured: true
  },
  {
    id: "wave-superposition-lab",
    title: "Laboratorio de Ondas e Interferencia",
    subtitle: "Simulación interactiva inspirada en Bartosz Ciechanowski",
    description: "Ajusta la frecuencia, la longitud de onda y la separación de dos fuentes de perturbación. Mide la amplitud puntual con la sonda de fase en tiempo real.",
    difficulty: "Intermedio",
    estimatedMinutes: 10,
    concepts: ["Frecuencia", "Longitud de onda", "Superposición de ondas", "Doble rendija"],
    interactiveDemoId: "wave-interference",
    date: "2026-01-15",
    featured: true
  },
  {
    id: "harmonic-motion-lab",
    title: "Resonancia y Movimiento Armónico",
    subtitle: "Visualizador de oscilaciones acopladas y amortiguamiento",
    description: "Comprende la interacción de resortes, fricción y energía potencial a través de controles directos y gráficas de fase en tiempo real.",
    difficulty: "Intermedio",
    estimatedMinutes: 8,
    concepts: ["Amortiguamiento", "Fase", "Energía Cinética/Potencial", "Resonancia"],
    interactiveDemoId: "harmonic-pendulum",
    date: "2025-11-10",
    featured: false
  }
];
