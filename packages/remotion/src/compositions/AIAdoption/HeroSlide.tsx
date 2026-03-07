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
 * AI Adoption by Industry — Hero (Slides 1 & 2)
 *
 * Scene 1 (0–90):   Intro title card — editorial serif, centered
 * Scene 2 (90–240): Split layout — text left, dark chart card right
 *
 * Design: BCG-aligned warm cream theme, matching the blog report layout.
 */

// ─── Design Tokens ──────────────────────────────────────────────────

const T = {
  bg: '#FAFAF8',
  card: '#0F2418',
  cardTrack: '#1C3A2B',
  accent: '#2D6B4D',
  accentMuted: '#5C8A68',
  text: '#1E1E1C',
  textSec: '#4A4744',
  textMuted: '#8A8580',
  textDim: '#BAB5AE',
  white: '#FFFFFF',
  whiteMuted: '#94A79B',
} as const;

const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = 'system-ui, -apple-system, sans-serif';

const INDUSTRIES = [
  { name: 'Technology & SaaS', value: 88, color: '#3D9A5F' },
  { name: 'Financial Services', value: 75, color: '#2D8B7E' },
  { name: 'Healthcare', value: 55, color: '#3B7DD8' },
  { name: 'Retail & E-commerce', value: 50, color: '#4A60B8' },
  { name: 'Professional Services', value: 45, color: '#8B6CB5' },
] as const;

// ─── Animation Helpers ──────────────────────────────────────────────

const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

/** Fade up reveal — the BCG editorial pattern */
const reveal = (frame: number, delay: number, distance = 12) => ({
  opacity: interpolate(frame - delay, [0, 15], [0, 1], CLAMP),
  transform: `translateY(${interpolate(frame - delay, [0, 15], [distance, 0], CLAMP)}px)`,
});

