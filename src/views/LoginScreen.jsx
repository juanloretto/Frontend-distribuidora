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

    try {
        
      const resp = await login({ email, password });

      // backend típico: { token, usuario }
      localStorage.setItem("token", resp.token);

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="col-12 col-md-4">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="text-center mb-3">Iniciar Sesión</h3>

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

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