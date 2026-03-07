import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Easing,
} from 'remotion';

const COLORS = {
    warmStone: '#F2F1ED',
    deepCarbon: '#0E1111',
    deepNavy: '#0F2B46',
    emerald: '#1B7F5B',
    kpiGreen: '#2BB673',
    mutedText: '#6B7280',
    divider: 'rgba(15,43,70,0.15)',
    white: '#FFFFFF',
};

const STRATEGIC_MODULES = [
    { id: '01', title: 'AI-Driven Personalization Engines', x: -340, y: -300, category: 'revenue', stat: '+10–30% conversion' },
    { id: '02', title: 'Predictive Demand Intelligence', x: -480, y: -100, category: 'ops', stat: '+20–50% accuracy' },
    { id: '03', title: 'Real-Time Fraud Surveillance', x: -480, y: 100, category: 'risk', stat: '30–40% loss reduction' },
    { id: '04', title: 'Autonomous Inventory Optimization', x: -340, y: 300, category: 'ops', stat: '10–20% efficiency' },
    { id: '05', title: 'Robotic Store Infrastructure', x: 0, y: 380, category: 'ops', stat: 'Checkout automation' },
    { id: '06', title: 'Multimodal Search Optimization', x: 340, y: 300, category: 'revenue', stat: '+15–25% engagement' },
    { id: '07', title: 'Autonomous Customer Resolution Systems', x: 480, y: 100, category: 'risk', stat: '60–80% automation' },
    { id: '08', title: 'AI Shopping Orchestration Assistants', x: 480, y: -100, category: 'revenue', stat: 'Context-aware guidance' },
    { id: '09', title: 'Automated Product Taxonomy Systems', x: 340, y: -300, category: 'ops', stat: '70–90% efficiency' },
    { id: '10', title: 'Algorithmic Pricing Infrastructure', x: 0, y: -380, category: 'revenue', stat: '+2–5% margin' },
];

const ConsultingIcon: React.FC<{ category: string }> = ({ category }) => {
    const stroke = COLORS.deepNavy;
    const accent = COLORS.emerald;

    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {category === 'revenue' && (
                <>
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    <path d="M16 8l2-2 2 2" stroke={accent} />
                </>
            )}
            {category === 'ops' && (
                <>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <path d="M3.29 7L12 12l8.71-5" stroke={accent} />
                </>
            )}
            {category === 'risk' && (
                <>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" stroke={accent} />
                </>
            )}
        </svg>
    );
};

