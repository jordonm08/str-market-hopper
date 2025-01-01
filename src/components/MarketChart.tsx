import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ChartData {
  month: string;
  value: number;
}

interface MarketChartProps {
  revparData: ChartData[];
  occupancyData: ChartData[];
  adrData: ChartData[];
  isLoading?: boolean;
}

type MetricType = 'revpar' | 'occupancy' | 'adr';

export function MarketChart({ revparData, occupancyData, adrData, isLoading = false }: MarketChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('revpar');

  const getChartData = () => {
    switch (selectedMetric) {
      case 'revpar':
        return revparData;
      case 'occupancy':
        return occupancyData;
      case 'adr':
        return adrData;
    }
  };

  const formatValue = (value: number) => {
    if (selectedMetric === 'occupancy') {
      return `${(value * 100).toFixed(1)}%`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getChartColor = () => {
    switch (selectedMetric) {
      case 'revpar':
        return '#2563eb'; // blue-600
      case 'occupancy':
        return '#16a34a'; // green-600
      case 'adr':
        return '#9333ea'; // purple-600
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Historical Performance</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={selectedMetric === 'revpar' ? 'default' : 'outline'}
              onClick={() => setSelectedMetric('revpar')}
              size="sm"
            >
              RevPAR
            </Button>
            <Button
              variant={selectedMetric === 'occupancy' ? 'default' : 'outline'}
              onClick={() => setSelectedMetric('occupancy')}
              size="sm"
            >
              Occupancy
            </Button>
            <Button
              variant={selectedMetric === 'adr' ? 'default' : 'outline'}
              onClick={() => setSelectedMetric('adr')}
              size="sm"
            >
              ADR
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            Loading...
          </div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getChartData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                  }}
                />
                <YAxis
                  tickFormatter={(value) => {
                    if (selectedMetric === 'occupancy') {
                      return `${(value * 100).toFixed(0)}%`;
                    }
                    return `$${value.toFixed(0)}`;
                  }}
                />
                <Tooltip
                  formatter={(value: number) => [formatValue(value), selectedMetric.toUpperCase()]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={getChartColor()}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 