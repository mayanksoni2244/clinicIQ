import express from "express";
import { getPatientProfile, updatePatientProfile } from "../controllers/patientcont.js";
import { protect, isPatient } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/profile", protect, isPatient, getPatientProfile);
router.put("/update", protect, isPatient, updatePatientProfile);

export default router;
