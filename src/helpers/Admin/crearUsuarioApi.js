import { apiFetch } from "../../helpers/apiFetch";

export const getUsers = () => apiFetch("/usuarios");
export const createUser = (userData) => {
  return apiFetch("/usuarios", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};
export const deleteUser = (uid) => {
  return apiFetch(`/usuarios/${uid}`, {
    method: "DELETE",
  });
};
