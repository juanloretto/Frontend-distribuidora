import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBarApp from "../components/SearchBarApp";
import { getProductos } from "../helpers/productsApi";
import ConfirmModal from "../components/ConfirmModal";
import { crearPedido } from "../helpers/crearPedidoApi";

const STORAGE_KEY = "pedido_en_proceso";
const PRODUCTOS_POR_PAGINA = 12;

const BuscarProductosScreen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cliente = state?.cliente;

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pedidoProductos, setPedidoProductos] = useState([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔄 Cargar pedido guardado
  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      setPedidoProductos(JSON.parse(guardado));
    }
  }, []);

  // 🔄 Guardar pedido automáticamente
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidoProductos));
  }, [pedidoProductos]);

  // 🔄 Resetear página cuando cambia búsqueda
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  // 🚀 Cargar productos desde backend paginados
  useEffect(() => {
    if (!cliente) {
      navigate("/nueva-venta");
      return;
    }

    const cargarProductos = async () => {
      try {
        setLoading(true);

        const resp = await getProductos({
          pagina: paginaActual,
          limite: PRODUCTOS_POR_PAGINA,
          termino: busqueda,
        });

        setProductos(resp.productos || []);
        setTotalPaginas(resp.totalPaginas || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, [cliente, paginaActual, busqueda, navigate]);

  if (!cliente) return null;

  // 🔄 Cambiar cantidad
  const cambiarCantidad = (producto, cantidad) => {
    const cantidadNum = Number(cantidad);

    if (cantidadNum <= 0) {
      setPedidoProductos(
        pedidoProductos.filter((p) => p.productoId !== producto._id),
      );
      return;
    }

    if (producto.stock && cantidadNum > producto.stock) {
      alert("Stock insuficiente");
      return;
    }

    const existe = pedidoProductos.find((p) => p.productoId === producto._id);

    if (existe) {
      setPedidoProductos(
        pedidoProductos.map((p) =>
          p.productoId === producto._id ? { ...p, cantidad: cantidadNum } : p,
        ),
      );
    } else {
      setPedidoProductos([
        ...pedidoProductos,
        {
          productoId: producto._id,
          nombre: producto.nombre,
          precio: producto.precio || 0,
          cantidad: cantidadNum,
        },
      ]);
    }
  };

  const obtenerCantidad = (productoId) => {
    const item = pedidoProductos.find((p) => p.productoId === productoId);
    return item ? item.cantidad : 0;
  };

  const totalGeneral = pedidoProductos.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  const confirmarPedido = () => {
    if (pedidoProductos.length === 0) {
      alert("Agregá al menos un producto");
      return;
    }
    setMostrarConfirmacion(true);
  };

  const confirmarPedidoReal = async () => {
    try {
      const pedidoFinal = {
        clienteId: cliente._id,
        items: pedidoProductos.map((p) => ({
          productoId: p.productoId,
          cantidad: p.cantidad,
        })),
        observaciones: "",
      };

      await crearPedido(pedidoFinal);

      localStorage.removeItem(STORAGE_KEY);
      setMostrarConfirmacion(false);
      alert("Pedido creado correctamente");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <div className="row text-center mt-4 mb-3">
        <div className="col">
          <h2>Nuevo Pedido</h2>
          <p>
            Cliente: <strong>{cliente.nombre}</strong>
          </p>
        </div>
      </div>

      <div className="row mb-4">
        <SearchBarApp placeholder="Buscar producto..." onSearch={setBusqueda} />
      </div>

      {/* 🛍️ Productos */}
      <div className="row">
        {loading ? (
          <p className="text-center">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="text-center text-muted">No se encontraron productos</p>
        ) : (
          productos.map((prod) => (
            <div key={prod._id} className="col-6 col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={prod.img || "/placeholder.png"} // ⚡ usar "img"
                  alt={prod.nombre}
                  className="card-img-top"
                  style={{ height: 140, objectFit: "cover" }}
                />

                <div className="card-body d-flex flex-column">
                  <h6 className="card-title">{prod.nombre}</h6>
                  <small className="text-muted">${prod.precio || 0}</small>

                  {prod.stock && (
                    <small className="text-muted">Stock: {prod.stock}</small>
                  )}

                  <div className="mt-auto">
                    <input
                      type="number"
                      min="0"
                      value={obtenerCantidad(prod._id)}
                      onChange={(e) => cambiarCantidad(prod, e.target.value)}
                      className="form-control form-control-sm mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🔢 Paginación MOBILE-FIRST */}
      {totalPaginas > 1 && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual((prev) => prev - 1)}
          >
            ◀
          </button>

          <span className="fw-bold">
            Página {paginaActual} de {totalPaginas}
          </span>

          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual((prev) => prev + 1)}
          >
            ▶
          </button>
        </div>
      )}

      <hr className="my-4" />

      {/* 🧾 Resumen */}
      <h4>Resumen del pedido</h4>

      {pedidoProductos.length === 0 && (
        <p className="text-muted">No hay productos seleccionados</p>
      )}

      {pedidoProductos.map((item) => (
        <div
          key={item.productoId}
          className="d-flex justify-content-between mb-2"
        >
          <span>
            {item.nombre} x {item.cantidad}
          </span>
          <strong>${item.precio * item.cantidad}</strong>
        </div>
      ))}

      <hr />

      <div className="d-flex justify-content-between">
        <h5>Total</h5>
        <h5>${totalGeneral}</h5>
      </div>

      <button
        className="btn btn-success w-100 mt-3 mb-3"
        onClick={confirmarPedido}
      >
        Confirmar Pedido
      </button>

      <ConfirmModal
        show={mostrarConfirmacion}
        title="Confirmar Pedido"
        message="¿Estás seguro que querés confirmar este pedido?"
        onConfirm={confirmarPedidoReal}
        onCancel={() => setMostrarConfirmacion(false)}
      >
        <div>
          {pedidoProductos.map((item) => (
            <div
              key={item.productoId}
              className="d-flex justify-content-between"
            >
              <span>
                {item.nombre} x {item.cantidad}
              </span>
              <strong>${item.precio * item.cantidad}</strong>
            </div>
          ))}

          <hr />
          <div className="d-flex justify-content-between">
            <strong>Total</strong>
            <strong>${totalGeneral}</strong>
          </div>
        </div>
      </ConfirmModal>
    </div>
  );
};

export default BuscarProductosScreen;
