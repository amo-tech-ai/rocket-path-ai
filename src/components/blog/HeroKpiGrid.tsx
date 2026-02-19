import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HeroKpi {
  value: string;
  label: string;
  sublabel?: string;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
}

interface HeroKpiGridProps {
  kpis: HeroKpi[];
  variant?: "grid" | "stack";
}

const HeroKpiGrid = ({ kpis, variant = "grid" }: HeroKpiGridProps) => {
  if (variant === "stack") {
    return (
      <div className="space-y-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center gap-3">
              {kpi.icon && (
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <kpi.icon className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {kpi.label}
                </p>
                {kpi.sublabel && (
                  <p className="text-[10px] text-muted-foreground">
                    {kpi.sublabel}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-semibold text-foreground">
                {kpi.value}
              </p>
              {kpi.trend && (
                <p className={cn(
                  "text-xs",
                  kpi.trendType === "positive" && "text-green-600",
                  kpi.trendType === "negative" && "text-red-600",
                  kpi.trendType === "neutral" && "text-muted-foreground"
                )}>
                  {kpi.trend}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {kpis.map((kpi, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
          className={cn(
            "p-4 md:p-5 rounded-xl bg-card border border-border",
            index === 0 && "col-span-1",
            index === 1 && "col-span-1"
          )}
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
            {kpi.label}
          </p>
          <p className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            {kpi.value}
          </p>
          {kpi.sublabel && (
            <p className="text-xs text-muted-foreground mt-1">
              {kpi.sublabel}
            </p>
          )}
          {kpi.trend && (
            <p className={cn(
              "text-xs mt-1",
              kpi.trendType === "positive" && "text-green-600",
              kpi.trendType === "negative" && "text-red-600"
            )}>
              {kpi.trend}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default HeroKpiGrid;
