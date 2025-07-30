// controllers/appointmentController.js
import { Appointment } from "../models/appointmentmodel.js";
import { Availability } from "../models/docAvailablemodel.js";

// ⏳ Book an appointment (with conflict check)
export const bookAppointment = async (req, res) => {
  const { doctorId, date, timeSlot } = req.body;

  try {
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

    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
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
