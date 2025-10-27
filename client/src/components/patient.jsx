import React, { useEffect } from "react";
import { FaUserMd, FaUserAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useRole } from "../context/Rolecontext";
import { motion } from "framer-motion";

const HomePage = () => {
    const { setRole } = useRole();
    const navigate = useNavigate();

    useEffect(() => {
        setRole(null);
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
        if (token && role === "patient") navigate("/home");
        if (token && role === "doctor") navigate("/dashboard");
    }, [setRole, navigate]);

    const fadeIn = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <div className="w-full bg-gradient-to-b from-white to-blue-50 min-h-screen font-sans text-gray-800">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center py-20 px-6 md:px-12">
                <motion.h1
                    variants={fadeIn}
                    initial="hidden"
                    animate="show"
                    className="text-4xl md:text-6xl font-bold mb-4"
                >
                    Welcome to <span className="text-blue-600">ClinicIQ</span>
                </motion.h1>
                <motion.p
                    variants={fadeIn}
                    initial="hidden"
                    animate="show"
                    className="text-lg md:text-xl max-w-xl mb-10 text-gray-600"
                >
                    Streamlining clinic visits — Book appointments, meet doctors, and skip the chaos.
                </motion.p>
                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="show"
                    className="flex gap-4 flex-wrap justify-center"
                >
                    <Link to='/patientSignup'>
                        <button onClick={() => setRole("patient")} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-transform duration-300 hover:scale-105 text-base md:text-lg">
                            <FaUserAlt /> I’m a Patient
                        </button>
                    </Link>
                    <Link to='/Dlogin'>
                        <button onClick={() => setRole("doctor")} className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition-transform duration-300 hover:scale-105 text-base md:text-lg">
                            <FaUserMd /> I’m a Doctor
                        </button>
                    </Link>
                </motion.div>
            </section>

            {/* Why ClinicIQ Section */}
            <section className="py-16 px-6 text-center bg-white">
                <motion.h2
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-4"
                >
                    Why <span className="text-blue-600">ClinicIQ?</span>
                </motion.h2>
                <motion.p
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto"
                >
                    ClinicIQ is built specifically for individual clinics — helping doctors manage appointments better and making the entire experience seamless for patients. No complex systems. No long queues. Just smarter care.
                </motion.p>
            </section>

            {/* Features Grid */}
            <section className="py-14 px-6 grid md:grid-cols-2 gap-10 bg-blue-50">
                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-shadow"
                >
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">For Patients</h3>
                    <ul className="text-gray-700 space-y-2 text-sm md:text-base">
                        <li>✓ Instantly book available slots</li>
                        <li>✓ Track your upcoming appointments</li>
                        <li>✓ Reschedule or cancel easily</li>
                        <li>✓ No more long waiting hours</li>
                    </ul>
                </motion.div>

                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-shadow"
                >
                    <h3 className="text-2xl font-bold text-green-600 mb-4">For Doctors</h3>
                    <ul className="text-gray-700 space-y-2 text-sm md:text-base">
                        <li>✓ Real-time appointment dashboard</li>
                        <li>✓ Manage multiple patient schedules</li>
                        <li>✓ Get appointment insights and history</li>
                        <li>✓ Focus more on care, less on admin</li>
                    </ul>
                </motion.div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-white">
                <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">What Our Doctors Say</h2>
                <motion.div
                    className="flex space-x-6 overflow-x-auto px-4 no-scrollbar"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    {[...Array(5)].map((_, idx) => (
                        <div key={idx} className="min-w-[260px] bg-blue-100 text-blue-900 p-6 rounded-xl shadow-md">
                            <p className="text-sm">
                                “ClinicIQ has simplified how I manage appointments. It feels like I finally have time to breathe between patients.”
                            </p>
                            <p className="mt-4 font-semibold text-sm">— Dr. Anjali Sharma</p>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* Contact Us Section */}
            <section className="bg-blue-600 text-white text-center py-10 px-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Contact Us</h2>
                <p className="text-sm md:text-base mb-2">WhatsApp: <a href="https://wa.me/917014394094" className="underline">+91 7014394094</a></p>
                <p className="text-sm md:text-base mb-2">Instagram: <a href="https://instagram.com/cliniq_official" className="underline">@cliniq_official</a></p>
                <p className="text-sm md:text-base">Email: <a href="mailto:support@cliniq.in" className="underline">support@cliniq.in</a></p>
            </section>

            {/* Footer */}
            <footer className="py-6 bg-gray-900 text-white text-center text-sm">
                © 2025 ClinicIQ. All rights reserved.
            </footer>
        </div>
    );
};

export default HomePage;