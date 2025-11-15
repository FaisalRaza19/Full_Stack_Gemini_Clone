import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ContextApi } from "../../Context/context";
import { MdOutlineEmail, MdLock } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = ({ setIsLoggedIn }) => {
  const { loginUser } = useContext(ContextApi);
  const [credentials, setCredentials] = useState({
    identifier: "", // email or username
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    const { identifier, password } = credentials;
    if (!identifier.trim()) {
      toast.error("Email or username is required!");
      return false;
    }
    if (!password.trim()) {
      toast.error("Password is required!");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    try {
      const response = await loginUser({ e, setIsLoggedIn, credentials,navigate});

      // Show toast based on response.statusCode
      if (response.statusCode === 400 || response.statusCode === 401) {
        toast.error(response.message || "Invalid credentials.");
      } else {
        toast.error(response.message || "Login failed. Try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10">
        {/* Back Link */}
        <Link
          to="/signup"
          className="flex items-center text-gray-900 text-sm sm:text-base font-medium mb-6 hover:text-blue-500 transition"
        >
          <FaArrowLeft className="mr-2 mt-1" /> Back
        </Link>

        {/* Header */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-2 text-gray-900">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
          Sign in to your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email or Username */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Email or Username
            </label>
            <div className="relative">
              <MdOutlineEmail className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="text"
                name="identifier"
                placeholder="you@example.com or username"
                value={credentials.identifier}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <MdLock className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm sm:text-base text-gray-600">
            <label className="flex items-center gap-2 mb-2 sm:mb-0">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
              />
              <span className="m-2">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-3 py-2 sm:py-3 font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition text-sm sm:text-base"
          >
            Login
          </button>
        </form>

        {/* Signup */}
        <p className="text-center text-gray-600 text-sm sm:text-base mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
