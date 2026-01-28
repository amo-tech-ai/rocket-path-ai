import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { InvestorEngagement } from "@/hooks/useAnalytics";

interface InvestorEngagementChartProps {
  data: InvestorEngagement[] | undefined;
  loading?: boolean;
  fullWidth?: boolean;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(210 100% 50%)',
  'hsl(45 100% 50%)',
  'hsl(280 100% 50%)',
  'hsl(var(--muted-foreground))',
  'hsl(160 100% 40%)',
];

export function InvestorEngagementChart({ data, loading, fullWidth }: InvestorEngagementChartProps) {
  if (loading) {
    return (
      <Card className={fullWidth ? 'col-span-full' : ''}>
        <CardHeader>
          <CardTitle>Investor Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data || [];
  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className={fullWidth ? 'col-span-full' : ''}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Investor Engagement</CardTitle>
        <span className="text-sm text-muted-foreground">{total} investors</span>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No investor data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="count"
                nameKey="status"
              >
                {chartData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
