import { apiFetch } from "./apiFetch";

export const buscarClientes = (termino = "") => {
  return apiFetch(`/buscar/clientes/${termino}`);
};