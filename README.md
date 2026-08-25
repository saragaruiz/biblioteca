<div align="center">
<img width="3500" height="1500" alt="banner" src="banner.png" />
<h1 align="center">Biblioteca de libros</h1>
</div>
<p align="left">
<img src="https://img.shields.io/badge/STATUS-EN%20DESARROLLO-yellow">
</p>

<p>Proyecto personal para practicar JavaScript: una web sencilla para registrar los libros que voy leyendo, guardando los datos en el navegador con localStorage. 
Además, la aplicación utiliza la Open Library API para buscar automáticamente las portadas de los libros a partir de su título y autor.</p>

<p>La web se inicializa en "indice.html"</p>

<h3>✨ Funcionalidades </h3>
<ul>
  <li>Añadir un libro leído (título, autor, género, año, páginas y valoración)</li>
  <li>Ver el listado completo de libros leídos</li>
  <li>Ordenar los libros según el año leído (ascendente/descendente), titulo(alfabéticamente), y valoración. </li>
  <li>Los datos persisten entre visitas (no se pierden al cerrar el navegador)</li>
  <li>Crear lista de Deseos en base a recomendaciones que se generan por las valoraciones de libros leídos</li>
  
</ul>

<h3>🤖 Sistema de recomendaciones</h3>

<p>
La aplicación analiza los libros registrados por el usuario para generar
recomendaciones de lectura. Los resultados se obtienen mediante Open Library
API y se filtran para evitar mostrar libros que ya forman parte de la biblioteca.
</p>

<h3>💾 Almacenamiento</h3>

<p>
Los libros leídos y la lista de deseos se almacenan en el navegador mediante
localStorage, por lo que los datos permanecen disponibles aunque se cierre
la página.
</p>

<h3>🛠️ Tecnologías </h3>
<ul>
  <li>HTML5</li>
  <li>CSS3 (Google Fonts: Nunito)</li>
  <li>JavaScript vanilla (sin frameworks ni librerías)</li>
  <li>localStorage como almacenamiento de datos</li>
  <li>Open Library API — búsqueda de libros y obtención de sus portadas.</li>
  <li>Google Fonts — tipografía Nunito.</li>
</ul>

<h3>🚀 Próximas mejoras</h3>
<ul>
  <li>Mejorar el algoritmo de recomendaciones para adaptarlo mejor a los gustos del usuario</li>
  <li>Añadir más información de los libros obtenida desde la API</li>
  <li>Permitir editar los libros ya registrados</li>
</ul>
  
