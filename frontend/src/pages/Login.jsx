import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import Input from "../components/common/Input";
import Button from "../components/common/Button";

import { loginUser } from "../api/auth.api";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  

  // Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.email || !formData.password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const data = await loginUser(formData);

      // Save User Data
      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );
      localStorage.setItem("token", data.token);

      toast.success("Login Successful");

      // Redirect
      navigate("/projects");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Invalid Credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        {/* Logo / Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Login to continue
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Password */}
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          {/* Button */}
          <Button
            text={
              loading
                ? "Logging In..."
                : "Login"
            }
          />
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?

          <Link
            to="/register"
            className="ml-1 text-black font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;