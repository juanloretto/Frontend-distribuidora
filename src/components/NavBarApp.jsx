import { Link } from "react-router-dom";

const NavBarApp = () => {
  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand" to="/">
          GRUPO FERREPINT
        </Link>

        {/* Toggle button (mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Offcanvas menu */}
        <div
          className="offcanvas offcanvas-end text-bg-dark"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Menú
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Productos
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/categorias">
                  Categorías
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/pedidos">
                  Pedidos
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-danger" to="/logout">
                  Cerrar sesión
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBarApp;
