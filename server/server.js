// server.js
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientroutes.js";
import doctorRoutes from "./routes/doctorroutes.js";
import appointmentRoutes from "./routes/appointmentroute.js";
import router from './routes/availablityRoutes.js'
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
const corsOptions = {
  origin: "http://localhost:5173", // your frontend origin
  credentials: true,               // allow cookies / JWT etc
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/availability", router);


// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to ClinicIQ API");
});

// Error Middleware Placeholder (for future enhancements)
app.use((err, req, res, next) => {
  console.error("Error 💥:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
