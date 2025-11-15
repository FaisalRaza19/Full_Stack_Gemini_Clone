import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ContextApi } from "../../Context/context";
import { MdOutlineEmail, MdLock } from "react-icons/md";
import { FaArrowLeft, FaEye, FaEyeSlash, FaUserAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const SignUpPage = ({ setIsLoggedIn }) => {
    const { registerUser } = useContext(ContextApi);
    const [credentials, setCredentials] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateInputs = () => {
        const { fullName, email, password } = credentials;
        const specialChars = /[!@#$%^&_*(),.?":{}|<>]/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!fullName || !email || !password) {
            toast.error("All fields are required!");
            return false;
        }

        if (fullName.length < 3) {
            toast.error("Full name must be at least 3 characters.");
            return false;
        }

        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.");
            return false;
        }

        if (password.length < 8 || !specialChars.test(password)) {
            toast.error("Password must be at least 8 characters and contain a special character.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        setIsLoading(true);
        try {
            const data = await registerUser({ setIsLoggedIn, credentials,navigate});
            console.log(data)

            // Show success or error using toast
            if (data.statusCode !== 200){
                toast.error(data?.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Sign up failed:", error);
            toast.error(error.message || "Sign up failed. Please try again.");
        } finally {
            setIsLoading(false);
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
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-900 text-sm sm:text-base mb-6 hover:text-blue-500 transition"
                >
                    <FaArrowLeft className="mr-2" /> Back
                </button>

                {/* Header */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-2 text-gray-900">
                    Create Account
                </h1>
                <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
                    Join the Gemini community
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <FaUserAlt className="absolute left-3 top-3.5 text-gray-400 text-sm sm:text-lg" />
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Your full name"
                                value={credentials.fullName}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <MdOutlineEmail className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={credentials.email}
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
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm sm:text-base"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-gray-400 text-lg focus:outline-none"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 sm:py-3 font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-70 text-sm sm:text-base"
                    >
                        {isLoading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                {/* Login Link */}
                <p className="text-center text-gray-600 text-sm sm:text-base mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
