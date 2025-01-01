import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

interface MarketSearchResult {
  id: string;
  name: string;
  type: string;
  listing_count: number;
  location_name: string;
  location: {
    state: string;
    country: string;
    country_code: string;
  };
}

interface MarketMetrics {
  metrics: Array<{
    month: string;
    value: number;
  }>;
}

interface MarketDetails {
  id: string;
  name: string;
  market_score: number;
  listing_count: number;
  investability: number;
  regulation: number;
  rental_demand: number;
  revenue_growth: number;
  seasonality: number;
}

export const airdnaApi = {
  async searchMarkets(searchTerm: string) {
    try {
      console.log('Making AirDNA API request for term:', searchTerm);
      const response = await axios.post(`${API_BASE_URL}/market/search`, {
        search_term: searchTerm,
        pagination: {
          page_size: 10,
          offset: 0
        }
      });

      if (!response.data?.payload?.results) {
        console.error('Unexpected API response format:', response.data);
        return [];
      }

      return response.data.payload.results;
    } catch (error) {
      console.error('AirDNA API Error:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Error Details:', {
          status: error.response?.status,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
          }
        });
      }
      throw error;
    }
  },

  async getMarketDetails(marketId: string): Promise<MarketDetails> {
    try {
      console.log('Fetching market details for:', marketId);
      const response = await axios.get(`${API_BASE_URL}/market/${marketId}`);
      
      console.log('Market details response:', response.data);
      return response.data.payload;
    } catch (error) {
      console.error('Error fetching market details:', error);
      throw error;
    }
  },

  async getMarketMetrics(marketId: string, metricType: 'revpar' | 'occupancy' | 'adr', numMonths: number = 12): Promise<MarketMetrics> {
    try {
      console.log(`Fetching ${metricType} metrics for market:`, marketId);
      const response = await axios.post(`${API_BASE_URL}/market/${marketId}/${metricType}`, {
        num_months: numMonths,
        currency: 'usd',
        start_month: new Date().toISOString().slice(0, 7) // Format: YYYY-MM
      });

      console.log(`${metricType} metrics response:`, response.data);
      return response.data.payload;
    } catch (error) {
      console.error(`Error fetching ${metricType} metrics:`, error);
      throw error;
    }
  }
};

// Add a global test function for debugging
if (typeof window !== 'undefined') {
  (window as any).testAirdnaApi = async () => {
    try {
      console.log('API Key available:', !!AIRDNA_API_KEY);
      
      // Test the API key with a simple search
      console.log('Testing API key permissions...');
      const response = await axios.post(`${AIRDNA_API_BASE_URL}/market/search`, {
        search_term: "test",
        pagination: {
          page_size: 1,
          offset: 0
        }
      }, {
        headers: {
          'Authorization': `Bearer ${AIRDNA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API test response status:', response.status);
      console.log('API permissions working:', !!response.data?.payload);
      console.log('Response data:', response.data);
      return true;
    } catch (error) {
      console.error('Error testing API key:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Error Details:', {
          status: error.response?.status,
          data: error.response?.data
        });
      }
      return false;
    }
  };
}

export type { MarketSearchResult, MarketMetrics, MarketDetails };