import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import KpiCard from "./KpiCard";

interface KpiItem {
  value: string;
  label: string;
  source?: string;
  type?: "measured" | "projected" | "estimated";
}

interface ReportHeroProps {
  title: string;
  subtitle: string;
  chips?: string[];
  kpis: KpiItem[];
}

const ReportHero = ({ title, subtitle, chips = [], kpis }: ReportHeroProps) => {
  return (
    <section className="relative bg-background py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }} />
      </div>
      
      <div className="container-premium relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Title + subtitle + chips */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Chips */}
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chips.map((chip, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-sage-light text-sage-foreground border-0 font-medium text-xs px-3 py-1"
                  >
                    {chip}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-[1.1]">
              {title}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              {subtitle}
            </p>
          </motion.div>
          
          {/* Right: KPI Stack */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="lg:pl-8"
          >
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-premium-md">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                Key Metrics
              </h3>
              <div className="space-y-6">
                {kpis.map((kpi, index) => (
                  <KpiCard
                    key={index}
                    value={kpi.value}
                    label={kpi.label}
                    source={kpi.source}
                    type={kpi.type}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReportHero;
