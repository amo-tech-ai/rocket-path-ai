import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/**
 * AI Adoption — Slide 3: Executive Summary (300 frames / 10s)
 *
 * PROFESSIONAL MOTION INFOGRAPHIC — applies:
 *  - Film grain overlay for premium texture
 *  - Parallax background drift on glow orbs
 *  - Each insight gets its OWN spotlight moment (one stat per moment)
 *  - Number overshoot + spring pop settle
 *  - Blur-fade scene transitions
 *  - Deep glow 3-layer SVG arcs with breathing bloom
 *  - Kinetic typography on titles
 *  - Glass-morphism card edges with frosted highlights
 *  - Staggered micro-delays within card elements
 *  - Hold frames after key reveals
 *  - Sentiment arrows with spring bounce entrance
 *
 * Scene 1 (0–70):    Kinetic title reveal
 * Scene 2 (70–300):  Four insight cards — one dramatic moment each
 */

// ─── Design Tokens ──────────────────────────────────────────────────

const T = {
  bg: '#0A0F0D',
  bgCard: '#0F1A14',
  surface: '#141F19',
  accent: '#3D9A5F',
  accentGlow: '#4AE07A',
  blue: '#4B8BF5',
  blueGlow: '#6BA3FF',
  amber: '#F5A623',
  amberGlow: '#FFD06B',
  red: '#E05A47',
  text: '#FFFFFF',
  textSec: '#B4C4BA',
  textMuted: '#6B7E72',
  textDim: '#3A4D42',
} as const;

const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = 'system-ui, -apple-system, sans-serif';
const MONO = '"SF Mono", "Fira Code", "Consolas", monospace';

const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

const reveal = (frame: number, delay: number, distance = 14) => ({
  opacity: interpolate(frame - delay, [0, 22], [0, 1], CLAMP),
  transform: `translateY(${interpolate(frame - delay, [0, 22], [distance, 0], CLAMP)}px)`,
  filter: `blur(${interpolate(frame - delay, [0, 16], [4, 0], CLAMP)}px)`,
});

const overshoot = (frame: number, delay: number, duration: number, target: number) => {
  const t = interpolate(frame - delay, [0, duration * 0.7, duration * 0.85, duration], [0, target * 1.08, target * 0.98, target], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  return Math.max(0, t);
};

// ─── Film Grain ─────────────────────────────────────────────────────

const FilmGrain: React.FC<{ intensity?: number }> = ({ intensity = 0.035 }) => {
  const frame = useCurrentFrame();
  const ox = (frame * 7.3) % 64;
  const oy = (frame * 11.1) % 64;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: intensity,
        backgroundImage: `radial-gradient(circle, ${T.text} 0.5px, transparent 0.5px)`,
        backgroundSize: '4px 4px',
        backgroundPosition: `${ox}px ${oy}px`,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }}
    />
  );
};

// ─── Atmospheric Background with Parallax ───────────────────────────

const AtmoBg: React.FC<{ color1?: string; color2?: string }> = ({
  color1 = T.accent,
  color2 = T.blue,
}) => {
  const frame = useCurrentFrame();
  const dx1 = Math.sin(frame * 0.008) * 12;
  const dy1 = Math.cos(frame * 0.006) * 8;
  const dx2 = Math.cos(frame * 0.01) * 10;
  const dy2 = Math.sin(frame * 0.007) * 14;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: T.bg }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)' }} />
      <div style={{ position: 'absolute', top: -200 + dy1, right: -200 + dx1, width: 900, height: 900, borderRadius: 450, background: `radial-gradient(circle, ${color1}14 0%, ${color1}08 30%, transparent 60%)` }} />
      <div style={{ position: 'absolute', bottom: -300 + dy2, left: -200 + dx2, width: 1000, height: 1000, borderRadius: 500, background: `radial-gradient(circle, ${color2}0C 0%, ${color2}06 30%, transparent 60%)` }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: `radial-gradient(${T.text} 0.8px, transparent 0.8px)`, backgroundSize: '40px 40px', backgroundPosition: `${dx1 * 0.3}px ${dy1 * 0.3}px` }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.012, backgroundImage: `repeating-linear-gradient(0deg, ${T.text} 0px, transparent 1px, transparent 4px)` }} />
      <FilmGrain />
    </div>
  );
};

// ─── 3-Layer Deep Glow Arc ──────────────────────────────────────────

