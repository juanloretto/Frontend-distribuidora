import { Link, useNavigate } from "react-router-dom";
import "./NavBarApp.css"; // CSS personalizado
import Logo from "../assets/images/GFPLOGO.png";

const NavBarApp = () => {
  const navigate = useNavigate();

  // 🔹 Obtener usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario")); // { uid, nombre, email, rol }
  const token = localStorage.getItem("token");

  // 🔹 Si no hay token o usuario, no renderizamos el navbar
  if (!token || !usuario) return null;

  const rol = usuario.rol;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top shadow-sm">
      <div className="container-fluid h-100">
        <div className="logo-container">
          <Link
            className="navbar-brand d-flex align-items-center w-100 h-100"
            to="/"
          >
            <img
              src={Logo}
              alt="Logo Grupo Ferrepint"
              className="navbar-logo"
            />
            <span className="ms-3">Grupo Ferrepint</span>
          </Link>
        </div>

        {/* Botón hamburguesa */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú Offcanvas */}
        <div
          className="offcanvas offcanvas-end text-bg-dark"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header border-bottom">
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
            <ul className="navbar-nav flex-grow-1 pe-3">
              <li className="nav-item">
                <Link className="nav-link" to="/mis-pedidos">
                  Mis Pedidos
                </Link>
              </li>

              {/* 🔹 Solo mostrar administración si el usuario es admin */}
              {rol === "ADMIN_ROLE" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    Administración
                  </Link>
                </li>
              )}

              <li className="nav-item mt-2">
                <button
                  className="btn btn-outline-danger w-100"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBarApp;
