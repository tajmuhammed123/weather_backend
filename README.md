Weather App Backend

Backend for a weather app that fetches and stores real-time weather data using the OpenWeather API.

Features
Available Cities: Get a list of cities.

Current Weather: Fetch current weather data for a city.

Historical Weather: Retrieve weather data for a specific date range (up to 30 days).

Fetch & Save Weather: Fetch and save weather data for a city.

Setup

Clone the repo:
Terminal:
git clone <repo-url>
cd <project-directory>

Install dependencies:
Terminal:
npm install
Set up .env file with your OpenWeather API key:

env:
OPENWEATHERMAP_API_KEY=your-api-key

Start the server:
Terminal:
npm run start

Endpoints
GET /cities: List of available cities.

GET /current/:city: Current weather for a city.

GET /historical: Historical weather for a city (fromDate, toDate).

POST /weather: Fetch and save weather data for a city.

Example Requests
Get Available Cities:

Terminal:
GET /cities
Get Current Weather:

Terminal:
GET /current/Delhi
Get Historical Weather:

Terminal:
GET /historical?city=Delhi&fromDate=2025-04-01&toDate=2025-04-10
Fetch & Save Weather:

Terminal:
POST /weather
{ "city": "Delhi" }