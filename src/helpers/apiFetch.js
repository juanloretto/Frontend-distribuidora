const API_URL = "http://localhost:3000/api";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { "x-token": token }),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};