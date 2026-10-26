//Duración de la reserva en milisegundos(minutos * segundos * milisegundos)
const DURACION_RESERVA = 0.1 * 60 * 1000; // 5 minutos

//Datos quemados provicionalmente para el menú
const menu = [
    {
        id: 1,
        nombre: "Pupusas",
        precio: 0.50,
        stock: 25,
        categoria: "Entrada"
    },
    {
        id: 2,
        nombre: "Hamburguesa",
        precio: 2.75,
        stock: 10,
        categoria: "Fuerte"
    },
    {
        id: 3,
        nombre: "Horchata",
        precio: 0.50,
        stock: 20,
        categoria: "Bebida"
    }
];

//Datos quemados provicionalmente para el menú
const reserva = {
    saldo: 25.00,
    itemsReservados: [],
    total: 0,
    estado: "activa",
    fechaExpiracion: Date.now() + DURACION_RESERVA
};

module.exports = { menu, reserva, DURACION_RESERVA };