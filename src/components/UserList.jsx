import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Edit, User, X, Check, Loader2, ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Navbar from "./Navbar";

const UserList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuarioEliminando, setUsuarioEliminando] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    rol: '',
    bloqueado: false
  });
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await axios.get('https://backendbernyfix.onrender.com/api/usuarios', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(res.data);
      } catch (err) {
        setError('No se pudieron cargar los usuarios.');
      } finally {
        setCargando(false);
      }
    };

    fetchUsuarios();
  }, [token]);

  const handleEditClick = (usuario) => {
    setUsuarioEditando(usuario);
    setForm({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.contacto?.email || '',
      telefono: usuario.contacto?.telefono || '',
      rol: usuario.rol,
      bloqueado: usuario.bloqueado,
    });
  };

  const handleDeleteClick = (usuario) => {
    setUsuarioEliminando(usuario);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleGuardar = async () => {
    try {
      const res = await axios.put(
        `https://backendbernyfix.onrender.com/api/usuarios/${usuarioEditando._id}`,
        {
          nombre: form.nombre,
          apellidos: form.apellidos,
          contacto: {
            email: form.email,
            telefono: form.telefono,
          },
          rol: form.rol,
          bloqueado: form.bloqueado,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsuarios((prev) =>
        prev.map((u) => (u._id === res.data._id ? res.data : u))
      );
      setUsuarioEditando(null);
    } catch (err) {
      alert('Error al guardar los cambios.');
    }
  };

  const handleEliminar = async () => {
    try {
      await axios.delete(
        `https://backendbernyfix.onrender.com/api/usuarios/${usuarioEliminando._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Actualizar la lista de usuarios eliminando el usuario
      setUsuarios((prev) => prev.filter((u) => u._id !== usuarioEliminando._id));
      setUsuarioEliminando(null);
    } catch (err) {
      alert('Error al eliminar el usuario.');
    }
  };

  const handleRegresar = () => {
    navigate('/admin-dashboard');
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const texto = `${u.nombre} ${u.apellidos} ${u.contacto?.email} ${u.contacto?.telefono} ${u.numeroIdentificacion} ${u.rol}`;
    return texto.toLowerCase().includes(busqueda.toLowerCase());
  });

  if (cargando) return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          <p className="mt-4 text-lg font-medium text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-2">
            <X className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-center text-lg font-medium text-gray-700">{error}</p>
          <button 
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-6 flex-1">
        <button
          onClick={handleRegresar}
          className="mb-4 inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver al Dashboard
        </button>
      
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <User className="h-6 w-6 mr-2 text-indigo-600" />
              Gestión de Usuarios 
              <span className="ml-2 text-sm font-normal bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full">
                {usuariosFiltrados.length} usuarios
              </span>
            </h2>
            
            <div className="mt-4 md:mt-0 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar usuario por nombre, email, teléfono, ID..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 w-full md:w-96 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellidos</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuariosFiltrados.length > 0 ? usuariosFiltrados.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{u.numeroIdentificacion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.apellidos}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.contacto?.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.contacto?.telefono}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        u.rol === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.rol === 'admin' ? 'Administrador' : 'Usuario'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        u.bloqueado 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {u.bloqueado ? 'Bloqueado' : 'Activo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <button
                        onClick={() => handleEditClick(u)}
                        className="inline-flex items-center bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(u)}
                        className="inline-flex items-center bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                      No se encontraron usuarios con ese criterio de búsqueda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {usuarioEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Edit className="h-5 w-5 mr-2" />
                Editar Usuario
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input 
                    name="nombre" 
                    value={form.nombre} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                  <input 
                    name="apellidos" 
                    value={form.apellidos} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    name="email" 
                    type="email"
                    value={form.email} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input 
                    name="telefono" 
                    value={form.telefono} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select 
                    name="rol" 
                    value={form.rol} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="bloqueado"
                    name="bloqueado" 
                    checked={form.bloqueado} 
                    onChange={handleChange} 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="bloqueado" className="ml-2 block text-sm text-gray-700">
                    {form.bloqueado ? 'Usuario bloqueado' : 'Usuario activo'}
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setUsuarioEditando(null)} 
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleGuardar} 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar usuario */}
      {usuarioEliminando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="bg-red-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Confirmar Eliminación
              </h3>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-500 mb-4">
                  <Trash2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">¿Está seguro que desea eliminar este usuario?</h3>
                <p className="text-sm text-gray-500">
                  Esta acción eliminará permanentemente a: <span className="font-semibold">{usuarioEliminando.nombre} {usuarioEliminando.apellidos}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Esta acción no se puede deshacer.
                </p>
              </div>
              
              <div className="flex justify-center space-x-3">
                <button 
                  onClick={() => setUsuarioEliminando(null)} 
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleEliminar} 
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Sí, Eliminar Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;