import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Compass, Map, Zap, Brain } from "lucide-react";

const HubSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const nodes = [
    { 
      icon: Compass, 
      label: "STRATEGY", 
      subtitle: "why & direction",
      angle: -90 // top
    },
    { 
      icon: Map, 
      label: "PLANNING", 
      subtitle: "what & how",
      angle: 0 // right
    },
    { 
      icon: Zap, 
      label: "ACTION", 
      subtitle: "execution",
      angle: 90 // bottom
    },
    { 
      icon: Brain, 
      label: "INTELLIGENCE", 
      subtitle: "feedback & insight",
      angle: 180 // left
    },
  ];

  const orbitRadius = 200;
  const nodeSize = 80;

  return (
    <section ref={ref} className="section-marketing overflow-hidden">
      <div className="container-marketing">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="eyebrow">Core Architecture</p>
          <h2 className="headline-lg text-foreground mb-4">
            One system. Four dimensions.
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Every decision flows through a unified intelligence layer.
          </p>
        </motion.div>

        {/* Orbital Diagram - Desktop */}
        <div className="hidden md:flex justify-center items-center">
          <div className="relative" style={{ width: orbitRadius * 2 + nodeSize * 2, height: orbitRadius * 2 + nodeSize * 2 }}>
            
            {/* Orbital ring */}
            <motion.svg
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <circle
                cx="50%"
                cy="50%"
                r={orbitRadius}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </motion.svg>

            {/* Center circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-primary flex flex-col items-center justify-center z-10"
            >
              <span className="text-xl font-display tracking-wider text-primary-foreground">
                STARTUP<span className="font-bold">AI</span>
              </span>
              <div className="w-8 h-px bg-primary-foreground/30 my-2" />
              <span className="text-xs tracking-[0.2em] text-primary-foreground/70 uppercase">
                Core System
              </span>
            </motion.div>

            {/* Connection lines and nodes */}
            {nodes.map((node, index) => {
              const angleRad = (node.angle * Math.PI) / 180;
              const x = Math.cos(angleRad) * orbitRadius;
              const y = Math.sin(angleRad) * orbitRadius;
              const centerX = orbitRadius + nodeSize;
              const centerY = orbitRadius + nodeSize;

              return (
                <motion.div
                  key={node.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="absolute"
                  style={{
                    left: centerX + x - nodeSize / 2,
                    top: centerY + y - nodeSize / 2,
                    width: nodeSize,
                    height: nodeSize,
                  }}
                >
                  {/* Connection line */}
                  <svg
                    className="absolute -z-10"
                    style={{
                      left: nodeSize / 2,
                      top: nodeSize / 2,
                      width: Math.abs(x) + 10,
                      height: Math.abs(y) + 10,
                      overflow: 'visible',
                    }}
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2={-x * 0.55}
                      y2={-y * 0.55}
                      stroke="hsl(var(--border))"
                      strokeWidth="1"
                    />
                  </svg>

                  {/* Node */}
                  <div className="w-full h-full rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300">
                    <node.icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Label */}
                  <div 
                    className="absolute whitespace-nowrap text-center"
                    style={{
                      top: node.angle === -90 ? -48 : node.angle === 90 ? nodeSize + 12 : '50%',
                      left: node.angle === 0 ? nodeSize + 16 : node.angle === 180 ? -16 : '50%',
                      transform: node.angle === 0 
                        ? 'translateY(-50%)' 
                        : node.angle === 180 
                          ? 'translate(-100%, -50%)'
                          : 'translateX(-50%)',
                    }}
                  >
                    <span className="block text-xs font-medium tracking-[0.15em] text-foreground uppercase">
                      {node.label}
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      {node.subtitle}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="w-28 h-28 rounded-full bg-primary mx-auto mb-10 flex flex-col items-center justify-center"
          >
            <span className="text-sm font-display tracking-wider text-primary-foreground">
              STARTUP<span className="font-bold">AI</span>
            </span>
            <div className="w-6 h-px bg-primary-foreground/30 my-1" />
            <span className="text-[10px] tracking-[0.15em] text-primary-foreground/70 uppercase">
              Core System
            </span>
          </motion.div>

          {/* Nodes in 2x2 grid */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {nodes.map((node, index) => (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="marketing-card flex flex-col items-center text-center p-5"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <node.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium tracking-[0.1em] text-foreground uppercase">
                  {node.label}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {node.subtitle}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HubSection;
