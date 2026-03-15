import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Database, FileStack, Users, TrendingUp } from "lucide-react";

const TimelineSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const phases = [
    {
      icon: Database,
      weeks: "Weeks 1–2",
      title: "Foundation",
      items: ["Startup profile", "Data ingestion", "Benchmarking"],
    },
    {
      icon: FileStack,
      weeks: "Weeks 3–5",
      title: "Intelligence",
      items: ["Pitch deck", "Financial model", "Strategy reports"],
    },
    {
      icon: Users,
      weeks: "Weeks 6–7",
      title: "Fundraising",
      items: ["Investor CRM", "Outreach", "Pipeline tracking"],
    },
    {
      icon: TrendingUp,
      weeks: "Week 8+",
      title: "Momentum",
      items: ["Market engagement", "Negotiation", "Closing"],
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
          <p className="eyebrow-dark">Execution</p>
          <h2 className="headline-lg text-white mb-4">
            Profile to investor-ready in weeks.
          </h2>
        </motion.div>

        {/* Phase cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 * index }}
              className="marketing-card-dark h-full"
            >
              <div className="icon-container-dark mb-4">
                <phase.icon className="w-5 h-5 text-sage" />
              </div>
              <div className="text-xs font-medium text-sage mb-2">{phase.weeks}</div>
              <h3 className="text-lg font-display font-medium text-white mb-3">
                {phase.title}
              </h3>
              <ul className="space-y-1.5">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                    <span className="w-1 h-1 rounded-full bg-sage flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
