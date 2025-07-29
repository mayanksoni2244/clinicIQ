import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token failed or expired" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

// ⛔️ Role-based guards:
export const isDoctor = (req, res, next) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Access denied: Doctor only route" });
  }
  next();
};

export const isPatient = (req, res, next) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({ message: "Access denied: Patient only route" });
  }
  next();
};
