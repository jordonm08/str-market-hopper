import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

const AIRDNA_API_BASE_URL = 'https://api.airdna.co/api/enterprise/v2';

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

const getAirdnaApiKey = async () => {
  const { data: secretData, error: secretError } = await supabase
    .from('secrets')
    .select('value')
    .eq('name', 'AIRDNA_API_KEY')
    .maybeSingle();

  if (secretError) {
    console.error('Error fetching API key:', secretError);
    throw new Error('Failed to fetch API key');
  }

  if (!secretData) {
    throw new Error('AirDNA API key not found in secrets');
  }

  return secretData.value;
};

export const airdnaApi = {
  async searchMarkets(searchTerm: string) {
    try {
      const apiKey = await getAirdnaApiKey();
      console.log('Making AirDNA API request for term:', searchTerm);
      const response = await axios.post(`${AIRDNA_API_BASE_URL}/market/search`, {
        search_term: searchTerm,
        pagination: {
          page_size: 10,
          offset: 0
        }
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
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
        console.error('AirDNA API Error Details:', {
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
    const apiKey = await getAirdnaApiKey();
    const response = await axios.get(`${AIRDNA_API_BASE_URL}/market/${marketId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data.payload;
  },

  async getMarketMetrics(marketId: string, metricType: 'revpar' | 'occupancy' | 'adr', numMonths: number = 12) {
    const apiKey = await getAirdnaApiKey();
    const response = await axios.post(`${AIRDNA_API_BASE_URL}/market/${marketId}/${metricType}`, {
      num_months: numMonths
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data.payload;
  }
};

export type { MarketSearchResult, MarketMetrics, MarketDetails };