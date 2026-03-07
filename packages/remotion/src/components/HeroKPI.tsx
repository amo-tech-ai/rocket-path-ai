import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { DARK } from '../theme/dark';

interface HeroKPIProps {
  value: number;
  unit?: string;
  prefix?: string;
  label: string;
  sublabel?: string;
  delay?: number;
  color?: string;
  /** Use fixed decimal places for values like 3.7 */
  decimals?: number;
}

export const HeroKPI: React.FC<HeroKPIProps> = ({
  value,
  unit = '',
  prefix = '',
  label,
  sublabel,
  delay = 0,
  color = DARK.primary,
  decimals = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - delay;

  // Scale entrance — smooth, no bounce
  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 200 },
  });

  // Count-up from 0 to value over 40 frames
  const rawDisplay = interpolate(
    localFrame,
    [0, 40],
    [0, value],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const displayValue = decimals > 0
    ? rawDisplay.toFixed(decimals)
    : Math.round(rawDisplay).toString();

  // Label fades in 15 frames after number starts
  const labelOpacity = interpolate(
    localFrame - 15,
    [0, 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Sublabel fades in 5 frames after label
  const sublabelOpacity = interpolate(
    localFrame - 20,
    [0, 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Overall opacity — invisible before delay
  const visible = interpolate(
    localFrame,
    [-1, 0],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible,
        transform: `scale(${scale})`,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        width: 400,
        padding: '32px 24px',
      }}
    >
      {/* Value row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        {prefix && (
          <span
            style={{
              fontSize: 72,
              fontWeight: 300,
              color,
              lineHeight: 1,
            }}
          >
            {prefix}
          </span>
        )}
        <span
          style={{
            fontSize: 96,
            fontWeight: 700,
            color,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {displayValue}
        </span>
        {unit && (
          <span
            style={{
              fontSize: 48,
              fontWeight: 500,
              color,
              lineHeight: 1,
              marginLeft: 2,
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 500,
          color: DARK.text,
          marginTop: 12,
          opacity: labelOpacity,
          textAlign: 'center',
          letterSpacing: '0.01em',
        }}
      >
        {label}
      </div>

      {/* Sublabel */}
      {sublabel && (
        <div
          style={{
            fontSize: 15,
            color: DARK.textMuted,
            marginTop: 6,
            opacity: sublabelOpacity,
            textAlign: 'center',
          }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
};
