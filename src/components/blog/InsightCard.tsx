import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface InsightCardProps {
  title: string;
  stat?: string;
  description: string;
  source?: string;
  type?: "measured" | "projected" | "estimated";
  index?: number;
}

const InsightCard = ({ 
  title, 
  stat, 
  description, 
  source, 
  type = "measured",
  index = 0 
}: InsightCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const typeStyles = {
    measured: { dot: "bg-primary" },
    projected: { dot: "bg-amber-500" },
    estimated: { dot: "bg-muted-foreground" }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className="bg-card rounded-xl border border-border p-6 hover:border-primary/20 transition-colors duration-200"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className={`w-2 h-2 rounded-full ${typeStyles[type].dot} mt-2 flex-shrink-0`} />
        <h3 className="font-display text-lg font-medium text-foreground leading-snug">
          {title}
        </h3>
      </div>
      
      {stat && (
        <p className="text-2xl font-display font-semibold text-primary mb-2 pl-5">
          {stat}
        </p>
      )}
      
      <p className="text-sm text-muted-foreground leading-relaxed pl-5">
        {description}
      </p>
      
      {source && (
        <p className="text-[10px] text-muted-foreground/60 mt-3 pl-5 font-mono">
          Source: {source}
        </p>
      )}
    </motion.div>
  );
};

export default InsightCard;
