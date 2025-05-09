import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, SwitchCamera, Check, Scan } from "lucide-react";

const QRScanner = () => {
  const [qrResult, setQrResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const scannerRef = useRef(null);
  const scannerContainerRef = useRef(null);
  const shouldStartScanRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices.length > 0) {
          setCameras(devices);
          setSelectedCamera(devices[0].id);
          shouldStartScanRef.current = true;
        } else {
          setHasCamera(false);
        }
      })
      .catch(() => {
        setHasCamera(false);
      });

    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  useEffect(() => {
    // Solo iniciar el scanner automáticamente cuando se carga la página
    // o cuando se selecciona una nueva cámara
    if (shouldStartScanRef.current && selectedCamera && !isScanning && !showResult) {
      shouldStartScanRef.current = false;
      startScanner();
    }
  }, [selectedCamera, isScanning, showResult]);

  const startScanner = () => {
    if (!scannerRef.current || !selectedCamera) return;

    scannerRef.current
      .start(
        selectedCamera,
        { fps: 10, qrbox: { width: 300, height: 300 } },
        (message) => {
          setQrResult(message);
          setShowResult(true);
          stopScanner();
        },
        console.warn
      )
      .then(() => setIsScanning(true))
      .catch(console.error);
  };

  const stopScanner = () => {
    if (scannerRef.current && isScanning) {
      scannerRef.current
        .stop()
        .then(() => setIsScanning(false))
        .catch(console.error);
    }
  };

  const switchCamera = () => {
    if (isScanning) stopScanner();
    const currentIndex = cameras.findIndex((c) => c.id === selectedCamera);
    const nextIndex = (currentIndex + 1) % cameras.length;
    setSelectedCamera(cameras[nextIndex].id);
    shouldStartScanRef.current = true; // Indicar que debe reiniciar el scanner
  };

  const handleNewScan = () => {
    setQrResult("");
    setShowResult(false);
    shouldStartScanRef.current = true; // Indicar que debe reiniciar el scanner
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Lector de QR</h1>
          <p className="text-gray-500">Escanea cualquier código QR con tu cámara</p>
        </div>

        {!hasCamera ? (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl text-center">
            <p className="font-semibold">No se detectó ninguna cámara.</p>
            <p>Verifica los permisos del navegador.</p>
          </div>
        ) : showResult ? (
          <div className="space-y-6">
            <div className="bg-green-500 text-white rounded-xl p-4 flex items-center justify-center gap-2">
              <Check size={24} />
              <span className="text-lg font-semibold">¡Código escaneado!</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-64">
              <p className="text-gray-800 break-words">{qrResult}</p>
            </div>
            <button
              onClick={handleNewScan}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <Scan size={20} />
              Escanear otro código
            </button>
          </div>
        ) : (
          <>
            <div
              id="reader"
              ref={scannerContainerRef}
              className="w-full aspect-square border-4 border-gray-200 rounded-xl overflow-hidden shadow mb-6"
            />
            <div className="flex gap-4 mb-4">
              {!isScanning ? (
                <button
                  onClick={startScanner}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Camera size={20} />
                  Iniciar escáner
                </button>
              ) : (
                <button
                  onClick={stopScanner}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
                >
                  Detener escáner
                </button>
              )}
              {cameras.length > 1 && (
                <button
                  onClick={switchCamera}
                  className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg"
                >
                  <SwitchCamera size={20} />
                </button>
              )}
            </div>
            <p className="text-center text-gray-500">
              Apunta la cámara al código QR para escanearlo
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default QRScanner;