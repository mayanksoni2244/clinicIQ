import React, { useEffect, useState } from 'react';
import API from '../api/api.js';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/appointment/doctor', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAppointments(res.data);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await API.put(`/appointment/status/${id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchAppointments();
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Appointments</h2>
      {loading ? (
        <p className="text-gray-600 text-lg">Loading...</p>
      ) : error ? (
        <p className="text-red-600 text-lg">{error}</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-600 text-lg">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt._id} className="border border-blue-200 rounded-lg p-4 shadow-sm bg-white flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <p><strong>Patient:</strong> {appt.patient?.name || 'N/A'}</p>
                <p><strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appt.timeSlot}</p>
                <p><strong>Status:</strong> <span className={`font-semibold ${appt.status === 'pending' ? 'text-yellow-600' : appt.status === 'approved' ? 'text-green-600' : appt.status === 'rejected' ? 'text-red-600' : ''}`}>{appt.status}</span></p>
              </div>
              {appt.status === 'pending' && (
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button onClick={() => handleStatus(appt._id, 'approved')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Approve</button>
                  <button onClick={() => handleStatus(appt._id, 'rejected')} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments; 