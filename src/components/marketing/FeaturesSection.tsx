import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, LayoutGrid, Zap, Target, BarChart3, Presentation } from "lucide-react";

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: ShieldCheck,
      title: "AI Startup Validator",
      description: "Run a 7-agent analysis that scores problem fit, market realism, revenue strength, risk exposure, and execution feasibility.",
    },
    {
      icon: LayoutGrid,
      title: "AI Lean Canvas Builder",
      description: "Auto-generate and refine your 9-block business model from validated data. Every box connects to strategy, financials, and your pitch.",
    },
    {
      icon: Zap,
      title: "Strategic Intelligence Engine",
      description: "Get dimension-level scores, bottleneck detection, and priority actions. The system tells you where your startup is weak — and what to do next.",
    },
    {
      icon: Target,
      title: "MVP & Execution Planning",
      description: "Turn validation insights into sprint-ready tasks. Design experiments, define scope, and move from idea to shipped product.",
    },
    {
      icon: BarChart3,
      title: "Live Financial Modeling",
      description: "Model revenue, burn, runway, and unit economics based on your real assumptions. Update the canvas — projections adjust instantly.",
    },
    {
      icon: Presentation,
      title: "Investor-Ready Pitch Decks",
      description: "Generate a structured, defensible deck directly from your validated strategy. No fluff. Every slide traces back to evidence.",
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
          <p className="eyebrow">CAPABILITIES</p>
          <h2 className="headline-lg text-foreground mb-4">
            From Idea to Investor-Ready
          </h2>
          <p className="body-lg max-w-2xl mx-auto mb-4">
            AI validation, strategy, and execution — in one system.
          </p>
          <p className="body-md max-w-2xl mx-auto text-muted-foreground">
            Built for founders who want clarity, proof, and momentum — not generic AI output.
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
