// models/Weather.js - MongoDB model for weather data
const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    index: true
  },
  country: {
    type: String
  },
  temperature: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  humidity: {
    type: Number
  },
  windSpeed: {
    type: Number
  },
  pressure: {
    type: Number
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Weather', WeatherSchema);