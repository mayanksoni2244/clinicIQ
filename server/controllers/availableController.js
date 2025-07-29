import { Availability } from "../models/docAvailablemodel.js";

export const setAvailability = async (req, res) => {
  const doctorId = req.user._id;
  const { slots } = req.body;

  try {
    let availability = await Availability.findOne({ doctor: doctorId });

    if (availability) {
      availability.slots = slots;
    } else {
      availability = new Availability({ doctor: doctorId, slots });
    }

    await availability.save();
    res.status(200).json({ message: "Availability updated", availability });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOne({ doctor: req.params.id });
    if (!availability) {
      return res.status(404).json({ message: "No availability set" });
    }

    res.status(200).json(availability);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
