import React from 'react';
import { CenteredStatement } from '../../../components/Report2026/CenteredStatement';
import { REPORT2026_COLORS } from '../../../theme/report2026';

/** Scene 9: 0:22-0:24 — "2026 AI in Professional Services Report" title card on white */
export const Scene09TitleCard: React.FC = () => (
  <CenteredStatement
    backgroundColor={REPORT2026_COLORS.white}
    text="2026 AI in Professional Services Report"
    emphasisWord="2026"
    textColor={REPORT2026_COLORS.darkGreen}
    fontSize={42}
  />
);
