import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, TrendingUp, RefreshCw, Network, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Orbital Loop Architecture
 * Precise polar coordinate positioning matching Figma reference.
 * 
 * Geometry:
 * - Container: 600x600px (desktop), scaled for mobile
 * - Orbital radius: 220px from center
 * - Core circle: 180px diameter
 * - Node circles: 56px diameter
 * - Nodes positioned at exact 72° intervals starting from -90° (top)
 */

interface OrbitalNode {
  icon: React.ElementType;
  label: string;
  angleDeg: number; // 0° = right (3 o'clock), counter-clockwise positive
}

// Angles in standard mathematical notation: 0° = right, 90° = top
// Starting at top (-90° or 270°) and going clockwise
const nodes: OrbitalNode[] = [
  { icon: Zap, label: "Momentum", angleDeg: 90 },        // top (12 o'clock)
  { icon: Layers, label: "Foundation", angleDeg: 18 },   // right-lower (2 o'clock)
  { icon: TrendingUp, label: "Analysis", angleDeg: -54 }, // bottom-right (4-5 o'clock)
  { icon: RefreshCw, label: "Workflow", angleDeg: -126 }, // bottom-left (7-8 o'clock)
  { icon: Network, label: "Scaling", angleDeg: 162 },     // left-upper (10 o'clock)
];

const HubSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Fixed dimensions for precise geometry
  const containerSize = 560; // px
  const orbitalRadius = 200; // px - distance from center to node centers
  const coreSize = 180;      // px - central circle diameter
  const nodeSize = 56;       // px - small circle diameter

  // Mobile dimensions
  const mobileContainerSize = 340;
  const mobileOrbitalRadius = 120;
  const mobileCoreSize = 110;
  const mobileNodeSize = 44;

  return (
    <section 
      ref={ref} 
      className="py-24 md:py-32 lg:py-40 overflow-hidden bg-secondary/30"
    >
      <div className="container-marketing flex flex-col items-center">
        {/* Desktop Layout */}
        <div className="hidden sm:block">
          <div 
            className="relative"
            style={{ 
              width: containerSize,
              height: containerSize,
            }}
          >
            {/* SVG Orbital Ring - perfectly centered */}
            <svg 
              className="absolute inset-0" 
              width={containerSize}
              height={containerSize}
              viewBox={`0 0 ${containerSize} ${containerSize}`}
            >
              <motion.circle
                cx={containerSize / 2}
                cy={containerSize / 2}
                r={orbitalRadius}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="6 6"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={isInView ? { opacity: 0.7, pathLength: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
            </svg>

            {/* Center Core - absolutely centered */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="absolute"
              style={{
                width: coreSize,
                height: coreSize,
                left: (containerSize - coreSize) / 2,
                top: (containerSize - coreSize) / 2,
              }}
            >
              <div 
                className={cn(
                  "w-full h-full rounded-full bg-primary",
                  "flex flex-col items-center justify-center",
                  "shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.4)]"
                )}
              >
                <span className="font-display text-xl lg:text-2xl tracking-[0.2em] text-primary-foreground font-normal">
                  STARTUPAI
                </span>
                <div className="w-16 h-px bg-primary-foreground/30 my-2" />
                <span className="text-[10px] tracking-[0.15em] text-primary-foreground/70 uppercase font-medium">
                  Core System
                </span>
              </div>
            </motion.div>

            {/* Orbital Nodes - precise polar positioning */}
            {nodes.map((node, index) => {
              // Convert angle to radians for positioning
              const angleRad = (node.angleDeg * Math.PI) / 180;
              
              // Calculate exact center position of node
              const centerX = containerSize / 2 + orbitalRadius * Math.cos(angleRad);
              const centerY = containerSize / 2 - orbitalRadius * Math.sin(angleRad); // Subtract because Y is inverted

              // Determine label position based on angle
              const isTop = node.angleDeg > 45 && node.angleDeg < 135;
              const isBottom = node.angleDeg < -45 && node.angleDeg > -135;
              const isRight = node.angleDeg >= -45 && node.angleDeg <= 45;
              const isLeft = node.angleDeg >= 135 || node.angleDeg <= -135;

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
                  className="absolute"
                  style={{
                    width: nodeSize,
                    height: nodeSize,
                    left: centerX - nodeSize / 2,
                    top: centerY - nodeSize / 2,
                  }}
                >
                  {/* Node circle */}
                  <div 
                    className={cn(
                      "w-full h-full rounded-full bg-card border border-border",
                      "flex items-center justify-center",
                      "shadow-sm hover:shadow-md hover:border-primary/30",
                      "transition-all duration-300 ease-out"
                    )}
                  >
                    <node.icon 
                      className="w-6 h-6 text-primary" 
                      strokeWidth={1.5} 
                    />
                  </div>
                  
                  {/* Label - positioned outside the node */}
                  <span 
                    className={cn(
                      "absolute whitespace-nowrap",
                      "text-[11px] font-medium tracking-[0.08em] uppercase",
                      "text-muted-foreground",
                      isTop && "left-1/2 -translate-x-1/2 -top-6",
                      isBottom && "left-1/2 -translate-x-1/2 top-full mt-2",
                      isRight && "left-full ml-3 top-1/2 -translate-y-1/2",
                      isLeft && "right-full mr-3 top-1/2 -translate-y-1/2"
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
            className="mt-12 text-center text-sm text-muted-foreground tracking-[0.1em] uppercase"
          >
            Orbital Loop Architecture
          </motion.p>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden">
          <div 
            className="relative"
            style={{ 
              width: mobileContainerSize,
              height: mobileContainerSize,
            }}
          >
            {/* SVG Orbital Ring */}
            <svg 
              className="absolute inset-0" 
              width={mobileContainerSize}
              height={mobileContainerSize}
              viewBox={`0 0 ${mobileContainerSize} ${mobileContainerSize}`}
            >
              <motion.circle
                cx={mobileContainerSize / 2}
                cy={mobileContainerSize / 2}
                r={mobileOrbitalRadius}
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
              className="absolute"
              style={{
                width: mobileCoreSize,
                height: mobileCoreSize,
                left: (mobileContainerSize - mobileCoreSize) / 2,
                top: (mobileContainerSize - mobileCoreSize) / 2,
              }}
            >
              <div 
                className={cn(
                  "w-full h-full rounded-full bg-primary",
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
              const angleRad = (node.angleDeg * Math.PI) / 180;
              const centerX = mobileContainerSize / 2 + mobileOrbitalRadius * Math.cos(angleRad);
              const centerY = mobileContainerSize / 2 - mobileOrbitalRadius * Math.sin(angleRad);

              const isTop = node.angleDeg > 45 && node.angleDeg < 135;
              const isBottom = node.angleDeg < -45 && node.angleDeg > -135;
              const isRight = node.angleDeg >= -45 && node.angleDeg <= 45;
              const isLeft = node.angleDeg >= 135 || node.angleDeg <= -135;

              return (
                <motion.div
                  key={node.label}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
                  className="absolute"
                  style={{
                    width: mobileNodeSize,
                    height: mobileNodeSize,
                    left: centerX - mobileNodeSize / 2,
                    top: centerY - mobileNodeSize / 2,
                  }}
                >
                  <div 
                    className={cn(
                      "w-full h-full rounded-full bg-card border border-border",
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
                      isBottom && "left-1/2 -translate-x-1/2 top-full mt-1",
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
            className="mt-8 text-center text-xs text-muted-foreground tracking-[0.08em] uppercase"
          >
            Orbital Loop Architecture
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HubSection;
