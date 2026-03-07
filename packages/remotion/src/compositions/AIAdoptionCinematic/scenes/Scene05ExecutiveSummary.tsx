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

const InsightCard: React.FC<{
    number: string;
    headline: string;
    body: string;
    source: string;
    delay: number;
}> = ({ number, headline, body, source, delay }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entry = spring({
        frame: frame - delay,
        fps,
        config: { damping: 20 },
    });

    const opacity = interpolate(entry, [0, 1], [0, 1]);
    const scale = interpolate(entry, [0, 1], [0.95, 1]);
    const translateY = interpolate(entry, [0, 1], [20, 0]);

    return (
        <div
            style={{
                opacity,
                transform: `scale(${scale}) translateY(${translateY}px)`,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                height: '240px',
                position: 'relative',
                backdropFilter: 'blur(10px)',
            }}
        >
            <div
                style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#2EC4FF',
                    marginBottom: '15px',
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                {number}
            </div>
            <div
                style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: '12px',
                    lineHeight: 1.2,
                }}
            >
                {headline}
            </div>
            <div
                style={{
                    fontSize: '15px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.5,
                    flex: 1,
                }}
            >
                {body}
            </div>
            <div
                style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'rgba(46, 196, 255, 0.5)',
                    marginTop: '15px',
                    fontWeight: 600,
                }}
            >
                {source}
            </div>
        </div>
    );
};

export const Scene05ExecutiveSummary: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // Header Animation
    const headerSpring = spring({
        frame,
        fps,
        config: { damping: 20 },
    });
    const headerOpacity = interpolate(headerSpring, [0, 1], [0, 1]);
    const headerY = interpolate(headerSpring, [0, 1], [20, 0]);

    // Quote Animation (Final 4 seconds)
    const quoteStartFrame = durationInFrames - 120;
    const quoteOpacity = interpolate(frame, [quoteStartFrame, quoteStartFrame + 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // Background darken during quote
    const bgDarken = interpolate(frame, [quoteStartFrame, quoteStartFrame + 30], [1, 0.2], {
        extrapolateLeft: 'clamp',
    });

    const mainContentOpacity = interpolate(frame, [quoteStartFrame, quoteStartFrame + 20], [1, 0], {
        extrapolateLeft: 'clamp',
    });

    return (
        <AbsoluteFill style={{ backgroundColor: '#060C18' }}>
            {/* Background Image Layer */}
            <AbsoluteFill style={{ opacity: 0.15 * bgDarken }}>
                <Img
                    src={staticFile('/images/ai27.jpg')}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: `scale(${interpolate(frame, [0, durationInFrames], [1, 1.1])})`,
                    }}
                />
            </AbsoluteFill>

            {/* Gradient Overlay */}
            <AbsoluteFill
                style={{
                    background: 'linear-gradient(to bottom, transparent, #060C18)',
                    opacity: 0.8,
                }}
            />

            <AbsoluteFill style={{ padding: '80px 100px' }}>
                {/* Section: Header */}
                <div
                    style={{
                        opacity: headerOpacity * mainContentOpacity,
                        transform: `translateY(${headerY}px)`,
                        marginBottom: '60px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontWeight: 600,
                            marginBottom: '8px',
                        }}
                    >
                        Executive Summary · 2026
                    </div>
                    <div
                        style={{
                            fontSize: '54px',
                            fontWeight: 800,
                            color: '#fff',
                            marginBottom: '10px',
                        }}
                    >
                        Four Things You Need to Know
                    </div>
                    <div
                        style={{
                            fontSize: '20px',
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontWeight: 500,
                        }}
                    >
                        AI adoption is accelerating — but scaling remains the bottleneck.
                    </div>
                </div>

                {/* 2x2 Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '30px',
                        opacity: mainContentOpacity,
                    }}
                >
                    <InsightCard
                        number="01"
                        headline="Tipping Point Has Passed"
                        body="76% of global enterprises now deploy AI in at least one core function. Gen AI usage has doubled since 2024. The question is no longer “if” — it is “how fast.”"
                        source="Microsoft AI Economy Institute 2025 / Anthropic Economic Index 2025"
                        delay={30}
                    />
                    <InsightCard
                        number="02"
                        headline="Scaling Is the Bottleneck"
                        body="Only ~30% have moved beyond pilots into production-wide deployment. Enterprise adoption is high — measurable ROI remains uneven. Workflow redesign, not tool access, determines success."
                        source="Microsoft 2025 / BCG longitudinal data"
                        delay={45}
                    />
                    <InsightCard
                        number="03"
                        headline="Leaders Are Pulling Away"
                        body="Top quartile firms report 1.5× revenue growth and 1.6× shareholder returns. They redesign operating models — not just add copilots."
                        source="BCG / Anthropic Economic Index"
                        delay={60}
                    />
                    <InsightCard
                        number="04"
                        headline="Pro Services Is Accelerating"
                        body="AI usage in legal, accounting, and consulting surged in 2025–2026. Agentic AI tools move from experimentation to embedded workflow."
                        source="Thomson Reuters 2026 / Microsoft 2025"
                        delay={75}
                    />
                </div>

                {/* Closing Quote Overlay */}
                <AbsoluteFill
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: quoteOpacity,
                        padding: '0 200px',
                        pointerEvents: 'none',
                    }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                fontSize: '48px',
                                fontWeight: 700,
                                color: '#fff',
                                lineHeight: 1.3,
                                marginBottom: '30px',
                                fontStyle: 'italic',
                            }}
                        >
                            “AI delivers value when workflows change, not when tools are added.”
                        </div>
                        <div
                            style={{
                                fontSize: '20px',
                                letterSpacing: '4px',
                                textTransform: 'uppercase',
                                color: '#2EC4FF',
                                fontWeight: 800,
                            }}
                        >
                            — BCG
                        </div>
                    </div>
                </AbsoluteFill>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
