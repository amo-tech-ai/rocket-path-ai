import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const GuidedFlowSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "01",
      title: "Answer strategic questions about your vision",
      description: "Define your market, model, and milestones through guided prompts.",
    },
    {
      number: "02",
      title: "AI builds your intelligence layer and materials",
      description: "Generate decks, models, and reports tailored to your startup.",
    },
    {
      number: "03",
      title: "Review, refine, and customize your outputs",
      description: "Fine-tune every element to match your voice and strategy.",
    },
    {
      number: "04",
      title: "Launch outreach and track investor momentum",
      description: "Manage your pipeline and close your round with confidence.",
    },
  ];

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
            One guided flow, start to finish.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border" />

            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 * (index + 1) }}
                className="relative flex gap-6 md:gap-8 pb-12 last:pb-0"
              >
                {/* Number circle */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <span className="text-lg md:text-xl font-display font-medium">{step.number}</span>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2 md:pt-4">
                  <h3 className="text-lg md:text-xl font-display font-medium text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="body-md">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidedFlowSection;
