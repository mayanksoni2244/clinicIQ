import express from "express";
import { getDoctorProfile, updateDoctorProfile, getAllDoctors } from "../controllers/doctorcont.js";
import { protect, isDoctor } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/profile", protect, isDoctor, getDoctorProfile);
router.get("/all", getAllDoctors);
router.put("/update", protect, isDoctor, updateDoctorProfile);

export default router;
