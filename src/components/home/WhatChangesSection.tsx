import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, X } from "lucide-react";

const WhatChangesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const comparisons = [
    {
      before: "Scattered across 12+ tools",
      after: "Single source of truth",
    },
    {
      before: "Unclear daily priorities",
      after: "AI-generated focus list",
    },
    {
      before: "Strategy lost in execution",
      after: "Vision always connected to tasks",
    },
    {
      before: "Manual status updates",
      after: "Automatic progress tracking",
    },
    {
      before: "Blind spots and surprises",
      after: "Early risk detection",
    },
  ];

  return (
    <section ref={ref} className="section-padding bg-primary text-primary-foreground">
      <div className="container-premium">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              What Changes
            </h2>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              From chaos to clarity. From scattered to focused. From guessing to knowing.
            </p>
          </motion.div>

          {/* Comparison grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-primary-foreground/50" />
                </div>
                <span className="text-sm font-medium text-primary-foreground/50 uppercase tracking-wider">Before</span>
              </div>
              {comparisons.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10"
                >
                  <p className="text-primary-foreground/60">{item.before}</p>
                </div>
              ))}
            </motion.div>

            {/* After */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-sage uppercase tracking-wider">After StartupAI</span>
              </div>
              {comparisons.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-sage/20 border border-sage/30"
                >
                  <p className="text-primary-foreground">{item.after}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatChangesSection;
