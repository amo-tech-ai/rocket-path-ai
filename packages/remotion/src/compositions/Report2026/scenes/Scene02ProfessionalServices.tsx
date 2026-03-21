import React from 'react';
import { CenteredStatement } from '../../../components/Report2026/CenteredStatement';
import { REPORT2026_COLORS } from '../../../theme/report2026';

/** Scene 2: 0:04-0:06 — "the professional services" on white */
export const Scene02ProfessionalServices: React.FC = () => (
  <CenteredStatement
    backgroundColor={REPORT2026_COLORS.white}
    text="the professional services"
    textColor={REPORT2026_COLORS.darkGreen}
    fontSize={56}
  />
);
