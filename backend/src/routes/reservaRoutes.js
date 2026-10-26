const { Router } = require('express');
const reservaController = require('../controllers/reservaController');

const router = Router();

router.get('/', reservaController.obtenerReserva);

module.exports = router;