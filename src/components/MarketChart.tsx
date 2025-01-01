import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { type MarketDetails } from '@/services/airdna';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MarketChartProps {
  data: MarketDetails | null;
  isLoading: boolean;
}

export function MarketChart({ data, isLoading }: MarketChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historical Metrics</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data?.historical_metrics) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Metrics</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.historical_metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              name="Revenue"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="occupancy"
              stroke="#82ca9d"
              name="Occupancy"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="adr"
              stroke="#ffc658"
              name="ADR"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 