const CLAVE_STORAGE = 'misLibros'
const contenedor = document.getElementById('listaLibros')

function cargarLibros(){
    const datosGuardados = localStorage.getItem(CLAVE_STORAGE)
    return datosGuardados ? JSON.parse(datosGuardados) : []
}

function mostrarLibros(){
    const libros = cargarLibros()
 
    if(libros.length === 0){
        contenedor.innerHTML = '<p> Todavía no has leído ningun libro </p>'
        return
    }
    contenedor.innerHTML = ''
 
    
  libros.forEach(function (libro) {
    const tarjeta = document.createElement('div')
    tarjeta.classList.add('tarjeta-libro')

    tarjeta.innerHTML = `
    <div class="portada">
      ${libro.portada ? `<img src="${libro.portada}" alt="Portada de ${libro.titulo}" class="portada-libro">` : ''}
    </div
  <div class="info">
      <h2>${libro.titulo}</h2>
      <p class="autor"><strong>Autor/a:</strong> ${libro.autor}</p>
      <p class="genero"><strong>Género:</strong> ${libro.genero}</p>
      <p class="pagina"><strong>Páginas:</strong> ${libro.paginas}</p>
      <p class="anio"><strong>Año: </strong> ${libro.anio}</p>
      <div class="valoracion">
    <span class="estrellas-llenas">${'★'.repeat(Number(libro.valoracion))}</span><span class="estrellas-vacias">${'☆'.repeat(5 - Number(libro.valoracion))}</span>
      </div>
      <p class="comentario"><strong>Comentarios:</strong> ${libro.notas || 'Sin Notas'}</p>

      <button data-id="${libro.id}" class="borra">Eliminar</button>    
  </div>
  `
    contenedor.appendChild(tarjeta)
  })
}
mostrarLibros();

const borrar = document.getElementById('listaLibros');

borrar.addEventListener('click', function (evento) {
  if (evento.target.classList.contains('borra')) {
    const idABorrar = evento.target.dataset.id

    const libros = cargarLibros()
    const librosFiltrados = libros.filter(function (libro) {
      return libro.id != idABorrar
    });

    guardarLibros(librosFiltrados)

    function guardarLibros(libros) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(libros))
}
    mostrarLibros()
  }
});
