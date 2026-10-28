// Llamar al archivo de datos
const { menu } = require('../utils/data');

// Obtener el menú
function obtenerMenu(req, res) {
    return res.status(200).json(menu);
}

module.exports = { obtenerMenu };