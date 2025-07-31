import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../api/api.js";

const BookAppointment = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        doctor: '',
        name: '',
        phone: '',
        date: '',
        time: '',
        symptoms: '',
    });
    const [doctors, setDoctors] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    useEffect(() => {
        // Fetch doctors from backend
        API.get('/doctor/all').then(res => setDoctors(res.data)).catch(() => setDoctors([]));
    }, []);

    useEffect(() => {
        const loadSlots = async () => {
            if (formData.doctor && formData.date) {
                try {
                    const res = await API.get(`/availability/slots/${formData.doctor}`, {
                        params: { date: formData.date }
                    });
                    setAvailableTimes(res.data.timeSlots || []);
                    setFormData(prev => ({ ...prev, time: '' }));
                } catch {
                    setAvailableTimes([]);
                }
            } else {
                setAvailableTimes([]);
            }
        };
        loadSlots();
    }, [formData.doctor, formData.date]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/appointment/book", {
                doctorId: formData.doctor,
                date: formData.date,
                timeSlot: formData.time,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            if (res.status === 201) {
                navigate("/myapp");
            }
        } catch (err) {
            console.error(err);
            alert("Booking failed");
        }
    };


    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-blue-700 text-center mb-8">Book Appointment</h1>
            <form onSubmit={handleBooking} className="bg-white p-6 rounded-xl shadow-md space-y-5">
                {/* Doctor Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
                    <select
                        name="doctor"
                        required
                        value={formData.doctor}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                    >
                        <option value="">-- Select Doctor --</option>
                        {doctors.map((doc) => (
                            <option key={doc._id} value={doc._id}>{doc.name} {doc.specialization ? `— ${doc.specialization}` : ''}</option>
                        ))}
                    </select>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        placeholder="Your Name"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        placeholder="e.g., 9876543210"
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                    <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        min={new Date().toISOString().split("T")[0]}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                            .toISOString()
                            .split("T")[0]}
                    />

                </div>

                {/* Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Time Slots</label>
                    {formData.date && formData.doctor ? (
                        availableTimes.length > 0 ? (
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                {availableTimes.map((slot) => (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, time: slot })}
                                        className={`px-3 py-1 rounded text-sm border transition-all ${formData.time === slot ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-red-500 text-sm">No available slots for selected date</p>
                        )
                    ) : (
                        <p className="text-gray-500 text-sm italic">Select doctor and date first</p>
                    )}
                    {formData.time && (
                        <p className="text-green-600 text-sm mt-2">✓ Selected: {formData.time}</p>
                    )}
                </div>

                {/* Symptoms */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms / Reason <span className='text-gray-400'>[optional]</span></label>
                    <textarea
                        name="symptoms"
                        rows="3"
                        value={formData.symptoms}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                        placeholder="Brief description of your issue..."
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-lg font-semibold"
                >
                    Book Appointment
                </button>
            </form>
        </div>
    );
};

export default BookAppointment;
