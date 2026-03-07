import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/**
 * AI Adoption — Slides 5–7: Sector Intelligence Deep Dives
 *
 * PROFESSIONAL MOTION INFOGRAPHIC — applies:
 *  - Film grain overlay for premium texture
 *  - Parallax background drift on glow orbs per sector color pair
 *  - Number overshoot + settle on donut counters
 *  - Blur-fade entry/exit transitions
 *  - Deep glow 3-layer SVG donuts with breathing bloom
 *  - Staggered bullet typewriter-like entrance (per-line fade+slide)
 *  - Metric mini-bars with overshoot fill + glow
 *  - VS divider with animated pulse
 *  - Parallax card depth (left elevated, right lowered)
 *  - Glass-morphism card edges with frosted top highlight
 *  - Subtle card float/breathing animation
 *  - Hold frames after key reveals
 *  - Exit: blur + scale-down transition
 */

// ─── Design Tokens ──────────────────────────────────────────────────

const T = {
  bg: '#0A0F0D',
  bgCard: '#0F1A14',
  surface: '#141F19',
  accent: '#3D9A5F',
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
        position: 'absolute', inset: 0, opacity: intensity,
        backgroundImage: `radial-gradient(circle, ${T.text} 0.5px, transparent 0.5px)`,
        backgroundSize: '4px 4px', backgroundPosition: `${ox}px ${oy}px`,
        pointerEvents: 'none', mixBlendMode: 'overlay',
      }}
    />
  );
};

// ─── Atmospheric Background with Parallax ───────────────────────────

const AtmoBg: React.FC<{ color1: string; color2: string }> = ({ color1, color2 }) => {
  const frame = useCurrentFrame();
  const dx1 = Math.sin(frame * 0.008) * 12;
  const dy1 = Math.cos(frame * 0.006) * 8;
  const dx2 = Math.cos(frame * 0.01) * 10;
  const dy2 = Math.sin(frame * 0.007) * 14;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: T.bg }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)' }} />
      <div style={{ position: 'absolute', top: -200 + dy1, left: -100 + dx1, width: 800, height: 800, borderRadius: 400, background: `radial-gradient(circle, ${color1}12 0%, ${color1}06 30%, transparent 60%)` }} />
      <div style={{ position: 'absolute', bottom: -200 + dy2, right: -100 + dx2, width: 800, height: 800, borderRadius: 400, background: `radial-gradient(circle, ${color2}12 0%, ${color2}06 30%, transparent 60%)` }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: `radial-gradient(${T.text} 0.8px, transparent 0.8px)`, backgroundSize: '40px 40px', backgroundPosition: `${dx1 * 0.3}px ${dy1 * 0.3}px` }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.012, backgroundImage: `repeating-linear-gradient(0deg, ${T.text} 0px, transparent 1px, transparent 4px)` }} />
      <FilmGrain />
    </div>
  );
};

// ─── 3-Layer Deep Glow Donut (SVG) ──────────────────────────────────

