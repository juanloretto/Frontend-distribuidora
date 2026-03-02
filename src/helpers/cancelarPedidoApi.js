import { apiFetch } from "./apiFetch";
export const cancelarPedidoById = (id) =>
  apiFetch(`/pedidos/${id}/cancelar`, {
    method: "PUT",
  });