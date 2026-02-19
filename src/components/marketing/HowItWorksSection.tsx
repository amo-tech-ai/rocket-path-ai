import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Share2, Sparkles, Rocket } from "lucide-react";

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "01",
      icon: Share2,
      title: "You share your vision",
      description: "Connect data sources and answer strategic questions. We gather context about your startup, market, and goals.",
    },
    {
      number: "02",
      icon: Sparkles,
      title: "We build your intelligence layer",
      description: "AI analyzes your market, competition, and opportunities to generate custom insights and materials.",
    },
    {
      number: "03",
      icon: Rocket,
      title: "You execute with clarity",
      description: "Daily guidance, investor-ready materials, and progress tracking—all in one focused dashboard.",
    },
  ];

  return (
    <section 
      ref={ref} 
      id="how-it-works"
      className="section-marketing bg-secondary/30"
    >
      <div className="container-marketing">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="eyebrow">Your Guided Path</p>
          <h2 className="headline-lg text-foreground">How StartupAI works</h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
              className="text-center relative"
            >
              {/* Connector line (hidden on mobile) */}
              {index < 2 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px border-t-2 border-dashed border-border" />
              )}

              {/* Icon */}
              <div className="icon-container mx-auto mb-6">
                <step.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Number */}
              <div className="text-xs font-medium text-primary mb-3">{step.number}</div>

              {/* Title */}
              <h3 className="text-xl font-display font-medium text-foreground mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="body-md max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
