import React from 'react';
import { Series } from 'remotion';
import { REPORT2026_SCENE_DURATIONS } from '../../theme/report2026';

import { Scene01Hook } from './scenes/Scene01Hook';
import { Scene02ProfessionalServices } from './scenes/Scene02ProfessionalServices';
import { Scene03Technologies } from './scenes/Scene03Technologies';
import { Scene04ToChange } from './scenes/Scene04ToChange';
import { Scene05But } from './scenes/Scene05But';
import { Scene06ThreeYears } from './scenes/Scene06ThreeYears';
import { Scene07ThreeYears2026 } from './scenes/Scene07ThreeYears2026';
import { Scene08TransitionWipe } from './scenes/Scene08TransitionWipe';
import { Scene09TitleCard } from './scenes/Scene09TitleCard';
import { Scene10Logo } from './scenes/Scene10Logo';
import { Scene11TransitionSurvey } from './scenes/Scene11TransitionSurvey';
import { Scene12SurveyContext } from './scenes/Scene12SurveyContext';

const SCENES = [
  Scene01Hook,
  Scene02ProfessionalServices,
  Scene03Technologies,
  Scene04ToChange,
  Scene05But,
  Scene06ThreeYears,
  Scene07ThreeYears2026,
  Scene08TransitionWipe,
  Scene09TitleCard,
  Scene10Logo,
  Scene11TransitionSurvey,
  Scene12SurveyContext,
];

/**
 * 2026 AI in Professional Services Report — Phase 1 (first 12 scenes, 0:00–0:32).
 * Extend REPORT2026_SCENE_DURATIONS and SCENES to add remaining scenes per remotion/videos/2026-report.md.
 */
export const Report2026Video: React.FC = () => {
  return (
    <Series>
      {SCENES.map((Component, i) => (
        <Series.Sequence
          key={i}
          durationInFrames={REPORT2026_SCENE_DURATIONS[i] ?? 100}
        >
          <Component />
        </Series.Sequence>
      ))}
    </Series>
  );
};
