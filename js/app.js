const sectionPreReunion = document.getElementById('preReunion')
const sectionEnReunion = document.getElementById('enReunion')
const formularioAgregarIntegrante = document.getElementById('formulario-agregar-integrante')
const listaIntegrantes = document.getElementById('lista-integrantes')
const templateIntegrante = document.getElementById('template-integrante').content
const cardOrador = document.getElementById('orador')
const cardTermino = document.getElementById('termino')
const btnIniciar = document.getElementById('iniciar')
const btnRestablecer = document.getElementById('restablecer')
const btnSiguiente = document.getElementById('siguiente')
const fragment = document.createDocumentFragment()

let integrantes = []

let reunion = false

let orador = {}

let oradorIndex = null

let termino = false

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('integrantes')) {
        integrantes = JSON.parse(localStorage.getItem('integrantes'))
    }
    actualizarPantalla()
})

listaIntegrantes.addEventListener('click', e => {
    clickListaIntegrantes(e)
})

formularioAgregarIntegrante.addEventListener('submit', (e) => {
    e.preventDefault()
    agregarIntegrante(e)
})

btnIniciar.addEventListener('click', (e) => {
    e.preventDefault()
    iniciarReunion()
    e.stopPropagation()
})

btnRestablecer.addEventListener('click', (e) => {
    e.preventDefault()
    restablecer()
    e.stopPropagation()
})

btnSiguiente.addEventListener('click', (e) => {
    e.preventDefault()
    siguiente()
    e.stopPropagation()
})

const agregarIntegrante = e => {
    const inputNombre = e.target.querySelector('#campoNombre')
    if (inputNombre.value.trim() === '') {
        console.log('Esta vacio')
        return
    }

    const integrante = {
        id: Date.now(),
        nombre: inputNombre.value,
        estado: 'nohablo'
    }

    integrantes.push(integrante)

    formularioAgregarIntegrante.reset()
    inputNombre.focus()

    actualizarPantalla()
}

const actualizarPantalla = () => {

    localStorage.setItem('integrantes', JSON.stringify(integrantes))

    integrantes.forEach(integrante => {
        const template = templateIntegrante.cloneNode(true)

        template.querySelector('h4').textContent = integrante.nombre
        template.querySelectorAll('.eliminar')[0].dataset.id = integrante.id
        
        fragment.appendChild(template)
    })
    listaIntegrantes.innerHTML = ''
    listaIntegrantes.appendChild(fragment)

    if (reunion) {
        sectionPreReunion.classList.add('u-hide')
        sectionEnReunion.classList.add('u-show')

        cardOrador.querySelector('h1').textContent = orador.nombre
    } else {
        sectionPreReunion.classList.remove('u-hide')
        sectionEnReunion.classList.remove('u-show')
    }

    if (integrantes.length > 0) {
        btnIniciar.classList.add('u-show')
    } else {
        btnIniciar.classList.remove('u-show')
    }

    if (termino) { 
        cardOrador.classList.add('u-hide')
        cardTermino.classList.add('u-show')
    } else {
        cardOrador.classList.remove('u-hide')
        cardTermino.classList.remove('u-show')
    }
}

const clickListaIntegrantes = (e) => {
    if (e.target.classList.contains('eliminar')) {
        const id = parseInt(e.target.dataset.id)
        integrantes = integrantes.filter((integrante) => {
            return integrante.id != id
        })
        actualizarPantalla()
    }
    e.stopPropagation()
}

const iniciarReunion = () => {

    integrantes = integrantes.sort((a, b) => {  
        return 0.5 - Math.random();
    })
    reunion = true
    termino = false
    oradorIndex = 0
    orador = integrantes[0]
    orador.estado = 'hablando'

    actualizarPantalla()
}

const restablecer = () => {
    orador = {}
    reunion = false
    oradorIndex = null
    termino = false

    integrantes.forEach(integrante => {
        integrante.estado = 'nohablo'
    })

    actualizarPantalla()
}

const siguiente = () => {
    orador.estado = 'hablo'

    oradorIndex += 1
    if (oradorIndex >= integrantes.length) {
        orador = {}
        termino = true
    } else {
        orador = integrantes[oradorIndex]
        orador.estado = 'hablando'
    }
    actualizarPantalla()
}