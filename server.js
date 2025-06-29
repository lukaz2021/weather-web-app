// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// GET /weather?city=Stuttgart
app.get('/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    // Step 1: Convert city name to lat/lon
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    const geoRes = await axios.get(geoUrl, { headers: { 'User-Agent': 'weather-app' } });

    if (!geoRes.data.length) return res.status(404).json({ error: 'City not found' });

    const { lat, lon } = geoRes.data[0];

    // Step 2: Get temperature
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`;
    const weatherRes = await axios.get(weatherUrl);
    const temperature = weatherRes.data.current.temperature_2m;

    res.json({ city, temperature });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching weather' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Weather app running at http://localhost:${PORT}`);
});