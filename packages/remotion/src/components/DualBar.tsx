import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../theme/colors';

interface DualBarProps {
  leftValue: number;
  rightValue: number;
  leftLabel: string;
  rightLabel: string;
  maxValue?: number;
}

export const DualBar: React.FC<DualBarProps> = ({
  leftValue,
  rightValue,
  leftLabel,
  rightLabel,
  maxValue = 100,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftHeight = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const rightHeight = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200 },
  });

  const leftPct = (leftValue / maxValue) * leftHeight;
  const rightPct = (rightValue / maxValue) * rightHeight;

  return (
    <div
      style={{
        display: 'flex',
        gap: 80,
        alignItems: 'flex-end',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: 80,
            height: 200,
            backgroundColor: COLORS.surfaceLight,
            borderRadius: 8,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              width: '100%',
              height: `${leftPct * 100}%`,
              backgroundColor: COLORS.blue,
              borderRadius: 8,
              transition: 'none',
            }}
          />
        </div>
        <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.white, marginTop: 8 }}>
          {leftValue}%
        </span>
        <span style={{ fontSize: 14, color: COLORS.muted, marginTop: 4 }}>{leftLabel}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: 80,
            height: 200,
            backgroundColor: COLORS.surfaceLight,
            borderRadius: 8,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              width: '100%',
              height: `${rightPct * 100}%`,
              backgroundColor: COLORS.accent,
              borderRadius: 8,
              transition: 'none',
            }}
          />
        </div>
        <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.white, marginTop: 8 }}>
          {rightValue}%
        </span>
        <span style={{ fontSize: 14, color: COLORS.muted, marginTop: 4 }}>{rightLabel}</span>
      </div>
    </div>
  );
};
