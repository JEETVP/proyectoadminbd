// src/components/AdminDashboard.jsx

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const AdminDashboard = () => {
  // URL base de la API
  const API_BASE_URL = "https://backendbernyfix.onrender.com/api";
  
  // Estado para mostrar/ocultar los modales
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showCreateTramiteForm, setShowCreateTramiteForm] = useState(false);
  const [showEditCitaForm, setShowEditCitaForm] = useState(false);
  const [editCitaId, setEditCitaId] = useState(null);
  
  // Estados para almacenar datos de la API
  const [usuarios, setUsuarios] = useState([]);
  const [tramites, setTramites] = useState([]);
  const [tiposTramite, setTiposTramite] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [citas, setCitas] = useState([]);
  const [isLoading, setIsLoading] = useState({
    usuarios: true,
    tramites: true,
    citas: true,
    dependencias: true
  });
  const [error, setError] = useState("");

  // Estado para los formularios
  const [newUsuario, setNewUsuario] = useState({
    numeroIdentificacion: "",
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    password: "",
    rol: "usuario",
  });

  // Estado actualizado para el formulario de trámite
  const [newTramite, setNewTramite] = useState({
    codigoTramite: "",
    usuario_id: "",
    tipoTramite: {
      nombre: "",
      descripcion: "",
      dependencia_id: "",
      requisitos: []
    },
    estado: "pendiente",
    documentos: [],
    cita: {
      fechaHora: "",
      estado: "programada"
    }
  });

  const [editCita, setEditCita] = useState({
    usuario_id: "",
    tramite_id: "",
    fechaHora: "",
    estado: ""
  });

  // Añadir un nuevo requisito al tipo de trámite
  const [nuevoRequisito, setNuevoRequisito] = useState("");

  // Cargar datos al iniciar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró un token de autenticación");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    // Cargar usuarios
    const cargarUsuarios = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
          headers: config.headers
        });
        if (!response.ok) throw new Error("Error al cargar usuarios");
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, usuarios: false }));
      }
    };

    // Cargar tipos de trámite
    const cargarTiposTramite = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tipotramites`, {
          headers: config.headers
        });
        if (!response.ok) throw new Error("Error al cargar tipos de trámite");
        const data = await response.json();
        setTiposTramite(data);
      } catch (error) {
        console.error("Error al cargar tipos de trámite:", error);
      }
    };

    // Cargar dependencias
    const cargarDependencias = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/dependencias`, {
          headers: config.headers
        });
        if (!response.ok) throw new Error("Error al cargar dependencias");
        const data = await response.json();
        setDependencias(data);
      } catch (error) {
        console.error("Error al cargar dependencias:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, dependencias: false }));
      }
    };

    // Cargar trámites
    const cargarTramites = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tramites`, {
          headers: config.headers
        });
        if (!response.ok) throw new Error("Error al cargar trámites");
        const data = await response.json();
        setTramites(data);
      } catch (error) {
        console.error("Error al cargar trámites:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, tramites: false }));
      }
    };

    // Cargar citas
    const cargarCitas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/citas`, {
          headers: config.headers
        });
        if (!response.ok) throw new Error("Error al cargar citas");
        const data = await response.json();
        setCitas(data);
      } catch (error) {
        console.error("Error al cargar citas:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, citas: false }));
      }
    };

    cargarUsuarios();
    cargarDependencias();
    cargarTiposTramite();
    cargarTramites();
    cargarCitas();
  }, []);

  // Funciones para manejar los modales
  const handleShowCreateUserForm = () => {
    setShowCreateUserForm(true);
  };

  const handleHideCreateUserForm = () => {
    setShowCreateUserForm(false);
  };

  const handleShowCreateTramiteForm = () => {
    setShowCreateTramiteForm(true);
  };

  const handleHideCreateTramiteForm = () => {
    setShowCreateTramiteForm(false);
  };

  const handleShowEditCitaForm = (cita) => {
    setEditCitaId(cita._id);
    setEditCita({
      usuario_id: cita.usuario_id || "",
      tramite_id: cita.tramite_id || "",
      fechaHora: cita.fechaHora ? new Date(cita.fechaHora).toISOString().slice(0, 16) : "",
      estado: cita.estado || "programada"
    });
    setShowEditCitaForm(true);
  };

  const handleHideEditCitaForm = () => {
    setShowEditCitaForm(false);
    setEditCitaId(null);
  };

  // Manejador de cambio para el formulario de usuario
  const handleUsuarioChange = (e) => {
    const { name, value } = e.target;
    setNewUsuario((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejador de cambio para el formulario de trámite (actualizado)
  const handleTramiteChange = (e) => {
    const { name, value } = e.target;
    
    // Para campos anidados en tipoTramite o cita
    if (name.startsWith("tipoTramite.")) {
      const field = name.split(".")[1];
      setNewTramite(prev => ({
        ...prev,
        tipoTramite: {
          ...prev.tipoTramite,
          [field]: value
        }
      }));
    } else if (name.startsWith("cita.")) {
      const field = name.split(".")[1];
      setNewTramite(prev => ({
        ...prev,
        cita: {
          ...prev.cita,
          [field]: value
        }
      }));
    } else {
      // Para campos directos del trámite
      setNewTramite(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Manejador para añadir requisitos al tipo de trámite
  const handleAddRequisito = () => {
    if (nuevoRequisito.trim()) {
      setNewTramite(prev => ({
        ...prev,
        tipoTramite: {
          ...prev.tipoTramite,
          requisitos: [...prev.tipoTramite.requisitos, nuevoRequisito.trim()]
        }
      }));
      setNuevoRequisito("");
    }
  };

  // Manejador para eliminar un requisito
  const handleRemoveRequisito = (index) => {
    setNewTramite(prev => ({
      ...prev,
      tipoTramite: {
        ...prev.tipoTramite,
        requisitos: prev.tipoTramite.requisitos.filter((_, i) => i !== index)
      }
    }));
  };

  // Manejador de cambio para el formulario de edición de cita
  const handleEditCitaChange = (e) => {
    const { name, value } = e.target;
    setEditCita((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Crear un nuevo usuario
  const crearUsuario = async (e) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, usuarios: true }));
    try {
      const token = localStorage.getItem("token");
      
      // Formatear datos del usuario
      const userData = {
        numeroIdentificacion: newUsuario.numeroIdentificacion,
        nombre: newUsuario.nombre,
        apellidos: newUsuario.apellidos,
        contacto: {
          email: newUsuario.email,
          telefono: newUsuario.telefono
        },
        password: newUsuario.password,
        rol: newUsuario.rol
      };

      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) throw new Error("Error al crear usuario");
      
      const data = await response.json();
      setUsuarios([...usuarios, data]);
      setNewUsuario({
        numeroIdentificacion: "",
        nombre: "",
        apellidos: "",
        email: "",
        telefono: "",
        password: "",
        rol: "usuario",
      });
      handleHideCreateUserForm();
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setError("No se pudo crear el usuario");
    } finally {
      setIsLoading(prev => ({ ...prev, usuarios: false }));
    }
  };

  // Crear un nuevo trámite (actualizado)
  const crearTramite = async (e) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, tramites: true }));
    try {
      const token = localStorage.getItem("token");
      
      // Primero crear el tipo de trámite
      const tipoTramiteData = {
        nombre: newTramite.tipoTramite.nombre,
        descripcion: newTramite.tipoTramite.descripcion,
        dependencia_id: newTramite.tipoTramite.dependencia_id,
        requisitos: newTramite.tipoTramite.requisitos
      };
      
      const tipoTramiteResponse = await fetch(`${API_BASE_URL}/tipotramites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tipoTramiteData)
      });
      
      if (!tipoTramiteResponse.ok) throw new Error("Error al crear tipo de trámite");
      
      const tipoTramiteResult = await tipoTramiteResponse.json();
      
      // Ahora crear el trámite con el ID del tipo de trámite recién creado
      const tramiteData = {
        codigoTramite: newTramite.codigoTramite,
        usuario_id: newTramite.usuario_id,
        tipoTramite_id: tipoTramiteResult._id,
        estado: newTramite.estado,
        documentos: newTramite.documentos,
        cita: newTramite.cita
      };
      
      const tramiteResponse = await fetch(`${API_BASE_URL}/tramites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tramiteData)
      });
      
      if (!tramiteResponse.ok) throw new Error("Error al crear trámite");
      
      const tramiteResult = await tramiteResponse.json();
      
      setTramites([...tramites, tramiteResult]);
      setNewTramite({
        codigoTramite: "",
        usuario_id: "",
        tipoTramite: {
          nombre: "",
          descripcion: "",
          dependencia_id: "",
          requisitos: []
        },
        estado: "pendiente",
        documentos: [],
        cita: {
          fechaHora: "",
          estado: "programada"
        }
      });
      handleHideCreateTramiteForm();
      
    } catch (error) {
      console.error("Error al crear trámite:", error);
      setError("No se pudo crear el trámite: " + error.message);
    } finally {
      setIsLoading(prev => ({ ...prev, tramites: false }));
    }
  };

  // Actualizar una cita
  const actualizarCita = async (e) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, citas: true }));
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE_URL}/citas/${editCitaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editCita)
      });

      if (!response.ok) throw new Error("Error al actualizar cita");
      
      const data = await response.json();
      setCitas(citas.map(cita => cita._id === editCitaId ? data : cita));
      handleHideEditCitaForm();
    } catch (error) {
      console.error("Error al actualizar cita:", error);
      setError("No se pudo actualizar la cita");
    } finally {
      setIsLoading(prev => ({ ...prev, citas: false }));
    }
  };

  // Eliminar una cita
  const eliminarCita = async (citaId) => {
    if (!window.confirm("¿Está seguro de que desea eliminar esta cita?")) return;
    
    setIsLoading(prev => ({ ...prev, citas: true }));
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE_URL}/citas/${citaId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Error al eliminar cita");
      
      setCitas(citas.filter(cita => cita._id !== citaId));
    } catch (error) {
      console.error("Error al eliminar cita:", error);
      setError("No se pudo eliminar la cita");
    } finally {
      setIsLoading(prev => ({ ...prev, citas: false }));
    }
  };

  // Manejador para agregar documentos al trámite
  const addDocument = () => {
    setNewTramite((prevData) => ({
      ...prevData,
      documentos: [...prevData.documentos, { tipo: "", archivo: null }],
    }));
  };

  // Manejador para eliminar un documento
  const removeDocument = (index) => {
    setNewTramite((prevData) => ({
      ...prevData,
      documentos: prevData.documentos.filter((_, i) => i !== index),
    }));
  };

  // Función para obtener el nombre de un usuario a partir de su ID
  const getNombreUsuario = (usuarioId) => {
    const usuario = usuarios.find(u => u._id === usuarioId);
    return usuario ? `${usuario.nombre} ${usuario.apellidos || ''}` : 'Usuario no encontrado';
  };

  // Función para obtener el nombre de un tipo de trámite a partir de su ID
  const getNombreTipoTramite = (tipoTramiteId) => {
    const tipo = tiposTramite.find(t => t._id === tipoTramiteId);
    return tipo ? tipo.nombre : 'Tipo de trámite no encontrado';
  };

  // Función para formatear la fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Fecha no disponible';
    return new Date(fechaStr).toLocaleString();
  };

  // Función para obtener la clase de color según el estado del trámite
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4 text-[#003366]">Dashboard de Administrador</h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Sección de Métricas */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-[#003366]">Métricas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white shadow rounded p-4 text-center">
              <h3 className="text-xl font-medium mb-2">Número de Usuarios</h3>
              <span id="num-usuarios" className="text-2xl font-bold">
                {isLoading.usuarios ? (
                  <div className="animate-pulse h-8 w-16 bg-gray-200 mx-auto rounded"></div>
                ) : usuarios.length}
              </span>
            </div>
            <div className="bg-white shadow rounded p-4 text-center">
              <h3 className="text-xl font-medium mb-2">Número de Trámites</h3>
              <span id="num-tramites" className="text-2xl font-bold">
                {isLoading.tramites ? (
                  <div className="animate-pulse h-8 w-16 bg-gray-200 mx-auto rounded"></div>
                ) : tramites.length}
              </span>
            </div>
            <div className="bg-white shadow rounded p-4 text-center">
              <h3 className="text-xl font-medium mb-2">Citas Creadas</h3>
              <span id="num-citas" className="text-2xl font-bold">
                {isLoading.citas ? (
                  <div className="animate-pulse h-8 w-16 bg-gray-200 mx-auto rounded"></div>
                ) : citas.length}
              </span>
            </div>
          </div>
        </div>

        {/* Sección de Trámites del Sistema */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-[#003366]">Trámites del Sistema</h2>
          {isLoading.tramites ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : tramites.length === 0 ? (
            <div className="bg-blue-50 p-4 rounded text-center">
              <p className="text-blue-700">No hay trámites registrados en el sistema.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Código</th>
                    <th className="border border-gray-300 px-4 py-2">Usuario</th>
                    <th className="border border-gray-300 px-4 py-2">Tipo de Trámite</th>
                    <th className="border border-gray-300 px-4 py-2">Fecha de Creación</th>
                    <th className="border border-gray-300 px-4 py-2">Fecha de Cita</th>
                    <th className="border border-gray-300 px-4 py-2">Estado</th>
                    <th className="border border-gray-300 px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tramites.map((tramite) => (
                    <tr key={tramite._id}>
                      <td className="border border-gray-300 px-4 py-2">{tramite.codigoTramite || 'Sin código'}</td>
                      <td className="border border-gray-300 px-4 py-2">{getNombreUsuario(tramite.usuario_id)}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {getNombreTipoTramite(tramite.tipoTramite_id)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {tramite.createdAt ? formatearFecha(tramite.createdAt) : 'No disponible'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {tramite.cita && tramite.cita.fechaHora ? formatearFecha(tramite.cita.fechaHora) : 'No asignada'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(tramite.estado)}`}>
                          {tramite.estado || 'Pendiente'}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            // Esta función podría manejarse en el futuro para editar trámites
                            console.log("Editar trámite:", tramite._id);
                          }}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                          disabled={isLoading.tramites}
                        >
                          Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Botones para Crear Usuario y Trámite */}
        <div className="mb-8">
          <button
            onClick={handleShowCreateUserForm}
            className="bg-[#CC9900] hover:bg-[#B38600] text-white font-bold py-2 px-4 rounded"
          >
            Crear Usuario
          </button>
          &nbsp;
          <button
            onClick={handleShowCreateTramiteForm}
            className="bg-[#CC9900] hover:bg-[#B38600] text-white font-bold py-2 px-4 rounded"
          >
            Crear Trámite
          </button>
        </div>

        {/* Formulario de Crear Usuario (Modal) */}
        {showCreateUserForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow max-w-lg w-full">
              <h2 className="text-lg font-bold mb-4 text-[#003366]">Crear Usuario</h2>
              <form onSubmit={crearUsuario} className="space-y-4">
                <div>
                  <label htmlFor="numeroIdentificacion" className="block text-sm font-medium text-[#003366]">
                    Número de Identificación:
                  </label>
                  <input
                    type="text"
                    id="numeroIdentificacion"
                    name="numeroIdentificacion"
                    value={newUsuario.numeroIdentificacion}
                    onChange={handleUsuarioChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-[#003366]">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={newUsuario.nombre}
                    onChange={handleUsuarioChange}
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
                    value={newUsuario.apellidos}
                    onChange={handleUsuarioChange}
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
                    value={newUsuario.email}
                    onChange={handleUsuarioChange}
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
                    value={newUsuario.telefono}
                    onChange={handleUsuarioChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#003366]">
                    Contraseña:
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={newUsuario.password}
                    onChange={handleUsuarioChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="rol" className="block text-sm font-medium text-[#003366]">
                    Rol:
                  </label>
                  <select
                    id="rol"
                    name="rol"
                    value={newUsuario.rol}
                    onChange={handleUsuarioChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                    required
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isLoading.usuarios}
                  className="bg-[#CC9900] hover:bg-[#B38600] text-white font-bold py-2 px-4 rounded"
                >
                  {isLoading.usuarios ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </span>
                  ) : "Guardar Usuario"}
                </button>
                <button
                  type="button"
                  onClick={handleHideCreateUserForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Formulario de Crear Trámite (Modal) - Actualizado */}
        {showCreateTramiteForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow max-w-2xl w-full h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4 text-[#003366]">Crear Trámite</h2>
              <form onSubmit={crearTramite} className="space-y-4">
                {/* Sección de código y usuario */}
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <h3 className="text-md font-medium mb-3 text-blue-800">Información General</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="codigoTramite" className="block text-sm font-medium text-[#003366]">
                        Código de Trámite:
                      </label>
                      <input
                        type="text"
                        id="codigoTramite"
                        name="codigoTramite"
                        value={newTramite.codigoTramite}
                        onChange={handleTramiteChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="usuario_id" className="block text-sm font-medium text-[#003366]">
                        Usuario:
                      </label>
                      <select
                        id="usuario_id"
                        name="usuario_id"
                        value={newTramite.usuario_id}
                        onChange={handleTramiteChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                        required
                      >
                        <option value="">Selecciona un usuario</option>
                        {usuarios.map((usuario) => (
                          <option key={usuario._id} value={usuario._id}>
                            {usuario.nombre} {usuario.apellidos} - {usuario.contacto?.email || 'Sin email'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Sección de tipo de trámite */}
                <div className="bg-green-50 p-4 rounded-md mb-4">
                  <h3 className="text-md font-medium mb-3 text-green-800">Tipo de Trámite</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="tipoTramite.nombre" className="block text-sm font-medium text-[#003366]">
                        Nombre del Tipo de Trámite:
                      </label>
                      <input
                        type="text"
                        id="tipoTramite.nombre"
                        name="tipoTramite.nombre"
                        value={newTramite.tipoTramite.nombre}
                        onChange={handleTramiteChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="tipoTramite.descripcion" className="block text-sm font-medium text-[#003366]">
                        Descripción:
                      </label>
                      <textarea
                        id="tipoTramite.descripcion"
                        name="tipoTramite.descripcion"
                        value={newTramite.tipoTramite.descripcion}
                        onChange={handleTramiteChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label htmlFor="tipoTramite.dependencia_id" className="block text-sm font-medium text-[#003366]">
                        Dependencia:
                      </label>
                      <input
                        type="text"
                        id="tipoTramite.dependencia_id"
                        name="tipoTramite.dependencia_id"
                        value={newTramite.tipoTramite.dependencia_id}
                        onChange={handleTramiteChange}
                        placeholder="Escriba el nombre de la dependencia"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                        required
                      />
                    </div>
                    
                    {/* Requisitos */}
                    <div>
                      <label className="block text-sm font-medium text-[#003366] mb-2">
                        Requisitos:
                      </label>
                      <div className="flex mb-2">
                        <input
                          type="text"
                          value={nuevoRequisito}
                          onChange={(e) => setNuevoRequisito(e.target.value)}
                          placeholder="Ingrese un requisito"
                          className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleAddRequisito}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-r-md"
                        >
                          Añadir
                        </button>
                      </div>
                      {newTramite.tipoTramite.requisitos.length > 0 && (
                        <ul className="mt-2 bg-white p-3 border border-gray-200 rounded-md max-h-32 overflow-y-auto">
                          {newTramite.tipoTramite.requisitos.map((req, index) => (
                            <li key={index} className="flex justify-between items-center py-1 hover:bg-gray-50">
                              <span className="text-sm">{req}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveRequisito(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* Estado del trámite */}
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-[#003366]">
                    Estado del Trámite:
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={newTramite.estado}
                    onChange={handleTramiteChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                    required
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="completado">Completado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </div>

                {/* Sección de documentos */}
                <div className="bg-amber-50 p-4 rounded-md mb-4">
                  <h3 className="text-md font-medium mb-3 text-amber-800">Documentos</h3>
                  {newTramite.documentos.map((doc, index) => (
                    <div key={index} className="mb-4 flex space-x-2">
                      <div className="w-1/2">
                        <label htmlFor={`tipo-${index}`} className="block text-sm font-medium text-[#003366]">
                          Tipo de Documento:
                        </label>
                        <input
                          type="text"
                          id={`tipo-${index}`}
                          name="tipo"
                          placeholder="Ej: Identificación, Comprobante, etc."
                          value={doc.tipo}
                          onChange={(e) => {
                            const updatedDocs = newTramite.documentos.map((d, i) =>
                              i === index ? { ...d, tipo: e.target.value } : d
                            );
                            setNewTramite((prevData) => ({
                              ...prevData,
                              documentos: updatedDocs,
                            }));
                          }}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                          required
                        />
                      </div>
                      <div className="w-1/2">
                        <label htmlFor={`archivo-${index}`} className="block text-sm font-medium text-[#003366]">
                          Archivo:
                        </label>
                        <input
                          type="file"
                          id={`archivo-${index}`}
                          name="archivo"
                          onChange={(e) => {
                            const updatedDocs = newTramite.documentos.map((d, i) =>
                              i === index ? { ...d, archivo: e.target.files[0] } : d
                            );
                            setNewTramite((prevData) => ({
                              ...prevData,
                              documentos: updatedDocs,
                            }));
                          }}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-7"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addDocument}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Agregar Documento
                  </button>
                </div>

                {/* Sección de cita */}
                <div className="bg-indigo-50 p-4 rounded-md mb-4">
                  <h3 className="text-md font-medium mb-3 text-indigo-800">Información de la Cita</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cita.fechaHora" className="block text-sm font-medium text-[#003366]">
                        Fecha y Hora de la Cita:
                      </label>
                      <input
                        type="datetime-local"
                        id="cita.fechaHora"
                        name="cita.fechaHora"
                        value={newTramite.cita.fechaHora}
                        onChange={handleTramiteChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cita.estado" className="block text-sm font-medium text-[#003366]">
                        Estado de la Cita:
                      </label>
                      <select
                        id="cita.estado"
                        name="cita.estado"
                        value={newTramite.cita.estado}
                        onChange={handleTramiteChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                        required
                      >
                        <option value="programada">Programada</option>
                        <option value="completada">Completada</option>
                        <option value="cancelada">Cancelada</option>
                        <option value="no_asistio">No Asistió</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleHideCreateTramiteForm}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading.tramites}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {isLoading.tramites ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </span>
                    ) : "Guardar Trámite"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Formulario de Editar Cita (Modal) */}
        {showEditCitaForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow max-w-lg w-full">
              <h2 className="text-lg font-bold mb-4 text-[#003366]">Editar Cita</h2>
              <form onSubmit={actualizarCita} className="space-y-4">
                <div>
                  <label htmlFor="usuario_id" className="block text-sm font-medium text-[#003366]">
                    Usuario:
                  </label>
                  <select
                    id="usuario_id"
                    name="usuario_id"
                    value={editCita.usuario_id}
                    onChange={handleEditCitaChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                    required
                  >
                    <option value="">Selecciona un usuario</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario._id} value={usuario._id}>
                        {usuario.nombre} {usuario.apellidos} - {usuario.contacto?.email || 'Sin email'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="tramite_id" className="block text-sm font-medium text-[#003366]">
                    Trámite:
                  </label>
                  <select
                    id="tramite_id"
                    name="tramite_id"
                    value={editCita.tramite_id}
                    onChange={handleEditCitaChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                    required
                  >
                    <option value="">Selecciona un trámite</option>
                    {tramites.map((tramite) => (
                      <option key={tramite._id} value={tramite._id}>
                        {getNombreTipoTramite(tramite.tipoTramite_id)} - {tramite.codigoTramite || 'Sin código'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="fechaHora" className="block text-sm font-medium text-[#003366]">
                    Fecha y Hora:
                  </label>
                  <input
                    type="datetime-local"
                    id="fechaHora"
                    name="fechaHora"
                    value={editCita.fechaHora}
                    onChange={handleEditCitaChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-[#003366]">
                    Estado:
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={editCita.estado}
                    onChange={handleEditCitaChange}
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
                  disabled={isLoading.citas}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                >
                  {isLoading.citas ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </span>
                  ) : "Guardar Cambios"}
                </button>
                <button
                  type="button"
                  onClick={handleHideEditCitaForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;