import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';

const RANKINGS = [
    { label: 'Technology & SaaS', value: 88, weight: 1 },
    { label: 'Financial Services', value: 75, weight: 0.95 },
    { label: 'Healthcare', value: 55, weight: 0.9 },
    { label: 'Retail & E-commerce', value: 50, weight: 0.85 },
    { label: 'Professional Services', value: 45, weight: 0.8 },
    { label: 'Manufacturing', value: 40, weight: 0.75 },
    { label: 'Logistics & Supply Chain', value: 31, weight: 0.7 },
    { label: 'Marketing & Media', value: 28, weight: 0.65 },
    { label: 'Energy & Climate', value: 15, weight: 0.6 },
    { label: 'Education', value: 8, weight: 0.55 },
];

const RankingBar: React.FC<{
    label: string;
    value: number;
    delay: number;
    weight: number;
}> = ({ label, value, delay, weight }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const growSpr = spring({
        frame: frame - delay,
        fps,
        config: { damping: 14, mass: 0.8, stiffness: 100 },
    });

    const width = interpolate(growSpr, [0, 1], [0, value]);
    const counter = Math.floor(interpolate(growSpr, [0, 1], [0, value]));

    const isTop3 = weight >= 0.9;
    const isBottom3 = weight <= 0.65;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                marginBottom: '18px',
                opacity: interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp' }),
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    color: isBottom3 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.9)',
                    fontWeight: 500,
                }}
            >
                <span>{label}</span>
                <span style={{ fontWeight: 800, color: isTop3 ? '#2EC4FF' : isBottom3 ? 'rgba(255,255,255,0.5)' : '#fff' }}>
                    {counter}%
                </span>
            </div>
            <div
                style={{
                    height: '10px',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: '5px',
                    position: 'relative',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${width}%`,
                        background: 'linear-gradient(90deg, #1A9FFF 0%, #2EC4FF 100%)',
                        borderRadius: '5px',
                        position: 'relative',
                        opacity: isBottom3 ? 0.6 : 1,
                        boxShadow: isTop3 ? '0 0 15px rgba(46, 196, 255, 0.3)' : 'none',
                    }}
                >
                    {growSpr > 0.9 && (
                        <div
                            style={{
                                position: 'absolute',
                                right: '-4px',
                                top: '-4px',
                                width: '8px',
                                height: '18px',
                                background: '#2EC4FF',
                                boxShadow: '0 0 12px #2EC4FF',
                                borderRadius: '4px',
                                opacity: interpolate(growSpr, [0.9, 1], [0, 1]),
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export const Scene07IndustryRankings: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // Animations
    const headerSpr = spring({
        frame,
        fps,
        config: { damping: 20 },
    });

    const insightPanelSpr = spring({
        frame: frame - 150,
        fps,
        config: { damping: 18 },
    });

    const cameraScale = interpolate(frame, [durationInFrames - 120, durationInFrames], [1, 1.04], {
        extrapolateLeft: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(135deg, #050B18 0%, #0A1F3A 100%)',
                fontFamily: 'Inter, sans-serif',
                transform: `scale(${cameraScale})`,
                overflow: 'hidden',
            }}
        >
            {/* Grid Background */}
            <AbsoluteFill style={{ opacity: 0.05 }}>
                <svg width="100%" height="100%">
                    <pattern id="gridLarge" width="80" height="80" patternUnits="userSpaceOnUse">
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#gridLarge)" />
                </svg>
            </AbsoluteFill>

            {/* Oversized AI Shadow Text */}
            <AbsoluteFill
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                }}
            >
                <div
                    style={{
                        fontSize: '700px',
                        fontWeight: 900,
                        color: '#fff',
                        opacity: 0.04,
                        filter: 'blur(30px)',
                        letterSpacing: '-20px',
                        userSelect: 'none',
                    }}
                >
                    AI
                </div>
            </AbsoluteFill>

            {/* Main Content Container */}
            <AbsoluteFill style={{ padding: '60px 80px' }}>
                {/* Header */}
                <div
                    style={{
                        textAlign: 'center',
                        opacity: headerSpr,
                        transform: `translateY(${interpolate(headerSpr, [0, 1], [20, 0])}px)`,
                        marginBottom: '50px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '14px',
                            fontWeight: 300,
                            color: 'rgba(255, 255, 255, 0.7)',
                            textTransform: 'uppercase',
                            letterSpacing: '4px',
                            marginBottom: '8px',
                        }}
                    >
                        Industry Rankings · 2024–2025
                    </div>
                    <h1 style={{ fontSize: '56px', fontWeight: 800, color: '#fff', margin: 0 }}>
                        Who's Actually Using AI?
                    </h1>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', maxWidth: '800px', margin: '15px auto 0' }}>
                        Adoption rates across 10 industries — from near-universal in tech to barely emerging in education.
                    </p>
                </div>

                <div style={{ display: 'flex', flex: 1, gap: '80px' }}>
                    {/* Left: Ranked Bars */}
                    <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column' }}>
                        {RANKINGS.map((item, i) => (
                            <RankingBar
                                key={item.label}
                                label={item.label}
                                value={item.value}
                                delay={40 + i * 6}
                                weight={item.weight}
                            />
                        ))}
                    </div>

                    {/* Right: Insights Callout Panel */}
                    <div
                        style={{
                            flex: 0.8,
                            opacity: insightPanelSpr,
                            transform: `translateX(${interpolate(insightPanelSpr, [0, 1], [40, 0])}px)`,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            background: 'rgba(255, 255, 255, 0.03)',
                            padding: '40px',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '18px',
                                fontWeight: 700,
                                color: '#2EC4FF',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                marginBottom: '40px',
                            }}
                        >
                            Research Insight
                        </div>

                        {[
                            { value: '88%', label: 'Tech leads adoption' },
                            { value: '11×', label: 'Gap between Tech and Education' },
                            { value: '55→75%', label: 'Gen AI jump (2023→2024)' },
                            { value: '92%', label: 'Increased AI use (12 months)' },
                        ].map((stat, i) => (
                            <div key={i} style={{ marginBottom: '32px' }}>
                                <div style={{ fontSize: '56px', fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                                <div style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 500 }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AbsoluteFill>

            {/* Subtle Vignette */}
            <AbsoluteFill
                style={{
                    background: 'radial-gradient(circle, transparent 60%, rgba(5, 11, 24, 0.4) 100%)',
                    pointerEvents: 'none',
                }}
            />
        </AbsoluteFill>
    );
};
