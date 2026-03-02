import { useEffect, useState } from "react";
import { getMisPedidos, cancelarPedidoById } from "../helpers/misPedidosApi";
import "./misPedidos.css";
const MisPedidosScreen = () => {
  const [pedidos, setPedidos] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const obtenerPedidos = async () => {
    try {
      setLoading(true);

      const data = await getMisPedidos({
        pagina: page,
        cliente: search,
      });

      setPedidos(data.pedidos);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPedidos();
  }, [page]);

  // 🔥 Búsqueda con pequeño delay manual (simple)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      obtenerPedidos();
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleCancelar = async (id) => {
    const confirm = window.confirm("¿Cancelar este pedido?");
    if (!confirm) return;

    try {
      await cancelarPedidoById(id);
      obtenerPedidos();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="mis-pedidos-container">
      <h1 className="mis-pedidos-title">Mis Pedidos</h1>

      <input
        type="text"
        placeholder="Buscar por cliente..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mis-pedidos-search"
      />

      {pedidos.map((pedido) => (
        <div key={pedido._id} className="pedido-card">
          <div className="pedido-header">
            <p className="pedido-cliente">{pedido.cliente?.nombre}</p>

            <span
              className={`estado-badge ${
                pedido.estado === "PENDIENTE"
                  ? "estado-pendiente"
                  : pedido.estado === "FACTURADO"
                    ? "estado-facturado"
                    : pedido.estado === "ENTREGADO"
                      ? "estado-entregado"
                      : "estado-cancelado"
              }`}
            >
              {pedido.estado}
            </span>
          </div>

          <p className="pedido-fecha">
            {new Date(pedido.createdAt).toLocaleDateString()}
          </p>

          {pedido.estado === "PENDIENTE" && (
            <button
              className="btn-cancelar"
              onClick={() => handleCancelar(pedido._id)}
            >
              Cancelar pedido
            </button>
          )}
        </div>
      ))}

      <div className="paginacion">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Anterior
        </button>

        <span>
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default MisPedidosScreen;
