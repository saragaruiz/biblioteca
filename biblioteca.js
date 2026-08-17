const guardar = document.getElementById('agregarLibro')
const CLAVE_STORAGE = 'misLibros'

guardar.addEventListener('submit', function(evento){
    evento.preventDefault()

    const nuevoLibro = {
        id: Date.now(),
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autore').value,
        genero: document.getElementById('genero').value,
        anio: document.getElementById('anio').value, 
        paginas: document.getElementById('pages').value,
        valoracion: document.getElementById('valoracion').value
    }

    const libros = cargarLibros()

    libros.push(nuevoLibro)

    guardarLibros(libros)

    guardar.requestFullscreen()
    alert('Libro guardado!')
})

function cargarLibros() {
  const datosGuardados = localStorage.getItem(CLAVE_STORAGE);
  return datosGuardados ? JSON.parse(datosGuardados) : [];
}

function guardarLibros(libros) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(libros));
}
