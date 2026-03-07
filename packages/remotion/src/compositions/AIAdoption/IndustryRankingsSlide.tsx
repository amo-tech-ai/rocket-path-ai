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
 * AI Adoption — Slide 4: Industry Rankings (Leaderboard)
 *
 * Scene 1 (0–90):   Intro title card
 * Scene 2 (90–360): Split layout — editorial text left, dark leaderboard card right
 *
 * Design principles:
 *  - Hero contrast: #1 Tech dominates visually
 *  - Progressive muting: entries dim as rank increases
 *  - Gap visualization: divider between #9 and #10 shows the 11× gap
 *  - No-bounce springs, editorial easing, data storytelling tone
 *  - Shadow depth on card, glow on hero bar
 */

// ─── Design Tokens ──────────────────────────────────────────────────

const T = {
  // Light background
  bg: '#F4F1ED',
  text: '#1E1E1E',
  textSec: '#4A4744',
  textMuted: '#8A8580',
  textDim: '#BAB5AE',
  accent: '#2D6B4D',
  accentMuted: '#5C8A68',
  // Dark card
  card: '#0F2418',
  cardTrack: '#1C3A2B',
  white: '#FFFFFF',
  whiteMuted: '#94A79B',
  whiteDim: '#5A6B60',
} as const;

const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = 'system-ui, -apple-system, sans-serif';

// Brighter, saturated colors that pop on dark card
const INDUSTRIES = [
  { name: 'Technology & SaaS', value: 88, color: '#3D9A5F' },
  { name: 'Financial Services', value: 75, color: '#2D8B7E' },
  { name: 'Healthcare', value: 55, color: '#4B7BE5' },
  { name: 'Retail & E-commerce', value: 50, color: '#5B5BD6' },
  { name: 'Professional Services', value: 45, color: '#9B7EC8' },
  { name: 'Manufacturing', value: 40, color: '#F5A623' },
  { name: 'Logistics & Supply Chain', value: 31, color: '#22B8C4' },
  { name: 'Marketing & Media', value: 28, color: '#E8A79B' },
  { name: 'Energy & Climate', value: 15, color: '#3ECF8E' },
  { name: 'Education', value: 8, color: '#8B95A0' },
] as const;

// ─── Animation Helpers ──────────────────────────────────────────────

const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

/** Fade-up reveal — the editorial pattern */
const reveal = (frame: number, delay: number, distance = 12) => ({
  opacity: interpolate(frame - delay, [0, 15], [0, 1], CLAMP),
  transform: `translateY(${interpolate(frame - delay, [0, 15], [distance, 0], CLAMP)}px)`,
});

/** Darken a hex color by mixing toward black */
const darken = (hex: string, amount = 0.4): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `#${Math.round(r * (1 - amount)).toString(16).padStart(2, '0')}${Math.round(g * (1 - amount)).toString(16).padStart(2, '0')}${Math.round(b * (1 - amount)).toString(16).padStart(2, '0')}`;
};

// ─── Tier System (visual hierarchy by rank) ─────────────────────────

interface TierConfig {
  nameSize: number;
  pctSize: number;
  barHeight: number;
  nameWeight: number;
  entryOpacity: number;
  glow: boolean;
  marginBottom: number;
}

const getTier = (rank: number): TierConfig => {
  if (rank === 1)
    return { nameSize: 22, pctSize: 32, barHeight: 14, nameWeight: 700, entryOpacity: 1, glow: true, marginBottom: 14 };
  if (rank <= 5)
    return { nameSize: 17, pctSize: 24, barHeight: 11, nameWeight: 600, entryOpacity: 1, glow: false, marginBottom: 7 };
  if (rank <= 9)
    return { nameSize: 15, pctSize: 20, barHeight: 8, nameWeight: 500, entryOpacity: 0.82, glow: false, marginBottom: 5 };
  return { nameSize: 14, pctSize: 18, barHeight: 6, nameWeight: 400, entryOpacity: 0.45, glow: false, marginBottom: 4 };
};

