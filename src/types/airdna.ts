export interface Market {
  id: number;
  name: string;
  type: string;
  city: string;
  state: string;
  country: string;
}

export interface MarketMetrics {
  averageDailyRate: number;
  occupancyRate: number;
  revPar: number;
  totalListings: number;
  averageRevenuePerListing: number;
}

export interface MarketSearchResponse {
  markets: Market[];
  total: number;
}

export interface MarketMetricsResponse {
  metrics: MarketMetrics;
}