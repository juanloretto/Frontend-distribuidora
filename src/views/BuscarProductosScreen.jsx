import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBarApp from "../components/SearchBarApp";
import { getProductos } from "../helpers/productsApi";

const BuscarProductosScreen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cliente = state?.cliente;

  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    if (!cliente) {
      console.warn("⚠️ No hay cliente, vuelvo a buscar cliente");
      navigate("/buscar-cliente");
      return;
    }

    console.log("👤 Cliente del pedido:", cliente);

    getProductos()
      .then((resp) => {
        setProductos(resp.productos || []);
      })
      .catch(console.error);
  }, [cliente, navigate]);

  const productosFiltrados =
    productos?.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    ) || [];

  if (!cliente) return null;

  return (
    <div className="container">
      <div className="row text-center mt-5 mb-3">
        <div className="col">
          <h1>Buscar Productos</h1>
          <p>
            Cliente: <strong>{cliente.nombre}</strong>
          </p>
        </div>
      </div>

      <div className="row mb-3">
        <SearchBarApp
          placeholder="Buscar por nombre o código..."
          onSearch={setBusqueda}
        />
      </div>

      <div className="row">
        {productosFiltrados.map((prod) => (
          <div key={prod._id} className="col-12 mb-2">
            {prod.nombre}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuscarProductosScreen;