// routes/availabilityRoutes.js
import express from "express";
import { setAvailability, getAvailability } from "../controllers/availableController.js";
import { protect, isDoctor } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/set", protect, isDoctor, setAvailability);
router.get("/:id", getAvailability); // Patient can view doctor availability

export default router;
