import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Award, Target } from "lucide-react";

const ValuePillarsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const pillars = [
    {
      icon: Zap,
      title: "10x faster than manual",
      description: "What took weeks now happens in hours. AI handles the heavy lifting while you focus on strategy.",
    },
    {
      icon: Award,
      title: "Investor-grade quality",
      description: "Materials that meet institutional standards from day one. No more amateur-hour decks.",
    },
    {
      icon: Target,
      title: "One source of truth",
      description: "Everything in one place. No more scattered tools, no more context switching.",
    },
  ];

  return (
    <section ref={ref} className="section-marketing">
      <div className="container-marketing">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="eyebrow">Why Founders Choose StartupAI</p>
          <h2 className="headline-lg text-foreground">
            Built for speed, designed for confidence.
          </h2>
        </motion.div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-sage-light mx-auto mb-6 flex items-center justify-center">
                <pillar.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-medium text-foreground mb-3">
                {pillar.title}
              </h3>
              <p className="body-md max-w-sm mx-auto">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePillarsSection;
