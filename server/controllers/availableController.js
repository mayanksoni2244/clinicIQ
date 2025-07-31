import { Availability } from "../models/docAvailablemodel.js";
import { Appointment } from "../models/appointmentmodel.js";

export const setAvailability = async (req, res) => {
  const doctorId = req.user._id;
  const { slots } = req.body;

  try {
    let availability = await Availability.findOne({ doctor: doctorId });

    if (availability) {
      availability.slots = slots;
    } else {
      availability = new Availability({ doctor: doctorId, slots });
    }

    await availability.save();
    res.status(200).json({ message: "Availability updated", availability });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🆕 Set weekly availability (day + intervals)
export const setWeeklyAvailability = async (req, res) => {
  const doctorId = req.user._id;
  const { weekly } = req.body; // array of { day, intervals:[{start,end}] }

  if (!Array.isArray(weekly) || weekly.length === 0) {
    return res.status(400).json({ message: "Weekly availability is required" });
  }

  try {
    let availability = await Availability.findOne({ doctor: doctorId });
    if (!availability) {
      availability = new Availability({ doctor: doctorId });
    }
    availability.weekly = weekly;
    await availability.save();
    res.status(200).json({ message: "Weekly availability saved", availability });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🆕 Get available time slots for a specific date (YYYY-MM-DD)
export const getAvailableSlotsForDate = async (req, res) => {
  const { id } = req.params; // doctor id
  const { date } = req.query; // YYYY-MM-DD

  if (!date) return res.status(400).json({ message: "date query param is required" });

  try {
    const availability = await Availability.findOne({ doctor: id });
    if (!availability || !availability.weekly || availability.weekly.length === 0) {
      return res.status(404).json({ message: "Doctor has not set weekly availability" });
    }

    const weekday = new Date(date).getDay(); // 0 Sunday .. 6 Saturday
    const dayConfig = availability.weekly.find((d) => d.day === weekday);
    if (!dayConfig) {
      return res.status(200).json({ date, timeSlots: [] }); // doctor not available this weekday
    }

    // Build 10-minute interval slots within each interval
    const generateSlots = (start, end) => {
      const [sh, sm] = start.split(":" ).map(Number);
      const [eh, em] = end.split(":" ).map(Number);
      const startMinutes = sh * 60 + sm;
      const endMinutes = eh * 60 + em;
      const slots = [];
      for (let m = startMinutes; m + 9 < endMinutes; m += 10) {
        const h = Math.floor(m / 60);
        const min = m % 60;
        slots.push(`${String(h).padStart(2,"0")}:${String(min).padStart(2,"0")}`);
      }
      return slots;
    };

    let allSlots = [];
    dayConfig.intervals.forEach(({ start, end }) => {
      allSlots = allSlots.concat(generateSlots(start, end));
    });

    // Remove already booked times
    const booked = await Appointment.find({ doctor: id, date, status: { $ne: "cancelled" } })
      .select("timeSlot");
    const bookedSet = new Set(booked.map((b) => b.timeSlot));
    const freeSlots = allSlots.filter((s) => !bookedSet.has(s));

    res.status(200).json({ date, timeSlots: freeSlots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOne({ doctor: req.params.id });
    if (!availability) {
      return res.status(404).json({ message: "No availability set" });
    }

    res.status(200).json(availability);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
