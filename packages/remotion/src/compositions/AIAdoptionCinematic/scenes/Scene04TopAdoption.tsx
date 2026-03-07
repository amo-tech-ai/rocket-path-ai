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

const DATASET = [
    { label: 'Technology & SaaS', value: 88 },
    { label: 'Financial Services', value: 75 },
    { label: 'Healthcare', value: 55 },
    { label: 'Retail & E-commerce', value: 50 },
    { label: 'Professional Services', value: 45 },
];

const AnimatedBar: React.FC<{ label: string; value: number; delay: number }> = ({
    label,
    value,
    delay,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const grow = spring({
        frame: frame - delay,
        fps,
        config: {
            damping: 20,
        },
        durationInFrames: 30,
    });

    const width = interpolate(grow, [0, 1], [0, value]);
    const entry = spring({
        frame: frame - delay,
        fps,
        config: { damping: 20 },
    });

    const opacity = interpolate(entry, [0, 1], [0, 1]);
    const translateX = interpolate(entry, [0, 1], [-20, 0]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                marginBottom: '24px',
                opacity,
                transform: `translateX(${translateX}px)`,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.9)',
                }}
            >
                <span>{label}</span>
                <span style={{ color: '#2EC4FF', fontWeight: 800 }}>{value}%</span>
            </div>
            <div
                style={{
                    height: '14px',
                    width: '100%',
                    background: 'rgba(107, 114, 128, 0.1)',
                    borderRadius: '7px',
                    overflow: 'visible', // To show the glow
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${width}%`,
                        background: '#2EC4FF',
                        borderRadius: '7px',
                        position: 'relative',
                    }}
                >
                    {/* Leading edge glow - only at the end of the spring settle */}
                    {grow > 0.95 && (
                        <div
                            style={{
                                position: 'absolute',
                                right: '-4px',
                                top: '-4px',
                                width: '8px',
                                height: '22px',
                                background: '#2EC4FF',
                                boxShadow: '0 0 15px #2EC4FF',
                                borderRadius: '4px',
                                opacity: interpolate(grow, [0.95, 1], [0, 1]),
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export const Scene04TopAdoption: React.FC = () => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    const bgTranslateY = interpolate(frame, [0, durationInFrames], [0, -40]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#070A10' }}>
            <CinematicBackground
                src="/images/imgi.png"
                opacity={0.15}
                scale={1.0}
                rotateY={0}
                translateY={bgTranslateY}
            />

            {/* Center Content UI */}
            <AbsoluteFill
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 200px',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '900px',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '32px',
                            fontWeight: 800,
                            color: '#fff',
                            marginBottom: '50px',
                            textAlign: 'center',
                            letterSpacing: '-1px',
                        }}
                    >
                        Top 5 Industry Adoption · 2024–2025
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {DATASET.map((item, i) => (
                            <AnimatedBar
                                key={item.label}
                                label={item.label}
                                value={item.value}
                                delay={20 + i * 5}
                            />
                        ))}
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
