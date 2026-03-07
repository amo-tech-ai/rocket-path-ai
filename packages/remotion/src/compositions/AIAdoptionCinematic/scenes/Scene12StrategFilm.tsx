import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
    Easing,
    Img,
    staticFile,
} from 'remotion';

const COLORS = {
    warmStone: '#F2F1ED',
    deepCarbon: '#0E1111',
    deepNavy: '#0F2B46',
    emerald: '#1B7F5B',
    kpiGreen: '#2BB673',
    mutedText: '#6B7280',
    divider: 'rgba(15,43,70,0.12)',
    white: '#FFFFFF',
};

const STRATEGIC_MODULES = [
    { id: '01', title: 'AI-Driven Personalization Engines', x: -340, y: -280, category: 'revenue', stat: '+10–30% conversion', iconType: '01.png' },
    { id: '02', title: 'Predictive Demand Intelligence', x: -480, y: -80, category: 'ops', stat: '+20–50% accuracy', iconType: '02.jpg' },
    { id: '03', title: 'Real-Time Fraud Surveillance', x: -480, y: 120, category: 'risk', stat: '30–40% loss reduction', iconType: '03.jpeg' },
    { id: '04', title: 'Autonomous Inventory Optimization', x: -340, y: 320, category: 'ops', stat: '10–20% efficiency', iconType: '04.svg' },
    { id: '05', title: 'Robotic Store Infrastructure', x: 0, y: 380, category: 'ops', stat: 'In-store robotics', iconType: '05.png' },
    { id: '06', title: 'Multimodal Search Optimization', x: 340, y: 320, category: 'revenue', stat: '+15–25% engagement', iconType: '06.svg' },
    { id: '07', title: 'Autonomous Customer Resolution Systems', x: 480, y: 120, category: 'risk', stat: '60–80% automation', iconType: '07.svg' },
    { id: '08', title: 'AI Shopping Orchestration Assistants', x: 480, y: -80, category: 'revenue', stat: 'Context-aware guidance', iconType: '08.png' },
    { id: '09', title: 'Automated Product Taxonomy Systems', x: 340, y: -280, category: 'ops', stat: '70–90% efficiency', iconType: '09.svg' },
    { id: '10', title: 'Algorithmic Pricing Infrastructure', x: 0, y: -380, category: 'revenue', stat: '+2–5% margin', iconType: '10.svg' },
];

