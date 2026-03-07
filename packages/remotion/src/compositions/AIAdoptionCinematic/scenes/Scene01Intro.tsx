import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';
import { CinematicBackground } from '../../../components/CinematicBackground';

export const Scene01Intro: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // Background logic
    const bgOpacity = interpolate(frame, [0, 20], [0, 0.22], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const bgScale = interpolate(frame, [0, durationInFrames], [1.0, 1.08], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const bgRotateY = interpolate(frame, [0, durationInFrames], [-10, 10], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const bgTranslateY = interpolate(frame, [0, durationInFrames], [0, -20], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // Title logic
    // Starts arriving at frame 15
    const titleOpacity = interpolate(frame, [15, 50], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // Spring scales from 0.92 to 1.0 between frames 15 and 50
    const titleEntryScale = interpolate(
        spring({
            frame: frame - 15,
            fps,
            config: { damping: 200, mass: 1 },
        }),
        [0, 1],
        [0.92, 1.0]
    );

    // Oscillates / breathes from frame 50 to 180
    // 1.0 to 1.015
    const breatheScale = interpolate(
        frame - 50,
        [0, 130],
        [1.0, 1.015],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    const titleFinalScale = frame < 50 ? titleEntryScale : breatheScale;

    return (
        <AbsoluteFill style={{ backgroundColor: '#070A10' }}>
            {/* Cinematic Background Layer */}
            <CinematicBackground
                src="/images/globe8.png"
                opacity={bgOpacity}
                scale={bgScale}
                rotateY={bgRotateY}
                translateY={bgTranslateY}
            />

            {/* Title Overlay */}
            <AbsoluteFill
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '100px',
                }}
            >
                <div
                    style={{
                        opacity: titleOpacity,
                        transform: `scale(${titleFinalScale})`,
                        textAlign: 'center',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 800,
                        color: 'rgba(255, 255, 255, 0.94)',
                        textShadow: '0 0 40px rgba(46, 196, 255, 0.25)',
                        letterSpacing: '-2px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        lineHeight: 1.1,
                    }}
                >
                    <span style={{ fontSize: '110px' }}>AI Adoption</span>
                    <span style={{ fontSize: '130px' }}>2026</span>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
