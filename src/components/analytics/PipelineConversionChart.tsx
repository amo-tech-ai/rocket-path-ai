import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { PipelineConversion } from "@/hooks/useAnalytics";

interface PipelineConversionChartProps {
  data: PipelineConversion[] | undefined;
  loading?: boolean;
  fullWidth?: boolean;
}

const STAGE_COLORS: Record<string, string> = {
  Lead: 'hsl(var(--muted-foreground))',
  Qualified: 'hsl(210 100% 50%)',
  Proposal: 'hsl(45 100% 50%)',
  Negotiation: 'hsl(30 100% 50%)',
  Closed: 'hsl(var(--primary))',
};

export function PipelineConversionChart({ data, loading, fullWidth }: PipelineConversionChartProps) {
  if (loading) {
    return (
      <Card className={fullWidth ? 'col-span-full' : ''}>
        <CardHeader>
          <CardTitle>Pipeline Conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data || [];
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const totalDeals = chartData.reduce((sum, item) => sum + item.count, 0);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <Card className={fullWidth ? 'col-span-full' : ''}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Pipeline Conversion</CardTitle>
        <div className="text-right">
          <p className="text-sm font-medium">{formatCurrency(totalValue)}</p>
          <p className="text-xs text-muted-foreground">{totalDeals} deals</p>
        </div>
      </CardHeader>
      <CardContent>
        {totalDeals === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No deals in pipeline
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="stage" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'value') return formatCurrency(value);
                  return value;
                }}
              />
              <Bar dataKey="count" name="Deals" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STAGE_COLORS[entry.stage] || 'hsl(var(--primary))'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
