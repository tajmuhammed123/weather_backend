// routes/WeatherRoutes.js
const express = require("express");
const {
  getAvailableCities,
  getCurrentWeather,
  getHistoricalWeather,
  fetchAndSaveWeather,
} = require("../Controllers/WeatherController");

const router = express.Router();

router.get("/cities", getAvailableCities);
router.get("/current/:city", getCurrentWeather);
router.get("/historical", getHistoricalWeather);
router.post("/fetch", fetchAndSaveWeather);

module.exports = router;
