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
 * AI Adoption — Slide 2: The Scaling Gap (300 frames / 10s)
 *
 * PROFESSIONAL MOTION INFOGRAPHIC — applies:
 *  - Film grain overlay for premium texture
 *  - Parallax background drift on glow orbs
 *  - Number overshoot + settle (spring physics)
 *  - Blur-fade scene transitions
 *  - Deep glow with 3-layer SVG arcs + breathing bloom
 *  - Kinetic typography (tracking + scale animation)
 *  - Staggered micro-delays within elements
 *  - Hold frames after key reveals
 *  - Liquid bar fill with overshoot
 *
 * Scene 1 (0–80):   Kinetic title with animated tracking
 * Scene 2 (80–190):  Giant "80% vs 39%" face-off with overshoot
 * Scene 3 (190–300): Dramatic 70% reveal with zoom-from-distance
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
  redGlow: '#FF7B6B',
  text: '#FFFFFF',
  textSec: '#B4C4BA',
  textMuted: '#6B7E72',
  textDim: '#3A4D42',
} as const;

const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = 'system-ui, -apple-system, sans-serif';
const MONO = '"SF Mono", "Fira Code", "Consolas", monospace';

const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

// Eased reveal with optional blur
const reveal = (frame: number, delay: number, distance = 14) => ({
  opacity: interpolate(frame - delay, [0, 22], [0, 1], CLAMP),
  transform: `translateY(${interpolate(frame - delay, [0, 22], [distance, 0], CLAMP)}px)`,
  filter: `blur(${interpolate(frame - delay, [0, 16], [4, 0], CLAMP)}px)`,
});

// Overshoot interpolation: goes past target then settles
const overshoot = (frame: number, delay: number, duration: number, target: number) => {
  const t = interpolate(frame - delay, [0, duration * 0.7, duration * 0.85, duration], [0, target * 1.08, target * 0.98, target], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  return Math.max(0, t);
};

// ─── Film Grain Overlay ─────────────────────────────────────────────

const FilmGrain: React.FC<{ intensity?: number }> = ({ intensity = 0.035 }) => {
  const frame = useCurrentFrame();
  // Shift the grain pattern every frame for subtle movement
  const offsetX = (frame * 7.3) % 64;
  const offsetY = (frame * 11.1) % 64;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: intensity,
        backgroundImage: `radial-gradient(circle, ${T.text} 0.5px, transparent 0.5px)`,
        backgroundSize: '4px 4px',
        backgroundPosition: `${offsetX}px ${offsetY}px`,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }}
    />
  );
};

// ─── Atmospheric Background with Parallax ───────────────────────────

const AtmoBg: React.FC<{
  color1?: string;
  color2?: string;
  parallaxIntensity?: number;
}> = ({ color1 = T.accent, color2 = T.blue, parallaxIntensity = 1 }) => {
  const frame = useCurrentFrame();
  // Slow parallax drift on glow orbs
  const driftX = Math.sin(frame * 0.008) * 12 * parallaxIntensity;
  const driftY = Math.cos(frame * 0.006) * 8 * parallaxIntensity;
  const driftX2 = Math.cos(frame * 0.01) * 10 * parallaxIntensity;
  const driftY2 = Math.sin(frame * 0.007) * 14 * parallaxIntensity;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Base */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: T.bg }} />

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)' }} />

      {/* Parallax glow orb 1 */}
      <div
        style={{
          position: 'absolute',
          top: -200 + driftY,
          right: -200 + driftX,
          width: 900,
          height: 900,
          borderRadius: 450,
          background: `radial-gradient(circle, ${color1}14 0%, ${color1}08 30%, transparent 60%)`,
        }}
      />
      {/* Parallax glow orb 2 */}
      <div
        style={{
          position: 'absolute',
          bottom: -300 + driftY2,
          left: -200 + driftX2,
          width: 1000,
          height: 1000,
          borderRadius: 500,
          background: `radial-gradient(circle, ${color2}0C 0%, ${color2}06 30%, transparent 60%)`,
        }}
      />

      {/* Dot grid with subtle drift */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `radial-gradient(${T.text} 0.8px, transparent 0.8px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: `${driftX * 0.3}px ${driftY * 0.3}px`,
        }}
      />

      {/* Horizontal scan lines */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.012, backgroundImage: `repeating-linear-gradient(0deg, ${T.text} 0px, transparent 1px, transparent 4px)` }} />

      {/* Film grain */}
      <FilmGrain />
    </div>
  );
};

// ─── 3-Layer Deep Glow Arc (SVG) ────────────────────────────────────

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
  // Breathing glow intensity
  const breathe = 0.8 + 0.2 * Math.sin(breathePhase);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
      {/* Track */}
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.surface} strokeWidth={strokeWidth} opacity={0.6} />
      {/* Layer 3: Outer haze */}
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={glowColor} strokeWidth={strokeWidth + 20} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" opacity={0.04 * breathe} style={{ filter: 'blur(14px)' }} />
      {/* Layer 2: Bloom */}
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={glowColor} strokeWidth={strokeWidth + 8} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" opacity={0.15 * breathe} style={{ filter: 'blur(6px)' }} />
      {/* Layer 1: Core */}
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${glowColor}90)` }} />
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════
// SCENE 1: KINETIC TITLE  (0–80)
// ═══════════════════════════════════════════════════════════════════

