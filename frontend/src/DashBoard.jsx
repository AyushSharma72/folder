import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Dashboard = () => {
  const { folderId } = useParams();
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/folders/${folderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setFolders(data.folders);
        setImages(data.images);
      } catch (error) {
        console.error("Error fetching folder data:", error);
      }
    };
    fetchFolderData();
  }, [folderId]);

  const createSubFolder = async () => {
    const folderName = prompt("Enter sub-folder name:");
    if (!folderName) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/folders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ name: folderName, parent: folderId }),
        }
      );
      const newFolder = await response.json();
      setFolders([...folders, newFolder]);
    } catch (error) {
      console.error("Error creating sub-folder:", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("folder", folderId);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/images/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
      const newImage = await response.json();
      setImages([...images, newImage]);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <button
        onClick={createSubFolder}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        + Create Sub-Folder
      </button>
      <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Sub-Folders</h2>
        <ul className="divide-y divide-gray-200">
          {folders.length > 0 ? (
            folders.map((folder) => (
              <li key={folder._id} className="p-3 hover:bg-gray-100 transition">
                <Link
                  to={`/dashboard/${folder._id}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {folder.name}
                </Link>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-center p-3">
              No sub-folders found
            </li>
          )}
        </ul>
      </div>
      <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Images</h2>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full mb-4 border border-gray-300 p-2 rounded-lg"
        />
        <button
          onClick={uploadImage}
          className="mb-6 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Upload Image
        </button>
        <ul className="grid grid-cols-2 gap-4">
          {images.length > 0 ? (
            images.map((image) => (
              <li key={image._id} className="p-3 border rounded-lg">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-center text-sm mt-2">{image.name}</p>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-center p-3">No images found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