const LuxuryCard: React.FC<{
    title: string;
    x: number;
    y: number;
    category: string;
    delay: number;
    highlighted: boolean;
    dimmed: boolean;
    stat?: string;
    iconType: string;
}> = ({ title, x, y, category, delay, highlighted, dimmed, stat, iconType }) => {
    const frame = useCurrentFrame();
    const entry = interpolate(frame, [delay, delay + 15], [0, 1], {
        easing: Easing.bezier(0.33, 1, 0.68, 1),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const opacity = interpolate(entry, [0, 1], [0, dimmed ? 0.35 : 1]);
    const translateY = interpolate(entry, [0, 1], [25, 0]);

    return (
        <div
            style={{
                position: 'absolute',
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                width: '270px',
                minHeight: '200px',
                background: COLORS.white,
                borderRadius: '16px',
                boxShadow: highlighted
                    ? `0 24px 60px rgba(15, 43, 70, 0.18), 0 0 0 4px ${COLORS.emerald}33`
                    : `0 16px 40px rgba(15, 43, 70, 0.08)`,
                border: highlighted ? `3px solid ${COLORS.emerald}` : `1px solid rgba(15, 43, 70, 0.1)`,
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                opacity,
                transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${highlighted ? 1.05 : 1})`,
                transition: 'all 0.5s cubic-bezier(0.33, 1, 0.68, 1)',
                zIndex: highlighted ? 100 : 1,
            }}
        >
            <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.5s ease' }}>
                <Img
                    src={staticFile(`images/bcg-icons/${iconType}`)}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', filter: category === 'risk' ? 'none' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
                />
            </div>

            <div style={{
                marginTop: '18px',
                fontSize: '15px',
                fontWeight: 800,
                color: COLORS.deepNavy,
                lineHeight: 1.2,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                maxWidth: '200px'
            }}>{title}</div>

            {highlighted && stat && (
                <div style={{
                    marginTop: '12px',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: COLORS.kpiGreen,
                    letterSpacing: '0.5px'
                }}>{stat}</div>
            )}
        </div>
    );
};

export const Scene12StrategFilm: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    // Timeline (60s = 1800 frames)
    const tOpening = 0;
    const tTheShift = 120;   // 4s
    const tArchReveal = 360; // 12s
    const tRevenue = 750;    // 25s
    const tOps = 1050;       // 35s
    const tRisk = 1350;      // 45s
    const tFinal = 1560;     // 52s

    const openingOpacity = interpolate(frame, [0, 15, tTheShift - 15, tTheShift], [0, 1, 1, 0]);
    const shiftProgress = interpolate(frame, [tTheShift, tTheShift + 30], [0, 1], { easing: Easing.bezier(0.33, 1, 0.68, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const archProgress = interpolate(frame, [tArchReveal, tArchReveal + 60], [0, 1], { easing: Easing.bezier(0.33, 1, 0.68, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    const isRevenuePhase = frame >= tRevenue && frame < tOps;
    const isOpsPhase = frame >= tOps && frame < tRisk;
    const isRiskPhase = frame >= tRisk && frame < tFinal;
    const isFinalPhase = frame >= tFinal;

    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.warmStone, fontFamily: 'Inter Tight, Inter, sans-serif' }}>

            {/* Grid Background */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: `radial-gradient(${COLORS.divider} 1.5px, transparent 1.5px)`, backgroundSize: '50px 50px' }} />

            {/* SCENE 1: OPENING */}
            {frame < tTheShift && (
                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: '280px', opacity: openingOpacity }}>
                    <h1 style={{ fontSize: '116px', fontWeight: 900, color: COLORS.deepNavy, margin: 0, lineHeight: 0.82, letterSpacing: '-5px' }}>
                        Artificial Intelligence<br />Empowers eCommerce
                    </h1>
                    <div style={{ height: '6px', width: '160px', backgroundColor: COLORS.emerald, marginTop: '36px' }} />
                    <p style={{ fontSize: '20px', fontWeight: 800, color: COLORS.mutedText, textTransform: 'uppercase', letterSpacing: '10px', marginTop: '60px' }}>
                        Strategic Capability Architecture
                    </p>
                </AbsoluteFill>
            )}

            {/* SCENE 2: THE SHIFT */}
            {frame >= tTheShift && frame < tArchReveal && (
                <AbsoluteFill>
                    <div style={{ position: 'absolute', left: 0, top: 0, width: `${50 * shiftProgress}%`, height: '100%', backgroundColor: COLORS.deepCarbon, boxShadow: '20px 0 60px rgba(0,0,0,0.4)', zIndex: 1 }} />
                    <div style={{ position: 'absolute', left: '12%', top: '50%', transform: 'translateY(-50%)', width: '35%', opacity: interpolate(frame, [tTheShift + 25, tTheShift + 40], [0, 1]), zIndex: 2 }}>
                        <p style={{ fontSize: '56px', fontWeight: 500, color: COLORS.white, lineHeight: 1.25, margin: 0, letterSpacing: '-2px' }}>
                            Retail is transitioning from<br /><span style={{ color: COLORS.kpiGreen, fontWeight: 800 }}>experimentation</span> to <span style={{ color: COLORS.kpiGreen, fontWeight: 800 }}>infrastructure.</span>
                        </p>
                    </div>
                    <div style={{ position: 'absolute', right: '12%', top: '55%', transform: 'translateY(-50%)', width: '35%', opacity: interpolate(frame, [tTheShift + 80, tTheShift + 95], [0, 1]) }}>
                        <p style={{ fontSize: '56px', fontWeight: 500, color: COLORS.deepNavy, lineHeight: 1.25, margin: 0, letterSpacing: '-2px' }}>
                            AI is no longer a tool.<br />It is <span style={{ color: COLORS.emerald, fontWeight: 800 }}>core operating architecture.</span>
                        </p>
                    </div>
                </AbsoluteFill>
            )}

            {/* SCENE 3+: ARCHITECTURE */}
            {frame >= tArchReveal && (
                <AbsoluteFill>
                    {/* Overlay Backgrounds */}
                    <div style={{ position: 'absolute', right: 0, top: 0, width: isRevenuePhase ? '560px' : '0', height: '100%', backgroundColor: COLORS.deepCarbon, transition: 'width 0.6s cubic-bezier(0.33, 1, 0.68, 1)', zIndex: 5 }} />
                    <div style={{ position: 'absolute', left: 0, top: 0, width: isOpsPhase ? '560px' : '0', height: '100%', backgroundColor: COLORS.deepCarbon, transition: 'width 0.6s cubic-bezier(0.33, 1, 0.68, 1)', zIndex: 5 }} />
                    <div style={{ position: 'absolute', left: '50%', bottom: '0px', width: isRiskPhase ? '100%' : '0', height: isRiskPhase ? '380px' : '0', transform: 'translateX(-50%)', backgroundColor: COLORS.deepCarbon, transition: 'all 0.6s cubic-bezier(0.33, 1, 0.68, 1)', zIndex: 5 }} />

                    {/* Connector Lines */}
                    <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
                        {STRATEGIC_MODULES.map((mod, i) => {
                            const lineEntry = interpolate(frame, [tArchReveal + 100 + i * 10, tArchReveal + 160 + i * 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                            return (
                                <line
                                    key={i}
                                    x1={width / 2}
                                    y1={height / 2}
                                    x2={width / 2 + mod.x * lineEntry}
                                    y2={height / 2 + mod.y * lineEntry}
                                    stroke={COLORS.divider}
                                    strokeWidth="3"
                                    strokeDasharray="10 10"
                                    opacity={0.4}
                                />
                            );
                        })}
                    </svg>

                    {/* AI HUB */}
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${isFinalPhase ? 1.02 : 1})`, transition: 'transform 0.6s ease-out' }}>
                        <svg width="300" height="300" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="46" fill="none" stroke={COLORS.divider} strokeWidth="12" opacity="0.1" />
                            <circle cx="50" cy="50" r="46" fill="none" stroke={COLORS.emerald} strokeWidth="12" strokeDasharray="289" strokeDashoffset={289 * (1 - archProgress)} strokeLinecap="round" />
                            <circle cx="50" cy="50" r="37" fill="none" stroke={COLORS.deepNavy} strokeWidth="16" opacity={interpolate(frame, [tArchReveal + 30, tArchReveal + 60], [0, 1])} />
                        </svg>
                        <div style={{ position: 'absolute', inset: '45px', borderRadius: '50%', background: COLORS.white, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: interpolate(frame, [tArchReveal + 60, tArchReveal + 80], [0, 1]), boxShadow: '0 30px 60px rgba(15, 43, 70, 0.2)' }}>
                            <span style={{ fontSize: '92px', fontWeight: 900, color: COLORS.deepNavy, letterSpacing: '-6px', lineHeight: 0.9 }}>AI</span>
                        </div>
                    </div>

                    {/* Modules */}
                    {STRATEGIC_MODULES.map((mod, i) => {
                        const isHigh =
                            (isRevenuePhase && mod.category === 'revenue') ||
                            (isOpsPhase && mod.category === 'ops') ||
                            (isRiskPhase && mod.category === 'risk');
                        const isDim = (isRevenuePhase || isOpsPhase || isRiskPhase) && !isHigh;

                        return (
                            <LuxuryCard
                                key={mod.id}
                                title={mod.title}
                                x={mod.x}
                                y={mod.y}
                                category={mod.category}
                                delay={tArchReveal + 180 + i * 60}
                                highlighted={isHigh}
                                dimmed={isDim}
                                stat={mod.stat}
                                iconType={mod.iconType}
                            />
                        );
                    })}

                    {/* Stats Overlays (Revenue) */}
                    {isRevenuePhase && (
                        <div style={{ position: 'absolute', right: '60px', top: '50%', transform: 'translateY(-50%)', width: '440px', textAlign: 'left', color: COLORS.white, zIndex: 200 }}>
                            <p style={{ fontSize: '16px', fontWeight: 800, color: COLORS.kpiGreen, textTransform: 'uppercase', letterSpacing: '8px', marginBottom: '24px' }}>Target Alpha</p>
                            <h2 style={{ fontSize: '74px', fontWeight: 900, color: COLORS.white, margin: 0, lineHeight: 0.8, letterSpacing: '-3px' }}>Revenue<br />Acceleration</h2>
                            <div style={{ height: '6px', width: '100%', backgroundColor: COLORS.kpiGreen, margin: '48px 0' }} />

                            <div style={{ marginBottom: '60px' }}>
                                <div style={{ fontSize: '112px', fontWeight: 900, color: COLORS.kpiGreen, lineHeight: 0.9 }}>+10–30%</div>
                                <div style={{ fontSize: '18px', color: COLORS.mutedText, textTransform: 'uppercase', letterSpacing: '6px', fontWeight: 800, marginTop: '12px' }}>Conversion Uplift</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '112px', fontWeight: 900, color: COLORS.kpiGreen, lineHeight: 0.9 }}>+2–5%</div>
                                <div style={{ fontSize: '18px', color: COLORS.mutedText, textTransform: 'uppercase', letterSpacing: '6px', fontWeight: 800, marginTop: '12px' }}>Margin Expansion</div>
                            </div>
                        </div>
                    )}

                    {/* Ops Phase Overlay */}
                    {isOpsPhase && (
                        <div style={{ position: 'absolute', left: '60px', top: '50%', transform: 'translateY(-50%)', width: '440px', color: COLORS.white, zIKndex: 200 }}>
                            <p style={{ fontSize: '16px', fontWeight: 800, color: COLORS.kpiGreen, textTransform: 'uppercase', letterSpacing: '8px', marginBottom: '24px' }}>Structural Ops</p>
                            <h2 style={{ fontSize: '74px', fontWeight: 900, color: COLORS.white, margin: 0, lineHeight: 0.8, letterSpacing: '-3px' }}>Operational<br />Intelligence</h2>
                            <div style={{ height: '6px', width: '100%', backgroundColor: COLORS.kpiGreen, margin: '48px 0' }} />

                            <p style={{ fontSize: '32px', fontWeight: 500, lineHeight: 1.3, marginBottom: '60px', opacity: 0.95, letterSpacing: '-1px' }}>
                                Optimizing global logistics layers through predictive autonomy at scale.
                            </p>

                            <div style={{ borderLeft: `10px solid ${COLORS.kpiGreen}`, paddingLeft: '40px' }}>
                                <div style={{ fontSize: '24px', color: COLORS.white, fontWeight: 900, marginBottom: '16px', textTransform: 'uppercase' }}>Strategic Pillars</div>
                                <div style={{ fontSize: '28px', color: COLORS.mutedText, fontWeight: 700, marginBottom: '8px' }}>• Automated Precision</div>
                                <div style={{ fontSize: '28px', color: COLORS.mutedText, fontWeight: 700 }}>• Multi-node Scaling</div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    {frame > tArchReveal + 100 && (
                        <div style={{ position: 'absolute', bottom: '60px', left: '80px', color: COLORS.mutedText, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '6px', fontWeight: 800, opacity: 0.85 }}>
                            Analysis: Global Retail Intelligence Survey 2026 | Confidential Board Draft
                        </div>
                    )}
                </AbsoluteFill>
            )}
        </AbsoluteFill>
    );
};
