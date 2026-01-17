import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Users, Brain, AlertTriangle, BarChart3, FileText } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Intelligent Prioritization",
    description: "Ranks tasks based on your goals and deadlines",
  },
  {
    icon: Users,
    title: "Investor Pipeline",
    description: "Tracks conversations, meetings, and follow-ups",
  },
  {
    icon: Brain,
    title: "Strategic Analysis",
    description: "Answers questions grounded in your data",
  },
  {
    icon: AlertTriangle,
    title: "Risk Detection",
    description: "Flags issues before they slow momentum",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Shows completion across all workstreams",
  },
  {
    icon: FileText,
    title: "Document Generation",
    description: "Creates decks and briefs from your profile",
  },
];

const FeaturesGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-secondary/30">
      <div className="container-premium">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-widest text-sage uppercase mb-4 block">
            Features
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-dark mb-4">
            Everything you need to build and raise
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + (Math.floor(index / 3) * 0.15) + (index % 3) * 0.05 }}
              className="group p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-sage/30 hover:shadow-premium-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center mb-5 group-hover:bg-sage/20 transition-colors">
                <feature.icon className="w-6 h-6 text-sage" />
              </div>
              <h3 className="font-semibold text-dark text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
