import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api.js";
import { useRole } from "../context/Rolecontext";

const DoctorLogin = () => {
  const navigate = useNavigate();
  const { setRole } = useRole();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      if (res.status === 200 && res.data.user.role === "doctor") {
        setRole("doctor");
        localStorage.setItem("token", res.data.user.token);
        localStorage.setItem("userRole", "doctor");
        localStorage.setItem("userId", res.data.user.id);

        // Check availability
        try {
          await API.get(`/availability/${res.data.user.id}`, {
            headers: { Authorization: `Bearer ${res.data.user.token}` }
          });
          // If availability exists, go to dashboard
          navigate("/dashboard");
        } catch (errAvail) {
          // If no availability set (404), redirect to availability setup
          navigate("/availability");
        }
      } else {
        setError("Not a doctor account.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">Doctor Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/Dsignup" className="text-green-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default DoctorLogin;
