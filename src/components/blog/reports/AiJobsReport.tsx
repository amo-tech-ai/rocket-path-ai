import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DarkCTASection, SourcesSection } from "@/components/blog";
import {
  COLORS,
  SRC,
  heroKpis,
  executiveSummaryPoints,
  displacementStats,
  displacementCategories,
  displacementInsight,
  industryExposure,
  exposureKpis,
  skillsHalfLife,
  skillsMatrix,
  skillsInsight,
  wageStats,
  productivityBySector,
  wageInsight,
  emergingRoles,
  nonReplaceableRoles,
  rolesInsight,
  geographicRegions,
  geographicStats,
  geographicInsight,
  policyFramework,
  policyInsight,
  predictions,
  predictionCards,
  visionQuote,
  visionMetrics,
  sources,
  methodology,
  definitions,
  limitations,
  companySpotlights,
  workerPersonas,
} from "./data/aiJobsData";
import type { CompanySpotlight, WorkerPersona } from "./data/aiJobsData";

// ─── Sub-components ─────────────────────────────────────────────────

/** Scroll-triggered fade-in wrapper */
const FadeIn = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/** Inline linked source citation */
const SourceCite = ({ id }: { id: keyof typeof SRC }) => (
  <a
    href={SRC[id]}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-baseline gap-0.5 text-xs font-mono uppercase tracking-wide opacity-50 hover:opacity-100 transition-opacity"
    style={{ color: COLORS.TEAL }}
  >
    [{id}]
  </a>
);

/** Animated horizontal bar */
const AnimatedBar = ({
  label,
  value,
  max = 100,
  color,
  suffix = "%",
  sublabel,
}: {
  label: string;
  value: number;
  max?: number;
  color: string;
  suffix?: string;
  sublabel?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm" style={{ color: COLORS.TEXT_PRIMARY }}>
          {label}
        </span>
        <span className="font-display text-lg font-semibold" style={{ color }}>
          {value}{suffix}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-black/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${(value / max) * 100}%` } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {sublabel && (
        <p className="text-xs" style={{ color: COLORS.SLATE }}>
          {sublabel}
        </p>
      )}
    </div>
  );
};

/** Industry exposure card */
const ExposureCard = ({
  data,
  index,
}: {
  data: (typeof industryExposure)[number];
  index: number;
}) => (
  <FadeIn delay={index * 0.08}>
    <div
      className="rounded-2xl p-6 md:p-8"
      style={{ backgroundColor: "#FAFAF8", borderTop: `3px solid ${data.accentColor}` }}
    >
      <div className="flex items-start justify-between mb-4">
        <h4
          className="font-display text-lg font-medium"
          style={{ color: COLORS.TEXT_PRIMARY }}
        >
          {data.industry}
        </h4>
        <span
          className="text-xs font-mono px-2 py-1 rounded-full"
          style={{
            backgroundColor: `${data.accentColor}20`,
            color: data.accentColor,
          }}
        >
          {data.riskLevel}
        </span>
      </div>
      <p
        className="font-display text-2xl font-semibold mb-3"
        style={{ color: data.accentColor }}
      >
        {data.automationPct}
      </p>
      <div className="space-y-2 text-sm" style={{ color: COLORS.SLATE }}>
        <p>
          <span className="font-medium" style={{ color: COLORS.TEXT_PRIMARY }}>
            At risk:
          </span>{" "}
          {data.primaryImpact}
        </p>
        <p>
          <span className="font-medium" style={{ color: COLORS.TEXT_PRIMARY }}>
            Growth:
          </span>{" "}
          {data.growthCatalyst}
        </p>
        {data.company !== "—" && (
          <p className="text-xs italic" style={{ color: COLORS.TEAL }}>
            {data.company}
          </p>
        )}
      </div>
    </div>
  </FadeIn>
);

/** Skill gap bar (dual-track: required vs current) */
const SkillBar = ({
  data,
  index,
}: {
  data: (typeof skillsMatrix)[number];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <FadeIn delay={index * 0.08}>
      <div ref={ref} className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span
            className="text-sm font-medium"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            {data.name}
          </span>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${data.color}20`,
              color: data.color,
            }}
          >
            {data.gap}
          </span>
        </div>
        {/* Required */}
        <div className="h-2 rounded-full bg-black/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: data.color }}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${data.required}%` } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        {/* Current */}
        <div className="h-2 rounded-full bg-black/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full opacity-40"
            style={{ backgroundColor: data.color }}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${data.current}%` } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          />
        </div>
        <div
          className="flex justify-between text-xs"
          style={{ color: COLORS.SLATE }}
        >
          <span>Current: {data.current}%</span>
          <span>Required: {data.required}%</span>
        </div>
      </div>
    </FadeIn>
  );
};

/** Productivity bar with company badge */
const ProductivityBar = ({
  data,
  index,
}: {
  data: (typeof productivityBySector)[number];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <FadeIn delay={index * 0.08}>
      <div ref={ref} className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm" style={{ color: COLORS.TEXT_PRIMARY }}>
            {data.sector}
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className="text-xs italic"
              style={{ color: COLORS.TEAL }}
            >
              {data.company}
            </span>
            <span
              className="font-display text-lg font-semibold"
              style={{ color: COLORS.FOREST }}
            >
              +{data.lift}%
            </span>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-black/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: COLORS.FOREST }}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${data.lift}%` } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </FadeIn>
  );
};

