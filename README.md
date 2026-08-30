# Espacio Educativo & Pedagógico — Daniel Bustos

Plataforma personal y didáctica desarrollada con **React 19**, **TypeScript** y **Tailwind CSS**, orientada a la divulgación de las matemáticas visuales, la física manipulable y el pensamiento computacional en el aula.

---

## 🏛️ Estructura y Metáforas Pedagógicas

El sitio organiza sus módulos utilizando espacios reconocibles inspirados en la vida escolar:

- **Inicio**: Presentación personal y el *Disco de Poincaré* interactivo con su personaje explorador animado.
- **Sobre mí (Aula & Metodología)**: Identidad pedagógica, principios didácticos constructivistas y contexto de vinculación con la *Institución Educativa Carlos Vieco Ortiz* (espacio personal de divulgación docente).
- **Recursos (Biblioteca)**: Catálogo modular clasificado por temáticas (Matemáticas, Física, Computación, Geometría), formatos (Guías, Artículos, Simulaciones, Micrositios) y etiquetas de procedencia (*Interno* o *Externo*).
- **Laboratorio (Experimentos)**: Simulaciones activas manipulables inspiradas en las explicaciones de **Bartosz Ciechanowski** y **Nicky Case** (interferencia de ondas, modelos hiperbólicos y dinámica armónica).
- **Sala de Proyectos**: Bitácora de semilleros escolares y bancos de geometría abierta.
- **Contacto**: Buzón y canales de comunicación para estudiantes y la comunidad educativa.

---

## 🚀 Requisitos e Instalación Local

### Prerrequisitos
- Node.js versión 18 o superior.
- Gestor de paquetes `npm` (o `pnpm` / `yarn`).

### Pasos para ejecutar en tu equipo:

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/espacio-educativo.git

# 2. Entrar en la carpeta del proyecto
cd espacio-educativo

# 3. Instalar las dependencias
npm install

# 4. Iniciar el servidor de desarrollo local
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## ✏️ Cómo Agregar y Editar Contenidos

Toda la información del sitio está **desacoplada del diseño visual** dentro de la carpeta `src/data/`:

### 1. Agregar un nuevo recurso a la Biblioteca (`src/data/resources.ts`)
Abre `src/data/resources.ts` y añade un nuevo objeto al arreglo `educationalResourcesData`:

```typescript
{
  id: "mi-nuevo-articulo",
  title: "Título de la Lección o Guía",
  subtitle: "Subtítulo explicativo breve",
  description: "Descripción detallada del contenido abordado.",
  space: "Biblioteca", // o "Aula"
  category: "Matemáticas", // O: Física, Ciencias de la Computación, Geometría, etc.
  format: "Guía interactiva", // O: Artículo, Simulación, Micro-sitio, Taller
  location: "internal", // "internal" para abrir en modal o "external" para enlace web
  url: "#mi-nuevo-articulo", // o "https://enlace-externo.com"
  readingTimeMinutes: 10,
  tags: ["Concepto 1", "Secundaria", "Manipulativo"],
  date: "2026-03-01",
  featured: false
}
```

### 2. Actualizar tu información personal (`src/data/profile.ts`)
Modifica los campos en `src/data/profile.ts` para personalizar tu correo, biografía, redes sociales y pilares pedagógicos.

### 3. Agregar un proyecto a la Sala de Proyectos (`src/data/projects.ts`)
Edita `src/data/projects.ts` para registrar nuevas iniciativas de semilleros o materiales didácticos.

---

## 📦 Subir a GitHub vs. Alojar la Web en Internet

Es importante distinguir dos procesos:
1. **Subir el código fuente a GitHub**: Guardar el historial de versiones y hacer tu proyecto de código abierto.
2. **Alojar y publicar la web en vivo**: Para que cualquier persona pueda visitarla mediante una URL pública en internet.

---

### Paso A: Subir el código fuente a tu repositorio en GitHub

1. Crea un nuevo repositorio en [GitHub](https://github.com/new) llamado `espacio-educativo` (público o privado).
2. En tu terminal local, vincula tu proyecto y sube los cambios:

```bash
# Inicializar git si no lo has hecho
git init
git add .
git commit -m "feat: versión inicial del espacio educativo con disco de Poincaré y biblioteca"

# Vincular con tu repositorio remoto
git branch -M main
git remote add origin https://github.com/tu-usuario/espacio-educativo.git
git push -u origin main
```

---

### Paso B: Alojar la web públicamente

Elige una de las siguientes opciones gratuitas para producción:

#### Opción 1: GitHub Pages (Directo desde GitHub)
1. En tu archivo `vite.config.ts`, si tu repositorio se llama `espacio-educativo`, añade la propiedad `base`:
   ```typescript
   export default defineConfig({
     base: '/espacio-educativo/',
     // ... resto de configuración
   });
   ```
2. En GitHub, ve a **Settings > Pages > Build and deployment > Source** y selecciona **GitHub Actions**.
3. Elige la plantilla de **Static HTML / Vite** para despliegue automático en cada `git push`.

#### Opción 2: Vercel o Netlify (Recomendado y más rápido)
1. Inicia sesión en [Vercel](https://vercel.com/) o [Netlify](https://netlify.com/) con tu cuenta de GitHub.
2. Haz clic en **"Add New Project"** e importa tu repositorio `espacio-educativo`.
3. Vercel detectará automáticamente el framework Vite y configurará el comando de compilación (`npm run build`) y el directorio de salida (`dist`).
4. Haz clic en **Deploy**. Obtendrás una URL pública inmediata (ej. `https://espacio-educativo.vercel.app`).

---

## 🛡️ Seguridad y Buenas Prácticas

- **Sin credenciales en el repositorio**: El proyecto no contiene claves privadas, contraseñas ni tokens hardcodeados en el código.
- **Variables de entorno**: Si en el futuro integras servicios externos con claves de API, utiliza el archivo `.env` (declarado en `.gitignore`) y documenta los nombres requeridos en `.env.example`.
- **Accesibilidad**: Se respeta la preferencia de movimiento reducido del sistema operativo (`prefers-reduced-motion`) y la navegación accesible por teclado.

---

## 📄 Licencia

Este proyecto educativo está disponible bajo la licencia abierta **MIT**. Puedes adaptarlo, extenderlo y utilizarlo libremente en tus aulas y comunidades educativas.
