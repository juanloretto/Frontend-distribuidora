import { NavLink, Outlet } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-container mt-3">
      {/* SubNav Full Width */}
      <div className="admin-subnav-wrapper rounded">
        <div className="admin-subnav rounded">
          <ul className="nav justify-content-center">
            <li className="nav-item p-2">
              <NavLink
                to="usuarios"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Usuarios
              </NavLink>
            </li>

            <li className="nav-item  p-2">
              <NavLink
                to="productos"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Productos
              </NavLink>
            </li>

            <li className="nav-item p-2">
              <NavLink
                to="pedidos"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Pedidos
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/* Contenido dinámico */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
