import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";

const Dashboard = () => {
  const { folderId } = useParams();
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageName, setImageName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredImages, setFilteredImages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Fetch subfolders
  const fetchSubFolders = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/folder/subfolders/${folderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error("Error fetching sub-folders:", error);
    }
  };

  const fetchImages = async (newPage = 1) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/image/list/${folderId}?page=${newPage}&limit=4`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      console.log("Fetched images:", data);

      if (data.success) {
        setImages(data.images);
        setTotalPages(data.totalPages);
        setPage(data.currentPage);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
    }
  };
  const handlePageChange = (event, value) => {
    fetchImages(value);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
    } else {
      setIsAuthenticated(true);
      if (folderId) {
        fetchSubFolders();
        fetchImages();
      }
    }
  }, [folderId]);
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredImages(images);
    } else {
      const filtered = images.filter((image) =>
        image.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredImages(filtered);
    }
  }, [searchQuery, images]);

  // Create a new sub-folder
  const createSubFolder = async () => {
    const folderName = prompt("Enter sub-folder name:");
    if (!folderName) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/folder/create`,
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

  // Delete Folder
  const deleteFolder = async (folderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this folder and all its contents?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/folder/${folderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setFolders(folders.filter((folder) => folder._id !== folderId));
      } else {
        alert("Failed to delete folder");
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  // Delete Image
  const deleteImage = async (imageId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/image/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setImages(images.filter((image) => image._id !== imageId));
      } else {
        alert("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Modal functions
  const closeModal = () => {
    setIsModalOpen(false);
    setImageName("");
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload Image
  const uploadImage = async () => {
    if (!imageName || !selectedFile)
      return alert("Please enter name and select an image");

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("name", imageName);
    formData.append("folder", folderId);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/image/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to upload image");
      closeModal();
      fetchImages(); // Refresh images after upload
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {isAuthenticated ? (
        <>
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          {/* Create Sub-Folder Button */}
          <button
            onClick={createSubFolder}
            className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            + Create Sub-Folder
          </button>

          {/* Sub-Folders List */}
          <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Sub-Folders</h2>
            <ul className="divide-y divide-gray-200">
              {folders.length > 0 ? (
                folders.map((folder) => (
                  <li
                    key={folder._id}
                    className="p-3 flex justify-between items-center hover:bg-gray-100 transition"
                  >
                    <Link
                      to={`/dashboard/${folder._id}`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      {folder.name}
                    </Link>
                    <button
                      onClick={() => deleteFolder(folder._id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <FaTrash size={16} />
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-center p-3">
                  No sub-folders found
                </li>
              )}
            </ul>
          </div>

          {/* Image Upload Section */}
          <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Images</h2>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />

            <button
              onClick={() => setIsModalOpen(true)}
              className="mb-6 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
            >
              Upload Image
            </button>

            {/* Display Fetched Images */}
            <ul className="grid grid-cols-2 gap-4">
              {filteredImages.length > 0 ? (
                filteredImages.map((image) => (
                  <li
                    key={image._id}
                    className="p-3 border rounded-lg flex flex-col items-center relative"
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <p className="text-center text-sm mt-2">{image.name}</p>
                    <button
                      onClick={() => deleteImage(image._id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 cursor-pointer"
                    >
                      <FaTrash size={14} />
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-center p-3">
                  No images found
                </li>
              )}
            </ul>

            {/* Upload Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm  bg-opacity-5 border-2 border-black rounded-lg p-4">
                <div className="bg-white p-6 rounded-lg shadow-md w-96">
                  <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
                  <input
                    type="text"
                    placeholder="Image Name"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    className="border p-2 w-full mb-3"
                  />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="mb-4"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={uploadImage}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <div> Please login to access this page </div>
      )}
    </div>
  );
};

export default Dashboard;
