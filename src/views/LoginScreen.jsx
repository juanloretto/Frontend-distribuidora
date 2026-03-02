import { useState } from "react";
import { login } from "../helpers/authApi";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.group("🔐 LOGIN FLOW");
    console.log("📤 Datos enviados:", { email, password });

    try {
      const resp = await login({ email, password });

      console.log("📥 Respuesta backend:", resp);

      // Guardar token
      localStorage.setItem("token", resp.token);
      console.log("✅ Token guardado:", resp.token);

      // Guardar usuario
      localStorage.setItem("usuario", JSON.stringify(resp.usuario));
      console.log("👤 Usuario guardado:", resp.usuario);

      console.log("➡️ Navegando a Home");
      console.groupEnd();

      navigate("/");
    } catch (err) {
      console.error("❌ Error en login:", err);
      console.groupEnd();
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="col-12 col-md-4">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="text-center mb-3">Iniciar Sesión</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="btn btn-primary w-100">
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;