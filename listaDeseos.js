const CLAVE_DESEOS = 'listaDeseos'
const recomendados = document.getElementById('listaRecomendaciones')
const deseos = document.getElementById('listaDeseos')
const flechaIzquierda = document.getElementById('flechaIzquierda')
const flechaDerecha = document.getElementById('flechaDerecha')

const MAPA_GENEROS = {
    'ciencia ficción': 'science_fiction',
    'ciencia ficcion': 'science_fiction',
    'fantasía': 'fantasy',
    'fantasia': 'fantasy',
    'terror': 'horror',
    'novela negra': 'mystery',
    'misterio': 'mystery',
    'romance': 'romance',
    'novela romántica': 'romance',
    'thriller': 'thriller',
    'suspense': 'thriller',
    'histórica': 'historical_fiction',
    'novela histórica': 'historical_fiction',
    'aventuras': 'adventure',
    'clásicos': 'classic_literature',
    'literatura clásica': 'classic_literature',
    'poesía': 'poetry',
    'poesia': 'poetry',
    'biografía': 'biography',
    'biografia': 'biography',
    'ensayo': 'essays',
    'autoayuda': 'self-help',
    'juvenil': 'young_adult_fiction',
    'infantil': 'children',
    'distopía': 'dystopia',
    'distopia': 'dystopia',
    'policíaca': 'detective_and_mystery_stories',
    'policiaca': 'detective_and_mystery_stories',
    'cómic': 'comics',
    'comic': 'comics',
    'novela gráfica': 'graphic_novels',
    'drama': 'drama',
    'humor': 'humor'
}

function normalizarSubject(texto) {
    const limpio = texto.toLowerCase().trim()

    if (MAPA_GENEROS[limpio]) {
        return MAPA_GENEROS[limpio]
    }

    return limpio
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_')
}

flechaDerecha.addEventListener('click', function () {
    recomendados.scrollBy({
        left: 250,
        behavior: 'smooth'
    })
})

flechaIzquierda.addEventListener('click', function () {
    recomendados.scrollBy({
        left: -250,
        behavior: 'smooth'
    })
})

// comprobamos que genero se han leido mas
function generoMasLeido(){
    const libros = cargarLibros()
    if(libros.length === 0){
        return null
    }
    const conteo = {}
    libros.forEach(function(libro){
        const genero = libro.genero
        conteo[genero] = (conteo[genero] || 0) + 1
    })

    return Object.keys(conteo).reduce(function (a, b){
        return conteo[a] > conteo[b] ? a : b
    })
}
// comprobamos la puntuacion de los libros que hemos leído 

function librosFavoritos() {

    const libros = cargarLibros()

    return libros.filter(function (libro) {
            return Number(libro.valoracion) >= 4
        })
        .sort(function (a, b) {
            return Math.random() - 0.5
        })
        .slice(0, 3)
}

// LLAMAMOS A LA API 
async function buscarRecomendaciones() {
    const favoritos = librosFavoritos()

    if (favoritos.length === 0) {
        recomendados.innerHTML =
            '<p>Aún no sé lo que te gusta....</p>'
        return
    }

    let resultados = []

     for (const libro of favoritos) {
         const subject = normalizarSubject(libro.genero)
        const url = `https://openlibrary.org/search.json?subject=${encodeURIComponent(subject)}&language=spa&limit=20`
        try {

            const respuesta = await fetch(url)

            if (!respuesta.ok) {
                throw new Error('Error en la API')
            }

            const datos = await respuesta.json()

            resultados = resultados.concat(datos.docs || [])

        } catch (error) {

            console.error(
                'Error buscando recomendaciones:',
                error
            )
        }
    }
    const resultadosEspanol = resultados.filter(function (libro) { 
        return libro.language && libro.language.includes('spa') 
    }) 
    if (resultadosEspanol.length > 0) { 
        verRecomendados(resultadosEspanol) 
    } else {
         verRecomendados(resultados) 
        } 
    }
function crearTarjetaLibro(item) {
    const titulo = item.title

    const autor = item.author_name
        ? item.author_name.join(', ')
        : 'Autor desconocido'

    const portada = item.cover_i
        ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
        : ''

    const tarjeta = document.createElement('div')
    tarjeta.classList.add('tarjeta-libro')

    tarjeta.innerHTML = `
        <div class="portada">
            ${
                portada
                ? `<img src="${portada}" alt="Portada de ${titulo}" class="portada-libro">`
                : ''
            }
        </div>
        <div class="info">
            <h2>${titulo}</h2>
            <p class="autor"><strong>Autor/a:</strong> ${autor}</p>
            <button 
                class="anadir-deseo"
                data-titulo="${titulo.replace(/"/g, '&quot;')}"
                data-autor="${autor.replace(/"/g, '&quot;')}"
                data-portada="${portada}">
                Añadir a deseos
            </button>
        </div>
    `

    return tarjeta
}

