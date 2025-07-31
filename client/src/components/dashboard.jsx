import React, { useEffect, useState } from 'react';
import API from '../api/api.js';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [doctorName, setDoctorName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await API.get('/appointment/doctor', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const appointments = res.data;
        const pending = appointments.filter(a => a.status === 'pending').length;
        const approved = appointments.filter(a => a.status === 'approved').length;
        const rejected = appointments.filter(a => a.status === 'rejected').length;
        setStats({
          total: appointments.length,
          pending,
          approved,
          rejected,
        });
        if (appointments.length > 0 && appointments[0].doctor?.name) {
          setDoctorName(appointments[0].doctor.name);
        } else {
          // fallback: fetch doctor profile
          const profile = await API.get('/doctor/profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setDoctorName(profile.data.doctor?.name || 'Doctor');
        }
      } catch {
        setStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-4xl font-bold text-blue-800 mb-4">Welcome, Dr. {doctorName}</h2>
      <p className="text-lg text-gray-600 mb-8">Here is your clinic dashboard summary.</p>
      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-blue-100 rounded-xl p-6 shadow text-center">
            <h3 className="text-2xl font-bold text-blue-700">{stats.total}</h3>
            <p className="text-gray-700 mt-2">Total Appointments</p>
          </div>
          <div className="bg-yellow-100 rounded-xl p-6 shadow text-center">
            <h3 className="text-2xl font-bold text-yellow-700">{stats.pending}</h3>
            <p className="text-gray-700 mt-2">Pending</p>
          </div>
          <div className="bg-green-100 rounded-xl p-6 shadow text-center">
            <h3 className="text-2xl font-bold text-green-700">{stats.approved}</h3>
            <p className="text-gray-700 mt-2">Approved</p>
          </div>
          <div className="bg-red-100 rounded-xl p-6 shadow text-center">
            <h3 className="text-2xl font-bold text-red-700">{stats.rejected}</h3>
            <p className="text-gray-700 mt-2">Rejected</p>
          </div>
        </div>
      )}
      
      {/* Quick Actions Section */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/availability" 
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-all shadow-md"
          >
            <div className="text-lg font-semibold">Manage Availability</div>
            <div className="text-sm opacity-90">Set your working hours</div>
          </Link>
          <Link 
            to="/appointments" 
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-all shadow-md"
          >
            <div className="text-lg font-semibold">View Appointments</div>
            <div className="text-sm opacity-90">Check today's schedule</div>
          </Link>
          <Link 
            to="/history" 
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-all shadow-md"
          >
            <div className="text-lg font-semibold">Patient History</div>
            <div className="text-sm opacity-90">Review past appointments</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 