import React, { useEffect, useState } from 'react';
import API from '../api/api.js';

const DoctorHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.get('/appointment/doctor', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        // Only show non-pending (approved/rejected/cancelled) and past appointments
        const now = new Date();
        const filtered = res.data.filter(a => a.status !== 'pending' || new Date(a.date) < now);
        setAppointments(filtered);
      } catch (err) {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Appointment History</h2>
      {loading ? (
        <p className="text-gray-600 text-lg">Loading...</p>
      ) : error ? (
        <p className="text-red-600 text-lg">{error}</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-600 text-lg">No history found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt._id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <p><strong>Patient:</strong> {appt.patient?.name || 'N/A'}</p>
                <p><strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appt.timeSlot}</p>
                <p><strong>Status:</strong> <span className={`font-semibold ${appt.status === 'approved' ? 'text-green-600' : appt.status === 'rejected' ? 'text-red-600' : appt.status === 'cancelled' ? 'text-gray-600' : ''}`}>{appt.status}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorHistory; 