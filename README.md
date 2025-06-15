# Programación-Avanzada-JavaScript
WebToon APP

🚀 Cómo ejecutar la aplicación
Clonar el repositorio:

bash
git clone https://github.com/NewtonSupreme/Programacion-Avanzada-JavaScript.git
cd webtoon-app
Abrir en el navegador:

Simplemente abre el archivo index.html en tu navegador web favorito (Chrome, Firefox, Edge, etc.)

No se requiere servidor ni instalación adicional

Usar la aplicación:

Explora los cuatro módulos usando la barra de navegación superior

Todos los datos se guardan localmente en tu navegador (localStorage)

🌐 APIs utilizadas
AnimeChan API (para citas de anime):

Endpoint: https://animechan.xyz/api/random

No requiere clave API

La aplicación incluye citas locales como respaldo en caso de fallo

Frankfurter API (para conversión de divisas):

Endpoint: https://api.frankfurter.app/latest

No requiere clave API

Proporciona tasas de cambio actualizadas

🏗️ Estructura del proyecto y decisiones de diseño
Estructura del código
Single Page Application (SPA) con módulos intercambiables

Vanilla JavaScript sin frameworks o librerías externas (excepto Chart.js para gráficos)

Organización modular por funcionalidades:

Gestor de tareas

Generador de citas

Conversor de divisas

Cuestionario interactivo

Decisiones de diseño
Estilo WebToon/Manhwa:

Uso de globos de diálogo para los contenidos

Colores vibrantes y contrastantes

Tipografía estilo cómic

Elementos decorativos manga

Experiencia de usuario:

Navegación simple entre módulos

Notificaciones estilo manga

Animaciones CSS para feedback visual

Diseño completamente responsive

Persistencia de datos:

Uso de localStorage para guardar tareas y citas favoritas

No requiere backend ni base de datos externa

Manejo de errores:

Respaldo local cuando las APIs fallan

Mensajes de error amigables

🛠️ Tecnologías utilizadas
HTML5 semántico

CSS3 con variables y animaciones

JavaScript Vanilla (ES6+)

Chart.js (para gráficos de divisas)

Font Awesome (iconos)

Google Fonts (tipografía)
