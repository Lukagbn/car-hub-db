const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking.js");
const Car = require("../models/Car.js");
const verifyToken = require("../middleware/authMiddleware.js");

router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      carId,
      pickupLocation,
      pickupDate,
      pickupTime,
      dropoffLocation,
      dropoffDate,
      dropoffTime,
    } = req.body;

    if (
      !carId ||
      !pickupLocation ||
      !pickupDate ||
      !pickupTime ||
      !dropoffLocation ||
      !dropoffDate ||
      !dropoffTime
    ) {
      return res.status(400).json({
        error: "All fields are required!",
      });
    }

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({
        error: "Car not found!",
      });
    }

    const pickup = new Date(`${pickupDate}T${pickupTime}`);
    const dropoff = new Date(`${dropoffDate}T${dropoffTime}`);

    if (
      Number.isNaN(pickup.getTime()) ||
      Number.isNaN(dropoff.getTime()) ||
      dropoff <= pickup
    ) {
      return res.status(400).json({
        error: "Invalid pickup or dropoff date!",
      });
    }

    const totalPrice = car.price - (car.price * car.discount) / 100;

    const newBooking = new Booking({
      user: req.user.id,
      car: car._id,

      pickupLocation,
      pickupDate: pickup,
      pickupTime,

      dropoffLocation,
      dropoffDate: dropoff,
      dropoffTime,

      totalPrice,
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully!",
      booking: newBooking,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
