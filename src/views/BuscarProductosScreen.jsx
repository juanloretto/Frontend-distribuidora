import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBarApp from "../components/SearchBarApp";
import { getProductos } from "../helpers/productsApi";
import ConfirmModal from "../components/ConfirmModal";
import { crearPedido } from "../helpers/crearPedidoApi";

const STORAGE_KEY = "pedido_en_proceso";
const PRODUCTOS_POR_PAGINA = 12;

const redondear2 = (numero) => Number(Number(numero || 0).toFixed(2));
const formatearPrecio = (numero) => redondear2(numero).toFixed(2);

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

  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      setPedidoProductos(JSON.parse(guardado));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidoProductos));
  }, [pedidoProductos]);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

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

        console.log("PRIMER PRODUCTO:", resp.productos?.[0]);

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

  const obtenerListasProducto = (producto) => {
    if (
      Array.isArray(producto.listasPrecios) &&
      producto.listasPrecios.length > 0
    ) {
      return producto.listasPrecios.map((lista) => ({
        ...lista,
        precio: redondear2(lista.precio),
      }));
    }

    return [{ nombre: "Lista1", precio: redondear2(producto.precio || 0) }];
  };

  const obtenerItemPedido = (productoId) => {
    return pedidoProductos.find((p) => p.productoId === productoId);
  };

  const obtenerCantidad = (productoId) => {
    const item = obtenerItemPedido(productoId);
    return item ? item.cantidad : 0;
  };

  const obtenerListaSeleccionada = (producto) => {
    const item = obtenerItemPedido(producto._id);

    if (item?.lista) return item.lista;

    const listas = obtenerListasProducto(producto);
    return listas[0]?.nombre || "";
  };

  const cambiarLista = (producto, nuevaLista) => {
    const listas = obtenerListasProducto(producto);
    const listaElegida = listas.find((l) => l.nombre === nuevaLista);

    if (!listaElegida) return;

    const existe = pedidoProductos.find((p) => p.productoId === producto._id);

    if (existe) {
      setPedidoProductos(
        pedidoProductos.map((p) =>
          p.productoId === producto._id
            ? {
                ...p,
                lista: listaElegida.nombre,
                precioUnitario: redondear2(listaElegida.precio),
              }
            : p,
        ),
      );
    } else {
      setPedidoProductos([
        ...pedidoProductos,
        {
          productoId: producto._id,
          nombre: producto.nombre,
          lista: listaElegida.nombre,
          precioUnitario: redondear2(listaElegida.precio),
          cantidad: 1,
        },
      ]);
    }
  };

  const cambiarCantidad = (producto, cantidad) => {
    const cantidadNum = Number(cantidad);

    if (cantidadNum <= 0) {
      setPedidoProductos(
        pedidoProductos.filter((p) => p.productoId !== producto._id),
      );
      return;
    }

    const existe = pedidoProductos.find((p) => p.productoId === producto._id);
    const listas = obtenerListasProducto(producto);

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
          lista: listas[0]?.nombre || "Lista1",
          precioUnitario: redondear2(listas[0]?.precio || producto.precio || 0),
          cantidad: cantidadNum,
        },
      ]);
    }
  };

  const totalGeneral = redondear2(
    pedidoProductos.reduce(
      (acc, item) => acc + redondear2(item.precioUnitario) * item.cantidad,
      0,
    ),
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
          lista: p.lista,
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

      <div className="row">
        {loading ? (
          <p className="text-center">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="text-center text-muted">No se encontraron productos</p>
        ) : (
          productos.map((prod) => {
            const listas = obtenerListasProducto(prod);

            return (
              <div
                key={prod._id}
                className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3"
              >
                <div className="card h-100 shadow-sm">
                  <img
                    src={prod.img || "/placeholder.png"}
                    alt={prod.nombre}
                    className="card-img-top"
                    style={{ height: 140, objectFit: "cover" }}
                  />

                  <div className="card-body d-flex flex-column p-2">
                    <h6
                      className="card-title mb-1"
                      style={{
                        fontSize: "0.9rem",
                        lineHeight: "1.2",
                        minHeight: "2.2rem",
                      }}
                    >
                      {prod.nombre}
                    </h6>

                    <small className="text-muted d-block mb-2">
                      Base: $
                      {formatearPrecio(listas[0]?.precio || prod.precio || 0)}
                    </small>

                    <div className="mb-2">
                      <label className="form-label mb-1 small fw-semibold">
                        Lista
                      </label>
                      <select
                        className="form-select form-select-sm"
                        value={obtenerListaSeleccionada(prod)}
                        onChange={(e) => cambiarLista(prod, e.target.value)}
                      >
                        {listas.map((lista) => (
                          <option key={lista.nombre} value={lista.nombre}>
                            {lista.nombre} - ${formatearPrecio(lista.precio)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-auto">
                      <label className="form-label mb-1 small fw-semibold">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={obtenerCantidad(prod._id)}
                        onChange={(e) => cambiarCantidad(prod, e.target.value)}
                        className="form-control form-control-sm"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

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

      <h4>Resumen del pedido</h4>

      {pedidoProductos.length === 0 && (
        <p className="text-muted">No hay productos seleccionados</p>
      )}

      {pedidoProductos.map((item) => {
        const subtotal = redondear2(item.precioUnitario * item.cantidad);

        return (
          <div
            key={item.productoId}
            className="d-flex justify-content-between mb-2"
          >
            <span>
              {item.nombre} x {item.cantidad} ({item.lista})
            </span>
            <strong>${formatearPrecio(subtotal)}</strong>
          </div>
        );
      })}

      <hr />

      <div className="d-flex justify-content-between">
        <h5>Total</h5>
        <h5>${formatearPrecio(totalGeneral)}</h5>
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
          {pedidoProductos.map((item) => {
            const subtotal = redondear2(item.precioUnitario * item.cantidad);

            return (
              <div
                key={item.productoId}
                className="d-flex justify-content-between"
              >
                <span>
                  {item.nombre} x {item.cantidad} ({item.lista})
                </span>
                <strong>${formatearPrecio(subtotal)}</strong>
              </div>
            );
          })}

          <hr />
          <div className="d-flex justify-content-between">
            <strong>Total</strong>
            <strong>${formatearPrecio(totalGeneral)}</strong>
          </div>
        </div>
      </ConfirmModal>
    </div>
  );
};

export default BuscarProductosScreen;
