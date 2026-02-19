import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Zap, Shield, Rocket } from "lucide-react";

const FeaturesOutcomes = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const outcomes = [
    {
      icon: Target,
      title: "Clear priorities",
      description: "Know exactly what matters each day.",
    },
    {
      icon: Zap,
      title: "Faster decisions",
      description: "Context at your fingertips, always.",
    },
    {
      icon: Shield,
      title: "Confident execution",
      description: "Move forward without second-guessing.",
    },
    {
      icon: Rocket,
      title: "Investor readiness",
      description: "Professional materials, instantly.",
    },
  ];

  return (
    <section ref={ref} className="section-marketing bg-secondary/30">
      <div className="container-marketing">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="headline-lg text-foreground">
            What founders gain
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {outcomes.map((outcome, index) => (
            <motion.div
              key={outcome.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
              className="marketing-card text-center group hover:border-primary/20"
            >
              <div className="icon-container mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                <outcome.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-display font-medium text-foreground mb-2">
                {outcome.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {outcome.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesOutcomes;
