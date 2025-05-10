// src/components/Tramites.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Tramites = () => {
  const [tipoTramites, setTipoTramites] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerTiposTramites = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://backendbernyfix.onrender.com/api/tipotramites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTipoTramites(res.data);
      } catch (err) {
        console.error("Error al obtener tipos de trámites:", err);
        setError("No se pudieron cargar los tipos de trámite.");
      } finally {
        setCargando(false);
      }
    };

    obtenerTiposTramites();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Tipos de Trámite</h1>
          <div className="h-1 w-20 bg-blue-500 mt-2"></div>
        </div>

        {cargando ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tipoTramites.map((tipo) => (
              <div 
                key={tipo._id} 
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200"
              >
                <div className="bg-blue-900 p-3">
                  <h2 className="text-lg font-semibold text-white">{tipo.nombre}</h2>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-gray-700">{tipo.descripcion}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-500">Dependencia:</span>
                    <p className="font-medium text-blue-800">{tipo.dependencia_id?.nombre || "Sin asignar"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!cargando && !error && tipoTramites.length === 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-yellow-700">No hay tipos de trámite disponibles.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Tramites;
