import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MarketChartProps {
  revparData: {
    metrics: Array<{ month: string; value: number }>;
  } | null;
  occupancyData: {
    metrics: Array<{ month: string; value: number }>;
  } | null;
  adrData: {
    metrics: Array<{ month: string; value: number }>;
  } | null;
  isLoading: boolean;
}

export function MarketChart({ revparData, occupancyData, adrData, isLoading }: MarketChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          {/* Add your chart implementation here */}
          Chart coming soon...
        </div>
      </CardContent>
    </Card>
  );
} 