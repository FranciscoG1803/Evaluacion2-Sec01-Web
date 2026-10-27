
const { reserva, menu, DURACION_RESERVA } = require("../utils/data");

// 1. VERIFICAR VENCIMIENTO DE LA RESERVA

function verificarVencimiento() {
    if (
        reserva.estado === "activa" &&
        Date.now() >= reserva.fechaExpiracion
    ) {
        // Devolver los alimentos al inventario
        reserva.itemsReservados.forEach((item) => {
            const alimento = menu.find(
                (alimento) => alimento.id === item.id
            );

            if (alimento) {
                alimento.stock += item.cantidad;
            }
        });

        // Vaciar la reserva vencida
        reserva.itemsReservados = [];
        reserva.total = 0;
        reserva.estado = "vencida";
    }
}

// 2. OBTENER LA RESERVA ACTUAL


function obtenerReserva(req, res) {
    verificarVencimiento();

    return res.status(200).json(reserva);
}


// 3. AGREGAR ALIMENTOS A LA RESERVA


function agregarAlimento(req, res) {

    // Verificar si la reserva sigue activa
    verificarVencimiento();

    if (reserva.estado !== "activa") {
        return res.status(400).json({
            mensaje: "La reserva no está activa"
        });
    }

    // Obtener los datos enviados desde React
    const { alimentoId, cantidad } = req.body;

    // Validar el ID y la cantidad
    if (
        !Number.isInteger(alimentoId) ||
        !Number.isInteger(cantidad) ||
        cantidad <= 0
    ) {
        return res.status(400).json({
            mensaje: "Alimento o cantidad inválida"
        });
    }

    // Buscar el alimento en el menú
    const alimento = menu.find(
        (item) => item.id === alimentoId
    );

    // Validar que el alimento exista
    if (!alimento) {
        return res.status(404).json({
            mensaje: "Alimento no encontrado"
        });
    }

    // Verificar que exista stock suficiente
    if (alimento.stock < cantidad) {
        return res.status(400).json({
            mensaje: "Stock insuficiente"
        });
    }

    // Calcular el subtotal del alimento
    const subtotal = Number(
        (alimento.precio * cantidad).toFixed(2)
    );

    // Buscar si el alimento ya está reservado
    const existente = reserva.itemsReservados.find(
        (item) => item.id === alimentoId
    );

    if (existente) {
        // Si existe, aumentar la cantidad reservada
        existente.cantidad += cantidad;

        existente.subtotal = Number(
            (existente.cantidad * alimento.precio).toFixed(2)
        );
    } else {
        // Si no existe, agregarlo a la reserva
        reserva.itemsReservados.push({
            id: alimento.id,
            nombre: alimento.nombre,
            precio: alimento.precio,
            cantidad: cantidad,
            subtotal: subtotal
        });
    }

    // Descontar los alimentos del inventario
    alimento.stock -= cantidad;

    // Actualizar el total de la reserva
    reserva.total = Number(
        (reserva.total + subtotal).toFixed(2)
    );

    // Devolver la respuesta al frontend
    return res.status(200).json({
        mensaje: "Alimento agregado correctamente",
        reserva: reserva,
        menu: menu
    });
}

// 4. CONFIRMAR LA RESERVA


function confirmarReserva(req, res) {
    verificarVencimiento();

    // Comprobar que la reserva esté activa
    if (reserva.estado !== "activa") {
        return res.status(400).json({
            mensaje: "No se puede confirmar la reserva. La reserva ha vencido o ya fue confirmada."
        });
    }

    // Comprobar que tenga alimentos reservados
    if (reserva.itemsReservados.length === 0) {
        return res.status(400).json({
            mensaje: "No se puede confirmar la reserva. No hay alimentos reservados."
        });
    }

    // Confirmar la reserva
    reserva.estado = "confirmada";

    return res.status(200).json({
        mensaje: "Reserva guardada, los esperamos con sus alimentos.",
        reserva: reserva
    });
}


// 5. INICIAR UNA NUEVA RESERVA


function nuevaReserva(req, res) {
    verificarVencimiento();

    // Evitar iniciar otra reserva si ya hay una activa
    if (reserva.estado === "activa") {
        return res.status(400).json({
            mensaje: "Ya existe una reserva activa"
        });
    }

    // Reiniciar los datos de la reserva
    reserva.itemsReservados = [];
    reserva.total = 0;
    reserva.estado = "activa";
    reserva.fechaExpiracion = Date.now() + DURACION_RESERVA;

    return res.status(200).json({
        mensaje: "Nueva reserva iniciada correctamente",
        data: reserva
    });
}

// 6. EXPORTAR LAS FUNCIONES


module.exports = {
    obtenerReserva,
    agregarAlimento,
    confirmarReserva,
    nuevaReserva
};
