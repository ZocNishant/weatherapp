const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT | 8888;

app.use(express.json());
app.use(cors());

// Connection with mongo db
mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("Connected to mongodb."))
  .catch((error) => {
    console.log(error);
  });

// Model
const WeatherData = mongoose.model("WeatherData", {
  city: String,
  country: String,
  temprature: Number,
  description: String,
  icon: String,
});

app.post("/api/weather", async (req, res) => {
  try {
    // Extract data from body
    const { city, country, description, temprature, icon } = req.body;

    // Creating a new document using the model
    const weatherData = new WeatherData({
      city,
      country,
      temprature,
      description,
      icon,
    });

    // Save the weather data to the database
    weatherData.save();

    res.json({ messgae: "Weather Data saved successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.listen(port, () => {
  console.log(`Server started at port ${port}.`);
});
