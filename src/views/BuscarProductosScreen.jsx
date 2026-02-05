import { useEffect, useState } from "react";
import { getProductos } from "../helpers/productsApi";
import SearchBarApp from "../components/SearchBarApp";

const BuscarProductosScreen = () => {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getProductos()
      .then((resp) => {
        setProductos(resp.data); // ajustá según tu backend
      })
      .catch(console.error);
  }, []);

  const productosFiltrados = productos.filter(
    (prod) =>
      prod.nombre.toLowerCase().includes(search.toLowerCase()) ||
      prod.codigo?.includes(search)
  );

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