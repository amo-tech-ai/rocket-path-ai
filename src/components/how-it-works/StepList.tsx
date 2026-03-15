import { motion } from "framer-motion";

interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Startup Wizard",
    description: "Answer guided questions about your idea, market, and goals.",
  },
  {
    number: 2,
    title: "AI Validation",
    description: "7-agent analysis scores your idea across 5 dimensions.",
  },
  {
    number: 3,
    title: "Lean Canvas",
    description: "Auto-generate your 9-block business model from validated data.",
  },
  {
    number: 4,
    title: "Strategy + Pitch Deck",
    description: "Investor-ready materials built from your validated strategy.",
  },
  {
    number: 5,
    title: "Execution + CRM",
    description: "Daily tasks, investor pipeline, and progress tracking.",
  },
];

interface StepListProps {
  activeStep: number;
}

const StepList = ({ activeStep }: StepListProps) => {
  return (
    <div className="space-y-4">
      {steps.map((step) => {
        const isActive = step.number === activeStep;
        
        return (
          <motion.div
            key={step.number}
            className={`relative transition-all duration-300 ${
              isActive ? 'opacity-100' : 'opacity-40'
            }`}
            aria-current={isActive ? 'step' : undefined}
          >
            <div className="flex items-start gap-3">
              {/* Step number and indicator */}
              <div className="flex items-center gap-2 min-w-[60px]">
                <span className={`text-lg font-medium transition-colors duration-300 ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.number}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-2 h-2 rounded-full bg-sage"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              
              {/* Title and description */}
              <div className="flex-1">
                <h3 className={`text-lg transition-all duration-300 ${
                  isActive ? 'font-semibold text-foreground' : 'font-normal text-muted-foreground'
                }`}>
                  {step.title}
                </h3>
                <motion.p
                  className="text-sm text-muted-foreground mt-1 leading-relaxed"
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0.6,
                    height: isActive ? 'auto' : '0',
                    marginTop: isActive ? 4 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  {step.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StepList;
