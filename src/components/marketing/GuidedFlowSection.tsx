import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, Wand2, LayoutGrid, Target, Rocket, Users, ArrowRight } from "lucide-react";

const steps = [
  { icon: Lightbulb, label: "Idea", color: "bg-accent/20 text-accent-foreground" },
  { icon: Wand2, label: "Startup Wizard", color: "bg-primary/10 text-primary" },
  { icon: LayoutGrid, label: "Lean Canvas", color: "bg-sage/10 text-sage" },
  { icon: Target, label: "Strategy + Pitch Deck", color: "bg-primary/10 text-primary" },
  { icon: Rocket, label: "Execution", color: "bg-sage/10 text-sage" },
  { icon: Users, label: "CRM", color: "bg-accent/20 text-accent-foreground" },
];

const GuidedFlowSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-marketing bg-secondary/30">
      <div className="container-marketing">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="eyebrow">Your Path Forward</p>
          <h2 className="headline-lg text-foreground">
            One flow, idea to traction.
          </h2>
        </motion.div>

        {/* Desktop Flowchart — horizontal */}
        <div className="hidden md:flex items-center justify-center gap-3 lg:gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.label}
              className="flex items-center gap-3 lg:gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
            >
              {/* Step block */}
              <div className={`flex flex-col items-center gap-2 px-4 py-5 rounded-xl border border-border ${step.color} min-w-[100px] lg:min-w-[120px]`}>
                <step.icon className="w-6 h-6" />
                <span className="text-xs lg:text-sm font-medium text-center leading-tight">
                  {step.label}
                </span>
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile Flowchart — vertical */}
        <div className="md:hidden max-w-xs mx-auto">
          <div className="relative">
            {/* Vertical connector */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

            {steps.map((step, index) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                className="relative flex items-center gap-4 pb-6 last:pb-0"
              >
                <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-xl ${step.color} flex items-center justify-center`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-foreground">{step.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidedFlowSection;
