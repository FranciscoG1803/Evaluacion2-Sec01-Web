
import { useState, useEffect } from "react";

import {
    obtenerMenu,
    obtenerReserva,
    agregarAlimento,
    actualizarPorciones,
    eliminarAlimento
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
    async function cargarDatos() {
        const [datosMenu, datosReserva] = await Promise.all([
            obtenerMenu(),
            obtenerReserva()
        ]);

        setMenu(datosMenu);
        setReserva(datosReserva);
    }

    useEffect(() => {
        async function iniciar() {
            try {
                await cargarDatos();
            } catch (error) {
                setMensaje(error.message);
                setTipoMensaje("danger");
            } finally {
                setCargando(false);
            }
        }

        iniciar();
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

            await cargarDatos();

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

    // ACTUALIZAR LAS PORCIONES DE UN ALIMENTO
    async function manejarActualizar(item, nuevaCantidad) {
        if (enviando || nuevaCantidad < 1) return;

        setEnviando(true);
        setMensaje("");

        try {
            const respuesta = await actualizarPorciones(
                item.id,
                nuevaCantidad
            );

            await cargarDatos();

            setMensaje(
                respuesta.mensaje || "Porciones actualizadas correctamente."
            );
            setTipoMensaje("success");
        } catch (error) {
            setMensaje(error.message);
            setTipoMensaje("danger");
        } finally {
            setEnviando(false);
        }
    }

    // ELIMINAR UN ALIMENTO
    async function manejarEliminar(item) {
        if (enviando) return;

        setEnviando(true);
        setMensaje("");

        try {
            const respuesta = await eliminarAlimento(item.id);

            await cargarDatos();

            setMensaje(
                respuesta.mensaje || "Alimento eliminado correctamente."
            );
            setTipoMensaje("success");
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

    // CALCULAR EL SALDO RESTANTE
    const saldoDisponible = Math.max(
        0,
        Number((Number(reserva?.saldo ?? 0) - Number(reserva?.total ?? 0)).toFixed(2))
    );

    const reservaActiva = reserva?.estado === "activa";

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
                        Selecciona tus alimentos favoritos y agrégalos a tu reserva.
                    </p>
                </div>

                <div className="card-body p-4">
                    {/* INFORMACIÓN DEL SALDO */}
                    <div className="alert alert-info d-flex justify-content-between flex-wrap gap-2">
                        <span>
                            <strong>Saldo disponible:</strong>{" "}
                            ${saldoDisponible.toFixed(2)}
                        </span>

                        <span>
                            <strong>Total de la reserva:</strong>{" "}
                            ${Number(reserva?.total ?? 0).toFixed(2)}
                        </span>
                    </div>

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
                                        {alimento.categoria} | Stock: {alimento.stock}
                                    </small>
                                </div>

                                <span className="badge text-bg-success">
                                    ${Number(alimento.precio).toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* FORMULARIO PARA AGREGAR ALIMENTOS */}
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
                                    disabled={enviando || !reservaActiva}
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
                                            {alimento.nombre} - Stock: {alimento.stock}
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
                                    disabled={enviando || !reservaActiva}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success w-100"
                            disabled={enviando || !reservaActiva}
                        >
                            {enviando ? "Procesando..." : "Agregar a mi reserva"}
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
                            {reserva.itemsReservados.map((item) => (
                                <li
                                    key={item.id}
                                    className="list-group-item"
                                >
                                    <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
                                        <div>
                                            <span className="fw-semibold">
                                                {item.nombre}
                                            </span>

                                            <small className="d-block text-body-secondary">
                                                ${Number(item.precio).toFixed(2)} por porción
                                            </small>
                                        </div>

                                        <div className="d-flex align-items-center gap-2">
                                            {/* DISMINUIR PORCIONES */}
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() =>
                                                    manejarActualizar(
                                                        item,
                                                        item.cantidad - 1
                                                    )
                                                }
                                                disabled={
                                                    enviando ||
                                                    !reservaActiva ||
                                                    item.cantidad <= 1
                                                }
                                                aria-label={`Disminuir porciones de ${item.nombre}`}
                                            >
                                                −
                                            </button>

                                            <span className="fw-semibold">
                                                {item.cantidad}
                                            </span>

                                            {/* AUMENTAR PORCIONES */}
                                            <button
                                                type="button"
                                                className="btn btn-outline-success btn-sm"
                                                onClick={() =>
                                                    manejarActualizar(
                                                        item,
                                                        item.cantidad + 1
                                                    )
                                                }
                                                disabled={enviando || !reservaActiva}
                                                aria-label={`Aumentar porciones de ${item.nombre}`}
                                            >
                                                +
                                            </button>

                                            {/* ELIMINAR ALIMENTO */}
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => manejarEliminar(item)}
                                                disabled={enviando || !reservaActiva}
                                            >
                                                Quitar
                                            </button>
                                        </div>

                                        <span className="fw-semibold">
                                            ${Number(item.subtotal).toFixed(2)}
                                        </span>
                                    </div>
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