// ═══════════════════════════════════════════════════════════════════
// SCENE 1: INTRO TITLE CARD  (frames 0–90, 3 seconds)
// ═══════════════════════════════════════════════════════════════════

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelStyle = reveal(frame, 5);
  const titleStyle = reveal(frame, 15, 16);
  const subStyle = reveal(frame, 28, 16);

  const lineProgress = spring({ frame: frame - 38, fps, config: { damping: 200 } });
  const lineVisible = interpolate(frame - 38, [-1, 0], [0, 1], CLAMP);
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            ...labelStyle,
            fontSize: 14,
            fontFamily: SANS,
            fontWeight: 500,
            color: T.accentMuted,
            letterSpacing: '0.16em',
          }}
        >
          INDUSTRY RANKINGS · 2024–2025
        </div>
        <div
          style={{
            ...titleStyle,
            fontSize: 110,
            fontFamily: SERIF,
            fontWeight: 400,
            color: T.text,
            lineHeight: 1.05,
            marginTop: 24,
          }}
        >
          Industry Rankings
        </div>
        <div
          style={{
            ...subStyle,
            fontSize: 40,
            fontFamily: SERIF,
            fontWeight: 400,
            fontStyle: 'italic',
            color: T.accentMuted,
            lineHeight: 1.2,
            marginTop: 12,
          }}
        >
          Who's Actually Using AI?
        </div>
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
// SCENE 2: SPLIT LAYOUT — Text Left, Leaderboard Card Right
// ═══════════════════════════════════════════════════════════════════

// ─── Bar Timing ─────────────────────────────────────────────────

const BAR_DURATION = 24;
const HERO_HOLD = 8; // pause after hero before cascade
const FIRST_BAR_START = 22;
const CASCADE_START = FIRST_BAR_START + BAR_DURATION + HERO_HOLD; // 54
const BAR_STAGGER = 15;

/** Get animation start frame for each bar (index 0–9) */
const getBarDelay = (index: number) => {
  if (index === 0) return FIRST_BAR_START;
  if (index <= 8) return CASCADE_START + (index - 1) * BAR_STAGGER;
  return CASCADE_START + 8 * BAR_STAGGER + 10; // #10 after gap pause
};

const LAST_BAR_END = getBarDelay(9) + BAR_DURATION;
const GAP_DELAY = getBarDelay(8) + BAR_DURATION + 2;
const LEGEND_DELAY = LAST_BAR_END + 8;

// ─── Leaderboard Entry ──────────────────────────────────────────

