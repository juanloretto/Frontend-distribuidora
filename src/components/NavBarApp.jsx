import { Link, useNavigate } from "react-router-dom";

const NavBarApp = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          GRUPO FERREPINT
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="offcanvas offcanvas-end text-bg-dark"
          id="offcanvasNavbar"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Menú</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
            />
          </div>

          <div className="offcanvas-body">
            {!token ? (
              <button
                className="btn btn-outline-light w-100"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            ) : (
              <ul className="navbar-nav flex-grow-1 pe-3">
                <li className="nav-item">
                  <Link className="nav-link" to="/pedidos">
                    Pedidos
                  </Link>
                </li>

                <li className="nav-item">
                  <button
                    className="nav-link text-danger bg-transparent border-0"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBarApp;
