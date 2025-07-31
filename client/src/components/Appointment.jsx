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
    const [availableSlots, setAvailableSlots] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        // Fetch doctors from backend
        API.get('/doctor/all').then(res => setDoctors(res.data)).catch(() => setDoctors([]));
    }, []);

    // Fetch doctor availability when doctor is selected
    useEffect(() => {
        if (formData.doctor) {
            fetchDoctorAvailability();
        } else {
            setAvailableSlots([]);
            setAvailableTimes([]);
        }
    }, [formData.doctor]);

    // Update available times when date changes
    useEffect(() => {
        if (formData.date && availableSlots.length > 0) {
            const selectedDateSlot = availableSlots.find(slot => slot.date === formData.date);
            setAvailableTimes(selectedDateSlot ? selectedDateSlot.timeSlots : []);
            // Reset time selection when date changes
            setFormData(prev => ({ ...prev, time: '' }));
        } else {
            setAvailableTimes([]);
        }
    }, [formData.date, availableSlots]);

    const fetchDoctorAvailability = async () => {
        setLoadingSlots(true);
        try {
            const response = await API.get(`/availability/${formData.doctor}`);
            setAvailableSlots(response.data.slots || []);
        } catch (err) {
            console.log("No availability set for this doctor");
            setAvailableSlots([]);
        }
        setLoadingSlots(false);
    };

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
                    {formData.doctor ? (
                        <select
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                            disabled={loadingSlots}
                        >
                            <option value="">-- Select Available Date --</option>
                            {availableSlots.map((slot, index) => (
                                <option key={index} value={slot.date}>
                                    {new Date(slot.date).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-gray-500 text-sm italic">Please select a doctor first</p>
                    )}
                    {loadingSlots && <p className="text-blue-500 text-sm mt-1">Loading available dates...</p>}
                    {formData.doctor && !loadingSlots && availableSlots.length === 0 && (
                        <p className="text-red-500 text-sm mt-1">No availability set by this doctor</p>
                    )}
                </div>

                {/* Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Time Slots</label>
                    {formData.date ? (
                        availableTimes.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {availableTimes.map((timeSlot, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, time: timeSlot })}
                                        className={`px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                                            formData.time === timeSlot
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                                        }`}
                                    >
                                        {timeSlot}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-red-500 text-sm">No time slots available for selected date</p>
                        )
                    ) : (
                        <p className="text-gray-500 text-sm italic">Please select a date first</p>
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
