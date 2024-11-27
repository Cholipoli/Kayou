// WebcamCapture.js
import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = ({ setCapturedImage, capturedImage }) => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc); // Store captured image in the parent component
  }, [webcamRef, setCapturedImage]);

  const retakePhoto = () => {
    setCapturedImage(null); // Clear captured image to show the webcam again
  };

  return (
    <div>
      {!capturedImage ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
          videoConstraints={{
            facingMode: "environment", // Try using the back camera
          }}
        />
      ) : (
        <img src={capturedImage} alt="Captured" className="w-full h-auto rounded" />
      )}
      <div className="mt-2">
        {!capturedImage ? (
          <button onClick={capture} className="bg-blue-500 text-white font-bold py-1 px-2 rounded">
            Capture Photo
          </button>
        ) : (
          <button onClick={retakePhoto} className="bg-gray-500 text-white font-bold py-1 px-2 rounded">
            Retake Photo
          </button>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
