const { Router } = require('express');
const reservaController = require('../controllers/reservaController');

const router = Router();

router.get('/', reservaController.obtenerReserva); //Ruta para obtener la reserva
router.post('/confirmar', reservaController.confirmarReserva); //Ruta para confirmar la reserva
router.post("/agregar", reservaController.agregarAlimento);

router.put('/actualizar-porciones/:id', reservaController.actualizarPorciones); // Actualizar las porciones de un alimento reservado
router.delete('/eliminar/:id', reservaController.eliminarAlimento); // Eliminar un alimento de la reserva

module.exports = router;