const LeaderboardEntry: React.FC<{
  name: string;
  value: number;
  color: string;
  rank: number;
  delay: number;
}> = ({ name, value, color, rank, delay }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - delay;
  const cfg = getTier(rank);

  // Entry fade-in
  const labelOpacity = interpolate(localFrame, [-4, 8], [0, 1], CLAMP);
  const labelY = interpolate(localFrame, [-4, 8], [6, 0], CLAMP);

  // Bar growth — hero gets extra time
  const barDuration = rank === 1 ? 30 : BAR_DURATION;
  const barProgress = interpolate(
    localFrame,
    [0, barDuration],
    [0, 1],
    { ...CLAMP, easing: Easing.out(Easing.cubic) },
  );

  const barWidth = barProgress * (value / 100) * 100;
  const displayPct = Math.round(barProgress * value);

  // Percentage pop
  const pctScale = interpolate(localFrame, [barDuration - 6, barDuration], [0.92, 1], CLAMP);
  const pctOpacity = interpolate(localFrame, [2, 10], [0, 1], CLAMP);

  // Glow burst (hero only)
  const glowOpacity = cfg.glow
    ? interpolate(localFrame, [barDuration - 2, barDuration + 4, barDuration + 14], [0, 0.7, 0], CLAMP)
    : 0;

  // Rank number scale-in
  const rankOpacity = interpolate(localFrame, [-2, 8], [0, cfg.entryOpacity], CLAMP);
  const rankScale = interpolate(localFrame, [-2, 8], [0.7, 1], CLAMP);

  const darkColor = darken(color);
  const dotSize = Math.min(14, cfg.barHeight + 4);

  return (
    <div
      style={{
        opacity: labelOpacity * cfg.entryOpacity,
        transform: `translateY(${labelY}px)`,
        marginBottom: cfg.marginBottom,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Rank number */}
        <div
          style={{
            width: 26,
            textAlign: 'right',
            fontSize: rank === 1 ? 22 : 14,
            fontFamily: SANS,
            fontWeight: 700,
            color: rank === 1 ? T.white : T.whiteDim,
            opacity: rankOpacity,
            transform: `scale(${rankScale})`,
            transformOrigin: 'right top',
            flexShrink: 0,
            paddingTop: 2,
          }}
        >
          {rank}
        </div>

        {/* Content column */}
        <div style={{ flex: 1 }}>
          {/* Name + percentage */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: rank === 1 ? 6 : 4,
            }}
          >
            <span
              style={{
                fontSize: cfg.nameSize,
                fontFamily: SANS,
                fontWeight: cfg.nameWeight,
                color: T.white,
                letterSpacing: '0.01em',
              }}
            >
              {name}
            </span>
            <span
              style={{
                fontSize: cfg.pctSize,
                fontFamily: SANS,
                fontWeight: 800,
                color: T.white,
                opacity: pctOpacity,
                transform: `scale(${pctScale})`,
                transformOrigin: 'right center',
                display: 'inline-block',
                minWidth: rank === 1 ? 72 : 48,
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
              height: cfg.barHeight,
              backgroundColor: T.cardTrack,
              borderRadius: cfg.barHeight / 2,
              overflow: 'visible',
              position: 'relative',
            }}
          >
            {/* Gradient fill */}
            <div
              style={{
                width: `${barWidth}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${darkColor} 0%, ${color} 100%)`,
                borderRadius: cfg.barHeight / 2,
                position: 'relative',
                boxShadow:
                  barProgress > 0.05
                    ? `0 2px 8px ${color}40, 0 0 4px ${color}20`
                    : 'none',
              }}
            >
              {/* Glow highlight */}
              {glowOpacity > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    inset: -3,
                    borderRadius: cfg.barHeight,
                    background: `linear-gradient(90deg, transparent 60%, ${color})`,
                    opacity: glowOpacity,
                    filter: 'blur(6px)',
                  }}
                />
              )}

              {/* End dot */}
              {barProgress > 0.8 && (
                <div
                  style={{
                    position: 'absolute',
                    right: -dotSize / 2,
                    top: (cfg.barHeight - dotSize) / 2,
                    width: dotSize,
                    height: dotSize,
                    borderRadius: dotSize / 2,
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
      </div>
    </div>
  );
};

// ─── Gap Divider (11× between #9 and #10) ───────────────────────

const GapDivider: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], CLAMP);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        margin: '6px 0 6px 40px',
        opacity,
      }}
    >
      <div
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(90deg, ${T.cardTrack}, transparent)`,
        }}
      />
      <span
        style={{
          fontSize: 10,
          fontFamily: SANS,
          fontWeight: 700,
          color: T.whiteDim,
          letterSpacing: '0.14em',
        }}
      >
        11× GAP
      </span>
      <div
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(270deg, ${T.cardTrack}, transparent)`,
        }}
      />
    </div>
  );
};

