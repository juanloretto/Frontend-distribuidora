import { Link } from "react-router-dom";

const HomeScreen = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col">
          <div className="d-grid gap-2">
            
            <Link to="/nueva-venta" className="btn btn-primary mb-3">
              Nueva Venta
            </Link>

            <Link to="/mis-pedidos" className="btn btn-outline-primary">
              Ver mis pedidos
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;