const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Exit: blur-fade
  const exitOp = interpolate(frame, [62, 80], [1, 0], CLAMP);
  const exitBlur = interpolate(frame, [62, 80], [0, 8], CLAMP);

  const labelStyle = reveal(frame, 3);

  // Kinetic title — tracking animates from wide to tight
  const titleOp = interpolate(frame, [10, 28], [0, 1], CLAMP);
  const titleScale = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const titleTracking = interpolate(frame, [10, 35], [0.15, -0.02], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const titleBlur = interpolate(frame, [10, 24], [6, 0], CLAMP);

  // "Gap" word — delayed, italic accent with overshoot scale
  const gapScale = spring({ frame: frame - 22, fps, config: { damping: 14, mass: 0.4, stiffness: 280 } });
  const gapOp = interpolate(frame, [20, 30], [0, 1], CLAMP);

  // Crack line — wider, deeper glow, 3-layer bloom
  const crackWidth = spring({ frame: frame - 36, fps, config: { damping: 200 } });
  const crackGlow = interpolate(frame, [36, 46, 58], [0, 1, 0.4], CLAMP);

  // Subtitle
  const subStyle = reveal(frame, 32, 12);

  return (
    <AbsoluteFill style={{ opacity: exitOp, filter: `blur(${exitBlur}px)` }}>
      <AtmoBg color1={T.amber} color2={T.red} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Label */}
        <div style={{ ...labelStyle, fontSize: 13, fontFamily: MONO, fontWeight: 600, color: T.amber, letterSpacing: '0.25em', marginBottom: 28 }}>
          THE SCALING GAP
        </div>

        {/* Kinetic title */}
        <div
          style={{
            opacity: titleOp,
            transform: `scale(${interpolate(titleScale, [0, 1], [0.88, 1], CLAMP)})`,
            filter: `blur(${titleBlur}px)`,
            fontSize: 140,
            fontFamily: SERIF,
            fontWeight: 400,
            color: T.text,
            lineHeight: 0.95,
            textAlign: 'center',
            letterSpacing: `${titleTracking}em`,
          }}
        >
          The Scaling
          <br />
          <span
            style={{
              fontStyle: 'italic',
              color: T.amber,
              display: 'inline-block',
              opacity: gapOp,
              transform: `scale(${interpolate(gapScale, [0, 1.15], [1.3, 1], CLAMP)})`,
              textShadow: `0 0 40px ${T.amber}30, 0 0 80px ${T.amber}15`,
            }}
          >
            Gap
          </span>
        </div>

        {/* 3-layer crack/divide line */}
        <div style={{ position: 'relative', marginTop: 40, height: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Layer 3: Wide haze */}
          {crackGlow > 0 && (
            <div style={{ position: 'absolute', width: 400 * crackWidth, height: 20, background: `linear-gradient(90deg, transparent, ${T.amber}${Math.round(crackGlow * 30).toString(16).padStart(2, '0')}, transparent)`, filter: 'blur(12px)' }} />
          )}
          {/* Layer 2: Medium bloom */}
          {crackGlow > 0 && (
            <div style={{ position: 'absolute', width: 350 * crackWidth, height: 8, background: `linear-gradient(90deg, transparent, ${T.amber}${Math.round(crackGlow * 80).toString(16).padStart(2, '0')}, transparent)`, filter: 'blur(4px)' }} />
          )}
          {/* Layer 1: Core line */}
          <div
            style={{
              width: 320 * crackWidth,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${T.amber}, transparent)`,
              boxShadow: crackGlow > 0 ? `0 0 ${12 * crackGlow}px ${T.amber}AA` : 'none',
            }}
          />
        </div>

        {/* Subtitle */}
        <div style={{ ...subStyle, fontSize: 22, fontFamily: SANS, fontWeight: 400, color: T.textSec, marginTop: 28, letterSpacing: '0.08em' }}>
          Perception vs. Reality
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════
// SCENE 2: GIANT FACE-OFF — 80% vs 39%  (0–110)
// ═══════════════════════════════════════════════════════════════════

const FaceOffScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry: scale + blur fade
  const entryOp = interpolate(frame, [0, 18], [0, 1], CLAMP);
  const entryBlur = interpolate(frame, [0, 14], [6, 0], CLAMP);
  const entryScale = interpolate(frame, [0, 18], [0.96, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  // Exit: blur-fade
  const exitOp = interpolate(frame, [92, 110], [1, 0], CLAMP);
  const exitBlur = interpolate(frame, [92, 110], [0, 6], CLAMP);

  // LEFT — overshoot count (goes to ~84 then settles to 80)
  const leftNum = overshoot(frame, 10, 44, 80);
  const leftScale = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const leftArcProg = interpolate(frame, [12, 52], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });

  // RIGHT — overshoot count (goes to ~42 then settles to 39)
  const rightNum = overshoot(frame, 22, 44, 39);
  const rightScale = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const rightArcProg = interpolate(frame, [24, 62], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });

  // Breathing phase for glow
  const breathePhase = frame * 0.12;

  // Center divider
  const dividerHeight = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  const vsOp = interpolate(frame, [32, 44], [0, 1], CLAMP);
  const vsPop = spring({ frame: frame - 32, fps, config: { damping: 14, mass: 0.5, stiffness: 200 } });
  // VS badge breathing
  const vsPulse = vsOp > 0.9 ? 1 + 0.03 * Math.sin(frame * 0.15) : 1;

  // Gap badge — dramatic
  const gapOp = interpolate(frame, [58, 72], [0, 1], CLAMP);
  const gapPop = spring({ frame: frame - 58, fps, config: { damping: 14, mass: 0.4, stiffness: 200 } });
  const gapGlow = interpolate(frame, [65, 78, 95], [0, 1, 0.5], CLAMP);
  const gapPulse = gapOp > 0.9 ? 1 + 0.02 * Math.sin(frame * 0.18) : 1;

  // Bottom quote — staggered word reveal
  const quoteStyle = reveal(frame, 76, 8);

  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(entryOp, exitOp),
        filter: `blur(${Math.max(entryBlur, exitBlur)}px)`,
        transform: `scale(${entryScale})`,
      }}
    >
      <AtmoBg color1={T.blue} color2={T.amber} />

      {/* Top label — monospace for data credibility */}
      <div style={{ position: 'absolute', top: 48, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ ...reveal(frame, 4), fontSize: 12, fontFamily: MONO, fontWeight: 600, color: T.textDim, letterSpacing: '0.2em' }}>
          PERCEPTION VS. REALITY {'\u00B7'} BCG 2024
        </div>
      </div>

      {/* Face-off container */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* LEFT: "Says" */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${interpolate(leftScale, [0, 1], [0.82, 1], CLAMP)})` }}>
          <div style={{ position: 'relative', width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Arc value={80} color={T.blue} glowColor={T.blueGlow} size={240} strokeWidth={8} progress={leftArcProg} breathePhase={breathePhase} />
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div
                style={{
                  fontSize: 120,
                  fontFamily: SANS,
                  fontWeight: 900,
                  color: T.text,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  textShadow: `0 0 30px ${T.blue}25`,
                }}
              >
                {Math.round(leftNum)}
                <span style={{ fontSize: 56, fontWeight: 500, opacity: 0.6 }}>%</span>
              </div>
            </div>
          </div>
          {/* Label — staggered */}
          <div style={{ ...reveal(frame, 18, 8), fontSize: 13, fontFamily: MONO, fontWeight: 700, color: T.blue, letterSpacing: '0.2em', marginTop: 22 }}>
            SAY IT WORKS
          </div>
          <div style={{ ...reveal(frame, 24, 6), fontSize: 15, fontFamily: SANS, color: T.textMuted, marginTop: 10, textAlign: 'center', maxWidth: 280, lineHeight: 1.5 }}>
            {'\u201C'}Met or exceeded expectations{'\u201D'}
          </div>
        </div>

        {/* CENTER DIVIDER */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
          <div style={{ width: 1, height: 180 * dividerHeight, background: `linear-gradient(180deg, transparent, ${T.textDim}60, transparent)` }} />
          <div
            style={{
              opacity: vsOp,
              transform: `scale(${interpolate(vsPop, [0, 1.15], [0.4, 1], CLAMP) * vsPulse})`,
              fontSize: 15,
              fontFamily: MONO,
              fontWeight: 900,
              color: T.textMuted,
              letterSpacing: '0.15em',
              padding: '10px 18px',
              borderRadius: 10,
              border: `1px solid ${T.textDim}50`,
              backgroundColor: `${T.bgCard}CC`,
              backdropFilter: 'blur(8px)',
              margin: '14px 0',
              boxShadow: `0 0 20px rgba(0,0,0,0.3)`,
            }}
          >
            VS
          </div>
          <div style={{ width: 1, height: 180 * dividerHeight, background: `linear-gradient(180deg, transparent, ${T.textDim}60, transparent)` }} />
        </div>

        {/* RIGHT: "Shows" */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${interpolate(rightScale, [0, 1], [0.82, 1], CLAMP)})` }}>
          <div style={{ position: 'relative', width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Arc value={39} color={T.amber} glowColor={T.amberGlow} size={240} strokeWidth={8} progress={rightArcProg} breathePhase={breathePhase + Math.PI} />
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div
                style={{
                  fontSize: 120,
                  fontFamily: SANS,
                  fontWeight: 900,
                  color: T.text,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  textShadow: `0 0 30px ${T.amber}25`,
                }}
              >
                {Math.round(rightNum)}
                <span style={{ fontSize: 56, fontWeight: 500, opacity: 0.6 }}>%</span>
              </div>
            </div>
          </div>
          <div style={{ ...reveal(frame, 30, 8), fontSize: 13, fontFamily: MONO, fontWeight: 700, color: T.amber, letterSpacing: '0.2em', marginTop: 22 }}>
            SHOW RESULTS
          </div>
          <div style={{ ...reveal(frame, 36, 6), fontSize: 15, fontFamily: SANS, color: T.textMuted, marginTop: 10, textAlign: 'center', maxWidth: 280, lineHeight: 1.5 }}>
            {'\u201C'}Bottom-line financial impact{'\u201D'}
          </div>
        </div>
      </div>

      {/* GAP BADGE — dramatic 3-layer glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 128,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: gapOp,
          transform: `scale(${interpolate(gapPop, [0, 1.1], [0.5, 1], CLAMP) * gapPulse})`,
        }}
      >
        {/* Outer haze */}
        {gapGlow > 0 && (
          <div style={{ position: 'absolute', width: 260, height: 60, borderRadius: 16, background: `radial-gradient(ellipse, ${T.red}${Math.round(gapGlow * 20).toString(16).padStart(2, '0')} 0%, transparent 70%)`, filter: 'blur(16px)' }} />
        )}
        <div
          style={{
            position: 'relative',
            fontSize: 22,
            fontFamily: MONO,
            fontWeight: 900,
            color: T.red,
            letterSpacing: '0.12em',
            padding: '12px 32px',
            borderRadius: 12,
            backgroundColor: `${T.red}12`,
            border: `1.5px solid ${T.red}40`,
            boxShadow: gapGlow > 0 ? `0 0 ${20 * gapGlow}px ${T.red}50, 0 0 ${50 * gapGlow}px ${T.red}20, inset 0 0 ${15 * gapGlow}px ${T.red}10` : 'none',
          }}
        >
          41 POINT GAP
        </div>
      </div>

      {/* Bottom quote */}
      <div style={{ position: 'absolute', bottom: 48, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ ...quoteStyle, fontSize: 16, fontFamily: SERIF, fontStyle: 'italic', color: T.textMuted, maxWidth: 680, textAlign: 'center', lineHeight: 1.6 }}>
          {'\u201C'}92% say they increased AI usage. Only 39% can point to bottom-line impact.{'\u201D'}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════
// SCENE 3: THE 70% REVEAL — zoom from distance  (0–110)
// ═══════════════════════════════════════════════════════════════════

const ValueScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry: blur-fade
  const entryOp = interpolate(frame, [0, 18], [0, 1], CLAMP);
  const entryBlur = interpolate(frame, [0, 14], [8, 0], CLAMP);

  // Giant 70% — dramatic zoom from scale(2.5) to scale(1) with blur
  const zoomProgress = spring({ frame: frame - 6, fps, config: { damping: 22, mass: 0.6, stiffness: 180 } });
  const numScale = interpolate(zoomProgress, [0, 1], [2.2, 1], CLAMP);
  const numBlur = interpolate(zoomProgress, [0, 0.4, 1], [16, 4, 0], CLAMP);

  // Overshoot counter
  const displayNum = overshoot(frame, 8, 48, 70);

  // Breathing glow on the number
  const breathePhase = Math.max(0, frame - 50) * 0.12;
  const numGlow = frame > 50 ? 0.3 + 0.15 * Math.sin(breathePhase) : interpolate(frame, [40, 50], [0, 0.3], CLAMP);

  // Stacked bar segments — liquid fill with overshoot
  const seg1 = overshoot(frame, 28, 28, 10);
  const seg2 = overshoot(frame, 36, 28, 20);
  const seg3 = overshoot(frame, 44, 32, 70);

  // 70% segment deep glow — 3-layer breathing
  const barBreathPhase = Math.max(0, frame - 70) * 0.1;
  const barGlow = frame > 70 ? 0.3 + 0.2 * Math.sin(barBreathPhase) : interpolate(frame, [65, 75], [0, 0.3], CLAMP);

  // Callout badge
  const calloutOp = interpolate(frame, [74, 84], [0, 1], CLAMP);
  const calloutPop = spring({ frame: frame - 74, fps, config: { damping: 14, mass: 0.4, stiffness: 200 } });

  // Bottom quote
  const quoteStyle = reveal(frame, 86, 8);

  // Label stagger
  const label1 = reveal(frame, 48, 6);
  const label2 = reveal(frame, 52, 6);
  const label3 = reveal(frame, 56, 6);

  return (
    <AbsoluteFill style={{ opacity: entryOp, filter: `blur(${entryBlur}px)` }}>
      <AtmoBg color1={T.amber} color2={T.accent} parallaxIntensity={1.5} />

      {/* Top label */}
      <div style={{ position: 'absolute', top: 48, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ ...reveal(frame, 3), fontSize: 12, fontFamily: MONO, fontWeight: 600, color: T.textDim, letterSpacing: '0.2em' }}>
          WHERE THE VALUE ACTUALLY LIVES {'\u00B7'} BCG
        </div>
      </div>

      {/* Center hero: giant 70% with zoom-from-distance */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            transform: `scale(${numScale})`,
            filter: `blur(${numBlur}px)`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 260,
              fontFamily: SANS,
              fontWeight: 900,
              color: T.amber,
              lineHeight: 0.82,
              letterSpacing: '-0.06em',
              textShadow: `0 0 ${60 + numGlow * 60}px ${T.amber}${Math.round(numGlow * 60).toString(16).padStart(2, '0')}, 0 0 ${120 + numGlow * 80}px ${T.amber}${Math.round(numGlow * 25).toString(16).padStart(2, '0')}`,
            }}
          >
            {Math.round(displayNum)}
            <span style={{ fontSize: 130, fontWeight: 500, opacity: 0.5 }}>%</span>
          </div>
          <div style={{ fontSize: 18, fontFamily: MONO, fontWeight: 700, color: T.textSec, letterSpacing: '0.18em', marginTop: 12 }}>
            PEOPLE & PROCESS
          </div>
        </div>

        {/* Full-width stacked bar with overshoot liquid fill */}
        <div style={{ width: '82%', maxWidth: 1040, marginTop: 52 }}>
          <div style={{ display: 'flex', width: '100%', height: 28, borderRadius: 14, overflow: 'hidden', position: 'relative', backgroundColor: `${T.surface}80` }}>
            {/* Algorithms 10% */}
            <div style={{ width: `${seg1}%`, height: '100%', backgroundColor: T.textDim, transition: 'width 0.1s' }} />
            {/* Technology 20% */}
            <div style={{ width: `${seg2}%`, height: '100%', backgroundColor: T.blue, boxShadow: seg2 > 10 ? `0 0 14px ${T.blue}40` : 'none' }} />
            {/* People & Process 70% — deep glow */}
            <div style={{ width: `${seg3}%`, height: '100%', backgroundColor: T.amber, position: 'relative' }}>
              {/* Inner glow gradient */}
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${T.amberGlow}30 0%, transparent 60%)`, borderRadius: '0 14px 14px 0' }} />
            </div>
          </div>

          {/* 3-layer glow under amber segment */}
          {barGlow > 0 && (
            <>
              <div style={{ position: 'relative', top: -6, left: '30%', width: '70%', height: 16, background: `linear-gradient(90deg, transparent 5%, ${T.amber}${Math.round(barGlow * 100).toString(16).padStart(2, '0')} 30%, ${T.amber}${Math.round(barGlow * 60).toString(16).padStart(2, '0')} 70%, transparent 95%)`, filter: 'blur(10px)' }} />
              <div style={{ position: 'relative', top: -16, left: '25%', width: '75%', height: 30, background: `linear-gradient(90deg, transparent, ${T.amber}${Math.round(barGlow * 30).toString(16).padStart(2, '0')}, transparent)`, filter: 'blur(20px)' }} />
            </>
          )}

          {/* Labels row — staggered reveals */}
          <div style={{ display: 'flex', marginTop: 12 }}>
            <div style={{ width: '10%', textAlign: 'center', ...label1 }}>
              <div style={{ fontSize: 22, fontFamily: SANS, fontWeight: 800, color: T.textMuted }}>10%</div>
              <div style={{ fontSize: 10, fontFamily: MONO, color: T.textDim, marginTop: 4, letterSpacing: '0.05em' }}>Algorithms</div>
            </div>
            <div style={{ width: '20%', textAlign: 'center', ...label2 }}>
              <div style={{ fontSize: 22, fontFamily: SANS, fontWeight: 800, color: T.blue }}>20%</div>
              <div style={{ fontSize: 10, fontFamily: MONO, color: T.textDim, marginTop: 4, letterSpacing: '0.05em' }}>Technology</div>
            </div>
            <div style={{ width: '70%', textAlign: 'center', position: 'relative', ...label3 }}>
              <div style={{ fontSize: 22, fontFamily: SANS, fontWeight: 800, color: T.amber }}>70%</div>
              <div style={{ fontSize: 10, fontFamily: MONO, color: T.textDim, marginTop: 4, letterSpacing: '0.05em' }}>People & Process</div>
              {/* Badge */}
              <div
                style={{
                  opacity: calloutOp,
                  transform: `scale(${interpolate(calloutPop, [0, 1.1], [0.5, 1], CLAMP)})`,
                  position: 'absolute',
                  right: 30,
                  top: -8,
                  fontSize: 9,
                  fontFamily: MONO,
                  fontWeight: 800,
                  color: T.bg,
                  padding: '5px 14px',
                  backgroundColor: T.amber,
                  borderRadius: 6,
                  letterSpacing: '0.1em',
                  boxShadow: `0 2px 16px ${T.amber}70, 0 0 30px ${T.amber}30`,
                }}
              >
                WHERE VALUE LIVES
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom quote */}
      <div style={{ position: 'absolute', bottom: 44, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ ...quoteStyle, fontSize: 16, fontFamily: SERIF, fontStyle: 'italic', color: T.textMuted, maxWidth: 680, textAlign: 'center', lineHeight: 1.6 }}>
          {'\u201C'}Companies that redesign workflows around AI see 3{'\u00D7'} greater returns.{'\u201D'} {'\u2014'} BCG
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════

export const ScalingGapSlide: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80}>
      <TitleScene />
    </Sequence>
    <Sequence from={80} durationInFrames={110}>
      <FaceOffScene />
    </Sequence>
    <Sequence from={190} durationInFrames={110}>
      <ValueScene />
    </Sequence>
  </AbsoluteFill>
);
