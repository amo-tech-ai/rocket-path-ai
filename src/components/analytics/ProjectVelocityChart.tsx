import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { ProjectVelocity } from "@/hooks/useAnalytics";

interface ProjectVelocityChartProps {
  data: ProjectVelocity[] | undefined;
  loading?: boolean;
  fullWidth?: boolean;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--muted-foreground))',
];

export function ProjectVelocityChart({ data, loading, fullWidth }: ProjectVelocityChartProps) {
  if (loading) {
    return (
      <Card className={fullWidth ? 'col-span-full' : ''}>
        <CardHeader>
          <CardTitle>Project Velocity</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data?.map(item => ({
    name: item.name,
    value: item.active + item.completed,
    active: item.active,
    completed: item.completed,
  })) || [];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={fullWidth ? 'col-span-full' : ''}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Project Velocity</CardTitle>
        <span className="text-sm text-muted-foreground">{total} total</span>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 || total === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No project data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
