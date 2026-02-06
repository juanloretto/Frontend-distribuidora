import { useEffect, useState } from "react";
import { buscarClientes } from "../helpers/apiClient";
import { useNavigate } from "react-router-dom";

const BuscarClientesScreen = ({ onSelectCliente }) => {
  const [termino, setTermino] = useState("");
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSelectCliente = (cliente) => {
    console.log("🧾 Cliente seleccionado:", cliente);

    navigate("/buscar-productos", {
      state: { cliente },
    });
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

      {/* DEBUG VISUAL */}
      {!loading && termino.length >= 3 && clientes.length === 0 && (
        <p style={{ color: "gray" }}>
          ⚠️ No se encontraron clientes para este usuario
        </p>
      )}
    </div>
  );
};

export default BuscarClientesScreen;
