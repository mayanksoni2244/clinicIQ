// controllers/authController.js
import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";
import { generateToken } from "../utils/generatetoken.js";

export const register = async (req, res) => {
  const { name, email, password, role, specialization, medicalId, experienceYears, degree } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    if (role === "doctor" && (!specialization || !medicalId || !experienceYears || !degree)) {
      return res.status(400).json({ message: "Specialization, Medical ID, Degree and Experience are required for doctors" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let testimonialText;
    if (role === "doctor") {
      testimonialText = `Dr. ${name} holds a ${degree} with ${experienceYears}+ years of experience in ${specialization}.`;
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === "doctor" ? { specialization, medicalId, experienceYears, degree, testimonial: testimonialText } : {}),
    });
    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        specialization: newUser.specialization,
        medicalId: newUser.medicalId,
        experienceYears: newUser.experienceYears,
        degree: newUser.degree,
        testimonial: newUser.testimonial,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
