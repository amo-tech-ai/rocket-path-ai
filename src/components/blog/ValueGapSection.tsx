import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GapStat {
  value: string;
  label: string;
}

interface ValueGapSectionProps {
  title: string;
  subtitle?: string;
  stats: GapStat[];
  ctaLabel?: string;
  ctaHref?: string;
}

const ValueGapSection = ({ 
  title, 
  subtitle, 
  stats, 
  ctaLabel, 
  ctaHref 
}: ValueGapSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-8 md:p-12"
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative z-10 text-center">
        <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4 italic">
          {title}
        </h3>
        
        {subtitle && (
          <p className="text-white/60 max-w-2xl mx-auto mb-10 text-sm md:text-base">
            {subtitle}
          </p>
        )}

        <div className={cn(
          "grid gap-8 mb-10",
          stats.length === 3 && "md:grid-cols-3",
          stats.length === 4 && "md:grid-cols-4",
          stats.length === 2 && "md:grid-cols-2 max-w-xl mx-auto"
        )}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="font-display text-4xl md:text-5xl font-light text-white mb-2 italic">
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/50">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {ctaLabel && (
          <motion.a
            href={ctaHref || "#"}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {ctaLabel}
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};

export default ValueGapSection;
