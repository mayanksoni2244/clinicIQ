// PatientSignup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/Rolecontext.jsx";
import { Link } from "react-router-dom";
import API from "../../api/api.js";

const PatientSignup = () => {
    const navigate = useNavigate();
    const { setRole } = useRole();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async(e) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/register", {
                ...form,
                role: "patient"
            });

            if (res.status === 201) {
                setRole("patient");
                navigate("/patientLogin");
            }
        } catch (err) {
            console.error("Signup error:", err.response?.data?.message || err.message);
            alert("Signup failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="bg-white shadow-xl p-10 rounded-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Patient Signup</h2>

                <form onSubmit={handleSignup} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />

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
                        Sign Up
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to='/patientLogin'>
                        <span
                            className="text-blue-600 hover:underline cursor-pointer"
                        >
                            Log In
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default PatientSignup;
