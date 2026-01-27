import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface HeatmapRow {
  segment: string;
  riskScore: {
    level: "high" | "medium" | "low";
    percentage: number;
  };
  primaryImpact: string;
  growthCatalyst: string;
}

interface HeatmapTableProps {
  title: string;
  subtitle?: string;
  rows: HeatmapRow[];
}

const HeatmapTable = ({ title, subtitle, rows }: HeatmapTableProps) => {
  const getRiskColor = (level: "high" | "medium" | "low") => {
    switch (level) {
      case "high":
        return "bg-red-500/10 text-red-700 border-red-500/30";
      case "medium":
        return "bg-amber-500/10 text-amber-700 border-amber-500/30";
      case "low":
        return "bg-green-500/10 text-green-700 border-green-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                Industry Segment
              </th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                Risk Score
              </th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                Primary Impact
              </th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                Growth Catalyst
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="border-b border-border last:border-0 bg-card hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-4">
                  <span className="font-medium text-foreground">{row.segment}</span>
                </td>
                <td className="px-4 py-4">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", getRiskColor(row.riskScore.level))}
                  >
                    {row.riskScore.level.charAt(0).toUpperCase() + row.riskScore.level.slice(1)} ({row.riskScore.percentage}%)
                  </Badge>
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {row.primaryImpact}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {row.growthCatalyst}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HeatmapTable;
