import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Brain, LayoutDashboard, LineChart, TrendingUp } from "lucide-react";

const flowNodes = [
  { icon: MessageSquare, label: "Strategy Session", description: "Capture your vision" },
  { icon: Brain, label: "Strategy Engine", description: "AI processes context" },
  { icon: LayoutDashboard, label: "Daily View", description: "Clear priorities" },
  { icon: LineChart, label: "Analysis", description: "Smart decisions" },
  { icon: TrendingUp, label: "Fundraising", description: "Track momentum" },
];

const CompleteFlow = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-premium">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-dark">
            The complete flow
          </h2>
        </motion.div>

        {/* Flow Diagram - Desktop */}
        <div className="hidden md:block relative">
          {/* Connecting Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-sage/30 via-sage to-sage/30 origin-left"
          />

          <div className="flex justify-between items-start max-w-5xl mx-auto">
            {flowNodes.map((node, index) => (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                className="flex flex-col items-center text-center flex-1"
              >
                {/* Node Circle */}
                <div className="relative z-10 w-[120px] h-[120px] rounded-2xl bg-card border-2 border-sage/30 flex flex-col items-center justify-center shadow-premium-sm hover:border-sage hover:shadow-premium-md transition-all duration-300">
                  <node.icon className="w-8 h-8 text-sage mb-2" />
                  <span className="text-xs font-medium text-dark">{node.label}</span>
                </div>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground mt-4 max-w-[140px]">
                  {node.description}
                </p>

                {/* Arrow (except last) */}
                {index < flowNodes.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.15 }}
                    className="absolute top-[52px] text-sage text-2xl"
                    style={{ left: `calc(${(index + 1) * 20}% + 60px)` }}
                  >
                    →
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Flow Diagram - Mobile */}
        <div className="md:hidden space-y-4">
          {flowNodes.map((node, index) => (
            <motion.div
              key={node.label}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center flex-shrink-0">
                  <node.icon className="w-6 h-6 text-sage" />
                </div>
                <div>
                  <h4 className="font-semibold text-dark">{node.label}</h4>
                  <p className="text-sm text-muted-foreground">{node.description}</p>
                </div>
              </div>
              
              {/* Vertical connector */}
              {index < flowNodes.length - 1 && (
                <div className="absolute left-10 top-full w-0.5 h-4 bg-sage/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompleteFlow;
