const express = require("express");
const cors = require("cors");

const juegoRoutes = require("./routes/juegoRoutes");
const reservaRoutes = require("./routes/reservaRoutes");
const menuRoutes = require("./routes/menuRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensaje: "API funcionando correctamente"
    });
});

// Rutas
app.use("/api/juego", juegoRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/api/menu", menuRoutes);

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});