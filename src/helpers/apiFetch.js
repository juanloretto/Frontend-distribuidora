const API_URL = "http://localhost:3000/api";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token && { "x-token": token }),
      ...(options.headers || {}),
    },
  });

  // 🔹 Soporte para blob
  if (options.responseType === "blob") {
    if (!res.ok) throw new Error("Error al descargar archivo");
    return await res.blob();
  }

  // 🔹 Comportamiento normal JSON
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  // 🔹 Token expirado o inválido
  if (res.status === 401) {
    // Limpiar localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // si guardas info del usuario
    // Redirigir al login automáticamente
    window.location.href = "/login";
    return; // evita seguir ejecutando
  }

  // 🔹 Manejo de errores normales
  if (!res.ok) {
    const mensaje =
      data?.errores?.map((e) => e.msg).join(", ") ||
      data?.msg ||
      "Error en la petición";
    throw new Error(mensaje);
  }

  return data;
};