const Arc: React.FC<{
  value: number;
  color: string;
  glowColor: string;
  size: number;
  strokeWidth: number;
  progress: number;
  breathePhase?: number;
}> = ({ value, color, glowColor, size, strokeWidth, progress, breathePhase = 0 }) => {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - (value / 100) * progress);
  const breathe = 0.8 + 0.2 * Math.sin(breathePhase);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.surface} strokeWidth={strokeWidth} opacity={0.5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={glowColor} strokeWidth={strokeWidth + 18} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" opacity={0.04 * breathe} style={{ filter: 'blur(12px)' }} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={glowColor} strokeWidth={strokeWidth + 7} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" opacity={0.14 * breathe} style={{ filter: 'blur(5px)' }} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 5px ${glowColor}90)` }} />
    </svg>
  );
};

// ─── Insight Data ───────────────────────────────────────────────────

interface Insight {
  numericVal: number;
  hasDot: boolean;
  suffix: string;
  title: string;
  detail: string;
  color: string;
  glowColor: string;
  ringVal: number;
  sentiment: 'up' | 'down' | 'neutral';
}

const INSIGHTS: Insight[] = [
  { numericVal: 72, hasDot: false, suffix: '%', title: 'Tipping Point Crossed', detail: '65% adopted Gen AI in just 10 months', color: T.accent, glowColor: T.accentGlow, ringVal: 72, sentiment: 'up' },
  { numericVal: 74, hasDot: false, suffix: '%', title: "Can\u2019t Scale Past Pilots", detail: 'No tangible financial returns from AI investments', color: T.amber, glowColor: T.amberGlow, ringVal: 74, sentiment: 'down' },
  { numericVal: 1.5, hasDot: true, suffix: '\u00D7', title: 'Leaders Pulling Away', detail: '1.6\u00D7 shareholder returns vs. peers', color: T.accent, glowColor: T.accentGlow, ringVal: 75, sentiment: 'up' },
  { numericVal: 31, hasDot: false, suffix: '%', title: 'Manufacturing Upside', detail: '4\u20138% adoption but 31% productivity gains', color: T.blue, glowColor: T.blueGlow, ringVal: 31, sentiment: 'up' },
];

// ═══════════════════════════════════════════════════════════════════
// SCENE 1: KINETIC TITLE  (0–70)
// ═══════════════════════════════════════════════════════════════════

const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exitOp = interpolate(frame, [52, 70], [1, 0], CLAMP);
  const exitBlur = interpolate(frame, [52, 70], [0, 8], CLAMP);

  const labelStyle = reveal(frame, 3);

  // Kinetic title — tracking + scale
  const titleOp = interpolate(frame, [10, 26], [0, 1], CLAMP);
  const titleScale = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const titleTracking = interpolate(frame, [10, 32], [0.12, -0.01], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const titleBlur = interpolate(frame, [10, 22], [6, 0], CLAMP);

  // "Insights" — italic accent with overshoot
  const insightScale = spring({ frame: frame - 20, fps, config: { damping: 14, mass: 0.4, stiffness: 280 } });
  const insightOp = interpolate(frame, [18, 28], [0, 1], CLAMP);

  const subStyle = reveal(frame, 30);

  // Accent line
  const lineWidth = spring({ frame: frame - 34, fps, config: { damping: 200 } });
  const lineGlow = interpolate(frame, [34, 44, 52], [0, 0.8, 0.3], CLAMP);

  return (
    <AbsoluteFill style={{ opacity: exitOp, filter: `blur(${exitBlur}px)` }}>
      <AtmoBg />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...labelStyle, fontSize: 13, fontFamily: MONO, fontWeight: 600, color: T.accent, letterSpacing: '0.25em', marginBottom: 28 }}>
          EXECUTIVE SUMMARY
        </div>
        <div
          style={{
            opacity: titleOp,
            transform: `scale(${interpolate(titleScale, [0, 1], [0.88, 1], CLAMP)})`,
            filter: `blur(${titleBlur}px)`,
            fontSize: 130,
            fontFamily: SERIF,
            fontWeight: 400,
            color: T.text,
            lineHeight: 1,
            textAlign: 'center',
            letterSpacing: `${titleTracking}em`,
          }}
        >
          Four Key{' '}
          <span
            style={{
              fontStyle: 'italic',
              color: T.accent,
              display: 'inline-block',
              opacity: insightOp,
              transform: `scale(${interpolate(insightScale, [0, 1.15], [1.25, 1], CLAMP)})`,
              textShadow: `0 0 40px ${T.accent}25`,
            }}
          >
            Insights
          </span>
        </div>

        {/* Accent line — 3-layer */}
        <div style={{ position: 'relative', marginTop: 32, height: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {lineGlow > 0 && (
            <div style={{ position: 'absolute', width: 300 * lineWidth, height: 16, background: `linear-gradient(90deg, transparent, ${T.accent}${Math.round(lineGlow * 30).toString(16).padStart(2, '0')}, transparent)`, filter: 'blur(10px)' }} />
          )}
          <div style={{ width: 240 * lineWidth, height: 2, background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`, boxShadow: lineGlow > 0 ? `0 0 ${10 * lineGlow}px ${T.accent}AA` : 'none' }} />
        </div>

        <div style={{ ...subStyle, fontSize: 20, fontFamily: SANS, color: T.textSec, marginTop: 24, letterSpacing: '0.06em' }}>
          What the data reveals about AI adoption
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════
// SCENE 2: FOUR INSIGHTS — one spotlight per stat  (0–230)
// ═══════════════════════════════════════════════════════════════════

