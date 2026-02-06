import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./views/HomeScreen";
import BuscarProductosScreen from "./views/BuscarProductosScreen";
import NavBarApp from "./components/NavBarApp";
import VerMisPedidosScreen from "./views/VerMisPedidosScreen";
import LoginScreen from "./views/LoginScreen";
import BuscarClientesScreen from "./views/BuscarClientesScreen";

function App() {
  return (
    <BrowserRouter>
      <NavBarApp />

      <Routes>
        
        <Route path="/login" element={<LoginScreen/>} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="/nueva-venta" element={<BuscarClientesScreen />} />
        <Route path="/buscar-productos" element={<BuscarProductosScreen />} />
        <Route path="/mis-pedidos" element={<VerMisPedidosScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
