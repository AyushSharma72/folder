import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">MyApp</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-400">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-gray-400">
            Dashboard
          </Link>
          <Link to="/Auth" className="hover:text-gray-400">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
