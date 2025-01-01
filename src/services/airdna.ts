import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002/api';

export interface MarketSearchResult {
  id: number;
  location_name: string;
  type: string;
}

export interface MarketMetrics {
  market_score: number;
  revenue: number;
  booked: number;
  daily_rate: number;
  revpar: number;
}

export interface MarketDetails {
  id: number;
  name: string;
  metrics: MarketMetrics;
  historical_metrics: {
    month: string;
    revenue: number;
    occupancy: number;
    adr: number;
  }[];
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

  async getMarketDetails(marketId: string | number): Promise<MarketDetails> {
    try {
      const formattedId = typeof marketId === 'number' ? `airdna-${marketId}` : marketId;
      console.log('Fetching market details for:', formattedId);
      const response = await axios.get(`${API_BASE_URL}/market/${formattedId}`);
      
      console.log('Market details response:', response.data);
      return response.data.payload;
    } catch (error) {
      console.error('Error fetching market details:', error);
      throw error;
    }
  }
};