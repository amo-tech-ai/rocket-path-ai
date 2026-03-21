import React from 'react';
import { CenteredStatement } from '../../../components/Report2026/CenteredStatement';
import { REPORT2026_COLORS } from '../../../theme/report2026';

/** Scene 7: 0:18-0:20 — "It took just 3 years — 2026" */
export const Scene07ThreeYears2026: React.FC = () => (
  <CenteredStatement
    backgroundColor={REPORT2026_COLORS.darkGreen}
    text="It took just 3 years — 2026"
    emphasisWord="2026"
    textColor={REPORT2026_COLORS.white}
    fontSize={48}
  />
);
