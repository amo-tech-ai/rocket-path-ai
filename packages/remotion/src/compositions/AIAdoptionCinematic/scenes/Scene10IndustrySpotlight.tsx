import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Img,
    staticFile,
} from 'remotion';

const DATA = [
    { rank: 1, label: 'ICT', val: 65, img: 'saas.jpg', quote: 'Copilot writes 46% of code.' },
    { rank: 2, label: 'Financial Services', val: 60, img: 'financial.jpg', quote: 'Fraud detection <1 second.' },
    { rank: 3, label: 'Professional Services', val: 45, img: 'saas.jpg', quote: 'Drafting doc cycles cut 30%.' },
    { rank: 4, label: 'Retail & Consumer Goods', val: 45, img: 'retail.webp', quote: 'Personalization up 15%.' },
    { rank: 5, label: 'Manufacturing', val: 35, img: 'manufacturing.jpg', quote: 'Predictive maintenance saves millions.' },
    { rank: 6, label: 'Healthcare', val: 30, img: 'health.jpg', quote: 'Clinical matching accuracy +20%.' },
    { rank: 7, label: 'Telecommunications', val: 30, img: 'telecom.jpg', quote: 'Network ops automation.' },
    { rank: 8, label: 'Energy / Utilities', val: 30, img: 'manufacturing.jpg', quote: 'Grid optimization algorithms.' },
    { rank: 9, label: 'Transportation & Logistics', val: 25, img: 'manufacturing.jpg', quote: 'Route logic +18% efficiency.' },
    { rank: 10, label: 'Travel & Hospitality', val: 20, img: 'retail.webp', quote: 'Booking AI agents.' },
    { rank: 11, label: 'Construction', val: 12, img: 'manufacturing.jpg', quote: 'BIM modeling automation.' },
];

