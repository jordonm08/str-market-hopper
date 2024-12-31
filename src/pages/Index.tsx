import { MarketSearch } from "@/components/MarketSearch";
import { MarketMetrics } from "@/components/MarketMetrics";
import { PerformanceChart } from "@/components/PerformanceChart";
import { MarketStats } from "@/components/MarketStats";

const Index = () => {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // TODO: Implement AirDNA API integration
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">STR Market Explorer</h1>
        
        <div className="mb-8">
          <MarketSearch onSearch={handleSearch} />
        </div>

        <div className="space-y-8">
          <MarketMetrics />
          <PerformanceChart />
          <MarketStats />
        </div>
      </div>
    </div>
  );
};

export default Index;