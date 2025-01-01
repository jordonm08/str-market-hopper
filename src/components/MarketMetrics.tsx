import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { type MarketDetails } from '@/services/airdna';

interface MarketMetricsProps {
  title: 'RevPAR' | 'Occupancy' | 'ADR';
  data: MarketDetails | null;
  isLoading: boolean;
}

export function MarketMetrics({ title, data, isLoading }: MarketMetricsProps) {
  const getValue = () => {
    if (!data) return null;

    switch (title) {
      case 'RevPAR':
        return formatCurrency(data.metrics.revpar);
      case 'Occupancy':
        return formatPercentage(data.metrics.booked);
      case 'ADR':
        return formatCurrency(data.metrics.daily_rate);
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{getValue()}</div>
        )}
      </CardContent>
    </Card>
  );
}