import { useState } from "react";
import { login } from "../helpers/authApi";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/LOGOHOME.png";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-top justify-content-center">
      <div className="col-12 col-sm-10 col-md-6 col-lg-4">
        {/* Logo */}
        <div className="text-center mb-4">
          <img src={Logo} alt="LOGO GFP" className="img-fluid login-logo" />
        </div>

        {/* Card */}
        <div className="card shadow-lg border-0">
          <div className="card-body p-4">
            <h3 className="text-center mb-4">Iniciar Sesión</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <button
                className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Ingresando...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;