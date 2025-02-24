import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import toast, { Toaster } from "react-hot-toast"; 

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show Backdrop

    const url = isLogin
      ? `${import.meta.env.VITE_API_URL}/api/auth/login`
      : `${import.meta.env.VITE_API_URL}/api/auth/register`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      if (isLogin) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful! 🎉");
        navigate("/");
      } else {
        toast.success("Signup successful! You can now log in. ✅");
        setIsLogin(true);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Hide Backdrop
    }
  };

  return (
    <div className="flex justify-center items-center h-[650px] bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />{" "}
      {/* Toast Container */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isLogin ? "Login" : "Signup"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading} // Disable button while loading
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>
        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 underline cursor-pointer"
          >
            {isLogin ? "Signup" : "Login"}
          </button>
        </p>
      </div>
      {/* MUI Backdrop with Spinner */}
      <Backdrop
        open={loading}
        style={{
          zIndex: 1000,
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Login;
