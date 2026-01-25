import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Layers, BarChart3, RefreshCw, Building2, Zap } from "lucide-react";

const HubSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const nodes = [
    { icon: Layers, label: "Foundation", angle: -90 },      // top
    { icon: BarChart3, label: "Analysis", angle: -18 },     // top-right
    { icon: RefreshCw, label: "Workflow", angle: 54 },      // bottom-right
    { icon: Building2, label: "Scaling", angle: 126 },      // bottom-left
    { icon: Zap, label: "Momentum", angle: 198 },           // top-left
  ];

  const orbitRadius = 160;
  const nodeSize = 72;
  const centerSize = 120;

  return (
    <section ref={ref} className="section-marketing overflow-hidden">
      <div className="container-marketing">
        {/* Desktop Orbital Layout */}
        <div className="hidden md:flex justify-center items-center py-16">
          <div 
            className="relative"
            style={{ 
              width: orbitRadius * 2 + nodeSize * 2 + 40, 
              height: orbitRadius * 2 + nodeSize * 2 + 40 
            }}
          >
            {/* Orbital ring */}
            <motion.svg
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0, rotate: -10 }}
              animate={isInView ? { opacity: 1, rotate: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <circle
                cx="50%"
                cy="50%"
                r={orbitRadius + 10}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="6 4"
                className="opacity-60"
              />
            </motion.svg>

            {/* Connection lines from center to each node */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.map((node, index) => {
                const angleRad = (node.angle * Math.PI) / 180;
                const centerX = orbitRadius + nodeSize + 20;
                const centerY = orbitRadius + nodeSize + 20;
                const endX = centerX + Math.cos(angleRad) * (orbitRadius - 10);
                const endY = centerY + Math.sin(angleRad) * (orbitRadius - 10);
                
                return (
                  <motion.line
                    key={`line-${index}`}
                    x1={centerX}
                    y1={centerY}
                    x2={endX}
                    y2={endY}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 0.4 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  />
                );
              })}
            </svg>

            {/* Center hub */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ width: centerSize, height: centerSize }}
            >
              <div className="w-full h-full rounded-full bg-primary flex flex-col items-center justify-center shadow-lg">
                <span className="text-lg font-display tracking-wider text-primary-foreground font-medium">
                  STARTUP<span className="font-bold">AI</span>
                </span>
                <div className="w-8 h-px bg-primary-foreground/30 my-1.5" />
                <span className="text-[10px] tracking-[0.15em] text-primary-foreground/70 uppercase">
                  Core System
                </span>
              </div>
            </motion.div>

            {/* Orbital nodes */}
            {nodes.map((node, index) => {
              const angleRad = (node.angle * Math.PI) / 180;
              const x = Math.cos(angleRad) * orbitRadius;
              const y = Math.sin(angleRad) * orbitRadius;
              const centerX = orbitRadius + nodeSize + 20;
              const centerY = orbitRadius + nodeSize + 20;

              return (
                <motion.div
                  key={node.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: centerX + x - nodeSize / 2,
                    top: centerY + y - nodeSize / 2,
                  }}
                >
                  {/* Node circle */}
                  <div 
                    className="rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300"
                    style={{ width: nodeSize, height: nodeSize }}
                  >
                    <node.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  
                  {/* Label positioned based on angle */}
                  <span 
                    className="absolute text-xs font-medium tracking-wide text-foreground whitespace-nowrap"
                    style={{
                      top: node.angle === -90 ? -24 : 
                           node.angle > 0 && node.angle < 180 ? nodeSize + 8 : 
                           node.angle === 198 || node.angle === -18 ? nodeSize / 2 - 8 : nodeSize + 8,
                      left: node.angle === -90 ? '50%' : 
                            node.angle === -18 ? nodeSize + 12 :
                            node.angle === 198 ? -8 : '50%',
                      transform: node.angle === -90 || (node.angle > 0 && node.angle < 180) ? 'translateX(-50%)' :
                                 node.angle === 198 ? 'translateX(-100%)' : 'translateX(-50%)',
                    }}
                  >
                    {node.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden py-12">
          {/* Center hub */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="w-24 h-24 rounded-full bg-primary mx-auto mb-8 flex flex-col items-center justify-center"
          >
            <span className="text-sm font-display tracking-wider text-primary-foreground">
              STARTUP<span className="font-bold">AI</span>
            </span>
            <div className="w-6 h-px bg-primary-foreground/30 my-1" />
            <span className="text-[9px] tracking-[0.12em] text-primary-foreground/70 uppercase">
              Core System
            </span>
          </motion.div>

          {/* Nodes in a flowing grid */}
          <div className="flex flex-wrap justify-center gap-4 max-w-sm mx-auto px-4">
            {nodes.map((node, index) => (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
                  <node.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium text-foreground">
                  {node.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-sm text-muted-foreground tracking-wide mt-8"
        >
          Orbital Loop Architecture
        </motion.p>
      </div>
    </section>
  );
};

export default HubSection;