function verRecomendados(itemsOpenLibrary) {

    const librosLeidos = cargarLibros().map(function (libro) {
        return libro.titulo.toLowerCase()
    })


    // Eliminamos libros que ya hemos leído
    const filtrados = itemsOpenLibrary.filter(function (item) {

        const titulo = item.title

        if (!titulo) {
            return false
        }
        return !librosLeidos.includes(titulo.toLowerCase())
    })


    // Eliminamos duplicados
    const librosUnicos = []

    filtrados.forEach(function (item) {
        const titulo = item.title.toLowerCase()
        const yaExiste = librosUnicos.some(function (libro) {
            return libro.title.toLowerCase() === titulo
        })

        if (!yaExiste) {
            librosUnicos.push(item)
        }
    })


    if (librosUnicos.length === 0) {
        recomendados.innerHTML =
            '<p>No encontramos recomendaciones nuevas por ahora.</p>'
        return
    }


    recomendados.innerHTML = ''

    librosUnicos.slice(0, 12).forEach(function (item) {
        recomendados.appendChild(crearTarjetaLibro(item))
    })
}

const inputBusqueda = document.getElementById('inputBusqueda')
const botonBuscar = document.getElementById('botonBuscar')
const resultadosBusqueda = document.getElementById('resultadosBusqueda')

async function buscarLibrosEnAPI() {
    const consulta = inputBusqueda.value.trim()

    if (consulta === '') {
        resultadosBusqueda.innerHTML = ''
        return
    }

    resultadosBusqueda.innerHTML = '<p>Buscando...</p>'

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(consulta)}&limit=10`

    try {
        const respuesta = await fetch(url)
        if (!respuesta.ok) throw new Error('Error en la API')

        const datos = await respuesta.json()
        const items = datos.docs || []

        const librosLeidos = cargarLibros().map(function (libro) {
            return libro.titulo.toLowerCase()
        })

        const filtrados = items.filter(function (item) {
            return item.title && !librosLeidos.includes(item.title.toLowerCase())
        })

        if (filtrados.length === 0) {
            resultadosBusqueda.innerHTML = '<p>No encontramos resultados.</p>'
            return
        }

        resultadosBusqueda.innerHTML = ''
        filtrados.slice(0, 20).forEach(function (item) {
            resultadosBusqueda.appendChild(crearTarjetaLibro(item))
        })

    } catch (error) {
        console.error('Error en la búsqueda:', error)
        resultadosBusqueda.innerHTML = '<p>Ha ocurrido un error al buscar.</p>'
    }
}

botonBuscar.addEventListener('click', buscarLibrosEnAPI)

inputBusqueda.addEventListener('keydown', function (evento) {
    if (evento.key === 'Enter') {
        buscarLibrosEnAPI()
    }
})

function cargarDeseos() {
    const datos = localStorage.getItem(CLAVE_DESEOS)
    return datos ? JSON.parse(datos) : []
}

function guardarDeseos(deseos) {
    localStorage.setItem(CLAVE_DESEOS, JSON.stringify(deseos))
}

function mostrarDeseos() {
    const listaDeseos = cargarDeseos()

    if (listaDeseos.length === 0) {
        deseos.innerHTML = '<p>Todavía no has añadido libros a tu lista de deseos.</p>'
        return
    }

    deseos.innerHTML = ''

    listaDeseos.forEach(function (libro) {
        const tarjeta = document.createElement('div')
        tarjeta.classList.add('tarjeta-libro')

        tarjeta.innerHTML = `
            <div class="portada">
                ${libro.portada ? `<img src="${libro.portada}" alt="Portada de ${libro.titulo}" class="portada-libro">` : ''}
            </div>
            <div class="info">
                <h2>${libro.titulo}</h2>
                <p class="autor"><strong>Autor/a:</strong> ${libro.autor}</p>
                <button data-id="${libro.id}" class="quitar-deseo">Quitar</button>
            </div>
        `
        deseos.appendChild(tarjeta)
    })
}

document.addEventListener('click', function (evento) {
    if (evento.target.classList.contains('anadir-deseo')) {
        const boton = evento.target
        const nuevoDeseo = {
            id: Date.now(),
            titulo: boton.dataset.titulo,
            autor: boton.dataset.autor,
            portada: boton.dataset.portada
        }

        const listaDeseos = cargarDeseos()

        const yaExiste = listaDeseos.some(function (d) {
            return d.titulo === nuevoDeseo.titulo
        })

        if (!yaExiste) {
            listaDeseos.push(nuevoDeseo)
            guardarDeseos(listaDeseos)
            mostrarDeseos()
        }
    }
})

deseos.addEventListener('click', function (evento) {
    if (evento.target.classList.contains('quitar-deseo')) {
        const idAQuitar = evento.target.dataset.id
        const listaDeseos = cargarDeseos()
        const filtrados = listaDeseos.filter(function (d) {
            return d.id != idAQuitar
        })
        guardarDeseos(filtrados)
        mostrarDeseos()
    }
})

buscarRecomendaciones()
mostrarDeseos()