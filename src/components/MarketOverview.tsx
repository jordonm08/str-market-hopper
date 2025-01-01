import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, TrendingUp, Activity, DollarSign, Percent } from "lucide-react";
import type { MarketDetails } from "@/services/airdna";
import { formatCurrency, formatPercentage } from "@/lib/utils";

interface MarketOverviewProps {
  marketName: string;
  marketDetails: MarketDetails | null;
  isLoading?: boolean;
}

export function MarketOverview({
  marketName,
  marketDetails,
  isLoading = false,
}: MarketOverviewProps) {
  return (
    <>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">{marketName}</h2>
        <p className="text-sm text-muted-foreground">Last 12 months of market data</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : formatCurrency(marketDetails?.metrics.revenue || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RevPAR</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : formatCurrency(marketDetails?.metrics.revpar || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ADR</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : formatCurrency(marketDetails?.metrics.daily_rate || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : formatPercentage(marketDetails?.metrics.booked || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : marketDetails?.metrics.market_score.toFixed(1) || 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 