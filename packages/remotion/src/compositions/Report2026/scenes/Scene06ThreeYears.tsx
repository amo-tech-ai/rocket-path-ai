import React from 'react';
import { CenteredStatement } from '../../../components/Report2026/CenteredStatement';
import { REPORT2026_COLORS } from '../../../theme/report2026';

/** Scene 6: 0:16-0:18 — "It took just 3 years — 2024" (year updates in next scene) */
export const Scene06ThreeYears: React.FC = () => (
  <CenteredStatement
    backgroundColor={REPORT2026_COLORS.darkGreen}
    text="It took just 3 years — 2024"
    emphasisWord="2024"
    textColor={REPORT2026_COLORS.white}
    fontSize={48}
  />
);
