// models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["patient", "doctor"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: function() { return this.role === 'doctor'; },
  },
  medicalId: {
    type: String,
    required: function() { return this.role === 'doctor'; },
  },
  yearsExperience: {
    type: Number,
    required: function() { return this.role === 'doctor'; },
  },
  testimonial: {
    type: String,
    required: false,
    trim: true,
  },
});

export const User = mongoose.model("User", userSchema);
