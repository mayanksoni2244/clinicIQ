// routes/appointmentRoutes.js
import express from "express";
import {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentcont.js";
import { protect, isDoctor, isPatient } from "../middleware/authmiddleware.js";
import { cancelAppointment, rescheduleAppointment } from "../controllers/appointmentcont.js";

const router = express.Router();

// 🔒 Patient Routes
router.post("/book", protect, isPatient, bookAppointment);
router.get("/patient", protect, isPatient, getPatientAppointments);
router.put("/cancel/:id", protect, isPatient, cancelAppointment);
router.put("/reschedule/:id", protect, isPatient, rescheduleAppointment);


// 🔒 Doctor Routes
router.get("/doctor", protect, isDoctor, getDoctorAppointments);
// Doctor updates appointment status
router.put("/status/:id", protect, isDoctor, updateAppointmentStatus);

export default router;
