// models/appointmentModel.js
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String, // e.g., "10:30 AM - 11:00 AM"
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    tokenNumber: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
