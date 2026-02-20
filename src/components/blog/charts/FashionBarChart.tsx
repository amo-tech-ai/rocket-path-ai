import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BarConfig {
  dataKey: string;
  color: string;
  label: string;
}

interface FashionBarChartProps {
  title: string;
  description?: string;
  source?: string;
  data: Array<Record<string, string | number>>;
  bars: BarConfig[];
  xAxisKey?: string;
  height?: number;
  layout?: "horizontal" | "vertical";
}

const TICK_STYLE = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: 11,
  fill: "#94a3b8",
};

const LABEL_STYLE = {
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: 10,
  fill: "#64748b",
};

const FashionBarChart = ({
  title,
  description,
  source,
  data,
  bars,
  xAxisKey = "name",
  height = 320,
  layout = "vertical",
}: FashionBarChartProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      {/* Chart header */}
      <div className="mb-6">
        <h4 className="font-display text-lg font-medium text-foreground">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            layout={layout}
            margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              strokeOpacity={0.5}
              horizontal={layout === "horizontal"}
              vertical={layout === "vertical"}
            />
            {layout === "vertical" ? (
              <>
                <XAxis type="number" tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey={xAxisKey}
                  tick={LABEL_STYLE}
                  axisLine={false}
                  tickLine={false}
                  width={140}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey={xAxisKey}
                  tick={LABEL_STYLE}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} />
              </>
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              cursor={{ fill: "hsl(var(--muted))", fillOpacity: 0.3 }}
            />
            <Legend
              wrapperStyle={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "11px",
                paddingTop: "12px",
              }}
            />
            {bars.map((bar) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                name={bar.label}
                fill={bar.color}
                radius={[2, 2, 0, 0]}
                animationDuration={800}
                animationEasing="ease-out"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Source caption */}
      {source && (
        <p className="text-[10px] text-muted-foreground/60 mt-3 font-mono">
          Source: {source}
        </p>
      )}
    </motion.div>
  );
};

export default FashionBarChart;
