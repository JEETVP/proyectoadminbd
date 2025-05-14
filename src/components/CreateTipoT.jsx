import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar"; // Asegúrate de importar tu componente Navbar
import { useNavigate } from 'react-router-dom';

const CreateTipoTramite = () => {
    const navigate = useNavigate();
  // Estados
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    dependenciaId: "",
    requisitos: [""]
  });
  const [dependencias, setDependencias] = useState([]);
  const [tiposTramite, setTiposTramite] = useState([]);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Constantes
  const token = localStorage.getItem("token");
  const API_URL = "https://backendbernyfix.onrender.com/api";

  // Efectos
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setCargando(true);
      await Promise.all([fetchDependencias(), fetchTiposTramite()]);
    } catch (error) {
      mostrarMensaje("Error al cargar datos iniciales", "error");
    } finally {
      setCargando(false);
    }
  };

  
  // Funciones de API
  const fetchDependencias = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/dependencias`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDependencias(data);
    } catch (error) {
      console.error("Error al cargar dependencias", error);
      throw error;
    }
  };

  const fetchTiposTramite = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/tipotramites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTiposTramite(data);
    } catch (error) {
      console.error("Error al cargar tipos de trámite", error);
      throw error;
    }
  };

  // Manejadores de formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequisitoChange = (index, value) => {
    const nuevosRequisitos = [...formData.requisitos];
    nuevosRequisitos[index] = value;
    setFormData(prev => ({ ...prev, requisitos: nuevosRequisitos }));
  };

  const agregarRequisito = () => {
    setFormData(prev => ({ ...prev, requisitos: [...prev.requisitos, ""] }));
  };

  const eliminarRequisito = (index) => {
    setFormData(prev => ({
      ...prev,
      requisitos: prev.requisitos.filter((_, i) => i !== index)
    }));
  };

  // Funciones de utilidad
  const mostrarMensaje = (texto, tipo = "exito") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 5000);
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      dependenciaId: "",
      requisitos: [""]
    });
    setEditandoId(null);
  };

  // Operaciones CRUD
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      dependencia_id: formData.dependenciaId,
      requisitos: formData.requisitos.filter(r => r.trim())
    };

    try {
      setCargando(true);
      
      if (editandoId) {
        await axios.put(`${API_URL}/tipotramites/${editandoId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        mostrarMensaje("Tipo de trámite actualizado con éxito");
      } else {
        await axios.post(`${API_URL}/tipotramites`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        mostrarMensaje("Tipo de trámite creado con éxito");
      }

      await fetchTiposTramite();
      limpiarFormulario();
    } catch (error) {
      console.error("Error al guardar:", error);
      mostrarMensaje(error.response?.data?.message || "Error al procesar la solicitud", "error");
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (tipo) => {
    setFormData({
      nombre: tipo.nombre,
      descripcion: tipo.descripcion,
      dependenciaId: tipo.dependencia_id,
      requisitos: tipo.requisitos.length ? tipo.requisitos : [""]
    });
    setEditandoId(tipo._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este tipo de trámite?")) return;
    
    try {
      setCargando(true);
      await axios.delete(`${API_URL}/tipotramites/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      mostrarMensaje("Tipo de trámite eliminado con éxito");
      await fetchTiposTramite();
    } catch (error) {
      console.error("Error al eliminar:", error);
      mostrarMensaje("No se pudo eliminar el tipo de trámite", "error");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Botón de regreso agregado aquí */}
        <button
          onClick={() => navigate('/admin-dashboard')}
          className="mb-4 inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver al Dashboard
        </button>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {editandoId ? 'Editar Tipo de Trámite' : 'Crear Nuevo Tipo de Trámite'}
          </h2>

          {mensaje.texto && (
            <div className={`mb-6 p-4 rounded-lg ${mensaje.tipo === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nombre*</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej: Licencia de construcción"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Dependencia*</label>
                <select
                  name="dependenciaId"
                  value={formData.dependenciaId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccione una dependencia</option>
                  {dependencias.map(dep => (
                    <option key={dep._id} value={dep._id}>{dep.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                placeholder="Descripción detallada del trámite..."
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Requisitos</label>
              <div className="space-y-3">
                {formData.requisitos.map((requisito, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={requisito}
                      onChange={(e) => handleRequisitoChange(index, e.target.value)}
                      placeholder={`Requisito ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {formData.requisitos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => eliminarRequisito(index)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                        aria-label="Eliminar requisito"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={agregarRequisito}
                className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Agregar requisito
              </button>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              {editandoId && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  disabled={cargando}
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className={`px-6 py-2 rounded-lg text-white ${editandoId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'} transition flex items-center justify-center min-w-24`}
                disabled={cargando}
              >
                {cargando ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {editandoId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de tipos de trámite */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Tipos de Trámite Registrados</h3>
            <p className="text-sm text-gray-500 mt-1">{tiposTramite.length} tipos encontrados</p>
          </div>

          {cargando && !tiposTramite.length ? (
            <div className="p-8 text-center text-gray-500">
              Cargando tipos de trámite...
            </div>
          ) : tiposTramite.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No hay tipos de trámite registrados aún
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dependencia</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requisitos</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tiposTramite.map((tipo) => (
                    <tr key={tipo._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{tipo.nombre}</div>
                        {tipo.descripcion && (
                          <div className="text-sm text-gray-500 mt-1">{tipo.descripcion}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tipo.dependencia_id?.nombre || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <ul className="list-disc list-inside space-y-1">
                          {tipo.requisitos.map((req, i) => (
                            <li key={i} className="truncate max-w-xs">{req}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditar(tipo)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded-md hover:bg-yellow-50"
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEliminar(tipo._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                            title="Eliminar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateTipoTramite;