import { apiFetch } from "./apiFetch";

export const getMisPedidos = ({
  pagina = 1,
  limite = 10,
  cliente = "",
} = {}) => {
  const queryParams = new URLSearchParams({
    page: pagina,
    limit: limite,
  });

  if (cliente) {
    queryParams.append("cliente", cliente);
  }

  return apiFetch(`/pedidos/mis-pedidos?${queryParams.toString()}`);
};
export const cancelarPedidoById = (id) =>
  apiFetch(`/pedidos/${id}/cancelar`, {
    method: "PUT",
  });
