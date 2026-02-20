import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface FunnelTier {
  label: string;
  value: string;
  sublabel?: string;
  color: string;
}

interface MarketFunnelProps {
  title?: string;
  subtitle?: string;
  tiers: FunnelTier[];
}

const widthClasses = [
  "w-full",
  "w-[85%]",
  "w-[65%]",
  "w-[45%]",
];

const MarketFunnel = ({ title, subtitle, tiers }: MarketFunnelProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {title && (
        <div className="mb-8">
          <h4 className="font-display text-lg font-medium text-current">
            {title}
          </h4>
          {subtitle && (
            <p className="text-sm text-current/60 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        {tiers.map((tier, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: index * 0.15,
              ease: "easeOut",
            }}
            className={`${widthClasses[index] || "w-[40%]"} transition-all`}
          >
            <div
              className="rounded-xl px-6 py-5 text-center relative overflow-hidden"
              style={{ backgroundColor: tier.color }}
            >
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />

              <div className="relative">
                <p className="font-display text-2xl md:text-3xl font-semibold text-white tracking-tight">
                  {tier.value}
                </p>
                <p className="text-xs uppercase tracking-wider text-white/80 mt-1 font-medium">
                  {tier.label}
                </p>
                {tier.sublabel && (
                  <p className="text-[10px] text-white/50 mt-1 font-mono">
                    {tier.sublabel}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Funnel flow indicator */}
      <div className="flex justify-center mt-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-px h-4 bg-current/20" />
          <p className="text-[10px] uppercase tracking-widest text-current/40 font-medium">
            Addressable
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketFunnel;
