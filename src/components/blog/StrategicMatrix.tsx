import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Quadrant {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  highlighted?: boolean;
}

interface StrategicMatrixProps {
  title: string;
  subtitle?: string;
  xAxisLabel: { low: string; high: string };
  yAxisLabel: { low: string; high: string };
  quadrants: [Quadrant, Quadrant, Quadrant, Quadrant]; // TL, TR, BL, BR
}

const StrategicMatrix = ({ 
  title, 
  subtitle, 
  xAxisLabel, 
  yAxisLabel, 
  quadrants 
}: StrategicMatrixProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-8 md:p-12"
      >
        {/* Y-axis labels */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 hidden md:block">
          <div className="flex flex-col items-center gap-24 text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="-rotate-90 whitespace-nowrap">{yAxisLabel.high}</span>
            <span className="-rotate-90 whitespace-nowrap">{yAxisLabel.low}</span>
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-24 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>{xAxisLabel.low}</span>
          <span>{xAxisLabel.high}</span>
        </div>
        
        {/* Top label */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-muted-foreground">
          {yAxisLabel.high}
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 relative">
          {/* Axis lines */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />
          
          {quadrants.map((quad, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className={cn(
                "aspect-square flex flex-col items-center justify-center p-4 md:p-6 rounded-xl text-center transition-all duration-300",
                quad.highlighted 
                  ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                  : "bg-card/50 hover:bg-card"
              )}
            >
              {quad.icon && (
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                  quad.highlighted ? "bg-primary-foreground/20" : "bg-muted"
                )}>
                  <quad.icon className={cn(
                    "w-5 h-5",
                    quad.highlighted ? "text-primary-foreground" : "text-muted-foreground"
                  )} />
                </div>
              )}
              <h4 className={cn(
                "font-display font-semibold text-sm md:text-base",
                quad.highlighted ? "text-primary-foreground" : "text-foreground"
              )}>
                {quad.title}
              </h4>
              {quad.subtitle && (
                <p className={cn(
                  "text-xs mt-1",
                  quad.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {quad.subtitle}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default StrategicMatrix;
