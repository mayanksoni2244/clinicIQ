// src/components/Auth/PatientLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/Rolecontext"; // adjust path if needed
import { Link } from "react-router-dom";
import API from "../../api/api.js";

const PatientLogin = () => {
    const navigate = useNavigate();
    const { setRole } = useRole();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await API.post("/auth/login", {
                email: form.email,
                password: form.password,
            });

            if (res.status === 200 && res.data.user.role === "patient") {
                setRole("patient");
                localStorage.setItem("token", res.data.user.token);
                localStorage.setItem("userRole", "patient");
                navigate("/home");
            } else {
                setError("Not a patient account.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="bg-white shadow-xl p-10 rounded-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Patient Login</h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
                    >
                        Log In
                    </button>
                    {error && <p className="text-red-600 text-center mt-2">{error}</p>}
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <Link to='/patientSignup'>
                        <span
                            className="text-blue-600 hover:underline cursor-pointer"
                        >
                            Sign Up
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default PatientLogin;
