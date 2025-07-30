import React, { useState, useEffect } from 'react';
import API from '../api/api.js';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.get('/appointment/patient', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAppointments(res.data);
      } catch (err) {
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      await API.put(`/appointment/cancel/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Refresh appointments
      const res = await API.get('/appointment/patient', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAppointments(res.data);
    } catch {
      alert('Failed to cancel appointment');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">My Appointments</h2>
      {loading ? (
        <p className="text-gray-600 text-lg">Loading...</p>
      ) : error ? (
        <p className="text-red-600 text-lg">{error}</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-600 text-lg">No appointments booked yet.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt, index) => (
            <div
              key={index}
              className="border border-blue-200 rounded-lg p-4 shadow-sm bg-white"
            >
              <p><strong>Doctor:</strong> {appt.doctor?.name || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {appt.timeSlot}</p>
              <p><strong>Status:</strong> {appt.status || 'pending'}</p>
              {appt.status === 'pending' && (
                <button
                  onClick={() => handleCancel(appt._id)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
