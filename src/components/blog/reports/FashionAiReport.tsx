// Fashion AI 2026 — Luxury editorial infographic report
// 10-section layout · McKinsey × fashion house aesthetic
// Color system: #F1EEEA ivory canvas · #12211D deep green · #0E3E1B forest accent

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ReportSection,
  DarkCTASection,
  SourcesSection,
} from "@/components/blog";

import {
  strategicForces,
  consumerShiftData,
  consumerInsights,
  genZFlowSteps,
  genZStats,
  valueChainStages,
  roiMetrics,
  startupClusters,
  startupMeta,
  growthSegments,
  aiTimelineStages,
  sources,
  methodology,
  definitions,
  limitations,
} from "./data/fashionAiData";

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

const FashionAiReport = () => {
  return (
    <article>
      {/* ━━━ SLIDE 1: Hero — Split Editorial + Growth Chart ━━━ */}
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
                AI × Fashion · 2026 Outlook
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
                  AI Is Reshaping a{" "}
                  <span style={{ color: FOREST }}>$2 Trillion</span>{" "}
                  Industry
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
                Fashion is a $2 trillion global industry — yet most brands still run on spreadsheets, gut instinct, and legacy ERP systems built decades ago.
                Only 10% of AI pilots succeed, 71% of buyers say their tools are useless, and days of inventory outstanding hit all-time highs in 2024.
                That gap between industry scale and tech maturity is creating a once-in-a-decade opportunity: AI in fashion is projected to grow from $2.9B to $89B by 2035.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
                className="mt-4 text-sm font-medium font-body italic"
                style={{ color: TEAL }}
              >
                As BCG puts it: "Success is 10% AI models, 20% data and technology, and 70% change of organization and operating model."
                The real opportunity isn't in making clothes — it's in making smarter decisions about what to make, when to sell, and how to price it.
              </motion.p>

              {/* Key metrics row */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-10 flex flex-wrap gap-8"
              >
                {[
                  { value: "$89B", label: "AI Fashion Market by 2035" },
                  { value: "40.8%", label: "Yearly Growth Rate" },
                  { value: "71%", label: "Unhappy with Current Tools" },
                ].map((m) => (
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

            {/* ── Right Column: Growth Comparison Chart ── */}
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
                    Growth Comparison · 2025–2035
                  </p>
                  <p className="mt-1 text-sm" style={{ color: "#AEB5C2" }}>
                    Fashion market vs AI-in-Fashion trajectory
                  </p>
                </div>

                {/* SVG Chart — Fashion (flat) vs AI (exponential) */}
                <div className="relative">
                  <svg viewBox="0 0 400 200" className="w-full" fill="none">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="40"
                        y1={40 + i * 40}
                        x2="380"
                        y2={40 + i * 40}
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Y-axis labels */}
                    <text x="32" y="44" fill="#AEB5C2" fontSize="9" textAnchor="end" fontFamily="Inter, sans-serif">$89B</text>
                    <text x="32" y="124" fill="#AEB5C2" fontSize="9" textAnchor="end" fontFamily="Inter, sans-serif">$40B</text>
                    <text x="32" y="204" fill="#AEB5C2" fontSize="9" textAnchor="end" fontFamily="Inter, sans-serif">$0</text>

                    {/* X-axis labels */}
                    <text x="60" y="198" fill="#AEB5C2" fontSize="9" fontFamily="Inter, sans-serif">2025</text>
                    <text x="210" y="198" fill="#AEB5C2" fontSize="9" fontFamily="Inter, sans-serif">2030</text>
                    <text x="355" y="198" fill="#AEB5C2" fontSize="9" fontFamily="Inter, sans-serif">2035</text>

                    {/* Fashion market line (gentle slope — $2.0T → $2.4T, normalized) */}
                    <motion.path
                      d="M60,155 C140,150 260,142 370,135"
                      stroke={SLATE}
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                    />

                    {/* AI in fashion line (exponential — $2.9B → $89B) */}
                    <motion.path
                      d="M60,180 C100,178 160,170 220,145 C280,110 330,65 370,42"
                      stroke={FOREST}
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.8, delay: 0.8, ease: "easeOut" }}
                    />

                    {/* Highlight dot at $89B endpoint */}
                    <motion.circle
                      cx="370"
                      cy="42"
                      r="5"
                      fill={LAVENDER}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.4, duration: 0.4 }}
                    />
                    <motion.circle
                      cx="370"
                      cy="42"
                      r="10"
                      fill="none"
                      stroke={LAVENDER}
                      strokeWidth="1"
                      opacity="0.4"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 0.4, scale: 1 }}
                      transition={{ delay: 2.5, duration: 0.5 }}
                    />
                  </svg>
                </div>

                {/* Legend */}
                <div className="relative mt-6 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-0.5" style={{ backgroundColor: SLATE, opacity: 0.7 }} />
                    <span className="text-xs" style={{ color: "#AEB5C2" }}>Fashion Market (3–4%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-0.5" style={{ backgroundColor: FOREST }} />
                    <span className="text-xs text-white">AI in Fashion (40.8%)</span>
                  </div>
                </div>

                {/* $89B callout */}
                <motion.div
                  className="absolute top-8 right-8 text-right"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.2, duration: 0.5 }}
                >
                  <p className="font-display text-4xl md:text-5xl font-medium tracking-tight text-white">
                    $89B
                  </p>
                  <p className="mt-1 text-[11px] tracking-wider uppercase" style={{ color: LAVENDER }}>
                    by 2035
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━ THE AI INFLECTION POINT — Editorial Metrics ━━━ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: IVORY }}>
        <div className="container-premium max-w-5xl mx-auto">
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase mb-4 text-center"
              style={{ color: INDIGO }}
            >
              The Inflection Point
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-center"
              style={{ color: TEXT_PRIMARY }}
            >
              The AI Inflection Point
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
                  number: "$2.0T",
                  descriptor: "Global Fashion Market",
                  explanation: "Spanning luxury, fast fashion, sportswear, and resale — growing to $2.4T by 2030. Yet 46% of executives expect conditions to worsen in 2026 (vs. 39% last year), and days of inventory outstanding hit all-time highs. It's one of the world's largest consumer industries and one of the slowest to adopt technology.",
                },
                {
                  number: "$89B",
                  descriptor: "AI in Fashion by 2035",
                  explanation: "Up from $2.9B today — a 30× expansion in a decade. Walmart's AI trend-sensing tool shortened production by 18 weeks. Zalando's AI forecasting reduced prediction errors by 20 percentage points. The brands deploying AI are seeing 5-15% conversion gains and 3-6% gross profit lifts.",
                },
                {
                  number: "40.8%",
                  descriptor: "Yearly Growth Rate",
                  explanation: "Fashion AI is growing at double the overall AI market rate (~20%). Fashion & retail went from 6th place in AI spending increases (H1 2023) to 3rd place (H2 2024) — the biggest jump of any sector. BCG reports a 4,700% surge in GenAI-sourced traffic to retail sites.",
                },
                {
                  number: "71%",
                  descriptor: "Unhappy with Current Tools",
                  explanation: "K3 Fashion Solutions found that nearly three-quarters of fashion buyers and merchandisers say their existing software fails to deliver actionable insights. Meanwhile, 90% of AI pilots fail to scale — not due to bad AI, but due to poor data foundations. The winners solve the data problem first.",
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

          {/* Horizontal divider between grid and thesis */}
          <FadeIn delay={0.4}>
            <div
              className="mt-16 mx-auto h-px"
              style={{ backgroundColor: `${SLATE}20`, maxWidth: "80%" }}
            />
          </FadeIn>

          {/* Closing thesis line */}
          <FadeIn delay={0.5}>
            <p
              className="mt-10 text-center font-display text-xl md:text-2xl font-medium tracking-tight leading-relaxed"
              style={{ color: TEXT_PRIMARY }}
            >
              AI isn't a priority because executives think it's cool.{" "}
              <span style={{ color: INDIGO }}>It's a priority because profits depend on it.</span>
            </p>
            <p className="mt-3 text-center text-xs tracking-wider uppercase" style={{ color: SLATE }}>
              — McKinsey & BoF, State of Fashion 2026
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ━━━ SLIDE 2: Four Strategic Forces ━━━ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: IVORY }}>
        <div className="container-premium">
          {/* Header */}
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase mb-4"
              style={{ color: FOREST }}
            >
              AI Transformation Drivers
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight max-w-3xl"
              style={{ color: TEXT_PRIMARY }}
            >
              Four Forces Making AI Inevitable
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: SLATE }}>
              AI adoption in fashion isn't being driven by hype — it's being pushed by four structural forces converging simultaneously.
              Cheaper, more capable AI models. Consumers who discover products through AI agents. Competitors already investing heavily.
              And a new generation of AI-native roles reshaping how fashion companies operate from the inside.
            </p>
          </FadeIn>

          {/* 4-Card Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {strategicForces.map((force, i) => (
              <FadeIn key={force.title} delay={i * 0.1}>
                <motion.div
                  className="rounded-xl p-7 h-full relative overflow-hidden group"
                  style={{
                    backgroundColor: "#FAFAF8",
                    borderTop: `3px solid ${force.accentColor}`,
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                >
                  <p
                    className="font-display font-medium tracking-tight"
                    style={{ color: force.accentColor, fontSize: "clamp(3rem, 5vw, 4rem)", lineHeight: 1 }}
                  >
                    {force.stat}
                  </p>
                  <p
                    className="mt-3 text-sm font-semibold tracking-[0.12em] uppercase"
                    style={{ color: TEXT_PRIMARY }}
                  >
                    {force.title}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed" style={{ color: SLATE }}>
                    {force.description}
                  </p>
                  {/* Impact label */}
                  <p className="mt-5 text-xs font-medium tracking-wider uppercase" style={{ color: force.accentColor }}>
                    Impact
                  </p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: SLATE }}>
                    {i === 0 && "Sam Altman (Feb 2025): 10× cost reduction per capability level in one year. Perry Ellis cut physical samples by 50% with AI design tools. BCG reports 50% faster time-to-market and 30% sampling cost reduction across early adopters."}
                    {i === 1 && "60% of consumers have already used AI to shop (BCG, N=1,233). 77% used ChatGPT as a search engine. 53% of AI search users also used it to purchase. AI-sourced visitors show 8% higher engagement than traditional channels."}
                    {i === 2 && "Walmart: AI cuts production timeline by 18 weeks. Zalando: 20-point reduction in demand prediction errors. Ralph Lauren's 'Ask Ralph' AI assistant helped acquire 6.8M new customers in one year. The data moats are forming now."}
                    {i === 3 && "As Bret Taylor (OpenAI Chairman) puts it: 'For every company, AI agents will be their most important digital interface, as important as their website or mobile app.' 40% of fashion brands created AI leadership roles in 2025 — Head of AI, VP Data Science, Chief Digital Officer."}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          {/* Strategic Influence Flow */}
          <FadeIn delay={0.4}>
            <div className="mt-16 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                {["Tech", "Consumers", "Competitors", "Talent"].map((node, i) => (
                  <div key={node} className="flex items-center">
                    <motion.div
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
                      style={{
                        border: `2px solid ${FOREST}`,
                        backgroundColor: i === 3 ? `${FOREST}08` : "transparent",
                      }}
                      whileInView={{ scale: [0.9, 1] }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.12 }}
                    >
                      <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase" style={{ color: FOREST }}>
                        {node}
                      </span>
                    </motion.div>
                    {i < 3 && (
                      <motion.div
                        className="w-6 md:w-10 h-px mx-1"
                        style={{ backgroundColor: SLATE }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + i * 0.12 }}
                      />
                    )}
                  </div>
                ))}
              </div>
              {/* Arrow to AI Imperative */}
              <div className="flex flex-col items-center mt-4">
                <motion.div
                  className="w-px h-8"
                  style={{ backgroundColor: SLATE }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1 }}
                />
                <motion.div
                  className="mt-1 px-6 py-3 rounded-full"
                  style={{ backgroundColor: FOREST }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2 }}
                >
                  <span className="text-xs font-semibold tracking-wider uppercase text-white">
                    AI Imperative
                  </span>
                </motion.div>
              </div>
            </div>
          </FadeIn>

          {/* Dark Insight Panel */}
          <FadeIn delay={0.5}>
            <div
              className="mt-14 rounded-xl p-8 md:p-10"
              style={{ backgroundColor: DEEP_GREEN }}
            >
              <p className="font-display text-xl md:text-2xl font-medium tracking-tight leading-relaxed" style={{ color: IVORY }}>
                Using AI in fashion is no longer optional.{" "}
                <span style={{ color: LAVENDER }}>
                  All four forces are pushing in the same direction — and they're speeding up.
                </span>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━ SLIDE 3: Consumer Intelligence Dashboard ━━━ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: IVORY }}>
        <div className="container-premium">
          {/* Header */}
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase mb-4"
              style={{ color: FOREST }}
            >
              Consumer Signals · 2025
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight max-w-3xl"
              style={{ color: TEXT_PRIMARY }}
            >
              Shoppers Are Thinking More, Spending Less
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: SLATE }}>
              Consumer behavior has fundamentally shifted. A Power Digital study (N=600 US consumers, June 2025) reveals that 48.5% are spending less YoY,
              40.8% shop less frequently, and 46% stopped buying from at least one brand due to quality declines. Two-thirds won't even look at a product
              unless it's 30% off — while 74% of fashion executives plan to raise prices in 2026. AI-powered pricing and personalization are the only way to navigate this paradox.
            </p>
          </FadeIn>

          {/* Behavior Bar Matrix — full-width horizontal bars */}
          <FadeIn delay={0.15}>
            <div className="mt-16">
              <p className="text-xs font-medium tracking-[0.15em] uppercase mb-8" style={{ color: SLATE }}>
                Consumer Behavioral Shifts (2025)
              </p>
              <div className="space-y-8">
                {consumerShiftData.map((item, i) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>
                        {item.label}
                      </span>
                      <span className="font-display text-2xl font-medium tracking-tight" style={{ color: TEXT_PRIMARY }}>
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-3 rounded-full" style={{ backgroundColor: `${SLATE}12` }}>
                      <motion.div
                        className="h-full rounded-full relative"
                        style={{
                          backgroundColor: item.value === 66 ? FOREST : item.color,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + i * 0.12 }}
                      >
                        {/* Coral endpoint dot for emphasis */}
                        <motion.div
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.value === 66 ? CORAL : "transparent" }}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1 + i * 0.12 }}
                        />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* KPI Strip — 4 panels below chart */}
          <FadeIn delay={0.3}>
            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: "66%", label: "Require 30%+ discount before they'll even browse. For brands with AOV over $100, promo-acquired customers are worth 23% less LTV than full-price buyers", accent: CORAL },
                { value: "48.5%", label: "Spending less on fashion YoY. 46% stopped buying from at least one brand entirely — not due to price, but quality declines and misaligned values", accent: SLATE },
                { value: "44.5%", label: "Actively delaying purchases for deeper markdowns. Brands using AI markdown timing recover 3-5% margin per season vs. calendar-based discounting", accent: LAVENDER },
                { value: "36.7%", label: "Comparing prices across brands before every purchase. 47% discover new brands on YouTube, 43% on TikTok — traditional loyalty is collapsing", accent: TEAL },
              ].map((kpi, i) => (
                <motion.div
                  key={kpi.value}
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

          {/* Discount Threshold Visualization */}
          <FadeIn delay={0.4}>
            <div className="mt-14 max-w-2xl mx-auto">
              <p className="text-xs font-medium tracking-[0.15em] uppercase mb-5 text-center" style={{ color: SLATE }}>
                Discount Threshold
              </p>
              <div className="relative">
                {/* Track */}
                <div className="h-2 rounded-full" style={{ backgroundColor: `${SLATE}15` }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: `${TEAL}40`, width: "60%" }}
                    initial={{ width: 0 }}
                    whileInView={{ width: "60%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                {/* Markers */}
                <div className="flex justify-between mt-3">
                  {[
                    { pct: "0%", pos: "0%" },
                    { pct: "15%", pos: "30%" },
                    { pct: "30%", pos: "60%" },
                    { pct: "50%", pos: "100%" },
                  ].map((m) => (
                    <div key={m.pct} className="text-center" style={{ position: "absolute", left: m.pos, transform: "translateX(-50%)" }}>
                      <div
                        className="w-2.5 h-2.5 rounded-full mx-auto -mt-[22px]"
                        style={{ backgroundColor: m.pct === "30%" ? FOREST : SLATE, opacity: m.pct === "30%" ? 1 : 0.4 }}
                      />
                      <p
                        className="mt-2 text-xs font-medium"
                        style={{ color: m.pct === "30%" ? FOREST : SLATE }}
                      >
                        {m.pct}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 flex justify-center gap-8 text-xs" style={{ color: SLATE }}>
                <span>15% is invisible.</span>
                <span style={{ color: FOREST, fontWeight: 600 }}>30% triggers attention.</span>
                <span>Transparency builds trust.</span>
              </div>
            </div>
          </FadeIn>

          {/* Dark Strategic Insight Panel */}
          <FadeIn delay={0.5}>
            <div
              className="mt-16 rounded-xl p-8 md:p-12"
              style={{ backgroundColor: DEEP_GREEN }}
            >
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase mb-5" style={{ color: LAVENDER }}>
                    AI Response Strategy
                  </p>
                  <ul className="space-y-4">
                    {consumerInsights.map((insight) => (
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
                    Impulse buying is fading.{" "}
                    <span style={{ color: LAVENDER }}>
                      Shoppers now research, compare, and wait — and AI can help brands keep up.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━ SLIDE 4: Gen Z Flow ━━━ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: IVORY }}>
        <div className="container-premium">
          <FadeIn>
            <p className="text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ color: FOREST }}>
              Next Generation
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight"
              style={{ color: TEXT_PRIMARY }}
            >
              Gen Z and Gen Alpha Will Drive 40% of Fashion Spending
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: SLATE }}>
              BCG x WWD surveyed 9,000+ US consumers and analyzed 50,000+ social posts. Under-28s spend 7% more of their disposable income on
              clothing than older consumers, are 20 percentage points less likely to shop by brand, and 2× more likely to convert from influencer content.
              High-spending Gen Z shoppers ($1,000+/year) use AI daily at nearly double the rate of low spenders.
            </p>
          </FadeIn>

          {/* Flow diagram */}
          <FadeIn delay={0.2}>
            <div className="mt-14 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
              {genZFlowSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-4 md:gap-0">
                  <div className="text-center">
                    <div
                      className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center mx-auto"
                      style={{
                        border: `2px solid ${i === 3 ? LAVENDER : FOREST}`,
                        backgroundColor: i === 3 ? "rgba(203,159,210,0.08)" : "transparent",
                      }}
                    >
                      <span
                        className="text-xs font-medium tracking-wider uppercase text-center px-2"
                        style={{ color: i === 3 ? LAVENDER : FOREST }}
                      >
                        {step.label}
                      </span>
                    </div>
                    <p className="mt-3 text-xs" style={{ color: SLATE }}>
                      {step.sublabel}
                    </p>
                  </div>
                  {i < genZFlowSteps.length - 1 && (
                    <div
                      className="hidden md:block w-12 h-px flex-shrink-0"
                      style={{ backgroundColor: SLATE }}
                    />
                  )}
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Stats row */}
          <div className="grid sm:grid-cols-3 gap-6 mt-14">
            {genZStats.map((stat, i) => (
              <FadeIn key={stat.label} delay={0.3 + i * 0.1}>
                <div className="text-center">
                  <p className="font-display text-4xl font-medium" style={{ color: FOREST }}>
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm" style={{ color: SLATE }}>
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ SLIDE 5: Value Chain AI Map ━━━ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: IVORY }}>
        <div className="container-premium">
          {/* Header */}
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase mb-4"
              style={{ color: FOREST }}
            >
              Operational Architecture · AI Integration
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight max-w-3xl"
              style={{ color: TEXT_PRIMARY }}
            >
              AI Touches Every Step — From Design to Delivery
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: SLATE }}>
              As The Interline's editor-in-chief puts it: "Fashion does not have great workflow automation. It's rare to see a company with complete,
              end-to-end visibility from design through retail." AI is now filling every gap: BCG measures 50% faster time-to-market in design,
              10× faster assortment planning, 50× more dynamic pricing capability, and 60% faster supply chain simulations. Each stage represents
              a distinct startup opportunity — and the top 5 optimization targets (assortment 50%, inventory 47%, pricing 33%) align perfectly with where AI creates the most value.
            </p>
          </FadeIn>

          {/* End-to-End Process Flow — 8 nodes */}
          <FadeIn delay={0.15}>
            <div className="mt-16">
              {/* Desktop: horizontal flow */}
              <div className="hidden lg:flex items-start gap-0">
                {(() => {
                  const nodeData = [
                    { label: "Trend", sub: "Scan millions of social posts, runway images, and search queries to predict what consumers will want next season", accent: LAVENDER, tech: "Computer vision + NLP → Trend signals 6 months ahead" },
                    { label: "Design", sub: "Generate hundreds of design variations from a single brief, cutting concept-to-sample time from weeks to hours", accent: CORAL, tech: "Text/image prompts → Production-ready design files" },
                    { label: "Sourcing", sub: "Score suppliers on cost, reliability, sustainability, and lead time to reduce risk and negotiate better terms", accent: SLATE, tech: "Supplier data + risk models → Ranked recommendations" },
                    { label: "Manufacturing", sub: "Predict defects before they happen using sensor data and historical quality patterns from production lines", accent: TEAL, tech: "Factory telemetry → Early quality alerts" },
                    { label: "Allocation", sub: "Predict which stores and regions will sell which sizes and styles, reducing overstock and stockouts simultaneously", accent: FOREST, tech: "Demand forecasting → Store-level inventory plans" },
                    { label: "Merchandising", sub: "Optimize markdown timing and depth to maximize full-price sell-through and recover 3-5% more margin per season", accent: LAVENDER, tech: "Price elasticity models → Dynamic markdown schedules" },
                    { label: "Commerce", sub: "Power AI shopping assistants that understand style preferences, body type, and occasion to surface the right products", accent: CORAL, tech: "Customer intent → Personalized product matching" },
                    { label: "Returns", sub: "Identify serial returners, detect fraud patterns, and route items to resale or restock based on condition scoring", accent: SLATE, tech: "Return history + item assessment → Automated routing" },
                  ];
                  return nodeData.map((node, i) => (
                    <div key={node.label} className="flex items-start flex-1">
                      <motion.div
                        className="flex-1 rounded-xl p-5 cursor-default relative overflow-hidden group"
                        style={{
                          backgroundColor: "#FAFAF8",
                          border: `1px solid ${TEAL}20`,
                          borderTop: `3px solid ${node.accent}`,
                        }}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07 }}
                        whileHover={{
                          borderColor: `${LAVENDER}50`,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <p
                          className="text-[10px] font-medium tracking-[0.15em] uppercase mb-2"
                          style={{ color: node.accent }}
                        >
                          0{i + 1}
                        </p>
                        <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: TEXT_PRIMARY }}>
                          {node.label}
                        </p>
                        <p className="mt-2 text-[11px] leading-snug" style={{ color: SLATE }}>
                          {node.sub}
                        </p>
                        <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${SLATE}12` }}>
                          <p className="text-[10px] leading-snug" style={{ color: `${SLATE}99` }}>
                            {node.tech}
                          </p>
                        </div>
                      </motion.div>
                      {i < 7 && (
                        <motion.div
                          className="flex-shrink-0 w-4 h-px mt-10 self-center"
                          style={{ backgroundColor: SLATE }}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.07 }}
                        />
                      )}
                    </div>
                  ));
                })()}
              </div>

              {/* Tablet: 2-row grid */}
              <div className="hidden sm:grid lg:hidden grid-cols-4 gap-4">
                {[
                  { label: "Trend", sub: "Spot what's trending using AI", accent: LAVENDER },
                  { label: "Design", sub: "AI-generated design concepts", accent: CORAL },
                  { label: "Sourcing", sub: "Find the best suppliers", accent: SLATE },
                  { label: "Manufacturing", sub: "Predict quality issues early", accent: TEAL },
                  { label: "Allocation", sub: "Put the right stock in the right store", accent: FOREST },
                  { label: "Merchandising", sub: "Set prices that maximize profit", accent: LAVENDER },
                  { label: "Commerce", sub: "Help shoppers find what they want", accent: CORAL },
                  { label: "Returns", sub: "Catch fraud, route returns", accent: SLATE },
                ].map((node, i) => (
                  <motion.div
                    key={node.label}
                    className="rounded-xl p-5"
                    style={{
                      backgroundColor: "#FAFAF8",
                      borderTop: `3px solid ${node.accent}`,
                    }}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <p className="text-[10px] font-medium tracking-[0.15em] uppercase mb-1" style={{ color: node.accent }}>0{i + 1}</p>
                    <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: TEXT_PRIMARY }}>{node.label}</p>
                    <p className="mt-2 text-[11px] leading-snug" style={{ color: SLATE }}>{node.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* Mobile: vertical stack */}
              <div className="sm:hidden space-y-3">
                {[
                  { label: "Trend", sub: "Spot what's trending using AI", accent: LAVENDER },
                  { label: "Design", sub: "AI-generated design concepts", accent: CORAL },
                  { label: "Sourcing", sub: "Find the best suppliers", accent: SLATE },
                  { label: "Manufacturing", sub: "Predict quality issues early", accent: TEAL },
                  { label: "Allocation", sub: "Put the right stock in the right store", accent: FOREST },
                  { label: "Merchandising", sub: "Set prices that maximize profit", accent: LAVENDER },
                  { label: "Commerce", sub: "Help shoppers find what they want", accent: CORAL },
                  { label: "Returns", sub: "Catch fraud, route returns", accent: SLATE },
                ].map((node, i) => (
                  <motion.div
                    key={node.label}
                    className="rounded-xl p-5 flex items-start gap-4"
                    style={{
                      backgroundColor: "#FAFAF8",
                      borderLeft: `3px solid ${node.accent}`,
                    }}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <p className="text-[10px] font-medium tracking-[0.15em] uppercase" style={{ color: node.accent }}>0{i + 1}</p>
                    <div>
                      <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: TEXT_PRIMARY }}>{node.label}</p>
                      <p className="mt-1 text-[11px] leading-snug" style={{ color: SLATE }}>{node.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Value Creation Heat Map */}
          <FadeIn delay={0.3}>
            <div className="mt-14 max-w-2xl mx-auto">
              <p className="text-xs font-medium tracking-[0.15em] uppercase mb-5 text-center" style={{ color: SLATE }}>
                Value Creation Intensity
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {[
                  { label: "Trend", level: 2 },
                  { label: "Design", level: 3 },
                  { label: "Sourcing", level: 1 },
                  { label: "Mfg", level: 1 },
                  { label: "Allocation", level: 4 },
                  { label: "Pricing", level: 4 },
                  { label: "Commerce", level: 3 },
                  { label: "Returns", level: 2 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="px-4 py-3 rounded-lg text-center"
                    style={{
                      backgroundColor:
                        item.level === 4 ? FOREST :
                        item.level === 3 ? TEAL :
                        item.level === 2 ? `${TEAL}80` :
                        `${SLATE}30`,
                      color: item.level >= 2 ? "#fff" : TEXT_PRIMARY,
                      minWidth: 80,
                    }}
                  >
                    <p className="text-[10px] font-medium tracking-wider uppercase">{item.label}</p>
                    <p className="mt-1 text-[9px] opacity-80">
                      {item.level === 4 ? "Very High" : item.level === 3 ? "High" : item.level === 2 ? "Medium" : "Moderate"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-[10px]" style={{ color: SLATE }}>
                <span>Low</span>
                <div className="flex gap-0.5">
                  {[`${SLATE}30`, `${TEAL}80`, TEAL, FOREST].map((c, i) => (
                    <div key={i} className="w-6 h-2 rounded-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span>Very High</span>
              </div>
            </div>
          </FadeIn>

          {/* Dark Technical Insight Panel */}
          <FadeIn delay={0.4}>
            <div
              className="mt-14 rounded-xl p-8 md:p-12"
              style={{ backgroundColor: DEEP_GREEN }}
            >
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase mb-5" style={{ color: CORAL }}>
                    Data Foundation Architecture
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {["Data Sources", "Structured Layer", "Knowledge Graph", "AI Model Stack", "Decision Engine"].map((step, i) => (
                      <div key={step} className="flex items-center gap-2">
                        <span
                          className="text-[11px] font-medium px-3 py-1.5 rounded-full"
                          style={{
                            backgroundColor: step === "Decision Engine" ? `${FOREST}60` : "rgba(255,255,255,0.06)",
                            color: step === "Decision Engine" ? CORAL : "#AEB5C2",
                            border: `1px solid ${step === "Decision Engine" ? FOREST : "rgba(255,255,255,0.08)"}`,
                          }}
                        >
                          {step}
                        </span>
                        {i < 4 && (
                          <span className="text-[10px]" style={{ color: SLATE }}>→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p
                    className="font-display text-xl md:text-2xl font-medium tracking-tight leading-relaxed"
                    style={{ color: IVORY }}
                  >
                    90% of AI pilots fail to scale — not because the AI is bad, but because the data foundation is broken (K3 Fashion Solutions).{" "}
                    <span style={{ color: LAVENDER }}>
                      Fashion's five structural bottlenecks: allocation exceptions that overwhelm planners, calendar-based markdowns that leave margin on the table,
                      incomplete product data that AI agents can't read, scattered compliance evidence across suppliers, and tariff-forced sourcing shifts that outpace current tools.
                    </span>
                  </p>
                </div>
              </div>

              {/* Executive Takeaway */}
              <div className="mt-10 pt-8" style={{ borderTop: `1px solid rgba(255,255,255,0.08)` }}>
                <p className="text-sm leading-relaxed" style={{ color: "#AEB5C2" }}>
                  AI doesn't replace creativity. <span className="font-medium" style={{ color: IVORY }}>It removes the boring, slow parts.</span>{" "}
                  AI doesn't replace decision-making. <span className="font-medium" style={{ color: IVORY }}>It helps you make better decisions, faster.</span>
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━ SLIDE 6: ROI Comparison Dashboard ━━━ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: IVORY }}>
        <div className="container-premium">
          <FadeIn>
            <p className="text-xs font-medium tracking-[0.2em] uppercase mb-4" style={{ color: FOREST }}>
              ROI Impact
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight"
              style={{ color: TEXT_PRIMARY }}
            >
              Brands Using AI See 5–15% Conversion Gains
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: SLATE }}>
              BCG tracked AI-first fashion companies across six operational functions. The data is clear: AI-powered experiences
              generate 4×–8× more high-intent behaviors (checkout starts), 3× ROI on marketing campaigns, and 30% overall productivity gains.
              Stella McCartney's AI impact assessment enables over 90% responsible sourcing. Burlington's AI hiring tool cut interview volume by 50%.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-14 overflow-hidden rounded-2xl" style={{ border: `1px solid ${TEAL}20` }}>
              {/* Table header */}
              <div
                className="grid grid-cols-4 gap-4 px-6 py-4 text-xs font-medium tracking-[0.12em] uppercase"
                style={{ backgroundColor: DEEP_GREEN, color: "#AEB5C2" }}
              >
                <span>Metric</span>
                <span>Before AI</span>
                <span>AI-Optimized</span>
                <span>Lift</span>
              </div>

              {roiMetrics.map((row, i) => (
                <div
                  key={row.metric}
                  className="grid grid-cols-4 gap-4 px-6 py-5 items-center"
                  style={{
                    backgroundColor: i % 2 === 0 ? "#FAFAF8" : IVORY,
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <span className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>
                    {row.metric}
                  </span>
                  <span className="text-sm" style={{ color: SLATE }}>
                    {row.before}
                  </span>
                  <span className="text-sm font-medium" style={{ color: FOREST }}>
                    {row.after}
                  </span>
                  <span
                    className="inline-flex items-center justify-center text-xs font-medium px-3 py-1 rounded-full w-fit"
                    style={{ backgroundColor: `${FOREST}12`, color: FOREST }}
                  >
                    {row.lift}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━ SLIDE 7: AI Investment & Startup Ecosystem ━━━ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: IVORY }}>
        <div className="container-premium">
          {/* Header */}
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase mb-4"
              style={{ color: FOREST }}
            >
              Market Momentum · Capital Flows
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight max-w-3xl"
              style={{ color: TEXT_PRIMARY }}
            >
              $400M+ Raised by AI-Native Fashion Startups
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: SLATE }}>
              BoF tracked 17 AI-native fashion startups that raised over $400M combined. Gensmo AI ($70M, ex-Google founder) and Daydream ($50M, ex-COO of Stitch Fix)
              lead the pack. Altana raised $200M for supply chain compliance AI used by L.L. Bean and Skims. Profound raised $35M to help brands like Mejuri appear in
              AI chatbot results. As Amber Atherton (Partner, Patron VC) puts it: "There's gonna be one or two key winners. Every investor is hoping they back the right approach."
            </p>
          </FadeIn>

          {/* Funding Momentum — Callout + Key Stats */}
          <FadeIn delay={0.15}>
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              {/* Callout card */}
              <div
                className="rounded-2xl p-8 md:p-10 flex flex-col justify-center items-center text-center"
                style={{ border: `2px solid ${FOREST}`, backgroundColor: "#FAFAF8" }}
              >
                <p className="font-display font-medium tracking-tight" style={{ color: FOREST, fontSize: "clamp(3rem, 5vw, 4.5rem)", lineHeight: 1 }}>
                  {startupMeta.funding}
                </p>
                <p className="mt-3 text-sm" style={{ color: SLATE }}>
                  Raised across {startupMeta.count} AI-native startups
                </p>
              </div>

              {/* Capital Allocation Breakdown */}
              <div className="md:col-span-2">
                <p className="text-xs font-medium tracking-[0.15em] uppercase mb-6" style={{ color: SLATE }}>
                  Capital Allocation by Category
                </p>
                <div className="space-y-5">
                  {[
                    { label: "Design & Generative AI", pct: 28, highlight: true },
                    { label: "Commerce & Personalization", pct: 24 },
                    { label: "Supply Chain & Allocation", pct: 18 },
                    { label: "Pricing & Optimization", pct: 15 },
                    { label: "Resale & Lifecycle AI", pct: 10 },
                    { label: "Other", pct: 5 },
                  ].map((item, i) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>{item.label}</span>
                        <span className="font-display text-lg font-medium" style={{ color: item.highlight ? FOREST : TEXT_PRIMARY }}>{item.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ backgroundColor: `${SLATE}12` }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.highlight ? FOREST : TEAL }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.2 + i * 0.08 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Ecosystem Cluster Cards */}
          <FadeIn delay={0.25}>
            <div className="mt-16">
              <p className="text-xs font-medium tracking-[0.15em] uppercase mb-6" style={{ color: SLATE }}>
                Ecosystem Clusters
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {startupClusters.map((cluster, i) => (
                  <motion.div
                    key={cluster.category}
                    className="rounded-xl p-6 h-full"
                    style={{
                      backgroundColor: "#FAFAF8",
                      borderTop: `3px solid ${cluster.color}`,
                    }}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    <p className="text-sm font-semibold tracking-[0.1em] uppercase" style={{ color: TEXT_PRIMARY }}>
                      {cluster.category}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: SLATE }}>
                      {cluster.examples}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Startup Value Proposition Grid */}
          <FadeIn delay={0.35}>
            <div className="mt-14">
              <p className="text-xs font-medium tracking-[0.15em] uppercase mb-6" style={{ color: SLATE }}>
                What AI Startups Deliver
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { title: "Speed", bullets: ["Design products faster", "Auto-create product listings", "Get trends to market sooner"], accent: FOREST },
                  { title: "Lower Costs", bullets: ["Less unsold inventory", "Better timing on sales", "Smarter supplier choices"], accent: TEAL },
                  { title: "Personalization", bullets: ["AI-powered search", "AI shopping assistants", "Recommendations that actually fit"], accent: LAVENDER },
                  { title: "Product Lifecycle", bullets: ["Predict which items get returned", "Price resale items automatically", "Keep customers coming back"], accent: CORAL },
                ].map((card, i) => (
                  <motion.div
                    key={card.title}
                    className="rounded-xl p-6"
                    style={{ backgroundColor: "#FAFAF8", borderLeft: `3px solid ${card.accent}` }}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <p className="text-sm font-semibold" style={{ color: TEXT_PRIMARY }}>{card.title}</p>
                    <ul className="mt-3 space-y-2">
                      {card.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: card.accent }} />
                          <span className="text-xs leading-relaxed" style={{ color: SLATE }}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Investor Thesis Panel — Dark */}
          <FadeIn delay={0.45}>
            <div
              className="mt-14 rounded-xl p-8 md:p-12"
              style={{ backgroundColor: DEEP_GREEN }}
            >
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase mb-5" style={{ color: LAVENDER }}>
                    What Investors Are Funding
                  </p>
                  <p className="text-sm mb-4" style={{ color: "#AEB5C2" }}>
                    Automation that:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Gets more done in less time",
                      "Makes profits more predictable",
                      "Reduces guesswork in stocking",
                      "Helps companies spend money smarter",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: LAVENDER }} />
                        <span className="text-base" style={{ color: IVORY }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p
                    className="font-display text-xl md:text-2xl font-medium tracking-tight leading-relaxed"
                    style={{ color: IVORY }}
                  >
                    AI investment in fashion is real, not hype.{" "}
                    <span style={{ color: LAVENDER }}>
                      The money goes to AI that directly boosts profits — not just makes things look nicer.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━ SLIDE 8: Growth Segments ━━━ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: DEEP_GREEN }}>
        <div className="container-premium">
          {/* Header */}
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase mb-4"
              style={{ color: CORAL }}
            >
              Structural Winners · 2026–2030
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white max-w-3xl"
            >
              High-Growth Segments Reshaping Fashion
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: "#AEB5C2" }}>
              Not all fashion segments will benefit equally from AI. The highest-growth opportunities sit at the intersection
              of three forces: consumers demanding personalization, categories where inventory misjudgment is expensive, and segments
              where online-first shopping makes data collection natural. These four segments are structurally positioned to outperform.
            </p>
          </FadeIn>

          {/* Segment Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {growthSegments.map((seg, i) => (
              <motion.div
                key={seg.segment}
                className="rounded-xl p-7 h-full relative overflow-hidden"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderTop: `3px solid ${seg.color}`,
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
                  style={{ color: seg.color, fontSize: "clamp(2.5rem, 4vw, 3.5rem)", lineHeight: 1 }}
                >
                  {seg.cagr}
                </p>
                <p className="mt-4 text-sm font-semibold tracking-[0.1em] uppercase text-white">
                  {seg.segment}
                </p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "#AEB5C2" }}>
                  {seg.note}
                </p>
                {/* Subtle glow */}
                <div
                  className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-[60px] opacity-10"
                  style={{ backgroundColor: seg.color }}
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
                The biggest fashion growth opportunities are where{" "}
                <span style={{ color: LAVENDER }}>personalized shopping, smarter stocking, and online-first buying meet.</span>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━ SLIDE 9: AI Evolution Timeline ━━━ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: IVORY }}>
        <div className="container-premium">
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase mb-4"
              style={{ color: FOREST }}
            >
              Infrastructure Shift · AI Maturity
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight max-w-3xl"
              style={{ color: TEXT_PRIMARY }}
            >
              From Tools to Agents to Autonomous Systems
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: SLATE }}>
              Fashion AI is progressing through four distinct maturity stages, each building on the last. We've moved from basic statistical
              forecasting (2018) through generative content tools (2023) into today's agentic phase — where AI doesn't just suggest actions,
              it executes them. By 2030, the most advanced fashion companies will operate with autonomous AI managing pricing, inventory,
              and customer engagement with minimal human oversight.
            </p>
          </FadeIn>

          {/* Timeline */}
          <FadeIn delay={0.2}>
            <div className="mt-16 relative">
              {/* Horizontal timeline line — desktop only */}
              <motion.div
                className="hidden md:block absolute top-[60px] left-[12.5%] right-[12.5%] h-px"
                style={{ backgroundColor: `${SLATE}30` }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
                {aiTimelineStages.map((stage, i) => {
                  const isActive = i === 2; // 2025 — current phase
                  return (
                    <motion.div
                      key={stage.year}
                      className="text-center relative"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                    >
                      {/* Node */}
                      <div className="flex items-center justify-center mb-6">
                        <motion.div
                          className="relative flex items-center justify-center"
                          whileInView={isActive ? { scale: [0.9, 1] } : {}}
                          viewport={{ once: true }}
                          transition={{ delay: 0.8, duration: 0.4 }}
                        >
                          {isActive && (
                            <div
                              className="absolute w-14 h-14 rounded-full opacity-20"
                              style={{ backgroundColor: FOREST }}
                            />
                          )}
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center z-10"
                            style={{
                              backgroundColor: isActive ? FOREST : "transparent",
                              border: `2px solid ${isActive ? FOREST : SLATE}`,
                            }}
                          >
                            {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </motion.div>
                      </div>

                      {/* Year */}
                      <p
                        className="font-display text-3xl md:text-4xl font-medium tracking-tight"
                        style={{ color: isActive ? FOREST : TEXT_PRIMARY }}
                      >
                        {stage.year}
                      </p>

                      {/* Phase label */}
                      <p
                        className="mt-3 text-sm font-semibold tracking-[0.08em] uppercase"
                        style={{ color: isActive ? FOREST : TEXT_PRIMARY }}
                      >
                        {stage.label}
                      </p>

                      {/* Description */}
                      <p className="mt-3 text-xs leading-relaxed mx-auto max-w-[200px]" style={{ color: SLATE }}>
                        {stage.description}
                      </p>

                      {/* "We are here" indicator */}
                      {isActive && (
                        <motion.div
                          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                          style={{ backgroundColor: `${FOREST}10`, border: `1px solid ${FOREST}30` }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.2 }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: FOREST }} />
                          <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: FOREST }}>
                            We Are Here
                          </span>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          {/* Dark Strategic Insight */}
          <FadeIn delay={0.5}>
            <div
              className="mt-14 rounded-xl p-8 md:p-10"
              style={{ backgroundColor: DEEP_GREEN }}
            >
              <p
                className="font-display text-xl md:text-2xl font-medium tracking-tight leading-relaxed text-center"
                style={{ color: IVORY }}
              >
                AI is evolving from a helper → to a co-worker → to making decisions on its own.{" "}
                <span style={{ color: LAVENDER }}>
                  The winners will be the ones who build the brains behind fashion — not just the website.
                </span>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ━━━ SLIDE 10: Future Vision + CTA ━━━ */}
      <section
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: DEEP_GREEN }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-15"
          style={{ backgroundColor: FOREST }}
        />

        <div className="relative text-center max-w-4xl mx-auto px-6 py-24 md:py-32">
          <FadeIn>
            <p
              className="text-xs font-medium tracking-[0.3em] uppercase mb-8"
              style={{ color: LAVENDER }}
            >
              2030 Outlook
            </p>
            <h2
              className="font-display font-medium tracking-tight leading-[1.06]"
              style={{ color: IVORY, fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              Fashion Becomes<br />
              <span style={{ color: LAVENDER }}>Intelligence-First</span>
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

          <FadeIn delay={0.3}>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-12 md:gap-16">
              {[
                { value: "$89B", label: "AI market by 2035" },
                { value: "30%", label: "EU online share by 2030" },
                { value: "40%", label: "Gen Z AI shopping" },
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

          <FadeIn delay={0.5}>
            <p className="mt-14 text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: "#AEB5C2" }}>
              EU fashion e-commerce will grow from $137B to $233B by 2030 (Google/Deloitte). Agentic commerce could reach $3-5T globally.
              Resale will hit 23% market share. The brands that dominate won't win on storefronts or ad budgets — they'll win because AI powers
              every decision from design to delivery. As Nick Kramer (SSA & Company) puts it: "AI really does promise to change the game and
              create new winners in the fashion industry." The window is open now. By 2028, the data moats will make it nearly impossible to catch up.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ━━━ CTA + Sources ━━━ */}
      <ReportSection id="cta">
        <div className="space-y-12">
          <DarkCTASection
            title="Build the AI tools fashion actually needs"
            subtitle="There's a huge gap in the market — mid-size fashion brands need better AI tools, and nobody's built them yet. If you're building for fashion, now is the time."
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
            methodology={methodology}
            definitions={definitions}
            limitations={limitations}
          />
        </div>
      </ReportSection>
    </article>
  );
};

export default FashionAiReport;