// ─── Left Panel (editorial text + stats) ────────────────────────

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
          fontSize: 36,
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
          maxWidth: 140,
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const LeftPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineProgress = spring({ frame: frame - 22, fps, config: { damping: 200 } });

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
        INDUSTRY RANKINGS · 2024–2025
      </div>

      {/* Title */}
      <div style={{ ...reveal(frame, 12), marginTop: 20 }}>
        <div
          style={{
            fontSize: 64,
            fontFamily: SERIF,
            fontWeight: 400,
            color: T.text,
            lineHeight: 1.08,
          }}
        >
          Who's Actually
        </div>
        <div
          style={{
            fontSize: 64,
            fontFamily: SERIF,
            fontWeight: 400,
            fontStyle: 'italic',
            color: T.accent,
            lineHeight: 1.08,
          }}
        >
          Using AI?
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
          opacity: interpolate(frame - 22, [-1, 0], [0, 1], CLAMP),
        }}
      />

      {/* Description */}
      <div
        style={{
          ...reveal(frame, 28),
          fontSize: 18,
          fontFamily: SANS,
          fontWeight: 400,
          color: T.textSec,
          lineHeight: 1.6,
          maxWidth: 460,
          marginTop: 22,
        }}
      >
        Adoption rates across 10 industries reveal a stark divide — from 88% in
        Tech to just 8% in Education.
      </div>

      {/* Callout */}
      <div
        style={{
          ...reveal(frame, 38),
          fontSize: 17,
          fontFamily: SERIF,
          fontStyle: 'italic',
          color: T.accent,
          lineHeight: 1.5,
          marginTop: 18,
          maxWidth: 460,
        }}
      >
        An 11× gap separates leaders from laggards — the largest disparity in
        enterprise tech adoption.
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 48, marginTop: 40 }}>
        <StatItem value="88%" label="PEAK ADOPTION" delay={110} />
        <StatItem value="11×" label="LEADER-LAGGARD GAP" delay={120} />
        <StatItem value="55→75%" label="GEN AI JUMP" delay={130} />
      </div>
    </div>
  );
};

// ─── Right Panel (Dark Leaderboard Card) ────────────────────────

const RightPanel: React.FC = () => {
  const frame = useCurrentFrame();

  // Card entrance — smooth scale + fade
  const cardOpacity = interpolate(frame, [5, 18], [0, 1], CLAMP);
  const cardScale = interpolate(frame, [5, 18], [0.96, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Header reveal
  const headerOpacity = interpolate(frame, [12, 22], [0, 1], CLAMP);
  const headerY = interpolate(frame, [12, 22], [8, 0], CLAMP);

  // Legend
  const legendOpacity = interpolate(frame - LEGEND_DELAY, [0, 12], [0, 1], CLAMP);
  const legendY = interpolate(frame - LEGEND_DELAY, [0, 12], [6, 0], CLAMP);

  return (
    <div
      style={{
        flex: 1.2,
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
          padding: '32px 36px 28px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow:
            '0 20px 60px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.12)',
        }}
      >
        {/* ── Card Header ── */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontFamily: SANS,
              fontWeight: 600,
              color: T.accentMuted,
              letterSpacing: '0.12em',
            }}
          >
            ADOPTION LEADERBOARD
          </div>
          <div
            style={{
              fontSize: 15,
              fontFamily: SANS,
              color: T.whiteMuted,
              marginTop: 4,
            }}
          >
            10 industries ranked by AI adoption rate
          </div>
        </div>

        {/* ── Leaderboard Entries ── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* #1–#9 */}
          {INDUSTRIES.slice(0, 9).map((ind, i) => (
            <LeaderboardEntry
              key={ind.name}
              name={ind.name}
              value={ind.value}
              color={ind.color}
              rank={i + 1}
              delay={getBarDelay(i)}
            />
          ))}

          {/* Gap divider */}
          <GapDivider delay={GAP_DELAY} />

          {/* #10 — muted laggard */}
          <LeaderboardEntry
            name={INDUSTRIES[9].name}
            value={INDUSTRIES[9].value}
            color={INDUSTRIES[9].color}
            rank={10}
            delay={getBarDelay(9)}
          />
        </div>

        {/* ── Legend ── */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            marginTop: 16,
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
            <span
              style={{ fontSize: 12, fontFamily: SANS, color: T.whiteMuted }}
            >
              Leader: Tech (88%)
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
            <span
              style={{ fontSize: 12, fontFamily: SANS, color: T.whiteMuted }}
            >
              Laggard: Education (8%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Data Scene (split layout) ──────────────────────────────────

const DataScene: React.FC = () => {
  const frame = useCurrentFrame();
  const entryOpacity = interpolate(frame, [0, 12], [0, 1], CLAMP);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: T.bg,
        opacity: entryOpacity,
        padding: '56px 80px',
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
// EXPORT
// ═══════════════════════════════════════════════════════════════════

export const IndustryRankingsSlide: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}>
        <IntroScene />
      </Sequence>
      <Sequence from={90} durationInFrames={270}>
        <DataScene />
      </Sequence>
    </AbsoluteFill>
  );
};
