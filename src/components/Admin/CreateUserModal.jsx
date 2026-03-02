import { useState } from "react";
const CreateUserModal = ({ onClose, onSubmit, error }) => {
  const [formError, setFormError] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "USER_ROLE",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    setFormError(null); // limpiar error previo

    if (!passwordRegex.test(form.password)) {
      setFormError(
        "La contraseña debe tener mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolo especial",
      );
      return;
    }

    onSubmit(form);
  };
  return (
    <div className="modal-backdrop-custom">
      <div className="modal-custom">
        <h4>Crear Usuario</h4>
        {error && <div className="alert alert-danger">{error}</div>}
        {formError && <div className="alert alert-danger">{formError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Rol</label>
            <select
              name="rol"
              className="form-select"
              value={form.rol}
              onChange={handleChange}
            >
              <option value="USER_ROLE">Usuario</option>
              <option value="ADMIN_ROLE">Administrador</option>
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button type="submit" className="btn btn-primary">
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