const BarItemRedux: React.FC<{
    rank: number;
    label: string;
    value: number;
    delay: number;
    active: boolean;
}> = ({ rank, label, value, delay, active }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entry = spring({
        frame: frame - delay,
        fps,
        config: { damping: 14, mass: 0.8 },
    });

    const barWidth = interpolate(entry, [0, 1], [0, value]);
    const counter = Math.floor(interpolate(entry, [0, 1], [0, value]));

    const isTop3 = rank <= 3;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                marginBottom: '8px',
                opacity: interpolate(entry, [0, 1], [0, active ? 1 : 0.4], { extrapolateLeft: 'clamp' }),
                transform: `translateX(${interpolate(entry, [0, 1], [-30, 0])}px)`,
                background: active ? 'rgba(255,255,255,0.02)' : 'transparent',
                padding: '4px 10px',
                borderRadius: '8px',
                borderLeft: active ? '2px solid #2EC4FF' : '2px solid transparent',
            }}
        >
            <div style={{ width: '30px', fontSize: '14px', fontWeight: 800, color: isTop3 ? '#2EC4FF' : 'rgba(255,255,255,0.2)' }}>{rank}</div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontFamily: 'Inter, sans-serif' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>{label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: isTop3 ? '#2EC4FF' : '#fff' }}>{counter}%</span>
                </div>
                <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '3px' }}>
                    <div
                        style={{
                            height: '100%',
                            width: `${barWidth}%`,
                            background: active ? 'linear-gradient(90deg, #1A9FFF 0%, #2EC4FF 100%)' : 'rgba(255,255,255,0.1)',
                            borderRadius: '3px',
                            boxShadow: active ? '0 0 10px rgba(46, 196, 255, 0.2)' : 'none',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export const Scene10IndustrySpotlight: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height, durationInFrames } = useVideoConfig();

    // Timeline: 600 frames (20s)
    // 0-90: Intro
    // 90-540: Rotating Spotlight (each sector gets 40 frames)
    // 540-600: Conclusion

    const introOpacity = interpolate(frame, [0, 20, 70, 90], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const introScale = interpolate(frame, [0, 90], [1, 1.05]);

    // Calculate current highlighted index based on frame during rotation
    const rotateStart = 90;
    const rotateEnd = 540;
    const itemsToShow = DATA.length;
    const framesPerItem = (rotateEnd - rotateStart) / itemsToShow;
    const rawIndex = Math.floor((frame - rotateStart) / framesPerItem);
    const activeIndex = Math.max(0, Math.min(itemsToShow - 1, rawIndex));
    const activeItem = DATA[activeIndex] || DATA[0];

    // Local timing for the spotlight card
    const localStart = rotateStart + activeIndex * framesPerItem;
    const localFrame = frame - localStart;

    const spotlightOpacity = interpolate(localFrame, [0, 10, framesPerItem - 10, framesPerItem], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const spotlightScale = interpolate(localFrame, [0, framesPerItem], [1.1, 1]);
    const spotlightTranslateY = interpolate(localFrame, [0, 20], [30, 0], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: '#050B18', fontFamily: 'Inter, sans-serif' }}>
            {/* BACKGROUND LAYER */}
            <AbsoluteFill>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #050B18 0%, #0B1E3A 100%)' }} />
                <AbsoluteFill style={{ opacity: 0.05 }}>
                    <svg width="100%" height="100%">
                        <pattern id="gridSpotlight" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#gridSpotlight)" />
                    </svg>
                </AbsoluteFill>
            </AbsoluteFill>

            {/* INTRO HERO (0-90) */}
            {frame < 90 && (
                <AbsoluteFill style={{ opacity: introOpacity, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${introScale})` }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 300, color: 'rgba(255,255,255,0.7)', letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '20px' }}>Global Research · 2026</div>
                        <h1 style={{ fontSize: '72px', fontWeight: 800, color: '#fff', margin: 0 }}>Industry Adoption Spectrum</h1>
                        <div style={{ height: '2px', width: '200px', background: '#2EC4FF', margin: '40px auto' }} />
                        <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.5)', maxWidth: '800px', margin: '0 auto' }}>A sector-by-sector analysis of AI deployment and operational readiness.</p>
                    </div>
                </AbsoluteFill>
            )}

            {/* MAIN DASHBOARD (90+) */}
            {frame >= 90 && (
                <AbsoluteFill style={{ display: 'flex', flexDirection: 'row', padding: '60px 80px' }}>
                    {/* LEFT: LEADERBOARD LIST */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingRight: '40px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: 2 }}>Rankings Overview</div>
                        {DATA.map((item, i) => (
                            <BarItemRedux key={item.label} rank={item.rank} label={item.label} value={item.val} delay={rotateStart + i * 2} active={activeIndex === i} />
                        ))}
                    </div>

                    {/* RIGHT: SPOTLIGHT PANEL */}
                    <div style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {/* Animated Border Glow for the Panel */}
                        <div style={{ position: 'absolute', inset: '10px', background: 'radial-gradient(circle, rgba(46, 196, 255, 0.1) 0%, transparent 70%)', filter: 'blur(100px)', opacity: spotlightOpacity }} />

                        <div
                            style={{
                                width: '100%',
                                height: '90%',
                                background: 'rgba(255, 255, 255, 0.02)',
                                backdropFilter: 'blur(30px)',
                                borderRadius: '40px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                padding: '60px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                position: 'relative',
                                overflow: 'hidden',
                                opacity: spotlightOpacity,
                                transform: `translateY(${spotlightTranslateY}px)`,
                            }}
                        >
                            {/* Industry Background Image */}
                            <AbsoluteFill style={{ opacity: 0.3 }}>
                                <Img
                                    src={staticFile(`/images/industries/${activeItem.img}`)}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transform: `scale(${spotlightScale})`,
                                        filter: 'blur(2px) grayscale(50%) brightness(50%)'
                                    }}
                                />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #050B18 0%, transparent 50%)' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #050B18 0%, transparent 50%)' }} />
                            </AbsoluteFill>

                            {/* Content */}
                            <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: '#2EC4FF', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '4px' }}>Sector Spotlight</div>
                                <h1 style={{ fontSize: '72px', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-2px', textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>{activeItem.label}</h1>

                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '30px', margin: '40px 0' }}>
                                    <div style={{ fontSize: '120px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{activeItem.val}%</div>
                                    <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.6)', fontWeight: 500, paddingBottom: '15px' }}>Current Adoption</div>
                                </div>

                                <div style={{ height: '2px', width: '100%', background: 'rgba(255,255,255,0.1)', marginBottom: '30px' }} />

                                <div style={{ fontSize: '28px', color: '#fff', fontStyle: 'italic', fontWeight: 300, opacity: 0.9 }}>
                                    "{activeItem.quote}"
                                </div>
                            </div>
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {/* Suble Vignette Overlay */}
            <AbsoluteFill style={{ background: 'radial-gradient(circle, transparent 70%, rgba(5,11,24,0.6) 100%)', pointerEvents: 'none' }} />
        </AbsoluteFill>
    );
};
