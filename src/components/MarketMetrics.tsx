import { Card } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
}

const MetricCard = ({ title, value, change }: MetricCardProps) => (
  <Card className="p-4">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="text-2xl font-semibold mt-1">{value}</p>
    {change && (
      <p className={`text-sm mt-1 ${change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
        {change}
      </p>
    )}
  </Card>
);

export const MarketMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Average Daily Rate"
        value="$245"
        change="+12.5% YoY"
      />
      <MetricCard
        title="Occupancy Rate"
        value="78%"
        change="-2.3% YoY"
      />
      <MetricCard
        title="RevPAR"
        value="$191"
        change="+8.7% YoY"
      />
    </div>
  );
};