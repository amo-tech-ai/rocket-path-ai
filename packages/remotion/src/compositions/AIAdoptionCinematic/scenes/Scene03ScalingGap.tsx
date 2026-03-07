import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';
import { CinematicBackground } from '../../../components/CinematicBackground';

export const Scene03ScalingGap: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    const bgScale = interpolate(frame, [0, durationInFrames], [1, 1.03], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // Text animations
    const textEntry = spring({
        frame: frame - 10,
        fps,
        config: { damping: 20 },
    });
    const textOpacity = interpolate(textEntry, [0, 1], [0, 1]);
    const textX = interpolate(textEntry, [0, 1], [-20, 0]);

    // Funnel animations
    const funnelSpring = (offset: number) =>
        spring({
            frame: frame - 30 - offset,
            fps,
            config: { damping: 15 },
        });

    const stage1Width = interpolate(funnelSpring(0), [0, 1], [0, 450]);
    const stage2Width = interpolate(funnelSpring(5), [0, 1], [0, 333]); // 74% of stage 1 approx
    const stage3Width = interpolate(funnelSpring(10), [0, 1], [0, 117]); // 26% of stage 1 approx

    return (
        <AbsoluteFill style={{ backgroundColor: '#070A10' }}>
            <CinematicBackground
                src="/images/imageye_2.png"
                opacity={0.25}
                scale={bgScale}
                rotateY={0}
                translateY={0}
            />

            {/* Custom Asymmetrical Vignette for this scene */}
            <AbsoluteFill
                style={{
                    background:
                        'linear-gradient(to right, rgba(7, 10, 16, 0.9) 0%, rgba(7, 10, 16, 0.1) 100%)',
                }}
            />

            <AbsoluteFill
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '0 100px',
                }}
            >
                {/* Left Column: Headline */}
                <div
                    style={{
                        flex: 1,
                        opacity: textOpacity,
                        transform: `translateX(${textX}px)`,
                    }}
                >
                    <div
                        style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 28,
                            color: '#2EC4FF',
                            fontWeight: 500,
                            marginBottom: 10,
                            textTransform: 'uppercase',
                            letterSpacing: 2,
                        }}
                    >
                        The Scaling Gap
                    </div>
                    <div
                        style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 72,
                            color: '#fff',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            maxWidth: 600,
                        }}
                    >
                        Everyone’s Adopting. Almost Nobody’s Scaling.
                    </div>
                </div>

                {/* Right Column: Funnel */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px',
                    }}
                >
                    {/* Stage 1 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                            style={{
                                width: stage1Width,
                                height: 60,
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                            }}
                        >
                            <span style={{ color: '#fff', fontWeight: 800, fontSize: 24 }}>100%</span>
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8, fontSize: 16 }}>Experimenting with AI</div>
                    </div>

                    {/* Stage 2 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                            style={{
                                width: stage2Width,
                                height: 60,
                                backgroundColor: 'rgba(53, 242, 166, 0.2)',
                                border: '1px solid #35F2A6',
                                borderRadius: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                boxSizing: 'border-box',
                                boxShadow: funnelSpring(5) > 0.9 ? '0 0 20px rgba(53, 242, 166, 0.4)' : 'none'
                            }}
                        >
                            <span style={{ color: '#35F2A6', fontWeight: 800, fontSize: 32, textShadow: '0 0 10px rgba(53, 242, 166, 0.5)' }}>74%</span>
                        </div>
                        <div style={{ color: '#35F2A6', marginTop: 8, fontSize: 16, fontWeight: 600 }}>Stuck before returns</div>
                    </div>

                    {/* Stage 3 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                            style={{
                                width: stage3Width,
                                height: 60,
                                backgroundColor: 'rgba(46, 196, 255, 0.2)',
                                border: '1px solid #2EC4FF',
                                borderRadius: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                boxSizing: 'border-box'
                            }}
                        >
                            <span style={{ color: '#2EC4FF', fontWeight: 800, fontSize: 24 }}>26%</span>
                        </div>
                        <div style={{ color: '#2EC4FF', marginTop: 8, fontSize: 16, fontWeight: 600 }}>Beyond pilots</div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
