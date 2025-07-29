import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const AppointmentSuccess = () => {
  const { state } = useLocation();
  const { name, doctor, date, time } = state || {};

  const token = Math.floor(1000 + Math.random() * 9000); // Random 4-digit token

  useEffect(() => {
  if (state) {
    const existing = JSON.parse(localStorage.getItem('appointments')) || [];

    const isDuplicate = existing.some(
      (appt) =>
        appt.name === name &&
        appt.doctor === doctor &&
        appt.date === date &&
        appt.time === time
    );

    if (!isDuplicate) {
      const newAppointment = {
        name,
        doctor,
        date,
        time,
        token,
        status: 'Confirmed',
      };

      localStorage.setItem('appointments', JSON.stringify([...existing, newAppointment]));
    }
  }
}, []);


  return (
    <div className="max-w-xl mx-auto p-8 mt-12 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-green-700 text-center mb-6">✅ Appointment Confirmed</h2>

      <div className="space-y-4 text-gray-800 text-lg">
        <p><strong>Patient Name:</strong> {name}</p>
        <p><strong>Doctor:</strong> {doctor}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>Token No:</strong> {token}</p>
        <p><strong>Status:</strong> Confirmed</p>
      </div>

      <div className="text-center mt-8">
        <Link
          to="/home"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default AppointmentSuccess;
