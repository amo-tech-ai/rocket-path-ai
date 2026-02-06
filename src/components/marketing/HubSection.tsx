import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, TrendingUp, RefreshCw, Network, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Orbital Loop Architecture
 * A minimal, calm architectural diagram showing StartupAI's core system
 * with 5 interconnected phases in a continuous orbital flow.
 */

interface OrbitalNode {
  icon: React.ElementType;
  label: string;
  angleDeg: number; // 0° = top, clockwise
}

const nodes: OrbitalNode[] = [
  { icon: Zap, label: "Momentum", angleDeg: 0 },           // top
  { icon: Layers, label: "Foundation", angleDeg: 72 },    // right-top
  { icon: TrendingUp, label: "Analysis", angleDeg: 144 }, // right-bottom
  { icon: RefreshCw, label: "Workflow", angleDeg: 216 },  // left-bottom
  { icon: Network, label: "Scaling", angleDeg: 288 },     // left-top
];

const HubSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Responsive sizes
  const desktopCore = 180;
  const desktopOrbit = 280;
  const desktopNode = 72;
  
  const tabletCore = 150;
  const tabletOrbit = 230;
  const tabletNode = 60;

  const mobileCore = 120;
  const mobileOrbit = 170;
  const mobileNode = 52;

  return (
    <section 
      ref={ref} 
      className="py-24 md:py-32 lg:py-40 overflow-hidden bg-secondary/30"
    >
      <div className="container-marketing">
        {/* Desktop & Tablet Orbital Layout */}
        <div className="hidden sm:flex flex-col items-center">
          {/* Orbital Container */}
          <div 
            className="relative"
            style={{ 
              width: `min(100%, ${desktopOrbit * 2 + desktopNode + 100}px)`,
              aspectRatio: '1',
              maxWidth: desktopOrbit * 2 + desktopNode + 100,
            }}
          >
            {/* SVG Orbital Ring */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 700 700"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Orbital circle - dashed line */}
              <motion.circle
                cx="350"
                cy="350"
                r="280"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="6 6"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={isInView ? { opacity: 0.7, pathLength: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
            </svg>

            {/* Center Core */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div 
                className={cn(
                  "rounded-full bg-primary flex flex-col items-center justify-center",
                  "shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.4)]",
                  "w-[120px] h-[120px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px]"
                )}
              >
                <span className="font-display text-lg md:text-xl lg:text-2xl tracking-[0.2em] text-primary-foreground font-normal">
                  STARTUPAI
                </span>
                <div className="w-12 md:w-14 lg:w-16 h-px bg-primary-foreground/30 my-2" />
                <span className="text-[10px] md:text-[11px] tracking-[0.15em] text-primary-foreground/70 uppercase font-medium">
                  Core System
                </span>
              </div>
            </motion.div>

            {/* Orbital Nodes */}
            {nodes.map((node, index) => {
              // Convert angle to radians, offset by -90° so 0° is at top
              const angleRad = ((node.angleDeg - 90) * Math.PI) / 180;
              
              // Calculate position as percentage from center
              // Using 40% radius relative to container (280/700 = 0.4)
              const radius = 40;
              const xPercent = 50 + radius * Math.cos(angleRad);
              const yPercent = 50 + radius * Math.sin(angleRad);

              // Position label based on angle quadrant
              const isTop = node.angleDeg >= 315 || node.angleDeg <= 45;
              const isRight = node.angleDeg > 45 && node.angleDeg < 135;
              const isBottom = node.angleDeg >= 135 && node.angleDeg <= 225;
              const isLeft = node.angleDeg > 225 && node.angleDeg < 315;

              return (
                <motion.div
                  key={node.label}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.5 + index * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                  }}
                >
                  {/* Node circle */}
                  <div 
                    className={cn(
                      "rounded-full bg-card border border-border",
                      "flex items-center justify-center",
                      "shadow-sm hover:shadow-md hover:border-primary/30",
                      "transition-all duration-300 ease-out",
                      "w-[52px] h-[52px] md:w-[60px] md:h-[60px] lg:w-[72px] lg:h-[72px]"
                    )}
                  >
                    <node.icon 
                      className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-primary" 
                      strokeWidth={1.5} 
                    />
                  </div>
                  
                  {/* Label */}
                  <span 
                    className={cn(
                      "absolute whitespace-nowrap",
                      "text-[10px] md:text-[11px] lg:text-xs",
                      "font-medium tracking-[0.08em] uppercase",
                      "text-muted-foreground",
                      // Position based on quadrant
                      isTop && "left-1/2 -translate-x-1/2 -top-7 md:-top-8",
                      isBottom && "left-1/2 -translate-x-1/2 -bottom-7 md:-bottom-8 top-auto",
                      isRight && "left-full ml-3 md:ml-4 top-1/2 -translate-y-1/2",
                      isLeft && "right-full mr-3 md:mr-4 top-1/2 -translate-y-1/2"
                    )}
                  >
                    {node.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Section footer */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-12 md:mt-16 text-sm text-muted-foreground tracking-[0.1em] uppercase"
          >
            Orbital Loop Architecture
          </motion.p>
        </div>

        {/* Mobile Layout - Simplified */}
        <div className="sm:hidden flex flex-col items-center">
          {/* Orbital Container - smaller for mobile */}
          <div 
            className="relative w-[340px] h-[340px] max-w-full"
          >
            {/* SVG Orbital Ring */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 340 340"
              preserveAspectRatio="xMidYMid meet"
            >
              <motion.circle
                cx="170"
                cy="170"
                r="130"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="5 5"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.6 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </svg>

            {/* Center Core */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div 
                className={cn(
                  "w-[100px] h-[100px] rounded-full bg-primary",
                  "flex flex-col items-center justify-center",
                  "shadow-[0_15px_40px_-10px_hsl(var(--primary)/0.4)]"
                )}
              >
                <span className="font-display text-sm tracking-[0.15em] text-primary-foreground">
                  STARTUPAI
                </span>
                <div className="w-10 h-px bg-primary-foreground/30 my-1.5" />
                <span className="text-[8px] tracking-[0.12em] text-primary-foreground/70 uppercase">
                  Core System
                </span>
              </div>
            </motion.div>

            {/* Mobile Orbital Nodes */}
            {nodes.map((node, index) => {
              const angleRad = ((node.angleDeg - 90) * Math.PI) / 180;
              const radius = 38; // percentage
              const xPercent = 50 + radius * Math.cos(angleRad);
              const yPercent = 50 + radius * Math.sin(angleRad);

              const isTop = node.angleDeg >= 315 || node.angleDeg <= 45;
              const isRight = node.angleDeg > 45 && node.angleDeg < 135;
              const isBottom = node.angleDeg >= 135 && node.angleDeg <= 225;
              const isLeft = node.angleDeg > 225 && node.angleDeg < 315;

              return (
                <motion.div
                  key={node.label}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                  }}
                >
                  <div 
                    className={cn(
                      "w-11 h-11 rounded-full bg-card border border-border",
                      "flex items-center justify-center shadow-sm"
                    )}
                  >
                    <node.icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  </div>
                  
                  <span 
                    className={cn(
                      "absolute whitespace-nowrap text-[9px] font-medium",
                      "tracking-[0.06em] uppercase text-muted-foreground",
                      isTop && "left-1/2 -translate-x-1/2 -top-5",
                      isBottom && "left-1/2 -translate-x-1/2 -bottom-5 top-auto",
                      isRight && "left-full ml-2 top-1/2 -translate-y-1/2",
                      isLeft && "right-full mr-2 top-1/2 -translate-y-1/2"
                    )}
                  >
                    {node.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-10 text-xs text-muted-foreground tracking-[0.08em] uppercase"
          >
            Orbital Loop Architecture
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HubSection;
