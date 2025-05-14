import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TramitesAdmin = () => {
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null); // ID del trámite en edición
  const [form, setForm] = useState({ tipoTramite_id: '', fechaHora: '', estado: '' });

  const token = localStorage.getItem('token');

  const fetchTramites = async () => {
    try {
      const res = await axios.get('https://backendbernyfix.onrender.com/api/tramites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTramites(res.data);
    } catch (error) {
      console.error('Error al cargar trámites', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTramites();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este trámite?')) return;
    try {
      await axios.delete(`https://backendbernyfix.onrender.com/api/tramites/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTramites(tramites.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error al eliminar', error);
    }
  };

  const handleEdit = (tramite) => {
    setEditando(tramite._id);
    setForm({
      tipoTramite_id: tramite.tipoTramite_id?._id || '',
      fechaHora: tramite.cita?.fechaHora?.slice(0, 16) || '',
      estado: tramite.estado || 'pendiente'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://backendbernyfix.onrender.com/api/tramites/${editando}`, {
        tipoTramite_id: form.tipoTramite_id,
        cita: { fechaHora: form.fechaHora },
        estado: form.estado
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditando(null);
      fetchTramites();
    } catch (error) {
      console.error('Error al actualizar', error);
    }
  };

  if (loading) return <p className="text-center mt-6">Cargando trámites...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Trámites de todos los usuarios</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Código</th>
              <th className="border px-2 py-1">Usuario</th>
              <th className="border px-2 py-1">Tipo</th>
              <th className="border px-2 py-1">Fecha Cita</th>
              <th className="border px-2 py-1">Estado</th>
              <th className="border px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tramites.map((t) => (
              <tr key={t._id} className="text-center">
                <td className="border px-2 py-1">{t.codigoTramite}</td>
                <td className="border px-2 py-1">{t.usuario_id?.nombre} {t.usuario_id?.apellidos}</td>
                <td className="border px-2 py-1">{t.tipoTramite_id?.nombre || 'No encontrado'}</td>
                <td className="border px-2 py-1">{new Date(t.cita?.fechaHora).toLocaleString()}</td>
                <td className="border px-2 py-1">{t.estado}</td>
                <td className="border px-2 py-1 space-x-2">
                  <button
                    onClick={() => handleEdit(t)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded text-white"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-white"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editando && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Editar Trámite</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm">Tipo de Trámite ID</label>
              <input
                type="text"
                value={form.tipoTramite_id}
                onChange={(e) => setForm({ ...form, tipoTramite_id: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Fecha y Hora</label>
              <input
                type="datetime-local"
                value={form.fechaHora}
                onChange={(e) => setForm({ ...form, fechaHora: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Estado</label>
              <select
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              >
                <option value="pendiente">pendiente</option>
                <option value="en revisión">en_proceso</option>
                <option value="aprobado">completado</option>
                <option value="rechazado">rechazado</option>
              </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={() => setEditando(null)}
              className="ml-2 text-sm text-gray-500 underline"
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TramitesAdmin;
