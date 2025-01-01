import { useState } from 'react';
import { MarketSearch } from '@/components/MarketSearch';
import { MarketMetrics } from '@/components/MarketMetrics';
import { MarketChart } from '@/components/MarketChart';
import { MarketOverview } from '@/components/MarketOverview';
import { airdnaApi, type MarketSearchResult } from '@/services/airdna';
import { useQuery } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [selectedMarket, setSelectedMarket] = useState<MarketSearchResult | null>(null);

  const { data: marketDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['marketDetails', selectedMarket?.id],
    queryFn: async () => {
      if (!selectedMarket?.id) throw new Error('No market selected');
      return airdnaApi.getMarketDetails(selectedMarket.id);
    },
    enabled: !!selectedMarket?.id,
    initialData: null,
  });

  const { data: revparData, isLoading: isLoadingRevpar } = useQuery({
    queryKey: ['marketMetrics', selectedMarket?.id, 'revpar'],
    queryFn: async () => {
      if (!selectedMarket?.id) throw new Error('No market selected');
      return airdnaApi.getMarketMetrics(selectedMarket.id, 'revpar', 12);
    },
    enabled: !!selectedMarket?.id,
    initialData: null,
  });

  const { data: occupancyData, isLoading: isLoadingOccupancy } = useQuery({
    queryKey: ['marketMetrics', selectedMarket?.id, 'occupancy'],
    queryFn: async () => {
      if (!selectedMarket?.id) throw new Error('No market selected');
      return airdnaApi.getMarketMetrics(selectedMarket.id, 'occupancy', 12);
    },
    enabled: !!selectedMarket?.id,
    initialData: null,
  });

  const { data: adrData, isLoading: isLoadingAdr } = useQuery({
    queryKey: ['marketMetrics', selectedMarket?.id, 'adr'],
    queryFn: async () => {
      if (!selectedMarket?.id) throw new Error('No market selected');
      return airdnaApi.getMarketMetrics(selectedMarket.id, 'adr', 12);
    },
    enabled: !!selectedMarket?.id,
    initialData: null,
  });

  const isLoading = isLoadingDetails || isLoadingRevpar || isLoadingOccupancy || isLoadingAdr;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">STR Market Explorer</h1>
        
        <div className="w-full max-w-xl mb-8">
          <MarketSearch onMarketSelect={setSelectedMarket} />
        </div>

        {selectedMarket && (
          <div className="space-y-8">
            <MarketOverview
              marketName={selectedMarket.location_name}
              marketDetails={marketDetails}
              isLoading={isLoadingDetails}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MarketMetrics
                title="RevPAR"
                data={revparData}
                isLoading={isLoadingRevpar}
              />
              <MarketMetrics
                title="Occupancy"
                data={occupancyData}
                isLoading={isLoadingOccupancy}
              />
              <MarketMetrics
                title="ADR"
                data={adrData}
                isLoading={isLoadingAdr}
              />
            </div>

            <MarketChart
              revparData={revparData}
              occupancyData={occupancyData}
              adrData={adrData}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
