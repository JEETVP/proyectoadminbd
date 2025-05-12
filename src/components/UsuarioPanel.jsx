import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
  });
  const [citas, setCitas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    // Obtener datos del usuario
    fetch("/api/usuario-actual")
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((err) => console.error("Error obteniendo datos del usuario:", err));

    // Obtener citas del usuario
    fetch("/api/citas-usuario")
      .then((res) => res.json())
      .then((data) => setCitas(data))
      .catch((err) => console.error("Error obteniendo citas:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/usuario-actual", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setMensaje("Información actualizada correctamente.");
      } else {
        setMensaje("Error al actualizar la información.");
      }
    } catch (error) {
      console.error("Error al actualizar la información:", error);
      setMensaje("Ocurrió un error al actualizar la información.");
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 text-[#003366]">Perfil de Usuario</h1>

        {/* Tabla de citas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-[#003366] mb-4">Mis Citas</h2>
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Trámite</th>
                <th className="border border-gray-300 px-4 py-2">Fecha y Hora</th>
                <th className="border border-gray-300 px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {citas.length > 0 ? (
                citas.map((cita) => (
                  <tr key={cita._id}>
                    <td className="border border-gray-300 px-4 py-2">{cita.tramite.nombre}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(cita.fechaHora).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{cita.estado}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                  >
                    No tienes citas programadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Espacio entre la tabla y el formulario */}
        <div className="h-8" />
        
        {/* Formulario para editar información personal */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-bold text-[#003366] mb-4">Editar Información Personal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-[#003366]">
                Nombre:
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={userData.nombre}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="apellidos" className="block text-sm font-medium text-[#003366]">
                Apellidos:
              </label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={userData.apellidos}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#003366]">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-[#003366]">
                Teléfono:
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={userData.telefono}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                required
              />
            </div>
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