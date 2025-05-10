import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";

const QRScanner = ({ onScanned }) => {
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);
  const qrRegionId = "qr-reader";

  useEffect(() => {
    const startScanner = async () => {
      if (isRunningRef.current || scannerRef.current) {
        console.warn("El escáner ya está corriendo.");
        return;
      }

      const qrRegion = document.getElementById(qrRegionId);
      if (!qrRegion) {
        console.error("Elemento #qr-reader no está en el DOM.");
        return;
      }

      const html5QrCode = new Html5Qrcode(qrRegionId);
      scannerRef.current = html5QrCode;

      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            if (!isRunningRef.current) return;

            isRunningRef.current = false;
            try {
              await html5QrCode.stop();
              await html5QrCode.clear();
              onScanned(decodedText);
              scannerRef.current = null; // Limpiar referencia
            } catch (err) {
              console.error("Error al detener el escáner tras escanear:", err);
            }
          }
        );
        isRunningRef.current = true;
      } catch (err) {
        console.error("Error iniciando el escáner QR:", err);
      }
    };

    // Espera a que el div esté montado
    const timeout = setTimeout(startScanner, 0);

    return () => {
      clearTimeout(timeout);

      const html5QrCode = scannerRef.current;
      if (html5QrCode && isRunningRef.current) {
        html5QrCode
          .stop()
          .then(() => html5QrCode.clear())
          .then(() => {
            isRunningRef.current = false;
            scannerRef.current = null;
          })
          .catch((err) => {
            console.warn("No se pudo detener el escáner:", err.message);
          });
      }
    };
  }, [onScanned]);

  return <div id={qrRegionId} className="w-full h-auto" />;
};

export default QRScanner;
