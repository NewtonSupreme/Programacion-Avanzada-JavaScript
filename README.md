# 🎌 WebToon App - Aplicación de Módulos JavaScript con Estilo Anime/Manga

**Alumno:** Leandro Marquez  
**Tecnologías:** HTML5, CSS, JavaScript Vanilla  
**Licencia:** MIT  
**Fecha:** 2025

![WebToon](https://github.com/user-attachments/assets/c8793a96-fd91-4124-bf42-7ef9e2fde2e6)
 
*Captura completa de la interfaz estilo manga*

## 📋 Tabla de Contenidos
1. [Instalación y Ejecución](#-instalación-y-ejecución)
2. [Características Principales](#-características-principales)
3. [APIs Integradas](#-apis-integradas)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Diseño UI/UX](#-diseño-uiux)

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Navegador web moderno (Chrome 90+, Firefox 85+, Edge 90+)
- Conexión a internet (solo para uso inicial de APIs)

### Pasos para Ejecución
```bash
# 1. Clonar repositorio
git clone https://github.com/NewtonSupreme/Programacion-Avanzada-JavaScript.git

# 2. Navegar al directorio
cd webtoon-app

# 3. Abrir aplicación (elige según tu SO):
start index.html  # Windows
open index.html   # macOS
xdg-open index.html  # Linux
O en su defecto en Live Server
```
```bash
🌟 Características Principales
Módulo de Tareas
✅ Añadir/eliminar tareas
✅ Filtrar por: Todas/Pendientes/Completadas
✅ Estadísticas automáticas
✅ Persistencia en localStorage

Módulo de Citas Anime
🎴 100+ citas de personajes famosos
❤️ Guardar favoritos localmente
🔄 Sistema de respaldo cuando API falla

Conversor de Divisas
💱 Soporta 6 monedas principales
📊 Gráfico histórico (Chart.js)
🔢 Cálculos en tiempo real

Cuestionario Interactivo
❓ 10 preguntas sobre cultura anime
✔️ Feedback inmediato
🏆 Sistema de puntuación

🌐 APIs Integradas
API	Descripción	Endpoint	Uso
AnimeChan	Citas aleatorias de anime	https://animechan.xyz/api/random	Obtener frases inspiradoras
Frankfurter	Datos de divisas	https://api.frankfurter.app/latest	Conversión monetaria
Nota: Ambas APIs son de uso libre sin necesidad de autenticación(Públicas)
```
```bash
🏗️ Estructura del Proyecto

webtoon-app/
│
├── index.html            # Estructura HTML principal
│
├── style.css         # Todos los estilos
│
├── script.js  # Lógica principal
│   │   # Gestor de tareas
│   │   # Sistema de citas
│   │   # Conversor
│   │   # Cuestionario
```
```bash
⚙️ Detalles Técnicos
Implementación JavaScript

// Ejemplo de módulo de tareas
class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  }

  addTask(description) {
    const newTask = {
      id: Date.now(),
      description,
      completed: false,
      createdAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    this._saveToLocalStorage();
  }

  _saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}
```
```bash
Estructura CSS Clave

css
/* Estilo de globos manga */
.bubble {
  background: #ffd6ff;
  border: 3px solid #3a0ca3;
  border-radius: 20px;
  position: relative;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.bubble::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50px;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 15px solid #3a0ca3;
}
```
```bash
🎨 Diseño UI/UX
Principios de Diseño
Estilo Visual Manga:

Paleta de colores vibrantes (#ff6b6b, #7209b7)
Tipografía: Rubik Bubbles para títulos
Efectos de sombra y profundidad

Componentes Reutilizables:
Sistema de notificaciones estilo "toast"
Tarjetas con bordes redondeados
Botones con efectos hover

Experiencia de Usuario:
Transiciones suaves entre módulos
Feedback visual inmediato
Diseño 100% responsive

![WebToon](https://github.com/user-attachments/assets/ab7c3bbd-c5ea-4c9d-a16b-4221e097b527)
Interfaz del gestor de tareas

💾 Persistencia de Datos
Esquema de Almacenamiento
Key	Datos Almacenados	Ejemplo
tasks	Array de objetos tarea	[{id: 123, description: "Estudiar JS", completed: false}]
savedQuotes	Citas favoritas	[{quote: "Texto...", character: "Naruto"}]
```
```bash
Métodos Clave

// Guardar datos
function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to localStorage", e);
  }
}

// Cargar datos
function loadData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}
