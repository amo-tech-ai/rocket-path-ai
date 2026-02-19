import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate, useMotionValue, useTransform } from "framer-motion";
import { fashionInfographicData } from "@/data/fashion-infographic";
import { TrendingDown, TrendingUp, BarChart3, ArrowDown } from "lucide-react";

const { slide01 } = fashionInfographicData;

/* ─── Count-Up Atom ───────────────────────────────────────────── */
const CountUp = ({ to, decimals = 1, prefix = "$", suffix = "T", duration = 2.5 }: {
  to: number; decimals?: number; prefix?: string; suffix?: string; duration?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration, ease: "circOut" });
      return controls.stop;
    }
  }, [isInView, to, duration, count]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}<motion.span>{display}</motion.span>{suffix}
    </span>
  );
};

/* ─── Animated Bar (Single) ───────────────────────────────────── */
const AnimatedBar = ({ value, maxValue, label, type, delay }: {
  value: number; maxValue: number; label: string; type: string; delay: number;
}) => {
  const isPositive = type === "improve";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center gap-2 flex-1 min-w-0 group cursor-pointer"
    >
      {/* Value Label */}
      <span className="text-xs font-medium text-white/0 group-hover:text-white/80 transition-all duration-300 font-sans">
        {value}%
      </span>
      {/* Bar Track */}
      <div className="relative w-full h-[140px] flex items-end justify-center">
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: `${(value / maxValue) * 100}%` }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full max-w-[32px] rounded-t-md relative overflow-hidden ${
            isPositive
              ? "bg-gradient-to-t from-emerald-600 to-emerald-400"
              : "bg-gradient-to-t from-rose-700 to-rose-400"
          }`}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
      </div>
      {/* Label */}
      <div className="text-[10px] uppercase tracking-[0.08em] text-white/45 font-sans text-center leading-tight">
        {label.replace("Improve ", "").replace("Worsen ", "")}
      </div>
    </motion.div>
  );
};

/* ─── Section Divider ─────────────────────────────────────────── */
const Divider = () => (
  <div className="w-full flex items-center gap-4 my-2">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
);

/* ─── Main Component ──────────────────────────────────────────── */
const Slide01Hero = () => {
  const maxChart = Math.max(...slide01.chart.map((d) => d.value));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(170deg, #0a2e14 0%, #0E3E1B 40%, #0b3218 100%)" }}
      aria-label="Fashion's $2 Trillion Crossroads"
    >
      {/* ── Background Layers ─────────────────────── */}
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(202, 138, 4, 0.06), transparent 70%)"
      }} />
      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />
      {/* Top-left decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={mounted ? { scaleX: 1 } : {}}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className="absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-amber-500/40 to-transparent origin-left"
      />

      {/* ── Content Container ─────────────────────── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="flex flex-col gap-16 lg:gap-20"
        >
          {/* ── Kicker + Title ────────────────────── */}
          <div className="text-center space-y-6">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400/80 font-sans"
            >
              State of Fashion 2026
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F1EEEA] leading-[1.1] tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Fashion's{" "}
              <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                $2 Trillion
              </span>{" "}
              Crossroads
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="max-w-xl mx-auto text-base md:text-lg text-white/55 font-light leading-relaxed font-sans"
            >
              A global industry at an inflection point — navigating tariffs, shifting sentiment, and uncertain growth trajectories.
            </motion.p>
          </div>

          {/* ── Hero Stat ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div
              className="text-7xl md:text-8xl lg:text-[7rem] font-extrabold tracking-tight text-white leading-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <CountUp to={2.4} prefix="$" suffix="T" />
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-white/50 text-sm font-sans">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Projected global fashion market by 2030</span>
            </div>
          </motion.div>

          <Divider />

          {/* ── Supporting Stats ──────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {slide01.supporting_stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm p-6 lg:p-8 cursor-pointer hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-500"
              >
                {/* Top accent line */}
                <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${
                  i === 0 ? "from-transparent via-rose-500/50 to-transparent" :
                  i === 1 ? "from-transparent via-amber-500/50 to-transparent" :
                  "from-transparent via-emerald-500/50 to-transparent"
                }`} />

                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 p-2 rounded-lg ${
                    i === 0 ? "bg-rose-500/10 text-rose-400" :
                    i === 1 ? "bg-amber-500/10 text-amber-400" :
                    "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {i === 0 ? <TrendingDown className="w-5 h-5" /> :
                     i === 1 ? <BarChart3 className="w-5 h-5" /> :
                     <TrendingUp className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {stat.value}
                    </div>
                    <div className="mt-1.5 text-sm text-white/50 font-sans leading-relaxed">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Sentiment Chart ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 md:p-10"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-white/90 font-sans">Executive Sentiment</h3>
                <p className="text-xs text-white/40 mt-1 font-sans">Year-over-year outlook comparison (% of respondents)</p>
              </div>
              <div className="flex items-center gap-5 text-xs font-sans">
                <span className="flex items-center gap-1.5 text-white/50">
                  <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-emerald-600 to-emerald-400" /> Improve
                </span>
                <span className="flex items-center gap-1.5 text-white/50">
                  <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-rose-700 to-rose-400" /> Worsen
                </span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="flex items-end gap-3 md:gap-5 px-2">
              {/* Improve group */}
              <div className="flex items-end gap-2 md:gap-3 flex-1">
                {slide01.chart.filter(d => d.type === "improve").map((d, i) => (
                  <AnimatedBar key={d.label} {...d} maxValue={maxChart} delay={i * 0.1} />
                ))}
              </div>
              {/* Separator */}
              <div className="w-px h-[140px] bg-white/10 mx-1 md:mx-3" />
              {/* Worsen group */}
              <div className="flex items-end gap-2 md:gap-3 flex-1">
                {slide01.chart.filter(d => d.type === "worsen").map((d, i) => (
                  <AnimatedBar key={d.label} {...d} maxValue={maxChart} delay={0.3 + i * 0.1} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Source ────────────────────────────── */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center text-[11px] text-white/30 font-sans tracking-wide"
          >
            Source: {slide01.source}
          </motion.p>
        </motion.div>
      </div>

      {/* ── Scroll Indicator ──────────────────────── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
        aria-label="Scroll to next section"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 group-hover:text-white/60 transition-colors font-sans">
          Explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4 text-white/25 group-hover:text-white/50 transition-colors" />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default Slide01Hero;
