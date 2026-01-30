/**
 * Conversion Tracking Chart
 * Visualizes funnel conversions across key metrics
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Filter } from 'lucide-react';

interface ConversionStage {
  name: string;
  value: number;
  fill?: string;
  conversionRate?: number;
}

interface ConversionTrackingChartProps {
  data?: ConversionStage[];
  loading?: boolean;
  title?: string;
  type?: 'funnel' | 'bar';
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

export function ConversionTrackingChart({ 
  data,
  loading = false,
  title = "Investor Pipeline Conversion",
  type = 'funnel'
}: ConversionTrackingChartProps) {
  const defaultData: ConversionStage[] = [
    { name: 'Leads', value: 150 },
    { name: 'Contacted', value: 85 },
    { name: 'Meeting Scheduled', value: 42 },
    { name: 'Pitch Delivered', value: 28 },
    { name: 'Term Sheet', value: 8 }
  ];

  const displayData = data || defaultData;

  // Calculate conversion rates
  const dataWithRates = displayData.map((stage, index) => ({
    ...stage,
    fill: COLORS[index % COLORS.length],
    conversionRate: index > 0 
      ? Math.round((stage.value / displayData[index - 1].value) * 100)
      : 100
  }));

  const overallConversion = Math.round(
    (displayData[displayData.length - 1].value / displayData[0].value) * 100
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    
    const data = payload[0].payload;
    return (
      <div className="bg-popover border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          Count: <span className="font-medium text-foreground">{data.value}</span>
        </p>
        {data.conversionRate !== 100 && (
          <p className="text-sm text-muted-foreground">
            Conversion: <span className="font-medium text-foreground">{data.conversionRate}%</span>
          </p>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              {title}
            </CardTitle>
            <CardDescription>
              Track conversion rates through your pipeline
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            {overallConversion}% overall
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[300px]"
        >
          {type === 'funnel' ? (
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip content={<CustomTooltip />} />
                <Funnel
                  dataKey="value"
                  data={dataWithRates}
                  isAnimationActive
                >
                  <LabelList 
                    position="right" 
                    fill="hsl(var(--foreground))"
                    stroke="none"
                    dataKey="name"
                    className="text-sm"
                  />
                  <LabelList
                    position="center"
                    fill="white"
                    stroke="none"
                    dataKey="value"
                    className="text-sm font-medium"
                  />
                  {dataWithRates.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataWithRates} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {dataWithRates.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Conversion rate breakdown */}
        <div className="mt-4 flex flex-wrap gap-2">
          {dataWithRates.slice(1).map((stage, index) => (
            <Badge key={stage.name} variant="outline" className="text-xs">
              {dataWithRates[index].name} → {stage.name}: {stage.conversionRate}%
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ConversionTrackingChart;
