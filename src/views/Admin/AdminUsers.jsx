import { useEffect, useState } from "react";
import UsersTable from "../../components/Admin/UserTable";
import CreateUserModal from "../../components/Admin/CreateUserModal";
import { createUser, deleteUser } from "../../helpers/Admin/crearUsuarioApi";
import { apiFetch } from "../../helpers/apiFetch";
const AdminUsers = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
 

  const cargarUsuarios = async () => {
    try {
      const data = await apiFetch("/usuarios");
      setUsuarios(data.usuarios);
    } catch (error) {
      console.error("Error cargando usuarios:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const crearUsuario = async (formData) => {
    try {
      setError(null);
      setSuccess(null);

      await createUser(formData);

      setShowModal(false);
      setSuccess("Usuario creado correctamente ✅");
      cargarUsuarios();

      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const eliminarUsuario = async (uid) => {
    try {
      await deleteUser(uid);

      // 🔥 eliminar del estado sin volver a pedir al backend
      setUsuarios((prevUsuarios) =>
        prevUsuarios.filter((user) => user._id !== uid),
      );
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Panel Admin - Usuarios</h2>

      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <>
          {/* 🔥 ACA ES DONDE SE PASA BIEN */}
          <UsersTable usuarios={usuarios} onDelete={eliminarUsuario} />

          <div className="mt-3">
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              Crear usuario
            </button>
          </div>
        </>
      )}

      {showModal && (
        <CreateUserModal
          onClose={() => {
            setShowModal(false);
            setError(null);
          }}
          onSubmit={crearUsuario}
          error={error}
        />
      )}
    </div>
  );
};

export default AdminUsers;
