import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, Rocket, FileCheck, Eye } from "lucide-react";

const OutcomesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const outcomes = [
    {
      icon: Clock,
      stat: "60%",
      title: "Time saved",
      description: "Two-thirds less time on operational overhead.",
    },
    {
      icon: Rocket,
      stat: "3x",
      title: "Faster fundraising",
      description: "From first conversation to term sheet in weeks.",
    },
    {
      icon: FileCheck,
      stat: "100%",
      title: "Investor-ready materials",
      description: "Polish and depth institutional investors expect.",
    },
    {
      icon: Eye,
      stat: "Total",
      title: "Complete clarity",
      description: "Always know what's next and where to focus.",
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
          <p className="eyebrow">Outcomes</p>
          <h2 className="headline-lg text-foreground">
            What you gain
          </h2>
        </motion.div>

        {/* Outcomes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {outcomes.map((outcome, index) => (
            <motion.div
              key={outcome.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
              className="marketing-card text-center"
            >
              <div className="icon-container mx-auto mb-4">
                <outcome.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-display font-medium text-foreground mb-1">
                {outcome.stat}
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
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

export default OutcomesSection;
