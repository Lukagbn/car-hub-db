const express = require("express");
const router = express.Router();
const Car = require("../models/Car.js");

router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 9, 1);
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [{ make: searchRegex }, { model: searchRegex }];
    }

    if (req.query.make) {
      filter.make = new RegExp(`^${req.query.make}$`, "i");
    }

    if (req.query.car_type) {
      filter.car_type = new RegExp(`^${req.query.car_type}$`, "i");
    }

    if (req.query.transmission) {
      filter.transmission = new RegExp(`^${req.query.transmission}$`, "i");
    }

    if (req.query.fuel_type) {
      filter.fuel_type = new RegExp(`^${req.query.fuel_type}$`, "i");
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    const [cars, totalCars] = await Promise.all([
      Car.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Car.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCars / limit);

    res.status(200).json({
      carData: cars,
      pagination: {
        currentPage: page,
        totalPages,
        totalCars,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      images,
      thumbnail_img,
      price,
      discount,
      car_type,
      transmission,
      fuel_type,
      fuel,
    } = req.body;
    const newCar = new Car({
      make,
      model,
      year,
      images,
      thumbnail_img,
      price,
      discount,
      car_type,
      transmission,
      fuel_type,
      fuel,
    });
    await newCar.save();
    res.status(200).json({ newCar: newCar });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:_id", async (req, res) => {
  try {
    const _id = req.params._id;
    const carDetails = await Car.findById(_id);
    if (!carDetails) {
      res.status(400).json({ message: "Wrong car id!" });
    }
    res.status(200).json({ carDetails });
  } catch (error) {
    console.log("error", error);
  }
});
module.exports = router;
