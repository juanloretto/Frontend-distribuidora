import { apiFetch } from "../apiFetch";

export const importarProductos = (formData) =>
  apiFetch("/productos/importar", {
    method: "POST",
    body: formData,
  });
