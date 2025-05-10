// src/components/Tramites.jsx

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const Tramites = () => {
  const [tramites, setTramites] = useState([]);
  const [tipoTramites, setTipoTramites] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Obtener trámites desde el backend
    fetch("/api/tramites")
      .then((response) => response.json())
      .then((data) => setTramites(data))
      .catch((error) => console.error("Error al obtener trámites:", error));

    // Obtener tipos de trámites desde el backend
    fetch("/api/tipo-tramites")
      .then((response) => response.json())
      .then((data) => setTipoTramites(data))
      .catch((error) => console.error("Error al obtener tipos de trámites:", error));

    // Obtener usuarios desde el backend
    fetch("/api/usuarios")
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error al obtener usuarios:", error));
  }, []);

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4 text-[#003366]">Gestión de Trámites</h1>

        {/* Lista de Trámites */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-[#003366]">Lista de Trámites</h2>
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Código Trámite</th>
                <th className="border border-gray-300 px-4 py-2">Usuario</th>
                <th className="border border-gray-300 px-4 py-2">Tipo de Trámite</th>
                <th className="border border-gray-300 px-4 py-2">Estado</th>
                <th className="border border-gray-300 px-4 py-2">Fecha Solicitud</th>
              </tr>
            </thead>
            <tbody>
              {tramites.map((tramite) => (
                <tr key={tramite._id}>
                  <td className="border border-gray-300 px-4 py-2">{tramite.codigoTramite}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {usuarios.find(user => user._id === tramite.usuario_id)?.nombre}{" "}
                    {usuarios.find(user => user._id === tramite.usuario_id)?.apellidos}{" "}
                    ({usuarios.find(user => user._id === tramite.usuario_id)?.contacto.email})
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {tipoTramites.find(tipo => tipo._id === tramite.tipoTramite_id)?.nombre}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{tramite.estado}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(tramite.fechaSolicitud).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Tramites;