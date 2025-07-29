import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api.js";

const DoctorSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    medicalId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        ...form,
        role: "doctor",
      });
      if (res.status === 201) {
        navigate("/Dlogin");
      }
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">Doctor Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            className="w-full border px-4 py-2 rounded"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full border px-4 py-2 rounded"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full border px-4 py-2 rounded"
            value={form.password}
            onChange={handleChange}
          />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            required
            className="w-full border px-4 py-2 rounded"
            value={form.specialization}
            onChange={handleChange}
          />
          <input
            type="text"
            name="medicalId"
            placeholder="Medical id"
            required
            className="w-full border px-4 py-2 rounded"
            value={form.medicalId}
            onChange={handleChange}
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition" disabled={loading}>
            {loading ? "Signing Up..." : "Create Doctor Account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already registered?{" "}
          <Link to="/Dlogin" className="text-green-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default DoctorSignup;
