const UsersTable = ({ usuarios, onDelete }) => {
    const handleDelete = (uid) => {
        const confirmacion = window.confirm(
            "¿Seguro que deseas eliminar este usuario?",
        );
        
        if (confirmacion) {
            onDelete(uid);
        }
    };
    const usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    console.log(usuarioActual)

  return (
    <table className="table table-bordered table-striped mt-3">
      <thead className="table-dark">
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {usuarios.map((user) => (
          <tr key={user._id}>
            <td>{user.nombre}</td>
            <td>{user.email}</td>
            <td>{user.rol}</td>
            <td>
              <button
                className="btn btn-sm btn-danger"
                disabled={usuarioActual?.uid === user._id}
                onClick={() => handleDelete(user._id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
