import { Card } from "@/components/ui/card";

export const MarketStats = () => {
  return (
    <Card className="p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Market Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Active Listings</h3>
          <p className="text-2xl font-semibold mt-1">1,234</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Average Property Size</h3>
          <p className="text-2xl font-semibold mt-1">2.5 Bedrooms</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Market Growth</h3>
          <p className="text-2xl font-semibold mt-1">+15.3%</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Revenue Potential</h3>
          <p className="text-2xl font-semibold mt-1">$5,400/mo</p>
        </div>
      </div>
    </Card>
  );
};