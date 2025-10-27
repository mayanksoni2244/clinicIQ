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
      timeSlots: [{ type: String }], // legacy date-specific slots
    },
  ],
  // New weekly availability: array with weekday (0-6) and one or more intervals per day
  weekly: [
    {
      day: { type: Number, min: 0, max: 6, required: true }, // 0 = Sunday (JS date convention)
      intervals: [
        {
          start: { type: String, required: true }, // '09:00'
          end: { type: String, required: true }, // '17:00'
        },
      ],
    },
  ],
});

export const Availability = mongoose.model("Availability", availabilitySchema);
