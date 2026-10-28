
import { useState } from "react";
import {
    enviarIntento,
    reiniciarJuego
} from "../api/juegoService";

function Juego() {
    const [numero, setNumero] = useState("");
    const [intentos, setIntentos] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [resultado, setResultado] = useState("");
    const [gano, setGano] = useState(false);
    const [numeroGanador, setNumeroGanador] = useState(null);
    const [cargando, setCargando] = useState(false);

    async function manejarIntento(e) {
        e.preventDefault();

        if (gano || cargando) return;

        const intento = Number(numero);

        if (
            numero.trim() === "" ||
            !Number.isInteger(intento) ||
            intento < 1 ||
            intento > 100
        ) {
            setMensaje("Ingresa un número entero entre 1 y 100.");
            setResultado("error");
            return;
        }

        setCargando(true);

        try {
            const datos = await enviarIntento(intento);

            setMensaje(datos.mensaje);
            setResultado(datos.resultado);

            if (datos.resultado === "correcto") {
                setGano(true);
                setNumeroGanador(intento);
            } else {
                setIntentos((anteriores) => [
                    ...anteriores,
                    {
                        numero: intento,
                        pista: datos.mensaje
                    }
                ]);
            }

            setNumero("");
        } catch (error) {
            setMensaje(error.message);
            setResultado("error");
        } finally {
            setCargando(false);
        }
    }

    // Iniciar una nueva partida y limpiar los estados
    async function manejarReinicio() {
        if (cargando) return;

        setCargando(true);

        try {
            const datos = await reiniciarJuego();

            setNumero("");
            setIntentos([]);
            setMensaje(datos.mensaje);
            setResultado("");
            setGano(false);
            setNumeroGanador(null);
        } catch (error) {
            setMensaje(error.message);
            setResultado("error");
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className="container py-5">
            <section
                className="card border-0 shadow-lg rounded-4 overflow-hidden mx-auto"
                style={{ maxWidth: "680px" }}
            >
                {/* CABECERA */}
                <div className="bg-primary-subtle p-4 p-md-5 text-center">
                    <h1 className="fw-bold text-primary-emphasis mb-2 fs-2">
                        Adivina el número
                    </h1>

                    <p className="text-secondary mb-0">
                        Elige un número entre 1 y 100.
                    </p>
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div className="card-body p-4 p-md-5">
                    <form onSubmit={manejarIntento}>
                        <label
                            htmlFor="numero"
                            className="form-label fw-semibold"
                        >
                            Ingresa tu número
                        </label>

                        <div className="row g-3">
                            <div className="col-12 col-sm-7">
                                <input
                                    id="numero"
                                    type="number"
                                    min="1"
                                    max="100"
                                    step="1"
                                    className="form-control form-control-lg"
                                    placeholder="Ej. 45"
                                    value={numero}
                                    onChange={(e) =>
                                        setNumero(e.target.value)
                                    }
                                    disabled={gano || cargando}
                                    required
                                />
                            </div>

                            <div className="col-12 col-sm-5">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100"
                                    disabled={gano || cargando}
                                >
                                    {cargando
                                        ? "Comprobando..."
                                        : "Adivinar"}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* MENSAJE DEL SERVIDOR */}
                    {mensaje && (
                        <div
                            className={`alert ${
                                resultado === "error"
                                    ? "alert-danger"
                                    : gano
                                    ? "alert-success"
                                    : "alert-info"
                            } mt-4 mb-0`}
                            role="status"
                        >
                            {mensaje}
                        </div>
                    )}

                    <hr className="my-4" />

                    {/* HISTORIAL */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="h5 fw-bold mb-0">
                            Historial de intentos
                        </h2>

                        <span className="badge rounded-pill text-bg-secondary">
                            {intentos.length} fallidos
                        </span>
                    </div>

                    {intentos.length === 0 ? (
                        <p className="text-body-secondary">
                            Todavía no tienes intentos fallidos.
                        </p>
                    ) : (
                        <ul className="list-group">
                            {intentos.map((item, index) => (
                                <li
                                    key={index}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <div>
                                        <span className="fw-semibold">
                                            Intento {index + 1}
                                        </span>

                                        <small className="d-block text-body-secondary">
                                            {item.pista}
                                        </small>
                                    </div>

                                    <span className="badge text-bg-light border fs-6">
                                        {item.numero}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {gano && (
                        <p className="text-success text-center fw-bold mt-4">
                            ¡Felicidades! Has ganado, el numero era {numeroGanador}. 
                        </p>
                    )}

                    {/* BOTÓN PARA NUEVA PARTIDA */}
                    <div className="d-grid mt-4">
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={manejarReinicio}
                            disabled={cargando}
                        >
                            {cargando
                                ? "Iniciando partida..."
                                : "Nueva partida"}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Juego;
