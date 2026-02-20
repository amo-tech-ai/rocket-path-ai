// AI Adoption by Industry — Luxury editorial infographic report
// 12-section layout · McKinsey × BCG × OECD aesthetic
// Color system: #F1EEEA ivory canvas · #12211D deep green · #0E3E1B forest accent

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ReportSection,
  DarkCTASection,
  SourcesSection,
} from "@/components/blog";

import {
  heroKpis,
  executiveSummaryPoints,
  executivePullQuote,
  adoptionByIndustry,
  industryDeepDives,
  genAiUseCases,
  productivityStats,
  investmentByRegion,
  investmentStats,
  valueGapData,
  scalingFramework,
  predictions,
  caseStudies,
  sources,
} from "./data/aiAdoptionData";

// ─── Color constants ───
const IVORY = "#F1EEEA";
const DEEP_GREEN = "#12211D";
const FOREST = "#0E3E1B";
const TEAL = "#2A4E45";
const SLATE = "#697485";
const LAVENDER = "#CB9FD2";
const CORAL = "#FFC9C1";
const TEXT_PRIMARY = "#212427";
const INDIGO = "#6366F1";

// ─── Reusable scroll-triggered wrapper ───
const FadeIn = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Inline source citation (clickable link) ───
const SourceCite = ({
  label,
  url,
  dark = false,
}: {
  label: string;
  url: string;
  dark?: boolean;
}) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-[11px] font-mono underline decoration-dotted underline-offset-2 hover:decoration-solid transition-colors"
    style={{ color: dark ? "rgba(255,255,255,0.45)" : `${SLATE}90` }}
  >
    {label}
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  </a>
);

// Source URL map for inline references
const SRC = {
  mckinsey: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
  oecd: "https://www.oecd.org/en/blogs/2025/02/how-do-different-sectors-engage-with-ai.html",
  pwc: "https://www.pwc.com/us/en/tech-effect/ai-analytics/ai-predictions.html",
  bcg: "https://www.bcg.com/publications/2024/maximizing-return-on-ai-investment",
  hai: "https://aiindex.stanford.edu/report/",
  openai: "https://openai.com/index/the-state-of-enterprise-ai/",
  bloomberg: "https://www.bloomberg.com/professional/insights/trading/generative-ai-outlook/",
  coherent: "https://www.coherentsolutions.com/insights/ai-adoption-trends-you-should-not-miss-2025",
  aloa: "https://aloa.co/ai/resources/industry-insights/ai-adoption-by-industry",
  vention: "https://ventionteams.com/solutions/ai/adoption-statistics",
};

// ─── Extracted sub-components (hooks must be at component top level) ───

const AnimatedBar = ({
  name,
  value,
  color,
  index,
  showDot = false,
  bgTrack = `${SLATE}12`,
  labelColor = TEXT_PRIMARY,
  valueSize = "text-2xl",
  barHeight = "h-3",
}: {
  name: string;
  value: number;
  color: string;
  index: number;
  showDot?: boolean;
  bgTrack?: string;
  labelColor?: string;
  valueSize?: string;
  barHeight?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref}>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: labelColor }}>
          {name}
        </span>
        <span className={`font-display ${valueSize} font-medium tracking-tight`} style={{ color: labelColor }}>
          {value}%
        </span>
      </div>
      <div className={`${barHeight} rounded-full`} style={{ backgroundColor: bgTrack }}>
        <motion.div
          className="h-full rounded-full relative"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
        >
          {showDot && (
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{ backgroundColor: CORAL }}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.2 }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

const UseCaseBar = ({
  name,
  description,
  percentage,
  maxPct,
  color,
  index,
  example,
}: {
  name: string;
  description: string;
  percentage: number;
  maxPct: number;
  color: string;
  index: number;
  example?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref}>
      <div className="flex justify-between mb-1.5">
        <div>
          <span className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>
            {name}
          </span>
          <span className="text-xs ml-3" style={{ color: SLATE }}>
            {description}
          </span>
        </div>
        <span className="font-display text-2xl font-medium tracking-tight" style={{ color: TEXT_PRIMARY }}>
          {percentage}%
        </span>
      </div>
      <div className="h-3 rounded-full" style={{ backgroundColor: `${SLATE}12` }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${(percentage / maxPct) * 100}%` } : {}}
          transition={{ duration: 0.8, delay: 0.2 + index * 0.08 }}
        />
      </div>
      {example && (
        <p className="mt-1.5 text-xs italic leading-relaxed" style={{ color: TEAL }}>
          {example}
        </p>
      )}
    </div>
  );
};

const RegionBar = ({
  region,
  amount,
  unit,
  share,
  color,
  index,
}: {
  region: string;
  amount: number;
  unit: string;
  share: number;
  color: string;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref}>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-white/80">{region}</span>
        <span className="font-display text-lg font-medium text-white">
          ${amount}{unit}
        </span>
      </div>
      <div className="h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${share}%` } : {}}
          transition={{ duration: 0.8, delay: 0.2 + index * 0.12 }}
        />
      </div>
    </div>
  );
};

const RuleSegment = ({
  share,
  label,
  description,
  example,
  color,
  index,
}: {
  share: number;
  label: string;
  description: string;
  example?: string;
  color: string;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="flex items-start gap-6"
    >
      <div
        className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: color }}
      >
        <span className="font-display text-2xl font-bold text-white">{share}%</span>
      </div>
      <div className="flex-1">
        <p className="font-medium text-base" style={{ color: TEXT_PRIMARY }}>{label}</p>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: SLATE }}>{description}</p>
        {example && (
          <p className="mt-2 text-xs leading-relaxed italic" style={{ color: TEAL }}>
            {example}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const MaturityBar = ({
  stages,
}: {
  stages: { stage: string; share: number; color: string }[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className="flex h-10 rounded-full overflow-hidden">
      {stages.map((stage, i) => (
        <motion.div
          key={stage.stage}
          initial={{ width: 0 }}
          animate={inView ? { width: `${stage.share}%` } : {}}
          transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
          className="h-full flex items-center justify-center"
          style={{ backgroundColor: stage.color }}
        >
          <span className="text-[10px] font-medium text-white whitespace-nowrap px-1">
            {stage.stage} {stage.share}%
          </span>
        </motion.div>
      ))}
    </div>
  );
};

const BarrierRow = ({
  barrier,
  rank,
  percentage,
  source,
  description,
  index,
}: {
  barrier: string;
  rank: number;
  percentage: number;
  source: string;
  description?: string;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-xl p-5"
      style={{
        backgroundColor: "#FAFAF8",
        borderLeft: `3px solid ${CORAL}`,
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-display text-sm font-bold"
          style={{ backgroundColor: `${CORAL}20`, color: CORAL }}
        >
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>{barrier}</p>
          <p className="text-[10px] font-mono" style={{ color: `${SLATE}80` }}>{source}</p>
        </div>
        <span className="font-display text-xl font-semibold shrink-0" style={{ color: TEXT_PRIMARY }}>
          {percentage}%
        </span>
      </div>
      {description && (
        <p className="mt-3 ml-14 text-xs leading-relaxed" style={{ color: SLATE }}>
          {description}
        </p>
      )}
    </motion.div>
  );
};

const AiAdoptionReport = () => {
  return (
    <article>
      {/* ━━━ SLIDE 1: Hero — Split Editorial + Radial Chart ━━━ */}
      <section
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{ backgroundColor: IVORY }}
      >
        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Large transparent "01" watermark */}
        <div
          className="absolute right-8 top-1/2 -translate-y-1/2 font-display font-medium select-none pointer-events-none hidden lg:block"
          style={{
            fontSize: "clamp(16rem, 22vw, 24rem)",
            color: `${FOREST}06`,
            lineHeight: 0.85,
          }}
        >
          01
        </div>

        <div className="relative container-premium py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* ── Left Column: Editorial Headline ── */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xs font-medium tracking-[0.25em] uppercase mb-6"
                style={{ color: FOREST }}
              >
                Industry Research Report · 2025
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
              >
                <h1
                  className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[5rem] font-medium tracking-tight leading-[1.06]"
                  style={{ color: TEXT_PRIMARY }}
                >
                  AI Adoption{" "}
                  <span style={{ color: FOREST }}>by Industry</span>
                </h1>
                {/* Indigo gradient underline */}
                <motion.div
                  className="mt-5"
                  style={{
                    height: 3,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${INDIGO} 0%, ${LAVENDER} 60%, transparent 100%)`,
                    maxWidth: 240,
                  }}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-7 text-base md:text-lg font-body leading-relaxed max-w-md"
                style={{ color: SLATE }}
              >
                Which industries are actually using AI, what they use it for,
                and what results they're seeing — backed by data from McKinsey, OECD,
                PwC, BCG, and Stanford HAI.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
                className="mt-4 text-sm font-medium font-body italic"
                style={{ color: TEAL }}
              >
                72% of organizations now use AI — but only 4% see substantial returns.
              </motion.p>

              {/* Key metrics row */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-10 flex flex-wrap gap-8"
              >
                {heroKpis.slice(0, 3).map((m) => (
                  <div key={m.label}>
                    <p
                      className="font-display text-3xl md:text-4xl font-medium tracking-tight"
                      style={{ color: FOREST }}
                    >
                      {m.value}
                    </p>
                    <p className="mt-1 text-xs tracking-wider uppercase" style={{ color: SLATE }}>
                      {m.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Right Column: Adoption Radial Chart ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              {/* Chart container */}
              <div
                className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
                style={{
                  backgroundColor: DEEP_GREEN,
                  boxShadow: `0 32px 64px -12px ${DEEP_GREEN}40`,
                }}
              >
                {/* Soft emerald glow */}
                <div
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-30"
                  style={{ backgroundColor: FOREST }}
                />

                {/* Chart header */}
                <div className="relative mb-8">
                  <p className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: LAVENDER }}>
                    Adoption by Industry · 2024–2025
                  </p>
                  <p className="mt-1 text-sm" style={{ color: "#AEB5C2" }}>
                    Top 5 sectors by AI adoption rate
                  </p>
                </div>

                {/* SVG Horizontal Bar Chart — Top 5 */}
                <div className="relative space-y-5">
                  {adoptionByIndustry.slice(0, 5).map((item, i) => (
                    <div key={item.name}>
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-xs font-medium text-white/80">{item.name}</span>
                        <span className="font-display text-lg font-semibold text-white">
                          {item.adoption}%
                        </span>
                      </div>
                      <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.adoption}%` }}
                          transition={{ duration: 1, delay: 0.8 + i * 0.15, ease: "easeOut" }}
                          className="h-full rounded-full relative"
                          style={{ backgroundColor: item.color }}
                        >
                          {/* Endpoint dot */}
                          <motion.div
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                            style={{ backgroundColor: CORAL }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 0 }}
                            transition={{ delay: 1.8 + i * 0.15 }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 72% callout */}
                <motion.div
                  className="absolute top-8 right-8 text-right"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.2, duration: 0.5 }}
                >
                  <p className="font-display text-4xl md:text-5xl font-medium tracking-tight text-white">
                    72%
                  </p>
                  <p className="mt-1 text-[11px] tracking-wider uppercase" style={{ color: LAVENDER }}>
                    using AI
                  </p>
                </motion.div>

                {/* Legend */}
                <div className="relative mt-6 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-0.5" style={{ backgroundColor: FOREST }} />
                    <span className="text-xs text-white">Tech & SaaS (88%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-0.5" style={{ backgroundColor: SLATE, opacity: 0.7 }} />
                    <span className="text-xs" style={{ color: "#AEB5C2" }}>Education (8%)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━ THE SCALING GAP — Editorial Metrics ━━━ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: IVORY }}>
        <div className="container-premium max-w-5xl mx-auto">
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase mb-4 text-center"
              style={{ color: INDIGO }}
            >
              The Scaling Gap
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-center"
              style={{ color: TEXT_PRIMARY }}
            >
              Everyone's Adopting. Almost Nobody's Scaling.
            </h2>
            <div
              className="mx-auto mt-4 w-16 h-0.5"
              style={{ backgroundColor: `${INDIGO}40` }}
            />
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-14">
              {[
                {
                  number: "72%",
                  descriptor: "Organizations Using AI",
                  explanation: "Up from 55% just one year ago. Gen AI adoption jumped from 33% to 65% in 10 months. The question has shifted from 'if' to 'how fast.'",
                  sourceLabel: "McKinsey 2024 Survey",
                  sourceUrl: SRC.mckinsey,
                },
                {
                  number: "74%",
                  descriptor: "Stuck Before Returns",
                  explanation: "Only 26% of companies have moved beyond proof-of-concept. The gap between experimentation and value extraction is the defining challenge.",
                  sourceLabel: "BCG 2024",
                  sourceUrl: SRC.bcg,
                },
                {
                  number: "3.7×",
                  descriptor: "Gen AI ROI",
                  explanation: "Per dollar invested. But that return concentrates in the top quartile — the companies that redesign workflows, not just add tools.",
                  sourceLabel: "Coherent Solutions 2025",
                  sourceUrl: SRC.coherent,
                },
                {
                  number: "$250B+",
                  descriptor: "Private AI Investment",
                  explanation: "Global private AI investment in 2024. The US alone accounts for $109B — 12× China's spend.",
                  sourceLabel: "Stanford HAI 2025",
                  sourceUrl: SRC.hai,
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.descriptor}
                  className="relative"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <p
                    className="font-display font-medium tracking-tight"
                    style={{
                      color: TEXT_PRIMARY,
                      fontSize: "clamp(3rem, 5vw, 4.5rem)",
                      lineHeight: 1,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {stat.number}
                  </p>
                  <p
                    className="mt-3 text-sm font-medium tracking-[0.1em] uppercase"
                    style={{ color: FOREST }}
                  >
                    {stat.descriptor}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: SLATE }}>
                    {stat.explanation}
                  </p>
                  <div className="mt-2">
                    <SourceCite label={stat.sourceLabel} url={stat.sourceUrl} />
                  </div>
                  {/* Thin structural line */}
                  {i < 2 && (
                    <div
                      className="hidden sm:block absolute -bottom-7 left-0 right-0 h-px"
                      style={{ backgroundColor: `${SLATE}18` }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* Horizontal divider */}
          <FadeIn delay={0.4}>
            <div
              className="mt-16 mx-auto h-px"
              style={{ backgroundColor: `${SLATE}20`, maxWidth: "80%" }}
            />
          </FadeIn>

          {/* Closing thesis */}
          <FadeIn delay={0.5}>
            <p
              className="mt-10 text-center font-display text-xl md:text-2xl font-medium tracking-tight leading-relaxed"
              style={{ color: TEXT_PRIMARY }}
            >
              AI delivers value when workflows change, not when tools are added.{" "}
              <span style={{ color: INDIGO }}>The winners redesign how work gets done.</span>
            </p>
            <div className="mt-3 text-center">
              <SourceCite label="BCG — Where's the Value in AI? (2024)" url={SRC.bcg} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━ SLIDE 2: Executive Summary — 4 Forces ━━━ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: IVORY }}>
        <div className="container-premium">
          {/* Header */}
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase mb-4"
              style={{ color: FOREST }}
            >
              Executive Summary
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight max-w-3xl"
              style={{ color: TEXT_PRIMARY }}
            >
              Four Things You Need to Know
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: SLATE }}>
              AI adoption is accelerating — but scaling remains the bottleneck.
              Here are the four insights that matter most.
            </p>
          </FadeIn>

          {/* 4-Card Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {executiveSummaryPoints.map((point, i) => {
              const accents = [FOREST, CORAL, INDIGO, LAVENDER];
              return (
                <FadeIn key={point.title} delay={i * 0.1}>
                  <motion.div
                    className="rounded-xl p-7 h-full relative overflow-hidden group"
                    style={{
                      backgroundColor: "#FAFAF8",
                      borderTop: `3px solid ${accents[i]}`,
                    }}
                    whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  >
                    <p
                      className="font-display text-4xl font-medium tracking-tight"
                      style={{ color: accents[i], lineHeight: 1 }}
                    >
                      0{i + 1}
                    </p>
                    <p
                      className="mt-4 text-sm font-semibold tracking-[0.08em] uppercase"
                      style={{ color: TEXT_PRIMARY }}
                    >
                      {point.title}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed" style={{ color: SLATE }}>
                      {point.description}
                    </p>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>

          {/* Dark Insight Panel */}
          <FadeIn delay={0.5}>
            <div
              className="mt-14 rounded-xl p-8 md:p-10"
              style={{ backgroundColor: DEEP_GREEN }}
            >
              <p className="font-display text-xl md:text-2xl font-medium tracking-tight leading-relaxed" style={{ color: IVORY }}>
                {executivePullQuote.quote}{" "}
                <span style={{ color: LAVENDER }}>
                  The companies seeing 1.5× revenue growth aren't buying better tools — they're redesigning how work gets done.
                </span>
              </p>
              <p className="mt-4 text-xs tracking-wider uppercase" style={{ color: `${SLATE}` }}>
                — {executivePullQuote.author}, {executivePullQuote.role}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━ SLIDE 3: Adoption Rankings — Horizontal Bar Chart ━━━ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: IVORY }}>
        <div className="container-premium">
          {/* Header */}
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase mb-4"
              style={{ color: FOREST }}
            >
              Industry Rankings · 2024–2025
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight max-w-3xl"
              style={{ color: TEXT_PRIMARY }}
            >
              Who's Actually Using AI?
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: SLATE }}>
              Adoption rates across 10 industries — from near-universal in tech to barely emerging in education.
            </p>
          </FadeIn>

          {/* Full-width horizontal bars */}
          <FadeIn delay={0.15}>
            <div className="mt-16">
              <p className="text-xs font-medium tracking-[0.15em] uppercase mb-8" style={{ color: SLATE }}>
                Organization-wide AI Adoption Rate
              </p>
              <div className="space-y-6">
                {adoptionByIndustry.map((item, i) => (
                  <AnimatedBar
                    key={item.name}
                    name={item.name}
                    value={item.adoption}
                    color={item.color}
                    index={i}
                    showDot={i === 0}
                  />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* KPI Strip below chart */}
          <FadeIn delay={0.3}>
            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: "88%", label: "Tech leads adoption", accent: FOREST },
                { value: "11×", label: "Gap between Tech and Education", accent: CORAL },
                { value: "55→75%", label: "Gen AI jump (2023→2024)", accent: INDIGO },
                { value: "92%", label: "Increased AI use (12mo)", accent: TEAL },
              ].map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  className="py-6"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <p
                    className="font-display text-3xl md:text-4xl font-medium tracking-tight"
                    style={{ color: TEXT_PRIMARY }}
                  >
                    {kpi.value}
                  </p>
                  <div
                    className="mt-3 h-0.5 w-12 rounded-full"
                    style={{ backgroundColor: kpi.accent }}
                  />
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: SLATE }}>
                    {kpi.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* Dark Insight Panel */}
          <FadeIn delay={0.4}>
            <div
              className="mt-14 rounded-xl p-8 md:p-12"
              style={{ backgroundColor: DEEP_GREEN }}
            >
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase mb-5" style={{ color: LAVENDER }}>
                    The Adoption Divide
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Technology at 88% is nearly saturated — the question is depth, not breadth",
                      "Financial services and healthcare are scaling fast from different starting points",
                      "Manufacturing has the most untapped upside — low adoption but massive documented gains",
                      "Education and energy remain early-stage, with limited quantified results",
                    ].map((insight) => (
                      <li key={insight} className="flex items-start gap-3">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: LAVENDER }}
                        />
                        <span className="text-base" style={{ color: IVORY }}>
                          {insight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p
                    className="font-display text-xl md:text-2xl font-medium tracking-tight leading-relaxed"
                    style={{ color: IVORY }}
                  >
                    The adoption gap is becoming a performance gap.{" "}
                    <span style={{ color: LAVENDER }}>
                      Early-adopting sectors are accelerating while late adopters fall further behind.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="text-[10px] font-mono" style={{ color: `${SLATE}60` }}>Sources:</span>
            <SourceCite label="McKinsey 2024 Survey" url={SRC.mckinsey} />
            <SourceCite label="OECD 2025" url={SRC.oecd} />
            <SourceCite label="PwC 2025" url={SRC.pwc} />
            <SourceCite label="Aloa 2025" url={SRC.aloa} />
            <span className="text-[10px] font-mono" style={{ color: `${SLATE}60` }}>· Rates reflect org-wide or large-firm adoption.</span>
          </div>
        </div>
      </section>

      {/* ━━━ SLIDE 4: Industry Deep Dives ━━━ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: IVORY }}>
        <div className="container-premium">
          {/* Header */}
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase mb-4"
              style={{ color: FOREST }}
            >
              Sector Intelligence · Deep Dives
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight max-w-3xl"
              style={{ color: TEXT_PRIMARY }}
            >
              What AI Looks Like Inside Each Sector
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: SLATE }}>
              AI isn't one thing — each industry uses it differently, with different
              ROI profiles and deployment patterns.
            </p>
          </FadeIn>

          {/* 6-Card Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {industryDeepDives.map((industry, i) => (
              <FadeIn key={industry.title} delay={i * 0.08}>
                <motion.div
                  className="rounded-xl p-7 h-full relative overflow-hidden group"
                  style={{
                    backgroundColor: "#FAFAF8",
                    borderTop: `3px solid ${industry.color}`,
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                >
                  <p
                    className="font-display font-medium tracking-tight"
                    style={{ color: industry.color, fontSize: "clamp(2.5rem, 4vw, 3.5rem)", lineHeight: 1 }}
                  >
                    {industry.adoption}
                  </p>
                  <p
                    className="mt-3 text-sm font-semibold tracking-[0.1em] uppercase"
                    style={{ color: TEXT_PRIMARY }}
                  >
                    {industry.title}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed" style={{ color: SLATE }}>
                    {industry.description}
                  </p>
                  {industry.example && (
                    <p className="mt-3 text-xs leading-relaxed italic" style={{ color: TEAL }}>
                      {industry.example}
                    </p>
                  )}

                  {/* Stats row */}
                  <div className="mt-5 pt-4 grid grid-cols-3 gap-2" style={{ borderTop: `1px solid ${SLATE}12` }}>
                    {industry.stats.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <p className="font-display text-lg font-semibold" style={{ color: industry.color }}>
                          {stat.value}
                        </p>
                        <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: SLATE }}>
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          {/* Dark Insight Panel */}
          <FadeIn delay={0.5}>
            <div
              className="mt-14 rounded-xl p-8 md:p-10"
              style={{ backgroundColor: DEEP_GREEN }}
            >
              <p className="font-display text-xl md:text-2xl font-medium tracking-tight leading-relaxed" style={{ color: IVORY }}>
                The highest-adoption sectors aren't necessarily seeing the highest returns.{" "}
                <span style={{ color: LAVENDER }}>
                  Manufacturing at 40% adoption shows 31% labor productivity gains — more than most tech companies report.
                </span>
              </p>
            </div>
          </FadeIn>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="text-[10px] font-mono" style={{ color: `${SLATE}60` }}>Sources:</span>
            <SourceCite label="McKinsey 2024" url={SRC.mckinsey} />
            <SourceCite label="OECD 2025" url={SRC.oecd} />
            <SourceCite label="Aloa 2025" url={SRC.aloa} />
            <SourceCite label="Coherent Solutions" url={SRC.coherent} />
          </div>
        </div>
      </section>

      {/* ━━━ SLIDE 5: Gen AI Use Cases ━━━ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: IVORY }}>
        <div className="container-premium">
          {/* Header */}
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase mb-4"
              style={{ color: FOREST }}
            >
              Gen AI Deployment · By Function
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight max-w-3xl"
              style={{ color: TEXT_PRIMARY }}
            >
              Where Gen AI Gets Deployed
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: SLATE }}>
              Marketing leads in adoption, but the biggest productivity gains are in IT and engineering.
            </p>
          </FadeIn>

          {/* Use case bars */}
          <FadeIn delay={0.15}>
            <div className="mt-16">
              <p className="text-xs font-medium tracking-[0.15em] uppercase mb-8" style={{ color: SLATE }}>
                % of Organizations Using Gen AI by Function
              </p>
              <div className="space-y-6">
                {genAiUseCases.map((useCase, i) => (
                  <UseCaseBar
                    key={useCase.function}
                    name={useCase.function}
                    description={useCase.description}
                    percentage={useCase.percentage}
                    maxPct={34}
                    color={i === 0 ? FOREST : TEAL}
                    index={i}
                    example={useCase.example}
                  />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Dark Insight Panel */}
          <FadeIn delay={0.4}>
            <div
              className="mt-14 rounded-xl p-8 md:p-12"
              style={{ backgroundColor: DEEP_GREEN }}
            >
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase mb-5" style={{ color: CORAL }}>
                    Where the Value Concentrates
                  </p>
                  <ul className="space-y-4">
                    {[
                      "62% of AI value comes from core business processes, not support functions",
                      "Marketing leads in gen AI adoption — but IT sees the fastest resolution times",
                      "Supply chain and legal are early-stage but growing fastest",
                    ].map((insight) => (
                      <li key={insight} className="flex items-start gap-3">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: CORAL }}
                        />
                        <span className="text-base" style={{ color: IVORY }}>
                          {insight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p
                    className="font-display text-xl md:text-2xl font-medium tracking-tight leading-relaxed"
                    style={{ color: IVORY }}
                  >
                    The functions with the highest adoption aren't always the ones generating the most value.{" "}
                    <span style={{ color: CORAL }}>
                      Core processes — not support functions — drive 62% of AI's bottom-line impact.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="text-[10px] font-mono" style={{ color: `${SLATE}60` }}>Source:</span>
            <SourceCite label="McKinsey — The State of AI (2024)" url={SRC.mckinsey} />
            <span className="text-[10px] font-mono" style={{ color: `${SLATE}60` }}>· Percentages represent share of responding organizations.</span>
          </div>
        </div>
      </section>

      {/* ━━━ SLIDE 6: Productivity Impact ━━━ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: IVORY }}>
        <div className="container-premium">
          <FadeIn>
            <p className="text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ color: FOREST }}>
              Productivity Dividend
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight"
              style={{ color: TEXT_PRIMARY }}
            >
              What Workers and Organizations Actually Report
            </h2>
          </FadeIn>

          {/* Stat grid — Fashion AI editorial style */}
          <FadeIn delay={0.2}>
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
              {productivityStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="relative"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <p
                    className="font-display font-medium tracking-tight"
                    style={{
                      color: TEXT_PRIMARY,
                      fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </p>
                  <div
                    className="mt-3 h-0.5 w-10 rounded-full"
                    style={{ backgroundColor: i % 2 === 0 ? FOREST : INDIGO }}
                  />
                  <p className="mt-3 text-sm font-medium" style={{ color: TEXT_PRIMARY }}>
                    {stat.label}
                  </p>
                  <p className="mt-1 text-[10px] font-mono" style={{ color: `${SLATE}80` }}>
                    {stat.source}
                  </p>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* Dark Insight Panel */}
          <FadeIn delay={0.4}>
            <div
              className="mt-14 rounded-xl p-8 md:p-10"
              style={{ backgroundColor: DEEP_GREEN }}
            >
              <p className="font-display text-xl md:text-2xl font-medium tracking-tight leading-relaxed" style={{ color: IVORY }}>
                AI is saving workers 40–60 minutes per day — and heavy users save 10+ hours per week.{" "}
                <span style={{ color: LAVENDER }}>
                  That's not a marginal improvement. It's a structural shift in how knowledge work gets done.
                </span>
              </p>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                <SourceCite label="OpenAI Enterprise AI 2025" url={SRC.openai} dark />
                <SourceCite label="Stanford HAI 2025" url={SRC.hai} dark />
                <SourceCite label="PwC AI Predictions" url={SRC.pwc} dark />
                <SourceCite label="BCG 2024" url={SRC.bcg} dark />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━ SLIDE 7: Investment Landscape — Dark Section ━━━ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: DEEP_GREEN }}>
        <div className="container-premium">
          {/* Header */}
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase mb-4"
              style={{ color: CORAL }}
            >
              Capital Flows · Global Investment
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white max-w-3xl"
            >
              Where the Money Is Going
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: "#AEB5C2" }}>
              The US dominates private AI investment at $109B — 12× China's spend.
              Gen AI startups raised $33.9B in 2024 alone.
            </p>
          </FadeIn>

          {/* Investment Grid */}
          <FadeIn delay={0.15}>
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              {/* Callout card */}
              <div
                className="rounded-2xl p-8 md:p-10 flex flex-col justify-center items-center text-center"
                style={{ border: `2px solid ${FOREST}`, backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <p className="font-display font-medium tracking-tight" style={{ color: IVORY, fontSize: "clamp(3rem, 5vw, 4.5rem)", lineHeight: 1 }}>
                  $250B+
                </p>
                <p className="mt-3 text-sm" style={{ color: "#AEB5C2" }}>
                  Global private AI investment (2024)
                </p>
              </div>

              {/* Regional bars */}
              <div className="md:col-span-2">
                <p className="text-xs font-medium tracking-[0.15em] uppercase mb-6" style={{ color: "#AEB5C2" }}>
                  Private AI Investment by Region
                </p>
                <div className="space-y-5">
                  {investmentByRegion.map((region, i) => (
                    <RegionBar
                      key={region.region}
                      region={region.region}
                      amount={region.amount}
                      unit={region.unit}
                      share={region.share}
                      color={region.color}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Segment Cards — Investment KPIs */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {investmentStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-xl p-7 h-full relative overflow-hidden"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderTop: `3px solid ${[FOREST, LAVENDER, CORAL, TEAL][i]}`,
                }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  transition: { duration: 0.25 },
                }}
              >
                <p
                  className="font-display font-medium tracking-tight"
                  style={{ color: [FOREST, LAVENDER, CORAL, TEAL][i], fontSize: "clamp(2rem, 3vw, 2.5rem)", lineHeight: 1 }}
                >
                  {stat.value}
                </p>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: "#AEB5C2" }}>
                  {stat.label}
                </p>
                {/* Subtle glow */}
                <div
                  className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-[60px] opacity-10"
                  style={{ backgroundColor: [FOREST, LAVENDER, CORAL, TEAL][i] }}
                />
              </motion.div>
            ))}
          </div>

          {/* Strategic Takeaway */}
          <FadeIn delay={0.4}>
            <div className="mt-14 pt-10" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <p
                className="font-display text-xl md:text-2xl font-medium tracking-tight leading-relaxed text-center max-w-2xl mx-auto"
                style={{ color: IVORY }}
              >
                The US invests 12× more than China in AI.{" "}
                <span style={{ color: LAVENDER }}>Inference costs dropped 280× in two years — enabling deployment at any scale.</span>
              </p>
            </div>
          </FadeIn>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>Sources:</span>
            <SourceCite label="Stanford HAI — AI Index 2025" url={SRC.hai} dark />
            <SourceCite label="Bloomberg Intelligence 2024" url={SRC.bloomberg} dark />
            <SourceCite label="Coherent Solutions" url={SRC.coherent} dark />
          </div>
        </div>
      </section>

      {/* ━━━ SLIDE 8: Value Gap — Leaders vs Laggards ━━━ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: IVORY }}>
        <div className="container-premium">
          {/* Header */}
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase mb-4"
              style={{ color: FOREST }}
            >
              Performance Analysis · AI Maturity
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight max-w-3xl"
              style={{ color: TEXT_PRIMARY }}
            >
              The Value Gap Is Widening
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: SLATE }}>
              AI leaders aren't just adopting faster — they're fundamentally outperforming.
              The gap in returns between top and bottom quartile is accelerating.
            </p>
          </FadeIn>

          {/* Comparison table */}
          <FadeIn delay={0.2}>
            <div className="mt-14 overflow-hidden rounded-2xl" style={{ border: `1px solid ${TEAL}20` }}>
              {/* Table header */}
              <div
                className="grid grid-cols-3 gap-4 px-6 py-4 text-xs font-medium tracking-[0.12em] uppercase"
                style={{ backgroundColor: DEEP_GREEN, color: "#AEB5C2" }}
              >
                <span>Dimension</span>
                <span className="text-center">AI Leaders</span>
                <span className="text-center">AI Laggards</span>
              </div>

              {valueGapData.leaders.traits.map((trait, i) => (
                <div
                  key={trait.dimension}
                  className="px-6 py-5"
                  style={{
                    backgroundColor: i % 2 === 0 ? "#FAFAF8" : IVORY,
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <span className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>
                      {trait.dimension}
                    </span>
                    <div className="text-center">
                      <span className="font-display text-lg font-semibold" style={{ color: FOREST }}>
                        {trait.value}
                      </span>
                      <p className="text-[10px] mt-0.5" style={{ color: SLATE }}>{trait.description}</p>
                    </div>
                    <div className="text-center">
                      <span className="font-display text-lg font-semibold" style={{ color: SLATE }}>
                        {valueGapData.laggards.traits[i].value}
                      </span>
                      <p className="text-[10px] mt-0.5" style={{ color: `${SLATE}80` }}>{valueGapData.laggards.traits[i].description}</p>
                    </div>
                  </div>
                  {/* Real-world context row */}
                  {(trait.realWorld || valueGapData.laggards.traits[i].realWorld) && (
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <span />
                      <p className="text-[10px] leading-relaxed italic" style={{ color: TEAL }}>
                        {trait.realWorld}
                      </p>
                      <p className="text-[10px] leading-relaxed italic" style={{ color: `${SLATE}80` }}>
                        {valueGapData.laggards.traits[i].realWorld}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Dark Insight Panel */}
          <FadeIn delay={0.4}>
            <div
              className="mt-14 rounded-xl p-8 md:p-12"
              style={{ backgroundColor: DEEP_GREEN }}
            >
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase mb-5" style={{ color: LAVENDER }}>
                    What Leaders Do Differently
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Klarna redesigned its entire customer service flow around AI — replacing 700 FTE of work, not just adding a chatbot to the existing process",
                      "Amazon, Microsoft, and NVIDIA grew revenue 50% faster than peers by treating AI as an operating-model shift",
                      "Leaders spend $10M+ on AI while laggards debate $500K pilots — and the gap compounds every quarter",
                      "AI-first companies delivered 60% higher total shareholder returns over 3 years",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: LAVENDER }}
                        />
                        <span className="text-sm leading-relaxed" style={{ color: IVORY }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p
                    className="font-display text-xl md:text-2xl font-medium tracking-tight leading-relaxed"
                    style={{ color: IVORY }}
                  >
                    The difference isn't technology — it's approach.{" "}
                    <span style={{ color: LAVENDER }}>
                      Leaders redesign workflows. Laggards buy ChatGPT Enterprise licenses but don't change a single process — and wonder why nothing changes.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="text-[10px] font-mono" style={{ color: `${SLATE}60` }}>Sources:</span>
            <SourceCite label="BCG 2024" url={SRC.bcg} />
            <SourceCite label="McKinsey 2024" url={SRC.mckinsey} />
            <span className="text-[10px] font-mono" style={{ color: `${SLATE}60` }}>· Multipliers compare top-quartile vs. bottom-quartile over 3 years.</span>
          </div>
        </div>
      </section>

      {/* ━━━ SLIDE 9: Scaling Framework — 10/20/70 Rule ━━━ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: IVORY }}>
        <div className="container-premium">
          {/* Header */}
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase mb-4"
              style={{ color: FOREST }}
            >
              Scaling Framework · The Pilot Trap
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight max-w-3xl"
              style={{ color: TEXT_PRIMARY }}
            >
              Why Most Companies Get Stuck
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: SLATE }}>
              The 10/20/70 rule — and the barriers that keep 74% of companies in pilot mode.
            </p>
          </FadeIn>

          {/* 10/20/70 Visual */}
          <FadeIn delay={0.15}>
            <div className="mt-16 max-w-3xl mx-auto">
              <p className="text-xs font-medium tracking-[0.15em] uppercase mb-8 text-center" style={{ color: SLATE }}>
                Where AI Value Actually Comes From
              </p>
              <div className="space-y-4">
                {scalingFramework.rule.map((segment, i) => (
                  <RuleSegment
                    key={segment.label}
                    share={segment.share}
                    label={segment.label}
                    description={segment.description}
                    example={segment.example}
                    color={segment.color}
                    index={i}
                  />
                ))}
              </div>

              {/* Maturity distribution bar */}
              <div className="mt-14">
                <p className="text-xs font-medium tracking-[0.15em] uppercase mb-5 text-center" style={{ color: SLATE }}>
                  AI Maturity Distribution
                </p>
                <MaturityBar stages={scalingFramework.maturity} />
                <div className="mt-3 flex items-center justify-center gap-2 text-[10px]" style={{ color: SLATE }}>
                  <span>Early</span>
                  <div className="flex gap-0.5">
                    {scalingFramework.maturity.map((stage) => (
                      <div key={stage.stage} className="w-6 h-2 rounded-sm" style={{ backgroundColor: stage.color }} />
                    ))}
                  </div>
                  <span>Advanced</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Barriers — ranked list */}
          <FadeIn delay={0.3}>
            <div className="mt-16 max-w-2xl mx-auto">
              <p className="text-xs font-medium tracking-[0.15em] uppercase mb-6 text-center" style={{ color: CORAL }}>
                Top Barriers to AI Scaling
              </p>
              <div className="space-y-3">
                {scalingFramework.barriers.map((item, i) => (
                  <BarrierRow
                    key={item.barrier}
                    barrier={item.barrier}
                    rank={item.rank}
                    percentage={item.percentage}
                    source={item.source}
                    description={item.description}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Dark Insight Panel */}
          <FadeIn delay={0.5}>
            <div
              className="mt-14 rounded-xl p-8 md:p-12"
              style={{ backgroundColor: DEEP_GREEN }}
            >
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase mb-5" style={{ color: LAVENDER }}>
                    Why Most Companies Get Stuck
                  </p>
                  <ul className="space-y-4">
                    {[
                      "BMW spent 6 months choosing AI models — then 18 months training 50,000 employees. The model mattered far less than the people.",
                      "A Fortune 500 retailer's pilot worked on 1,000 products. It crashed at 500,000 SKUs because the data pipeline wasn't built for production.",
                      "Klarna replaced 700 FTE of support work — but only because they redesigned the entire workflow, not just bolted AI onto the old process.",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: LAVENDER }} />
                        <span className="text-sm leading-relaxed" style={{ color: IVORY }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p
                    className="font-display text-xl md:text-2xl font-medium tracking-tight leading-relaxed"
                    style={{ color: IVORY }}
                  >
                    The biggest barrier isn't technology — it's people and processes.{" "}
                    <span style={{ color: LAVENDER }}>
                      70% of AI value comes from changing how teams work, not from better models. Companies that skip the people problem stay in pilot mode forever.
                    </span>
                  </p>
                </div>
              </div>

              {/* Executive Takeaway */}
              <div className="mt-10 pt-8" style={{ borderTop: `1px solid rgba(255,255,255,0.08)` }}>
                <p className="text-sm leading-relaxed" style={{ color: "#AEB5C2" }}>
                  Companies stuck in pilots aren't failing at technology. <span className="font-medium" style={{ color: IVORY }}>They're failing at organizational change.</span>{" "}
                  The path to production requires executive sponsorship, workflow redesign, and iterative rollout.
                </p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                  <SourceCite label="PwC AI Predictions 2025" url={SRC.pwc} dark />
                  <SourceCite label="McKinsey 2024" url={SRC.mckinsey} dark />
                  <SourceCite label="BCG 2024" url={SRC.bcg} dark />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━ SLIDE 10: Case Studies ━━━ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: IVORY }}>
        <div className="container-premium">
          <FadeIn>
            <p className="text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ color: FOREST }}>
              Proven Results
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight"
              style={{ color: TEXT_PRIMARY }}
            >
              Real-World Results
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {caseStudies.map((cs, i) => (
              <FadeIn key={cs.company} delay={i * 0.08}>
                <motion.div
                  className="rounded-xl p-7 h-full flex flex-col relative overflow-hidden group"
                  style={{
                    backgroundColor: "#FAFAF8",
                    borderTop: `3px solid ${[FOREST, TEAL, INDIGO, LAVENDER, CORAL][i]}`,
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <h4 className="font-display text-lg font-medium" style={{ color: TEXT_PRIMARY }}>
                      {cs.company}
                    </h4>
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: SLATE }}>
                      {cs.industry}
                    </span>
                  </div>
                  <p className="text-sm mb-5 flex-1" style={{ color: SLATE }}>
                    {cs.description}
                  </p>
                  <div className="pt-4" style={{ borderTop: `1px solid ${SLATE}12` }}>
                    <p
                      className="font-display font-medium tracking-tight"
                      style={{ color: [FOREST, TEAL, INDIGO, LAVENDER, CORAL][i], fontSize: "clamp(2rem, 3vw, 2.5rem)", lineHeight: 1 }}
                    >
                      {cs.outcome}
                    </p>
                    <p className="mt-2 text-xs" style={{ color: SLATE }}>{cs.metric}</p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="text-[10px] font-mono" style={{ color: `${SLATE}60` }}>Sources:</span>
            <SourceCite label="McKinsey 2024" url={SRC.mckinsey} />
            <SourceCite label="Stanford HAI 2025" url={SRC.hai} />
            <SourceCite label="Coherent Solutions" url={SRC.coherent} />
          </div>
        </div>
      </section>

      {/* ━━━ SLIDE 11: Predictions — Future Vision (Full-bleed dark) ━━━ */}
      <section
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: DEEP_GREEN }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-15"
          style={{ backgroundColor: FOREST }}
        />

        <div className="relative container-premium py-24 md:py-32">
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.3em] uppercase mb-8 text-center"
              style={{ color: LAVENDER }}
            >
              2025–2030 Outlook
            </p>
            <h2
              className="font-display font-medium tracking-tight leading-[1.06] text-center"
              style={{ color: IVORY, fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              What Comes<br />
              <span style={{ color: LAVENDER }}>Next</span>
            </h2>
            <motion.div
              className="mt-8 mx-auto h-0.5"
              style={{
                background: `linear-gradient(90deg, transparent, ${LAVENDER}, transparent)`,
                maxWidth: 200,
              }}
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "100%", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </FadeIn>

          {/* Prediction cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {predictions.map((pred, i) => (
              <motion.div
                key={pred.title}
                className="rounded-xl p-7 h-full relative overflow-hidden"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  transition: { duration: 0.25 },
                }}
              >
                <p
                  className="font-display text-3xl font-medium tracking-tight"
                  style={{ color: LAVENDER, lineHeight: 1 }}
                >
                  {pred.number}
                </p>
                <p className="mt-4 text-sm font-semibold tracking-[0.08em] uppercase text-white">
                  {pred.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "#AEB5C2" }}>
                  {pred.description}
                </p>
                <p className="mt-4 text-[10px] tracking-wider uppercase" style={{ color: `${SLATE}` }}>
                  {pred.source}
                </p>
                {/* Subtle glow */}
                <div
                  className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-[60px] opacity-10"
                  style={{ backgroundColor: LAVENDER }}
                />
              </motion.div>
            ))}
          </div>

          {/* Closing metrics row */}
          <FadeIn delay={0.5}>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-12 md:gap-16">
              {[
                { value: "$1.6T+", label: "Gen AI market by 2032" },
                { value: "280×", label: "Inference cost drop" },
                { value: "92%", label: "Increasing AI use" },
              ].map((m, i) => (
                <div key={m.label} className="flex items-center gap-12 md:gap-16">
                  <div className="text-center">
                    <p
                      className="font-display font-medium tracking-tight"
                      style={{ color: IVORY, fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1 }}
                    >
                      {m.value}
                    </p>
                    <p className="mt-3 text-xs tracking-wider uppercase" style={{ color: "#AEB5C2" }}>
                      {m.label}
                    </p>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:block w-px h-16" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
                  )}
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.7}>
            <p className="mt-14 text-base md:text-lg leading-relaxed max-w-xl mx-auto text-center" style={{ color: "#AEB5C2" }}>
              The organizations that win next won't just adopt AI —
              they'll rebuild operations around it. Start now, or compete against those who already have.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <SourceCite label="PwC 2025" url={SRC.pwc} dark />
              <SourceCite label="Bloomberg 2024" url={SRC.bloomberg} dark />
              <SourceCite label="Stanford HAI" url={SRC.hai} dark />
              <SourceCite label="McKinsey 2024" url={SRC.mckinsey} dark />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━ CTA + Sources ━━━ */}
      <ReportSection id="cta">
        <div className="space-y-12">
          <DarkCTASection
            title="Turn AI insights into startup strategy"
            subtitle="Use this data to validate your next AI product idea — which industry needs AI the most, where the funding is flowing, and what gaps remain."
            primaryButton={{
              label: "Validate Your Idea",
              href: "/validator",
            }}
            secondaryButton={{
              label: "Explore Reports",
              href: "/blog",
            }}
          />

          <SourcesSection
            sources={sources}
            methodology="Adoption rates reflect survey definitions which vary between org-wide deployment and function-specific use. Figures are sourced from the most recent available survey data (2024–2025). Where multiple sources report different figures for the same metric, we present ranges or identify the source explicitly."
            definitions={[
              { term: "Org-wide adoption", definition: "AI used regularly across most business functions" },
              { term: "Function-level adoption", definition: "AI deployed in specific departments (e.g., marketing, ops)" },
              { term: "Gen AI", definition: "Generative AI — models that produce text, images, code, or video from prompts" },
              { term: "EBIT impact", definition: "Earnings Before Interest and Tax — measurable bottom-line effect" },
              { term: "Agentic AI", definition: "AI systems that autonomously plan, execute, and iterate on multi-step tasks" },
            ]}
            limitations={[
              "Survey definitions of 'adoption' vary between sources (org-wide vs. function-specific vs. testing/deployed)",
              "Adoption rates for some sectors (Energy, Education) have limited quantified data",
              "Case study results may not generalize across all organizations in a sector",
              "Investment figures reflect private funding only; government and internal corporate spending excluded",
              "Gen AI-specific data is available only from 2023 onward due to the technology's recency",
            ]}
          />
        </div>
      </ReportSection>
    </article>
  );
};

export default AiAdoptionReport;
