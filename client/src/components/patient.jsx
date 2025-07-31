// Patient Home Page for a Personal Clinic

import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import { Link } from 'react-router-dom';
import API from '../api/api.js';

const PatientHome = () => {
    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoadingDoctors(true);
            try {
                const res = await API.get('/doctor/all');
                setDoctors(res.data);
            } catch {
                setDoctors([]);
            } finally {
                setLoadingDoctors(false);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-100 to-blue-50 py-20 px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-blue-800">Your Health, Our Priority</h1>
                <p className="mt-4 text-lg text-gray-700 max-w-xl mx-auto">
                    Welcome to <span className="font-semibold">ClinicIQ</span> — A modern clinic for quality care. Book appointments with ease.
                </p>
                <Link to="/book">
                    <button className="mt-6 cursor-pointer px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                        Book Appointment
                    </button>
                </Link>
            </section>

            {/* Doctors Section */}
            <section className="py-16 px-6 bg-white max-w-6xl mx-auto">
                <h2 className="text-3xl font-semibold text-blue-800 text-center mb-12">Meet Our Specialists</h2>
                {loadingDoctors ? (
                    <p className="text-center text-gray-600">Loading doctors...</p>
                ) : doctors.length === 0 ? (
                    <p className="text-center text-gray-600">No doctors available right now.</p>
                ) : (
                    <div className="grid md:grid-cols-3 gap-10">
                        {doctors.map((doc) => (
                            <div key={doc._id} className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
                                <img
                                    src={'/doctor.png'}
                                    alt={doc.name}
                                    className="w-full h-[250px] object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-2xl font-semibold text-blue-700">{doc.name}</h3>
                                <p className="text-sm text-gray-600">{doc.specialization} | {doc.yearsExperience ? `${doc.yearsExperience}+ years` : ''}</p>
                                {doc.testimonial && <p className="mt-3 text-gray-700 text-[15px]">{doc.testimonial}</p>}
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-10 text-center">
                    <ul className="inline-block text-left space-y-2 text-gray-700">
                        <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-blue-600" /> 123 Health Street, Indore, MP</li>
                        <li className="flex items-center gap-2"><FaClock className="text-blue-600" /> Mon - Sat: 9AM – 2PM, 5PM – 9PM</li>
                        <li className="flex items-center gap-2"><FaPhoneAlt className="text-blue-600" /> +91 9876543210</li>
                        <li className="flex items-center gap-2"><MdOutlineEmail className="text-blue-600" /> clinic@example.com</li>
                    </ul>
                </div>
            </section>

            {/* Appointment Booking CTA */}
            <section className="bg-blue-50 py-16 px-6 text-center">
                <h2 className="text-3xl font-semibold text-blue-700">Book Your Appointment Now</h2>
                <p className="mt-2 text-gray-600">Easy booking. Trusted care. Instant confirmation.</p>
                <Link to="/book">
                    <button className="mt-6 px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                        Book Now
                    </button>
                </Link>
                
                {/* About Us Section */}

            </section>
                <main className="bg-white py-20 px-6 max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-blue-800 mb-6">About ClinicIQ</h2>
                    <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
                        At <span className="font-semibold text-blue-700">ClinicIQ</span>, we believe healthcare should be
                        <span className="font-medium"> simple, compassionate, and accessible</span>.
                        We are a modern personal clinic that combines experienced doctors, state-of-the-art facilities, and a patient-first approach.
                    </p>

                    <div className="mt-12 grid md:grid-cols-3 gap-10 text-left">
                        <div className="bg-blue-50 p-6 rounded-xl shadow">
                            <h3 className="text-xl font-semibold text-blue-700 mb-2">🔬 Expert Care</h3>
                            <p className="text-gray-600 text-sm">
                                Our team includes seasoned specialists across general medicine, orthopedics, and dental care — ensuring every patient gets focused, quality treatment.
                            </p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-xl shadow">
                            <h3 className="text-xl font-semibold text-blue-700 mb-2">💡 Smart Appointments</h3>
                            <p className="text-gray-600 text-sm">
                                With our intuitive booking system, say goodbye to long queues. Book online, reschedule, or cancel with ease. Your time matters to us.
                            </p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-xl shadow">
                            <h3 className="text-xl font-semibold text-blue-700 mb-2">❤️ Patient-First Philosophy</h3>
                            <p className="text-gray-600 text-sm">
                                We listen, we care, we treat. Every patient is treated with empathy, privacy, and utmost respect. Because healing begins with trust.
                            </p>
                        </div>
                    </div>

                    <p className="mt-12 text-gray-600 text-sm max-w-2xl mx-auto">
                        Whether you're here for a regular check-up or specialized care, ClinicIQ ensures a smooth, stress-free healthcare experience for you and your family.
                    </p>
                </main>

            {/* Contact Footer */}
            <footer className="bg-blue-900 text-white py-8 px-6 text-center">
                <p>© 2025 ClinicIQ. All rights reserved.</p>
                <p className="text-sm mt-1">123 Health Street, Indore, MP · +91 9876543210</p>
            </footer>
        </div>
    );
};

export default PatientHome;
