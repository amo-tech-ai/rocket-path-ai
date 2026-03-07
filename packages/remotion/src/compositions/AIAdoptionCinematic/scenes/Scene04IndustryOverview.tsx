import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';

const INDUSTRIES = [
    { label: 'Technology & SaaS', value: 88 },
    { label: 'Financial Services', value: 75 },
    { label: 'Healthcare', value: 55 },
    { label: 'Retail & E-commerce', value: 50 },
    { label: 'Professional Services', value: 45 },
];

export const Scene04IndustryOverview: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Section 1: Header Animation (0-40)
    const headerSpring = spring({
        frame,
        fps,
        config: { damping: 20 },
    });
    const headerOpacity = interpolate(headerSpring, [0, 1], [0, 1]);
    const headerY = interpolate(headerSpring, [0, 1], [20, 0]);

    // Section 2: Key Stats Animation (40-110)
    const getStatSpring = (delay: number) =>
        spring({
            frame: frame - delay,
            fps,
            config: { damping: 15 },
        });

    const statData = [
        { value: '72%', label: 'Organizations Using AI', delay: 40 },
        { value: '$250B+', label: 'Private AI Investment (2024)', delay: 60 },
        { value: '3.7×', label: 'Gen AI ROI', delay: 80 },
    ];

    // Section 3: Bar Chart Animation (110-300)
    const barTitleSpring = spring({
        frame: frame - 110,
        fps,
        config: { damping: 20 },
    });

    // Whole composition breathing scale (after frame 200)
    const baseScale = interpolate(frame, [200, 300], [1, 1.015], {
        extrapolateLeft: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(135deg, #050B18 0%, #0A1A33 100%)',
                fontFamily: 'Inter, sans-serif',
                transform: `scale(${baseScale})`,
            }}
        >
            <div style={{ padding: '80px 100px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Section 1: Header */}
                <div
                    style={{
                        opacity: headerOpacity,
                        transform: `translateY(${headerY}px)`,
                        marginBottom: 60,
                    }}
                >
                    <div
                        style={{
                            fontSize: 14,
                            textTransform: 'uppercase',
                            letterSpacing: 2,
                            color: 'rgba(255,255,255,0.7)',
                            fontWeight: 600,
                            marginBottom: 8,
                        }}
                    >
                        Industry Research Report · 2025
                    </div>
                    <h1
                        style={{
                            fontSize: 64,
                            color: '#fff',
                            fontWeight: 800,
                            margin: 0,
                            marginBottom: 16,
                        }}
                    >
                        AI Adoption by Industry
                    </h1>
                    <p
                        style={{
                            fontSize: 20,
                            color: 'rgba(255,255,255,0.8)',
                            fontWeight: 400,
                            margin: 0,
                            maxWidth: 900,
                            lineHeight: 1.5,
                        }}
                    >
                        Which industries are using AI, what they use it for, and the results they're seeing — backed by
                        McKinsey, OECD, PwC, BCG, Stanford HAI.
                    </p>
                </div>

                {/* Section 2: Key Stats */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 100,
                        width: '100%',
                        maxWidth: 1200,
                    }}
                >
                    {statData.map((stat, i) => {
                        const spr = getStatSpring(stat.delay);
                        const op = interpolate(spr, [0, 1], [0, 1]);
                        const sc = interpolate(spr, [0, 1], [0.9, 1]);

                        return (
                            <div
                                key={i}
                                style={{
                                    opacity: op,
                                    transform: `scale(${sc})`,
                                    textAlign: 'center',
                                    flex: 1,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 110,
                                        fontWeight: 800,
                                        color: '#fff',
                                        marginBottom: 5,
                                        position: 'relative',
                                        display: 'inline-block',
                                    }}
                                >
                                    {stat.value}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: '10%',
                                            width: '80%',
                                            height: 4,
                                            background: '#2EC4FF',
                                            opacity: op,
                                            boxShadow: '0 0 15px rgba(46, 196, 255, 0.5)',
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        fontSize: 18,
                                        textTransform: 'uppercase',
                                        color: 'rgba(255,255,255,0.6)',
                                        letterSpacing: 1,
                                        marginTop: 15,
                                    }}
                                >
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Section 3: Adoption by Industry */}
                <div style={{ flex: 1 }}>
                    <h2
                        style={{
                            fontSize: 28,
                            color: '#fff',
                            fontWeight: 700,
                            marginBottom: 40,
                            opacity: interpolate(barTitleSpring, [0, 1], [0, 1]),
                        }}
                    >
                        Adoption by Industry · 2024–2025
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {INDUSTRIES.map((ind, i) => {
                            const startFrame = 110 + i * 10;
                            const barSpring = spring({
                                frame: frame - startFrame,
                                fps,
                                config: { damping: 20 },
                            });

                            const currentWidth = interpolate(barSpring, [0, 1], [0, ind.value]);

                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        opacity: interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
                                            extrapolateLeft: 'clamp',
                                        }),
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 300,
                                            fontSize: 20,
                                            color: 'rgba(255,255,255,0.9)',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {ind.label}
                                    </div>
                                    <div
                                        style={{
                                            height: 32,
                                            flex: 1,
                                            maxWidth: 600,
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: 4,
                                            position: 'relative',
                                            marginRight: 20,
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: '100%',
                                                width: `${currentWidth}%`,
                                                background: 'linear-gradient(90deg, #2EC4FF 0%, #1A8ED1 100%)',
                                                borderRadius: 4,
                                                boxShadow: '0 0 20px rgba(46, 196, 255, 0.3)',
                                            }}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 22,
                                            color: '#2EC4FF',
                                            fontWeight: 800,
                                            width: 60,
                                        }}
                                    >
                                        {ind.value}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
