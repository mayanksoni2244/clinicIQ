import React from "react";
import { FaUserMd, FaUserAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useRole } from "../context/Rolecontext";
import { useEffect } from "react";

const HomePage = () => {
    const { setRole } = useRole();
    const navigate = useNavigate();
    useEffect(() => {
        setRole(null);
        // Redirect if logged in
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
        if (token && role === "patient") {
            navigate("/home");
        } else if (token && role === "doctor") {
            navigate("/dashboard");
        }
    }, [setRole, navigate]);

    return (
        <div className="w-full bg-gradient-to-b from-white to-blue-50 min-h-screen font-sans text-gray-800">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center py-24 px-6">
                <h1 className="text-5xl sm:text-6xl font-bold mb-6">
                    Welcome to <span className="text-blue-600">ClinicIQ</span>
                </h1>
                <p className="text-lg sm:text-xl max-w-2xl mb-10 text-gray-600">
                    Streamlining clinic visits — Book appointments, meet doctors, and skip the chaos.
                </p>
                <div className="flex gap-6 flex-wrap justify-center">
                    <Link to='/patientSignup'>
                        <button onClick={() => setRole("patient")} className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 text-lg">
                            <FaUserAlt /> I’m a Patient
                        </button>
                    </Link>
                    <Link to='/Dlogin'>
                        <button onClick={() => setRole("doctor")} className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 text-lg">
                            <FaUserMd /> I’m a Doctor
                        </button>
                    </Link>
                </div>
            </section>

            {/* Why Healthcare Section */}
            <section className="py-20 px-8 bg-white text-center">
                <h2 className="text-4xl font-bold mb-4">
                    Why <span className="text-blue-600">ClinicIQ?</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    In today’s fast-paced world, health shouldn’t be chaotic. ClinicIQ is built specifically for individual clinics — helping doctors manage appointments better and making the entire experience seamless for patients. No complex systems. No long queues. Just smarter care.
                </p>
            </section>

            {/* Features for Patients and Doctors */}
            <section className="py-16 px-10 bg-blue-50 grid md:grid-cols-2 gap-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all">
                    <h3 className="text-2xl font-bold mb-4 text-blue-600">For Patients</h3>
                    <p className="text-gray-600 text-md">
                        - Instantly book available slots <br />
                        - Track your upcoming appointments <br />
                        - Reschedule or cancel easily <br />
                        - No more long waiting hours
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all">
                    <h3 className="text-2xl font-bold mb-4 text-green-600">For Doctors</h3>
                    <p className="text-gray-600 text-md">
                        - Real-time appointment dashboard <br />
                        - Manage multiple patient schedules <br />
                        - Get appointment insights and history <br />
                        - Focus more on care, less on admin
                    </p>
                </div>
            </section>

            {/* Doctor Testimonials Carousel */}
            <section className="py-16 bg-white overflow-x-hidden">
                <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">
                    What Our Doctors Say
                </h2>
                <div className="flex space-x-6 animate-scroll px-4">
                    {[...Array(6)].map((_, idx) => (
                        <div
                            key={idx}
                            className="min-w-[300px] bg-blue-100 text-blue-900 p-6 rounded-xl shadow-lg"
                        >
                            <p className="text-md">
                                “ClinicIQ has simplified how I manage appointments. It feels like I finally have time to breathe between patients.”
                            </p>
                            <p className="mt-4 font-semibold">— Dr. Anjali Sharma</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-6 bg-blue-600 text-white text-center">
                <p className="text-sm">© 2025 ClinicIQ. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;
