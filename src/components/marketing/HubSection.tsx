import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Compass, ListTodo, Users, BarChart3, Globe } from "lucide-react";

const HubSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const nodes = [
    { icon: Compass, label: "Strategy & Vision", position: "top" },
    { icon: ListTodo, label: "Tasks & Execution", position: "right" },
    { icon: Users, label: "Investor Relations", position: "bottom-right" },
    { icon: BarChart3, label: "Progress Tracking", position: "bottom-left" },
    { icon: Globe, label: "Market Intelligence", position: "left" },
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
          <p className="eyebrow">Centralized Intelligence</p>
          <h2 className="headline-lg text-foreground mb-4">
            Everything flows through one system.
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Stop juggling tools. Start operating from a unified command center.
          </p>
        </motion.div>

        {/* Hub Diagram - Desktop */}
        <div className="hidden md:block relative max-w-2xl mx-auto aspect-square">
          {/* Center circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-primary flex items-center justify-center z-10"
          >
            <span className="text-xl font-display font-medium text-primary-foreground">StartupAI</span>
          </motion.div>

          {/* Connecting lines and nodes */}
          {nodes.map((node, index) => {
            const angle = (index * 72 - 90) * (Math.PI / 180);
            const radius = 180;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={node.label}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              >
                {/* Line to center */}
                <div
                  className="absolute top-1/2 left-1/2 h-px bg-border -z-10"
                  style={{
                    width: `${radius - 80}px`,
                    transformOrigin: "left center",
                    transform: `rotate(${angle + Math.PI}rad)`,
                  }}
                />

                {/* Node */}
                <div className="w-28 h-28 rounded-xl bg-card border border-border flex flex-col items-center justify-center text-center p-3 hover:border-primary/40 transition-colors">
                  <node.icon className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs font-medium text-foreground leading-tight">{node.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hub Diagram - Mobile (Simplified) */}
        <div className="md:hidden">
          {/* Center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="w-24 h-24 rounded-full bg-primary mx-auto mb-8 flex items-center justify-center"
          >
            <span className="text-sm font-display font-medium text-primary-foreground">StartupAI</span>
          </motion.div>

          {/* Nodes in grid */}
          <div className="grid grid-cols-2 gap-4">
            {nodes.map((node, index) => (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="marketing-card flex flex-col items-center text-center p-4"
              >
                <node.icon className="w-5 h-5 text-primary mb-2" />
                <span className="text-xs font-medium text-foreground">{node.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HubSection;
