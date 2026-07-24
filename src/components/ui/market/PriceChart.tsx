'use client'

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { format, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'

interface PriceHistory {
  id: string
  value: number
  currency_type: string
  note: string | null
  created_at: string
}

interface PriceChartProps {
  history: PriceHistory[]
  currencyType: string
}

export default function PriceChart({ history, currencyType }: PriceChartProps) {
  if (!history || history.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-[#090e17] rounded-[4px] border border-[#2b3548]">
        <span className="text-gray-500 text-sm">Fiyat geçmişi bulunmuyor.</span>
      </div>
    )
  }

  // Format data for Recharts
  const data = history.map(item => ({
    date: item.created_at,
    value: item.value,
    note: item.note,
    formattedDate: format(parseISO(item.created_at), 'd MMM yyyy', { locale: tr })
  }))

  const color = currencyType === 'credits' ? '#facc15' : '#3b82f6'

  return (
    <div className="w-full h-[350px] bg-[#090e17] rounded-[4px] border border-[#2b3548] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="formattedDate" 
            stroke="#475569" 
            fontSize={11}
            tickMargin={10}
            minTickGap={30}
          />
          <YAxis 
            stroke="#475569" 
            fontSize={11} 
            tickFormatter={(value) => value.toLocaleString('tr-TR')}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-[#1e293b] border border-[#2b3548] p-3 rounded-[4px] shadow-xl">
                    <p className="text-gray-400 text-xs mb-1">{label}</p>
                    <p className="text-white font-bold text-lg flex items-center gap-1.5">
                      <img 
                        src={currencyType === 'credits' 
                          ? 'https://images.habbo.com/c_images/album1584/CRED.gif' 
                          : 'https://images.habbo.com/c_images/album1584/DIA.gif'} 
                        alt={currencyType}
                        className="w-4 h-4 pixelated"
                      />
                      {payload[0].value?.toLocaleString('tr-TR')}
                    </p>
                    {data.note && (
                      <p className="text-gray-400 text-xs mt-2 pt-2 border-t border-[#2b3548]">
                        {data.note}
                      </p>
                    )}
                  </div>
                )
              }
              return null
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            activeDot={{ r: 6, strokeWidth: 0, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
