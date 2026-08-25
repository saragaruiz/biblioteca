const CLAVE_DESEOS = 'listaDeseos'
const recomendados = document.getElementById('listaRecomendaciones')
const deseos = document.getElementById('listaDeseos')
const flechaIzquierda = document.getElementById('flechaIzquierda')
const flechaDerecha = document.getElementById('flechaDerecha')


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

        const consultas = [
            libro.titulo,
            libro.autor,
            libro.genero
        ]

        for (const consulta of consultas) {

            const url =
                `https://openlibrary.org/search.json?q=${encodeURIComponent(consulta)}&limit=6`

            try {

                const respuesta = await fetch(url)

                if (!respuesta.ok) {
                    throw new Error('Error en la API')
                }

                const datos = await respuesta.json()

                resultados = resultados.concat(datos.docs || [])

            } catch (error) {

                console.error(
                    'No se pudieron buscar recomendaciones para:',
                    consulta
                )
            }
        }
    }

    verRecomendados(resultados)
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
                    ? `<img 
                        src="${portada}" 
                        alt="Portada de ${titulo}" 
                        class="portada-libro">`
                    : ''
                }
            </div>

            <div class="info">

                <h2>${titulo}</h2>

                <p class="autor">
                    <strong>Autor/a:</strong> ${autor}
                </p>

                <button 
                    class="anadir-deseo"
                    data-titulo="${titulo.replace(/"/g, '&quot;')}"
                    data-autor="${autor.replace(/"/g, '&quot;')}"
                    data-portada="${portada}">
                    Añadir a deseos
                </button>

            </div>
        `

        recomendados.appendChild(tarjeta)
    })
}
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

// añadir a deseos ---
recomendados.addEventListener('click', function (evento) {
    if (evento.target.classList.contains('anadir-deseo')) {
        const boton = evento.target
        const nuevoDeseo = {
            id: Date.now(),
            titulo: boton.dataset.titulo,
            autor: boton.dataset.autor,
            portada: boton.dataset.portada
        }

        const listaDeseos = cargarDeseos()

        // Evita duplicados
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