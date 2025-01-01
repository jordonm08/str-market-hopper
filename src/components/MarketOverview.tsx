import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, TrendingUp, AlertTriangle, Activity } from "lucide-react";

interface MarketOverviewProps {
  marketName: string;
  marketDetails: {
    listing_count: number;
    market_score: number;
    investability: number;
    regulation: number;
  } | null;
  isLoading?: boolean;
}

export function MarketOverview({
  marketName,
  marketDetails,
  isLoading = false,
}: MarketOverviewProps) {
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat().format(value);
  };

  const formatScore = (value: number) => {
    return Math.round(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Listings</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : formatNumber(marketDetails?.listing_count || 0)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Market Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : formatScore(marketDetails?.market_score || 0)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Investability</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : formatScore(marketDetails?.investability || 0)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Regulation</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : formatScore(marketDetails?.regulation || 0)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 