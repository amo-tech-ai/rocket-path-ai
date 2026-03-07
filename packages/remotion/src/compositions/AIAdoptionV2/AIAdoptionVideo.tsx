import React from 'react';
import { Composition } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';

import { HookScene } from './scenes/HookScene';
import { MapScene } from './scenes/MapScene';
import { GapScene } from './scenes/GapScene';
import { WinnersScene } from './scenes/WinnersScene';
import { FutureScene } from './scenes/FutureScene';

export const AIAdoptionVideo: React.FC = () => {
    return (
        <TransitionSeries>

            {/* Act 1: The Hook (10s) */}
            <TransitionSeries.Sequence durationInFrames={300}>
                <HookScene />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: 30 })}
            />

            {/* Act 2: The Map (20s) */}
            <TransitionSeries.Sequence durationInFrames={600}>
                <MapScene />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
                presentation={wipe({ direction: "from-left" })}
                timing={linearTiming({ durationInFrames: 20 })}
            />

            {/* Act 3: The Gap (15s) */}
            <TransitionSeries.Sequence durationInFrames={450}>
                <GapScene />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: 20 })}
            />

            {/* Act 4: The Winners (15s) */}
            <TransitionSeries.Sequence durationInFrames={450}>
                <WinnersScene />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
                presentation={wipe({ direction: "from-right" })}
                timing={linearTiming({ durationInFrames: 20 })}
            />

            {/* Act 5: The Future (10s) */}
            <TransitionSeries.Sequence durationInFrames={300}>
                <FutureScene />
            </TransitionSeries.Sequence>

        </TransitionSeries>
    );
};
