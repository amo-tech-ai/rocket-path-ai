import React from 'react';
import { StatHighlight } from '../../../components/Report2026/StatHighlight';
import { REPORT2026_COLORS } from '../../../theme/report2026';

/** Scene 12: 0:28-0:32 — "With more than 1,500 responses" stat on beige */
export const Scene12SurveyContext: React.FC = () => (
  <StatHighlight
    backgroundColor={REPORT2026_COLORS.beige}
    stat="1,500+"
    supportingText="With more than 1,500 responses from professionals"
  />
);