/** Role card */
const RoleCard = ({
  data,
  index,
  variant,
}: {
  data: (typeof emergingRoles)[number] | (typeof nonReplaceableRoles)[number];
  index: number;
  variant: "emerging" | "stable";
}) => (
  <FadeIn delay={index * 0.1}>
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl p-6 md:p-8 h-full"
      style={{
        backgroundColor: "#FAFAF8",
        borderTop: `3px solid ${data.accentColor}`,
      }}
    >
      <h4
        className="font-display text-lg font-medium mb-2"
        style={{ color: COLORS.TEXT_PRIMARY }}
      >
        {data.title}
      </h4>
      <p className="text-sm mb-4" style={{ color: COLORS.SLATE }}>
        {data.description}
      </p>
      {variant === "emerging" && "salary" in data && (
        <div className="space-y-2 mt-auto">
          <div className="flex items-baseline gap-3">
            <span
              className="font-display text-base font-semibold"
              style={{ color: data.accentColor }}
            >
              {data.salary}
            </span>
            <span className="text-xs" style={{ color: COLORS.TEAL }}>
              {data.growth}
            </span>
          </div>
          {"companies" in data && data.companies && (
            <p className="text-xs" style={{ color: COLORS.SLATE }}>
              {data.companies}
            </p>
          )}
        </div>
      )}
      {variant === "stable" && "reason" in data && (
        <p
          className="text-xs font-mono uppercase tracking-wide mt-auto"
          style={{ color: data.accentColor }}
        >
          {data.reason}
        </p>
      )}
    </motion.div>
  </FadeIn>
);

