import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface KpiCardProps {
  value: string;
  label: string;
  source?: string;
  type?: "measured" | "projected" | "estimated";
  delay?: number;
  size?: "sm" | "md" | "lg";
}

const KpiCard = ({ 
  value, 
  label, 
  source, 
  type = "measured", 
  delay = 0,
  size = "md" 
}: KpiCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(value);
  
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;
    
    // Extract numeric value for count-up animation
    const numericMatch = value.match(/^([€$£]?)(\d+(?:\.\d+)?)(M|B|K|%|\+|×)?/);
    if (!numericMatch) return;
    
    const prefix = numericMatch[1] || '';
    const targetNum = parseFloat(numericMatch[2]);
    const suffix = numericMatch[3] || '';
    const restOfValue = value.slice(numericMatch[0].length);
    
    let startTime: number;
    const duration = 800;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = targetNum * eased;
      
      // Format based on original value
      let formatted: string;
      if (value.includes('.')) {
        formatted = currentValue.toFixed(1);
      } else {
        formatted = Math.round(currentValue).toString();
      }
      
      setDisplayValue(`${prefix}${formatted}${suffix}${restOfValue}`);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay * 1000);
    
    return () => clearTimeout(timeoutId);
  }, [isInView, value, delay, prefersReducedMotion]);

  const sizeClasses = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl"
  };

  const typeStyles = {
    measured: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
    projected: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
    estimated: { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: delay, ease: "easeOut" }}
      className="relative"
    >
      <div className="flex items-baseline gap-3 mb-1">
        <span className={`${sizeClasses[size]} font-display font-semibold text-foreground tracking-tight`}>
          {displayValue}
        </span>
        <Badge 
          variant="outline" 
          className={`${typeStyles[type].bg} ${typeStyles[type].text} border-0 text-[10px] font-medium uppercase tracking-wider`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${typeStyles[type].dot} mr-1.5`} />
          {type}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{label}</p>
      {source && (
        <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">{source}</p>
      )}
    </motion.div>
  );
};

export default KpiCard;
