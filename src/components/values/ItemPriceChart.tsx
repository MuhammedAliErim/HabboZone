'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type DataPoint = {
  date: string;
  value: number;
};

export default function ItemPriceChart({ data, currencyType }: { data: DataPoint[], currencyType: string }) {
  if (!data || data.length === 0) {
    return <div className="text-white/40 text-center py-20">Yeterli fiyat geçmişi yok.</div>;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 border border-white/20 p-3 rounded-lg shadow-xl backdrop-blur-sm">
          <p className="text-white/60 text-xs mb-1">{label}</p>
          <p className="font-black text-primary text-lg flex items-center gap-1">
            {payload[0].value} <span className="text-xs uppercase text-white/50">{currencyType}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.3)" 
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)" 
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="hsl(var(--primary))" 
            strokeWidth={4}
            dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#000' }}
            activeDot={{ r: 8, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
