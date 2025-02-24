import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFolder, FaEllipsisV } from "react-icons/fa"; // Folder and Menu Icons
import { Menu, MenuItem} from "@mui/material";
import { CiMenuKebab } from "react-icons/ci";

const Home = () => {
  const [folders, setFolders] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);
    fetchFolders();
  }, [API_URL]);

  const fetchFolders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/folder`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch folders");

      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const createFolder = async () => {
    if (!isAuthenticated) {
      alert("Please log in to create a folder.");
      navigate("/Auth"); // Redirect to login
      return;
    }

    const folderName = prompt("Enter folder name:");
    if (!folderName) return;

    try {
      const response = await fetch(`${API_URL}/api/folder/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: folderName }),
      });

      if (!response.ok) throw new Error("Failed to create folder");

      const newFolder = await response.json();
      setFolders([...folders, newFolder]);
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const deleteFolder = async (folderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this folder and all its contents?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/folder/${folderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to delete folder");

      setFolders(folders.filter((folder) => folder._id !== folderId));
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const handleMenuOpen = (event, folderId) => {
    setAnchorEl(event.currentTarget);
    setSelectedFolder(folderId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFolder(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Your Folders</h1>

      {!isAuthenticated ? (
        <div className="text-red-500 p-4 rounded-lg flex flex-col justify-center items-center">
          <p className="text-2xl">Please log in to access this page.</p>
          <Link to="/Auth" className="text-blue-600 font-medium">
            Go to Login
          </Link>
        </div>
      ) : (
        <>
          <button
            onClick={createFolder}
            className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Create New Folder
          </button>

          {/* Folder Grid Layout */}
          <div className="w-full flex-wrap sm:w-1/2 flex gap-6 bg-white p-6 rounded-lg shadow-md justify-center">
            {folders.length > 0 ? (
              folders.map((folder) => (
                <div
                  key={folder._id}
                  className="p-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition relative"
                >
                  <Link
                    to={`/dashboard/${folder._id}`}
                    className="flex flex-col items-center"
                  >
                    <FaFolder className="text-yellow-500 text-6xl" />
                    <span className="text-center text-gray-700 font-medium">
                      {folder.name}
                    </span>
                  </Link>

                  {/* Dropdown Menu using MUI */}
                  <div className="absolute top-1 right-0 cursor-pointer">
                     
                   <CiMenuKebab
                      onClick={(event) => handleMenuOpen(event, folder._id)}
                      
                    >
                      <FaEllipsisV />
                    </CiMenuKebab>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedFolder === folder._id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        onClick={() => {
                          deleteFolder(folder._id);
                          handleMenuClose();
                        }}
                      >
                        Delete Folder
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center p-3 col-span-full">
                No folders found
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
