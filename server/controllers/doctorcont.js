import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = req.user; // already attached in middleware
    res.status(200).json({ doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateDoctorProfile = async (req, res) => {
  const { name, password } = req.body;
  const doctor = await User.findById(req.user._id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  if (name) doctor.name = name;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(password, salt);
  }
  await doctor.save();
  res.status(200).json({ message: "Profile updated", doctor: { id: doctor._id, name: doctor.name, email: doctor.email, role: doctor.role } });
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('_id name specialization testimonial experienceYears degree');
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
