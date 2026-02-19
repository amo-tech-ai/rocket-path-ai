import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS } from '../theme/colors';

interface AnimatedStatProps {
  value: number;
  label: string;
  unit?: string;
  delay?: number;
}

export const AnimatedStat: React.FC<AnimatedStatProps> = ({
  value,
  label,
  unit = '',
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const displayValue = Math.round(
    interpolate(
      frame - delay,
      [0, 45],
      [0, value],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )
  );

  const labelOpacity = interpolate(
    frame - delay - 20,
    [0, 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 160,
            fontWeight: 700,
            color: COLORS.white,
            lineHeight: 1,
            textShadow: `0 0 40px ${COLORS.accent}40`,
          }}
        >
          ${displayValue}
          {unit}
        </div>
        <div
          style={{
            fontSize: 28,
            color: COLORS.muted,
            marginTop: 16,
            opacity: labelOpacity,
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};
