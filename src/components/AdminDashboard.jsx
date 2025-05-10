// src/components/AdminDashboard.jsx

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const AdminDashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [tipoTramites, setTipoTramites] = useState([]);
  const [newUsuario, setNewUsuario] = useState({
    numeroIdentificacion: "",
    nombre: "",
    apellidos: "",
    contacto: {
      email: "",
      telefono: "",
    },
    password: "",
    rol: "usuario",
  });

  const [newTramite, setNewTramite] = useState({
    usuario_id: "",
    tipoTramite_id: "",
    estado: "pendiente",
    documentos: [],
  });

  useEffect(() => {
    // Obtener usuarios desde el backend
    fetch("/api/usuarios")
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error al obtener usuarios:", error));

    // Obtener tipos de trámites desde el backend
    fetch("/api/tipo-tramites")
      .then((response) => response.json())
      .then((data) => setTipoTramites(data))
      .catch((error) => console.error("Error al obtener tipos de trámites:", error));
  }, []);

  const handleUsuarioChange = (e) => {
    const { name, value } = e.target;
    setNewUsuario((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleContactoChange = (e) => {
    const { name, value } = e.target;
    setNewUsuario((prevData) => ({
      ...prevData,
      contacto: {
        ...prevData.contacto,
        [name]: value,
      },
    }));
  };

  const handleTramiteChange = (e) => {
    const { name, value } = e.target;
    setNewTramite((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDocumentChange = (index, field, value) => {
    const updatedDocuments = newTramite.documentos.map((doc, i) =>
      i === index ? { ...doc, [field]: value } : doc
    );
    setNewTramite((prevData) => ({
      ...prevData,
      documentos: updatedDocuments,
    }));
  };

  const addDocument = () => {
    setNewTramite((prevData) => ({
      ...prevData,
      documentos: [...prevData.documentos, { tipo: "", archivo: null }],
    }));
  };

  const removeDocument = (index) => {
    const updatedDocuments = newTramite.documentos.filter((_, i) => i !== index);
    setNewTramite((prevData) => ({
      ...prevData,
      documentos: updatedDocuments,
    }));
  };

  const handleSubmitUsuario = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUsuario),
      });

      if (response.ok) {
        alert("Usuario creado exitosamente");
        setNewUsuario({
          numeroIdentificacion: "",
          nombre: "",
          apellidos: "",
          contacto: {
            email: "",
            telefono: "",
          },
          password: "",
          rol: "usuario",
        });
        // Actualizar la lista de usuarios
        const data = await response.json();
        setUsuarios([...usuarios, data]);
      } else {
        alert("Error al crear el usuario");
      }
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      alert("Ocurrió un error al crear el usuario");
    }
  };

  const handleSubmitTramite = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("usuario_id", newTramite.usuario_id);
      formData.append("tipoTramite_id", newTramite.tipoTramite_id);
      formData.append("estado", newTramite.estado);

      // Agregar documentos al FormData
      newTramite.documentos.forEach((doc, index) => {
        formData.append(`documentos[${index}][tipo]`, doc.tipo);
        if (doc.archivo) {
          formData.append(`documentos[${index}][archivo]`, doc.archivo);
        }
      });

      const response = await fetch("/api/tramites", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Trámite creado exitosamente");
        setNewTramite({
          usuario_id: "",
          tipoTramite_id: "",
          estado: "pendiente",
          documentos: [],
        });
      } else {
        alert("Error al crear el trámite");
      }
    } catch (error) {
      console.error("Error al crear el trámite:", error);
      alert("Ocurrió un error al crear el trámite");
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4 text-[#003366]">Dashboard de Administrador</h1>

        {/* Crear Usuario */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-[#003366]">Crear Usuario</h2>
          <form onSubmit={handleSubmitUsuario} className="space-y-4 max-w-2xl mx-auto">
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
                value={newUsuario.contacto.email}
                onChange={handleContactoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#CC9900] focus:border-[#CC9900] sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-[#003366]">
                Teléfono:
              </label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={newUsuario.contacto.telefono}
                onChange={handleContactoChange}
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
              Crear Usuario
            </button>
          </form>
        </div>

        {/* Crear Trámite */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-[#003366]">Crear Trámite</h2>
          <form onSubmit={handleSubmitTramite} className="space-y-4 max-w-2xl mx-auto">
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
                    {usuario.nombre} {usuario.apellidos} ({usuario.contacto.email})
                  </option>
                ))}
              </select>
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
                {tipoTramites.map((tipoTramite) => (
                  <option key={tipoTramite._id} value={tipoTramite._id}>
                    {tipoTramite.nombre}
                  </option>
                ))}
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
                      Tipo:
                    </label>
                    <input
                      type="text"
                      id={`tipo-${index}`}
                      name="tipo"
                      value={doc.tipo}
                      onChange={(e) => handleDocumentChange(index, "tipo", e.target.value)}
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
                      onChange={(e) => handleDocumentChange(index, "archivo", e.target.files[0])}
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
              className="bg-[#CC9900] hover:bg-[#B38600] text-white font-bold py-2 px-4 rounded"
            >
              Crear Trámite
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;