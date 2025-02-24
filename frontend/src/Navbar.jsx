import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      navigate("/Auth");
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Folders</h1>
        <div className="space-x-4 font-bold">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="hover:text-black">
              Logout
            </button>
          ) : (
            <Link to="/Auth" className="hover:text-black">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