const Donut: React.FC<{
  value: number;
  color: string;
  size: number;
  progress: number;
  breathePhase?: number;
}> = ({ value, color, size, progress, breathePhase = 0 }) => {
  const sw = 8;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - (value / 100) * progress);
  const display = Math.round(progress * value);
  const breathe = 0.8 + 0.2 * Math.sin(breathePhase);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.surface} strokeWidth={sw} opacity={0.5} />
        {/* Layer 3: Outer haze */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw + 20} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" opacity={0.04 * breathe} style={{ filter: 'blur(14px)' }} />
        {/* Layer 2: Bloom */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw + 8} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" opacity={0.12 * breathe} style={{ filter: 'blur(6px)' }} />
        {/* Layer 1: Core */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${color}80)` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <span style={{ fontSize: size * 0.3, fontFamily: SANS, fontWeight: 900, color: T.text, lineHeight: 1, letterSpacing: '-0.03em', textShadow: `0 0 14px ${color}20` }}>
          {display}
        </span>
        <span style={{ fontSize: size * 0.09, fontFamily: MONO, fontWeight: 700, color: T.textDim, letterSpacing: '0.08em', marginTop: 2 }}>% ADOPT</span>
      </div>
    </div>
  );
};

// ─── Metric Mini Bar with Overshoot Fill ────────────────────────────

const MetricBar: React.FC<{
  value: string;
  label: string;
  color: string;
  barPct: number;
  progress: number;
  delay: number;
}> = ({ value, label, color, barPct, progress, delay }) => {
  const frame = useCurrentFrame();
  const entryOp = interpolate(frame - delay, [0, 14], [0, 1], CLAMP);
  // Overshoot fill
  const fillPct = interpolate(
    progress,
    [0, 0.7, 0.85, 1],
    [0, barPct * 1.06, barPct * 0.97, barPct],
    CLAMP,
  );
  const glowIntensity = progress > 0.5 ? 0.5 + 0.2 * Math.sin(frame * 0.1) : 0;

  return (
    <div style={{ flex: 1, opacity: entryOp }}>
      <div style={{ fontSize: 24, fontFamily: SANS, fontWeight: 900, color: T.text, lineHeight: 1, textShadow: progress > 0.8 ? `0 0 10px ${color}15` : 'none' }}>{value}</div>
      <div style={{ width: '100%', height: 4, backgroundColor: `${T.surface}80`, borderRadius: 2, marginTop: 8, overflow: 'hidden', position: 'relative' }}>
        <div
          style={{
            width: `${fillPct}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: 2,
            boxShadow: glowIntensity > 0 ? `0 0 ${8 * glowIntensity}px ${color}60` : 'none',
          }}
        />
      </div>
      <div style={{ fontSize: 9, fontFamily: MONO, fontWeight: 600, color: T.textDim, letterSpacing: '0.08em', marginTop: 6, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
};

// ─── Types ──────────────────────────────────────────────────────────

export interface SectorMetric { value: string; label: string; barPercent?: number }
export interface SectorData { name: string; adoption: number; color: string; bullets: string[]; example: string; metrics: SectorMetric[] }
export interface SectorDeepDiveProps { left: SectorData; right: SectorData; insight: string }

// ─── Sector Card ────────────────────────────────────────────────────

const SectorCard: React.FC<{
  data: SectorData;
  delay: number;
  fromLeft: boolean;
  countUpStart: number;
  elevated: boolean;
}> = ({ data, delay, fromLeft, countUpStart, elevated }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry: slide + scale + blur
  const slideProgress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const cardOp = interpolate(frame - delay, [0, 18], [0, 1], CLAMP);
  const cardBlur = interpolate(frame - delay, [0, 14], [6, 0], CLAMP);
  const cardX = interpolate(slideProgress, [0, 1], [fromLeft ? -80 : 80, 0], CLAMP);
  const cardScale = interpolate(slideProgress, [0, 1], [0.9, 1], CLAMP);

  // Donut: overshoot progress
  const donutProgress = interpolate(frame - countUpStart, [0, 44], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const breathePhase = Math.max(0, frame - countUpStart - 44) * 0.12;

  // Bullet stagger — typewriter-like with slide
  const bulletDelays = data.bullets.map((_, i) => delay + 24 + i * 12);

  // Metric overshoot progress
  const metricProgress = interpolate(frame - countUpStart, [8, 42], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const metricOp = interpolate(frame - countUpStart, [0, 18], [0, 1], CLAMP);
  const metricBaseDelay = countUpStart + 4;

  // Entry glow flash — 3-layer
  const entryGlow = interpolate(frame - delay, [10, 18, 36], [0, 0.6, 0], CLAMP);

  // Subtle card float/breathe
  const floatY = cardOp > 0.9 ? Math.sin(frame * 0.035 + (fromLeft ? 0 : Math.PI)) * 2 : 0;
  const shadowDepth = elevated ? 30 : 20;

  // Example reveal
  const exReveal = reveal(frame, delay + 50, 6);

  return (
    <div
      style={{
        flex: 1,
        opacity: cardOp,
        transform: `translateX(${cardX}px) translateY(${(elevated ? -8 : 8) + floatY}px) scale(${cardScale})`,
        filter: `blur(${cardBlur}px)`,
        backgroundColor: T.bgCard,
        borderRadius: 22,
        padding: '28px 26px 22px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 ${shadowDepth}px ${shadowDepth * 2.5}px rgba(0,0,0,0.45), 0 10px 28px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Glass top edge */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 70%, transparent)` }} />
      {/* Color top edge */}
      <div style={{ position: 'absolute', top: 1, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${data.color}45, transparent)` }} />
      {/* Left accent with deep glow */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${data.color}, ${data.color}25)`, borderRadius: '22px 0 0 22px' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: `linear-gradient(180deg, ${data.color}35, ${data.color}08)`, borderRadius: '22px 0 0 22px', filter: 'blur(5px)' }} />

      {/* 3-layer entry glow */}
      {entryGlow > 0 && (
        <>
          <div style={{ position: 'absolute', inset: -2, borderRadius: 24, border: `1px solid ${data.color}`, opacity: entryGlow * 0.3, filter: 'blur(8px)' }} />
          <div style={{ position: 'absolute', inset: -1, borderRadius: 23, border: `1px solid ${data.color}`, opacity: entryGlow * 0.5, filter: 'blur(3px)' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 22, border: `1px solid ${data.color}`, opacity: entryGlow * 0.7 }} />
        </>
      )}

      {/* Donut + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 14 }}>
        <Donut value={data.adoption} color={data.color} size={105} progress={donutProgress} breathePhase={breathePhase} />
        <div>
          <div style={{ fontSize: 24, fontFamily: SANS, fontWeight: 700, color: T.text, lineHeight: 1.15 }}>{data.name}</div>
          <div style={{ fontSize: 10, fontFamily: MONO, fontWeight: 600, color: data.color, letterSpacing: '0.12em', marginTop: 5, opacity: 0.8 }}>AI ADOPTION RATE</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: `linear-gradient(90deg, ${data.color}20, ${T.surface}, transparent)`, marginBottom: 12 }} />

      {/* What AI Does — staggered typewriter */}
      <div style={{ fontSize: 9, fontFamily: MONO, fontWeight: 700, color: T.textDim, letterSpacing: '0.16em', marginBottom: 8 }}>WHAT AI DOES</div>
      {data.bullets.map((bullet, i) => {
        const bOp = interpolate(frame - bulletDelays[i], [0, 16], [0, 1], CLAMP);
        const bX = interpolate(frame - bulletDelays[i], [0, 16], [14, 0], CLAMP);
        const bBlur = interpolate(frame - bulletDelays[i], [0, 10], [3, 0], CLAMP);
        return (
          <div key={i} style={{ fontSize: 14, fontFamily: SANS, color: T.textSec, lineHeight: 1.55, paddingLeft: 18, position: 'relative', marginBottom: 3, opacity: bOp, transform: `translateX(${bX}px)`, filter: `blur(${bBlur}px)` }}>
            <span style={{ position: 'absolute', left: 0, color: data.color, fontSize: 17, fontWeight: 700, top: -1 }}>{'\u203A'}</span>
            {bullet}
          </div>
        );
      })}

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: `${T.surface}80`, margin: '10px 0 8px' }} />

      {/* Example — staggered */}
      <div style={{ ...exReveal, fontSize: 13, fontFamily: SERIF, fontStyle: 'italic', color: T.textMuted, lineHeight: 1.5, borderLeft: `2px solid ${data.color}20`, paddingLeft: 10 }}>
        {data.example}
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: `${T.surface}80`, margin: '8px 0' }} />

      {/* Metrics with overshoot fill */}
      <div style={{ display: 'flex', gap: 16, opacity: metricOp }}>
        {data.metrics.map((m, i) => (
          <MetricBar key={i} value={m.value} label={m.label} color={data.color} barPct={m.barPercent ?? 70} progress={metricProgress} delay={metricBaseDelay + i * 6} />
        ))}
      </div>

      {/* Ambient corner glow */}
      <div style={{ position: 'absolute', bottom: -45, right: -45, width: 160, height: 160, borderRadius: 80, background: `radial-gradient(circle, ${data.color}0A 0%, transparent 60%)` }} />
    </div>
  );
};

