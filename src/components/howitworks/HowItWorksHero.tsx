import { motion } from "framer-motion";
import { MessageSquare, Brain, LayoutDashboard, LineChart, TrendingUp } from "lucide-react";

const stages = [
  { icon: MessageSquare, label: "Strategy Session" },
  { icon: Brain, label: "Strategy Engine" },
  { icon: LayoutDashboard, label: "Daily Dashboard" },
  { icon: LineChart, label: "Analysis" },
  { icon: TrendingUp, label: "Fundraising Progress" },
];

const HowItWorksHero = () => {
  return (
    <section className="section-padding bg-background pt-32 md:pt-40">
      <div className="container-premium text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/10 border border-sage/20 mb-8"
        >
          <span className="text-sm font-medium text-sage tracking-wide uppercase">
            The Complete System
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-dark mb-6"
        >
          How StartupAI works
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-16"
        >
          From one strategy session to daily execution and fundraising momentum — all in one guided system.
        </motion.p>

        {/* Icon Strip - Journey Stages */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute top-6 left-[10%] right-[10%] h-px bg-border hidden md:block" />
          
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-8 md:gap-4">
            {stages.map((stage, index) => (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex flex-col items-center gap-3 flex-1 min-w-[120px]"
              >
                <div className="relative z-10 w-12 h-12 rounded-full bg-background border-2 border-sage/30 flex items-center justify-center">
                  <stage.icon className="w-5 h-5 text-sage" />
                </div>
                <span className="text-xs md:text-sm text-muted-foreground text-center font-medium">
                  {stage.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Arrow indicators between stages - desktop only */}
          <div className="hidden md:flex absolute top-6 left-[10%] right-[10%] justify-between px-[8%]">
            {[1, 2, 3, 4].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                className="text-sage/40"
              >
                →
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksHero;
