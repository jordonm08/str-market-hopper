import { supabase } from "@/integrations/supabase/client";

const AIRDNA_BASE_URL = 'https://api.airdna.co/v1';

interface MarketSearchParams {
  term: string;
}

interface MarketMetricsParams {
  marketId: number;
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
    throw new Error('AirDNA API key not found in secrets. Please add it to continue.');
  }

  return secretData.value;
};

export const searchMarkets = async ({ term }: MarketSearchParams) => {
  try {
    const apiKey = await getAirdnaApiKey();

    const response = await fetch(
      `${AIRDNA_BASE_URL}/market/search?access_token=${apiKey}&term=${encodeURIComponent(term)}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('AirDNA API error:', errorData);
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
    const apiKey = await getAirdnaApiKey();

    const response = await fetch(
      `${AIRDNA_BASE_URL}/market/statistics?access_token=${apiKey}&market_id=${marketId}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('AirDNA API error:', errorData);
      throw new Error('Failed to fetch market metrics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching market metrics:', error);
    throw error;
  }
};