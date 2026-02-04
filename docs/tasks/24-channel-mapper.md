# 153 - Channel Mapper

> Map and compare go-to-market channels

---

| Aspect | Details |
|--------|---------|
| **Screens** | ChannelMapper page |
| **Features** | Channel comparison, CAC tracking, priority scoring |
| **Agents** | — |
| **Edge Functions** | — |
| **Use Cases** | Find best acquisition channels |
| **Real-World** | "Founder compares LinkedIn vs Content marketing CAC" |

---

```yaml
---
task_id: 153-CHN
title: Channel Mapper
diagram_ref: —
phase: GROWTH
priority: P2
status: Not Started
skill: /frontend-design
ai_model: —
subagents: [frontend-designer]
edge_function: —
schema_tables: [channel_tests]
depends_on: [151-analytics]
---
```

---

## Description

Build a channel comparison tool to help founders evaluate go-to-market channels. Track CAC, conversion rates, and scalability for each channel. Visualize channel performance to prioritize marketing spend.

## Goals

1. **Primary:** Compare channel effectiveness
2. **Secondary:** Track CAC per channel
3. **Quality:** Real-time metrics

## Acceptance Criteria

- [ ] Add/remove channels to test
- [ ] Track leads, conversions, spend per channel
- [ ] Calculate CAC automatically
- [ ] Rank channels by efficiency
- [ ] Visualize channel comparison
- [ ] Export channel report

---

## Channel Categories

| Category | Examples |
|----------|----------|
| Organic | SEO, Content, Social |
| Paid | Google Ads, Facebook, LinkedIn |
| Outbound | Cold email, Cold calling |
| Community | Events, Forums, Discord |
| Partnerships | Affiliates, Integrations |
| Viral | Referrals, Word of mouth |

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Page | `src/pages/ChannelMapper.tsx` | Create |
| Component | `src/components/channels/ChannelCard.tsx` | Create |
| Component | `src/components/channels/ComparisonChart.tsx` | Create |
| Hook | `src/hooks/useChannels.ts` | Create |
