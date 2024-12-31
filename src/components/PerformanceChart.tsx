import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 2000 },
  { month: "Apr", revenue: 2780 },
  { month: "May", revenue: 1890 },
  { month: "Jun", revenue: 2390 },
];

export const PerformanceChart = () => {
  return (
    <div className="w-full h-[400px] mt-6">
      <h2 className="text-xl font-semibold mb-4">Historical Performance</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};