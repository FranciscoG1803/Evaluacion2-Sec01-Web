import { Link } from "react-router-dom";
import "./InicioP.css";

function InicioP() {
    return (
        <main className="container-fluid p-0">
            <div className="row g-0">
                {/* Panel del juego */}
                <section className="col-12 col-md-6 inicio-panel panel-juego d-flex justify-content-center align-items-center">
                    <div className="inicio-contenido text-center p-4 rounded-4">
                        <h2 className="fw-semibold mb-4"> Adivina el Número </h2>
                        <Link to="/juego" className="btn inicio-boton w-100 fw-semibold">Entrar</Link>
                    </div>
                </section>
                {/* Panel de reservas */}
                <section className="col-12 col-md-6 inicio-panel panel-reservas d-flex justify-content-center align-items-center">
                    <div className="inicio-contenido text-center p-4 rounded-4">
                        <h2 className="fw-semibold mb-4"> Food DEI </h2>
                        <Link to="/reservas" className="btn inicio-boton w-100 fw-semibold"> Entrar </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default InicioP;
