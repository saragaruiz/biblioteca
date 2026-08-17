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
      <h2>${libro.titulo}</h2>
      <p><strong>Autor/a:</strong> ${libro.autor}</p>
      <p><strong>Género:</strong> ${libro.genero}</p>
      <p><strong>Páginas:</strong> ${libro.paginas}</p>
      <p><strong>Valoración:</strong> ${libro.valoracion} / 5</p>
      <button data-id="${libro.id}" class="btn-borrar">Eliminar</button>
    `

    contenedor.appendChild(tarjeta)
  })
}

mostrarLibros();
