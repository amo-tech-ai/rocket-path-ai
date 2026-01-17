import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, CheckSquare, Users, TrendingUp, Compass } from "lucide-react";

const SystemDiagram = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const nodes = [
    { icon: Lightbulb, label: "Strategy", angle: -72 },
    { icon: CheckSquare, label: "Tasks", angle: 0 },
    { icon: Users, label: "Investors", angle: 72 },
    { icon: TrendingUp, label: "Progress", angle: 144 },
    { icon: Compass, label: "Market Intel", angle: 216 },
  ];

  return (
    <section ref={ref} className="section-marketing bg-background">
      <div className="container-marketing">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="headline-lg text-foreground mb-4">
            Everything flows through one system
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Strategy, execution, investors, and progress — connected.
          </p>
        </motion.div>

        {/* Diagram Container */}
        <div className="relative max-w-lg mx-auto aspect-square">
          {/* Connection Lines - SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
            {nodes.map((node, index) => {
              const centerX = 200;
              const centerY = 200;
              const radius = 140;
              const angleRad = (node.angle - 90) * (Math.PI / 180);
              const x = centerX + radius * Math.cos(angleRad);
              const y = centerY + radius * Math.sin(angleRad);
              
              return (
                <motion.line
                  key={`line-${index}`}
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                />
              );
            })}
          </svg>

          {/* Center Node - StartupAI */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-display font-medium text-sm">
                StartupAI
              </span>
            </div>
          </motion.div>

          {/* Outer Nodes */}
          {nodes.map((node, index) => {
            const radius = 140;
            const angleRad = (node.angle - 90) * (Math.PI / 180);
            const x = 50 + (radius / 200) * 100 * Math.cos(angleRad);
            const y = 50 + (radius / 200) * 100 * Math.sin(angleRad);
            
            return (
              <motion.div
                key={node.label}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-sm hover:border-primary/30 transition-colors">
                    <node.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {node.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Alternative - Linear View */}
        <div className="lg:hidden mt-12">
          <div className="flex flex-wrap justify-center gap-4">
            {nodes.map((node, index) => (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background"
              >
                <node.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{node.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemDiagram;
