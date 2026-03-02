import { Navigate, Outlet } from "react-router-dom";


export const AdminRoute = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol !== "ADMIN_ROLE") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
