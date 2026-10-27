
import { useState, useEffect } from "react";

import {
    obtenerMenu,
    obtenerReserva,
    agregarAlimento
} from "../api/reservaService";

function Reservas() {
    // ESTADOS
    const [menu, setMenu] = useState([]);
    const [reserva, setReserva] = useState(null);
    const [alimentoId, setAlimentoId] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("info");
    const [cargando, setCargando] = useState(true);
    const [enviando, setEnviando] = useState(false);

    // CARGAR LOS DATOS DEL BACKEND
    useEffect(() => {
        async function cargarDatos() {
            try {
                const [datosMenu, datosReserva] = await Promise.all([
                    obtenerMenu(),
                    obtenerReserva()
                ]);

                setMenu(datosMenu);
                setReserva(datosReserva);
            } catch (error) {
                setMensaje(error.message);
                setTipoMensaje("danger");
            } finally {
                setCargando(false);
            }
        }

        cargarDatos();
    }, []);

    // AGREGAR UN ALIMENTO
    async function manejarAgregar(e) {
        e.preventDefault();

        if (enviando) return;

        const id = Number(alimentoId);
        const cantidadSolicitada = Number(cantidad);

        if (
            !alimentoId ||
            !Number.isInteger(cantidadSolicitada) ||
            cantidadSolicitada <= 0
        ) {
            setMensaje("Selecciona un alimento y una cantidad válida.");
            setTipoMensaje("warning");
            return;
        }

        setEnviando(true);
        setMensaje("");

        try {
            const respuesta = await agregarAlimento(
                id,
                cantidadSolicitada
            );

            // Consultamos los datos actualizados
            const [nuevoMenu, nuevaReserva] = await Promise.all([
                obtenerMenu(),
                obtenerReserva()
            ]);

            setMenu(nuevoMenu);
            setReserva(nuevaReserva);

            setMensaje(
                respuesta.mensaje || "Alimento agregado correctamente."
            );
            setTipoMensaje("success");
            setCantidad(1);

        } catch (error) {
            setMensaje(error.message);
            setTipoMensaje("danger");
        } finally {
            setEnviando(false);
        }
    }

    if (cargando) {
        return (
            <div className="container py-5 text-center">
                <p>Cargando menú...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">

            <section
                className="card border-0 shadow-lg rounded-4 overflow-hidden mx-auto"
                style={{ maxWidth: "760px" }}
            >

                {/* CABECERA */}
                <div className="bg-success-subtle p-4 text-center">

                    <h1 className="fw-bold text-success-emphasis fs-2">
                        Sistema de reservas
                    </h1>

                    <p className="text-secondary mb-0">
                        Selecciona tus alimentos favoritos
                        y agrégalos a tu reserva.
                    </p>

                </div>

                <div className="card-body p-4">

                    {/* MENÚ DISPONIBLE */}
                    <h2 className="h5 fw-bold mb-3">
                        Menú disponible
                    </h2>

                    <ul className="list-group mb-4">
                        {menu.map((alimento) => (
                            <li
                                key={alimento.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <span className="fw-semibold">
                                        {alimento.nombre}
                                    </span>

                                    <small className="d-block text-body-secondary">
                                        {alimento.categoria} |
                                        Stock: {alimento.stock}
                                    </small>
                                </div>

                                <span className="badge text-bg-success">
                                    ${Number(alimento.precio).toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* FORMULARIO */}
                    <h2 className="h5 fw-bold mb-3">
                        Agregar alimento
                    </h2>

                    <form onSubmit={manejarAgregar}>

                        <div className="row g-3 mb-3">

                            <div className="col-12 col-md-8">
                                <label className="form-label">
                                    Selecciona un alimento
                                </label>

                                <select
                                    className="form-select"
                                    value={alimentoId}
                                    onChange={(e) => setAlimentoId(e.target.value)}
                                    disabled={enviando}
                                    required
                                >
                                    <option value="">
                                        Seleccionar...
                                    </option>

                                    {menu.map((alimento) => (
                                        <option
                                            key={alimento.id}
                                            value={alimento.id}
                                            disabled={alimento.stock === 0}
                                        >
                                            {alimento.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 col-md-4">
                                <label className="form-label">
                                    Cantidad
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    className="form-control"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    disabled={enviando}
                                    required
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-success w-100"
                            disabled={enviando || reserva?.estado !== "activa"}
                        >
                            {enviando ? "Agregando..." : "Agregar a mi reserva"}
                        </button>

                    </form>

                    {/* MENSAJES */}
                    {mensaje && (
                        <div
                            className={`alert alert-${tipoMensaje} mt-3`}
                            role="status"
                        >
                            {mensaje}
                        </div>
                    )}

                    <hr className="my-4" />

                    {/* RESERVA ACTUAL */}
                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <h2 className="h5 fw-bold mb-0">
                            Mi reserva
                        </h2>

                        <span className="badge text-bg-secondary">
                            {reserva?.estado || "Desconocida"}
                        </span>

                    </div>

                    {reserva?.itemsReservados?.length > 0 ? (
                        <ul className="list-group mb-3">

                            {reserva.itemsReservados.map((item, index) => (
                                <li
                                    key={item.id ?? index}
                                    className="list-group-item d-flex justify-content-between"
                                >
                                    <span>
                                        {item.cantidad} x {item.nombre}
                                    </span>

                                    {item.subtotal != null && (
                                        <span>
                                            ${Number(item.subtotal).toFixed(2)}
                                        </span>
                                    )}
                                </li>
                            ))}

                        </ul>
                    ) : (
                        <p className="text-body-secondary">
                            Tu reserva está vacía.
                        </p>
                    )}

                    {/* TOTAL */}
                    <div className="bg-body-tertiary p-3 rounded-3 d-flex justify-content-between align-items-center">

                        <span className="fw-bold">
                            Total
                        </span>

                        <span className="fs-4 fw-bold text-success">
                            ${Number(reserva?.total ?? 0).toFixed(2)}
                        </span>

                    </div>

                </div>
            </section>
        </div>
    );
}

export default Reservas;
