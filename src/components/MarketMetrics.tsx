import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MarketMetricsProps {
  title: string;
  data: {
    metrics: Array<{ month: string; value: number }>;
  } | null;
  isLoading: boolean;
}

export function MarketMetrics({ title, data, isLoading }: MarketMetricsProps) {
  const formatValue = (value: number) => {
    return title === "Occupancy" ? `${Math.round(value * 100)}%` : Math.round(value).toLocaleString();
  };

  const currentValue = data?.metrics?.[data.metrics.length - 1]?.value || 0;

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