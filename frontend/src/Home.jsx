import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFolder } from "react-icons/fa"; // Folder icon

const Home = () => {
  const [folders, setFolders] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);
    const fetchFolders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/folder`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch folders");

        const data = await response.json();
        setFolders(data);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();
  }, [API_URL]);

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
            + Create New Folder
          </button>

          {/* Folder Grid Layout */}
          <div className="w-full  flex-wrap sm:w-1/2 flex gap-6 bg-white p-6 rounded-lg shadow-md">
            {folders.length > 0 ? (
              folders.map((folder) => (
                <Link
                  key={folder._id}
                  to={`/dashboard/${folder._id}`}
                  className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-200 rounded-lg transition"
                >
                  <FaFolder className="text-yellow-500 text-6xl" />{" "}
                  {/* Bigger Folder Icon */}
                  <span className="text-center text-gray-700 font-medium">
                    {folder.name}
                  </span>
                </Link>
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
