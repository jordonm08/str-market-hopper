import { supabase } from "@/integrations/supabase/client";

const AIRDNA_BASE_URL = 'https://api.airdna.co/v1';

interface MarketSearchParams {
  term: string;
}

interface MarketMetricsParams {
  marketId: number;
}

export const searchMarkets = async ({ term }: MarketSearchParams) => {
  try {
    const { data: secretData, error: secretError } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'AIRDNA_API_KEY')
      .single();

    if (secretError) throw new Error('Failed to fetch API key');

    const response = await fetch(
      `${AIRDNA_BASE_URL}/market/search?access_token=${secretData.value}&term=${encodeURIComponent(term)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching markets:', error);
    throw error;
  }
};

export const getMarketMetrics = async ({ marketId }: MarketMetricsParams) => {
  try {
    const { data: secretData, error: secretError } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'AIRDNA_API_KEY')
      .single();

    if (secretError) throw new Error('Failed to fetch API key');

    const response = await fetch(
      `${AIRDNA_BASE_URL}/market/statistics?access_token=${secretData.value}&market_id=${marketId}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch market metrics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching market metrics:', error);
    throw error;
  }
};