import { apiFetch } from "./apiFetch";
export const crearCliente = (data) =>
  apiFetch("/clientes", {
    method: "POST",
    body: JSON.stringify(data),
  });
