import React from 'react';
import { CenteredStatement } from '../../../components/Report2026/CenteredStatement';
import { REPORT2026_COLORS } from '../../../theme/report2026';

/** Scene 4: 0:10-0:12 — "to change how professionals work" on orange */
export const Scene04ToChange: React.FC = () => (
  <CenteredStatement
    backgroundColor={REPORT2026_COLORS.orangeBg}
    text="to change how professionals work"
    textColor={REPORT2026_COLORS.white}
    fontSize={48}
  />
);
