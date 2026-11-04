const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const PORT = 4000;

require("dotenv").config();

app.use(express.json());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

const carRoute = require("./routes/car");
const reviewRoute = require("./routes/review");
const authRoute = require("./routes/user");
const bookingRoute = require("./routes/booking");

app.use("/cars", carRoute);
app.use("/review", reviewRoute);
app.use("/auth", authRoute);
app.use("/booking", bookingRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongoose running"))
  .catch((error) => console.log("error:", error));

app.listen(PORT, () => {
  console.log(`Listening to port, PORT:${PORT}`);
});
