import { useState } from 'react';
import { MarketSearch } from '@/components/MarketSearch';
import { MarketMetrics } from '@/components/MarketMetrics';
import { MarketChart } from '@/components/MarketChart';
import { MarketOverview } from '@/components/MarketOverview';
import { airdnaApi, type MarketSearchResult } from '@/services/airdna';
import { useQuery } from '@tanstack/react-query';

export default function App() {
  const [selectedMarket, setSelectedMarket] = useState<MarketSearchResult | null>(null);

  const { data: marketDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['marketDetails', selectedMarket?.id],
    queryFn: () => airdnaApi.getMarketDetails(selectedMarket!.id),
    enabled: !!selectedMarket,
  });

  const { data: revparData, isLoading: isLoadingRevpar } = useQuery({
    queryKey: ['marketMetrics', selectedMarket?.id, 'revpar'],
    queryFn: () => airdnaApi.getMarketMetrics(selectedMarket!.id, 'revpar'),
    enabled: !!selectedMarket,
  });

  const { data: occupancyData, isLoading: isLoadingOccupancy } = useQuery({
    queryKey: ['marketMetrics', selectedMarket?.id, 'occupancy'],
    queryFn: () => airdnaApi.getMarketMetrics(selectedMarket!.id, 'occupancy'),
    enabled: !!selectedMarket,
  });

  const { data: adrData, isLoading: isLoadingAdr } = useQuery({
    queryKey: ['marketMetrics', selectedMarket?.id, 'adr'],
    queryFn: () => airdnaApi.getMarketMetrics(selectedMarket!.id, 'adr'),
    enabled: !!selectedMarket,
  });

  const isLoading = isLoadingDetails || isLoadingRevpar || isLoadingOccupancy || isLoadingAdr;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">STR Market Explorer</h1>
        
        <div className="mb-8 max-w-xl">
          <MarketSearch onMarketSelect={setSelectedMarket} />
        </div>

        {selectedMarket && (
          <div className="space-y-8">
            <MarketOverview
              marketName={selectedMarket.location_name}
              listingCount={marketDetails?.listing_count || 0}
              marketScore={marketDetails?.market_score || 0}
              investabilityScore={marketDetails?.investability || 0}
              regulationScore={marketDetails?.regulation || 0}
              isLoading={isLoadingDetails}
            />

            <MarketMetrics
              revpar={marketDetails?.revpar || 0}
              occupancy={marketDetails?.occupancy || 0}
              adr={marketDetails?.adr || 0}
              isLoading={isLoadingDetails}
            />

            <MarketChart
              revparData={revparData?.metrics || []}
              occupancyData={occupancyData?.metrics || []}
              adrData={adrData?.metrics || []}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
