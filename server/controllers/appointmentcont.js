// controllers/appointmentController.js
import { Appointment } from "../models/appointmentmodel.js";
// import { Availability } from "../models/docAvailablemodel.js";
import { User } from "../models/userModel.js";

// ⏳ Book an appointment (with conflict check)
export const bookAppointment = async (req, res) => {
  const { doctorId, date, timeSlot } = req.body;

  try {
    // 🔍 Verify doctor's time range
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const parseTime = (t) => {
      if (!t) return 0;
      if (t.includes('AM') || t.includes('PM')) {
        const [hms, period] = t.split(' ');
        let [h, m] = hms.split(':').map(Number);
        if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
        if (period.toUpperCase() === 'AM' && h === 12) h = 0;
        return h * 60 + m;
      } else {
        // assume 24h 'HH:MM'
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      }
    };

    const requestedStart = parseTime(timeSlot.split(' - ')[0]);
    const docStart = parseTime(doctor.availableStart);
    const docEnd = parseTime(doctor.availableEnd);

    if (requestedStart < docStart || requestedStart >= docEnd) {
      return res.status(400).json({ message: 'Selected time is outside doctor availability' });
    }

    // 🛑 Check if the doctor already has an appointment at that slot
    const alreadyBooked = await Appointment.findOne({
      doctor: doctorId,
      date,
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (alreadyBooked) {
      return res.status(400).json({
        message: "This time slot is already booked for the selected doctor",
      });
    }

    // Generate token number per doctor starting from 1000
    const lastAppt = await Appointment.find({ doctor: doctorId })
      .sort({ tokenNumber: -1 })
      .limit(1);
    const nextToken = lastAppt.length > 0 ? (lastAppt[0].tokenNumber || 999) + 1 : 1000;

    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      tokenNumber: nextToken,
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Get all appointments for a patient
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name email")
      .sort({ date: 1 });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Get all appointments for a doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate("patient", "name email")
      .sort({ date: 1 });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Cancel appointment
export const cancelAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to cancel this appointment" });
    }

    // Disallow cancellation if appointment has been approved or rejected
    if (appointment.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending appointments can be cancelled" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔁 Reschedule appointment
export const rescheduleAppointment = async (req, res) => {
  const { id } = req.params;
  const { newDate, newTimeSlot } = req.body;

  try {
    const appointment = await Appointment.findById(id);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to reschedule this appointment" });
    }

    if (appointment.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Cannot reschedule a cancelled appointment" });
    }

    // Conflict check
    const conflict = await Appointment.findOne({
      doctor: appointment.doctor,
      date: newDate,
      timeSlot: newTimeSlot,
      status: { $ne: "cancelled" },
    });

    if (conflict) {
      return res.status(400).json({
        message: "This time slot is already booked for the doctor",
      });
    }

    appointment.date = newDate;
    appointment.timeSlot = newTimeSlot;
    appointment.status = "pending"; // optional: reset to pending if logic needs approval again

    await appointment.save();

    res.status(200).json({ message: "Appointment rescheduled", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Doctor updates appointment status
export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    // Only doctor can update their own appointment
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    appointment.status = status;
    await appointment.save();
    res.status(200).json({ message: 'Status updated', appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
