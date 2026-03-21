import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { REPORT2026_COLORS } from '../../../theme/report2026';

/** Scene 10: 0:24-0:26 — Thomson Reuters spiral logo placeholder (text lockup on white) */
export const Scene10Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: REPORT2026_COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          opacity,
          fontFamily: 'Inter, Helvetica Neue, sans-serif',
          fontWeight: 700,
          fontSize: 28,
          color: REPORT2026_COLORS.darkGreen,
        }}
      >
        Thomson Reuters Institute
      </div>
    </AbsoluteFill>
  );
};
