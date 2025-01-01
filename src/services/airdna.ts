import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export interface MarketSearchResult {
  id: number;
  location_name: string;
  type: string;
}

export interface MarketMetrics {
  revenue: number;
  occupancy: number;
  adr: number;
  revenue_available: number;
  active_properties: number;
  available_properties: number;
  booked_properties: number;
  blocked_properties: number;
  reservation_days: number;
  available_days: number;
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

  async getMarketDetails(marketId: number): Promise<MarketDetails> {
    try {
      console.log('Fetching market details for:', marketId);
      const response = await axios.get(`${API_BASE_URL}/market/${marketId}`);
      
      console.log('Market details response:', response.data);
      return response.data.payload;
    } catch (error) {
      console.error('Error fetching market details:', error);
      throw error;
    }
  }
};