import { useEffect, useState } from "react";
import {
  getPedidosAdmin,
  cambiarEstadoPedido,
  exportarPedido,
} from "../../helpers/Admin/pedidosApi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [clienteFiltro, setClienteFiltro] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const limit = 25;

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = await getPedidosAdmin({
        page,
        limit,
        estado: estadoFiltro,
        cliente: clienteFiltro,
        fechaDesde,
        fechaHasta,
      });

      setOrders(data.pedidos);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, estadoFiltro]);

  const handleBuscar = () => {
    setPage(1);
    fetchOrders();
  };

  const handleChangeStatus = async (id, estado) => {
    try {
      await cambiarEstadoPedido(id, estado);
      fetchOrders();
    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };
  const descargarPedido = async (id) => {
    try {
      const blob = await exportarPedido(id);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pedido_${id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error.message);
    }
  };
  const getBadgeClass = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "badge bg-warning text-dark";
      case "FACTURADO":
        return "badge bg-primary";
      case "ENTREGADO":
        return "badge bg-success";
      case "CANCELADO":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Panel Profesional - Administración de Pedidos</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleBuscar();
        }}
      >
        <div className="row mb-3">
          <div className="col-md-3">
            <select
              className="form-select"
              value={estadoFiltro}
              onChange={(e) => {
                setEstadoFiltro(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="FACTURADO">Facturado</option>
              <option value="ENTREGADO">Entregado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por cliente..."
              value={clienteFiltro}
              onChange={(e) => setClienteFiltro(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </div>

          <div className="col-12 d-flex justify-content-center mt-3">
            <button
              type="submit"
              className="btn btn-dark px-5 w-50 d-flex align-items-center justify-content-center gap-2 shadow-sm"
            >
              <i className="bi bi-search"></i>
              Buscar
            </button>
          </div>
        </div>
      </form>
      {/* 📊 TABLA */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{new Date(order.createdAt).toLocaleString("es-AR")}</td>

                  <td>{order.cliente?.nombre}</td>
                  <td>{order.vendedor?.nombre}</td>
                  <td>${order.total}</td>

                  <td>
                    <span className={getBadgeClass(order.estado)}>
                      {order.estado}
                    </span>
                  </td>

                  <td className="d-flex gap-2">
                    {(order.estado === "PENDIENTE" ||
                      order.estado === "FACTURADO") && (
                      <select
                        className="form-select form-select-sm"
                        value={order.estado}
                        onChange={(e) =>
                          handleChangeStatus(order._id, e.target.value)
                        }
                      >
                        {order.estado === "PENDIENTE" && (
                          <>
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="FACTURADO">FACTURADO</option>
                          </>
                        )}

                        {order.estado === "FACTURADO" && (
                          <>
                            <option value="FACTURADO">FACTURADO</option>
                            <option value="ENTREGADO">ENTREGADO</option>
                          </>
                        )}
                      </select>
                    )}

                    <button
                      className="btn btn-success"
                      onClick={() => descargarPedido(order._id)}
                    >
                      Exportar Excel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 📄 PAGINACIÓN */}
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-outline-secondary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </button>

            <span>
              Página {page} de {totalPages}
            </span>

            <button
              className="btn btn-outline-secondary"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
