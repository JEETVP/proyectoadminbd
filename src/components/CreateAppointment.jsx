import React, { useState, useEffect } from "react";
import { Calendar, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import Navbar from "./Navbar";

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, appointmentDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <div className="absolute top-4 right-4">
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-[#003366] mb-4">Cita Confirmada</h2>
          <div className="space-y-2 text-left bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <FileText className="text-[#CC9900] w-5 h-5" />
              <span className="font-semibold text-gray-700">Trámite:</span>
              <span>{appointmentDetails.tramiteName}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="text-[#CC9900] w-5 h-5" />
              <span className="font-semibold text-gray-700">Fecha y Hora:</span>
              <span>{new Date(appointmentDetails.fechaHora).toLocaleString()}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="mt-6 w-full bg-[#CC9900] hover:bg-[#B38600] text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateAppointment = () => {
  const [formData, setFormData] = useState({
    tramite_id: "",
    fechaHora: "",
    estado: "programada",
  });

  const [tramites, setTramites] = useState([]);
  const [error, setError] = useState("");
  const [selectedTramite, setSelectedTramite] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState(null);

  useEffect(() => {
    const cargarTramites = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("https://backendbernyfix.onrender.com/api/tipotramites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          setTramites(data);
        } else {
          throw new Error("Respuesta inesperada del servidor");
        }
      } catch (error) {
        console.error("Error al obtener trámites:", error);
        setError("No se pudieron cargar los trámites");
      }
    };

    cargarTramites();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "tramite_id") {
      const tramite = tramites.find(t => t._id === value);
      setSelectedTramite(tramite);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://backendbernyfix.onrender.com/api/citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setConfirmationDetails({
          tramiteName: selectedTramite.nombre,
          fechaHora: formData.fechaHora
        });
        setIsModalOpen(true);
        setFormData({
          tramite_id: "",
          fechaHora: "",
          estado: "programada",
        });
        setSelectedTramite(null);
      } else {
        // Show error modal or notification
        setError("Error al crear la cita");
      }
    } catch (error) {
      console.error("Error al crear la cita:", error);
      setError("Ocurrió un error al crear la cita");
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 sm:p-10">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 relative">
          <div className="absolute top-8 right-8">
            <div className="bg-[#CC9900] bg-opacity-10 p-3 rounded-full">
              <FileText className="text-[#CC9900] w-6 h-6" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-6 text-[#003366] text-center">Crear Nueva Cita</h1>

          {error && (
            <div className="mb-4 text-red-600 font-semibold text-center flex items-center justify-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="tramite_id" className="block text-sm font-medium text-gray-700 mb-2">
                Trámite
              </label>
              <div className="relative">
                <select
                  id="tramite_id"
                  name="tramite_id"
                  value={formData.tramite_id}
                  onChange={handleChange}
                  className="appearance-none block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-[#CC9900]"
                  required
                >
                  <option value="">Selecciona un trámite</option>
                  {tramites.map((tramite) => (
                    <option key={tramite._id} value={tramite._id}>
                      {tramite.nombre}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              {selectedTramite && (
                <div className="mt-2 bg-blue-50 p-3 rounded-xl flex items-center space-x-3">
                  <FileText className="text-blue-500 w-5 h-5" />
                  <span className="text-sm text-blue-800">
                    Trámite seleccionado: <span className="font-semibold">{selectedTramite.nombre}</span>
                  </span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="fechaHora" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha y Hora
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  id="fechaHora"
                  name="fechaHora"
                  value={formData.fechaHora}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#CC9900]"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#CC9900] hover:bg-[#B38600] text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Crear Cita</span>
            </button>
          </form>
        </div>
      </main>

      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        appointmentDetails={confirmationDetails}
      />
    </div>
  );
};

export default CreateAppointment;