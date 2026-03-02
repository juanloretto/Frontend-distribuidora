import { apiFetch } from "../../helpers/apiFetch";

// 🔹 Admin - obtener pedidos paginados
export const getPedidosAdmin = ({
  page = 1,
  limit = 25,
  estado,
  cliente,
  fechaDesde,
  fechaHasta,
}) => {
  const query = new URLSearchParams();

  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (estado) query.append("estado", estado);
  if (cliente) query.append("cliente", cliente);
  if (fechaDesde) query.append("fechaDesde", fechaDesde);
  if (fechaHasta) query.append("fechaHasta", fechaHasta);

  return apiFetch(`/pedidos/admin?${query.toString()}`);
};

// 🔹 Cambiar estado
export const cambiarEstadoPedido = (id, estado) => {
  return apiFetch(`/pedidos/${id}/estado`, {
    method: "PUT",
    body: JSON.stringify({ estado }),
  });
};

// 🔹 Exportar pedido
export const exportarPedido = (id) =>
  apiFetch(`/pedidos/exportar/excel/${id}`, {
    method: "GET",
    responseType: "blob",
  });
