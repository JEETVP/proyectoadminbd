// src/components/UsuarioPanel.jsx

import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom"; // solo si usas react-router

const UsuarioPanel = () => {
  const [usuario, setUsuario] = useState(null);
  const [tramites, setTramites] = useState([]);
  const navigate = useNavigate(); // para redirigir a otras rutas

  useEffect(() => {
    // Obtener usuario logueado (esto depende de tu sistema de autenticación)
    fetch("/api/usuario-actual")
      .then((res) => res.json())
      .then((data) => setUsuario(data))
      .catch((err) => console.error("Error obteniendo usuario:", err));

    // Obtener trámites del usuario
    fetch("/api/tramites-usuario")
      .then((res) => res.json())
      .then((data) => setTramites(data))
      .catch((err) => console.error("Error obteniendo trámites:", err));
  }, []);

  const tramitesPendientes = tramites.filter((t) => t.estado === "Pendiente");

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#003366]">Panel de Usuario</h1>

        {usuario ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <p className="text-lg text-gray-800">
              <strong>Nombre:</strong> {usuario.nombre} {usuario.apellidos}
            </p>
            <p className="text-lg text-gray-800">
              <strong>Email:</strong> {usuario.contacto.email}
            </p>
          </div>
        ) : (
          <p className="text-gray-600">Cargando datos del usuario...</p>
        )}

        {/* Botones de acciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/create-appointment")}
            className="bg-[#0066CC] hover:bg-[#005BB5] text-white font-semibold py-3 px-6 rounded-lg shadow"
          >
            Crear Cita
          </button>

          <button
            onClick={() => navigate("/mis-tramites")}
            className="bg-[#003366] hover:bg-[#002244] text-white font-semibold py-3 px-6 rounded-lg shadow"
          >
            Ver Todos Mis Trámites
          </button>

          <button
            onClick={() => navigate("/mis-tramites?estado=pendiente")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow"
          >
            Ver Trámites Pendientes
          </button>
        </div>

        {/* Muestra rápida de cantidad de trámites */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-[#003366] mb-2">Resumen</h2>
          <p className="text-gray-700">Total de trámites: {tramites.length}</p>
          <p className="text-gray-700">Pendientes: {tramitesPendientes.length}</p>
        </div>
      </main>
    </div>
  );
};

export default UsuarioPanel;
