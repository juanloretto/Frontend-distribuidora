import { apiFetch } from "./apiFetch";

export const login = (data) =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });