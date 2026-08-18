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
      ${libro.portada ? `<img src="${libro.portada}" alt="Portada de ${libro.titulo}" class="portada-libro">` : ''}
      <h2>${libro.titulo}</h2>
      <p><strong>Autor/a:</strong> ${libro.autor}</p>
      <p><strong>Género:</strong> ${libro.genero}</p>
      <p><strong>Páginas:</strong> ${libro.paginas}</p>
      <p><strong>Año: </strong> ${libro.anio}</p>
      <p><strong>Valoración:</strong> ${libro.valoracion} / 5</p>
      <p><strong>Comentarios:</strong> ${libro.notas || 'Sin Notas'}</p>

      <button data-id="${libro.id}" class="borra">Eliminar</button>    `

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
