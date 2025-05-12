import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const API_BASE = "https://backendbernyfix.onrender.com/api";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
  });
  const [citas, setCitas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔐 TOKEN:", token);

      if (!token) {
        setMensaje("❌ No se ha encontrado el token de autenticación.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("📡 Consultando trámites en:", `${API_BASE}/tramites/mios`);

      const tramitesRes = await axios.get(`${API_BASE}/tramites/mios`, config);

      console.log("✅ Trámites recibidos:", tramitesRes.data);

      setCitas(tramitesRes.data);
    } catch (err) {
      console.error("❌ Error al cargar datos:");
      if (err.response) {
        console.error("🔴 Código de estado:", err.response.status);
        console.error("📝 Mensaje del servidor:", err.response.data);
      } else if (err.request) {
        console.error("🕒 Sin respuesta del servidor:", err.request);
      } else {
        console.error("⚙️ Error al configurar la solicitud:", err.message);
      }
      setMensaje("❌ Error al cargar los datos.");
    }
  };

  fetchData();
}, []);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/usuarios`, userData, axiosConfig);
      setMensaje("✅ Información actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMensaje("❌ Error al actualizar la información.");
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 text-[#003366]">Perfil de Usuario</h1>

        {/* Tabla de citas */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-xl font-semibold text-[#003366] mb-4">Mis Citas</h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#f0f0f0] text-left">
                <th className="border border-gray-300 px-4 py-2">Trámite</th>
                <th className="border border-gray-300 px-4 py-2">Fecha y Hora</th>
                <th className="border border-gray-300 px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {citas.length > 0 ? (
                citas.map((cita) => (
                  <tr key={cita._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
  {cita.tramite?.tipoTramite_id?.nombre || "Trámite desconocido"}
</td>

                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(cita.fechaHora).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 capitalize">{cita.estado}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-4">
                    No tienes citas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Formulario de edición */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-[#003366] mb-4">Editar Información Personal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["nombre", "apellidos", "email", "telefono"].map((campo) => (
              <div key={campo}>
                <label
                  htmlFor={campo}
                  className="block text-sm font-medium text-[#003366] capitalize"
                >
                  {campo}:
                </label>
                <input
                  type={campo === "email" ? "email" : "text"}
                  id={campo}
                  name={campo}
                  value={userData[campo]}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="bg-[#CC9900] hover:bg-[#B38600] text-white font-bold py-2 px-4 rounded"
            >
              Guardar Cambios
            </button>
          </form>
          {mensaje && <p className="mt-4 text-sm text-gray-700">{mensaje}</p>}
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
