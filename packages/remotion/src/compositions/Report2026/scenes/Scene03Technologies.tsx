import React from 'react';
import { CenteredStatement } from '../../../components/Report2026/CenteredStatement';
import { REPORT2026_COLORS } from '../../../theme/report2026';

/** Scene 3: 0:06-0:10 — "Some technologies take decades" on orange BG */
export const Scene03Technologies: React.FC = () => (
  <CenteredStatement
    backgroundColor={REPORT2026_COLORS.orangeBg}
    text="Some technologies take decades"
    textColor={REPORT2026_COLORS.white}
    fontSize={56}
  />
);
