// Llamar al archivo de datos
const { reserva, menu, DURACION_RESERVA } = require('../utils/data');

//Función para verificar si la reserva ha vencido
function verificarVencimiento() {
    if (reserva.estado === 'activa' && Date.now() >= reserva.fechaExpiracion) {
        // Devolver los alimentos reservados al inventario
        reserva.itemsReservados.forEach(item => {
            const alimento = menu.find(
                alimento => alimento.id === item.id
            );

            if (alimento) {
                alimento.stock += item.cantidad;
            }
        });

        // Vaciar la reserva
        reserva.itemsReservados = [];
        reserva.total = 0;
        reserva.estado = 'vencida';
    }
}

//Funcion para confirmar la reserva
function confirmarReserva(req, res) {
    verificarVencimiento();

    //Validación por si la reserva no esta activa
    if (reserva.estado !== 'activa') {
        return res.status(400).json({
            mensaje: 'No se puede confirmar la reserva. La reserva ha vencido o ya fue confirmada.'
        });
    }

    //Validación por si no hay alimentos reservados
    if (reserva.itemsReservados.length === 0) {
        return res.status(400).json({
            mensaje: 'No se puede confirmar la reserva. No hay alimentos reservados.'
        });
    }

    //En caso de que la reserva este activa y haya alimentos reservados, se confirma la reserva
    reserva.estado = 'confirmada';

    return res.status(200).json({
        mensaje: 'Reserva guardada, los esperamos con sus alimentos.',
        reserva: reserva
    });
}

// Iniciar una nueva reserva
function nuevaReserva(req, res) {
    verificarVencimiento();

    if (reserva.estado === 'activa') {
        return res.status(400).json({
            mensaje: 'Ya existe una reserva activa'
        });
    }

    reserva.itemsReservados = [];
    reserva.total = 0;
    reserva.estado = 'activa';
    reserva.fechaExpiracion = Date.now() + DURACION_RESERVA;

    return res.status(200).json({
        mensaje: 'Nueva reserva iniciada correctamente',
        data: reserva
    });
}

// Obtener la reserva
function obtenerReserva(req, res) {
    verificarVencimiento();
    
    return res.status(200).json(reserva);
}

module.exports = { obtenerReserva, confirmarReserva, nuevaReserva };