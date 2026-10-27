const API_URL = "http://localhost:3000/api/juego";

// Aquí se agregarán las peticiones del juego.


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

export { API_URL };