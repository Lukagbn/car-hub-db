const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  make: { type: String, reqired: true },
  model: { type: String, reqired: true },
  year: { type: String, reqired: true },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  images: [{ type: String, required: true }],
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  car_type: { type: String, reqired: true },
  transmission: { type: String, reqired: true },
  fuel_type: { type: String, reqired: true },
  fuel: { type: Number, required: true },
});

const Car = mongoose.model("Car", CarSchema);
module.exports = Car;