/** Geographic region bar */
const RegionBar = ({
  data,
  index,
}: {
  data: (typeof geographicRegions)[number];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <FadeIn delay={index * 0.08}>
      <div ref={ref} className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span
            className="text-sm font-medium"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            {data.region}
          </span>
          <span
            className="font-display text-lg font-semibold"
            style={{ color: data.exposure > 50 ? COLORS.CORAL : COLORS.TEAL }}
          >
            {data.exposure}%
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-black/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor:
                data.exposure > 50 ? COLORS.CORAL : COLORS.TEAL,
            }}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${data.exposure}%` } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs" style={{ color: COLORS.SLATE }}>
          {data.context}
        </p>
        <p className="text-xs italic" style={{ color: COLORS.TEAL }}>
          {data.policy}
        </p>
      </div>
    </FadeIn>
  );
};

// ─── Dark Insight Panel (reusable) ──────────────────────────────────

const InsightPanel = ({
  insight,
}: {
  insight: {
    eyebrow: string;
    bullets: readonly string[];
    thesis: string;
    sources: readonly string[];
  };
}) => (
  <FadeIn>
    <div
      className="rounded-2xl p-8 md:p-12 mt-16"
      style={{ backgroundColor: COLORS.DEEP_GREEN }}
    >
      <p className="tracking-[0.25em] text-xs font-mono uppercase mb-4 text-white/50">
        {insight.eyebrow}
      </p>
      <ul className="space-y-3 mb-8">
        {insight.bullets.map((bullet, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm text-white/80"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS.CORAL }}
            />
            {bullet}
          </li>
        ))}
      </ul>
      <p className="text-base text-white/90 font-medium italic border-l-2 pl-4"
        style={{ borderColor: COLORS.CORAL }}
      >
        {insight.thesis}
      </p>
      <div className="flex gap-2 mt-6">
        {insight.sources.map((src) => (
          <a
            key={src}
            href={SRC[src as keyof typeof SRC]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono px-2 py-1 rounded bg-white/10 text-white/60 hover:text-white/90 transition-colors"
          >
            {src}
          </a>
        ))}
      </div>
    </div>
  </FadeIn>
);

// ─── Real-World Spotlight Box ────────────────────────────────────────

/** Company before/after spotlight */
const CompanySpotlightBox = ({ data }: { data: CompanySpotlight }) => (
  <FadeIn>
    <div
      className="rounded-2xl p-6 md:p-8 mt-8"
      style={{
        backgroundColor: "#FAFAF8",
        borderLeft: `4px solid ${COLORS.TEAL}`,
      }}
    >
      <p className="tracking-[0.25em] text-xs font-mono uppercase mb-3" style={{ color: COLORS.TEAL }}>
        Real World
      </p>
      <h5 className="font-display text-base font-semibold mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
        {data.company}
      </h5>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wide" style={{ color: COLORS.CORAL }}>Before</span>
          <p className="text-sm" style={{ color: COLORS.SLATE }}>{data.before}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wide" style={{ color: COLORS.FOREST }}>After</span>
          <p className="text-sm" style={{ color: COLORS.SLATE }}>{data.after}</p>
        </div>
      </div>
      <p className="text-xs mt-4 italic" style={{ color: COLORS.TEAL }}>
        Source: <SourceCite id={data.source as keyof typeof SRC} />
      </p>
    </div>
  </FadeIn>
);

/** Worker persona spotlight */
const PersonaBox = ({ data }: { data: WorkerPersona }) => (
  <FadeIn>
    <div
      className="rounded-2xl p-6 md:p-8 mt-8"
      style={{
        backgroundColor: "#FAFAF8",
        borderLeft: `4px solid ${COLORS.LAVENDER}`,
      }}
    >
      <p className="tracking-[0.25em] text-xs font-mono uppercase mb-3" style={{ color: COLORS.LAVENDER }}>
        Meet {data.name}
      </p>
      <p className="text-sm font-medium mb-1" style={{ color: COLORS.TEXT_PRIMARY }}>
        {data.role}
      </p>
      <p className="text-xs mb-4" style={{ color: COLORS.SLATE }}>
        {data.location} &middot; Age {data.age}
      </p>
      <blockquote className="text-sm italic border-l-2 pl-4 mb-4" style={{ color: COLORS.TEXT_PRIMARY, borderColor: COLORS.LAVENDER }}>
        &ldquo;{data.quote}&rdquo;
      </blockquote>
      <p className="text-xs" style={{ color: COLORS.TEAL }}>
        <span className="font-medium">AI toolkit:</span> {data.toolkit}
      </p>
    </div>
  </FadeIn>
);

// ─── Main Report Component ──────────────────────────────────────────

const AiJobsReport = () => {
  return (
    <article>
      {/* ━━━ SLIDE 1 — Hero ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{ backgroundColor: COLORS.IVORY }}
      >
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Transparent watermark */}
        <div className="absolute top-8 right-8 select-none pointer-events-none">
          <span
            className="font-display text-[12rem] md:text-[16rem] font-bold leading-none opacity-[0.035]"
            style={{ color: COLORS.DEEP_GREEN }}
          >
            01
          </span>
        </div>

        <div className="container-premium relative z-10 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Title block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <p
                className="tracking-[0.25em] text-xs font-mono uppercase mb-6"
                style={{ color: COLORS.SLATE }}
              >
                Research Report • 2024–2030
              </p>
              <h1
                className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] mb-2"
                style={{ color: COLORS.TEXT_PRIMARY }}
              >
                AI Jobs &
              </h1>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] mb-6">
                <span className="italic" style={{ color: COLORS.FOREST }}>
                  Future of Work
                </span>
                <span
                  className="block h-1 w-24 mt-3 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${COLORS.FOREST}, ${COLORS.TEAL})`,
                  }}
                />
              </h1>
              <p
                className="text-lg md:text-xl max-w-lg mb-8"
                style={{ color: COLORS.SLATE }}
              >
                A research-grade analysis for executives navigating the
                tectonic shift from labor displacement to cognitive
                augmentation.
              </p>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-mono uppercase tracking-wide"
                  style={{ color: COLORS.TEAL }}
                >
                  12 sources • 16 data points
                </span>
              </div>
            </motion.div>

            {/* Right: Hero KPI card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <div
                className="rounded-2xl p-8 md:p-10"
                style={{ backgroundColor: COLORS.DEEP_GREEN }}
              >
                {/* SVG chart visualization */}
                <div className="mb-8">
                  <svg
                    viewBox="0 0 300 120"
                    className="w-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Created bars */}
                    <rect
                      x="20"
                      y="20"
                      width="120"
                      height="28"
                      rx="4"
                      fill={COLORS.FOREST}
                      opacity="0.8"
                    />
                    <text
                      x="148"
                      y="39"
                      fill="white"
                      fontSize="13"
                      fontWeight="600"
                      fontFamily="Playfair Display, serif"
                    >
                      170M created
                    </text>
                    {/* Displaced bars */}
                    <rect
                      x="20"
                      y="56"
                      width="65"
                      height="28"
                      rx="4"
                      fill={COLORS.CORAL}
                      opacity="0.8"
                    />
                    <text
                      x="93"
                      y="75"
                      fill="white"
                      fontSize="13"
                      fontWeight="600"
                      fontFamily="Playfair Display, serif"
                    >
                      92M displaced
                    </text>
                    {/* Net bar */}
                    <rect
                      x="20"
                      y="92"
                      width="55"
                      height="28"
                      rx="4"
                      fill={COLORS.INDIGO}
                      opacity="0.8"
                    />
                    <text
                      x="83"
                      y="111"
                      fill="white"
                      fontSize="13"
                      fontWeight="600"
                      fontFamily="Playfair Display, serif"
                    >
                      +78M net
                    </text>
                  </svg>
                </div>

                {/* KPI metrics */}
                <div className="grid grid-cols-2 gap-4">
                  {heroKpis.map((kpi, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.5 + i * 0.1,
                        ease: "easeOut",
                      }}
                      className="border-t border-white/10 pt-3"
                    >
                      <p className="font-display text-2xl md:text-3xl font-semibold text-white">
                        {kpi.value}
                      </p>
                      <p className="text-xs text-white/60 mt-1">{kpi.label}</p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {kpi.trend}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━ SLIDE 2 — Executive Summary ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: COLORS.IVORY }}
      >
        <div className="container-premium">
          <FadeIn>
            <p
              className="tracking-[0.25em] text-xs font-mono uppercase mb-4"
              style={{ color: COLORS.SLATE }}
            >
              Executive Summary
            </p>
            <h2
              className="font-display text-3xl md:text-4xl font-medium"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              Four truths shaping the{" "}
              <span className="italic" style={{ color: COLORS.FOREST }}>
                next decade
              </span>
            </h2>
            <p className="text-lg mt-4 max-w-2xl" style={{ color: COLORS.SLATE }}>
              The narrative of AI-driven job loss is evolving. Our 2024–2026
              data suggests intense reconfiguration — not elimination.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {executiveSummaryPoints.map((point, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl p-6 md:p-8 h-full"
                  style={{
                    backgroundColor: "#FAFAF8",
                    borderTop: `3px solid ${point.accentColor}`,
                  }}
                >
                  <span
                    className="font-display text-4xl font-bold opacity-10"
                    style={{ color: point.accentColor }}
                  >
                    {point.number}
                  </span>
                  <h3
                    className="font-display text-xl font-medium mt-2 mb-3"
                    style={{ color: COLORS.TEXT_PRIMARY }}
                  >
                    {point.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: COLORS.SLATE }}>
                    {point.description}
                  </p>
                  <div className="mt-4">
                    <SourceCite id={point.source as keyof typeof SRC} />
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          {/* Real-world persona */}
          <PersonaBox data={workerPersonas.daniel} />

          {/* Dark insight panel */}
          <FadeIn>
            <div
              className="rounded-2xl p-8 md:p-12 mt-16"
              style={{ backgroundColor: COLORS.DEEP_GREEN }}
            >
              <p className="tracking-[0.25em] text-xs font-mono uppercase mb-4 text-white/50">
                The Bottom Line
              </p>
              <p className="text-lg md:text-xl text-white/90 font-medium italic max-w-3xl">
                "AI will not replace managers, but managers who use AI will
                replace those who do not. The talent gap is no longer about
                potential — it is about architectural fluency."
              </p>
              <p className="text-sm text-white/50 mt-4">
                — McKinsey Superagency Report, 2025
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━ SLIDE 3 — Displacement vs Creation ━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: "#FAFAF8" }}
      >
        {/* Section watermark */}
        <div className="container-premium relative">
          <div className="absolute -top-8 right-0 select-none pointer-events-none">
            <span
              className="font-display text-[10rem] font-bold leading-none opacity-[0.03]"
              style={{ color: COLORS.DEEP_GREEN }}
            >
              02
            </span>
          </div>

          <FadeIn>
            <p
              className="tracking-[0.25em] text-xs font-mono uppercase mb-4"
              style={{ color: COLORS.SLATE }}
            >
              Job Creation vs Displacement
            </p>
            <h2
              className="font-display text-3xl md:text-4xl font-medium"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              The{" "}
              <span className="italic" style={{ color: COLORS.FOREST }}>
                net equation
              </span>{" "}
              by 2030
            </h2>
            <p className="text-lg mt-4 max-w-2xl" style={{ color: COLORS.SLATE }}>
              Net positive does not mean low disruption — it means
              large-scale reallocation across sectors and skill levels.{" "}
              <SourceCite id="WEF" />
            </p>
          </FadeIn>

          {/* Big number strip */}
          <div className="grid grid-cols-3 gap-6 md:gap-8 mt-12">
            {Object.values(displacementStats).map((stat, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="text-center">
                  <p
                    className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-sm mt-2"
                    style={{ color: COLORS.SLATE }}
                  >
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Automation by task type */}
          <FadeIn>
            <div
              className="rounded-2xl p-8 md:p-10 mt-16"
              style={{ backgroundColor: "#FAFAF8", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <h3
                className="font-display text-xl font-medium mb-8"
                style={{ color: COLORS.TEXT_PRIMARY }}
              >
                Automation exposure by task type
              </h3>
              <div className="space-y-5">
                {displacementCategories.map((cat, i) => (
                  <AnimatedBar
                    key={i}
                    label={cat.label}
                    value={cat.value}
                    color={cat.color}
                    suffix="% exposed"
                  />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Real-world company spotlight */}
          <CompanySpotlightBox data={companySpotlights.intuit} />

          <InsightPanel insight={displacementInsight} />
        </div>
      </section>

      {/* ━━━ SLIDE 4 — Industry Exposure ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: COLORS.IVORY }}
      >
        <div className="container-premium relative">
          <div className="absolute -top-8 right-0 select-none pointer-events-none">
            <span
              className="font-display text-[10rem] font-bold leading-none opacity-[0.03]"
              style={{ color: COLORS.DEEP_GREEN }}
            >
              03
            </span>
          </div>

          <FadeIn>
            <p
              className="tracking-[0.25em] text-xs font-mono uppercase mb-4"
              style={{ color: COLORS.SLATE }}
            >
              Industry Deep Dive
            </p>
            <h2
              className="font-display text-3xl md:text-4xl font-medium"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              Who's most{" "}
              <span className="italic" style={{ color: COLORS.CORAL }}>
                exposed
              </span>
              ?
            </h2>
            <p className="text-lg mt-4 max-w-2xl" style={{ color: COLORS.SLATE }}>
              Exposure varies dramatically by sector — from 60% in
              financial services to just 6% in construction.{" "}
              <SourceCite id="GOLDMAN" /> <SourceCite id="BROOKINGS" />
            </p>
          </FadeIn>

          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {exposureKpis.map((kpi, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div
                  className="rounded-xl p-5 text-center"
                  style={{ backgroundColor: "#FAFAF8" }}
                >
                  <p
                    className="font-display text-2xl font-semibold"
                    style={{ color: kpi.color }}
                  >
                    {kpi.value}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: COLORS.SLATE }}
                  >
                    {kpi.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Industry cards grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {industryExposure.map((data, i) => (
              <ExposureCard key={i} data={data} index={i} />
            ))}
          </div>

          {/* Real-world company spotlight */}
          <CompanySpotlightBox data={companySpotlights.jpmorgan} />

          <InsightPanel
            insight={{
              eyebrow: "Sector Intelligence",
              bullets: [
                "Financial services and legal face the highest white-collar automation risk",
                "Construction and skilled trades remain largely insulated — physical dexterity is hard to automate",
                "Healthcare sits in the middle: AI augments diagnostics but can't replace bedside care",
                "The key differentiator isn't industry — it's task composition. Routine cognitive work is most vulnerable.",
              ],
              thesis:
                "Every industry will be transformed, but not every job within an industry is equally at risk. The granularity is at the task level, not the job level.",
              sources: ["GOLDMAN", "BROOKINGS", "MCKINSEY"],
            }}
          />
        </div>
      </section>

      {/* ━━━ SLIDE 5 — Skills Gap ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: "#FAFAF8" }}
      >
        <div className="container-premium relative">
          <div className="absolute -top-8 right-0 select-none pointer-events-none">
            <span
              className="font-display text-[10rem] font-bold leading-none opacity-[0.03]"
              style={{ color: COLORS.DEEP_GREEN }}
            >
              04
            </span>
          </div>

          <FadeIn>
            <p
              className="tracking-[0.25em] text-xs font-mono uppercase mb-4"
              style={{ color: COLORS.SLATE }}
            >
              The Skills Crisis
            </p>
            <h2
              className="font-display text-3xl md:text-4xl font-medium"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              Skills have an{" "}
              <span className="italic" style={{ color: COLORS.INDIGO }}>
                18-month half-life
              </span>
            </h2>
            <p className="text-lg mt-4 max-w-2xl" style={{ color: COLORS.SLATE }}>
              40% of the global workforce needs reskilling within 3 years.
              The gap between what employers need and what workers have is
              widening.{" "}
              <SourceCite id="IBM" />
            </p>
          </FadeIn>

          {/* Half-life callout */}
          <FadeIn>
            <div
              className="rounded-2xl p-8 md:p-10 mt-12 text-center"
              style={{
                backgroundColor: COLORS.DEEP_GREEN,
              }}
            >
              <p className="text-white/50 text-xs font-mono uppercase tracking-wide mb-2">
                {skillsHalfLife.label}
              </p>
              <p className="font-display text-6xl md:text-7xl font-bold text-white">
                {skillsHalfLife.value}
              </p>
              <p className="text-white/60 text-lg mt-1">
                {skillsHalfLife.unit}
              </p>
              <p className="text-white/40 text-xs mt-2">
                <SourceCite id="IBM" />
              </p>
            </div>
          </FadeIn>

          {/* Skills gap bars */}
          <FadeIn>
            <div className="mt-12">
              <h3
                className="font-display text-xl font-medium mb-2"
                style={{ color: COLORS.TEXT_PRIMARY }}
              >
                Workforce Skills Matrix
              </h3>
              <p className="text-sm mb-8" style={{ color: COLORS.SLATE }}>
                Current proficiency vs. market requirements (darker = required,
                lighter = current)
              </p>
              <div className="space-y-6">
                {skillsMatrix.map((data, i) => (
                  <SkillBar key={i} data={data} index={i} />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Real-world company spotlight */}
          <CompanySpotlightBox data={companySpotlights.amazon_reskill} />

          <InsightPanel insight={skillsInsight} />
        </div>
      </section>

      {/* ━━━ SLIDE 6 — Wages & Productivity ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: COLORS.IVORY }}
      >
        <div className="container-premium relative">
          <div className="absolute -top-8 right-0 select-none pointer-events-none">
            <span
              className="font-display text-[10rem] font-bold leading-none opacity-[0.03]"
              style={{ color: COLORS.DEEP_GREEN }}
            >
              05
            </span>
          </div>

          <FadeIn>
            <p
              className="tracking-[0.25em] text-xs font-mono uppercase mb-4"
              style={{ color: COLORS.SLATE }}
            >
              Economic Impact
            </p>
            <h2
              className="font-display text-3xl md:text-4xl font-medium"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              The AI{" "}
              <span className="italic" style={{ color: COLORS.FOREST }}>
                wage premium
              </span>
            </h2>
            <p className="text-lg mt-4 max-w-2xl" style={{ color: COLORS.SLATE }}>
              AI-skilled workers earn 25% more. AI-exposed sectors show
              4.8× higher productivity growth. The economic divergence is
              accelerating.{" "}
              <SourceCite id="PWC" />
            </p>
          </FadeIn>

          {/* Wage stat strip */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {wageStats.map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-6 md:p-8 text-center"
                  style={{ backgroundColor: "#FAFAF8" }}
                >
                  <p
                    className="font-display text-3xl md:text-4xl font-semibold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-sm font-medium mt-2"
                    style={{ color: COLORS.TEXT_PRIMARY }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: COLORS.SLATE }}
                  >
                    {stat.sublabel}
                  </p>
                  <div className="mt-2">
                    <SourceCite id={stat.source as keyof typeof SRC} />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Productivity by sector */}
          <FadeIn>
            <div className="mt-16">
              <h3
                className="font-display text-xl font-medium mb-2"
                style={{ color: COLORS.TEXT_PRIMARY }}
              >
                Productivity gains by sector
              </h3>
              <p className="text-sm mb-8" style={{ color: COLORS.SLATE }}>
                Measured output increase per FTE hour — with real-world
                company examples
              </p>
              <div className="space-y-5">
                {productivityBySector.map((data, i) => (
                  <ProductivityBar key={i} data={data} index={i} />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Real-world persona */}
          <PersonaBox data={workerPersonas.priya} />

          <InsightPanel insight={wageInsight} />
        </div>
      </section>

      {/* ━━━ SLIDE 7 — Emerging & Resilient Roles ━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: "#FAFAF8" }}
      >
        <div className="container-premium relative">
          <div className="absolute -top-8 right-0 select-none pointer-events-none">
            <span
              className="font-display text-[10rem] font-bold leading-none opacity-[0.03]"
              style={{ color: COLORS.DEEP_GREEN }}
            >
              06
            </span>
          </div>

          <FadeIn>
            <p
              className="tracking-[0.25em] text-xs font-mono uppercase mb-4"
              style={{ color: COLORS.SLATE }}
            >
              The New Labor Market
            </p>
            <h2
              className="font-display text-3xl md:text-4xl font-medium"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              Roles that{" "}
              <span className="italic" style={{ color: COLORS.FOREST }}>
                emerge
              </span>{" "}
              &amp; roles that{" "}
              <span className="italic" style={{ color: COLORS.TEAL }}>
                endure
              </span>
            </h2>
            <p className="text-lg mt-4 max-w-2xl" style={{ color: COLORS.SLATE }}>
              The fastest-growing jobs didn't exist 5 years ago. The most
              resilient ones share a common trait: embodied, contextual
              intelligence.{" "}
              <SourceCite id="WEF" />
            </p>
          </FadeIn>

          {/* Emerging roles */}
          <FadeIn>
            <h3
              className="font-display text-xl font-medium mt-12 mb-6"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              Fastest-growing AI roles
            </h3>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {emergingRoles.map((role, i) => (
              <RoleCard key={i} data={role} index={i} variant="emerging" />
            ))}
          </div>

          {/* Non-replaceable roles */}
          <FadeIn>
            <h3
              className="font-display text-xl font-medium mt-16 mb-6"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              AI-resilient roles
            </h3>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {nonReplaceableRoles.map((role, i) => (
              <RoleCard key={i} data={role} index={i} variant="stable" />
            ))}
          </div>

          <InsightPanel insight={rolesInsight} />
        </div>
      </section>

      {/* ━━━ SLIDE 8 — Geographic Impact ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: COLORS.IVORY }}
      >
        <div className="container-premium relative">
          <div className="absolute -top-8 right-0 select-none pointer-events-none">
            <span
              className="font-display text-[10rem] font-bold leading-none opacity-[0.03]"
              style={{ color: COLORS.DEEP_GREEN }}
            >
              07
            </span>
          </div>

          <FadeIn>
            <p
              className="tracking-[0.25em] text-xs font-mono uppercase mb-4"
              style={{ color: COLORS.SLATE }}
            >
              Geographic Lens
            </p>
            <h2
              className="font-display text-3xl md:text-4xl font-medium"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              The{" "}
              <span className="italic" style={{ color: COLORS.TEAL }}>
                global divide
              </span>
            </h2>
            <p className="text-lg mt-4 max-w-2xl" style={{ color: COLORS.SLATE }}>
              60% of advanced economy jobs face significant AI disruption
              vs 26% in developing nations — but fewer safety nets exist
              where they're needed most.{" "}
              <SourceCite id="GOLDMAN" />
            </p>
          </FadeIn>

          {/* Geographic stat strip */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {geographicStats.map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-6 md:p-8 text-center"
                  style={{ backgroundColor: "#FAFAF8" }}
                >
                  <p
                    className="font-display text-3xl md:text-4xl font-semibold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-sm font-medium mt-2"
                    style={{ color: COLORS.TEXT_PRIMARY }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: COLORS.SLATE }}
                  >
                    {stat.sublabel}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Region bars */}
          <FadeIn>
            <div className="mt-12">
              <h3
                className="font-display text-xl font-medium mb-8"
                style={{ color: COLORS.TEXT_PRIMARY }}
              >
                Regional exposure rates
              </h3>
              <div className="space-y-6">
                {geographicRegions.map((data, i) => (
                  <RegionBar key={i} data={data} index={i} />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Real-world company spotlight */}
          <CompanySpotlightBox data={companySpotlights.singapore} />

          <InsightPanel insight={geographicInsight} />
        </div>
      </section>

      {/* ━━━ SLIDE 9 — Policy Framework ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: "#FAFAF8" }}
      >
        <div className="container-premium relative">
          <div className="absolute -top-8 right-0 select-none pointer-events-none">
            <span
              className="font-display text-[10rem] font-bold leading-none opacity-[0.03]"
              style={{ color: COLORS.DEEP_GREEN }}
            >
              08
            </span>
          </div>

          <FadeIn>
            <p
              className="tracking-[0.25em] text-xs font-mono uppercase mb-4"
              style={{ color: COLORS.SLATE }}
            >
              Strategic Response
            </p>
            <h2
              className="font-display text-3xl md:text-4xl font-medium"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              A{" "}
              <span className="italic" style={{ color: COLORS.FOREST }}>
                three-actor
              </span>{" "}
              framework
            </h2>
            <p className="text-lg mt-4 max-w-2xl" style={{ color: COLORS.SLATE }}>
              Navigating the AI transition requires coordinated action
              from governments, corporations, and individuals.{" "}
              <SourceCite id="OECD" /> <SourceCite id="MCKINSEY" />
            </p>
          </FadeIn>

          {/* Policy framework cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {policyFramework.map((actor, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-6 md:p-8 h-full"
                  style={{
                    backgroundColor: "#FAFAF8",
                    borderTop: `3px solid ${actor.accentColor}`,
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderTopWidth: "3px",
                    borderTopColor: actor.accentColor,
                  }}
                >
                  <h4
                    className="font-display text-lg font-medium mb-4"
                    style={{ color: COLORS.TEXT_PRIMARY }}
                  >
                    {actor.actor}
                  </h4>
                  <ul className="space-y-3">
                    {actor.actions.map((action, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm"
                        style={{ color: COLORS.SLATE }}
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: actor.accentColor }}
                        />
                        {action}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <SourceCite id={actor.source as keyof typeof SRC} />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <InsightPanel insight={policyInsight} />
        </div>
      </section>

      {/* ━━━ SLIDE 10 — Predictions Timeline ━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: COLORS.IVORY }}
      >
        <div className="container-premium relative">
          <div className="absolute -top-8 right-0 select-none pointer-events-none">
            <span
              className="font-display text-[10rem] font-bold leading-none opacity-[0.03]"
              style={{ color: COLORS.DEEP_GREEN }}
            >
              09
            </span>
          </div>

          <FadeIn>
            <p
              className="tracking-[0.25em] text-xs font-mono uppercase mb-4"
              style={{ color: COLORS.SLATE }}
            >
              Forward Look
            </p>
            <h2
              className="font-display text-3xl md:text-4xl font-medium"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              The road to{" "}
              <span className="italic" style={{ color: COLORS.INDIGO }}>
                2030
              </span>
            </h2>
            <p className="text-lg mt-4 max-w-2xl" style={{ color: COLORS.SLATE }}>
              Four inflection points between now and the new equilibrium.
            </p>
          </FadeIn>

          {/* Timeline */}
          <div className="relative mt-16">
            {/* Vertical spine */}
            <div
              className="absolute left-6 md:left-8 top-0 bottom-0 w-px"
              style={{ backgroundColor: `${COLORS.DEEP_GREEN}20` }}
            />

            <div className="space-y-12">
              {predictions.map((pred, i) => (
                <FadeIn key={i} delay={i * 0.12}>
                  <div className="flex gap-6 md:gap-8 items-start">
                    {/* Year dot */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: pred.active
                            ? COLORS.DEEP_GREEN
                            : "#FAFAF8",
                          border: pred.active
                            ? "none"
                            : `2px solid ${COLORS.DEEP_GREEN}20`,
                        }}
                      >
                        <span
                          className="font-display text-sm md:text-base font-semibold"
                          style={{
                            color: pred.active
                              ? "white"
                              : COLORS.TEXT_PRIMARY,
                          }}
                        >
                          {pred.year}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-2 md:pt-3">
                      <div className="flex items-baseline gap-3 mb-2">
                        <h4
                          className="font-display text-lg font-medium"
                          style={{ color: COLORS.TEXT_PRIMARY }}
                        >
                          {pred.title}
                        </h4>
                        <span
                          className="text-xs font-mono px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: pred.active
                              ? `${COLORS.INDIGO}20`
                              : `${COLORS.SLATE}15`,
                            color: pred.active
                              ? COLORS.INDIGO
                              : COLORS.SLATE,
                          }}
                        >
                          {pred.confidence}
                        </span>
                      </div>
                      <p
                        className="text-sm max-w-lg"
                        style={{ color: COLORS.SLATE }}
                      >
                        {pred.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Real-world persona */}
          <PersonaBox data={workerPersonas.james} />

          {/* Prediction stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-16">
            {predictionCards.map((card, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div
                  className="rounded-xl p-5 text-center"
                  style={{ backgroundColor: "#FAFAF8" }}
                >
                  <p
                    className="font-display text-xl md:text-2xl font-semibold"
                    style={{ color: COLORS.FOREST }}
                  >
                    {card.stat}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: COLORS.SLATE }}
                  >
                    {card.label}
                  </p>
                  <div className="mt-1">
                    <SourceCite id={card.source as keyof typeof SRC} />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ SLIDE 11 — Closing Vision ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="relative min-h-[80vh] flex items-center overflow-hidden"
        style={{ backgroundColor: COLORS.DEEP_GREEN }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${COLORS.FOREST}40 0%, transparent 70%)`,
          }}
        />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="container-premium relative z-10 py-24 md:py-32 text-center">
          <FadeIn>
            <p className="tracking-[0.25em] text-xs font-mono uppercase mb-8 text-white/40">
              The Outlook
            </p>
            <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl font-medium text-white/90 italic max-w-4xl mx-auto leading-relaxed">
              "{visionQuote}"
            </blockquote>
            <div
              className="h-px w-16 mx-auto my-10"
              style={{ backgroundColor: `${COLORS.CORAL}60` }}
            />
          </FadeIn>

          {/* Closing persona — brings back Priya */}
          <FadeIn delay={0.2}>
            <div className="max-w-2xl mx-auto mt-10 rounded-2xl p-6 md:p-8 text-left"
              style={{ backgroundColor: `${COLORS.IVORY}10`, borderLeft: `4px solid ${COLORS.LAVENDER}` }}
            >
              <p className="tracking-[0.25em] text-xs font-mono uppercase mb-3" style={{ color: COLORS.LAVENDER }}>
                Priya's Story Continues
              </p>
              <p className="text-sm text-white/80 italic leading-relaxed">
                "Six months after our AI rollout, I was promoted to team lead. I now train 12 adjusters
                on AI-augmented workflows. Our team processes 3x the claims with higher accuracy —
                and I'm home for dinner every night. The technology didn't replace me. It made my
                expertise more valuable."
              </p>
              <p className="text-xs text-white/40 mt-3">
                Mumbai, India &middot; Claims AI team lead &middot; Age 31
              </p>
            </div>
          </FadeIn>

          {/* Closing metrics */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-8">
            {visionMetrics.map((metric, i) => (
              <FadeIn key={i} delay={i * 0.15 + 0.3}>
                <div>
                  <p className="font-display text-3xl md:text-4xl font-semibold text-white">
                    {metric.value}
                  </p>
                  <p className="text-xs text-white/50 mt-2">
                    {metric.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: COLORS.IVORY }}
      >
        <div className="container-premium">
          <DarkCTASection
            title="Ready to future-proof your workforce?"
            subtitle="Get the complete research report with implementation playbooks and reskilling frameworks."
            primaryButton={{
              label: "Book Strategy Session",
              href: "#",
            }}
            secondaryButton={{
              label: "Download Executive Brief",
              href: "#",
            }}
          />
        </div>
      </section>

      {/* ━━━ Sources & Methodology ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: "#FAFAF8" }}
      >
        <div className="container-premium">
          <SourcesSection
            sources={[...sources]}
            methodology={methodology}
            definitions={[...definitions]}
            limitations={[...limitations]}
          />
        </div>
      </section>
    </article>
  );
};

export default AiJobsReport;
