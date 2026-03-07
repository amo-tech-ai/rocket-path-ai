import React from 'react';
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { FadeIn, TypewriterText, SlideUp, ActLabel } from '../../../components/SharedUtils';

// Simplified ParticleNumber - uses blur and scale to simulate coalescing
const CoalescingNumber: React.FC<{ value: number; unit: string }> = ({ value, unit }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = spring({
        frame,
        fps,
        config: { damping: 14, mass: 1 },
        durationInFrames: 60
    });

    const displayValue = Math.round(interpolate(progress, [0, 1], [0, value]));
    const blur = interpolate(progress, [0, 1], [20, 0], { extrapolateRight: 'clamp' });
    const scale = interpolate(progress, [0, 1], [1.5, 1], { extrapolateRight: 'clamp' });
    const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <div style={{
            fontSize: 128,
            fontWeight: 800,
            color: '#FFFFFF',
            filter: `blur(${blur}px)`,
            transform: `scale(${scale})`,
            opacity,
            textShadow: '0 0 40px rgba(255,255,255,0.2)',
            fontFamily: 'Inter, sans-serif'
        }}>
            {displayValue}{unit}
        </div>
    );
};

export const HookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Shift up amount when the second number appears at frame 120
    const shiftUp = spring({
        frame: frame - 120,
        fps,
        config: { damping: 200 }
    });
    const translateY = interpolate(shiftUp, [0, 1], [0, -100]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#0A1628', fontFamily: 'Inter, sans-serif' }}>

            {/* 72% Number */}
            <Sequence from={15}>
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `translateY(${translateY}px)`
                }}>
                    <CoalescingNumber value={72} unit="%" />

                    <Sequence from={60} layout="none">
                        <TypewriterText
                            text="of organizations now use AI"
                            speed={1.5}
                            style={{ fontSize: 28, color: '#94A3B8', marginTop: 16 }}
                        />
                    </Sequence>
                </div>
            </Sequence>

            {/* 74% stuck */}
            <Sequence from={120}>
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 150
                }}>
                    <SlideUp>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: 96,
                                fontWeight: 800,
                                color: '#F59E0B',
                                textShadow: '0 0 40px rgba(245,158,11,0.3)'
                            }}>
                                74%
                            </div>
                            <Sequence from={60} layout="none">
                                <FadeIn duration={15}>
                                    <div style={{ fontSize: 24, color: '#94A3B8', marginTop: 8 }}>
                                        stuck before tangible returns
                                    </div>
                                </FadeIn>
                            </Sequence>
                        </div>
                    </SlideUp>
                </div>
            </Sequence>

            {/* Watermark */}
            <Sequence from={210}>
                <FadeIn>
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 400,
                        fontWeight: 900,
                        color: 'rgba(255,255,255,0.03)',
                        zIndex: -1
                    }}>
                        $250B+
                    </div>
                </FadeIn>
            </Sequence>

            {/* Subtitle */}
            <Sequence from={240}>
                <div style={{
                    position: 'absolute',
                    bottom: 100,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <TypewriterText
                        text="Which industries are winning — and why most aren't."
                        speed={1.5}
                        style={{ fontSize: 24, color: '#FFFFFF', fontWeight: 500 }}
                    />
                </div>
            </Sequence>

        </AbsoluteFill>
    );
};
