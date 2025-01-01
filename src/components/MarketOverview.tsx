import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, TrendingUp, AlertTriangle, Activity } from "lucide-react";

interface MarketOverviewProps {
  marketName: string;
  listingCount: number;
  marketScore: number;
  investabilityScore: number;
  regulationScore: number;
  isLoading?: boolean;
}

export function MarketOverview({
  marketName,
  listingCount,
  marketScore,
  investabilityScore,
  regulationScore,
  isLoading = false,
}: MarketOverviewProps) {
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatScore = (value: number) => {
    return value.toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{marketName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Active Listings</p>
              <p className="text-2xl font-bold">
                {isLoading ? "Loading..." : formatNumber(listingCount)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Market Score</p>
              <p className="text-2xl font-bold">
                {isLoading ? "Loading..." : formatScore(marketScore)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Investability</p>
              <p className="text-2xl font-bold">
                {isLoading ? "Loading..." : formatScore(investabilityScore)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Regulation Score</p>
              <p className="text-2xl font-bold">
                {isLoading ? "Loading..." : formatScore(regulationScore)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 