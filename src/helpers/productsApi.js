import { apiFetch } from "./apiFetch";

// 🔎 Obtener productos paginados desde backend
export const getProductos = ({
  pagina = 1,
  limite = 12,
  termino = "",
  estado = true,
} = {}) => {
  const desde = (pagina - 1) * limite;

  const queryParams = new URLSearchParams({
    limite,
    desde,
    estado,
  });

  if (termino) {
    queryParams.append("termino", termino);
  }

  return apiFetch(`/productos?${queryParams.toString()}`);
};

export const getProductoById = (id) => apiFetch(`/productos/${id}`);

export const createProducto = (data) =>
  apiFetch("/productos", {
    method: "POST",
    body: JSON.stringify(data),
  });
