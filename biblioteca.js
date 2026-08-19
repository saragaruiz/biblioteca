const formulario = document.getElementById('agregarLibro')
const CLAVE_STORAGE = 'misLibros'

// API para buscar las portadas de los libros

async function buscarPortada(titulo, autor) {
  const queryTitulo = encodeURIComponent(titulo)
  const queryAutor = encodeURIComponent(autor)

  const url = `https://openlibrary.org/search.json?title=${queryTitulo}&author=${queryAutor}`

  try {
    const respuesta = await fetch(url)
    const datos = await respuesta.json()

    console.log('Datos recibidos de la API:', datos);

    if (datos.docs && datos.docs.length > 0) {
      const libroEncontrado = datos.docs[0]

     if (libroEncontrado.cover_i) {
        return `https://covers.openlibrary.org/b/id/${libroEncontrado.cover_i}-M.jpg`
      }
    }

    return null
    
  } catch (error) {
    console.error('Error buscando la portada:', error)
    return null
  }
}

// guardamos los libros
formulario.addEventListener('submit', async function (evento) {
  evento.preventDefault()

  const titulo = document.getElementById('titulo').value
  const autor = document.getElementById('autore').value
  const portada = await buscarPortada(titulo, autor);


  const nuevoLibro = {
    id: Date.now(),
    titulo: titulo,
    autor: autor,
    genero: document.getElementById('genero').value,
    anio: document.getElementById('anio').value,
    paginas: document.getElementById('pages').value,
    valoracion: document.getElementById('valoracion').value,
    notas: document.getElementById('notas').value,
    portada: portada   
  }

  const libros = cargarLibros()
  libros.push(nuevoLibro)
  guardarLibros(libros)

  formulario.reset()
  alert('Libro guardado ✅')
});

function cargarLibros() {
  const datosGuardados = localStorage.getItem(CLAVE_STORAGE)
  return datosGuardados ? JSON.parse(datosGuardados) : []
}

function guardarLibros(libros) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(libros))
}