import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { REPORT2026_COLORS, REPORT2026_TYPO, REPORT2026_WORD_FRAMES } from '../../theme/report2026';

export interface CenteredStatementProps {
  backgroundColor: string;
  text: string;
  /** Word to render in red-orange (optional) */
  emphasisWord?: string;
  /** Text color when not emphasized */
  textColor?: string;
  /** Font size in px */
  fontSize?: number;
}

/**
 * Centered statement with word-by-word reveal. One line; for multiple lines use multiple components or newlines.
 */
export const CenteredStatement: React.FC<CenteredStatementProps> = ({
  backgroundColor,
  text,
  emphasisWord,
  textColor = REPORT2026_COLORS.textOnLight,
  fontSize = REPORT2026_TYPO.h1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.trim().split(/\s+/);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.25em',
          textAlign: 'center',
          fontFamily: 'Inter, Helvetica Neue, sans-serif',
          fontWeight: 700,
          lineHeight: 1.2,
          maxWidth: 1100,
        }}
      >
        {words.map((word, i) => {
          const startFrame = i * REPORT2026_WORD_FRAMES;
          const opacity = interpolate(
            frame,
            [startFrame, startFrame + 8],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const isEmphasis = emphasisWord !== undefined && word.toLowerCase() === emphasisWord.toLowerCase();
          return (
            <span
              key={`${i}-${word}`}
              style={{
                opacity,
                fontSize,
                color: isEmphasis ? REPORT2026_COLORS.keyword : textColor,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
