const CLAVE_STORAGE = 'misLibros'

function cargarLibros(){
    const datosGuardados = localStorage.getItem(CLAVE_STORAGE)
    return datosGuardados ? JSON.parse(datosGuardados) : []
}

function guardarLibros(libros) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(libros))
}