// ═══════════════════════════════════════════════════════════════════
// SCENE 1: INTRO TITLE CARD  (frames 0–90, 3 seconds)
// ═══════════════════════════════════════════════════════════════════

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Label
  const labelStyle = reveal(frame, 5);

  // "AI Adoption"
  const titleStyle = reveal(frame, 15, 16);

  // "by Industry"
  const subStyle = reveal(frame, 28, 16);

  // Accent line
  const lineProgress = spring({ frame: frame - 38, fps, config: { damping: 200 } });
  const lineVisible = interpolate(frame - 38, [-1, 0], [0, 1], CLAMP);

  // Exit fade
  const exitOpacity = interpolate(frame, [78, 90], [1, 0], CLAMP);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: T.bg,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Label */}
        <div
          style={{
            ...labelStyle,
            fontSize: 14,
            fontFamily: SANS,
            fontWeight: 500,
            color: T.accentMuted,
            letterSpacing: '0.16em',
            marginBottom: 28,
          }}
        >
          INDUSTRY RESEARCH REPORT · 2026
        </div>

        {/* AI Adoption */}
        <div
          style={{
            ...titleStyle,
            fontSize: 116,
            fontFamily: SERIF,
            fontWeight: 400,
            color: T.text,
            lineHeight: 1.05,
          }}
        >
          AI Adoption
        </div>

        {/* by Industry */}
        <div
          style={{
            ...subStyle,
            fontSize: 116,
            fontFamily: SERIF,
            fontWeight: 400,
            fontStyle: 'italic',
            color: T.accent,
            lineHeight: 1.05,
            marginTop: -2,
          }}
        >
          by Industry
        </div>

        {/* Accent line */}
        <div
          style={{
            width: 80 * lineProgress,
            height: 3,
            backgroundColor: T.accent,
            borderRadius: 2,
            marginTop: 32,
            opacity: lineVisible,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════
// SCENE 2: CONTENT SPLIT LAYOUT  (frames 90–240, 5 seconds)
// ═══════════════════════════════════════════════════════════════════

// ─── Stat Item (bottom-left KPI row) ────────────────────────────

const StatItem: React.FC<{
  value: string;
  label: string;
  delay: number;
}> = ({ value, label, delay }) => {
  const frame = useCurrentFrame();
  const style = reveal(frame, delay, 8);

  return (
    <div style={style}>
      <div
        style={{
          fontSize: 38,
          fontFamily: SERIF,
          fontWeight: 400,
          color: T.text,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 10,
          fontFamily: SANS,
          fontWeight: 600,
          color: T.textMuted,
          letterSpacing: '0.08em',
          marginTop: 8,
          maxWidth: 150,
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ─── Industry Bar (chart rows) — Premium Sequential Animation ───
//
// Each bar: fade label → grow bar (easeOutCubic) → count-up % → glow pulse
// Stagger: 18 frames (0.6s) between bars
// Duration: 24 frames (0.8s) per bar animation

/** Darken a hex color by mixing toward black */
const darken = (hex: string, amount = 0.35): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dr = Math.round(r * (1 - amount));
  const dg = Math.round(g * (1 - amount));
  const db = Math.round(b * (1 - amount));
  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
};

const BAR_DURATION = 24; // 0.8s at 30fps

const IndustryBar: React.FC<{
  name: string;
  value: number;
  color: string;
  delay: number;
}> = ({ name, value, color, delay }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - delay;

  // Label fades in first (6 frames before bar starts growing)
  const labelOpacity = interpolate(localFrame, [-4, 6], [0, 1], CLAMP);
  const labelY = interpolate(localFrame, [-4, 6], [6, 0], CLAMP);

  // Bar grows with easeOutCubic — smooth deceleration
  const barProgress = interpolate(
    localFrame,
    [0, BAR_DURATION],
    [0, 1],
    { ...CLAMP, easing: Easing.out(Easing.cubic) },
  );

  const barWidth = barProgress * (value / 100) * 100;

  // Percentage counts up in sync with bar
  const displayPct = Math.round(barProgress * value);

  // Percentage scale pop — slight scale-up as it reaches final value
  const pctScale = interpolate(
    localFrame,
    [BAR_DURATION - 6, BAR_DURATION],
    [0.92, 1],
    CLAMP,
  );
  const pctOpacity = interpolate(localFrame, [2, 10], [0, 1], CLAMP);

  // Glow pulse at completion — brief luminance burst then settle
  const glowOpacity = interpolate(
    localFrame,
    [BAR_DURATION - 2, BAR_DURATION + 4, BAR_DURATION + 12],
    [0, 0.6, 0],
    CLAMP,
  );

  const darkColor = darken(color, 0.4);

  return (
    <div
      style={{
        opacity: labelOpacity,
        transform: `translateY(${labelY}px)`,
      }}
    >
      {/* Label row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span
          style={{
            fontSize: 22,
            fontFamily: SANS,
            fontWeight: 700,
            color: T.white,
            letterSpacing: '0.01em',
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: 32,
            fontFamily: SANS,
            fontWeight: 800,
            color: T.white,
            opacity: pctOpacity,
            transform: `scale(${pctScale})`,
            transformOrigin: 'right center',
            display: 'inline-block',
            minWidth: 64,
            textAlign: 'right',
            letterSpacing: '-0.02em',
          }}
        >
          {displayPct}%
        </span>
      </div>

      {/* Bar track + fill */}
      <div
        style={{
          width: '100%',
          height: 14,
          backgroundColor: T.cardTrack,
          borderRadius: 7,
          overflow: 'visible',
          position: 'relative',
        }}
      >
        {/* Gradient fill with shadow */}
        <div
          style={{
            width: `${barWidth}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${darkColor} 0%, ${color} 100%)`,
            borderRadius: 7,
            position: 'relative',
            boxShadow: barProgress > 0.05
              ? `0 2px 8px ${color}40, 0 0 4px ${color}20`
              : 'none',
          }}
        >
          {/* Completion glow highlight */}
          {glowOpacity > 0 && (
            <div
              style={{
                position: 'absolute',
                inset: -3,
                borderRadius: 8,
                background: `linear-gradient(90deg, transparent 60%, ${color})`,
                opacity: glowOpacity,
                filter: 'blur(6px)',
              }}
            />
          )}

          {/* End dot indicator */}
          {barProgress > 0.8 && (
            <div
              style={{
                position: 'absolute',
                right: -6,
                top: -2,
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: color,
                border: `2.5px solid ${T.card}`,
                opacity: interpolate(barProgress, [0.8, 0.95], [0, 1], CLAMP),
                boxShadow: `0 0 8px ${color}60`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Left Panel ─────────────────────────────────────────────────

const LeftPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineProgress = spring({ frame: frame - 20, fps, config: { damping: 200 } });

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingRight: 16,
      }}
    >
      {/* Label */}
      <div
        style={{
          ...reveal(frame, 5),
          fontSize: 13,
          fontFamily: SANS,
          fontWeight: 500,
          color: T.accentMuted,
          letterSpacing: '0.15em',
        }}
      >
        INDUSTRY RESEARCH REPORT · 2026
      </div>

      {/* Title */}
      <div style={{ ...reveal(frame, 10), marginTop: 20 }}>
        <div
          style={{
            fontSize: 72,
            fontFamily: SERIF,
            fontWeight: 400,
            color: T.text,
            lineHeight: 1.08,
          }}
        >
          AI Adoption{' '}
          <span style={{ fontStyle: 'italic' }}>by</span>
        </div>
        <div
          style={{
            fontSize: 72,
            fontFamily: SERIF,
            fontWeight: 400,
            fontStyle: 'italic',
            color: T.accent,
            lineHeight: 1.08,
          }}
        >
          Industry
        </div>
      </div>

      {/* Accent line */}
      <div
        style={{
          width: 60 * lineProgress,
          height: 3,
          backgroundColor: T.accent,
          borderRadius: 2,
          marginTop: 22,
          opacity: interpolate(frame - 20, [-1, 0], [0, 1], CLAMP),
        }}
      />

      {/* Description */}
      <div
        style={{
          ...reveal(frame, 25),
          fontSize: 19,
          fontFamily: SANS,
          fontWeight: 400,
          color: T.textSec,
          lineHeight: 1.6,
          maxWidth: 500,
          marginTop: 24,
        }}
      >
        Which industries are actually using AI, what they use
        it for, and what results they're seeing — backed by
        data from McKinsey, OECD, PwC, BCG, and Stanford HAI.
      </div>

      {/* Callout */}
      <div
        style={{
          ...reveal(frame, 35),
          fontSize: 17,
          fontFamily: SERIF,
          fontStyle: 'italic',
          color: T.accent,
          lineHeight: 1.5,
          marginTop: 20,
          maxWidth: 500,
        }}
      >
        72% of organizations now use AI — but only 4% see substantial returns.
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 48, marginTop: 44 }}>
        <StatItem value="72%" label="ORGANIZATIONS USING AI" delay={45} />
        <StatItem value="$250B+" label="PRIVATE AI INVESTMENT (2024)" delay={52} />
        <StatItem value="3.7×" label="GEN AI ROI" delay={59} />
      </div>
    </div>
  );
};

// ─── Right Panel (Chart Card) — Premium Stats + Sequential Bars ─
//
// Hero stat: 72% at 73px (+40%), smooth easeOutCubic count-up
// Bar stagger: 18 frames (0.6s) apart, 24 frames (0.8s) per bar
// Legend: fades in after all bars complete

// Bar timing constants
const BAR_STAGGER = 18;  // 0.6s between bars
const FIRST_BAR_START = 22; // after card header appears
const LAST_BAR_END = FIRST_BAR_START + (INDUSTRIES.length - 1) * BAR_STAGGER + BAR_DURATION;

const RightPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance — smooth scale + fade
  const cardOpacity = interpolate(frame, [5, 18], [0, 1], CLAMP);
  const cardScale = interpolate(frame, [5, 18], [0.96, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Header content reveal
  const headerOpacity = interpolate(frame, [12, 22], [0, 1], CLAMP);
  const headerY = interpolate(frame, [12, 22], [8, 0], CLAMP);

  // 72% hero counter — smooth easeOutCubic count-up over 40 frames
  const heroProgress = interpolate(
    frame - 15,
    [0, 40],
    [0, 1],
    { ...CLAMP, easing: Easing.out(Easing.cubic) },
  );
  const heroStat = Math.round(heroProgress * 72);

  // Hero stat scale entrance
  const heroScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 200 },
  });

  // Legend — fades in after last bar completes + small buffer
  const legendDelay = LAST_BAR_END + 8;
  const legendOpacity = interpolate(frame - legendDelay, [0, 12], [0, 1], CLAMP);
  const legendY = interpolate(frame - legendDelay, [0, 12], [6, 0], CLAMP);

  return (
    <div
      style={{
        flex: 1.15,
        display: 'flex',
        alignItems: 'center',
        opacity: cardOpacity,
        transform: `scale(${cardScale})`,
      }}
    >
      <div
        style={{
          backgroundColor: T.card,
          borderRadius: 20,
          padding: '36px 40px 32px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── Card Header ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontFamily: SANS,
                fontWeight: 600,
                color: T.accentMuted,
                letterSpacing: '0.12em',
              }}
            >
              ADOPTION BY INDUSTRY · 2024–2025
            </div>
            <div
              style={{
                fontSize: 16,
                fontFamily: SANS,
                color: T.whiteMuted,
                marginTop: 6,
              }}
            >
              Top 5 sectors by AI adoption rate
            </div>
          </div>

          {/* Hero stat — 72% USING AI (+40% size, scale entrance) */}
          <div
            style={{
              textAlign: 'right',
              transform: `scale(${heroScale})`,
              transformOrigin: 'top right',
            }}
          >
            <div
              style={{
                fontSize: 96,
                fontFamily: SANS,
                fontWeight: 800,
                color: T.white,
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              {heroStat}
              <span style={{ fontSize: 52, fontWeight: 500, opacity: 0.85 }}>%</span>
            </div>
            <div
              style={{
                fontSize: 15,
                fontFamily: SANS,
                fontWeight: 700,
                color: T.whiteMuted,
                letterSpacing: '0.12em',
                marginTop: 6,
              }}
            >
              USING AI
            </div>
          </div>
        </div>

        {/* ── Industry Bars — Sequential Animation ── */}
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {INDUSTRIES.map((ind, i) => (
            <IndustryBar
              key={ind.name}
              name={ind.name}
              value={ind.value}
              color={ind.color}
              delay={FIRST_BAR_START + i * BAR_STAGGER}
            />
          ))}
        </div>

        {/* ── Legend — appears after all bars complete ── */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            marginTop: 24,
            opacity: legendOpacity,
            transform: `translateY(${legendY}px)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 3,
                backgroundColor: INDUSTRIES[0].color,
                borderRadius: 2,
              }}
            />
            <span style={{ fontSize: 13, fontFamily: SANS, color: T.whiteMuted }}>
              Tech & SaaS (88%)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 3,
                backgroundColor: T.cardTrack,
                borderRadius: 2,
              }}
            />
            <span style={{ fontSize: 13, fontFamily: SANS, color: T.whiteMuted }}>
              Education (8%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Content Scene ──────────────────────────────────────────────

const ContentScene: React.FC = () => {
  const frame = useCurrentFrame();

  const entryOpacity = interpolate(frame, [0, 12], [0, 1], CLAMP);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: T.bg,
        opacity: entryOpacity,
        padding: '60px 80px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 40,
      }}
    >
      <LeftPanel />
      <RightPanel />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════
// EXPORT: HeroSlide (Intro + Content as two sequenced scenes)
// ═══════════════════════════════════════════════════════════════════

export const HeroSlide: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}>
        <IntroScene />
      </Sequence>
      <Sequence from={90} durationInFrames={150}>
        <ContentScene />
      </Sequence>
    </AbsoluteFill>
  );
};
