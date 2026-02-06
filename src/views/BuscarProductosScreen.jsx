import { useEffect, useState } from "react";
import SearchBarApp from "../components/SearchBarApp";
import { getProductos } from "../helpers/productsApi";

const BuscarProductosScreen = () => {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");
const [busqueda, setBusqueda] = useState("");
  useEffect(() => {
    getProductos()
      .then((resp) => {
        setProductos(resp.productos || []); // ajustá según tu backend
      })
      .catch(console.error);
  }, []);
  console.log("📦 productos:", productos);
  const productosFiltrados =
    productos?.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
    ) || [];

  return (
    <div className="container">
      <div className="row text-center mt-5 mb-5">
        <div className="col">
          <h1>Buscar Productos</h1>
        </div>
      </div>

      <div className="row mb-3">
        <SearchBarApp
          placeholder="Buscar por nombre o código..."
          onSearch={setSearch}
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
