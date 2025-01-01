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

      console.log('Raw search response:', response.data);

      if (!response.data?.payload?.results) {
        console.error('Unexpected API response format:', response.data);
        return [];
      }

      const results = response.data.payload.results;
      console.log('Found', results.length, 'results:', results);
      return results;
    } catch (error) {
      console.error('AirDNA API Error:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Error Details:', {
          status: error.response?.status,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data
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

export type { MarketSearchResult, MarketMetrics, MarketDetails };