// ─── VS Divider with Animated Pulse ─────────────────────────────────

const VSDivider: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = interpolate(frame - delay, [0, 20], [0, 1], CLAMP);
  const lineGrow = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const badgePop = spring({ frame: frame - delay - 6, fps, config: { damping: 14, mass: 0.4, stiffness: 200 } });
  // Pulse after entry
  const pulse = op > 0.9 ? 1 + 0.025 * Math.sin(frame * 0.12) : 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 52, opacity: op, gap: 10 }}>
      <div style={{ width: 1, height: 110 * lineGrow, background: `linear-gradient(180deg, transparent, ${T.textDim}50, transparent)` }} />
      <div
        style={{
          fontSize: 11,
          fontFamily: MONO,
          fontWeight: 900,
          color: T.textDim,
          letterSpacing: '0.2em',
          padding: '8px 14px',
          borderRadius: 10,
          border: `1px solid ${T.textDim}30`,
          backgroundColor: `${T.bg}CC`,
          backdropFilter: 'blur(8px)',
          transform: `scale(${interpolate(badgePop, [0, 1.1], [0.4, 1], CLAMP) * pulse})`,
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        VS
      </div>
      <div style={{ width: 1, height: 110 * lineGrow, background: `linear-gradient(180deg, transparent, ${T.textDim}50, transparent)` }} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════

const SectorDeepDiveSlide: React.FC<SectorDeepDiveProps> = ({ left, right, insight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry: blur-fade
  const entryOp = interpolate(frame, [0, 18], [0, 1], CLAMP);
  const entryBlur = interpolate(frame, [0, 12], [4, 0], CLAMP);
  // Exit: blur + scale-down
  const exitOp = interpolate(frame, [235, 280], [1, 0], CLAMP);
  const exitBlur = interpolate(frame, [235, 280], [0, 8], CLAMP);
  const exitScale = interpolate(frame, [235, 280], [1, 0.97], CLAMP);

  const labelStyle = reveal(frame, 3);
  const subStyle = reveal(frame, 8);
  const lineProgress = spring({ frame: frame - 14, fps, config: { damping: 200 } });

  // Insight callout — with pop
  const insightOp = interpolate(frame, [135, 155], [0, 1], CLAMP);
  const insightPop = spring({ frame: frame - 135, fps, config: { damping: 200 } });
  const insightBlur = interpolate(frame, [135, 150], [4, 0], CLAMP);

  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(entryOp, exitOp),
        filter: `blur(${Math.max(entryBlur, exitBlur)}px)`,
        transform: `scale(${exitScale})`,
      }}
    >
      <AtmoBg color1={left.color} color2={right.color} />

      <div style={{ position: 'absolute', inset: 0, padding: '40px 64px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ ...labelStyle, fontSize: 12, fontFamily: MONO, fontWeight: 600, color: T.accent, letterSpacing: '0.25em' }}>
            SECTOR INTELLIGENCE {'\u00B7'} DEEP DIVES
          </div>
          <div style={{ ...subStyle, fontSize: 26, fontFamily: SERIF, fontWeight: 400, color: T.text, lineHeight: 1.2, marginTop: 6 }}>
            What AI Looks Like{' '}
            <span style={{ fontStyle: 'italic', color: T.accent }}>Inside Each Sector</span>
          </div>
          <div style={{ position: 'relative', marginTop: 8, height: 3 }}>
            <div style={{ position: 'absolute', width: 55 * lineProgress, height: 6, backgroundColor: `${T.accent}18`, borderRadius: 3, filter: 'blur(4px)' }} />
            <div style={{ width: 44 * lineProgress, height: 2, backgroundColor: T.accent, borderRadius: 1, opacity: interpolate(frame - 14, [-1, 0], [0, 1], CLAMP) }} />
          </div>
        </div>

        {/* Cards + VS */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0 }}>
          <SectorCard data={left} delay={16} fromLeft={true} countUpStart={72} elevated={true} />
          <VSDivider delay={28} />
          <SectorCard data={right} delay={40} fromLeft={false} countUpStart={72} elevated={false} />
        </div>

        {/* Insight callout */}
        <div
          style={{
            opacity: insightOp,
            transform: `translateY(${interpolate(insightPop, [0, 1], [12, 0], CLAMP)}px)`,
            filter: `blur(${insightBlur}px)`,
            fontSize: 16,
            fontFamily: SERIF,
            fontStyle: 'italic',
            color: T.textSec,
            lineHeight: 1.55,
            textAlign: 'center',
            marginTop: 12,
            maxWidth: 960,
            alignSelf: 'center',
            padding: '12px 28px',
            borderRadius: 12,
            backgroundColor: `${T.accent}08`,
            border: `1px solid ${T.accent}15`,
            boxShadow: `0 4px 20px rgba(0,0,0,0.2)`,
          }}
        >
          {insight}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════
// INSTANCES
// ═══════════════════════════════════════════════════════════════════

export const DeepDive1: React.FC = () => (
  <SectorDeepDiveSlide
    left={{
      name: 'Technology & SaaS',
      adoption: 88,
      color: '#3D9A5F',
      bullets: ['Writes code via AI pair-programming', 'Resolves IT tickets automatically', 'Runs predictive systems at scale'],
      example: '\u201CAtlassian auto-resolves 20% of Jira tickets before engineers see them.\u201D',
      metrics: [{ value: '88%', label: 'REGULAR USE', barPercent: 88 }, { value: '39%', label: 'EBIT IMPACT', barPercent: 39 }, { value: '3\u00D7', label: 'AGENT SCALING', barPercent: 75 }],
    }}
    right={{
      name: 'Financial Services',
      adoption: 75,
      color: '#2D8B7E',
      bullets: ['Fraud detection in milliseconds', 'Contract analysis & extraction', 'Risk modeling & compliance'],
      example: '\u201CMastercard prevented $20B in fraud using real-time AI scoring.\u201D',
      metrics: [{ value: '75%', label: 'LARGE FIRMS', barPercent: 75 }, { value: '50%', label: 'FASTER RESOLUTION', barPercent: 50 }, { value: '#2', label: 'HIGHEST ADOPTER', barPercent: 85 }],
    }}
    insight={'\u201CAdoption does not equal impact. Manufacturing at 40% shows 31% productivity gains \u2014 outperforming many tech companies at 88%.\u201D'}
  />
);

export const DeepDive2: React.FC = () => (
  <SectorDeepDiveSlide
    left={{
      name: 'Healthcare',
      adoption: 55,
      color: '#4B7BE5',
      bullets: ['Diagnostic imaging analysis', 'Clinical trial matching', 'Predictive patient risk scoring'],
      example: '\u201CMayo Clinic detects heart disease from ECG with 93% accuracy.\u201D',
      metrics: [{ value: '80%+', label: 'TESTING AI', barPercent: 80 }, { value: '25%', label: 'COST REDUCTION', barPercent: 25 }, { value: '-90%', label: 'MAINTENANCE TIME', barPercent: 90 }],
    }}
    right={{
      name: 'Retail & E-commerce',
      adoption: 50,
      color: '#5B5BD6',
      bullets: ['Hyper-personalization engines', 'Inventory demand prediction', 'AI-powered search & discovery'],
      example: '\u201CAmazon\u2019s recommendation engine drives 35% of total sales.\u201D',
      metrics: [{ value: '+15%', label: 'REVENUE LIFT', barPercent: 65 }, { value: '+15%', label: 'CONVERSION', barPercent: 65 }, { value: '53%', label: 'AI SEARCH', barPercent: 53 }],
    }}
    insight={'\u201CHealthcare is where AI saves lives. Retail is where AI saves margins.\u201D'}
  />
);

export const DeepDive3: React.FC = () => (
  <SectorDeepDiveSlide
    left={{
      name: 'Manufacturing',
      adoption: 40,
      color: '#F5A623',
      bullets: ['Predictive maintenance & downtime', 'Digital twin simulations', 'Quality inspection automation'],
      example: '\u201CEuropean automaker saved \u20AC190M by predicting failures 3 weeks early.\u201D',
      metrics: [{ value: '+31%', label: 'PRODUCTIVITY', barPercent: 80 }, { value: '\u20AC190M', label: 'SAVINGS', barPercent: 70 }, { value: '77%', label: 'IMPLEMENTATION', barPercent: 77 }],
    }}
    right={{
      name: 'Logistics & Supply Chain',
      adoption: 31,
      color: '#22B8C4',
      bullets: ['Route optimization at scale', 'Demand forecasting models', 'Autonomous driving systems'],
      example: '\u201CUPS saves 100M miles annually using AI routing.\u201D',
      metrics: [{ value: '-60%', label: 'INSPECTION TIME', barPercent: 60 }, { value: '-25%', label: 'ERROR RATE', barPercent: 45 }, { value: '150K+', label: 'AUTONOMOUS RIDES', barPercent: 55 }],
    }}
    insight={'\u201CThe biggest ROI isn\u2019t where adoption is highest \u2014 it\u2019s where workflows changed most.\u201D'}
  />
);
