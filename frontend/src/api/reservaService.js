
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


//Actualizar la cantidad de porciones de un alimento reservado.
 
export async function actualizarPorciones(alimentoId, cantidad) {
    const respuesta = await fetch(
        `${API_URL}/actualizar-porciones/${alimentoId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ cantidad })
        }
    );

    return procesarRespuesta(respuesta);
}

// Eliminar un alimento de la reserva.
 
export async function eliminarAlimento(alimentoId) {
    const respuesta = await fetch(
        `${API_URL}/eliminar/${alimentoId}`,
        {
            method: "DELETE"
        }
    );

    return procesarRespuesta(respuesta);
}

// Confirmar la reserva de alimentos

export async function confirmarReserva() {
    const respuesta = await fetch(`${API_URL}/confirmar`, {
        method: "POST"
    });

    return procesarRespuesta(respuesta);
}
