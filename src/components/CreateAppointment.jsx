import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const CreateAppointment = () => {
  const [formData, setFormData] = useState({
    usuario_id: "",
    tramite_id: "",
    fechaHora: "",
    estado: "programada",
  });

  const [usuarios, setUsuarios] = useState([]);
  const [tramites, setTramites] = useState([]);

  useEffect(() => {
    // Obtener usuarios desde el backend
    fetch("/api/usuarios")
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error al obtener usuarios:", error));

    // Obtener trámites desde el backend
    fetch("/api/tramites")
      .then((response) => response.json())
      .then((data) => setTramites(data))
      .catch((error) => console.error("Error al obtener trámites:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Cita creada exitosamente");
        setFormData({
          usuario_id: "",
          tramite_id: "",
          fechaHora: "",
          estado: "programada",
        });
      } else {
        alert("Error al crear la cita");
      }
    } catch (error) {
      console.error("Error al crear la cita:", error);
      alert("Ocurrió un error al crear la cita");
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4 text-[#003366]">Crear Cita</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
          <div>
            <label
              htmlFor="usuario_id"
              className="block text-sm font-medium text-[#003366]"
            >
              Usuario:
            </label>
            <select
              id="usuario_id"
              name="usuario_id"
              value={formData.usuario_id}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
              required
            >
              <option value="">Selecciona un usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario._id} value={usuario._id}>
                  {usuario.nombre} ({usuario.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="tramite_id"
              className="block text-sm font-medium text-[#003366]"
            >
              Trámite:
            </label>
            <select
              id="tramite_id"
              name="tramite_id"
              value={formData.tramite_id}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
              required
            >
              <option value="">Selecciona un trámite</option>
              {tramites.map((tramite) => (
                <option key={tramite._id} value={tramite._id}>
                  {tramite.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="fechaHora"
              className="block text-sm font-medium text-[#003366]"
            >
              Fecha y Hora:
            </label>
            <input
              type="datetime-local"
              id="fechaHora"
              name="fechaHora"
              value={formData.fechaHora}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="estado"
              className="block text-sm font-medium text-[#003366]"
            >
              Estado:
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
              required
            >
              <option value="programada">Programada</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
              <option value="no_asistio">No Asistió</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#CC9900] hover:bg-[#B38600] text-white font-bold py-2 px-4 rounded"
          >
            Crear Cita
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateAppointment;