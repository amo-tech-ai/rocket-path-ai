import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fashionInfographicData } from "@/data/fashion-infographic";
import { ArrowRight, AlertTriangle, Globe, Truck, Scissors, DollarSign, MapPin } from "lucide-react";

const { slide02 } = fashionInfographicData;

/* ─── Animated Country Bar ────────────────────────────────────── */
const CountryBar = ({ label, value, maxValue, delay, index }: {
  label: string; value: number; maxValue: number; delay: number; index: number;
}) => {
  const percentage = (value / maxValue) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#1a1a2e] font-sans">{label}</span>
        </div>
        <span className="text-sm font-bold text-[#6366f1] font-sans tabular-nums">{value}%</span>
      </div>
      <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 group-hover:from-indigo-500 group-hover:via-violet-500 group-hover:to-purple-500 transition-all duration-500"
        />
        {/* Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
          style={{ backgroundSize: "200% 100%", animation: "shimmer 2s infinite" }} />
      </div>
    </motion.div>
  );
};

/* ─── Flow Response Card ──────────────────────────────────────── */
const ResponseCard = ({ label, pct, icon: Icon, color, delay }: {
  label: string; pct: string; icon: React.ComponentType<{ className?: string }>; color: string; delay: number;
}) => {
  const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    indigo: { bg: "bg-indigo-50", border: "border-indigo-200/60", text: "text-indigo-600", iconBg: "bg-indigo-100" },
    emerald: { bg: "bg-emerald-50", border: "border-emerald-200/60", text: "text-emerald-600", iconBg: "bg-emerald-100" },
    amber: { bg: "bg-amber-50", border: "border-amber-200/60", text: "text-amber-600", iconBg: "bg-amber-100" },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-center gap-4 rounded-xl px-5 py-4 border ${c.bg} ${c.border} hover:shadow-md transition-all duration-300 cursor-pointer group`}
    >
      <div className={`p-2 rounded-lg ${c.iconBg}`}>
        <Icon className={`w-4 h-4 ${c.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-slate-700 font-sans">{label}</span>
      </div>
      <span className={`text-xl font-extrabold ${c.text} tabular-nums`} style={{ fontFamily: "'Playfair Display', serif" }}>
        {pct}
      </span>
    </motion.div>
  );
};

/* ─── Main Component ──────────────────────────────────────────── */
const Slide02TariffShock = () => {
  const maxChart = Math.max(...slide02.chart.map(d => d.value));
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col items-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F7F5F2 0%, #F1EEEA 50%, #EDE9E5 100%)" }}
      aria-label="The $27B Tariff Tax on Fashion"
    >
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />
      {/* Top decorative accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent origin-center"
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-20 lg:py-28">
        <div className="flex flex-col gap-16 lg:gap-20">

          {/* ── Header ────────────────────────────── */}
          <div className="text-center space-y-6">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 font-sans"
            >
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              Trade Disruption
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a2e] leading-[1.1] tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                $27B
              </span>{" "}
              Tariff Tax
              <br className="hidden md:block" />
              <span className="text-[#1a1a2e]/60"> on Fashion</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="max-w-lg mx-auto text-base text-slate-500 font-light leading-relaxed font-sans"
            >
              Incremental duties on US apparel imports reshaping sourcing strategy and consumer pricing worldwide.
            </motion.p>
          </div>

          {/* ── Stats Row ─────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {slide02.supporting_stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-white rounded-2xl border border-slate-200/80 p-6 lg:p-8 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-200/50 transition-all duration-500 cursor-pointer"
              >
                {/* Top line */}
                <div className={`absolute top-0 left-6 right-6 h-px ${
                  i === 0 ? "bg-gradient-to-r from-transparent via-rose-400/40 to-transparent" :
                  i === 1 ? "bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" :
                  "bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"
                }`} />

                <div className="text-2xl lg:text-3xl font-bold text-[#1a1a2e] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-slate-500 font-sans leading-relaxed">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Two Column: Chart + Flow ───────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

            {/* Tariff Chart (Horizontal Bars) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-500"
            >
              <div className="flex items-center gap-2 mb-6">
                <Globe className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-semibold text-slate-800 font-sans uppercase tracking-wider">
                  Tariff Rates by Country
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                {slide02.chart.map((item, i) => (
                  <CountryBar
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    maxValue={maxChart}
                    delay={0.1 + i * 0.08}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>

            {/* Brand Response Flow */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-500"
            >
              <div className="flex items-center gap-2 mb-6">
                <Truck className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-semibold text-slate-800 font-sans uppercase tracking-wider">
                  Brand Response Strategy
                </h3>
              </div>

              {/* Trigger Node */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center gap-3 bg-rose-50 border border-rose-200/60 rounded-xl px-5 py-4 mb-6"
              >
                <div className="p-2 bg-rose-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <span className="text-sm font-bold text-rose-700 font-sans">Tariff Shock</span>
                  <p className="text-xs text-rose-500/70 font-sans mt-0.5">April 2025 — rates up to 54%</p>
                </div>
              </motion.div>

              {/* Arrow connector */}
              <div className="flex items-center justify-center my-2">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: 24 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="w-px bg-slate-300"
                />
              </div>
              <div className="flex justify-center mb-4">
                <ArrowRight className="w-3 h-3 text-slate-300 rotate-90" />
              </div>

              {/* Response Cards */}
              <div className="flex flex-col gap-3">
                <ResponseCard label="Price Increases" pct="55%" icon={DollarSign} color="indigo" delay={0.5} />
                <ResponseCard label="Sourcing Shifts" pct="35%" icon={MapPin} color="emerald" delay={0.65} />
                <ResponseCard label="SKU Reduction" pct="27%" icon={Scissors} color="amber" delay={0.8} />
              </div>
            </motion.div>
          </div>

          {/* ── Source ────────────────────────────── */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-[11px] text-slate-400 font-sans tracking-wide"
          >
            Source: {slide02.source}
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default Slide02TariffShock;
