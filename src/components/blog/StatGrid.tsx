import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import KpiCard from "./KpiCard";

interface StatItem {
  value: string;
  label: string;
  type?: "measured" | "projected" | "estimated";
}

interface StatGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  title?: string;
}

const StatGrid = ({ stats, columns = 4, title }: StatGridProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {title && (
        <h3 className="font-display text-xl font-medium text-foreground mb-6">
          {title}
        </h3>
      )}
      
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-card rounded-xl border border-border p-6 hover:border-primary/20 transition-colors"
          >
            <KpiCard
              value={stat.value}
              label={stat.label}
              type={stat.type}
              delay={index * 0.1}
              size="sm"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default StatGrid;
