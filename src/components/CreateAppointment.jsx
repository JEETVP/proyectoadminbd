import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle, AlertCircle, Briefcase, Calendar as CalendarIcon, ChevronDown, Clock, Info } from 'lucide-react';
import Navbar from './Navbar';

const CrearTramite = () => {
  const [tiposTramite, setTiposTramite] = useState([]);
  const [formData, setFormData] = useState({
    tipoTramite_id: '',
    fechaHora: '',
  });
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fechaMinima, setFechaMinima] = useState('');

  // Calcular fecha mínima permitida (día siguiente)
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // Formato YYYY-MM-DDTHH:MM requerido por input datetime-local
    const minDate = tomorrow.toISOString().slice(0, 16);
    setFechaMinima(minDate);
  }, []);

  // Cargar tipos de trámite
  useEffect(() => {
    const cargarTiposTramite = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch('https://backendbernyfix.onrender.com/api/tipotramites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setTiposTramite(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar tipos de trámite:', error);
        setIsLoading(false);
      }
    };

    cargarTiposTramite();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'fechaHora' && value) {
      // Validar que la hora esté entre 10:00 AM y 10:00 PM
      const date = new Date(value);
      const hour = date.getHours();
      
      if (hour < 10 || hour >= 22) {
        setMensaje('Las citas solo pueden programarse entre 10:00 AM y 10:00 PM');
        setTipoMensaje('error');
        return;
      }
      
      // Limpiar mensaje de error si la hora es válida
      if (mensaje && mensaje.includes('10:00 AM y 10:00 PM')) {
        setMensaje('');
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que la fecha sea futura y dentro del horario permitido
    if (formData.fechaHora) {
      const selectedDate = new Date(formData.fechaHora);
      const hour = selectedDate.getHours();
      
      // Validar que la hora esté entre 10:00 AM y 10:00 PM
      if (hour < 10 || hour >= 22) {
        setMensaje('Las citas solo pueden programarse entre 10:00 AM y 10:00 PM');
        setTipoMensaje('error');
        return;
      }
    }
    
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://backendbernyfix.onrender.com/api/tramites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMensaje('Trámite creado con éxito');
        setTipoMensaje('success');
        setFormData({ tipoTramite_id: '', fechaHora: '' });
      } else {
        setMensaje('Error al crear el trámite');
        setTipoMensaje('error');
      }
    } catch (error) {
      console.error('Error al crear trámite:', error);
      setMensaje('Error del servidor');
      setTipoMensaje('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-lg border border-gray-100">
          {/* Header del formulario */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-lg mr-4">
                <Briefcase className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Crear Trámite</h2>
                <p className="text-blue-100 text-sm mt-1">Solicita tu cita para realizar un trámite</p>
              </div>
            </div>
          </div>

          {/* Contenido del formulario */}
          <div className="p-8">
            {mensaje && (
              <div className={`mb-6 p-4 rounded-lg flex items-center ${tipoMensaje === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {tipoMensaje === 'success' ? (
                  <CheckCircle className="mr-3 flex-shrink-0 text-green-500" size={20} />
                ) : (
                  <AlertCircle className="mr-3 flex-shrink-0 text-red-500" size={20} />
                )}
                <p className="font-medium">{mensaje}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Trámite
                </label>
                <div className="relative rounded-md shadow-sm">
                  <select
                    name="tipoTramite_id"
                    value={formData.tipoTramite_id}
                    onChange={handleChange}
                    required
                    className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={isLoading}
                    style={{ WebkitAppearance: 'none', appearance: 'none' }}
                  >
                    <option value="">Selecciona un tipo de trámite</option>
                    {tiposTramite.map((tipo) => (
                      <option key={tipo._id} value={tipo._id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                  {/* Agregamos la flecha como un elemento absoluto dentro del div relativo */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Fecha y Hora de la Cita
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="datetime-local"
                    name="fechaHora"
                    value={formData.fechaHora}
                    onChange={handleChange}
                    required
                    min={fechaMinima}
                    className="block w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={isLoading}
                  />
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1 text-blue-500" />
                  <span>Solo es posible agendar citas para días futuros, entre 10:00 AM y 10:00 PM</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Selecciona una fecha y hora disponible para tu cita</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  'Crear Trámite'
                )}
              </button>
            </form>
            
            {/* Información adicional */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                <p>Las citas se confirmarán por correo electrónico</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearTramite;