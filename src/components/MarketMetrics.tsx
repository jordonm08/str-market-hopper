import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketMetrics as MarketMetricsType } from "@/services/airdna";

interface MarketMetricsProps {
  title: string;
  data: MarketMetricsType | null;
  isLoading: boolean;
}

export function MarketMetrics({ title, data, isLoading }: MarketMetricsProps) {
  const formatValue = (value: number) => {
    if (title === "Occupancy") {
      return `${Math.round(value * 100)}%`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const currentValue = data?.metrics?.[data.metrics.length - 1]?.value ?? 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? "Loading..." : formatValue(currentValue)}
        </div>
      </CardContent>
    </Card>
  );
}