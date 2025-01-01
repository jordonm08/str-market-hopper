const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const AIRDNA_API_BASE_URL = 'https://api.airdna.co/api/enterprise/v2';
const AIRDNA_API_KEY = process.env.VITE_AIRDNA_API_KEY;

// Proxy endpoint for market search
app.post('/api/market/search', async (req, res) => {
  try {
    const response = await axios.post(`${AIRDNA_API_BASE_URL}/market/search`, req.body, {
      headers: {
        'Authorization': `Bearer ${AIRDNA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying market search:', error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy endpoint for market details
app.get('/api/market/:marketId', async (req, res) => {
  try {
    const response = await axios.get(`${AIRDNA_API_BASE_URL}/market/${req.params.marketId}`, {
      headers: {
        'Authorization': `Bearer ${AIRDNA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying market details:', error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy endpoint for market metrics
app.post('/api/market/:marketId/:metricType', async (req, res) => {
  try {
    const response = await axios.post(
      `${AIRDNA_API_BASE_URL}/market/${req.params.marketId}/${req.params.metricType}`,
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${AIRDNA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(`Error proxying ${req.params.metricType} metrics:`, error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
}); 