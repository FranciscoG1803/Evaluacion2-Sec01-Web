
const { Router } = require("express");
const juegoController = require("../controllers/juegoController");

const router = Router();

// Enviar un intento al juego
router.post("/guess", juegoController.adivinarNumero);

// Iniciar una nueva partida
router.post("/reset", juegoController.reiniciarJuego);

module.exports = router;
