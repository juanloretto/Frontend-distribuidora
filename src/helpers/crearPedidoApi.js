import { apiFetch } from "./apiFetch";

export const crearPedido = (data) =>
  apiFetch("/pedidos", {
    method: "POST",
    body: JSON.stringify(data),
  });
