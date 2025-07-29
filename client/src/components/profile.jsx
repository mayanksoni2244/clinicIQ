import React, { useEffect, useState } from 'react';
import API from '../api/api.js';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [editPhone, setEditPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Detect role from localStorage
  const role = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        let res;
        if (role === 'patient') {
          res = await API.get('/patient/profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setProfile(res.data.patient);
          setPhoneInput(res.data.patient.phone || '');
        } else if (role === 'doctor') {
          res = await API.get('/doctor/profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setProfile(res.data.doctor);
          setPhoneInput(res.data.doctor.phone || '');
        }
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [role]);

  const handlePhoneSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (role === 'patient') {
        await API.put('/patient/update', { phone: phoneInput }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else if (role === 'doctor') {
        await API.put('/doctor/update', { phone: phoneInput }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      setProfile((prev) => ({ ...prev, phone: phoneInput }));
      setEditPhone(false);
      setSuccess('Phone number updated!');
    } catch (err) {
      setError('Failed to update phone number');
    }
  };

  if (loading) return <div className="text-center py-20">Loading profile...</div>;

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white shadow-xl rounded-xl p-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">My Profile</h2>
      {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
      {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
      <form className="space-y-6" onSubmit={handlePhoneSave}>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            value={profile.name}
            disabled
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
          <div className="flex gap-2 items-center">
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              disabled={!editPhone}
              className={`w-full border border-gray-300 rounded-md px-4 py-2 ${editPhone ? '' : 'bg-gray-100 cursor-not-allowed'}`}
              placeholder="Enter phone number"
            />
            {!editPhone ? (
              <button type="button" onClick={() => setEditPhone(true)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
            ) : (
              <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Save</button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile; 