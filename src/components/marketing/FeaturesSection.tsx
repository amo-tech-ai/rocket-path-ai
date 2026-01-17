import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, LineChart, Brain, Users, Workflow, Shield } from "lucide-react";

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: FileText,
      title: "Instant pitch materials",
      description: "Generate investor-ready decks, one-pagers, and memos in minutes, not weeks.",
    },
    {
      icon: LineChart,
      title: "Live financial models",
      description: "Dynamic projections that update with your actual metrics and market data.",
    },
    {
      icon: Brain,
      title: "Strategic intelligence",
      description: "AI-powered insights on market positioning, competition, and opportunities.",
    },
    {
      icon: Users,
      title: "Investor pipeline",
      description: "Track conversations, manage follow-ups, and close rounds efficiently.",
    },
    {
      icon: Workflow,
      title: "Guided workflows",
      description: "Step-by-step processes for every stage from ideation to exit.",
    },
    {
      icon: Shield,
      title: "Secure & private",
      description: "Enterprise-grade security with SOC 2 compliance. Your data stays yours.",
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
          <p className="eyebrow">Capabilities</p>
          <h2 className="headline-lg text-foreground mb-4">
            Everything you need to move fast
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Built for founders who need clarity, speed, and investor confidence.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
              className="marketing-card group"
            >
              <div className="icon-container mb-4 group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-display font-medium text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="body-md">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
