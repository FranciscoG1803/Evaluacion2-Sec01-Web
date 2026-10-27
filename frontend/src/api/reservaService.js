
const API_URL = "http://localhost:3000/api/reservas";
const MENU_URL = "http://localhost:3000/api/menu";

// Procesar las respuestas del servidor
async function procesarRespuesta(respuesta) {
    const datos = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
        throw new Error(
            datos.mensaje || `Error HTTP ${respuesta.status}`
        );
    }

    return datos;
}

// Obtener los alimentos disponibles
export async function obtenerMenu() {
    const respuesta = await fetch(MENU_URL);
    return procesarRespuesta(respuesta);
}

// Consultar la reserva actual
export async function obtenerReserva() {
    const respuesta = await fetch(API_URL);
    return procesarRespuesta(respuesta);
}

// Agregar un alimento a la reserva
export async function agregarAlimento(alimentoId, cantidad) {
    const respuesta = await fetch(`${API_URL}/agregar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            alimentoId,
            cantidad
        })
    });

    return procesarRespuesta(respuesta);
}
                