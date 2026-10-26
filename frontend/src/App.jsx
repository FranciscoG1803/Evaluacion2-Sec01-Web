import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "./pages/InicioP";
import Juego from "./components/Juego";
import Reservas from "./components/Reservas";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/juego" element={<Juego />} />
                <Route path="/reservas" element={<Reservas />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;