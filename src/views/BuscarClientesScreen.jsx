import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarClientes } from "../helpers/apiClient";
import { crearCliente } from "../helpers/crearCliente";
import FormModal from "../components/FormModal";

const BuscarClientesScreen = ({ onSelectCliente }) => {
  const [termino, setTermino] = useState("");
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNuevoCliente, setShowNuevoCliente] = useState(false);

  const navigate = useNavigate();

  const handleSelectCliente = (cliente) => {
    console.log("🧾 Cliente seleccionado:", cliente);

    navigate("/buscar-productos", {
      state: { cliente },
    });
  };
  const handleCrearCliente = async (formData) => {
    try {
      const resp = await crearCliente(formData);

      setClientes((prev) => [resp.cliente, ...prev]);

      navigate("/buscar-productos", {
        state: { cliente: resp.cliente },
      });
    } catch (error) {
      alert(error.message); // ahora sí va a mostrar "Ya existe..."
    }
  };

  useEffect(() => {
    console.log("🟡 useEffect disparado");
    console.log("🔎 Término:", termino);

    if (termino.trim().length < 3) {
      console.log("⛔ Término < 3 caracteres, no se busca");
      setClientes([]);
      return;
    }

    let activo = true;

    const buscar = async () => {
      try {
        setLoading(true);
        console.log("🚀 Llamando a buscarClientes con:", termino);

        const data = await buscarClientes(termino);

        console.log("📦 Respuesta completa del backend:", data);
        console.log("📦 data.clientes:", data?.clientes);

        if (activo) {
          setClientes(data.clientes || []);
          console.log(
            "✅ Clientes seteados en estado:",
            data.clientes?.length || 0,
          );
        }
      } catch (error) {
        console.error("❌ Error buscando clientes:", error);
        if (activo) setClientes([]);
      } finally {
        if (activo) {
          setLoading(false);
          console.log("⏹️ Fin de búsqueda");
        }
      }
    };

    buscar();
    <button
      className="btn btn-primary w-100 mt-4"
      onClick={() => setShowNuevoCliente(true)}
    >
      + Nuevo Cliente
    </button>;

    return () => {
      console.log("🧹 Cleanup useEffect");
      activo = false;
    };
  }, [termino]);

  return (
    <div className="buscar-clientes">
      <h2>Buscar cliente</h2>

      <input
        type="text"
        placeholder="Escribí el nombre..."
        value={termino}
        onChange={(e) => {
          console.log("✍️ Input change:", e.target.value);
          setTermino(e.target.value);
        }}
      />

      {loading && <p className="loading">Buscando...</p>}

      <ul className="clientes-list">
        {clientes.map((cliente) => (
          <li
            key={cliente._id}
            onClick={() => handleSelectCliente(cliente)}
            className="cliente-item"
          >
            {cliente.nombre}
          </li>
        ))}
      </ul>
      <button
        className="btn btn-danger w-100 mt-4"
        onClick={() => setShowNuevoCliente(true)}
      >
        + Nuevo Cliente
      </button>

      {/* DEBUG VISUAL */}
      {!loading && termino.length >= 3 && clientes.length === 0 && (
        <p style={{ color: "gray" }}>
          ⚠️ No se encontraron clientes para este usuario
        </p>
      )}
      <FormModal
        show={showNuevoCliente}
        onClose={() => setShowNuevoCliente(false)}
        onSubmit={handleCrearCliente}
      />
    </div>
  );
};

export default BuscarClientesScreen;
