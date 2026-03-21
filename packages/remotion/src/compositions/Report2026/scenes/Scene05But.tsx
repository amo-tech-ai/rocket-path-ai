import React from 'react';
import { CenteredStatement } from '../../../components/Report2026/CenteredStatement';
import { REPORT2026_COLORS } from '../../../theme/report2026';

/** Scene 5: 0:12-0:16 — "But" on dark green (transition) */
export const Scene05But: React.FC = () => (
  <CenteredStatement
    backgroundColor={REPORT2026_COLORS.darkGreen}
    text="But"
    textColor={REPORT2026_COLORS.white}
    fontSize={64}
  />
);