const InsightCard: React.FC<{
  insight: Insight;
  index: number;
  delay: number;
  countStart: number;
}> = ({ insight, index, delay, countStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry: slide + scale + blur
  const slideProgress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const cardOp = interpolate(frame - delay, [0, 18], [0, 1], CLAMP);
  const cardBlur = interpolate(frame - delay, [0, 14], [6, 0], CLAMP);
  const xDir = index % 2 === 0 ? -1 : 1;
  const yDir = index < 2 ? -1 : 1;
  const cardX = interpolate(slideProgress, [0, 1], [50 * xDir, 0], CLAMP);
  const cardY = interpolate(slideProgress, [0, 1], [35 * yDir, 0], CLAMP);
  const cardScale = interpolate(slideProgress, [0, 1], [0.92, 1], CLAMP);

  // Entry glow flash — 3-layer
  const entryGlow = interpolate(frame - delay, [8, 16, 32], [0, 0.8, 0], CLAMP);

  // Overshoot count
  const countDuration = 36;
  const rawNum = overshoot(frame, countStart, countDuration, insight.numericVal);
  const displayNum = insight.hasDot ? rawNum.toFixed(1) : Math.round(rawNum).toString();

  // Stat pop at end of count
  const popFrame = countStart + countDuration - 4;
  const statPop = spring({ frame: frame - popFrame, fps, config: { damping: 14, mass: 0.4, stiffness: 200 } });
  const countProgress = interpolate(frame - countStart, [0, countDuration], [0, 1], CLAMP);
  const statScale = countProgress >= 0.9 ? interpolate(statPop, [0, 1.08], [1.08, 1], CLAMP) : 1;

  // Ring progress with breathing
  const ringProg = interpolate(frame - countStart, [0, 40], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const breathePhase = Math.max(0, frame - countStart - 40) * 0.12;

  // Sentiment arrow — spring bounce entrance
  const arrowOp = interpolate(frame - countStart, [20, 30], [0, 1], CLAMP);
  const arrowBounce = spring({ frame: frame - countStart - 20, fps, config: { damping: 12, mass: 0.3, stiffness: 300 } });
  const sentimentSymbol = insight.sentiment === 'up' ? '\u2197' : insight.sentiment === 'down' ? '\u2198' : '\u2192';

  // Staggered internal elements
  const titleReveal = reveal(frame, delay + 12, 8);
  const dividerOp = interpolate(frame - delay, [18, 26], [0, 1], CLAMP);
  const detailReveal = reveal(frame, delay + 20, 6);

  // Subtle card float
  const floatY = cardOp > 0.9 ? Math.sin(frame * 0.04 + index * 1.5) * 1.5 : 0;

  return (
    <div
      style={{
        opacity: cardOp,
        transform: `translate(${cardX}px, ${cardY + floatY}px) scale(${cardScale})`,
        filter: `blur(${cardBlur}px)`,
        backgroundColor: T.bgCard,
        borderRadius: 20,
        padding: '32px 30px 28px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 28px 72px rgba(0,0,0,0.45), 0 10px 28px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      {/* Glass top edge — frosted highlight */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 70%, transparent)` }} />
      {/* Color top edge */}
      <div style={{ position: 'absolute', top: 1, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${insight.color}50, transparent)` }} />
      {/* Left accent with deep glow */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${insight.color}, ${insight.color}30)`, borderRadius: '20px 0 0 20px' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: `linear-gradient(180deg, ${insight.color}40, ${insight.color}10)`, borderRadius: '20px 0 0 20px', filter: 'blur(4px)' }} />

      {/* Entry glow — 3 layers */}
      {entryGlow > 0 && (
        <>
          <div style={{ position: 'absolute', inset: -2, borderRadius: 22, border: `1px solid ${insight.color}`, opacity: entryGlow * 0.3, filter: 'blur(8px)' }} />
          <div style={{ position: 'absolute', inset: -1, borderRadius: 21, border: `1px solid ${insight.color}`, opacity: entryGlow * 0.6, filter: 'blur(3px)' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 20, border: `1px solid ${insight.color}`, opacity: entryGlow * 0.8 }} />
        </>
      )}

      {/* Ring (top-right) */}
      <div style={{ position: 'absolute', top: 16, right: 16 }}>
        <Arc value={insight.ringVal} color={insight.color} glowColor={insight.glowColor} size={56} strokeWidth={3.5} progress={ringProg} breathePhase={breathePhase} />
      </div>

      {/* Number + sentiment */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 6 }}>
        <div
          style={{
            fontSize: 84,
            fontFamily: SANS,
            fontWeight: 900,
            color: T.text,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            transform: `scale(${statScale})`,
            transformOrigin: 'left bottom',
            textShadow: countProgress > 0.8 ? `0 0 20px ${insight.color}20` : 'none',
          }}
        >
          {displayNum}{insight.suffix}
        </div>
        <span
          style={{
            fontSize: 30,
            color: insight.sentiment === 'down' ? T.amber : T.accent,
            opacity: arrowOp,
            display: 'inline-block',
            transform: `scale(${interpolate(arrowBounce, [0, 1.2], [0.3, 1], CLAMP)}) translateY(${interpolate(arrowBounce, [0, 1], [-8, 0], CLAMP)}px)`,
          }}
        >
          {sentimentSymbol}
        </span>
      </div>

      {/* Title — staggered */}
      <div style={{ ...titleReveal, fontSize: 22, fontFamily: SANS, fontWeight: 700, color: T.text, lineHeight: 1.2 }}>
        {insight.title}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: `linear-gradient(90deg, ${insight.color}35, transparent)`, margin: '6px 0', opacity: dividerOp }} />

      {/* Detail — staggered */}
      <div style={{ ...detailReveal, fontSize: 14, fontFamily: SANS, color: T.textSec, lineHeight: 1.55 }}>
        {insight.detail}
      </div>

      {/* Ambient corner glow */}
      <div style={{ position: 'absolute', bottom: -40, right: -40, width: 140, height: 140, borderRadius: 70, background: `radial-gradient(circle, ${insight.color}0C 0%, transparent 60%)` }} />
    </div>
  );
};

const InsightsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryOp = interpolate(frame, [0, 18], [0, 1], CLAMP);
  const entryBlur = interpolate(frame, [0, 12], [4, 0], CLAMP);

  // Section header
  const labelStyle = reveal(frame, 3);
  const lineProgress = spring({ frame: frame - 14, fps, config: { damping: 200 } });

  // Card stagger — wider gaps for "one stat per moment"
  const cardDelays = [16, 40, 64, 88];
  // Count-up starts staggered too — each card gets its spotlight
  const countStarts = [50, 70, 90, 110];

  // Bottom quote — delayed hold
  const quoteOp = interpolate(frame, [185, 205], [0, 1], CLAMP);
  const quoteBlur = interpolate(frame, [185, 200], [4, 0], CLAMP);
  const quoteY = interpolate(frame, [185, 205], [10, 0], CLAMP);

  return (
    <AbsoluteFill style={{ opacity: entryOp, filter: `blur(${entryBlur}px)` }}>
      <AtmoBg color1={T.accent} color2={T.amber} />

      <div style={{ position: 'absolute', inset: 0, padding: '44px 72px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ ...labelStyle, fontSize: 12, fontFamily: MONO, fontWeight: 600, color: T.accent, letterSpacing: '0.25em' }}>
            4 KEY INSIGHTS
          </div>
          {/* Accent line with glow */}
          <div style={{ position: 'relative', marginTop: 10, height: 3 }}>
            <div style={{ position: 'absolute', width: 50 * lineProgress, height: 6, backgroundColor: `${T.accent}20`, borderRadius: 3, filter: 'blur(4px)' }} />
            <div style={{ width: 44 * lineProgress, height: 2, backgroundColor: T.accent, borderRadius: 1, opacity: interpolate(frame - 14, [-1, 0], [0, 1], CLAMP) }} />
          </div>
        </div>

        {/* 2x2 Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {INSIGHTS.map((ins, i) => (
            <InsightCard key={i} insight={ins} index={i} delay={cardDelays[i]} countStart={countStarts[i]} />
          ))}
        </div>

        {/* Bottom quote */}
        <div style={{ opacity: quoteOp, transform: `translateY(${quoteY}px)`, filter: `blur(${quoteBlur}px)`, textAlign: 'center', marginTop: 20 }}>
          <div style={{ fontSize: 17, fontFamily: SERIF, fontStyle: 'italic', color: T.textMuted, maxWidth: 800, margin: '0 auto', lineHeight: 1.55 }}>
            {'\u201C'}The companies seeing 1.5{'\u00D7'} revenue growth aren{'\u2019'}t buying better tools {'\u2014'} they{'\u2019'}re redesigning how work gets done.{'\u201D'}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════

export const ExecutiveSummarySlide: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={70}>
      <TitleScene />
    </Sequence>
    <Sequence from={70} durationInFrames={230}>
      <InsightsScene />
    </Sequence>
  </AbsoluteFill>
);
