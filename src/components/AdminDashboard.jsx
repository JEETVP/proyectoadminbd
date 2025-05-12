// src/components/AdminDashboard.jsx

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const AdminDashboard = () => {
  // Estado para mostrar/ocultar los modales
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showCreateTramiteForm, setShowCreateTramiteForm] = useState(false);

  // Datos simulados (sin backend)
  const usuarios = [
    { nombre: "Usuario 1", email: "user1@example.com" },
    { nombre: "Usuario 2", email: "user2@example.com" },
  ];

  const tramites = [
    { tipo: "Trámite 1", estado: "pendiente" },
    { tipo: "Trámite 2", estado: "completado" },
  ];

  const citas = [
    { usuario: "Usuario 1", fecha: new Date() },
    { usuario: "Usuario 2", fecha: new Date() },
  ];

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

  const [newTramite, setNewTramite] = useState({
    usuario_id: "",
    tipoTramite_id: "",
    estado: "pendiente",
    documentos: [],
  });

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

  // Manejador de cambio para el formulario de usuario
  const handleUsuarioChange = (e) => {
    const { name, value } = e.target;
    setNewUsuario((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejador de cambio para el formulario de trámite
  const handleTramiteChange = (e) => {
    const { name, value } = e.target;
    setNewTramite((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4 text-[#003366]">Dashboard de Administrador</h1>

        {/* Sección de Métricas */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-[#003366]">Métricas</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white shadow rounded p-4 text-center">
              <h3 className="text-xl font-medium mb-2">Número de Usuarios</h3>
              <span id="num-usuarios" className="text-2xl font-bold">
                {usuarios.length}
              </span>
            </div>
            <div className="bg-white shadow rounded p-4 text-center">
              <h3 className="text-xl font-medium mb-2">Número de Trámites</h3>
              <span id="num-tramites" className="text-2xl font-bold">
                {tramites.length}
              </span>
            </div>
            <div className="bg-white shadow rounded p-4 text-center">
              <h3 className="text-xl font-medium mb-2">Citas Creadas</h3>
              <span id="num-citas" className="text-2xl font-bold">
                {citas.length}
              </span>
            </div>
          </div>
        </div>

        {/* Sección de Citas Creadas */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-[#003366]">Citas Creadas</h2>
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Usuario</th>
                <th className="border border-gray-300 px-4 py-2">Fecha de Creación</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{cita.usuario}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(cita.fecha).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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
                  className="bg-[#CC9900] hover:bg-[#B38600] text-white font-bold py-2 px-4 rounded"
                >
                  Guardar Usuario
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

        {/* Formulario de Crear Trámite (Modal) */}
        {showCreateTramiteForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow max-w-lg w-full">
              <h2 className="text-lg font-bold mb-4 text-[#003366]">Crear Trámite</h2>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label htmlFor="usuario_id" className="block text-sm font-medium text-[#003366]">
                    Usuario:
                  </label>
                  <input
                    type="text"
                    id="usuario_id"
                    name="usuario_id"
                    value={newTramite.usuario_id}
                    onChange={handleTramiteChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="tipoTramite_id" className="block text-sm font-medium text-[#003366]">
                    Tipo de Trámite:
                  </label>
                  <select
                    id="tipoTramite_id"
                    name="tipoTramite_id"
                    value={newTramite.tipoTramite_id}
                    onChange={handleTramiteChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                    required
                  >
                    <option value="">Selecciona un tipo de trámite</option>
                    <option value="tramite1">Tipo de Trámite 1</option>
                    <option value="tramite2">Tipo de Trámite 2</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-[#003366]">
                    Estado:
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

                {/* Documentos */}
                <div>
                  <h3 className="text-md font-medium mb-2 text-[#003366]">Documentos</h3>
                  {newTramite.documentos.map((doc, index) => (
                    <div key={index} className="mb-4 flex space-x-2">
                      <div className="w-1/2">
                        <label htmlFor={`tipo-${index}`} className="block text-sm font-medium text-[#003366]">
                          Descripción:
                        </label>
                        <input
                          type="text"
                          id={`tipo-${index}`}
                          name="tipo"
                          placeholder="Descripción del documento"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
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

                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                >
                  Guardar Trámite
                </button>
                <button
                  type="button"
                  onClick={handleHideCreateTramiteForm}
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