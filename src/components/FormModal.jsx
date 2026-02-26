import { useState } from "react";

const FormModal = ({ show, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    localidad: "",
    email: "",
    cuit: "",
    razonSocial: "",
  });

  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.telefono ||
      !formData.direccion ||
      !formData.localidad ||
      !formData.cuit
    ) {
      alert("Completá todos los campos obligatorios");
      return;
    }
    if (formData.cuit) {
      const cuitRegex = /^(20|23|24|27|30|33|34)-?\d{8}-?\d$/;

      if (!cuitRegex.test(formData.cuit)) {
        alert("CUIT inválido. Formato válido: 20-12345678-3");
        return;
      }
    }
    if (formData.cuit && !formData.razonSocial.trim()) {
      alert("Debe ingresar razón social si ingresa CUIT");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);

      setFormData({
        nombre: "",
        telefono: "",
        direccion: "",
        localidad: "",
        email: "",
        cuit: "",
        razonSocial: "",
      });

      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-container-custom">
        <h4 className="mb-3">Nuevo Cliente</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre *"
              className="form-control"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <input
              type="text"
              name="razonSocial"
              placeholder="Razón Social"
              value={formData.razonSocial}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono *"
              className="form-control"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <input
              type="text"
              name="direccion"
              placeholder="Dirección *"
              className="form-control"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <input
              type="text"
              name="localidad"
              placeholder="Localidad *"
              className="form-control"
              value={formData.localidad}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="cuit"
              placeholder="CUIT"
              className="form-control"
              value={formData.cuit}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <input
              type="email"
              name="email"
              placeholder="Email (opcional)"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
