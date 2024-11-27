import React, { useRef, useState } from "react";

const CameraModal = ({ isVisible, onClose, onCapture }) => {
  const [facingMode, setFacingMode] = useState("user"); // Front camera by default
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }, // Front or back camera
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Stop the camera
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => track.stop());
  };

  // Capture a photo
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL("image/jpeg");
      stopCamera(); // Stop the camera after capturing the photo
      onCapture(photo); // Pass the captured photo to the parent
      onClose(); // Close the modal
    }
  };

  // Flip the camera
  const flipCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    stopCamera();
    startCamera();
  };

  // Effect: Start camera on open
  React.useEffect(() => {
    if (isVisible) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera(); // Cleanup camera on unmount
  }, [isVisible, facingMode]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center z-50">
      {/* Camera Video */}
      <video ref={videoRef} className="w-full h-3/4 object-cover rounded border border-white border-s"></video>

      {/* Buttons */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          type="button"
          onClick={capturePhoto}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Capturer la photo 📸
        </button>
        <button
          type="button"
          onClick={flipCamera}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Retourner la caméra 🔄
        </button>
        <button
          type="button"
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Fermer ❌
        </button>
      </div>

      {/* Hidden Canvas for Capturing Photo */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

export default CameraModal;
