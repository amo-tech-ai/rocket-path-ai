import { AbsoluteFill, Composition, Folder, Sequence } from 'remotion';
import { StateOfAI } from './compositions/StateOfAI';
import { AIAdoption } from './compositions/AIAdoption';
import { HeroSlide } from './compositions/AIAdoption/HeroSlide';
import { ScalingGapSlide } from './compositions/AIAdoption/ScalingGapSlide';
import { ExecutiveSummarySlide } from './compositions/AIAdoption/ExecutiveSummarySlide';
import { IndustryRankingsSlide } from './compositions/AIAdoption/IndustryRankingsSlide';
import { DeepDive1, DeepDive2, DeepDive3 } from './compositions/AIAdoption/SectorDeepDiveSlide';

import { AIAdoptionVideo } from './compositions/AIAdoptionV2/AIAdoptionVideo';
import { Scene01Intro } from './compositions/AIAdoptionCinematic/scenes/Scene01Intro';
import { Scene02HeroStats } from './compositions/AIAdoptionCinematic/scenes/Scene02HeroStats';
import { Scene03ScalingGap } from './compositions/AIAdoptionCinematic/scenes/Scene03ScalingGap';
import { Scene04IndustryOverview } from './compositions/AIAdoptionCinematic/scenes/Scene04IndustryOverview';
import { Scene04TopAdoption } from './compositions/AIAdoptionCinematic/scenes/Scene04TopAdoption';
import { Scene04TopAdoptionRedux } from './compositions/AIAdoptionCinematic/scenes/Scene04TopAdoptionRedux';
import { Scene05ExecutiveSummary } from './compositions/AIAdoptionCinematic/scenes/Scene05ExecutiveSummary';
import { Scene06LeadersLaggards } from './compositions/AIAdoptionCinematic/scenes/Scene06LeadersLaggards';
import { Scene07IndustryRankings } from './compositions/AIAdoptionCinematic/scenes/Scene07IndustryRankings';
import { Scene07IndustryRankingsRedux } from './compositions/AIAdoptionCinematic/scenes/Scene07IndustryRankingsRedux';
import { Scene08AdoptionFilm } from './compositions/AIAdoptionCinematic/scenes/Scene08AdoptionFilm';
import { Scene09SectorDeepDives } from './compositions/AIAdoptionCinematic/scenes/Scene09SectorDeepDives';
import { Scene10IndustryLeaderboard } from './compositions/AIAdoptionCinematic/scenes/Scene10IndustryLeaderboard';
import { Scene10IndustrySpotlight } from './compositions/AIAdoptionCinematic/scenes/Scene10IndustrySpotlight';
import { Scene11AIEcommerce } from './compositions/AIAdoptionCinematic/scenes/Scene11AIEcommerce';
import { Scene12StrategFilm } from './compositions/AIAdoptionCinematic/scenes/Scene12StrategFilm';

/** Preview: Slides 1–7 back to back */
const Slides1to7: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={240}>
      <HeroSlide />
    </Sequence>
    <Sequence from={240} durationInFrames={300}>
      <ScalingGapSlide />
    </Sequence>
    <Sequence from={540} durationInFrames={300}>
      <ExecutiveSummarySlide />
    </Sequence>
    <Sequence from={840} durationInFrames={360}>
      <IndustryRankingsSlide />
    </Sequence>
    <Sequence from={1200} durationInFrames={280}>
      <DeepDive1 />
    </Sequence>
    <Sequence from={1480} durationInFrames={280}>
      <DeepDive2 />
    </Sequence>
    <Sequence from={1760} durationInFrames={280}>
      <DeepDive3 />
    </Sequence>
  </AbsoluteFill>
);

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="StateOfAI"
        component={StateOfAI}
        durationInFrames={540}
        width={1920}
        height={1080}
        fps={30}
        defaultProps={{}}
      />
      <Folder name="AIAdoption">
        <Composition
          id="AIAdoptionV2"
          component={AIAdoptionVideo}
          durationInFrames={2010}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoptionCinematic-Intro"
          component={Scene01Intro}
          durationInFrames={180}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoptionCinematic-HeroStats"
          component={Scene02HeroStats}
          durationInFrames={270}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoptionCinematic-ScalingGap"
          component={Scene03ScalingGap}
          durationInFrames={300}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoptionCinematic-IndustryOverview"
          component={Scene04IndustryOverview}
          durationInFrames={300}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoptionCinematic-TopAdoption"
          component={Scene04TopAdoption}
          durationInFrames={390}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoptionCinematic-TopAdoptionRedux"
          component={Scene04TopAdoptionRedux}
          durationInFrames={300}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoptionCinematic-ExecutiveSummary"
          component={Scene05ExecutiveSummary}
          durationInFrames={360}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoptionCinematic-LeadersLaggards"
          component={Scene06LeadersLaggards}
          durationInFrames={360}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoptionCinematic-IndustryRankings"
          component={Scene07IndustryRankings}
          durationInFrames={420}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoptionCinematic-IndustryRankingsRedux"
          component={Scene07IndustryRankingsRedux}
          durationInFrames={300}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoptionCinematic-AdoptionFilm"
          component={Scene08AdoptionFilm}
          durationInFrames={480}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoptionCinematic-SectorDeepDives"
          component={Scene09SectorDeepDives}
          durationInFrames={720}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoptionCinematic-IndustryLeaderboard"
          component={Scene10IndustryLeaderboard}
          durationInFrames={600}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoptionCinematic-IndustrySpotlight"
          component={Scene10IndustrySpotlight}
          durationInFrames={600}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />

        <Composition
          id="AIAdoptionCinematic-StrategFilm"
          component={Scene12StrategFilm}
          durationInFrames={1800}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoption"
          component={AIAdoption}
          durationInFrames={3600}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoption-Hero"
          component={HeroSlide}
          durationInFrames={240}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoption-ScalingGap"
          component={ScalingGapSlide}
          durationInFrames={300}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoption-ExecSummary"
          component={ExecutiveSummarySlide}
          durationInFrames={300}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoption-Rankings"
          component={IndustryRankingsSlide}
          durationInFrames={360}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoption-DeepDive1"
          component={DeepDive1}
          durationInFrames={280}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoption-DeepDive2"
          component={DeepDive2}
          durationInFrames={280}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoption-DeepDive3"
          component={DeepDive3}
          durationInFrames={280}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
        <Composition
          id="AIAdoption-Preview"
          component={Slides1to7}
          durationInFrames={2040}
          width={1920}
          height={1080}
          fps={30}
          defaultProps={{}}
        />
      </Folder>
    </>
  );
};
