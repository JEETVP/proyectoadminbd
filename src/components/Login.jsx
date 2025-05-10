import { useState } from 'react';
import { Eye, EyeOff, UserRound, KeyRound, ArrowRightCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import QRScanner from './QRScanner';

function Login() {
  // Estados para manejo de formulario
  const [numeroIdentificacion, setNumeroIdentificacion] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordarSesion, setRecordarSesion] = useState(false);
  
  // Estados de aplicación
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [metodoActivo, setMetodoActivo] = useState('tradicional');

  // Manejo de envío de formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  // Función de login con credenciales
  const handleLogin = async () => {
    if (!numeroIdentificacion || !password) {
      setMensaje({ tipo: 'error', texto: 'Por favor complete todos los campos' });
      return;
    }

    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const res = await fetch("https://backendbernyfix.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: numeroIdentificacion,
          password,
        }),
      });

      setCargando(false);

      if (!res.ok) {
        const error = await res.json();
        setMensaje({ tipo: 'error', texto: `Error de autenticación: ${error.mensaje}` });
        return;
      }

      const data = await res.json();
      setMensaje({ tipo: 'exito', texto: `Bienvenido, ${data.usuario.nombre}` });

      // Reset form fields
      setNumeroIdentificacion('');
      setPassword('');

      // Guardar token o redirigir
      // localStorage.setItem("token", data.token);
      // navigate("/dashboard");

    } catch (err) {
      setCargando(false);
      setMensaje({ tipo: 'error', texto: 'Error al conectar con el servidor. Por favor intente más tarde.' });
      console.error("Error durante login:", err);
    }
  };

  // Manejo de escaneo QR - Ahora directo sin contraseña
  const handleQRScanned = async (decodedText) => {
    try {
      setCargando(true);
      setMensaje({ tipo: '', texto: '' });
      
      const credentials = JSON.parse(decodedText);
      console.log("QR decodificado:", credentials);

      // Asegurar que el campo correcto esté presente
      const loginData = {
        email: credentials.email || credentials.numeroIdentificacion,
        password: credentials.password,
      };

      // Mostrar los valores que se mandarán
      console.log("Datos que se envían al backend:");
      console.log("email:", loginData.email);
      console.log("password:", loginData.password);

      const res = await fetch("https://backendbernyfix.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      setCargando(false);

      if (!res.ok) {
        const error = await res.json();
        setMensaje({ tipo: 'error', texto: `Error de autenticación: ${error.mensaje}` });
        return;
      }

      const data = await res.json();
      setMensaje({ tipo: 'exito', texto: `Bienvenido, ${data.usuario.nombre}` });
      console.log("Login exitoso:", data);
      
      // Aquí podrías guardar el token o redirigir
      // localStorage.setItem("token", data.token);
      // navigate("/dashboard");
      
    } catch (err) {
      setCargando(false);
      setMensaje({ tipo: 'error', texto: 'Error al procesar el código QR. Intente nuevamente.' });
      console.error("Error procesando QR:", err);
    }
  };

  // Función para renderizar mensajes de alerta
  const renderMensaje = () => {
    if (!mensaje.texto) return null;
    
    return (
      <div 
        className={`mt-4 p-4 rounded-lg text-sm flex items-start ${
          mensaje.tipo === 'exito' 
            ? 'bg-green-50 text-green-800 border-l-4 border-green-500' 
            : 'bg-red-50 text-red-800 border-l-4 border-red-500'
        }`}
      >
        {mensaje.tipo === 'exito' ? (
          <CheckCircle2 size={18} className="mr-2 flex-shrink-0" />
        ) : (
          <AlertCircle size={18} className="mr-2 flex-shrink-0" />
        )}
        <span>{mensaje.texto}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl">
        {/* Panel izquierdo - Solo visible en pantallas medianas y grandes */}
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-blue-700 to-indigo-800 p-10 text-white flex-col justify-between relative overflow-hidden">
          {/* Patrones de fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute w-96 h-96 -top-20 -left-20 rounded-full bg-white"></div>
            <div className="absolute w-96 h-96 -bottom-20 -right-20 rounded-full bg-white"></div>
          </div>
          
          <div className="relative z-10">
            <img 
              src="https://ceigep.puebla.gob.mx/sfa/images/logo-2024-2030.png" 
              alt="Logo" 
              className="h-14 w-auto mb-8"
            />
            <h1 className="text-3xl font-bold mb-4">Servicio de Trámites</h1>
            <p className="text-blue-100 text-lg">Plataforma oficial para gestionar sus trámites gubernamentales de forma segura y eficiente.</p>
          </div>
          
          <div className="mt-auto relative z-10">
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <blockquote className="italic text-blue-100">
                "Simplificamos los trámites para que pueda concentrarse en lo que realmente importa."
              </blockquote>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="md:w-3/5 p-6 md:p-12">
          <div className="max-w-lg mx-auto">
            <div className="md:hidden flex justify-center mb-8">
              <img 
                src="/api/placeholder/80/80" 
                alt="Logo" 
                className="h-14 w-auto"
              />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Acceso al sistema</h2>
            <p className="text-gray-600 mb-8">Ingrese sus credenciales para acceder a sus trámites</p>

            {/* Selector de método de acceso */}
            <div className="flex mb-8 border rounded-lg overflow-hidden">
              <button 
                onClick={() => setMetodoActivo('tradicional')}
                className={`flex-1 py-3 font-medium text-sm transition ${
                  metodoActivo === 'tradicional' 
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                    : 'bg-white text-gray-500'
                }`}
                aria-label="Acceder con credenciales"
              >
                Acceso con Credenciales
              </button>
              <button 
                onClick={() => setMetodoActivo('qr')}
                className={`flex-1 py-3 font-medium text-sm transition ${
                  metodoActivo === 'qr' 
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                    : 'bg-white text-gray-500'
                }`}
                aria-label="Acceder con código QR"
              >
                Acceso con QR
              </button>
            </div>

            {metodoActivo === 'tradicional' ? (
              /* Formulario de login tradicional */
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="numeroIdentificacion" className="block text-sm font-medium text-gray-700 mb-1">
                      Número de identificación
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserRound size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="numeroIdentificacion"
                        type="text"
                        placeholder="Ingrese su número de identificación"
                        value={numeroIdentificacion}
                        onChange={(e) => setNumeroIdentificacion(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        required
                        autoComplete="username"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyRound size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={mostrarPassword ? "text" : "password"}
                        placeholder="Ingrese su contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={cargando}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {cargando ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <>
                        Iniciar sesión
                        <ArrowRightCircle size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
                
                {renderMensaje()}
                
              </form>
            ) : (
              /* QR Scanner - Ahora con acceso directo sin contraseña */
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    Escanee su código QR para iniciar sesión de forma rápida
                  </p>
                  <div className="w-full max-w-xs mx-auto border-4 border-dashed border-blue-200 rounded-lg p-4 bg-gray-50">
                    <QRScanner onScanned={handleQRScanned} />
                  </div>
                </div>
                
                {renderMensaje()}
                
                {cargando && (
                  <div className="flex justify-center mt-4">
                    <div className="animate-spin h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                )}
                
                <button
                  onClick={() => setMetodoActivo('tradicional')}
                  className="w-full mt-4 py-2 text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Volver al método tradicional
                </button>
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 mt-2">
                Al acceder, usted acepta nuestros <a href="#" className="text-blue-500 hover:underline">Términos de servicio</a> y <a href="#" className="text-blue-500 hover:underline">Política de privacidad</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;