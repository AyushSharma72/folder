import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [folders, setFolders] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL; 
  // Fetch Folders
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/folder`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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

      <button
        onClick={createFolder}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        + Create New Folder
      </button>

      <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {folders.length > 0 ? (
            folders.map((folder) => (
              <li key={folder._id} className="p-3 hover:bg-gray-100 transition">
                📁<Link
                  to={`/dashboard/${folder._id}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {folder.name}
                </Link>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-center p-3">No folders found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;
