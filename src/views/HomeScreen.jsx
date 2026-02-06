import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
const HomeScreen = () => {
  const [usuario, setUsuario] = useState(null);
   useEffect(() => {
    const usuarioLS = localStorage.getItem("usuario");

    if (usuarioLS) {
      setUsuario(JSON.parse(usuarioLS));
    }
  }, []);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col">
           {usuario ? (
            <h2 className="fw-bold mb-5">
              Bienvenido {usuario.nombre}
            </h2>
          ) : (
            <h2 className="fw-bold">
              Bienvenido
            </h2>
          )}
          <div className="d-grid gap-2">
            
            <Link to="/nueva-venta" className="btn btn-danger mb-3">
              Nueva Venta
            </Link>

            <Link to="/mis-pedidos" className="btn btn-outline-secondary">
              Ver mis pedidos
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;