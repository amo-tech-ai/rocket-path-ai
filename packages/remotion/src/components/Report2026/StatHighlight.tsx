import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { REPORT2026_COLORS, REPORT2026_TYPO, REPORT2026_STAT_DURATION_FRAMES } from '../../theme/report2026';

export interface StatHighlightProps {
  backgroundColor: string;
  /** Main stat e.g. "40%" */
  stat: string;
  /** Supporting text below or beside */
  supportingText?: string;
}

/**
 * Oversized number + optional supporting text. Stat scales up over REPORT2026_STAT_DURATION_FRAMES.
 */
export const StatHighlight: React.FC<StatHighlightProps> = ({
  backgroundColor,
  stat,
  supportingText,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(
    frame,
    [0, REPORT2026_STAT_DURATION_FRAMES],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const supportOpacity = interpolate(
    frame,
    [REPORT2026_STAT_DURATION_FRAMES, REPORT2026_STAT_DURATION_FRAMES + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          fontFamily: 'Inter, Helvetica Neue, sans-serif',
          fontWeight: 900,
          fontSize: REPORT2026_TYPO.heroStat,
          color: REPORT2026_COLORS.redOrange,
          lineHeight: 1,
        }}
      >
        {stat}
      </div>
      {supportingText ? (
        <div
          style={{
            opacity: supportOpacity,
            fontFamily: 'Inter, Helvetica Neue, sans-serif',
            fontWeight: 500,
            fontSize: REPORT2026_TYPO.h2,
            color: REPORT2026_COLORS.darkGreen,
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          {supportingText}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
