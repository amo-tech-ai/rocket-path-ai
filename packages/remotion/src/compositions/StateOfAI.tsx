import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { AnimatedStat } from '../components/AnimatedStat';
import { DualBar } from '../components/DualBar';
import { ProgressRing } from '../components/ProgressRing';
import { COLORS } from '../theme/colors';

// Hook: 0-60
const HookScene: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, ${COLORS.bg} 0%, ${COLORS.surface} 100%)`,
    }}
  >
    <AnimatedStat
      value={226}
      unit="B"
      label="invested in AI 2025"
    />
  </AbsoluteFill>
);

// Context: 60-150
const ContextScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.bg} 0%, ${COLORS.surface} 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ textAlign: 'center', opacity, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ fontSize: 48, color: COLORS.white, fontWeight: 600 }}>
          48% of all venture capital
        </div>
        <div style={{ fontSize: 24, color: COLORS.muted, marginTop: 12 }}>
          went to AI in 2025
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Data: 150-360
const DataScene: React.FC = () => (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.bg} 0%, ${COLORS.surface} 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 60,
        }}
      >
        <div style={{ display: 'flex', gap: 100, alignItems: 'center' }}>
          <ProgressRing progress={0.6} label="Workers with AI access" color={COLORS.green} />
          <DualBar
            leftValue={36}
            rightValue={72}
            leftLabel="CEOs lead AI (2025)"
            rightLabel="CEOs lead AI (2026)"
          />
          <ProgressRing progress={0.56} label="Zero benefit" color={COLORS.red} />
        </div>
        <div style={{ fontSize: 18, color: COLORS.dimmed }}>
          Sources: Deloitte, BCG, PwC CEO Survey 2026
        </div>
      </div>
    </AbsoluteFill>
);

// Insight: 360-450
const InsightScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [0, 25], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.bg} 0%, ${COLORS.surface} 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          opacity,
          transform: `translateY(${translateY}px)`,
          fontFamily: 'system-ui, sans-serif',
          maxWidth: 800,
        }}
      >
        <div style={{ fontSize: 36, color: COLORS.white, fontWeight: 600, lineHeight: 1.4 }}>
          "94% continue investing despite lack of returns."
        </div>
        <div style={{ fontSize: 28, color: COLORS.accent, marginTop: 16 }}>
          The race is on.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// CTA: 450-540
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(frame, [0, 30], [0.95, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.bg} 0%, ${COLORS.surface} 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          opacity,
          transform: `scale(${scale})`,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 56, color: COLORS.white, fontWeight: 700 }}>
          StartupAI
        </div>
        <div style={{ fontSize: 24, color: COLORS.muted, marginTop: 12 }}>
          Validate your AI strategy
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const StateOfAI: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={60}>
        <HookScene />
      </Sequence>
      <Sequence from={60} durationInFrames={90}>
        <ContextScene />
      </Sequence>
      <Sequence from={150} durationInFrames={210}>
        <DataScene />
      </Sequence>
      <Sequence from={360} durationInFrames={90}>
        <InsightScene />
      </Sequence>
      <Sequence from={450} durationInFrames={90}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
