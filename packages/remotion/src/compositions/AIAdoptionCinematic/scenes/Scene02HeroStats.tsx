import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { CinematicBackground } from '../../../components/CinematicBackground';
import { StatCard } from '../../../components/StatCard';
import { DividerLine } from '../../../components/DividerLine';

export const Scene02HeroStats: React.FC = () => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    const bgScale = interpolate(frame, [0, durationInFrames], [1, 1.01]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#070A10' }}>
            {/* Cinematic Background Layer */}
            <CinematicBackground
                src="/images/globe3.png"
                opacity={0.15}
                scale={bgScale}
                rotateY={0}
                translateY={0}
            />

            {/* Foreground Content */}
            <AbsoluteFill
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 100px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: 1200,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <StatCard
                            value="72%"
                            label="Organizations Using AI"
                            progress={0.72}
                            delay={0}
                        />
                        <StatCard
                            value="$250B+"
                            label="Private AI Investment (2024)"
                            progress={1}
                            delay={5}
                        />
                        <StatCard
                            value="3.7×"
                            label="Gen AI ROI"
                            progress={3.7}
                            delay={10}
                        />
                    </div>

                    <DividerLine delay={15} />
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
