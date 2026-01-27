import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Pillar {
  number: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

interface NumberedPillarsProps {
  title?: string;
  subtitle?: string;
  pillars: Pillar[];
  variant?: "default" | "compact";
}

const NumberedPillars = ({ title, subtitle, pillars, variant = "default" }: NumberedPillarsProps) => {
  return (
    <div className="space-y-10">
      {title && (
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
      )}
      
      <div className={cn(
        "grid gap-6",
        pillars.length === 3 && "md:grid-cols-3",
        pillars.length === 4 && "md:grid-cols-2 lg:grid-cols-4",
        pillars.length === 2 && "md:grid-cols-2"
      )}>
        {pillars.map((pillar, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className={cn(
              "relative rounded-xl border border-border bg-card p-6 md:p-8",
              variant === "compact" && "p-5"
            )}
          >
            {/* Large number */}
            <div className="mb-6">
              <span className="font-display text-5xl md:text-6xl font-light text-muted-foreground/30">
                {pillar.number}
              </span>
            </div>
            
            {/* Icon (optional) */}
            {pillar.icon && (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <pillar.icon className="w-5 h-5 text-primary" />
              </div>
            )}
            
            {/* Title */}
            <h4 className="font-display text-lg font-semibold text-foreground mb-3">
              {pillar.title}
            </h4>
            
            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              {pillar.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NumberedPillars;
