import React from 'react';

const FileInput = ({ setImage }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first file from the input
    if (file) {
      setImage(file); // Set the file object in parent component (directly passing file)
    }
  };

  return (
    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rockNumber">
          Choisissez une image du kayou
        </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 border rounded-md text-sm font-medium text-gray-700"
        required
      />
    </div>
  );
};

export default FileInput;
