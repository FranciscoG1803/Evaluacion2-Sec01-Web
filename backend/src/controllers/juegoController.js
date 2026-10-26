//Variable para almacenar el número secreto
let numeroSecreto = Math.floor(Math.random() * 100) + 1;

//Función para adivinar el número
const adivinarNumero = (req, res) => {
    const { numero } = req.body;

    //Validación de si el valor ingresado es un número entero entre 1 y 100
    if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
        return res.status(400).json({
            mensaje: "Ingresa un número entero entre 1 y 100."
        });
    }

    //Validación de que se encontró el número secreto
    if (numero === numeroSecreto) {
        return res.json({
            mensaje: "¡Felicidades! Adivinaste el número.",
            resultado: "correcto"
        });
    }

    //Validación de si el número ingresado es mayor que el número secreto
    if (numero > numeroSecreto) {
        return res.json({
            mensaje: "El número secreto es menor.",
            resultado: "menor"
        });
    }

    //En caso de que no se cumpla ninguna de las condiciones anteriores, significa que el número ingresado es menor que el número secreto
    return res.json({
        mensaje: "El número secreto es mayor.",
        resultado: "mayor"
    });
};

module.exports = { adivinarNumero};