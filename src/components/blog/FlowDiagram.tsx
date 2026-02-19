import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";

interface FlowStep {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface FlowDiagramProps {
  steps: FlowStep[];
  direction?: "horizontal" | "vertical";
  title?: string;
}

const FlowDiagram = ({ steps, direction = "horizontal", title }: FlowDiagramProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const Arrow = direction === "horizontal" ? ArrowRight : ArrowDown;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-card rounded-xl border border-border p-6 md:p-8"
    >
      {title && (
        <h4 className="font-display text-lg font-medium text-foreground mb-6">
          {title}
        </h4>
      )}
      
      <div className={`flex ${direction === "horizontal" ? "flex-row flex-wrap justify-center items-center gap-4" : "flex-col gap-4"}`}>
        {steps.map((step, index) => (
          <div key={index} className={`flex ${direction === "horizontal" ? "items-center" : "flex-col"} gap-4`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.15, ease: "easeOut" }}
              className="relative bg-sage-light rounded-lg p-4 md:p-5 min-w-[140px] text-center"
            >
              {step.icon && (
                <div className="flex justify-center mb-2 text-primary">
                  {step.icon}
                </div>
              )}
              <p className="font-medium text-foreground text-sm md:text-base">
                {step.title}
              </p>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              )}
            </motion.div>
            
            {index < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
              >
                <Arrow className="w-5 h-5 text-primary/40" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FlowDiagram;
