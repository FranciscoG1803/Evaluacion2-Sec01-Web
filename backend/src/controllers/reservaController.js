// Llamar al archivo de datos
const { reserva } = require('../utils/data');

// Obtener la reserva
function obtenerReserva(req, res) {
    return res.status(200).json(reserva);
}

module.exports = { obtenerReserva };