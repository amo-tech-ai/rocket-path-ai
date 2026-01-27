import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressItem {
  label: string;
  current: number;
  projected?: number;
  currentLabel?: string;
  projectedLabel?: string;
  suffix?: string;
}

interface ProgressComparisonProps {
  title: string;
  subtitle?: string;
  items: ProgressItem[];
}

const ProgressComparison = ({ title, subtitle, items }: ProgressComparisonProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-muted-foreground text-sm">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                {item.label}
              </span>
              <span className="font-display text-lg font-semibold text-primary">
                {item.projected ? `+${item.projected - item.current}` : item.current}{item.suffix || '%'}
              </span>
            </div>
            
            <div className="relative h-10 rounded-lg overflow-hidden bg-muted/30">
              {/* Current bar */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${item.current}%` }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className={cn(
                  "absolute inset-y-0 left-0 rounded-lg flex items-center justify-end px-3",
                  item.projected ? "bg-muted" : "bg-primary"
                )}
              >
                {item.currentLabel && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.currentLabel}
                  </span>
                )}
              </motion.div>
              
              {/* Projected bar (if exists) */}
              {item.projected && (
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.projected}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="absolute inset-y-0 left-0 bg-primary rounded-lg flex items-center justify-end px-3"
                >
                  {item.projectedLabel && (
                    <span className="text-xs font-medium text-primary-foreground">
                      {item.projectedLabel}
                    </span>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProgressComparison;
