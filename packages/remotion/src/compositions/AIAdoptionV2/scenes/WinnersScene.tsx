import React from 'react';
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { ActLabel } from '../../../components/SharedUtils';
import { InsightQuote } from './GapScene';

export const ComparisonTable: React.FC<{
    headers: { left: string, right: string };
    headerColors: { left: string, right: string };
    rows: any[];
    rowStagger: number;
}> = ({ headers, headerColors, rows, rowStagger }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <div style={{
            width: '100%',
            padding: '120px 200px 0 200px',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* Headers */}
            <div style={{ display: 'flex', borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: 16 }}>
                <div style={{ flex: 1 }}></div>
                <div style={{ flex: 1, color: headerColors.left, fontSize: 24, fontWeight: 800, textAlign: 'center', letterSpacing: '0.1em' }}>
                    {headers.left}
                </div>
                <div style={{ flex: 1, color: headerColors.right, fontSize: 24, fontWeight: 800, textAlign: 'center', letterSpacing: '0.1em' }}>
                    {headers.right}
                </div>
            </div>

            {/* Rows */}
            {rows.map((row, i) => {
                const delay = i * rowStagger;
                const progress = spring({
                    frame: frame - delay,
                    fps,
                    config: { damping: 200 }
                });

                const opacity = interpolate(progress, [0, 1], [0, 1]);
                const translateY = interpolate(progress, [0, 1], [20, 0]);

                return (
                    <div key={i} style={{
                        display: 'flex',
                        padding: '24px 0',
                        borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        fontSize: 24,
                        opacity,
                        transform: `translateY(${translateY}px)`
                    }}>
                        <div style={{ flex: 1, color: '#94A3B8', fontWeight: 500 }}>
                            {row.dimension}
                        </div>
                        <div style={{ flex: 1, textAlign: 'center', color: headerColors.left, fontWeight: 700 }}>
                            {row.leader}
                        </div>
                        <div style={{ flex: 1, textAlign: 'center', color: headerColors.right, opacity: 0.7 }}>
                            {row.laggard}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export const ProofCards: React.FC<{
    leaders: any[];
    laggards: any[];
    leaderDelay: number;
    laggardDelay: number;
}> = ({ leaders, laggards, leaderDelay, laggardDelay }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <div style={{ display: 'flex', padding: '0 100px', gap: 60, marginTop: 40, width: '100%', alignItems: 'flex-start' }}>

            {/* Leaders Column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {leaders.map((card, i) => {
                    const delay = leaderDelay + (i * 10);
                    const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
                    const slideIn = interpolate(progress, [0, 1], [-50, 0]);
                    const opacity = interpolate(progress, [0, 1], [0, 1]);

                    return (
                        <div key={i} style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderLeft: '4px solid #10B981',
                            padding: '24px 32px',
                            borderRadius: '0 8px 8px 0',
                            opacity,
                            transform: `translateX(${slideIn}px)`
                        }}>
                            <div style={{ color: '#10B981', fontWeight: 800, fontSize: 18, marginBottom: 8, textTransform: 'uppercase' }}>
                                {card.company}
                            </div>
                            <div style={{ color: '#FFFFFF', fontSize: 20, lineHeight: 1.4, fontWeight: 500 }}>
                                {card.result}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Laggards Column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {laggards.map((card, i) => {
                    const delay = laggardDelay + (i * 10);
                    const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
                    const slideIn = interpolate(progress, [0, 1], [50, 0]);
                    const opacity = interpolate(progress, [0, 1], [0, 1]);

                    return (
                        <div key={i} style={{
                            backgroundColor: 'rgba(107, 114, 128, 0.1)',
                            borderRight: '4px solid #6B7280',
                            padding: '24px 32px',
                            borderRadius: '8px 0 0 8px',
                            opacity,
                            transform: `translateX(${slideIn}px)`,
                            textAlign: 'right'
                        }}>
                            <div style={{ color: '#94A3B8', fontSize: 20, fontStyle: 'italic', lineHeight: 1.4 }}>
                                "{card.text}"
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export const WinnersScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#0A1628', fontFamily: 'Inter, sans-serif' }}>
            <Sequence from={0} durationInFrames={30}>
                <ActLabel number="04" title="THE WINNERS" subtitle="Leaders vs Laggards" />
            </Sequence>

            <Sequence from={60}>
                <ComparisonTable
                    headers={{ left: "AI LEADERS", right: "AI LAGGARDS" }}
                    headerColors={{ left: "#10B981", right: "#6B7280" }}
                    rows={[
                        { dimension: "Revenue Growth", leader: "1.5×", laggard: "1.0×" },
                        { dimension: "Shareholder Returns", leader: "1.6×", laggard: "1.0×" },
                        { dimension: "ROIC", leader: "1.4×", laggard: "1.0×" },
                        { dimension: "AI Budget", leader: "$10M+", laggard: "$500K debates" },
                        { dimension: "Approach", leader: "Redesign workflows", laggard: "Bolt on tools" },
                        { dimension: "Team Structure", leader: "Cross-functional pods", laggard: "IT-only" }
                    ]}
                    rowStagger={30}
                />
            </Sequence>

            <Sequence from={240}>
                <ProofCards
                    leaders={[
                        { company: "Klarna", result: "AI replaced 700 FTE of support work" },
                        { company: "Amazon / Microsoft / NVIDIA", result: "50% faster revenue growth" },
                        { company: "BMW", result: "Production planning cut 30-40%" }
                    ]}
                    laggards={[
                        { text: "Bought ChatGPT Enterprise, changed zero processes" },
                        { text: "Investors penalize companies without AI strategy" }
                    ]}
                    leaderDelay={0}
                    laggardDelay={30}
                />
            </Sequence>

            <Sequence from={330}>
                <InsightQuote
                    text="The difference isn't technology — it's approach. Leaders redesign workflows. Laggards buy licenses."
                    position="bottom"
                    fontSize={32}
                />
            </Sequence>
        </AbsoluteFill>
    );
};
