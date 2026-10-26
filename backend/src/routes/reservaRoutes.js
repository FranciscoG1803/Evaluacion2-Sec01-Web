const { Router } = require('express');
const reservaController = require('../controllers/reservaController');

const router = Router();

router.get('/', reservaController.obtenerReserva); //Ruta para obtener la reserva
router.post('/confirmar', reservaController.confirmarReserva); //Ruta para confirmar la reserva
router.post('/nueva', reservaController.nuevaReserva); //Ruta para iniciar una nueva reserva

module.exports = router;