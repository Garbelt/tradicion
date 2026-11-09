// ==========================================
// LECTOR.JS - LECTOR PARA JUEGO DE PREGUNTAS
// ==========================================

let lecturaActiva = true;
const synth = window.speechSynthesis;
let lecturaPreguntaEnCurso = false;


// ==========================================
// CONFIGURACIÓN
// ==========================================

const CONFIG_LECTOR = {
    idioma: "es-ES",
    velocidad: 0.9,
    tono: 1
};


// ==========================================
// NORMALIZAR TEXTO
// ==========================================

function normalizarTextoLectura(texto) {
    return (texto || "")
        .trim()
        .replace(/\s+/g, " ");
}


// ==========================================
// DETENER LECTURA
// ==========================================

function detenerLectura() {
    lecturaPreguntaEnCurso = false;

    if (synth) {
        synth.cancel();
    }
}


// ==========================================
// HABLAR TEXTO
// ==========================================

function hablar(texto, esPregunta = false, alTerminar = null) {

    if (!texto) {
        if (typeof alTerminar === "function") {
            alTerminar();
        }
        return;
    }

    if (!lecturaActiva || !synth) {
        if (typeof alTerminar === "function") {
            alTerminar();
        }
        return;
    }

    detenerLectura();

    const utterance = new SpeechSynthesisUtterance(
        normalizarTextoLectura(texto)
    );

    utterance.lang = CONFIG_LECTOR.idioma;
    utterance.rate = CONFIG_LECTOR.velocidad;
    utterance.pitch = CONFIG_LECTOR.tono;

    utterance.onend = () => {

        if (esPregunta) {
            lecturaPreguntaEnCurso = false;
        }

        if (typeof alTerminar === "function") {
            alTerminar();
        }
    };

    utterance.onerror = () => {

        if (esPregunta) {
            lecturaPreguntaEnCurso = false;
        }

        if (typeof alTerminar === "function") {
            alTerminar();
        }
    };

    if (esPregunta) {
        lecturaPreguntaEnCurso = true;
    }

    synth.speak(utterance);
}


// ==========================================
// ACTIVAR / DESACTIVAR LECTOR
// ==========================================

function toggleLectura() {

    lecturaActiva = !lecturaActiva;

    if (!lecturaActiva) {
        detenerLectura();
    }

    const boton = document.getElementById("lectorButton");

    if (boton) {
        boton.textContent = lecturaActiva
            ? "🔊 LECTOR ON"
            : "🔇 LECTOR OFF";
    }

    if (lecturaActiva) {
        hablar("Lectura activada");
    }
}


// ==========================================
// LEER ENUNCIADO DE LA PREGUNTA
// ==========================================

function leerPregunta() {

    const pregunta = document.getElementById("question");

    if (!pregunta) {
        return;
    }

    hablar(pregunta.textContent, true);
}


// ==========================================
// LEER OPCIÓN SIN INTERRUMPIR LA PREGUNTA
// ==========================================

function leerOpcion(texto) {

    if (!lecturaActiva || lecturaPreguntaEnCurso) {
        return;
    }

    hablar(texto);
}


// ==========================================
// CONFIGURAR LECTURA DE OPCIONES
// ==========================================

function configurarLecturaOpciones() {

    const opciones = document.querySelectorAll("#options li");

    opciones.forEach(opcion => {

        opcion.onmouseenter = function () {
            leerOpcion(this.textContent);
        };

    });
}


// ==========================================
// CONFIGURAR CLIC SOBRE EL ENUNCIADO
// ==========================================

function configurarLecturaPregunta() {

    const pregunta = document.getElementById("question");

    if (!pregunta) {
        return;
    }

    pregunta.addEventListener("click", leerPregunta);
}


// ==========================================
// CREAR BOTÓN FLOTANTE
// ==========================================

function crearBotonLector() {

    if (document.getElementById("lectorButton")) {
        return;
    }

    const boton = document.createElement("button");

    boton.id = "lectorButton";
    boton.className = "lectorButton";
    boton.textContent = lecturaActiva
        ? "🔊 LECTOR ON"
        : "🔇 LECTOR OFF";

    boton.type = "button";

    boton.addEventListener("click", toggleLectura);

    document.body.appendChild(boton);
}


// ==========================================
// INICIALIZAR LECTOR
// ==========================================

function inicializarLector() {

    crearBotonLector();

    configurarLecturaPregunta();

    console.log("Lector de preguntas activado.");
}


// ==========================================
// EVENTO DE INICIALIZACIÓN
// ==========================================

window.addEventListener(
    "DOMContentLoaded",
    inicializarLector
);