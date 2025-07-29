import {User} from '../models/userModel.js'
import bcrypt from 'bcryptjs';

export const getPatientProfile = async (req, res) => {
  const patient = await User.findById(req.user._id).select("-password");
  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }
  res.status(200).json({ patient });
};

export const updatePatientProfile = async (req, res) => {
  const { name, password } = req.body;
  const patient = await User.findById(req.user._id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  if (name) patient.name = name;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    patient.password = await bcrypt.hash(password, salt);
  }
  await patient.save();
  res.status(200).json({ message: "Profile updated", patient: { id: patient._id, name: patient.name, email: patient.email, role: patient.role } });
};
