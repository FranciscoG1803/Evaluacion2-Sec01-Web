const API_URL = "http://localhost:3000/api/juego";

// Enviar un intento al servidor
export async function enviarIntento(numero) {
    const respuesta = await fetch(`${API_URL}/guess`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ numero })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al enviar el intento");
    }

    return datos;
}

// Reiniciar el juego e iniciar una nueva partida
export async function reiniciarJuego() {
    const respuesta = await fetch(`${API_URL}/reset`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al reiniciar el juego");
    }

    return datos;
}

export { API_URL };
