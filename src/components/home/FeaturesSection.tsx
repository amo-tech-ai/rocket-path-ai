import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Users, 
  FolderKanban, 
  FileText, 
  TrendingUp, 
  Sparkles, 
  Globe 
} from "lucide-react";

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Users,
      title: "Intelligent CRM",
      description: "Track relationships, deals, and interactions with AI-powered insights on who to reach out to and when.",
    },
    {
      icon: FolderKanban,
      title: "Projects & Tasks",
      description: "From strategic initiatives to daily todos, all connected in one coherent system.",
    },
    {
      icon: FileText,
      title: "Documents & Decks",
      description: "Create, store, and collaborate on pitch decks, memos, and strategic documents.",
    },
    {
      icon: TrendingUp,
      title: "Investor Pipeline",
      description: "Track investors, manage outreach, log meetings, and monitor your raise progress.",
    },
    {
      icon: Sparkles,
      title: "AI Insights",
      description: "Continuous analysis of your data to surface risks, opportunities, and next actions.",
    },
    {
      icon: Globe,
      title: "Website & Landing Pages",
      description: "Build your public presence with beautiful, conversion-optimized pages.",
    },
  ];

  return (
    <section ref={ref} className="section-padding">
      <div className="container-premium">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One unified platform replacing your scattered tool stack. Built for founders, 
            powered by AI.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 * (index + 1) }}
              className="group card-premium p-6 hover-lift"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-sage-light flex items-center justify-center mb-4 group-hover:bg-sage/20 transition-colors">
                <feature.icon className="w-6 h-6 text-sage" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
