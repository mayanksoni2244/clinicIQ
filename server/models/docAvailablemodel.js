// models/availabilityModel.js
import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // Each doctor has one availability record
  },
  slots: [
    {
      date: { type: String, required: true }, // 'YYYY-MM-DD'
      timeSlots: [{ type: String }], // ['10:00 AM', '11:00 AM', ...]
    },
  ],
});

export const Availability = mongoose.model("Availability", availabilitySchema);
