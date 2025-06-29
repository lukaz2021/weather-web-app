// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get temperature by lat/lon
app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Missing lat/lon' });

  try {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`;
    const response = await axios.get(apiUrl);
    const temp = response.data.current.temperature_2m;
    res.json({ temperature: temp });
  } catch (error) {
    res.status(500).json({ error: 'Weather fetch failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🌍 Server running at http://localhost:${PORT}`);
});