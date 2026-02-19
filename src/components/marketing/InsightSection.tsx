import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Layers, Clock, AlertTriangle } from "lucide-react";

const InsightSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const painPoints = [
    {
      icon: Layers,
      stat: "12+",
      text: "Scattered data across disconnected tools",
    },
    {
      icon: Clock,
      stat: "Weeks",
      text: "Spent building pitch decks manually",
    },
    {
      icon: AlertTriangle,
      stat: "0%",
      text: "Clear picture of actual progress",
    },
  ];

  return (
    <section ref={ref} className="section-marketing-dark">
      <div className="container-marketing">
        <div className="max-w-4xl mx-auto">
          {/* Main Statement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="headline-lg text-white mb-4">
              Founders don't fail from lack of effort.
            </h2>
            <p className="text-2xl md:text-3xl font-display text-white/60">
              They fail from scattered execution.
            </p>
          </motion.div>

          {/* Pain Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {painPoints.map((point, index) => (
              <motion.div
                key={point.stat}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="marketing-card-dark text-center"
              >
                <div className="icon-container-dark mx-auto mb-4">
                  <point.icon className="w-5 h-5 text-sage" />
                </div>
                <div className="text-3xl font-display font-medium text-white mb-2">
                  {point.stat}
                </div>
                <p className="text-sm text-white/60">{point.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsightSection;
