'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { AccessLog } from '@/lib/types';

interface AccessTrendsChartProps {
  logs: AccessLog[];
}

const chartConfig = {
  granted: {
    label: 'Granted',
    color: 'hsl(var(--chart-2))',
  },
  denied: {
    label: 'Denied',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function AccessTrendsChart({ logs }: AccessTrendsChartProps) {
  const chartData = React.useMemo(() => {
    if (!logs) return [];

    const dailyData: { [key: string]: { granted: number; denied: number } } = {};

    logs.forEach(log => {
      if (!log.timestamp) return;
      const date = format(log.timestamp.toDate(), 'yyyy-MM-dd');
      if (!dailyData[date]) {
        dailyData[date] = { granted: 0, denied: 0 };
      }
      if (log.access === 'granted') {
        dailyData[date].granted += 1;
      } else if (log.access === 'denied') {
        dailyData[date].denied += 1;
      }
    });

    return Object.keys(dailyData)
      .map(date => ({
        date,
        granted: dailyData[date].granted,
        denied: dailyData[date].denied,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [logs]);

  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Access Trends</CardTitle>
        <CardDescription>Daily summary of granted and denied access events.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => format(new Date(value), 'MMM d')}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="granted" stackId="a" fill="var(--color-granted)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="denied" stackId="a" fill="var(--color-denied)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
