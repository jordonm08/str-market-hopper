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
const port = 3003;

app.use(cors());
app.use(express.json());

// Add root route for basic connectivity test
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

const AIRDNA_API_BASE_URL = 'https://api.airdna.co/api/enterprise/v2';
const AIRDNA_API_KEY = process.env.AIRDNA_API_KEY;

// Log middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    params: req.params
  });
  next();
});

// Add API key check middleware
app.use((req, res, next) => {
  if (!AIRDNA_API_KEY) {
    console.error('ERROR: AIRDNA_API_KEY environment variable is not set!');
    return res.status(500).json({ error: 'API key not configured' });
  }
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

// Proxy endpoint for market/submarket details
app.get('/api/market/:marketId', async (req, res) => {
  try {
    const id = req.params.marketId.replace('airdna-', '');
    const originalId = req.params.marketId;
    
    console.log('Received request for:', {
      originalId,
      strippedId: id
    });

    // Try submarket endpoint first since we know the ID format
    const submarketUrl = `${AIRDNA_API_BASE_URL}/submarket/${id}`;
    console.log('Trying submarket endpoint:', submarketUrl);
    
    try {
      const submarketResponse = await axios.get(submarketUrl, {
        headers: {
          'Authorization': `Bearer ${AIRDNA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Submarket response successful:', {
        status: submarketResponse.status,
        hasData: !!submarketResponse.data
      });

      return res.json(submarketResponse.data);
    } catch (submarketError) {
      console.log('Submarket request failed:', {
        status: submarketError.response?.status,
        error: submarketError.message
      });

      // If submarket fails, try market endpoint
      const marketUrl = `${AIRDNA_API_BASE_URL}/market/${id}`;
      console.log('Trying market endpoint:', marketUrl);

      const marketResponse = await axios.get(marketUrl, {
        headers: {
          'Authorization': `Bearer ${AIRDNA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Market response successful:', {
        status: marketResponse.status,
        hasData: !!marketResponse.data
      });

      return res.json(marketResponse.data);
    }
  } catch (error) {
    console.error('Error handling request:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.error?.message || error.message;
    
    res.status(status).json({
      error: errorMessage,
      details: error.response?.data
    });
  }
});

app.listen(port, () => {
  if (!AIRDNA_API_KEY) {
    console.error('WARNING: VITE_AIRDNA_API_KEY environment variable is not set!');
  }
  console.log(`Proxy server running at http://localhost:${port}`);
}); 