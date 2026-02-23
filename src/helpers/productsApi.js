import { apiFetch } from "./apiFetch";

export const getProductos = () =>
  apiFetch("/productos?estado=true");

export const getProductoById = (id) =>
  apiFetch(`/productos/${id}`);

export const createProducto = (data) =>
  apiFetch("/productos", {
    method: "POST",
    body: JSON.stringify(data),
  });