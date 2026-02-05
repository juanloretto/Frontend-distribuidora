import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./views/HomeScreen";
import BuscarProductosScreen from "./views/BuscarProductosScreen";
import NavBarApp from "./components/NavBarApp";
import VerMisPedidosScreen from "./views/VerMisPedidosScreen";

function App() {
  return (
    <BrowserRouter>
      <NavBarApp />

      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/nueva-venta" element={<BuscarProductosScreen />} />
        <Route path="/mis-pedidos" element={<VerMisPedidosScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
