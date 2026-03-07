import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';

const RANKINGS = [
    { id: '01', label: 'Technology & SaaS', value: 88, weight: 1 },
    { id: '02', label: 'Financial Services', value: 75, weight: 0.95 },
    { id: '03', label: 'Healthcare', value: 55, weight: 0.9 },
    { id: '04', label: 'Retail & E-commerce', value: 50, weight: 0.8 },
    { id: '05', label: 'Professional Services', value: 45, weight: 0.75 },
    { id: '06', label: 'Manufacturing', value: 40, weight: 0.7 },
    { id: '07', label: 'Logistics & Supply Chain', value: 31, weight: 0.65 },
    { id: '08', label: 'Marketing & Media', value: 28, weight: 0.6 },
    { id: '09', label: 'Energy & Climate', value: 15, weight: 0.55 },
    { id: '10', label: 'Education', value: 8, weight: 0.5 },
];

const CinematicBar: React.FC<{
    rank: string;
    label: string;
    value: number;
    delay: number;
    weight: number;
}> = ({ rank, label, value, delay, weight }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const growSpr = spring({
        frame: frame - delay,
        fps,
        config: { damping: 12, mass: 0.8, stiffness: 100 },
    });

    const width = interpolate(growSpr, [0, 1], [0, value]);
    const counter = Math.floor(interpolate(growSpr, [0, 1], [0, value]));

    const isTop3 = parseInt(rank) <= 3;
    const opacity = interpolate(growSpr, [0, 1], [0, weight >= 0.8 ? 1 : 0.6], { extrapolateLeft: 'clamp' });
    const translateX = interpolate(growSpr, [0, 1], [-20, 0]);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                marginBottom: '20px',
                opacity,
                transform: `translateX(${translateX}px)`,
            }}
        >
            {/* Rank Number */}
            <div
                style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: isTop3 ? '#2EC4FF' : 'rgba(255,255,255,0.3)',
                    width: '30px',
                    marginRight: '15px',
                }}
            >
                {rank}
            </div>

            <div style={{ flex: 1 }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: isTop3 ? '20px' : '16px',
                        fontWeight: isTop3 ? 600 : 400,
                        color: '#fff',
                    }}
                >
                    <span>{label}</span>
                    <span style={{ fontWeight: 800, color: isTop3 ? '#2EC4FF' : '#fff', fontSize: isTop3 ? '24px' : '18px' }}>
                        {counter}%
                    </span>
                </div>
                <div
                    style={{
                        height: isTop3 ? '14px' : '8px',
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '7px',
                        position: 'relative',
                        overflow: 'visible',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            width: `${width}%`,
                            background: 'linear-gradient(90deg, #1A9FFF 0%, #2EC4FF 100%)',
                            borderRadius: '7px',
                            position: 'relative',
                            boxShadow: isTop3 ? '0 0 20px rgba(46, 196, 255, 0.3)' : 'none',
                        }}
                    >
                        {growSpr > 0.95 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    right: '-6px',
                                    top: '-6px',
                                    width: '12px',
                                    height: '12px',
                                    background: '#2EC4FF',
                                    boxShadow: '0 0 15px #2EC4FF',
                                    borderRadius: '50%',
                                    opacity: interpolate(growSpr, [0.95, 1], [0, 1]),
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Scene07IndustryRankingsRedux: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height, durationInFrames } = useVideoConfig();

    const cameraPush = interpolate(frame, [durationInFrames - 90, durationInFrames], [1, 1.03], {
        extrapolateLeft: 'clamp',
    });

    const headerSpr = spring({
        frame,
        fps,
        config: { damping: 20 },
    });

    const insightDelay = 180;
    const insightSpr = spring({
        frame: frame - insightDelay,
        fps,
        config: { damping: 18 },
    });

    return (
        <AbsoluteFill style={{ backgroundColor: '#050B18', transform: `scale(${cameraPush})`, overflow: 'hidden' }}>
            {/* Radial Backlight for Top Bar */}
            <div
                style={{
                    position: 'absolute',
                    left: '5%',
                    top: '20%',
                    width: '50%',
                    height: '20%',
                    background: 'radial-gradient(circle, rgba(26, 159, 255, 0.1) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    opacity: interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: 'clamp' }),
                }}
            />

            {/* Background Grid & Particles */}
            <AbsoluteFill style={{ opacity: 0.05 }}>
                <svg width="100%" height="100%">
                    <pattern id="reduxGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#reduxGrid)" />
                </svg>
            </AbsoluteFill>

            {/* Moving Light Sweep across bars */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: interpolate(frame % 150, [0, 150], [-500, width]),
                    width: '150px',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(46, 196, 255, 0.03), transparent)',
                    transform: 'skewX(-25deg)',
                }}
            />

            {/* Main Layout Container */}
            <AbsoluteFill style={{ display: 'flex', flexDirection: 'row', padding: '60px 80px' }}>

                {/* LEFT 60%: Ranked Bars */}
                <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column' }}>
                    {/* Small Label Head */}
                    <div style={{ opacity: headerSpr, marginBottom: '40px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.5)', letterSpacing: '4px', textTransform: 'uppercase' }}>
                            Industry Research · 2026
                        </div>
                        <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#fff', margin: '10px 0' }}>
                            Top 5 Industries by AI Adoption
                        </h1>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '90%' }}>
                        {RANKINGS.map((item, i) => (
                            <CinematicBar
                                key={item.id}
                                rank={item.id}
                                label={item.label}
                                value={item.value}
                                delay={40 + i * 8}
                                weight={item.weight}
                            />
                        ))}
                    </div>
                </div>

                {/* RIGHT 40%: Insight Panel */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div
                        style={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.02)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '30px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            padding: '60px',
                            opacity: insightSpr,
                            transform: `translateY(${interpolate(insightSpr, [0, 1], [40, 0])}px)`,
                        }}
                    >
                        <div style={{ fontSize: '140px', fontWeight: 900, color: '#2EC4FF', lineHeight: 1 }}>88%</div>
                        <div
                            style={{
                                fontSize: '24px',
                                fontWeight: 700,
                                color: '#fff',
                                letterSpacing: '1px',
                                marginBottom: '60px',
                                textTransform: 'uppercase',
                            }}
                        >
                            Tech Leads Adoption
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {[
                                { value: '11× Gap', label: 'vs Education Sector' },
                                { value: '92%', label: 'Increased Enterprise AI Use' },
                                { value: '55→75%', label: 'Gen AI Growth (2024)' },
                            ].map((stat, i) => (
                                <div key={i} style={{ borderLeft: '2px solid rgba(46, 196, 255, 0.4)', paddingLeft: '20px' }}>
                                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AbsoluteFill>

            {/* Subtle Vignette */}
            <AbsoluteFill
                style={{
                    background: 'radial-gradient(circle, transparent 65%, rgba(5, 11, 24, 0.4) 100%)',
                    pointerEvents: 'none',
                }}
            />
        </AbsoluteFill>
    );
};
