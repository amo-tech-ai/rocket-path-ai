import { AbsoluteFill, Sequence } from 'remotion';
import { HeroSlide } from './HeroSlide';
import { ScalingGapSlide } from './ScalingGapSlide';
import { ExecutiveSummarySlide } from './ExecutiveSummarySlide';
import { IndustryRankingsSlide } from './IndustryRankingsSlide';
import { DeepDive1, DeepDive2, DeepDive3 } from './SectorDeepDiveSlide';

/**
 * AI Adoption by Industry — Full Video Composition
 *
 * 14 slides, 120 seconds (3600 frames @ 30fps)
 * See: tasks/remotion/06-aiadoption.md
 *
 * Implemented: Slides 1–7
 */
export const AIAdoption: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Slide 1: Hero (0–240) */}
      <Sequence from={0} durationInFrames={240}>
        <HeroSlide />
      </Sequence>

      {/* Slide 2: Scaling Gap (240–540) */}
      <Sequence from={240} durationInFrames={300}>
        <ScalingGapSlide />
      </Sequence>

      {/* Slide 3: Executive Summary (540–840) */}
      <Sequence from={540} durationInFrames={300}>
        <ExecutiveSummarySlide />
      </Sequence>

      {/* Slide 4: Industry Rankings (840–1200) */}
      <Sequence from={840} durationInFrames={360}>
        <IndustryRankingsSlide />
      </Sequence>

      {/* Slide 5: Deep Dive — Tech vs Finance (1200–1480) */}
      <Sequence from={1200} durationInFrames={280}>
        <DeepDive1 />
      </Sequence>

      {/* Slide 6: Deep Dive — Healthcare vs Retail (1480–1760) */}
      <Sequence from={1480} durationInFrames={280}>
        <DeepDive2 />
      </Sequence>

      {/* Slide 7: Deep Dive — Manufacturing vs Logistics (1760–2040) */}
      <Sequence from={1760} durationInFrames={280}>
        <DeepDive3 />
      </Sequence>

      {/* Slide 9: Gen AI Use Cases (2040–2340) — TODO */}
      {/* Slide 10: Productivity (2340–2580) — TODO */}
      {/* Slide 11: Investment (2580–2820) — TODO */}
      {/* Slide 12: Leaders vs Laggards (2820–3120) — TODO */}
      {/* Slide 13: Predictions (3120–3360) — TODO */}
      {/* Slide 14: CTA (3360–3600) — TODO */}
    </AbsoluteFill>
  );
};
