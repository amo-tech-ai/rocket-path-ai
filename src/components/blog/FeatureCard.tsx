import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface FeatureCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  stats?: { value: string; label: string }[];
  index?: number;
}

const FeatureCard = ({ icon, title, description, stats, index = 0 }: FeatureCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className="bg-card rounded-xl border border-border p-6 hover:border-primary/20 hover:shadow-premium-sm transition-all duration-200"
    >
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-sage-light flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
      )}
      
      <h4 className="font-display text-lg font-medium text-foreground mb-2">
        {title}
      </h4>
      
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      
      {stats && stats.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          {stats.map((stat, i) => (
            <div key={i} className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <span className="font-display font-semibold text-primary">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FeatureCard;
