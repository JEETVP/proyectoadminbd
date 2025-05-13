import React, { useState, useEffect } from "react";
import { Calendar, Clock, FileText } from 'lucide-react';
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom"; 
const API_BASE = "https://backendbernyfix.onrender.com/api";


const UserProfile = () => {
  const [misTramites, setMisTramites] = useState([]);
  const [isLoadingTramites, setIsLoadingTramites] = useState(false);
  const [tiposTramite, setTiposTramite] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("No se ha encontrado el token de autenticación.");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Cargar tipos de trámite para referencias
        try {
          const tiposRes = await fetch(`${API_BASE}/tipotramites`, config);
          const tiposData = await tiposRes.json();
          setTiposTramite(tiposData);
        } catch (error) {
          console.error("Error al cargar tipos de trámite:", error);
        }

        // Cargar trámites del usuario
        setIsLoadingTramites(true);
        const tramitesRes = await fetch(`${API_BASE}/tramites/mios`, config);
        const tramitesData = await tramitesRes.json();
        
        setMisTramites(tramitesData);
        setIsLoadingTramites(false);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setIsLoadingTramites(false);
      }
    };

    fetchData();
  }, []);

  // Función para actualizar la lista de trámites
  const obtenerMisTramites = async () => {
    try {
      setIsLoadingTramites(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/tramites/mios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setMisTramites(data);
      setIsLoadingTramites(false);
    } catch (error) {
      console.error('Error al cargar tus trámites:', error);
      setIsLoadingTramites(false);
    }
  };

  // Formatear fecha para mejor visualización
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Fecha no disponible';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener nombre del tipo de trámite
  const getNombreTipoTramite = (tramite) => {
    if (tramite.tipoTramite_id?.nombre) return tramite.tipoTramite_id.nombre;
    
    const tipo = tiposTramite.find(t => t._id === tramite.tipoTramite_id);
    return tipo ? tipo.nombre : 'No disponible';
  };

  // Obtener color según estado
  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'programada':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'no_asistio':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Traducir estado para visualización
  const traducirEstado = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'completada':
        return 'Completada';
      case 'programada':
        return 'Programada';
      case 'cancelada':
        return 'Cancelada';
      case 'no_asistio':
        return 'No Asistió';
      default:
        return estado || 'Pendiente';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen flex flex-col">
      <Navbar />
    
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Mi Perfil</h1>

        {/* Sección de Mis Trámites */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="text-white mr-3" size={22} />
              <h3 className="text-xl font-bold text-white">Mis Trámites</h3>
            </div>
            
            <button 
              onClick={obtenerMisTramites}
              disabled={isLoadingTramites}
              className="flex items-center text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-md transition-colors"
            >
              {isLoadingTramites ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Actualizar
                </>
              )}
            </button>
          </div>

          <div className="p-6">
            {isLoadingTramites ? (
              <div className="flex justify-center items-center py-10">
                <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : misTramites.length === 0 ? (
              <div className="text-center py-10">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay trámites</h3>
                <p className="mt-1 text-sm text-gray-500">No tienes trámites registrados en el sistema.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo de Trámite
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha y Hora
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {misTramites.map((tramite) => (
                      <tr key={tramite._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tramite.codigoTramite || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {getNombreTipoTramite(tramite)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {formatearFecha(tramite.cita?.fechaHora)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(tramite.cita?.estado)}`}>
                            {traducirEstado(tramite.cita?.estado)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;