const StrategicCard: React.FC<{
    title: string;
    x: number;
    y: number;
    category: string;
    delay: number;
    highlighted: boolean;
    dimmed: boolean;
}> = ({ title, x, y, category, delay, highlighted, dimmed }) => {
    const frame = useCurrentFrame();
    const entry = interpolate(frame, [delay, delay + 15], [0, 1], {
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const opacity = interpolate(entry, [0, 1], [0, dimmed ? 0.3 : 1]);
    const translateY = interpolate(entry, [0, 1], [10, 0]);

    return (
        <div
            style={{
                position: 'absolute',
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                width: '230px',
                height: '140px',
                background: COLORS.white,
                borderRadius: '8px',
                boxShadow: `0 8px 24px rgba(15, 43, 70, 0.06)`,
                border: `1px solid rgba(15, 43, 70, 0.08)`,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                opacity,
                transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${highlighted ? 1.02 : 1})`,
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease',
                zIndex: highlighted ? 100 : 1,
            }}
        >
            <ConsultingIcon category={category} />
            <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: 600, color: COLORS.deepNavy, lineHeight: 1.25 }}>{title}</div>
        </div>
    );
};

export const Scene11AIEcommerce: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Timeline (90s = 2700 frames)
    const tOpening = 0;
    const tTheShift = 240; // 8s
    const tArchReveal = 540; // 18s
    const tRevenue = 1050; // 35s
    const tOps = 1500; // 50s
    const tRisk = 1950; // 65s
    const tFinal = 2250; // 75s
    const tEnd = 2700; // 90s

    // Transitions
    const openingOpacity = interpolate(frame, [0, 20, tTheShift - 20, tTheShift], [0, 1, 1, 0]);

    const shiftProgress = interpolate(frame, [tTheShift, tTheShift + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const shiftText2Fade = interpolate(frame, [tTheShift + 60, tTheShift + 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    const archProgress = interpolate(frame, [tArchReveal, tArchReveal + 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // Highlights
    const isRevenuePhase = frame >= tRevenue && frame < tOps;
    const isOpsPhase = frame >= tOps && frame < tRisk;
    const isRiskPhase = frame >= tRisk && frame < tFinal;
    const isFinalPhase = frame >= tFinal;

    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.warmStone, fontFamily: 'Inter, sans-serif' }}>

            {/* SCENE 1: OPENING (0-8s) */}
            {frame < tTheShift && (
                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: '200px', opacity: openingOpacity }}>
                    <h1 style={{ fontSize: '84px', fontWeight: 800, color: COLORS.deepNavy, margin: 0, lineHeight: 1, letterSpacing: '-2px' }}>
                        Artificial Intelligence<br />Empowers eCommerce
                    </h1>
                    <p style={{ fontSize: '18px', fontWeight: 500, color: COLORS.mutedText, textTransform: 'uppercase', letterSpacing: '4px', marginTop: '40px' }}>
                        Strategic Capability Architecture
                    </p>
                </AbsoluteFill>
            )}

            {/* SCENE 2: THE SHIFT (8-18s) */}
            {frame >= tTheShift && frame < tArchReveal && (
                <AbsoluteFill>
                    {/* Split Background */}
                    <div style={{ position: 'absolute', left: 0, top: 0, width: `${50 * shiftProgress}%`, height: '100%', backgroundColor: COLORS.deepCarbon }} />

                    {/* Left Content */}
                    <div style={{ position: 'absolute', left: '10%', top: '50%', transform: 'translateY(-50%)', width: '35%', opacity: shiftProgress }}>
                        <p style={{ fontSize: '42px', fontWeight: 400, color: COLORS.white, lineHeight: 1.4, margin: 0 }}>
                            Retail is transitioning from<br /><span style={{ color: COLORS.kpiGreen, fontWeight: 700 }}>experimentation</span> to <span style={{ color: COLORS.kpiGreen, fontWeight: 700 }}>infrastructure.</span>
                        </p>
                    </div>

                    {/* Right Content */}
                    <div style={{ position: 'absolute', right: '10%', top: '50%', transform: 'translateY(-50%)', width: '35%', opacity: shiftText2Fade }}>
                        <p style={{ fontSize: '42px', fontWeight: 400, color: COLORS.deepNavy, lineHeight: 1.4, margin: 0 }}>
                            AI is no longer a tool.<br />It is <span style={{ color: COLORS.emerald, fontWeight: 700 }}>core operating architecture.</span>
                        </p>
                    </div>
                </AbsoluteFill>
            )}

            {/* SCENE 3+: ARCHITECTURE (18s+) */}
            {frame >= tArchReveal && (
                <AbsoluteFill>
                    {/* Background shift for panels during highlights */}
                    <div style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        width: isRevenuePhase ? '450px' : '0',
                        height: '100%',
                        backgroundColor: COLORS.deepCarbon,
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />

                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: isOpsPhase ? '450px' : '0',
                        height: '100%',
                        backgroundColor: COLORS.deepCarbon,
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />

                    {/* Connector Lines */}
                    <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
                        {STRATEGIC_MODULES.map((mod, i) => {
                            const lineEntry = interpolate(frame, [tArchReveal + 150 + i * 20, tArchReveal + 200 + i * 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                            return (
                                <line
                                    key={i}
                                    x1={width / 2}
                                    y1={height / 2}
                                    x2={width / 2 + mod.x * lineEntry}
                                    y2={height / 2 + mod.y * lineEntry}
                                    stroke={COLORS.divider}
                                    strokeWidth="1.5"
                                    strokeDasharray="4 4"
                                    opacity={0.4}
                                />
                            );
                        })}
                    </svg>

                    {/* AI CORE */}
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${isFinalPhase ? 1.02 : 1})`, transition: 'transform 0.8s ease' }}>
                        <svg width="220" height="220" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="48" fill="none" stroke={COLORS.emerald} strokeWidth="1.5" strokeDasharray="301" strokeDashoffset={301 * (1 - archProgress)} />
                            <circle cx="50" cy="50" r="42" fill="none" stroke={COLORS.deepNavy} strokeWidth="3" opacity={interpolate(frame, [tArchReveal + 30, tArchReveal + 60], [0, 1])} />
                        </svg>
                        <div style={{ position: 'absolute', inset: '28px', borderRadius: '50%', background: COLORS.white, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: interpolate(frame, [tArchReveal + 60, tArchReveal + 80], [0, 1]) }}>
                            <span style={{ fontSize: '64px', fontWeight: 800, color: COLORS.deepNavy, letterSpacing: '-2px' }}>AI</span>
                            <span style={{ fontSize: '8px', fontWeight: 700, color: COLORS.mutedText, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '-4px' }}>Core Intelligence Layer</span>
                        </div>
                    </div>

                    {/* Modules */}
                    {STRATEGIC_MODULES.map((mod, i) => {
                        const isHigh =
                            (isRevenuePhase && (mod.id === '01' || mod.id === '10' || mod.id === '06')) ||
                            (isOpsPhase && (mod.id === '04' || mod.id === '02' || mod.id === '09')) ||
                            (isRiskPhase && (mod.id === '03' || mod.id === '07'));

                        const isDim = (isRevenuePhase || isOpsPhase || isRiskPhase) && !isHigh;

                        return (
                            <StrategicCard
                                key={mod.id}
                                title={mod.title}
                                x={mod.x}
                                y={mod.y}
                                category={mod.category}
                                delay={tArchReveal + 250 + i * 150}
                                highlighted={isHigh}
                                dimmed={isDim}
                            />
                        );
                    })}

                    {/* Phase Overlays */}
                    {/* Revenue Phase (Right Panel) */}
                    {isRevenuePhase && (
                        <div style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', width: '370px', textAlign: 'left', color: COLORS.white }}>
                            <h2 style={{ fontSize: '48px', fontWeight: 800, color: COLORS.kpiGreen, margin: 0 }}>Revenue Acceleration</h2>
                            <div style={{ height: '2px', width: '100%', backgroundColor: COLORS.kpiGreen, margin: '24px 0' }} />

                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ fontSize: '64px', fontWeight: 800 }}>+10–30%</div>
                                <div style={{ fontSize: '14px', color: COLORS.mutedText, textTransform: 'uppercase', letterSpacing: '3px' }}>Conversion Uplift</div>
                            </div>

                            <div>
                                <div style={{ fontSize: '64px', fontWeight: 800 }}>+2–5%</div>
                                <div style={{ fontSize: '14px', color: COLORS.mutedText, textTransform: 'uppercase', letterSpacing: '3px' }}>Margin Expansion</div>
                            </div>
                        </div>
                    )}

                    {/* Ops Phase (Left Panel) */}
                    {isOpsPhase && (
                        <div style={{ position: 'absolute', left: '40px', top: '50%', transform: 'translateY(-50%)', width: '370px', color: COLORS.white }}>
                            <h2 style={{ fontSize: '48px', fontWeight: 800, color: COLORS.kpiGreen, margin: 0 }}>Operational Intelligence</h2>
                            <div style={{ height: '2px', width: '100%', backgroundColor: COLORS.kpiGreen, margin: '24px 0' }} />

                            <p style={{ fontSize: '24px', fontWeight: 400, opacity: 0.9, marginBottom: '40px' }}>
                                Automation. Precision. Scalability.
                            </p>

                            {/* Subtle Metric Bars */}
                            <div>
                                {[0.8, 0.65, 0.9].map((val, idx) => (
                                    <div key={idx} style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', marginBottom: '16px', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${val * 100}%`, background: COLORS.kpiGreen, transform: `translateX(${-100 + 100 * interpolate(frame, [tOps + 20, tOps + 50], [0, 1], { extrapolateRight: 'clamp' })}%)` }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Risk Phase */}
                    {isRiskPhase && (
                        <div style={{ position: 'absolute', left: '50%', bottom: '80px', transform: 'translateX(-50%)', textAlign: 'center', width: '800px' }}>
                            <h2 style={{ fontSize: '42px', fontWeight: 800, color: COLORS.emerald, margin: 0 }}>Trust & Risk Infrastructure</h2>
                            <div style={{ height: '2px', width: '200px', backgroundColor: COLORS.kpiGreen, margin: '20px auto' }} />
                            <p style={{ fontSize: '20px', color: COLORS.mutedText }}>Securing the enterprise through real-time surveillance and autonomous resolution.</p>
                        </div>
                    )}

                    {/* Final Frame */}
                    {isFinalPhase && (
                        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '100px', opacity: interpolate(frame, [tFinal, tFinal + 20], [0, 1]) }}>
                            <h2 style={{ fontSize: '56px', fontWeight: 800, color: COLORS.deepNavy, margin: 0 }}>AI Is Now Core Retail Infrastructure</h2>
                            <p style={{ fontSize: '24px', color: COLORS.mutedText, marginTop: '10px' }}>Data → Decisions → Margin</p>
                        </AbsoluteFill>
                    )}

                    {/* Footer */}
                    {frame > tArchReveal + 100 && (
                        <div style={{ position: 'absolute', bottom: '40px', left: '60px', color: COLORS.mutedText, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5 }}>
                            Source: Global AI Retail Survey 2026 | Analysis
                        </div>
                    )}
                </AbsoluteFill>
            )}
        </AbsoluteFill>
    );
};
