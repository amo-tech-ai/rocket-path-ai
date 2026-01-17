import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Database, FileStack, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const TimelineSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const phases = [
    {
      icon: Database,
      weeks: "Weeks 1-2",
      title: "Profile & Foundation",
      description: "Secure data ingestion, startup profile setup, and initial benchmarking.",
    },
    {
      icon: FileStack,
      weeks: "Weeks 3-5",
      title: "Intelligence & Materials",
      description: "Generate pitch decks, financial models, and strategic reports.",
    },
    {
      icon: Users,
      weeks: "Weeks 6-7",
      title: "Fundraising Workflow",
      description: "Investor outreach, CRM integration, and pipeline management.",
    },
    {
      icon: TrendingUp,
      weeks: "Week 8+",
      title: "Execution & Momentum",
      description: "Market engagement, negotiation support, and closing rounds.",
    },
  ];

  return (
    <section ref={ref} className="section-marketing-dark overflow-hidden">
      <div className="container-marketing">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="eyebrow-dark">The StartupAI System</p>
          <h2 className="headline-lg text-white mb-4">
            Go from profile to investor-ready—fast.
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Our 4-phase guided workflow transforms your vision into a scalable, 
            high-performance startup infrastructure.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line - hidden on mobile */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "100%" } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-sage/50"
            />
          </div>

          {/* Phase cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.15 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="hidden lg:flex absolute -top-[33px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-sage border-4 border-[hsl(220,20%,12%)]" />

                <div className="marketing-card-dark h-full">
                  <div className="icon-container-dark mb-4">
                    <phase.icon className="w-5 h-5 text-sage" />
                  </div>
                  <div className="text-xs font-medium text-sage mb-2">{phase.weeks}</div>
                  <h3 className="text-lg font-display font-medium text-white mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-sm text-white/60">{phase.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Explore the full roadmap
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TimelineSection;
