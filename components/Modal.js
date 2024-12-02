import React, { useRef, useState, useEffect } from "react";
import { Client, Databases, ID, Storage, Permission, Role } from "appwrite";
import client, { storage, databases } from "../src/appwriteConfig";
import CameraModal from "./CameraModal";
import { returnRocks} from '../src/services/appwriteService';

const Modal = ({ isVisible, onClose, rocks }) => {
  const [image, setImage] = useState(null); // State for the selected or captured image
  const [rockNumber, setRockNumber] = useState(""); // State for the rock number
  const [message, setMessage] = useState(""); // State for the optional message
  const [isCameraActive, setIsCameraActive] = useState(false); // State for camera activation
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment"); // State for camera direction
  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const [isrocknumbervalid, setisrocknumbervalid] = useState(false);

  if (!isVisible) return null;


  
  console.log(rocks)
  const startCamera = async () => {
    navigator.permissions.query({ name: 'camera' }).then((result) => {
    console.log('Camera permission:', result.state); // 'granted', 'denied', or 'prompt'
  });
  console.log('MediaDevices Support:', navigator.mediaDevices?.getUserMedia);
  console.log('Legacy getUserMedia Support:', navigator.getUserMedia);
  try {
    const stream = await (navigator.mediaDevices?.getUserMedia 
      ? navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode } }) 
      : navigator.getUserMedia?.call(navigator, { video: true }, (stream) => stream, (err) => { throw err; })
    );
    console.log('1')
    console.log(stream) // here it's fine
    if (stream) {
      console.log(videoRef) // null
      console.log(videoRef.current)
      console.log(videoRef.current.srcObject)
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
      console.log('2')
    }
  } catch (error) {
    console.error("Error accessing camera:", error);
    console.log('3')
  }
};

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => track.stop());
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL("image/jpeg");
      setImage(photo); // Save the captured photo
      stopCamera(); // Turn off the camera
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(rockNumber, capturedImage)
    if (!rockNumber || !capturedImage || rockNumber > rocks.length || rockNumber <= 0 || rockNumber % 1 != 0) {
      alert("Please provide a valid rock number and capture an image.");
      return;
    }

    await uploadImage(); // Upload the image and save the data
  };

  const uploadImage = async () => {
    try {
      const blob = await (await fetch(capturedImage)).blob(); // Convert Base64 to Blob
      const file = new File([blob], "rock-photo.jpg", { type: "image/jpeg" });

      const fileId = await storage.createFile(
        "6734e5b6000644c227a6", // Bucket ID
        ID.unique(),
        file,
        [Permission.read(Role.any())]
      );

      const fileURL = storage.getFileView("6734e5b6000644c227a6", fileId.$id);
      const location = await returnLocation();

      await addFoundEvent({
        Latitude: location[0],
        Longitude: location[1],
        Message: message,
        PhotoURL: fileURL,
        DateTime: new Date().toISOString(),
        RockKey: parseInt(rockNumber),
      });

      onClose(); // Close the modal
      setImage(null); // Reset the image
      setRockNumber(""); // Reset the rock number
      setMessage(""); // Reset the message
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  async function addFoundEvent(foundEventData) {
    console.log(foundEventData)
    console.log(databases)
    try {
      const response = await databases.createDocument(
        '6734d04f00181a1b460b',        // Database ID
        '6734d5150027f6a88371',              // Collection ID
        ID.unique(),                // Document ID (use rock number or custom ID)
        foundEventData              // Data for the document
      );
      console.log('Found Event Added:', response);

    } catch (error) {
      console.error('Error adding found event:', error);
    }
  }

  const returnLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve([position.coords.latitude, position.coords.longitude]),
          (error) => reject(error)
        );
      } else {
        reject("Geolocation not supported.");
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white w-11/12 md:w-1/3 p-5 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-2 text-gray-800">J&apos;ai trouvé un kayou !</h2>
        <p className="text-gray-700 text-sm mb-3">Prenez le kayou avec vous, mais avant de rentrer chez vous déposez le par terre et partagez avec nous son voyage!</p>
        <form onSubmit={handleSubmit}>
          {/* Rock Number Input */}
          <div className="mb-4">
            <label htmlFor="rockNumber" className="block text-gray-700 mb-2">
              Numéro de votre kayou*
            </label>
            <input
              type="number"
              id="rockNumber"
              value={rockNumber}
              onChange={(e) => setRockNumber(e.target.value)}
              className="w-full border p-2 rounded text-gray-800"
              placeholder="Écrivez le numéro de votre kayou ici"
              required
            />
          </div>

          {/* Message Textarea */}
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 mb-2">
              Un message pour les prochains qui trouveront ce kayou ? (Optionel)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border p-2 rounded text-gray-800"
              placeholder="Écrivez un message ici"
            />
          </div>

          {/* Camera and Capture Photo */}
          {isCameraActive ? (
            <div className="mb-4">
              <video ref={videoRef} autoPlay className="w-full rounded" />
              <button
                type="button"
                onClick={capturePhoto}
                className="bg-green-400 hover:bg-green-500 text-white font-bold py-1 px-3 rounded mt-2"
              >
                Capturer la photo
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCameraModalVisible(true)}
              className="bg-green-400 hover:bg-green-500 text-white font-bold py-1 px-3 rounded"
            >
              Prenez une photo 📸*
            </button>

          )}
          <div className="text-gray-500 text-xs">* = obligatoire</div>
          {/* Show Captured Image */}
          {capturedImage && (
            <div className="mt-4">
              <p className="text-gray-700">Aperçu de l&apos;image:</p>
              <img src={capturedImage} alt="Captured" className="max-w-20 rounded" />
            </div>
          )}

                {/* Camera Modal */}
          <CameraModal
            isVisible={isCameraModalVisible}
            onClose={() => setIsCameraModalVisible(false)}
            onCapture={(photo) => setCapturedImage(photo)}
          /> 

          {/*
          <div>
            <video
              ref={videoRef}
              style={{ width: '100%', height: 'auto' }} // Optional styling
              autoPlay
              muted
            ></video>
          </div>
          */}


          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Soumettre
            </button>
          </div>
        </form>
      </div>
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

export default Modal;
