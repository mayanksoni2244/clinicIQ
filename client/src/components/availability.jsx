import React, { useState, useEffect } from 'react';
import API from "../api/api.js";

const DoctorAvailability = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    // Predefined time slots
    const allTimeSlots = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
        "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"
    ];

    // Fetch existing availability for the doctor
    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            const response = await API.get(`/availability/${localStorage.getItem('userId')}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setAvailableSlots(response.data.slots || []);
        } catch (err) {
            console.log("No availability set yet");
            setAvailableSlots([]);
        }
    };

    const handleTimeSlotToggle = (slot) => {
        if (timeSlots.includes(slot)) {
            setTimeSlots(timeSlots.filter(s => s !== slot));
        } else {
            setTimeSlots([...timeSlots, slot]);
        }
    };

    const handleSaveAvailability = async () => {
        if (!selectedDate || timeSlots.length === 0) {
            alert("Please select a date and at least one time slot");
            return;
        }

        setLoading(true);
        try {
            // Check if date already exists in available slots
            const existingSlotIndex = availableSlots.findIndex(slot => slot.date === selectedDate);
            let updatedSlots = [...availableSlots];

            if (existingSlotIndex !== -1) {
                // Update existing date
                updatedSlots[existingSlotIndex].timeSlots = timeSlots;
            } else {
                // Add new date
                updatedSlots.push({ date: selectedDate, timeSlots });
            }

            await API.post('/availability/set', { slots: updatedSlots }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            setAvailableSlots(updatedSlots);
            setSelectedDate('');
            setTimeSlots([]);
            alert("Availability updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update availability");
        }
        setLoading(false);
    };

    const removeDate = (dateToRemove) => {
        const updatedSlots = availableSlots.filter(slot => slot.date !== dateToRemove);
        setAvailableSlots(updatedSlots);
        
        API.post('/availability/set', { slots: updatedSlots }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }).catch(err => console.error(err));
    };

    // Load existing slots when date is selected
    useEffect(() => {
        if (selectedDate) {
            const existingSlot = availableSlots.find(slot => slot.date === selectedDate);
            setTimeSlots(existingSlot ? existingSlot.timeSlots : []);
        }
    }, [selectedDate, availableSlots]);

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-green-700 text-center mb-8">Manage Your Availability</h1>
            
            {/* Set Availability Section */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Set Available Time Slots</h2>
                
                {/* Date Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]}
                        className="border border-gray-300 rounded-md px-4 py-2"
                    />
                </div>

                {/* Time Slots Selection */}
                {selectedDate && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select Available Time Slots for {selectedDate}
                        </label>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {allTimeSlots.map((slot) => (
                                <button
                                    key={slot}
                                    type="button"
                                    onClick={() => handleTimeSlotToggle(slot)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                                        timeSlots.includes(slot)
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <button
                    onClick={handleSaveAvailability}
                    disabled={loading || !selectedDate || timeSlots.length === 0}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-semibold"
                >
                    {loading ? 'Saving...' : 'Save Availability'}
                </button>
            </div>

            {/* Current Availability Display */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">Your Current Availability</h2>
                {availableSlots.length === 0 ? (
                    <p className="text-gray-500">No availability set yet.</p>
                ) : (
                    <div className="space-y-4">
                        {availableSlots.map((slot, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-lg">{slot.date}</h3>
                                    <button
                                        onClick={() => removeDate(slot.date)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Remove Date
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {slot.timeSlots.map((time, timeIndex) => (
                                        <span
                                            key={timeIndex}
                                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {time}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorAvailability;