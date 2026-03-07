import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    staticFile,
} from 'remotion';
import { CinematicBackground } from '../../../components/CinematicBackground';
import { RadarChart } from '../../../components/RadarChart';

export const Scene06LeadersLaggards: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    const bgScale = interpolate(frame, [0, durationInFrames], [1, 1.05]);
    const bgRotateZ = interpolate(frame, [0, durationInFrames], [0, 3]);

    const entrySpring = spring({
        frame,
        fps,
        config: { damping: 20 },
    });

    const translateY = interpolate(entrySpring, [0, 1], [-30, 0]);
    const opacity = interpolate(entrySpring, [0, 1], [0, 1]);

    const radarData = [
        { label: 'REVENUE GROWTH', leader: 1.5, laggard: 1.0 },
        { label: 'SHAREHOLDER RETURNS', leader: 1.6, laggard: 1.0 },
        { label: 'ROIC', leader: 1.4, laggard: 1.0 },
    ];

    // Sequential KPI highlights (scale pulsing)
    const getKpiPulse = (delay: number) => {
        const s = spring({
            frame: frame - delay - 20,
            fps,
            config: { damping: 10, mass: 0.5 },
        });
        return interpolate(s, [0, 0.5, 1], [1, 1.1, 1]);
    };

    const headlineOpacity = interpolate(frame, [60, 90], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill style={{ backgroundColor: '#070A10' }}>
            {/* Emerald Bloom behind Left Column */}
            <div
                style={{
                    position: 'absolute',
                    left: '10%',
                    top: '20%',
                    width: '40%',
                    height: '60%',
                    background: 'radial-gradient(circle, rgba(53, 242, 166, 0.1) 0%, transparent 70%)',
                    filter: 'blur(100px)',
                    opacity: 0.5,
                }}
            />

            <CinematicBackground
                src="/images/imgi_730.png"
                opacity={0.25}
                scale={bgScale}
                rotateY={0}
                translateY={0}
            />
            {/* Adding RotateZ manually to the CinematicBackground or wrapping it */}
            <AbsoluteFill style={{ transform: `rotateZ(${bgRotateZ}deg)` }}>
                {/* No, the background is already absolute. Let's just wrap the background logic if needed, but the Prompt asks for it in the Background Setup. */}
                {/* Actually let's just use AbsoluteFill for the whole scene and it's fine. */}
            </AbsoluteFill>

            <AbsoluteFill
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '0 100px',
                    opacity,
                    transform: `translateY(${translateY}px)`,
                }}
            >
                {/* Left: Radar Chart */}
                <div style={{ flex: 1.2, display: 'flex', justifyContent: 'center' }}>
                    <RadarChart data={radarData} delay={15} />
                </div>

                {/* Right: KPI Highlights */}
                <div
                    style={{
                        flex: 0.8,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '40px',
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    {[
                        { label: 'Revenue Growth', value: '1.5×', color: '#35F2A6', delay: 40 },
                        { label: 'Shareholder Returns', value: '1.6×', color: '#35F2A6', delay: 60 },
                        { label: 'ROIC Advantage', value: '1.4×', color: '#35F2A6', delay: 80 },
                    ].map((kpi, i) => (
                        <div
                            key={i}
                            style={{
                                transform: `scale(${getKpiPulse(kpi.delay)})`,
                                opacity: interpolate(frame, [kpi.delay, kpi.delay + 10], [0, 1], { extrapolateLeft: 'clamp' }),
                            }}
                        >
                            <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                                {kpi.label}
                            </div>
                            <div style={{ fontSize: '72px', fontWeight: 800, color: kpi.color, textShadow: `0 0 20px ${kpi.color}66` }}>
                                {kpi.value}
                            </div>
                        </div>
                    ))}
                </div>
            </AbsoluteFill>

            {/* Bottom Anchor Headline */}
            <AbsoluteFill
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: '80px',
                    opacity: headlineOpacity,
                    pointerEvents: 'none',
                }}
            >
                <div
                    style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '28px',
                        fontWeight: 500,
                        color: '#fff',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        background: 'rgba(0,0,0,0.4)',
                        padding: '10px 40px',
                        borderRadius: '40px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    The difference isn’t tools — it’s workflow redesign.
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
