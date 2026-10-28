
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

    // Verificar si la reserva sigue activa.
    verificarVencimiento();

    if (reserva.estado !== "activa") {
        return res.status(400).json({
            mensaje: "La reserva no está activa"
        });
    }

    // Obtener los datos enviados desde React.
    const { alimentoId, cantidad } = req.body;

    // Validar el ID y la cantidad.
    if (
        !Number.isInteger(alimentoId) ||
        !Number.isInteger(cantidad) ||
        cantidad <= 0
    ) {
        return res.status(400).json({
            mensaje: "Alimento o cantidad inválida"
        });
    }

    // Buscar el alimento en el menú.
    const alimento = menu.find(
        (item) => item.id === alimentoId
    );

    // Validar que el alimento exista.
    if (!alimento) {
        return res.status(404).json({
            mensaje: "Alimento no encontrado"
        });
    }

    // Verificar que exista stock suficiente.
    if (alimento.stock < cantidad) {
        return res.status(400).json({
            mensaje: "Stock insuficiente"
        });
    }

    // Calcular el subtotal del alimento.
    const subtotal = Number(
        (alimento.precio * cantidad).toFixed(2)
    );

    // Calcular el total que tendría la reserva si se agrega.
    const nuevoTotal = Number(
        (reserva.total + subtotal).toFixed(2)
    );

    // Verificar que el nuevo total no supere el saldo.
    if (nuevoTotal > reserva.saldo) {
        return res.status(400).json({
            mensaje: "Saldo insuficiente. No puedes superar el límite de $25.00."
        });
    }

    // Buscar si el alimento ya está reservado.
    const existente = reserva.itemsReservados.find(
        (item) => item.id === alimentoId
    );

    if (existente) {
        // Si existe, aumentar la cantidad reservada.
        existente.cantidad += cantidad;

        existente.subtotal = Number(
            (existente.cantidad * alimento.precio).toFixed(2)
        );
    } else {
        // Si no existe, agregarlo a la reserva.
        reserva.itemsReservados.push({
            id: alimento.id,
            nombre: alimento.nombre,
            precio: alimento.precio,
            cantidad: cantidad,
            subtotal: subtotal
        });
    }

    // Descontar los alimentos del inventario.
    alimento.stock -= cantidad;

    // Actualizar el total con el valor previamente validado.
    reserva.total = nuevoTotal;

    // Devolver la respuesta al frontend.
    return res.status(200).json({
        mensaje: "Alimento agregado correctamente",
        reserva: reserva,
        menu: menu
    });
}

  //3.1 Actualiza la cantidad de porciones de un alimento reservado.
 
function actualizarPorciones(req, res) {
    verificarVencimiento();

    // Verificar que la reserva siga activa.
    if (reserva.estado !== "activa") {
        return res.status(400).json({
            mensaje: "La reserva no está activa"
        });
    }

    // Obtener el ID desde la URL y la nueva cantidad desde el cuerpo.
    const id = Number(req.params.id);
    const { cantidad } = req.body;

    // Validar los datos recibidos.
    if (
        !Number.isInteger(id) ||
        !Number.isInteger(cantidad) ||
        cantidad <= 0
    ) {
        return res.status(400).json({
            mensaje: "El alimento o la cantidad son inválidos"
        });
    }

    // Buscar el alimento en la reserva.
    const itemReservado = reserva.itemsReservados.find(
        (item) => item.id === id
    );

    if (!itemReservado) {
        return res.status(404).json({
            mensaje: "El alimento no está en la reserva"
        });
    }

    // Buscar el alimento original en el menú.
    const alimento = menu.find((item) => item.id === id);

    if (!alimento) {
        return res.status(404).json({
            mensaje: "Alimento no encontrado"
        });
    }

    // Calcular la diferencia entre la cantidad nueva y la actual.
    const diferencia = cantidad - itemReservado.cantidad;

    // Si se quieren agregar porciones, verificar el stock disponible.
    if (diferencia > 0 && alimento.stock < diferencia) {
        return res.status(400).json({
            mensaje: "Stock insuficiente"
        });
    }

    // Calcular el nuevo subtotal y el nuevo total.
    const nuevoSubtotal = Number(
        (itemReservado.precio * cantidad).toFixed(2)
    );

    const nuevoTotal = Number(
        (
            reserva.total -
            itemReservado.subtotal +
            nuevoSubtotal
        ).toFixed(2)
    );

    // Validar que el nuevo total no supere el saldo disponible.
    if (nuevoTotal > reserva.saldo) {
        return res.status(400).json({
            mensaje: "Saldo insuficiente para esta cantidad"
        });
    }

    // Actualizar el inventario según el cambio de porciones.
    alimento.stock -= diferencia;

    // Actualizar la cantidad y el subtotal del alimento.
    itemReservado.cantidad = cantidad;
    itemReservado.subtotal = nuevoSubtotal;

    // Guardar el nuevo total de la reserva.
    reserva.total = nuevoTotal;

    return res.status(200).json({
        mensaje: "Porciones actualizadas correctamente",
        reserva,
        menu
    });
}

// 3.2 Eliminar un alimento de la reserva y devuevlve sus porciones al inventario.

function eliminarAlimento(req, res) {
    verificarVencimiento();

    // Verificar que la reserva siga activa.
    if (reserva.estado !== "activa") {
        return res.status(400).json({
            mensaje: "La reserva no está activa"
        });
    }

    // Obtener el ID del alimento desde la URL.
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            mensaje: "El ID del alimento es inválido"
        });
    }

    // Buscar el alimento dentro de la reserva.
    const indice = reserva.itemsReservados.findIndex(
        (item) => item.id === id
    );

    if (indice === -1) {
        return res.status(404).json({
            mensaje: "El alimento no está en la reserva"
        });
    }

    // Obtener los datos del alimento que se eliminará.
    const itemEliminado = reserva.itemsReservados[indice];

    // Devolver las porciones al inventario.
    const alimento = menu.find(
        (item) => item.id === id
    );

    if (alimento) {
        alimento.stock += itemEliminado.cantidad;
    }

    // Descontar el subtotal del total de la reserva.
    reserva.total = Number(
        (reserva.total - itemEliminado.subtotal).toFixed(2)
    );

    // Eliminar el alimento de la lista de reservados.
    reserva.itemsReservados.splice(indice, 1);

    return res.status(200).json({
        mensaje: "Alimento eliminado correctamente",
        reserva,
        menu
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

// 5. EXPORTAR LAS FUNCIONES


module.exports = {
    obtenerReserva,
    agregarAlimento,
    actualizarPorciones,
    eliminarAlimento,
    confirmarReserva
};