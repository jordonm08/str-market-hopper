import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

const AIRDNA_API_BASE_URL = 'https://api.airdna.co/api/enterprise/v2';
const AIRDNA_API_KEY = process.env.VITE_AIRDNA_API_KEY;

// Log middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    params: req.params
  });
  next();
});

// Proxy endpoint for market search
app.post('/api/market/search', async (req, res) => {
  try {
    console.log('Proxying search request with body:', req.body);
    console.log('Using API key:', AIRDNA_API_KEY ? 'Present' : 'Missing');

    const response = await axios.post(`${AIRDNA_API_BASE_URL}/market/search`, req.body, {
      headers: {
        'Authorization': `Bearer ${AIRDNA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('AirDNA API response:', {
      status: response.status,
      hasPayload: !!response.data?.payload,
      resultsCount: response.data?.payload?.results?.length
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error proxying market search:', error);
    if (error.response) {
      console.error('AirDNA API error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    res.status(error.response?.status || 500).json({ error: error.message, details: error.response?.data });
  }
});

// Proxy endpoint for market details
app.get('/api/market/:marketId', async (req, res) => {
  try {
    console.log('Proxying market details request for:', req.params.marketId);
    const response = await axios.get(`${AIRDNA_API_BASE_URL}/market/${req.params.marketId}`, {
      headers: {
        'Authorization': `Bearer ${AIRDNA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Market details response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying market details:', error);
    if (error.response) {
      console.error('AirDNA API error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    res.status(error.response?.status || 500).json({ error: error.message, details: error.response?.data });
  }
});

app.listen(port, () => {
  if (!AIRDNA_API_KEY) {
    console.error('WARNING: VITE_AIRDNA_API_KEY environment variable is not set!');
  }
  console.log(`Proxy server running at http://localhost:${port}`);
}); 