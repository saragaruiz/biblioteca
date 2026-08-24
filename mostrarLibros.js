const contenedor = document.getElementById('listaLibros')
const ordenarPor = document.getElementById('ordenarPor')

function mostrarLibros(listaLibros){
    const libros = listaLibros || cargarLibros()
 
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
    </div>
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

ordenarPor.addEventListener('change', function () {
          const libros = cargarLibros()

    if (ordenarPor.value === 'asc') {
        libros.sort(function (a, b) {
            return a.anio - b.anio
        })
    } else if(ordenarPor.value ==='des'){
      libros.sort(function(a, b){
        return b.anio - a.anio
      })
    } else if (ordenarPor.value === 'titulo') {
        libros.sort(function (a, b) {
            return a.titulo.localeCompare(b.titulo)
        })
    } else if(ordenarPor.value === "valoracion"){
      libros.sort(function(a, b){
        return Number(b.valoracion) - Number(a.valoracion)     
       })
    }
    mostrarLibros(libros)
})