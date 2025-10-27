// routes/availabilityRoutes.js
import express from "express";
import { setAvailability, getAvailability, setWeeklyAvailability, getAvailableSlotsForDate } from "../controllers/availableController.js";
import { protect, isDoctor } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/set", protect, isDoctor, setAvailability);
router.post("/set-weekly", protect, isDoctor, setWeeklyAvailability);
router.get("/weekly/:id", getAvailability); // returns raw
router.get("/slots/:id", getAvailableSlotsForDate); // ?date=YYYY-MM-DD

router.get("/:id", getAvailability); // legacy

export default router;
