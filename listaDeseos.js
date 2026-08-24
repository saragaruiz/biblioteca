const CLAVE_DESEOS = 'listaDeseos'
const recomendados = document.getElementById('listaRecomendaciones')
const deseos = document.getElementById('listaDeseos')

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

// LLAMAMOS A LA API 
async function buscarLectura(){
    const genero = generoMasLeido()
    if(!genero){
        recomendados.innerHTML = '<p>Aún no sabemos lo que te gusta...</p>'
        return
    }
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(genero)}&maxResults=12`
    try{
        const respuesta = await fetch(url)
        const datos = await respuesta.json()
        verRecomendados(datos.items || [])
    }catch(error){
        recomendados.innerHTML = '<p>No puedo cargar las recomendaciones ahora mismo</p>'
    }
}

function verRecomendados(itemsGoogle){
    const librosLeidos = cargarLibros().map(function (l){
        return l.titulo.toLowerCase()
    })
    const filtrados = itemsGoogle.filter(function (item) {
        const titulo = item.volumeInfo.title
        return titulo && !librosLeidos.includes(titulo.toLowerCase())
    })

    if (filtrados.length === 0) {
        recomendados.innerHTML = '<p>No encontramos recomendaciones nuevas por ahora.</p>'
        return
    }

recomendados.innerHTML = ''

    filtrados.forEach(function (item) {
        const info = item.volumeInfo
        const portada = info.imageLinks ? info.imageLinks.thumbnail : ''
        const autor = info.authors ? info.authors.join(', ') : 'Autor desconocido'

        const tarjeta = document.createElement('div')
        tarjeta.classList.add('tarjeta-libro')

        tarjeta.innerHTML = `
            <div class="portada">
                ${portada ? `<img src="${portada}" alt="Portada de ${info.title}" class="portada-libro">` : ''}
            </div>
            <div class="info">
                <h2>${info.title}</h2>
                <p class="autor"><strong>Autor/a:</strong> ${autor}</p>
                <p class="genero"><strong>Género:</strong> ${generoMasLeido()}</p>
                <button class="anadir-deseo" 
                    data-titulo="${info.title.replace(/"/g, '&quot;')}" 
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

buscarLectura()
mostrarDeseos()