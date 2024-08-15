const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001; // Poți folosi alt port, dacă vrei.

app.use(cors());

app.get('/api/timezone', async (req, res) => {
  const { lat, lng } = req.query;

  try {
    const response = await axios.get(
      `https://api.timezonedb.com/v2.1/get-time-zone?key=4TPI5C97IE3Q&format=json&by=position&lat=${lat}&lng=${lng}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Eroare la apelul API.' });
  }
});

app.listen(port, () => {
  console.log(`Serverul proxy rulează pe http://localhost:${port}`);
});
