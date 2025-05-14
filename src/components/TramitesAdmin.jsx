import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Search, Edit, User, X, Check, Loader2, ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import Navbar from "./Navbar"; // Import the Navbar component

const TramitesAdmin = () => {
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  // Initialize form with null for fechaHora, will set appropriately in handleEdit
  const [form, setForm] = useState({ tipoTramite_id: '', fechaHora: null, estado: '' });
  const [error, setError] = useState(null);
  // State for delete confirmation modal
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
  const [tramiteAEliminarId, setTramiteAEliminarId] = useState(null);


  const token = localStorage.getItem('token');
  const navigate = useNavigate(); // Initialize useNavigate

  // Helper function to format date from UTC (server) to local (for input)
  const formatUtcToLocalDatetimeInput = (utcDateString) => {
    if (!utcDateString) return '';
    const date = new Date(utcDateString);
    // Check for invalid date
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchTramites = async () => {
    try {
      const res = await axios.get('https://backendbernyfix.onrender.com/api/tramites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTramites(res.data);
    } catch (error) {
      console.error('Error al cargar trámites', error);
      setError('Error al cargar los trámites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTramites();
  }, []);

  // Function to open the delete confirmation modal
  const confirmarEliminar = (id) => {
    setTramiteAEliminarId(id);
    setMostrarConfirmacionEliminar(true);
  };

  // Function to close the delete confirmation modal
  const cancelarEliminar = () => {
    setTramiteAEliminarId(null);
    setMostrarConfirmacionEliminar(false);
    setError(null); // Clear error on cancel
  };

  // Function to handle the actual deletion after confirmation
  const ejecutarEliminar = async () => {
    if (!tramiteAEliminarId) return; // Should not happen if modal is correctly managed

    try {
      await axios.delete(`https://backendbernyfix.onrender.com/api/tramites/${tramiteAEliminarId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTramites(tramites.filter(t => t._id !== tramiteAEliminarId));
      cancelarEliminar(); // Close modal on success
    } catch (error) {
      console.error('Error al eliminar', error);
      setError('Error al eliminar el trámite.');
    }
  };

  const handleEdit = (tramite) => {
    setEditando(tramite._id);
   
    // Format the date from the server (likely UTC) to local time for the input
    const fechaHoraLocal = formatUtcToLocalDatetimeInput(tramite.cita?.fechaHora);

    setForm({
      tipoTramite_id: tramite.tipoTramite_id?._id || '',
      fechaHora: fechaHoraLocal, // Set the local time string
      estado: tramite.estado || 'pendiente'
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null); // Clear previous errors

    let fechaHoraUtcString = null;

    if (form.fechaHora) {
      // Create a Date object from the local time string from the input.
      // new Date() parses 'YYYY-MM-DDTHH:mm' as local time.
      const localDate = new Date(form.fechaHora);

      // Validate the parsed date
      if (isNaN(localDate.getTime())) {
          setError('Formato de fecha y hora inválido.');
          console.error('Invalid date selected:', form.fechaHora);
          return; // Stop submission
      }

      // Convert the local Date object to an ISO 8601 string (UTC)
      // This is the format recommended for storing in the backend.
      fechaHoraUtcString = localDate.toISOString();
    }


    try {
      await axios.put(`https://backendbernyfix.onrender.com/api/tramites/${editando}`, {
        tipoTramite_id: form.tipoTramite_id,
        // Send the UTC string or null if no date was selected
        cita: fechaHoraUtcString !== null ? { fechaHora: fechaHoraUtcString } : null,
        estado: form.estado
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditando(null);
      fetchTramites(); // Refresh the list after successful update
    } catch (error) {
      console.error('Error al actualizar', error.response?.data || error.message);
      setError('Error al actualizar la cita. Por favor verifica los datos. Detalles: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <> {/* Use a fragment to wrap the multiple top-level elements */}
      <Navbar /> {/* Add the Navbar component here */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Trámites</h2>
            {/* Button to go back to AdminDashboard with updated styling */}
            <button
              onClick={() => navigate('/admin-dashboard')} // Use the correct route for your AdminDashboard
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300" // Added styling classes
            >
              <ArrowLeft className="h-6 w-6 mr-2" /> {/* Adjusted icon size */}
              Volver al Dashboard
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Cita</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
               </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tramites.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.codigoTramite}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {t.usuario_id?.nombre} {t.usuario_id?.apellidos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {t.tipoTramite_id?.nombre || 'Tipo no encontrado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* Displaying the date in the user's local timezone */}
                      {t.cita?.fechaHora ? new Date(t.cita.fechaHora).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${t.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                         t.estado === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                         t.estado === 'completado' ? 'bg-green-100 text-green-800' :
                         'bg-red-100 text-red-800'}`}>
                        {t.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(t)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => confirmarEliminar(t._id)} // Call the new confirmation function
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                        >
                          Borrar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
          </div>

          {editando && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Editar Trámite</h3>
                    <button
                      onClick={() => setEditando(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Tipo de Trámite - Note: This input currently expects an ID string.
                    You might want a select/dropdown populated with actual trámite types. */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Tipo de Trámite (ID)</label>
                      <input
                        type="text"
                        value={form.tipoTramite_id}
                        onChange={(e) => setForm({ ...form, tipoTramite_id: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="ID del tipo de trámite"
                        required // Consider if this should be required if cita can be null
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
                      <input
                        type="datetime-local"
                        value={form.fechaHora || ''} // Use '' for empty value
                        onChange={(e) => setForm({ ...form, fechaHora: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                        // required // Remove required if date is optional
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Estado</label>
                      <select
                        value={form.estado}
                        onChange={(e) => setForm({ ...form, estado: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                        required
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En proceso</option>
                        <option value="completado">Completado</option>
                        <option value="rechazado">Rechazado</option>
                      </select>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditando(null)}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium shadow-sm"
                      >
                        Guardar Cambios
                      </button>
                  </div>
                </form>
                {/* Optional: Add a button to remove the existing date if needed */}
                {form.fechaHora && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setForm({...form, fechaHora: null})}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Limpiar fecha y hora de cita
                        </button>
                    </div>
                )}
              </div>
             </div>
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        {mostrarConfirmacionEliminar && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <AlertTriangle className="h-10 w-10 text-red-500 mr-3"/>
                  <h3 className="text-xl font-bold text-gray-800">Confirmar Eliminación</h3>
                </div>
                <p className="text-gray-600 text-center mb-6">
                  ¿Estás seguro de que deseas eliminar este trámite? Esta acción no se puede deshacer.
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={cancelarEliminar}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={ejecutarEliminar}
                    className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium shadow-sm"
                  >
                    Sí, Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default TramitesAdmin;