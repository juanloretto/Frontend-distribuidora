import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import NavBarApp from "./components/NavBarApp";

import HomeScreen from "./views/HomeScreen";
import LoginScreen from "./views/LoginScreen";
import BuscarClientesScreen from "./views/BuscarClientesScreen";
import BuscarProductosScreen from "./views/BuscarProductosScreen";
import VerMisPedidosScreen from "./views/VerMisPedidosScreen";

import PrivateRoute from "./routes/privateRoute";
import { AdminRoute } from "./routes/AdminRoute";
import AdminLayout from "./components/Layouts/AdminLayout";
import AdminUsers from "./views/Admin/AdminUsers";
import AdminClients from "./views/Admin/AdminClients";
import AdminOrders from "./views/Admin/AdminOrders";
import AdminProducts from "./views/Admin/AdminProducts";

function AppWrapper() {
  // 🔹 Obtengo la ruta actual
  const location = useLocation();
  const token = localStorage.getItem("token");

  // 🔹 No mostrar navbar si estamos en login
  const showNavbar = token && location.pathname !== "/login";

  return (
    <>
      {showNavbar && <NavBarApp />}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/" element={<HomeScreen />} />

        {/* Private user routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/nueva-venta" element={<BuscarClientesScreen />} />
          <Route path="/buscar-productos" element={<BuscarProductosScreen />} />
          <Route path="/mis-pedidos" element={<VerMisPedidosScreen />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/usuarios" replace />} />
            <Route path="usuarios" element={<AdminUsers />} />
            <Route path="productos" element={<AdminProducts />} />
            <Route path="clientes" element={<AdminClients />} />
            <Route path="pedidos" element={<AdminOrders />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
