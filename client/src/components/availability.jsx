import React, { useState, useEffect } from 'react';
import API from "../api/api.js";

// Helper to return weekday name
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const WeeklyAvailability = () => {
  // state format: { 0:{enabled:false,start:"09:00",end:"17:00"}, ... }
  const defaultDay = { enabled: false, start: "09:00", end: "17:00" };
  const [days, setDays] = useState(Array.from({ length: 7 }, () => ({ ...defaultDay })));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load existing weekly availability
    const fetch = async () => {
      try {
        const res = await API.get(`/availability/weekly/${localStorage.getItem('userId')}`);
        if (res.data.weekly) {
          const newDays = Array.from({ length: 7 }, () => ({ ...defaultDay }));
          res.data.weekly.forEach((w) => {
            newDays[w.day] = {
              enabled: true,
              start: w.intervals[0]?.start || "09:00",
              end: w.intervals[0]?.end || "17:00"
            };
          });
          setDays(newDays);
        }
      } catch { /* ignore */ }
    };
    fetch();
  }, []);

  const toggleDay = (idx) => {
    setDays((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], enabled: !copy[idx].enabled };
      return copy;
    });
  };

  const handleTimeChange = (idx, field, value) => {
    setDays((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleSave = async () => {
    const weekly = days
      .map((d, idx) => (d.enabled ? { day: idx, intervals: [{ start: d.start, end: d.end }] } : null))
      .filter(Boolean);
    if (weekly.length === 0) {
      alert("Please enable at least one day");
      return;
    }
    setLoading(true);
    try {
      await API.post('/availability/set-weekly', { weekly }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Weekly availability saved');
    } catch (err) {
      alert('Failed to save availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">Set Weekly Availability</h1>
      <div className="space-y-4">
        {days.map((d, idx) => (
          <div key={idx} className="flex items-center gap-4 bg-white shadow p-4 rounded">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={d.enabled} onChange={() => toggleDay(idx)} />
              <span className="font-semibold w-12">{dayNames[idx]}</span>
            </label>
            <input
              type="time"
              value={d.start}
              disabled={!d.enabled}
              onChange={(e) => handleTimeChange(idx, 'start', e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <span>to</span>
            <input
              type="time"
              value={d.end}
              disabled={!d.enabled}
              onChange={(e) => handleTimeChange(idx, 'end', e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
      >
        {loading ? 'Saving...' : 'Save Weekly Availability'}
      </button>
    </div>
  );
};

export default WeeklyAvailability;