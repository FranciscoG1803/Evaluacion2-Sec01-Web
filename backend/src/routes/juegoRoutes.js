const { Router } = require('express');
const juegoController = require('../controllers/juegoController');

const router = Router();

router.post('/adivinar', juegoController.adivinarNumero);

module.exports = router;