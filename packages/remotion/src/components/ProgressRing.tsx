import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS } from '../theme/colors';

interface ProgressRingProps {
  progress: number;
  label: string;
  color?: string;
  size?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  label,
  color = COLORS.accent,
  size = 120,
}) => {
  const frame = useCurrentFrame();
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const segmentLength = progress * circumference;

  const offset = interpolate(
    frame,
    [0, 45],
    [segmentLength, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const labelOpacity = interpolate(
    frame,
    [25, 45],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={COLORS.axis}
          strokeWidth={10}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeDasharray={`${segmentLength} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          opacity: labelOpacity,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <span style={{ fontSize: 28, fontWeight: 700, color: COLORS.white }}>
          {Math.round(progress * 100)}%
        </span>
        <div style={{ fontSize: 12, color: COLORS.muted }}>{label}</div>
      </div>
    </div>
  );
};
