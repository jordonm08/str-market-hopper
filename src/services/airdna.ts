import axios from 'axios';

const AIRDNA_API_BASE_URL = 'https://api.airdna.co/api/enterprise/v2';
const AIRDNA_API_KEY = import.meta.env.VITE_AIRDNA_API_KEY;

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
  month: string;
  value: number;
}

interface MarketDetails {
  id: string;
  name: string;
  market_score: number;
  listing_count: number;
  occupancy: number;
  revenue: number;
  revpar: number;
}

export const airdnaApi = {
  async searchMarkets(searchTerm: string) {
    try {
      console.log('Making AirDNA API request for term:', searchTerm);
      const response = await axios.post(`${AIRDNA_API_BASE_URL}/market/search`, {
        search_term: searchTerm,
        pagination: {
          page_size: 10,
          offset: 0
        }
      }, {
        headers: {
          'Authorization': `Bearer ${AIRDNA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data?.payload?.results) {
        console.error('Unexpected API response format:', response.data);
        return [];
      }

      return response.data.payload.results.map((result: any) => ({
        id: result.id,
        name: result.name,
        type: result.type,
        listing_count: result.listing_count,
        location_name: result.location_name,
        location: {
          state: result.location.state,
          country: result.location.country,
          country_code: result.location.country_code
        }
      }));
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

  async getMarketDetails(marketId: string) {
    const response = await axios.get(`${AIRDNA_API_BASE_URL}/market/${marketId}`, {
      headers: {
        'Authorization': `Bearer ${AIRDNA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.payload;
  },

  async getMarketMetrics(marketId: string, metricType: 'revpar' | 'occupancy' | 'adr', numMonths: number = 12) {
    const response = await axios.post(`${AIRDNA_API_BASE_URL}/market/${marketId}/${metricType}`, {
      num_months: numMonths
    }, {
      headers: {
        'Authorization': `Bearer ${AIRDNA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.payload;
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