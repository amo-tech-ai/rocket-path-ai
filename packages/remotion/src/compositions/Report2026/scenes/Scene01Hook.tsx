import React from 'react';
import { CenteredStatement } from '../../../components/Report2026/CenteredStatement';
import { REPORT2026_COLORS } from '../../../theme/report2026';

/** Scene 1: 0:00-0:04 — Hook "AI is" on white */
export const Scene01Hook: React.FC = () => (
  <CenteredStatement
    backgroundColor={REPORT2026_COLORS.white}
    text="AI is"
    textColor={REPORT2026_COLORS.darkGreen}
    fontSize={72}
  />
);
