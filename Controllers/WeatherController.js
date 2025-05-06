const axios = require("axios");
const Weather = require("../models/Weather");

// Available cities
const AVAILABLE_CITIES = [
  "Delhi",
  "Moscow",
  "Paris",
  "New York",
  "Sydney",
  "Riyadh",
];

const getAvailableCities = (req, res) => {
  console.log("TEST");

  res.json({ cities: AVAILABLE_CITIES });
};

const getCurrentWeather = async (req, res) => {
  try {
    const city = req.params.city;

    const latestWeather = await Weather.findOne({ city })
      .sort({ timestamp: -1 })
      .limit(1);

    if (
      latestWeather &&
      new Date() - new Date(latestWeather.timestamp) < 30 * 60 * 1000
    ) {
      return res.json(latestWeather);
    }

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    console.log(response.data);
    

    const data = response.data;

    const weatherData = {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      tempMin: data.main.temp_min,
      tempMax: data.main.temp_max,
      pressure: data.main.pressure,
      seaLevel: data.main.sea_level || null,
      groundLevel: data.main.grnd_level || null,
      humidity: data.main.humidity,
      weatherMain: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      windDeg: data.wind.deg,
      windGust: data.wind.gust || null,
      visibility: data.visibility,
      cloudiness: data.clouds.all,
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      timestamp: new Date(),
    };

    const newWeather = new Weather(weatherData);
    await newWeather.save();

    return res.json(newWeather);
  } catch (error) {
    console.error("Error fetching current weather:", error);
    return res.status(500).json({
      message: "Failed to fetch current weather data",
      error: error.message,
    });
  }
};

const getHistoricalWeather = async (req, res) => {
  try {
    const { city, fromDate, toDate } = req.query;

    if (!city || !fromDate || !toDate) {
      return res
        .status(400)
        .json({ message: "City, fromDate, and toDate are required" });
    }

    const fromDateTime = new Date(fromDate);
    const toDateTime = new Date(toDate);

    const daysDifference = (toDateTime - fromDateTime) / (1000 * 60 * 60 * 24);
    if (daysDifference > 30) {
      return res
        .status(400)
        .json({ message: "Date range cannot exceed 30 days" });
    }

    const historicalData = await Weather.find({
      city,
      timestamp: {
        $gte: fromDateTime,
        $lte: toDateTime,
      },
    }).sort({ timestamp: 1 });

    return res.json(historicalData);
  } catch (error) {
    console.error("Error fetching historical weather:", error);
    return res.status(500).json({
      message: "Failed to fetch historical weather data",
      error: error.message,
    });
  }
};

const fetchAndSaveWeather = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      pressure: response.data.main.pressure,
      timestamp: new Date(),
    };

    const newWeather = new Weather(weatherData);
    await newWeather.save();

    return res.status(201).json(newWeather);
  } catch (error) {
    console.error("Error saving weather data:", error);
    return res.status(500).json({
      message: "Failed to fetch and save weather data",
      error: error.message,
    });
  }
};

module.exports = {
  getAvailableCities,
  getCurrentWeather,
  getHistoricalWeather,
  fetchAndSaveWeather,
};
