// src/components/Tramites.jsx

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const Tramites = () => {
  const [tramites, setTramites] = useState([]);
  const [tipoTramites, setTipoTramites] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch("/api/tramites")
      .then((response) => response.json())
      .then((data) => setTramites(data))
      .catch((error) => console.error("Error al obtener trámites:", error));

    fetch("/api/tipo-tramites")
      .then((response) => response.json())
      .then((data) => setTipoTramites(data))
      .catch((error) => console.error("Error al obtener tipos de trámites:", error));

    fetch("/api/usuarios")
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error al obtener usuarios:", error));
  }, []);

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 text-[#003366]">Gestión de Trámites</h1>

        {/* Grid de Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tramites.map((tramite) => {
            const usuario = usuarios.find((user) => user._id === tramite.usuario_id);
            const tipoTramite = tipoTramites.find((tipo) => tipo._id === tramite.tipoTramite_id);

            return (
              <div
                key={tramite._id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-lg font-semibold text-[#003366] mb-2">
                  Código: {tramite.codigoTramite}
                </h2>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Usuario:</strong> {usuario?.nombre} {usuario?.apellidos}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Email:</strong> {usuario?.contacto?.email}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Tipo de Trámite:</strong> {tipoTramite?.nombre}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Estado:</strong> {tramite.estado}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Fecha:</strong> {new Date(tramite.fechaSolicitud).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Tramites;
