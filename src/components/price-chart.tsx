'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPrice } from '@/lib/utils';
import type { PricePoint } from '@/types';

interface PriceChartProps {
  data: PricePoint[];
  isPositive?: boolean;
}

export function PriceChart({ data, isPositive = true }: PriceChartProps) {
  const chartData = useMemo(() => {
    return data.map((point) => ({
      ...point,
      time: new Date(point.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      date: new Date(point.timestamp).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      }),
    }));
  }, [data]);

  const color = isPositive ? '#00dc82' : '#ff4757';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Price Chart</CardTitle>
        <Tabs defaultValue="24h">
          <TabsList>
            <TabsTrigger value="1h">1H</TabsTrigger>
            <TabsTrigger value="24h">24H</TabsTrigger>
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="30d">30D</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => formatPrice(value)}
                dx={-10}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  padding: '12px',
                }}
                labelStyle={{ color: '#fff', fontWeight: 600, marginBottom: '4px' }}
                formatter={(value: number) => [formatPrice(value), 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Placeholder when no data
export function PriceChartPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Price Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p>Chart data loading...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
