import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface DeckActivityProps {
  data?: Array<{
    month: string;
    drafts: number;
    visuals: number;
  }>;
}

const defaultData = [
  { month: 'May', drafts: 4, visuals: 2 },
  { month: 'Jun', drafts: 6, visuals: 4 },
  { month: 'Jul', drafts: 8, visuals: 5 },
  { month: 'Aug', drafts: 5, visuals: 3 },
];

export function DeckActivity({ data = defaultData }: DeckActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="card-premium p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Deck Activity</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground" />
            <span className="text-muted-foreground">Drafts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Visuals</span>
          </div>
        </div>
      </div>

      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(220 10% 45%)' }}
              dy={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0 0% 100%)',
                border: '1px solid hsl(30 15% 90%)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar 
              dataKey="drafts" 
              fill="hsl(220 10% 45%)" 
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
            <Bar 
              dataKey="visuals" 
              fill="hsl(0 72% 51%)" 
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}