import { useState } from "react";
import { importarProductos } from "../../helpers/Admin/importarProductos";
import "./adminProducts.css"; // 👈 agregamos el css

const AdminProducts = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleImport = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("archivo", file);

    try {
      setLoading(true);
      await importarProductos(formData);
      setShowModal(true); // 👈 mostrar modal éxito
    } catch (error) {
      console.error(error);
      alert("Error al importar productos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card shadow-sm p-4">
        <h3 className="mb-3">Importar Productos</h3>

        <input
          type="file"
          accept=".csv"
          className="form-control"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          className="btn btn-danger mt-3"
          onClick={handleImport}
          disabled={loading}
        >
          {loading ? "Importando..." : "Importar"}
        </button>
      </div>

      {/* 🔥 SPINNER OVERLAY */}
      {loading && (
        <div className="import-overlay">
          <div className="import-spinner"></div>
          <p>Importando productos...</p>
        </div>
      )}

      {/* ✅ MODAL ÉXITO */}
      {showModal && (
        <div className="success-modal">
          <div className="success-modal-content">
            <h4>Importación finalizada</h4>
            <p>¡Productos importados exitosamente!</p>
            <button
              className="btn btn-danger mt-2"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProducts;
